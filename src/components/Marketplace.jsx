import React, { useEffect, useState } from "react";
import { getListedAssets, buyAsset } from "../utils/MarketPlace";
import { connectWallet, getTokenBalance } from "../utils/QuizToken";

const MarketplacePage = () => {
  const [account, setAccount] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const acc = await connectWallet();
        if (!acc) return;
        setAccount(acc);

        const bal = await getTokenBalance(acc);
        setBalance(bal);

        const listed = await getListedAssets();
        setItems(listed);
      } catch (err) {
        console.error("Marketplace load error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleBuy = async (tokenId, price) => {
    try {
      setLoading(true);
      await buyAsset(tokenId, price);
      alert(`✅ Successfully purchased NFT #${tokenId}!`);
      const updated = await getListedAssets();
      setItems(updated);
      const bal = await getTokenBalance(account);
      setBalance(bal);
    } catch (err) {
      console.error("Purchase failed:", err);
      if (err.code === 4001) alert("❌ Transaction cancelled.");
      else alert("⚠️ Purchase failed. See console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 fade-in">
      <h2 className="text-3xl font-bold text-green-400 text-center mb-4">
        🏪 Marketplace
      </h2>

      <p className="text-center text-gray-400 mb-6">
        Wallet: <span className="text-yellow-400">{account || "Not connected"}</span>
      </p>
      <p className="text-center text-gray-400 mb-8">
        Token Balance: <span className="text-blue-400">{balance}</span> QZT
      </p>

      {loading ? (
        <p className="text-center text-gray-500">Loading marketplace...</p>
      ) : items.length === 0 ? (
        <div className="card text-center mt-8">
          <p className="text-gray-400">No assets are currently listed.</p>
          <p className="text-sm text-gray-500 mt-2">
            Check back later for new NFTs!
          </p>
        </div>
      ) : (
        <div className="market-grid">
          {items.map((item) => (
            <div key={item.tokenId} className="market-item fade-in">
              <img
                src={item.tokenURI?.replace("ipfs://", "https://ipfs.io/ipfs/")}
                alt={`NFT ${item.tokenId}`}
                className="rounded-lg mb-3 w-full h-40 object-cover"
              />
              <p className="text-white font-semibold mb-1">
                NFT #{item.tokenId}
              </p>
              <p className="text-green-400 font-medium mb-3">
                💰 Price: {item.price} QZT
              </p>

              <button
                onClick={() => handleBuy(item.tokenId, item.price)}
                disabled={loading}
                className="btn btn-primary w-full disabled:opacity-50"
              >
                {loading ? "Processing..." : "Buy Now"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
