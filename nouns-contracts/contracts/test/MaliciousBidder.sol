// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

import {INounsAuctionHouse} from "../interfaces/INounsAuctionHouse.sol";

contract MaliciousBidder {
    function bid(
        INounsAuctionHouse auctionHouse,
        uint256 tokenId,
        uint256 value
    ) public {
        auctionHouse.createBid(tokenId, value);
    }

    receive() external payable {
        assembly {
            invalid()
        }
    }
}
