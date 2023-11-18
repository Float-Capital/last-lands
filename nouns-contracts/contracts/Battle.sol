pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Battle {
    uint256 round = 0;
    uint8[202][9] public participants; // Array of 204 participants

    constructor() {
        // Initialize the participants array with some values (for example, 1 to 204)
        for (uint8 i = 0; i < participants[0].length; i++) {
            participants[0][i] = i;
        }
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
    }
}
