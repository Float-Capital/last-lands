pragma solidity ^0.8.0;

import "hardhat/console.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {INounsToken} from "./interfaces/INounsToken.sol";

contract Battle {
    uint256 round = 0;
    uint8[202][9] public participants; // Array of 204 participants
    // Just for hackathon
    address public eoaAdmin;
    address public auctionHouse;

    bool public fightIsActive = false;

    IERC20 public gho;

    INounsToken public nouns;

    event BattleResults(uint256 roundNumber, uint8[202] results);

    constructor(IERC20 _gho, INounsToken _nouns) {
        // Initialize the participants array with some values (for example, 1 to 204)
        for (uint8 i = 0; i < participants[0].length; i++) {
            participants[0][i] = i;
        }

        eoaAdmin = tx.origin;

        gho = _gho;
        nouns = _nouns;
    }

    function setAuctionContract(address _auctionHouse) public {
        require(tx.origin == eoaAdmin);

        auctionHouse = _auctionHouse;
    }

    function startFight() public {
        require(msg.sender == auctionHouse);

        fightIsActive = true;
    }

    function getBinaryDigit(
        uint256 blockValue,
        uint8 position
    ) internal pure returns (uint8) {
        // Create a bitmask with a 1 at the specified position
        uint256 bitmask = uint256(1) << position;

        // Use bitwise AND to extract the digit at the specified position
        uint256 digit = (blockValue & bitmask) >> position;

        return uint8(digit);
    }

    function fight() external {
        require(fightIsActive);
        uint8[9] memory numberOfParticipantsInRound = [
            202,
            101,
            51,
            26,
            13,
            7,
            4,
            2,
            1
        ];

        require(
            numberOfParticipantsInRound[round] >= 2,
            "There is alreday a winner"
        );

        bool isEvenMatchoff = numberOfParticipantsInRound[round] % 2 == 0;
        ++round;
        uint256 numberOfBattles = isEvenMatchoff
            ? numberOfParticipantsInRound[round]
            : numberOfParticipantsInRound[round] - 1;

        if (!isEvenMatchoff) {
            // Automatically select first victor
            participants[round][
                numberOfParticipantsInRound[round] - 1
            ] = participants[round - 1][numberOfParticipantsInRound[round] - 1];
        }

        uint256 blockValue = uint256(blockhash(block.number - 1));
        for (uint8 i = 0; i < numberOfBattles; i++) {
            bool whoWon = getBinaryDigit(blockValue, i + 1) == 1;

            // console.log(
            //     "battle between",
            //     participants[round - 1][i],
            //     participants[round - 1][
            //         numberOfParticipantsInRound[round - 1] - i - 1
            //     ]
            // );

            if (whoWon) {
                participants[round][i] = participants[round - 1][i];
            } else {
                participants[round][i] = participants[round - 1][
                    numberOfParticipantsInRound[round - 1] - i - 1
                ];
            }
        }

        emit BattleResults(round, participants[round]);

        if (numberOfParticipantsInRound[round] == 1) {
            address winner = nouns.ownerOf(participants[round][0]);
            sendAllTokensToWinner(winner);
        }
    }

    function sendAllTokensToWinner(address winner) internal {
        uint256 totalBalance = gho.balanceOf(address(this));
        gho.transfer(winner, totalBalance);
    }
}
