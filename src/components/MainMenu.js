import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import QuizTokenABI from "../abi/QuizToken.json";

const MainMenu = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [tokenContract, setTokenContract] = useState(null);
  const navigate = useNavigate();

  const quizTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const token = new ethers.Contract(
        quizTokenAddress,
        QuizTokenABI.abi,
        signer
      );
      setTokenContract(token);
      setAccount(accounts[0]);

      const bal = await token.balanceOf(accounts[0]);
      setBalance(ethers.formatEther(bal));
    } else {
      alert("Please install MetaMask to continue");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold mb-4 tracking-wide">
          🎮 QuizChain
        </h1>
        <p className="text-lg opacity-90">
          Earn tokens, own NFTs, and trade your digital achievements.
        </p>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mt-6 shadow-lg w-80 mx-auto">
          <p className="text-sm text-gray-300 mb-2">
            Connected Account:
          </p>
          <p className="text-md font-mono truncate">{account || "Not Connected"}</p>
          <p className="mt-2 text-md">
            <span className="font-semibold">Balance:</span> {balance} QZT
          </p>
          <button
            onClick={connectWallet}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition-all"
          >
            {account ? "Reconnect Wallet" : "Connect Wallet"}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 w-72 mx-auto">
          <button
            onClick={() => navigate("/quiz")}
            className="bg-green-600 hover:bg-green-700 py-3 rounded-lg text-lg font-bold shadow-md"
          >
            🧠 Take Quiz
          </button>
          <button
            onClick={() => navigate("/marketplace")}
            className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-lg font-bold shadow-md"
          >
            🏪 Marketplace
          </button>
          <button
            onClick={() => navigate("/myassets")}
            className="bg-yellow-600 hover:bg-yellow-700 py-3 rounded-lg text-lg font-bold shadow-md col-span-1"
          >
            🎴 My Assets
          </button>
          <button
            onClick={() => navigate("/trade")}
            className="bg-pink-600 hover:bg-pink-700 py-3 rounded-lg text-lg font-bold shadow-md col-span-1"
          >
            🔁 Trade NFTs
          </button>
        </div>
      </div>

      <footer className="mt-12 text-sm text-gray-300 opacity-80">
        Powered by Ethereum + Hardhat + React
      </footer>
    </div>
  );
};

export default MainMenu;
