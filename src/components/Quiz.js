import React, { useState } from "react";
import quizData from "../data/quizData.json";
import { ethers } from "ethers";
import QuizTokenABI from "../abi/QuizToken.json";

const Quiz = () => {
  const quizTokenAddress = "YOUR_DEPLOYED_QUIZTOKEN_ADDRESS";
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentQuestion = quizData[questionIndex];

  const handleAnswer = (correct) => {
    if (correct) setScore(score + 1);
    const next = questionIndex + 1;
    if (next < quizData.length) setQuestionIndex(next);
    else setFinished(true);
  };

  const handleEnterQuiz = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(quizTokenAddress, QuizTokenABI.abi, signer);
      const tx = await token.enterQuiz();
      await tx.wait();
      alert("Entered quiz successfully! 1 QZT deducted.");
    } catch (err) {
      console.error(err);
      alert("Error entering quiz.");
    }
    setLoading(false);
  };

  const handleReward = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(quizTokenAddress, QuizTokenABI.abi, signer);
      const tx = await token.rewardPlayer(await signer.getAddress(), score, quizData.length);
      await tx.wait();
      alert("Reward granted based on your performance!");
    } catch (err) {
      console.error(err);
      alert("Error rewarding player. (Admin-only function?)");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-800 to-purple-700 text-white">
      {!finished ? (
        <div className="w-[90%] md:w-[500px] bg-white/10 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            Question {questionIndex + 1}/{quizData.length}
          </h2>
          <p className="text-lg mb-6">{currentQuestion.question}</p>
          {currentQuestion.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt === currentQuestion.answer)}
              className="block w-full bg-purple-600 hover:bg-purple-700 rounded-lg py-2 mb-2"
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold">🎉 Quiz Completed!</h2>
          <p className="text-xl mt-3">
            You scored {score} / {quizData.length}
          </p>
          <button
            onClick={handleReward}
            disabled={loading}
            className="mt-5 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg"
          >
            Claim Reward
          </button>
        </div>
      )}
      <button
        onClick={handleEnterQuiz}
        disabled={loading}
        className="absolute top-6 right-6 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg text-black"
      >
        🎮 Enter Quiz
      </button>
    </div>
  );
};

export default Quiz;
