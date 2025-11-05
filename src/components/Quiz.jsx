import React, { useEffect, useState } from "react";
import quizData from "../data/quizData.json";
import {
  connectWallet,
  getTokenBalance,
  toggleQuiz,
  checkQuizStatus,
  rewardPlayer,
} from "../utils/QuizToken";

const Quiz = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  /* -------------------- INIT -------------------- */
  useEffect(() => {
    (async () => {
      try {
        const acc = await connectWallet();
        if (!acc) return;
        setAccount(acc);

        const bal = await getTokenBalance(acc);
        setBalance(bal);

        const inQuiz = await checkQuizStatus(acc);
        setQuizStarted(Boolean(inQuiz));
      } catch (err) {
        console.error("Init error:", err);
      }
    })();
  }, []);

  const refreshBalance = async () => {
    try {
      const bal = await getTokenBalance(account);
      setBalance(bal);
    } catch (e) {
      console.error("refreshBalance error:", e);
    }
  };

  /* -------------------- TOGGLE QUIZ -------------------- */
  const handleToggleQuiz = async () => {
    if (!quizStarted && parseFloat(balance) < 1) {
      alert("Not enough QZT to enter! Please buy tokens first.");
      return;
    }

    try {
      setLoading(true);
      await toggleQuiz();
      const inQuizNow = await checkQuizStatus(account);
      setQuizStarted(Boolean(inQuizNow));
      await refreshBalance();
      if (inQuizNow) {
        setStep(0);
        setScore(0);
        setSelected(null);
        setShowResult(false);
      }
    } catch (err) {
      console.error("Toggle quiz failed:", err);
      if (err?.code === 4001) alert("Transaction cancelled.");
      else alert("Failed to toggle quiz. See console.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- ANSWER SELECTION -------------------- */
  const handleSelect = (opt) => {
    if (loading) return;
    setSelected(opt);
  };

  /* -------------------- NEXT BUTTON -------------------- */
  const handleNext = async () => {
    if (!selected) return;

    const correctAnswer = quizData[step].answer; // ✅ Use correct JSON key here
    setScore((prev) => {
      const newScore = selected === correctAnswer ? prev + 1 : prev;
      console.log(`Selected: ${selected}, Correct: ${correctAnswer}, Updated: ${newScore}`);
      return newScore;
    });
if (step + 1 >= quizData.length) {
  // show results on UI
  setTimeout(() => {
    setShowResult(true);
    setQuizStarted(false);
    setSelected(null);
  }, 150);

  try {
    setLoading(true);

    // Player leaves the quiz on-chain (this flips their inQuiz state)
    
    // 🎁 Reward player (only contract owner can execute this successfully)
    // const {  } = await import("../utils/QuizToken");
// inside handleNext after last question
await rewardPlayer(score, quizData.length);
await toggleQuiz();
await refreshBalance();

    alert("🎉 Quiz completed! If you scored 80% or more, you've been rewarded!");
  } catch (err) {
    console.error("Reward or leave quiz failed:", err);
    alert("⚠️ Reward distribution failed (only owner can reward).");
  } finally {
    setLoading(false);
  }

  return;
}

    setStep((prev) => prev + 1);
    setSelected(null);
  };

  /* -------------------- RESTART -------------------- */
  const handleRestart = async () => {
    try {
      setLoading(true);
      const inQuizNow = await checkQuizStatus(account);
      if (inQuizNow) await toggleQuiz();
      await refreshBalance();
    } catch (err) {
      console.error("Restart error:", err);
    } finally {
      setLoading(false);
      setStep(0);
      setScore(0);
      setSelected(null);
      setShowResult(false);
      setQuizStarted(false);
    }
  };

  /* -------------------- RENDER STATES -------------------- */

  // 1️⃣ Not in quiz
  if (!quizStarted && !showResult) {
    return (
      <div className="quiz-container fade-in flex flex-col items-center justify-center h-screen">
        <h2 className="text-3xl font-bold text-green-400 mb-6">🧩 Blockchain Quiz</h2>
        <p className="text-gray-400 mb-1">Wallet: {account || "Not connected"}</p>
        <p className="text-gray-400 mb-6">Balance: {Number(balance).toFixed(2)} QZT</p>

        <div className="flex gap-3">
          <button
            onClick={handleToggleQuiz}
            disabled={loading}
            className="btn btn-primary disabled:opacity-50"
          >
            {loading ? "Processing..." : "Enter Quiz (1 QZT)"}
          </button>

          <button
            onClick={refreshBalance}
            disabled={loading}
            className="btn btn-secondary disabled:opacity-50"
          >
            Refresh Balance
          </button>
        </div>
      </div>
    );
  }

  // 2️⃣ Quiz finished
  if (showResult) {
    return (
      <div className="quiz-container fade-in flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-green-400 mb-2">🎉 Quiz Completed!</h2>
        <p className="text-gray-300 mb-4">
          You answered <span className="text-yellow-400">{score}</span>/{quizData.length} correctly.
        </p>
        <p className="text-gray-500 mb-6">(Owner can reward players with QZT based on performance.)</p>

        <div className="flex gap-4">
          <button
            onClick={handleRestart}
            disabled={loading}
            className="btn btn-primary disabled:opacity-50"
          >
            Play Again
          </button>
          <button
            onClick={refreshBalance}
            disabled={loading}
            className="btn btn-secondary disabled:opacity-50"
          >
            Refresh Balance
          </button>
        </div>
      </div>
    );
  }

  // 3️⃣ Quiz active
  const question = quizData[step];

  return (
    <div className="quiz-container fade-in">
      <h2 className="text-xl font-bold mb-4 text-green-400">
        Question {step + 1}/{quizData.length}
      </h2>

      <p className="quiz-question">{question.question}</p>

      <div className="flex flex-col gap-2 mb-4">
        {question.options.map((opt, index) => (
          <button
            key={index}
            onClick={() => handleSelect(opt)}
            disabled={loading}
            className={`quiz-option ${selected === opt ? "selected" : ""}`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={handleNext}
          disabled={!selected || loading}
          className="btn btn-primary disabled:opacity-50"
        >
          Next
        </button>

        <button
          onClick={async () => {
            try {
              setLoading(true);
              await toggleQuiz();
              await refreshBalance();
              setQuizStarted(false);
            } catch (err) {
              console.error("Leave during quiz failed:", err);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="btn btn-danger disabled:opacity-50"
        >
          Leave Quiz
        </button>
      </div>
    </div>
  );
};

export default Quiz;
