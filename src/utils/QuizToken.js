// src/utils/QuizToken.js
import { ethers } from "ethers";
import { QUIZ_TOKEN_ADDRESS, QUIZ_TOKEN_ABI } from "../config";

/* ---------------------------- 1️⃣ Contract Helper ---------------------------- */
export async function getQuizTokenContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(QUIZ_TOKEN_ADDRESS, QUIZ_TOKEN_ABI, signer);
}

/* ---------------------------- 2️⃣ Connect Wallet ---------------------------- */
export async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not detected!");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  // Ensure we’re on Hardhat localhost
  if (network.chainId !== 31337n) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7A69" }], // 31337 in hex
      });
    } catch (err) {
      console.error("Network switch failed:", err);
      alert("Please switch to Hardhat Localhost (31337) in MetaMask.");
      return null;
    }
  }

  const [account] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  // Listen for account or network change
  window.ethereum.on("accountsChanged", () => window.location.reload());
  window.ethereum.on("chainChanged", () => window.location.reload());

  return account;
}

/* ---------------------------- 3️⃣ Buy Tokens ---------------------------- */
export async function buyTokens(ethAmount) {
  try {
    const contract = await getQuizTokenContract();
    const tx = await contract.buyTokens({
      value: ethers.parseEther(ethAmount),
    });
    await tx.wait();
    alert(`✅ Bought tokens worth ${ethAmount} ETH`);
  } catch (error) {
    if (error.code === 4001) {
      alert("❌ Transaction cancelled by user.");
    } else {
      console.error("Buy tokens error:", error);
      alert("⚠️ Failed to buy tokens. Check console for details.");
    }
  }
}

/* ---------------------------- 4️⃣ Get Balance ---------------------------- */
export async function getTokenBalance(address) {
  try {
    const contract = await getQuizTokenContract();
    const balance = await contract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return "0";
  }
}

/* ---------------------------- 5️⃣ Enter / Leave Quiz ---------------------------- */
/**
 * This now toggles between joining and quitting the quiz.
 * If the user is not in the quiz → deducts entry fee and joins.
 * If already in the quiz → leaves it.
 */
export async function toggleQuiz() {
  try {
    const contract = await getQuizTokenContract();
    const tx = await contract.toggleQuiz(); // toggles state in contract
    await tx.wait();
    alert("✅ Quiz status toggled (entered or left).");
  } catch (error) {
    if (error.code === 4001) {
      alert("❌ Transaction cancelled by user.");
    } else if (error.reason) {
      alert(`⚠️ ${error.reason}`);
    } else {
      console.error("Quiz toggle error:", error);
      alert("⚠️ Failed to toggle quiz state. Check console.");
    }
  }
}

/* ---------------------------- 6️⃣ Quiz Status Checker ---------------------------- */
/**
 * Returns true if the user is currently inside a quiz, else false.
 */
export async function checkQuizStatus(address) {
  try {
    const contract = await getQuizTokenContract();
    const status = await contract.inQuiz(address);
    return status;
  } catch (error) {
    console.error("Error checking quiz status:", error);
    return false;
  }
}

// ---------------------------- 7️⃣ Reward Player ----------------------------
export const rewardPlayer = async (correct, total) => {
  const contract = await getQuizTokenContract();
  const tx = await contract.rewardPlayer(correct, total);
  await tx.wait();
  alert("✅ Reward processed based on your score!");
};
