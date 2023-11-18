import { default as NounsAuctionHouseABI } from "../abi/contracts/NounsAuctionHouse.sol/NounsAuctionHouse.json";
import {
  ChainId,
  ContractDeployment,
  ContractNamesDAOV3,
  DeployedContract,
} from "./types";
import { Interface, parseUnits } from "ethers/lib/utils";
import { task, types } from "hardhat/config";
import { constants } from "ethers";
import promptjs from "prompt";

promptjs.colors = false;
promptjs.message = "> ";
promptjs.delimiter = "";

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
  [ChainId.ScrollSepolia]: "0xd9692f1748afee00face2da35242417dd05a8615",
};
const donationRecipientAddress = "0x66116aeaD1628D9b96F6bAaF02863E4009617e6E";

const NOUNS_ART_NONCE_OFFSET = 4;
const AUCTION_HOUSE_PROXY_NONCE_OFFSET = 9;
const GOVERNOR_N_DELEGATOR_NONCE_OFFSET = 23;

let deploymentKeys: Array<ContractNamesLands> = [];

task(
  "deploy-last-lands",
  "Deploy all Nouns contracts with short gov times for testing"
)
  .addFlag("autoDeploy", "Deploy all contracts without user interaction")
  .addOptionalParam(
    "gho",
    "The WETH contract address",
    "0xd9692f1748afee00face2da35242417dd05a8615",
    types.string
  )
  // .addOptionalParam('gho', 'The WETH contract address', undefined, types.string)
  .addOptionalParam(
    "auctionTimeBuffer",
    "The auction time buffer (seconds)",
    60 /* 60 seconds */,
    types.int
  )
  .addOptionalParam(
    "auctionReservePrice",
    "The auction reserve price (wei)",
    10 /* 1 wei */,
    types.int
  )
  .addOptionalParam(
    "auctionMinIncrementBidPercentage",
    "The auction min increment bid percentage (out of 100)",
    2 /* 2% */,
    types.int
  )
  .addOptionalParam(
    "auctionDuration",
    "The auction duration (seconds)",
    60 * 60 * 24 /* 1 day */,
    types.int
  )
  .addOptionalParam(
    "timelockDelay",
    "The timelock delay (seconds)",
    60 /* 1 min */,
    types.int
  )

  .setAction(async (args, { ethers }) => {
    console.log("args", args);

    // await hre.run("verify:verify", {
    //   "name": "NounsAuctionHouseProxyAdmin", "instance":
    //   {
    //     "interface": {
    //       "fragments":
    //         [{ "name": "OwnershipTransferred", "anonymous": false, "inputs": [{ "name": "previousOwner", "type": "address", "indexed": true, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }, { "name": "newOwner", "type": "address", "indexed": true, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "type": "event", "_isFragment": true }, { "type": "function", "name": "changeProxyAdmin", "constant": false, "inputs": [{ "name": "proxy", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }, { "name": "newAdmin", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "outputs": [], "payable": false, "stateMutability": "nonpayable", "gas": null, "_isFragment": true }, { "type": "function", "name": "getProxyAdmin", "constant": true, "inputs": [{ "name": "proxy", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "outputs": [{ "name": null, "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "payable": false, "stateMutability": "view", "gas": null, "_isFragment": true }, { "type": "function", "name": "getProxyImplementation", "constant": true, "inputs": [{ "name": "proxy", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "outputs": [{ "name": null, "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "payable": false, "stateMutability": "view", "gas": null, "_isFragment": true }, { "type": "function", "name": "owner", "constant": true, "inputs": [], "outputs": [{ "name": null, "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "payable": false, "stateMutability": "view", "gas": null, "_isFragment": true }, { "type": "function", "name": "renounceOwnership", "constant": false, "inputs": [], "outputs": [], "payable": false, "stateMutability": "nonpayable", "gas": null, "_isFragment": true }, { "type": "function", "name": "transferOwnership", "constant": false, "inputs": [{ "name": "newOwner", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "outputs": [], "payable": false, "stateMutability": "nonpayable", "gas": null, "_isFragment": true }, { "type": "function", "name": "upgrade", "constant": false, "inputs": [{ "name": "proxy", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }, { "name": "implementation", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "outputs": [], "payable": false, "stateMutability": "nonpayable", "gas": null, "_isFragment": true }, { "type": "function", "name": "upgradeAndCall", "constant": false, "inputs": [{ "name": "proxy", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }, { "name": "implementation", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }, { "name": "data", "type": "bytes", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "bytes", "_isParamType": true }], "outputs": [], "payable": true, "stateMutability": "payable", "gas": null, "_isFragment": true }], "_abiCoder": { "coerceFunc": null }, "functions": { "changeProxyAdmin(address,address)": { "type": "function", "name": "changeProxyAdmin", "constant": false, "inputs": [{ "name": "proxy", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }, { "name": "newAdmin", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "outputs": [], "payable": false, "stateMutability": "nonpayable", "gas": null, "_isFragment": true }, "getProxyAdmin(address)": { "type": "function", "name": "getProxyAdmin", "constant": true, "inputs": [{ "name": "proxy", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "outputs": [{ "name": null, "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "payable": false, "stateMutability": "view", "gas": null, "_isFragment": true }, "getProxyImplementation(address)": { "type": "function", "name": "getProxyImplementation", "constant": true, "inputs": [{ "name": "proxy", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "outputs": [{ "name": null, "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "payable": false, "stateMutability": "view", "gas": null, "_isFragment": true }, "owner()": { "type": "function", "name": "owner", "constant": true, "inputs": [], "outputs": [{ "name": null, "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "payable": false, "stateMutability": "view", "gas": null, "_isFragment": true }, "renounceOwnership()": { "type": "function", "name": "renounceOwnership", "constant": false, "inputs": [], "outputs": [], "payable": false, "stateMutability": "nonpayable", "gas": null, "_isFragment": true }, "transferOwnership(address)": { "type": "function", "name": "transferOwnership", "constant": false, "inputs": [{ "name": "newOwner", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "outputs": [], "payable": false, "stateMutability": "nonpayable", "gas": null, "_isFragment": true }, "upgrade(address,address)": { "type": "function", "name": "upgrade", "constant": false, "inputs": [{ "name": "proxy", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }, { "name": "implementation", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "outputs": [], "payable": false, "stateMutability": "nonpayable", "gas": null, "_isFragment": true }, "upgradeAndCall(address,address,bytes)": { "type": "function", "name": "upgradeAndCall", "constant": false, "inputs": [{ "name": "proxy", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }, { "name": "implementation", "type": "address", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }, { "name": "data", "type": "bytes", "indexed": null, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "bytes", "_isParamType": true }], "outputs": [], "payable": true, "stateMutability": "payable", "gas": null, "_isFragment": true } }, "errors": {}, "events": { "OwnershipTransferred(address,address)": { "name": "OwnershipTransferred", "anonymous": false, "inputs": [{ "name": "previousOwner", "type": "address", "indexed": true, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }, { "name": "newOwner", "type": "address", "indexed": true, "components": null, "arrayLength": null, "arrayChildren": null, "baseType": "address", "_isParamType": true }], "type": "event", "_isFragment": true } }, "structs": {}, "deploy": { "name": null, "type": "constructor", "inputs": [], "payable": false, "stateMutability": "nonpayable", "gas": null, "_isFragment": true }, "_isInterface": true
    //     },
    //     "provider": "<WrappedHardhatProvider>",
    //     "signer": "<SignerWithAddress 0x8A742a2b32727d05036F6fa6f2896D2336709cdf>", "callStatic": {}, "estimateGas": {},
    //     "functions": {}, "populateTransaction": {}, "filters": {}, "_runningEvents": {}, "_wrappedEmits": {},
    //     "address": "0xB93E112706983B5E6f597f3db4B85C9FE9abBB6d", "resolvedAddress": {},
    //     "deployTransaction": {
    //       "hash": "0xc36ba6075254a20e7f37d2c32076bbfd406b286289cbfccc973e414d10e0bdf7", "type": 0, "accessList": null, "blockHash": null, "blockNumber": null, "transactionIndex": null, "confirmations": 0, "from": "0x8A742a2b32727d05036F6fa6f2896D2336709cdf", "gasPrice": { "type": "BigNumber", "hex": "0x17d78400" }, "gasLimit": { "type": "BigNumber", "hex": "0x06bdb1" }, "to": null, "value": { "type": "BigNumber", "hex": "0x00" }, "nonce": 119, "data": "0x608060405234801561001057600080fd5b5061001a3361001f565b61006f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6106938061007e6000396000f3fe60806040526004361061007b5760003560e01c80639623609d1161004e5780639623609d1461011157806399a88ec414610124578063f2fde38b14610144578063f3b7dead1461016457600080fd5b8063204e1c7a14610080578063715018a6146100bc5780637eff275e146100d35780638da5cb5b146100f3575b600080fd5b34801561008c57600080fd5b506100a061009b366004610499565b610184565b6040516001600160a01b03909116815260200160405180910390f35b3480156100c857600080fd5b506100d1610215565b005b3480156100df57600080fd5b506100d16100ee3660046104bd565b610229565b3480156100ff57600080fd5b506000546001600160a01b03166100a0565b6100d161011f36600461050c565b610291565b34801561013057600080fd5b506100d161013f3660046104bd565b610300565b34801561015057600080fd5b506100d161015f366004610499565b610336565b34801561017057600080fd5b506100a061017f366004610499565b6103b4565b6000806000836001600160a01b03166040516101aa90635c60da1b60e01b815260040190565b600060405180830381855afa9150503d80600081146101e5576040519150601f19603f3d011682016040523d82523d6000602084013e6101ea565b606091505b5091509150816101f957600080fd5b8080602001905181019061020d91906105e2565b949350505050565b61021d6103da565b6102276000610434565b565b6102316103da565b6040516308f2839760e41b81526001600160a01b038281166004830152831690638f283970906024015b600060405180830381600087803b15801561027557600080fd5b505af1158015610289573d6000803e3d6000fd5b505050505050565b6102996103da565b60405163278f794360e11b81526001600160a01b03841690634f1ef2869034906102c990869086906004016105ff565b6000604051808303818588803b1580156102e257600080fd5b505af11580156102f6573d6000803e3d6000fd5b5050505050505050565b6103086103da565b604051631b2ce7f360e11b81526001600160a01b038281166004830152831690633659cfe69060240161025b565b61033e6103da565b6001600160a01b0381166103a85760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b6103b181610434565b50565b6000806000836001600160a01b03166040516101aa906303e1469160e61b815260040190565b6000546001600160a01b031633146102275760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161039f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811681146103b157600080fd5b6000602082840312156104ab57600080fd5b81356104b681610484565b9392505050565b600080604083850312156104d057600080fd5b82356104db81610484565b915060208301356104eb81610484565b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b60008060006060848603121561052157600080fd5b833561052c81610484565b9250602084013561053c81610484565b9150604084013567ffffffffffffffff8082111561055957600080fd5b818601915086601f83011261056d57600080fd5b81358181111561057f5761057f6104f6565b604051601f8201601f19908116603f011681019083821181831017156105a7576105a76104f6565b816040528281528960208487010111156105c057600080fd5b8260208601602083013760006020848301015280955050505050509250925092565b6000602082840312156105f457600080fd5b81516104b681610484565b60018060a01b038316815260006020604081840152835180604085015260005b8181101561063b5785810183015185820160600152820161061f565b506000606082860101526060601f19601f83011685010192505050939250505056fea26469706673582212202b5d68bcba505c8a5b998ba862650bfb9d6e01bd3cdf115cefbd1d448fb3c97b64736f6c63430008130033", "r": "0xef8fb2ec95f1652ebf0290e80ba9bfa5acb2124fe94b5e06d33f76df5d705307", "s": "0x07be259973f063cf60ecb7c4c925b2d85a2146815d2ba445f40531f7b6202c6a", "v": 1068738, "creates": "0xB93E112706983B5E6f597f3db4B85C9FE9abBB6d", "chainId": 534351
    //     },
    //     "_deployedPromise": {},
    //     "constructorArguments": [],
    //     "libraries": {},
    //   },
    //   "address": "0xB93E112706983B5E6f597f3db4B85C9FE9abBB6d",
    //   "contract": "contracts/proxies/NounsAuctionHouseProxyAdmin.sol:NounsAuctionHouseProxyAdmin"
    // });

    // throw "don't continue";

    const network = await ethers.provider.getNetwork();
    const [deployer] = await ethers.getSigners();

    // prettier-ignore
    /// Won't have for scroll sepolia
    const proxyRegistryAddress = proxyRegistries[network.chainId] ?? constants.AddressZero;

    if (!args.gho) {
      const deployedWETHContract = ghoContracts[network.chainId];
      if (!deployedWETHContract) {
        throw new Error(
          `Can not auto-detect WETH contract on chain ${network.name}. Provide it with the --gho arg.`
        );
      }
      args.gho = deployedWETHContract;
    }

    const nonce = await deployer.getTransactionCount();

    // const expectedAuctionHouseProxyAddress = ethers.utils.getContractAddress({
    //   from: deployer.address,
    //   nonce: nonce + AUCTION_HOUSE_PROXY_NONCE_OFFSET,
    // });
    // const expectedNounsDAOProxyAddress = ethers.utils.getContractAddress({
    //   from: deployer.address,
    //   nonce: nonce + GOVERNOR_N_DELEGATOR_NONCE_OFFSET,
    // });
    const deployment: Record<ContractNamesDAOV3, DeployedContract> =
      {} as Record<ContractNamesDAOV3, DeployedContract>;

    const contracts: Record<ContractNamesDAOV3, ContractDeployment> = {
      NounsToken: {
        args: [
          deployer.address, // TODO: pass the right minter address here, is it the auction?
          proxyRegistryAddress,
        ],
      },
      Battle: {
        args: [args.gho, () => deployment.NounsToken.address],
      },
      NounsAuctionHouse: {
        args: [
          () => deployment.NounsToken.address,
          args.gho,
          args.auctionTimeBuffer,
          args.auctionReservePrice,
          args.auctionMinIncrementBidPercentage,
          args.auctionDuration,
          donationRecipientAddress,
          () => deployment.Battle.address,
        ],
        // args: [
        //   () => deployment.NounsAuctionHouse.address,
        //   () => deployment.NounsAuctionHouseProxyAdmin.address,
        //   () => {
        //     return new Interface(NounsAuctionHouseABI).encodeFunctionData(
        //       "initialize",
        //       [
        //         deployment.NounsToken.address,
        //         args.gho,
        //         args.auctionTimeBuffer,
        //         args.auctionReservePrice,
        //         args.auctionMinIncrementBidPercentage,
        //         args.auctionDuration,
        //         donationRecipientAddress,
        //         deployment.Battle.address,
        //       ]
        //     );
        //   },
        // ],
        waitForConfirmation: true,
      },

      // NounsAuctionHouseProxy: {
      //   args: [
      //     () => deployment.NounsAuctionHouse.address,
      //     () => deployment.NounsAuctionHouseProxyAdmin.address,
      //     () => {
      //       return new Interface(NounsAuctionHouseABI).encodeFunctionData(
      //         "initialize",
      //         [
      //           deployment.NounsToken.address,
      //           args.gho,
      //           args.auctionTimeBuffer,
      //           args.auctionReservePrice,
      //           args.auctionMinIncrementBidPercentage,
      //           args.auctionDuration,
      //           donationRecipientAddress,
      //           deployment.Battle.address,
      //         ]
      //       );
      //     },
      //   ],
      //   waitForConfirmation: true,
      //   validateDeployment: () => {
      //     // const expected = expectedAuctionHouseProxyAddress.toLowerCase();
      //     // const actual = deployment.NounsAuctionHouseProxy.address.toLowerCase();
      //     // if (expected !== actual) {
      //     //   throw new Error(
      //     //     `Unexpected auction house proxy address. Expected: ${expected}. Actual: ${actual}.`,
      //     //   );
      //     // }
      //   },
      // },
      // NounsDAOV3DynamicQuorum: {},
      // NounsDAOV3Admin: {},
      // NounsDAOV3Proposals: {},
      // NounsDAOV3Votes: {},
      // NounsDAOV3Fork: {},
      // NounsDAOLogicV3: {
      //   libraries: () => ({
      //     NounsDAOV3Admin: deployment.NounsDAOV3Admin.address,
      //     NounsDAOV3DynamicQuorum: deployment.NounsDAOV3DynamicQuorum.address,
      //     NounsDAOV3Proposals: deployment.NounsDAOV3Proposals.address,
      //     NounsDAOV3Votes: deployment.NounsDAOV3Votes.address,
      //     NounsDAOV3Fork: deployment.NounsDAOV3Fork.address,
      //   }),
      //   waitForConfirmation: true,
      // },
      // NounsDAOForkEscrow: {
      //   args: [expectedNounsDAOProxyAddress, () => deployment.NounsToken.address],
      // },
      // NounsTokenFork: {},
      // NounsAuctionHouseFork: {},
      // NounsDAOLogicV1Fork: {},
      // NounsDAOExecutorV2: {
      //   waitForConfirmation: true,
      // },
      // NounsDAOExecutorProxy: {
      //   args: [
      //     () => deployment.NounsDAOExecutorV2.address,
      //     () =>
      //       new Interface(NounsDAOExecutorV2ABI).encodeFunctionData('initialize', [
      //         expectedNounsDAOProxyAddress,
      //         args.timelockDelay,
      //       ]),
      //   ],
      // },
      // ForkDAODeployer: {
      //   args: [
      //     () => deployment.NounsTokenFork.address,
      //     () => deployment.NounsAuctionHouseFork.address,
      //     () => deployment.NounsDAOLogicV1Fork.address,
      //     () => deployment.NounsDAOExecutorV2.address,
      //     60 * 60 * 24 * 30, // 30 days
      //     36000,
      //     36000,
      //     25,
      //     1000,
      //   ],
      // },
      // NounsDAOProxyV3: {
      //   args: [
      //     () => deployment.NounsDAOExecutorProxy.address, // timelock
      //     () => deployment.NounsToken.address, // token
      //     () => deployment.NounsDAOForkEscrow.address, // forkEscrow
      //     () => deployment.ForkDAODeployer.address, // forkDAODeployer
      //     args.noundersdao || deployer.address, // vetoer
      //     () => deployment.NounsDAOExecutorProxy.address, // admin
      //     () => deployment.NounsDAOLogicV3.address, // implementation
      //     {
      //       votingPeriod: args.votingPeriod,
      //       votingDelay: args.votingDelay,
      //       proposalThresholdBPS: args.proposalThresholdBps,
      //       lastMinuteWindowInBlocks: 0,
      //       objectionPeriodDurationInBlocks: 0,
      //       proposalUpdatablePeriodInBlocks: 0,
      //     }, // DAOParams
      //     {
      //       minQuorumVotesBPS: args.minQuorumVotesBPS,
      //       maxQuorumVotesBPS: args.maxQuorumVotesBPS,
      //       quorumCoefficient: parseUnits(args.quorumCoefficient.toString(), 6),
      //     }, // DynamicQuorumParams
      //   ],
      //   waitForConfirmation: true,
      //   validateDeployment: () => {
      //     const expected = expectedNounsDAOProxyAddress.toLowerCase();
      //     const actual = deployment.NounsDAOProxyV3.address.toLowerCase();
      //     if (expected !== actual) {
      //       throw new Error(
      //         `Unexpected Nouns DAO proxy address. Expected: ${expected}. Actual: ${actual}.`,
      //       );
      //     }
      //   },
      // },
      // NounsDAOData: {
      //   args: [() => deployment.NounsToken.address, expectedNounsDAOProxyAddress],
      //   waitForConfirmation: true,
      // },
      // NounsDAODataProxy: {
      //   args: [
      //     () => deployment.NounsDAOData.address,
      //     () =>
      //       new Interface(NounsDaoDataABI).encodeFunctionData('initialize', [
      //         deployment.NounsDAOExecutorProxy.address,
      //         args.createCandidateCost,
      //         args.updateCandidateCost,
      //         expectedNounsDAOProxyAddress,
      //       ]),
      //   ],
      // },
    };

    for (const [name, contract] of Object.entries(contracts)) {
      let gasPrice = (await ethers.provider.getGasPrice()).mul(2);
      // if (!args.autoDeploy) {
      //   const gasInGwei = Math.round(
      //     Number(ethers.utils.formatUnits(gasPrice, "gwei"))
      //   );

      //   promptjs.start();

      //   const result = await promptjs.get([
      //     {
      //       properties: {
      //         gasPrice: {
      //           type: "integer",
      //           required: true,
      //           description: "Enter a gas price (gwei)",
      //           default: gasInGwei,
      //         },
      //       },
      //     },
      //   ]);
      //   gasPrice = ethers.utils.parseUnits(result.gasPrice.toString(), "gwei");
      // }

      let nameForFactory: string;
      switch (name) {
        case "NounsDAOExecutorV2":
          nameForFactory = "NounsDAOExecutorV2Test";
          break;
        case "NounsDAOLogicV3":
          nameForFactory = "NounsDAOLogicV3Harness";
          break;
        default:
          nameForFactory = name;
          break;
      }

      const factory = await ethers.getContractFactory(nameForFactory, {
        libraries: contract?.libraries?.(),
      });

      const deploymentGas = await factory.signer.estimateGas(
        factory.getDeployTransaction(
          ...(contract.args?.map((a) => (typeof a === "function" ? a() : a)) ??
            []),
          {
            gasPrice,
          }
        )
      );
      const deploymentCost = deploymentGas.mul(gasPrice);

      console.log(
        `Estimated cost to deploy ${name}: ${ethers.utils.formatUnits(
          deploymentCost,
          "ether"
        )} ETH`
      );

      // if (!args.autoDeploy) {
      //   const result = await promptjs.get([
      //     {
      //       properties: {
      //         confirm: {
      //           pattern: /^(DEPLOY|SKIP|EXIT)$/,
      //           description:
      //             'Type "DEPLOY" to confirm, "SKIP" to skip this contract, or "EXIT" to exit.',
      //         },
      //       },
      //     },
      //   ]);
      //   if (result.operation === "SKIP") {
      //     console.log(`Skipping ${name} deployment...`);
      //     continue;
      //   }
      //   if (result.operation === "EXIT") {
      //     console.log("Exiting...");
      //     return;
      //   }
      // }
      console.log(`Deploying ${name}...`);

      const nextNonce = await ethers.provider.getTransactionCount(
        deployer.address
      );
      console.log(`using nonce ${nextNonce}`);

      const deployedContract = await factory.deploy(
        ...(contract.args?.map((a) => (typeof a === "function" ? a() : a)) ??
          []),
        {
          gasPrice,
          nonce: nextNonce,
        }
      );

      if (contract.waitForConfirmation) {
        console.log("wating for deployment");
        await deployedContract.deployed();
      }
      console.log("wating for deployment double");
      await deployedContract.deployed();

      deployment[name as ContractNamesDAOV3] = {
        name: nameForFactory,
        instance: deployedContract,
        address: deployedContract.address,
        constructorArguments:
          contract.args?.map((a) => (typeof a === "function" ? a() : a)) ?? [],
        libraries: contract?.libraries?.() ?? {},
      };

      deploymentKeys.push(name as ContractNamesDAOV3);
      console.log(
        `pushed ${name as ContractNamesDAOV3} to verification array for later`
      );

      contract.validateDeployment?.();

      console.log(`${name} contract deployed to ${deployedContract.address}`);
    }

    // Set the auction house in the battle contract as the last step
    let setAuctionForBattleTx =
      await deployment.Battle.instance.setAuctionContract(
        deployment.NounsAuctionHouse.address
      );
    await setAuctionForBattleTx.wait();
    console.log("set battle acoution contract to auction house");

    const auctionContract =
      deployment.NounsAuctionHouse.instance.connect(deployer);
    const auctionContractAddress = auctionContract.address;
    // await (await auctionContract.unpause()).wait();
    console.log("here");
    const gloTokenAddr = "0xD9692f1748aFEe00FACE2da35242417dd05a8615";
    const erc20ABI = [
      "function approve(address spender, uint256 amount) public returns (bool)",
      "function allowance(address owner, address spender) external view returns (uint256)",
    ];
    const gloContract = new ethers.Contract(
      gloTokenAddr,
      erc20ABI,
      deployer
    ).connect(deployer);

    console.log("here2");
    const bidAmount = "100000000000000000"; /* 0.1 DAI */
    const approveTx = await gloContract.approve(
      auctionContractAddress,
      "10000000000000000000000000000000000"
    );

    console.log("her3");
    await approveTx.wait();
    // await (await auctionContract.unpause()).wait();
    let createAuctionTx = await auctionContract.createAuction({
      gasLimit: 10000000,
    });
    console.log("her4.1");

    await createAuctionTx.wait();

    console.log("her4");

    const bidTx = await auctionContract.createBid(1, bidAmount, {
      gasLimit: 10000000,
    });

    await bidTx.wait();

    // deployment.NounsAuctionHouse.instance.settleCurrentAndCreateNewAuction({
    //   gasLimit: 10000000,
    // });

    console.log("Will run:");
    for (let cName of deploymentKeys) {
      console.log(`// ${cName}
      await hre.run("verify:verify", ${JSON.stringify(
        deployment[cName as ContractNamesDAOV3]
      )});`);
    }

    // Actual run
    for (let cName of deploymentKeys) {
      console.log(`// running verify for ${cName}`);

      // console.log(`await hre.run("verify:verify", ${JSON.stringify(deployment[cName as ContractNamesDAOV3])});`)

      if (cName == "NounsAuctionHouseProxyAdmin") {
        await hre.run("verify:verify", {
          ...deployment[cName as ContractNamesDAOV3],
          contract:
            "contracts/proxies/NounsAuctionHouseProxyAdmin.sol:NounsAuctionHouseProxyAdmin",
        });
      } else {
        await hre.run("verify:verify", deployment[cName as ContractNamesDAOV3]);
      }
    }
    return deployment;
  });
