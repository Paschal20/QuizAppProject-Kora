import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

const Quiz2: React.FC = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // Sample questions
  const questions: Question[] = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1
    },
    {
      id: 4,
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Rembrandt"],
      correctAnswer: 2
    },
    {
      id: 5,
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: 3
    }
  ];

  // Check if player name exists
  useEffect(() => {
    const name = localStorage.getItem('playerName');
    if (!name) {
      navigate('/');
    } else {
      setPlayerName(name);
      setQuizStarted(true);
    }
  }, [navigate]);

  // Timer logic
  useEffect(() => {
    if (!quizStarted || quizFinished || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handleNextQuestion();
          return 10;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizStarted, quizFinished]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setTimeLeft(0); // Stop timer when answer is selected
    
    if (answerIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimeLeft(10);
      setSelectedAnswer(null);
    } else {
      finishQuiz();
    }
  }, [currentQuestionIndex, questions.length]);

  const finishQuiz = () => {
    setQuizFinished(true);
    
    // Save to leaderboard
    const leaderboardEntry: LeaderboardEntry = {
      name: playerName,
      score: score,
      date: new Date().toISOString()
    };

    const existingLeaderboard = localStorage.getItem('leaderboard');
    let leaderboard: LeaderboardEntry[] = [];
    
    if (existingLeaderboard) {
      leaderboard = JSON.parse(existingLeaderboard);
    }
    
    leaderboard.push(leaderboardEntry);
    
    // Sort by score (descending) and keep top 10
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);
    
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    
    // Navigate to leaderboard after a short delay
    setTimeout(() => {
      navigate('/leaderboard');
    }, 2000);
  };

  if (!quizStarted) {
    return <div className="min-h-screen flex items-center justify-center text-gray-700">Loading...</div>;
  }

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Quiz Completed!</h2>
          <p className="text-lg mb-2">Congratulations, <span className="font-semibold">{playerName}</span>!</p>
          <p className="text-lg mb-6">Your final score: <span className="font-semibold">{score}</span> / {questions.length}</p>
          <p className="text-gray-600">Redirecting to leaderboard...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Question {currentQuestionIndex + 1} of {questions.length}</h2>
          <div className="space-x-6 text-gray-700 font-semibold">
            <span>Player: {playerName}</span>
            <span>Score: {score}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            />
          </div>
          <span className="block mt-2 text-gray-700 font-medium">Time: {timeLeft}s</span>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{currentQuestion.question}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = index === currentQuestion.correctAnswer;
              const isSelected = index === selectedAnswer;
              let btnClass = "option-btn px-4 py-3 rounded-lg border text-left font-medium transition-colors duration-300 ";
              if (selectedAnswer !== null) {
                if (isCorrect) {
                  btnClass += "bg-green-200 border-green-500 text-green-800 cursor-default";
                } else if (isSelected && !isCorrect) {
                  btnClass += "bg-red-200 border-red-500 text-red-800 cursor-default";
                } else {
                  btnClass += "bg-white border-gray-300 text-gray-700 cursor-default";
                }
              } else {
                btnClass += "bg-white border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer";
              }
              return (
                <button
                  key={index}
                  className={btnClass}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {selectedAnswer !== null && (
          <button 
            className="next-btn bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz2;
