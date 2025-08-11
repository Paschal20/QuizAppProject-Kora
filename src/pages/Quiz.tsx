import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Quiz: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('playerName');
    if (!name) {
      navigate('/');
    } else {
      setPlayerName(name);
    }
  }, [navigate]);

  return (
    <div className="quiz-container">
      <div className="quiz-content">
        <h1>Welcome, {playerName}!</h1>
        <p>Quiz page is under construction...</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );
};

export default Quiz;
