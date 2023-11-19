import React from "react";
import Button from "../Button";
import {
  auctionContractABI,
  auctionContractAddress,
  gloTokenAddr,
} from "../Contracts";
import { erc20ABI } from "wagmi";

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
console.log(kips);

// const kips =
//   "0xc4501ab26fd0684ad0ec652f65103563a7bace814a8c2cce09b37fb3cd0d8a67";

const providerURL = "https://sepolia-rpc.scroll.io";
const provider = new ethers.providers.JsonRpcProvider(providerURL);

// Create a Wallet instance from the private key
const wallet = new ethers.Wallet(kips, provider);

// Access the address and other properties of the wallet
const botUserAddress = wallet.address;
// 0xdfAB65bA45B956847efDa3fb6e7190951dFc71dC
const publicKey = wallet.publicKey;

console.log(botUserAddress);

// console.log('Address:', address);
// console.log('Public Key:', publicKey);

// const auctionContractAddress = "0xd90428681D4C4ae73ef4A9A6a47A460935Ba628f";
// const auctionContractAddress = "0xda9B7D45209982bd41805b4B15cbdc1373C03094";
// const auctionContractAddress = "0xEB0b523838f7382324ef0dE2b8f8b6D0b3C3d94c";

const auctionContract = new ethers.Contract(
  auctionContractAddress,
  auctionContractABI,
  wallet
);

const gloContract = new ethers.Contract(gloTokenAddr, erc20ABI, wallet);

export default function (props: any) {
  const [state, updateState] = React.useState(() => {
    return { isActive: false };
  });

  const [actions, updateActions] = React.useState<Array<string>>([]);

  const toggleState = () => {
    updateState({ isActive: !state.isActive });
  };
  const createRandomBid = async () => {
    try {
      console.log("running the function");
      const auction = await auctionContract.auction();
      console.log(auction);
      console.log("Processing auction for ", auction.nounId.toString());

      if (auction.nounId.toString() !== "202") {
        const allowance = await gloContract.allowance(
          botUserAddress,
          auctionContractAddress
        );
        console.log("allowance", allowance.toString());
        const bidAmount = "20000000000000000"; /* 0.02 DAI */
        if (allowance.lt(bidAmount)) {
          updateActions((actions) => {
            actions.push(
              "Allowance too low - increasing to" + allowance.toString()
            );
            return actions;
          });
          console.log("Allowance not enough - approving");
          const allowanceTx = await gloContract.approve(
            auctionContractAddress,
            "10000000000000000000000000000000000"
          );
          await allowanceTx.wait();
          updateActions((actions) => {
            actions.push(`Allowance increased - txHash:${allowanceTx.hash}`);
            return actions;
          });
        }

        const tx = await auctionContract.createBid(auction.nounId, bidAmount, {
          gasLimit: 1000000,
        });
        console.log(`Transaction hash: ${tx.hash}`);
        updateActions((actions) => {
          actions.push(
            `Bid on land #${auction.nounId.toString()} with tx hash ${tx.hash}`
          );
          return actions;
        });
        await tx.wait();

        console.log("Creating test");
        let testTx =
          await auctionContract.endEarlySettleCurrentAndCreateNewAuction({
            gasLimit: 10000000,
          });

        updateActions((actions) => {
          actions.push(
            `Demo purposes force finish auction land #${auction.nounId.toString()} with tx hash ${tx.hash}`
          );
          return actions;
        });

        console.log("test", testTx.hash);
        await testTx.wait();

        // let settleTx = await auctionContract.settleCurrentAndCreateNewAuction({ gasLimit: 10000000 })
        // console.log("Settling auction", settleTx.hash)
        // await settleTx.wait();

        console.log("Creating bid");

        // const tx = await auctionContract.createBid(
        //   1, bidAmount, { gasLimit: 10000000 }
        // );

        console.log("Transaction Hash:", tx.hash);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  React.useEffect(() => {
    const runCreateRandomBidIfActive = async () => {
      if (state.isActive) {
        await createRandomBid();
        if (state.isActive) {
          await runCreateRandomBidIfActive();
        }
      }
    };
    if (state.isActive) {
      runCreateRandomBidIfActive();
    }
  }, [state.isActive]);

  return (
    <div>
      <button onClick={toggleState}>
        <Button loading={false}>
          {state.isActive ? "Active" : "Inactive"}
        </Button>
      </button>
      {actions.map((action, i) => {
        return <div key={i}>{action}</div>;
      })}
    </div>
  );
}
