import React, { useEffect, useState } from "react";
import { connectWallet } from "../utils/QuizToken";
import { getMyNFTs } from "../utils/GameAsset";

const MyAssets = () => {
  const [account, setAccount] = useState("");
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const acc = await connectWallet();
        if (!acc) return;
        setAccount(acc);

        const owned = await getMyNFTs(acc);
        setNfts(owned);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 fade-in">
      <h2 className="text-3xl font-bold text-green-400 text-center mb-4">
        🖼️ My Assets
      </h2>
      <p className="text-gray-400 text-center mb-6">
        Connected Wallet:{" "}
        <span className="text-yellow-400">{account || "Not connected"}</span>
      </p>

      {loading ? (
        <p className="text-center text-gray-500">Loading your NFTs...</p>
      ) : nfts.length === 0 ? (
        <div className="card text-center mt-8">
          <p className="text-gray-400">You don’t own any NFTs yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Buy one from the Marketplace to get started!
          </p>
        </div>
      ) : (
        <div className="market-grid">
          {nfts.map((nft) => (
            <div key={nft.tokenId} className="market-item fade-in">
              <img
                src={nft.tokenURI?.replace("ipfs://", "https://ipfs.io/ipfs/")}
                alt={`NFT ${nft.tokenId}`}
                className="rounded-lg mb-3 w-full h-40 object-cover"
              />
              <p className="font-semibold text-white mb-2">
                NFT #{nft.tokenId}
              </p>
              <button className="btn btn-secondary mt-2">View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAssets;
