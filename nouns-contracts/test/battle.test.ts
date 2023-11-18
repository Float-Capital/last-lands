import { ethers, waffle } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Battle, Battle__factory } from '../typechain';

export type TestSigners = {
  deployer: SignerWithAddress;
  account0: SignerWithAddress;
  account1: SignerWithAddress;
  account2: SignerWithAddress;
};
export const getSigners = async (): Promise<TestSigners> => {
  const [deployer, account0, account1, account2] = await ethers.getSigners();
  return {
    deployer,
    account0,
    account1,
    account2,
  };
};
export const deployBattle = async (deployer?: SignerWithAddress): Promise<Battle> => {
  const factory = new Battle__factory(deployer || (await getSigners()).deployer);

  return factory.deploy();
};

describe.only('FightContract', function () {
  let fightContract: Battle;

  beforeEach(async () => {
    fightContract = await deployBattle();
  });

  it('should deploy the FightContract', async function () {
    expect(fightContract.address).to.not.be.undefined;
  });

  it('should run battles and log the result', async function () {
    const numberOfBattles = 8;
    const numberOfParticipantsInRound = [202, 101, 51, 26, 13, 7, 4, 2, 1];

    // for (let i = 0; i < 1; i++) {
    for (let i = 0; i < numberOfBattles; i++) {
      await fightContract.fight({ gasLimit: 10000000 });

      const winners = []
      for (let j = 0; j < numberOfParticipantsInRound[i + 1]; j++) {
        const winner = await fightContract.participants(i + 1, j);
        winners.push(winner);
      }

      console.log(`Round ${i + 1} Winners: ${winners.join(', ')}`);
    }
  });
});
