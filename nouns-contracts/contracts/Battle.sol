pragma solidity ^0.8.0;

contract FightContract {
    uint256 round = 0;
    uint8[9][202] public participants; // Array of 204 participants

    constructor() {
        // Initialize the participants array with some values (for example, 1 to 204)
        for (uint8 i = 0; i < participants[0].length; i++) {
            participants[0][i] = i;
        }
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

        for (uint8 i = 0; i < numberOfBattles; i++) {
            uint256 blockValue = uint256(blockhash(block.number - (i + 1)));
            bool whoWon = uint8(blockValue % 2) == 0;

            if (whoWon) {
                participants[round][i] = participants[round - 1][i];
            } else {
                participants[round][i] = participants[round - 1][
                    numberOfParticipantsInRound[round] - i
                ];
            }
        }
    }
}
