import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import GameAssetABI from "../abi/GameAsset.json";

const MyAssets = () => {
  const assetAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const loadAssets = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const asset = new ethers.Contract(assetAddress, GameAssetABI.abi, signer);
      const address = await signer.getAddress();

      // simple assumption: iterate first 20 NFTs
      const owned = [];
      for (let i = 1; i <= 20; i++) {
        try {
          const owner = await asset.ownerOf(i);
          if (owner.toLowerCase() === address.toLowerCase()) {
            const uri = await asset.tokenURI(i);
            owned.push({ id: i, uri });
          }
        } catch {}
      }
      setAssets(owned);
    };
    loadAssets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">🎴 My Assets</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assets.length === 0 ? (
          <p className="text-center col-span-3">No NFTs owned.</p>
        ) : (
          assets.map((nft, i) => (
            <div key={i} className="bg-white/10 p-4 rounded-lg shadow-lg text-center">
              <p>NFT #{nft.id}</p>
              <a href={nft.uri} target="_blank" rel="noreferrer" className="text-blue-400 underline">
                View Metadata
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAssets;
