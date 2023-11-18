export const auctionContractAddress = "0x14d9eB937fc751C2c64Ff4add21601085d9E70E3";
export const auctionContractABI = [
  "function createBid(uint256 nounId, uint256 bidValue) external",
  "function auction() view returns (tuple(uint256 nounId, uint256 amount, uint256 startTime, uint256 endTime, address bidder, bool settled))",
  "function settleCurrentAndCreateNewAuction() external",
  "function unpause() external",
  "function pause() external",
  "function endEarlySettleCurrentAndCreateNewAuction() public",
];

export const gloTokenAddr = "0xD9692f1748aFEe00FACE2da35242417dd05a8615";
export const erc20ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
];
