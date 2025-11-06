import { ethers } from "ethers";
import {
  MARKETPLACE_ADDRESS,
  MARKETPLACE_ABI,
  QUIZ_TOKEN_ADDRESS,
  QUIZ_TOKEN_ABI,
  GAME_ASSET_ADDRESS,
  GAME_ASSET_ABI,
} from "../config";

/* ----------------------------- CONTRACT HELPERS ----------------------------- */
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

export async function getGameAssetContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(GAME_ASSET_ADDRESS, GAME_ASSET_ABI, signer);
}

/* ----------------------------- FETCH LISTED ASSETS ----------------------------- */
export async function getListedAssets() {
  const market = await getMarketplaceContract();
  const asset = await getGameAssetContract();
  const listed = [];

  for (let id = 0; id < 50; id++) {
    try {
      const data = await market.listings(id);
      if (data.active) {
        const uri = await asset.tokenURI(id);
        listed.push({
          tokenId: id,
          price: ethers.formatUnits(data.price, 18),
          tokenURI: uri,
        });
      }
    } catch {
      continue;
    }
  }

  return listed;
}

/* ----------------------------- BUY ASSET ----------------------------- */
export async function buyAsset(tokenId, priceQZT) {
  try {
    const market = await getMarketplaceContract();
    const quizToken = await getQuizTokenContract();

    // 1️⃣ Approve marketplace to spend buyer’s QZT
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
      alert("❌ Transaction cancelled by user.");
    } else {
      console.error("Transaction failed:", error);
      alert("⚠️ Something went wrong while buying the NFT.");
    }
  }
}


// df57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e
// APIkey-3beda39b04ada128fd96
// APISecret-719c6b6ff3160c1163487fbc5eae0348adf0696b42e3543cfd28f6b22c12602f

// JWT-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzODMxMzk0NS01NWEzLTRiZTgtODg1Ny1iZjVkNGY1MjMxMWIiLCJlbWFpbCI6InNheXllZG1hYXpzbTVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjNiZWRhMzliMDRhZGExMjhmZDk2Iiwic2NvcGVkS2V5U2VjcmV0IjoiNzE5YzZiNmZmMzE2MGMxMTYzNDg3ZmJjNWVhZTAzNDhhZGYwNjk2YjQyZTM1NDNjZmQyOGY2YjIyYzEyNjAyZiIsImV4cCI6MTc5MzkyNzQ5NH0.utYJ-am56xfiXPq_0ZyL11n1g1sQvOvfFMvRl3PNPEg