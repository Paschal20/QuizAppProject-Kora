import {  Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Quiz2 from './pages/Quiz2';
import Leaderboard from './pages/Leaderboard';
import './App.css';

function App() {
  return (
   
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz2" element={<Quiz2 />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    
  );
}

export default App;
