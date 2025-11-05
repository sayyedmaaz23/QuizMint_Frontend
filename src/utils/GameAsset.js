// src/utils/GameAsset.js
import { ethers } from "ethers";
import {
  GAME_ASSET_ADDRESS,
  GAME_ASSET_ABI
} from "../config";

export async function getGameAssetContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(GAME_ASSET_ADDRESS, GAME_ASSET_ABI, signer);
}

// Get NFT metadata URIs owned by an address
export async function getMyNFTs(address) {
  const contract = await getGameAssetContract();
  const balance = await contract.balanceOf(address);
  const nfts = [];
  for (let i = 0; i < balance; i++) {
    const tokenId = await contract.tokenOfOwnerByIndex(address, i);
    const tokenURI = await contract.tokenURI(tokenId);
    nfts.push({ tokenId: tokenId.toString(), tokenURI });
  }
  return nfts;
}
