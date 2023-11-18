import { default as NounsAuctionHouseABI } from '../abi/contracts/NounsAuctionHouse.sol/NounsAuctionHouse.json';
import { default as NounsDAOExecutorV2ABI } from '../abi/contracts/governance/NounsDAOExecutorV2.sol/NounsDAOExecutorV2.json';
import { default as NounsDaoDataABI } from '../abi/contracts/governance/data/NounsDAOData.sol/NounsDAOData.json';
import { ChainId, ContractDeployment, ContractNamesDAOV3, DeployedContract } from './types';
import { Interface, parseUnits } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import { Contract, constants } from 'ethers';
import promptjs from 'prompt';

promptjs.colors = false;
promptjs.message = '> ';
promptjs.delimiter = '';

const proxyRegistries: Record<number, string> = {
  // [ChainId.Mainnet]: '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
  // [ChainId.Goerli]: '0x5d44754DE92363d5746485F31280E4c0c54c855c', // ProxyRegistryMock
  // [ChainId.Sepolia]: '0x152E981d511F8c0865354A71E1cb84d0FB318470', // ProxyRegistryMock
};
const ghoContracts: Record<number, string> = {
  // [ChainId.Mainnet]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  // [ChainId.Ropsten]: '0xc778417e063141139fce010982780140aa0cd5ab',
  // [ChainId.Kovan]: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
  // [ChainId.Goerli]: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  // [ChainId.Sepolia]: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
  [ChainId.ScrollSepolia]: '0xd9692f1748afee00face2da35242417dd05a8615'
};
const donationRecipientAddress = '0x66116aeaD1628D9b96F6bAaF02863E4009617e6E'

const NOUNS_ART_NONCE_OFFSET = 4;
const AUCTION_HOUSE_PROXY_NONCE_OFFSET = 9;
const GOVERNOR_N_DELEGATOR_NONCE_OFFSET = 23;

let deploymentKeys: Array<ContractNamesDAOV3> = []

task('deploy-last-lands-reserve-price', 'Deploy all Nouns contracts with short gov times for testing')
  .addFlag('autoDeploy', 'Deploy all contracts without user interaction')
  .addOptionalParam('gho', 'The WETH contract address', '0xd9692f1748afee00face2da35242417dd05a8615', types.string)
  // .addOptionalParam('gho', 'The WETH contract address', undefined, types.string)
  .addOptionalParam('noundersdao', 'The nounders DAO contract address', undefined, types.string)
  .addOptionalParam(
    'auctionTimeBuffer',
    'The auction time buffer (seconds)',
    30 /* 30 seconds */,
    types.int,
  )
  .addOptionalParam(
    'auctionReservePrice',
    'The auction reserve price (wei)',
    1 /* 1 wei */,
    types.int,
  )
  .addOptionalParam(
    'auctionMinIncrementBidPercentage',
    'The auction min increment bid percentage (out of 100)',
    2 /* 2% */,
    types.int,
  )
  .addOptionalParam(
    'auctionDuration',
    'The auction duration (seconds)',
    60 * 2 /* 2 minutes */,
    types.int,
  )
  .addOptionalParam('timelockDelay', 'The timelock delay (seconds)', 60 /* 1 min */, types.int)
  .addOptionalParam(
    'votingPeriod',
    'The voting period (blocks)',
    80 /* 20 min (15s blocks) */,
    types.int,
  )
  .addOptionalParam('votingDelay', 'The voting delay (blocks)', 1, types.int)
  .addOptionalParam(
    'proposalThresholdBps',
    'The proposal threshold (basis points)',
    100 /* 1% */,
    types.int,
  )
  .addOptionalParam(
    'minQuorumVotesBPS',
    'Min basis points input for dynamic quorum',
    1_000,
    types.int,
  ) // Default: 10%
  .addOptionalParam(
    'maxQuorumVotesBPS',
    'Max basis points input for dynamic quorum',
    4_000,
    types.int,
  ) // Default: 40%
  .addOptionalParam('quorumCoefficient', 'Dynamic quorum coefficient (float)', 1, types.float)
  .addOptionalParam(
    'createCandidateCost',
    'Data contract proposal candidate creation cost in wei',
    100000000000000, // 0.0001 ether
    types.int,
  )
  .addOptionalParam(
    'updateCandidateCost',
    'Data contract proposal candidate update cost in wei',
    0,
    types.int,
  )
  .setAction(async (args, { ethers }) => {
    let nounsAuction = new Contract("0xda9B7D45209982bd41805b4B15cbdc1373C03094", NounsAuctionHouseABI, ethers.provider);
    const txResult = await nounsAuction.connect(ethers.provider.getSigner(0)).setReservePrice(parseUnits('0.00000001', 'ether'));
    console.log('Setting reserve price to 0.00000001 ETH', txResult.hash);
    await txResult.wait();
    console.log('Reserve price set to 0.00000001 ETH');
  });
