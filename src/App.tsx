import {  Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import Quiz2 from './pages/QuizPage';
import Leaderboard from './pages/Leaderboard';
import './App.css';

function App() {
  return (
   
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
         
          <Route path="/quiz2" element={<Quiz2 />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    
  );
}

export default App;
