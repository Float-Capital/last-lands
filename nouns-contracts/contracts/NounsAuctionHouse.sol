// SPDX-License-Identifier: GPL-3.0

/// @title The Nouns DAO auction house

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░██░░░████░░██░░░████░░░ *
 * ░░██████░░░████████░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 *********************************/

// LICENSE
// NounsAuctionHouse.sol is a modified version of Zora's AuctionHouse.sol:
// https://github.com/ourzora/auction-house/blob/54a12ec1a6cf562e49f0a4917990474b11350a2d/contracts/AuctionHouse.sol
//
// AuctionHouse.sol source code Copyright Zora licensed under the GPL-3.0 license.
// With modifications by Nounders DAO.

pragma solidity ^0.8.6;

import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {INounsAuctionHouse} from "./interfaces/INounsAuctionHouse.sol";
import {INounsToken} from "./interfaces/INounsToken.sol";

import "hardhat/console.sol";

contract NounsAuctionHouse is
    INounsAuctionHouse,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    OwnableUpgradeable
{
    uint256 constant maxNounId = 206;

    // The Nouns ERC721 token contract
    INounsToken public nouns;

    // The address of the WETH contract
    address public paymentToken;

    // The minimum amount of time left in an auction after a new bid is created
    uint256 public timeBuffer;

    // The minimum price accepted in an auction
    uint256 public reservePrice;

    // The minimum percentage difference between the last bid amount and the current bid
    uint8 public minBidIncrementPercentage;

    // The duration of a single auction
    uint256 public duration;

    // The active auction
    INounsAuctionHouse.Auction public auction;

    /**
     * @notice Initialize the auction house and base contracts,
     * populate configuration values, and pause the contract.
     * @dev This function can only be called once.
     */
    function initialize(
        INounsToken _nouns,
        address _paymentToken,
        uint256 _timeBuffer,
        uint256 _reservePrice,
        uint8 _minBidIncrementPercentage,
        uint256 _duration
    ) external initializer {
        __Pausable_init();
        __ReentrancyGuard_init();
        __Ownable_init();

        _pause();

        nouns = _nouns;
        paymentToken = _paymentToken;
        timeBuffer = _timeBuffer;
        reservePrice = _reservePrice;
        minBidIncrementPercentage = _minBidIncrementPercentage;
        duration = _duration;
    }

    /**
     * @notice Settle the current auction, mint a new Noun, and put it up for auction.
     */
    function settleCurrentAndCreateNewAuction()
        public
        override
        nonReentrant
        whenNotPaused
    {
        _settleAuction();
        _createAuction();
    }

    /**
     * @notice Settle the current auction.
     * @dev This function can only be called when the contract is paused.
     */
    function settleAuction() external override whenPaused nonReentrant {
        _settleAuction();
    }

    /**
     * @notice Create a bid for a Noun, with a given amount.
     * @dev This contract only accepts payment in ETH.
     */
    function createBid(
        uint256 nounId,
        uint256 bidValue
    ) external override nonReentrant {
        _recievePaymentToken(bidValue);

        INounsAuctionHouse.Auction memory _auction = auction;

        require(_auction.nounId == nounId, "Noun not up for auction");
        require(block.timestamp < _auction.endTime, "Auction expired");
        require(bidValue >= reservePrice, "Must send at least reservePrice");
        require(
            bidValue >=
                _auction.amount +
                    ((_auction.amount * minBidIncrementPercentage) / 100),
            "Must send more than last bid by minBidIncrementPercentage amount"
        );

        address lastBidder = _auction.bidder;

        // Refund the last bidder, if applicable
        if (lastBidder != address(0)) {
            _safeTransferPaymentToken(lastBidder, _auction.amount);
        }

        auction.amount = bidValue;
        auction.bidder = msg.sender;

        // Extend the auction if the bid was received within `timeBuffer` of the auction end time
        bool extended = _auction.endTime - block.timestamp < timeBuffer;
        if (extended) {
            auction.endTime = _auction.endTime = block.timestamp + timeBuffer;
        }

        emit AuctionBid(_auction.nounId, msg.sender, bidValue, extended);

        if (extended) {
            emit AuctionExtended(_auction.nounId, _auction.endTime);
        }
    }

    /**
     * @notice Pause the Nouns auction house.
     * @dev This function can only be called by the owner when the
     * contract is unpaused. While no new auctions can be started when paused,
     * anyone can settle an ongoing auction.
     */
    function pause() external override onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the Nouns auction house.
     * @dev This function can only be called by the owner when the
     * contract is paused. If required, this function will start a new auction.
     */
    function unpause() external override onlyOwner {
        _unpause();

        if (auction.startTime == 0 || auction.settled) {
            _createAuction();
        }
    }

    /**
     * @notice Set the auction time buffer.
     * @dev Only callable by the owner.
     */
    function setTimeBuffer(uint256 _timeBuffer) external override onlyOwner {
        timeBuffer = _timeBuffer;

        emit AuctionTimeBufferUpdated(_timeBuffer);
    }

    /**
     * @notice Set the auction reserve price.
     * @dev Only callable by the owner.
     */
    function setReservePrice(
        uint256 _reservePrice
    ) external override onlyOwner {
        reservePrice = _reservePrice;

        emit AuctionReservePriceUpdated(_reservePrice);
    }

    /**
     * @notice Set the auction minimum bid increment percentage.
     * @dev Only callable by the owner.
     */
    function setMinBidIncrementPercentage(
        uint8 _minBidIncrementPercentage
    ) external override onlyOwner {
        minBidIncrementPercentage = _minBidIncrementPercentage;

        emit AuctionMinBidIncrementPercentageUpdated(
            _minBidIncrementPercentage
        );
    }

    /**
     * @notice Create an auction.
     * @dev Store the auction details in the `auction` state variable and emit an AuctionCreated event.
     * If the mint reverts, the minter was updated without pausing this contract first. To remedy this,
     * catch the revert and pause this contract.
     */
    function _createAuction() internal {
        try nouns.mint() returns (uint256 nounId) {
            if (nounId <= maxNounId) {
                uint256 startTime = block.timestamp;
                uint256 endTime = startTime + duration;

                auction = Auction({
                    nounId: nounId,
                    amount: 0,
                    startTime: startTime,
                    endTime: endTime,
                    bidder: payable(0),
                    settled: false
                });

                emit AuctionCreated(nounId, startTime, endTime);
            } else {
                emit AuctionPeriodOver();
                _pause();
            }
        } catch Error(string memory) {
            _pause();
        }
    }

    function bringAuctionEndEarly() public onlyOwner {
        require(
            auction.startTime < block.timestamp,
            "Auction has already begun"
        );
        require(auction.startTime != 0, "Auction hasn't begun");
        auction.endTime = block.timestamp - 1;
    }

    function endEarlySettleCurrentAndCreateNewAuction() public onlyOwner {
        bringAuctionEndEarly();
        settleCurrentAndCreateNewAuction();
    }

    /**
     * @notice Settle an auction, finalizing the bid and paying out to the owner.
     * @dev If there are no bids, the Noun is burned.
     */
    function _settleAuction() internal {
        INounsAuctionHouse.Auction memory _auction = auction;

        require(_auction.startTime != 0, "Auction hasn't begun");
        require(!_auction.settled, "Auction has already been settled");
        require(
            block.timestamp >= _auction.endTime,
            "Auction hasn't completed"
        );

        auction.settled = true;

        if (_auction.bidder == address(0)) {
            nouns.burn(_auction.nounId);
        } else {
            nouns.transferFrom(address(this), _auction.bidder, _auction.nounId);
        }

        if (_auction.amount > 0) {
            _safeTransferPaymentTokenOut(owner(), _auction.amount);
        }

        emit AuctionSettled(_auction.nounId, _auction.bidder, _auction.amount);
    }

    /**
     * @notice Transfer ETH. If the ETH transfer fails, wrap the ETH and try send it as WETH.
     */
    function _safeTransferPaymentToken(address to, uint256 amount) internal {
        // TODO: this isn't a 'safe' tranfer
        IERC20(paymentToken).transferFrom(msg.sender, to, amount);
    }

    function _safeTransferPaymentTokenOut(address to, uint256 amount) internal {
        // TODO: this isn't a 'safe' tranfer
        IERC20(paymentToken).transfer(to, amount);
    }

    function _recievePaymentToken(uint256 amount) internal {
        bool success = IERC20(paymentToken).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(
            success,
            "NounsAuctionHouseFork: payment token transfer failed"
        );
    }
}
