# eth-istanbul-countries

The project is split into 4 applications 

1. The contracts 
1. The UI
1. The indexer
1. The docs

## The contracts 
The Land issuance & auction contract is from a fork from NounsDAO that has been stripped to what was needed, made non upgradable and modified to support payment in GHO token an erc-20 token rather than the native network token. We also implemented the Battle contract which is the game play after the auction/collection period has come to an end.

### Contract addresses - Scoll sepolia

- AuctionHouse [0x14d9eB937fc751C2c64Ff4add21601085d9E70E3](https://sepolia.scrollscan.com/address/0x14d9eB937fc751C2c64Ff4add21601085d9E70E3) 
- BattleContract [0xb402DF175140642e39c2B578947622cfDE3FdbF](https://sepolia.scrollscan.com/address/0xb402DF175140642e39c2B578947622cfDE3FdbF)
- LandToken  [0xDA27C0D5002DeCd0e3DF8C406F75ad74e4f96ED7](https://sepolia.scrollscan.com/address/0xDA27C0D5002DeCd0e3DF8C406F75ad74e4f96ED7)


## The UI 
This was built in React / NextJS in typescript using a mapping library and ethers / wagmi for interacting with the blockchain. The demo simulator is a visualisation coded leveraging frames and replicating the logic in the smart contracts for gameplay.

## The indexer 
The indexer is an envio indexer and is used to track which Lands have been minted from the auction.

## The docs
The docs are built with Docusaurus

## The presentation deck can be found here
[**Presentation deck**](https://docs.google.com/presentation/d/1QVZTLv0xdGNLfktdzUU-S07cI5fK6HfABocyB-_h8-8/edit?usp=sharing)
