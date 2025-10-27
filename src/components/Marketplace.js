import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import MarketplaceABI from "../abi/Marketplace.json";
import GameAssetABI from "../abi/GameAsset.json";

const Marketplace = () => {
  const marketAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const assetAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const [market, setMarket] = useState(null);
  const [asset, setAsset] = useState(null);
  const [listings, setListings] = useState([]);
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const init = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const m = new ethers.Contract(marketAddress, MarketplaceABI.abi, signer);
      const a = new ethers.Contract(assetAddress, GameAssetABI.abi, signer);
      setMarket(m);
      setAsset(a);
    };
    init();
  }, []);

  const handleList = async () => {
    const tx = await market.listAsset(tokenId, ethers.parseUnits(price, 18));
    await tx.wait();
    alert("NFT listed for sale!");
  };

  const handleBuy = async (id) => {
    const tx = await market.buyAsset(id);
    await tx.wait();
    alert("NFT purchased successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-center">🏪 Marketplace</h1>
      <div className="flex flex-col items-center">
        <input
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="p-2 rounded-lg text-black mb-2"
        />
        <input
          placeholder="Price in QZT"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 rounded-lg text-black mb-2"
        />
        <button
          onClick={handleList}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-bold"
        >
          List NFT
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((nft, i) => (
          <div
            key={i}
            className="bg-white/10 rounded-xl p-4 text-center shadow-md"
          >
            <p>NFT #{nft.id}</p>
            <p>Price: {nft.price} QZT</p>
            <button
              onClick={() => handleBuy(nft.id)}
              className="mt-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
