// src/utils/Marketplace.js
import { ethers } from "ethers";
import {
  MARKETPLACE_ADDRESS,
  MARKETPLACE_ABI,
  QUIZ_TOKEN_ADDRESS,
  QUIZ_TOKEN_ABI
} from "../config";

export async function getMarketplaceContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);
}

export async function getQuizTokenContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(QUIZ_TOKEN_ADDRESS, QUIZ_TOKEN_ABI, signer);
}

// Fetch listed NFTs (tokenId, price, active)
export async function getListedAssets() {
  const market = await getMarketplaceContract();
  const listed = [];
  for (let id = 1; id <= 10; id++) {
    try {
      const data = await market.listings(id);
      if (data.active) {
        listed.push({
          tokenId: id,
          price: ethers.formatUnits(data.price, 18)
        });
      }
    } catch (e) {
      break;
    }
  }
  return listed;
}



export async function buyAsset(tokenId, priceQZT) {
  try {
    const market = await getMarketplaceContract();
    const quizToken = await getQuizTokenContract();

    // 1️⃣ Approve tokens
    const approveTx = await quizToken.approve(
      MARKETPLACE_ADDRESS,
      ethers.parseUnits(priceQZT, 18)
    );
    await approveTx.wait();

    // 2️⃣ Buy NFT
    const buyTx = await market.buyAsset(tokenId);
    await buyTx.wait();

    alert(`✅ Successfully bought NFT #${tokenId}`);

  } catch (error) {
    if (error.code === 4001) {
      // User rejected transaction
      alert("❌ Transaction cancelled by user.");
    } else {
      console.error("Transaction failed:", error);
      alert("⚠️ Something went wrong while buying the NFT.");
    }
  }
}


// Buy NFT from owner
// export async function buyAsset(tokenId, priceQZT) {
//   const market = await getMarketplaceContract();
//   const quizToken = await getQuizTokenContract();

//   // First approve token transfer
//   const approveTx = await quizToken.approve(MARKETPLACE_ADDRESS, ethers.parseUnits(priceQZT, 18));
//   await approveTx.wait();

//   // Then buy NFT
//   const buyTx = await market.buyAsset(tokenId);
//   await buyTx.wait();

//   alert(`Successfully bought NFT #${tokenId}`);
// }
