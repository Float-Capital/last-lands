import React from "react";

const ethers = require("ethers");

// key hidden in plain sight
const frag = "ea11f";
const fragm = "f25e02cae8cf5abb5";
const fragme = "462";
const fragmen = "6069";
const fragment = "b56";
const kips =
  "0x" +
  "a163" +
  "d9f" +
  frag +
  "8a974c" +
  "c83e1f589512" +
  fragm +
  "6b" +
  fragme +
  "99" +
  fragmen +
  "66" +
  fragment +
  "5";

const providerURL = "https://sepolia-rpc.scroll.io";
const provider = new ethers.providers.JsonRpcProvider(providerURL);

// Create a Wallet instance from the private key
const wallet = new ethers.Wallet(kips, provider);

// Access the address and other properties of the wallet
const botUserAddress = wallet.address;
// 0xdfAB65bA45B956847efDa3fb6e7190951dFc71dC
const publicKey = wallet.publicKey;

// console.log('Address:', address);
// console.log('Public Key:', publicKey);

const auctionContractAddress = "0xda9B7D45209982bd41805b4B15cbdc1373C03094";
const auctionContractABI = [
  "function createBid(uint256 nounId, uint256 bidValue) external",
  "function auction() view returns (tuple(uint256 nounId, uint256 amount, uint256 startTime, uint256 endTime, address bidder, bool settled))",
  "function settleCurrentAndCreateNewAuction() external"
];

const auctionContract = new ethers.Contract(
  auctionContractAddress,
  auctionContractABI,
  wallet
);

const gloTokenAddr = "0xD9692f1748aFEe00FACE2da35242417dd05a8615";
const erc20ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
];
const gloContract = new ethers.Contract(gloTokenAddr, erc20ABI, wallet);

export default function (props: any) {
  const [state, updateState] = React.useState(() => {
    return { isActive: true };
  });

  const toggleState = () => {
    updateState({ isActive: !state.isActive });
  };
  const createRandomBid = async () => {
    try {
      console.log("running the function");
      const auction = await auctionContract.auction();
      console.log(auction);
      
      const allowance = await gloContract.allowance(botUserAddress, auctionContractAddress);
      console.log("allowance", allowance.toString())
      const bidAmount = "100000000000000000" /* 0.1 DAI */
      if (allowance.lt(bidAmount)) {
        await console.log("Allowance not enough - approving")
        gloContract.approve(auctionContractAddress, "10000000000000000000000000000000000");
      }

      let settleTx = await auctionContract.settleCurrentAndCreateNewAuction({ gasLimit: 10000000 })
      console.log("Settling auction", settleTx.hash)
      await settleTx.wait();

      console.log("Creating bid")

      const tx = await auctionContract.createBid(
        1, bidAmount, { gasLimit: 10000000 }
      );
      console.log(`Transaction hash: ${tx.hash}`);
      await tx.wait();

      console.log("Transaction Hash:", tx.hash);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  React.useEffect(() => {
    createRandomBid();
    // while (state.isActive) {
    // }
  }, [state.isActive]);

  return (
    <div>
      <button onClick={toggleState}>
        {state.isActive ? "Active" : "Inactive"}
      </button>
    </div>
  );
}
