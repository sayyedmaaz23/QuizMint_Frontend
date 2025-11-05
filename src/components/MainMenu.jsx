import React, { useEffect, useState } from "react";
import { connectWallet, getTokenBalance, buyTokens } from "../utils/QuizToken";
import { useNavigate } from "react-router-dom";

const MainMenu = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [ethAmount, setEthAmount] = useState("0.1");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const acc = await connectWallet();
        if (!acc) return;
        setAccount(acc);
        const bal = await getTokenBalance(acc);
        setBalance(bal);
      } catch (err) {
        console.error("Init error:", err);
      }
    })();
  }, []);

  const handleBuyTokens = async () => {
    try {
      setLoading(true);
      await buyTokens(ethAmount);
      const newBal = await getTokenBalance(account);
      setBalance(newBal);
      alert(`✅ Purchased tokens for ${ethAmount} ETH`);
    } catch (err) {
      console.error("Buy tokens failed:", err);
      if (err.code === 4001) alert("❌ Transaction cancelled.");
      else alert("⚠️ Failed to buy tokens. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-950 text-center text-gray-100">
      {/* Background glowing orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[140px] opacity-20 animate-pulse"></div>

      {/* Title Section */}
      <div className="z-10 mb-10">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 drop-shadow-lg animate-fadeIn">
          Blockchain Quiz
        </h1>
        <p className="text-gray-400 mt-3 text-lg font-light">Test your blockchain knowledge, earn QZT!</p>
      </div>

      {/* Wallet Info */}
      <div className="z-10 bg-gray-800/50 border border-gray-700 rounded-2xl p-6 shadow-lg w-[90%] md:w-[26rem] mb-6 backdrop-blur-sm">
        <p className="mb-1 text-gray-400">
          Wallet: <span className="text-yellow-400 font-mono">{account || "Not connected"}</span>
        </p>
        <p className="text-gray-400">
          QZT Balance: <span className="text-green-400 font-semibold">{Number(balance).toFixed(2)}</span>
        </p>
      </div>

      {/* Token Purchase Box */}
      <div className="z-10 bg-gray-800/60 border border-gray-700 rounded-xl p-5 shadow-md w-[90%] md:w-[22rem] mb-8">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">💰 Buy QZT Tokens</h3>
        <div className="flex justify-center gap-2">
          <input
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
            type="number"
            min="0.01"
            step="0.01"
            disabled={loading}
            className="bg-gray-900 border border-gray-700 text-white rounded-lg p-2 w-24 text-center focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleBuyTokens}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow hover:shadow-green-500/30 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Buy"}
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="z-10 flex flex-col gap-4 w-[90%] md:w-72">
        <button
          onClick={() => navigate("/quiz")}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-blue-400/40 transition-all duration-200"
        >
          🧩 Start Quiz
        </button>

        <button
          onClick={() => navigate("/marketplace")}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-yellow-300/40 transition-all duration-200"
        >
          🏪 Marketplace
        </button>

        <button
          onClick={() => navigate("/my-assets")}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-purple-400/40 transition-all duration-200"
        >
          🖼️ My Assets
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-gray-600 text-sm z-10">
        Powered by <span className="text-green-400 font-semibold">QuizToken (QZT)</span> ✨
      </footer>
    </div>
  );
};

export default MainMenu;
