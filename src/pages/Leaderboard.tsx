import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'highest' | 'lowest' | 'none'>('none');

  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('leaderboard');
    if (savedLeaderboard) {
      const parsedLeaderboard = JSON.parse(savedLeaderboard);
      setLeaderboard(parsedLeaderboard);
    }
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handlePlayAgain = () => {
    navigate('/quiz2');
  };

  // Filter and sort the leaderboard
  const filteredAndSortedLeaderboard = leaderboard
    .filter(entry => 
      entry.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'highest') {
        return b.score - a.score;
      } else if (sortOrder === 'lowest') {
        return a.score - b.score;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Quiz Leaderboard</h1>
        
        {leaderboard.length === 0 ? (
          <div className="text-center text-gray-700">
            <p className="mb-6 text-lg">No scores yet! Be the first to take the quiz.</p>
            <button 
              onClick={handlePlayAgain} 
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              Take Quiz
            </button>
          </div>
        ) : (
          <>
            {/* Search and Sort Controls */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Search by name
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Enter player name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by score
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortOrder('highest')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        sortOrder === 'highest'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Highest → Lowest
                    </button>
                    <button
                      onClick={() => setSortOrder('lowest')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        sortOrder === 'lowest'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Lowest → Highest
                    </button>
                    {sortOrder !== 'none' && (
                      <button
                        onClick={() => setSortOrder('none')}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredAndSortedLeaderboard.length} of {leaderboard.length} entries
              {searchTerm && ` (filtered by "${searchTerm}")`}
            </div>

            {/* Leaderboard Table */}
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-6 py-3 text-left text-gray-700 font-semibold">Rank</th>
                    <th className="border border-gray-300 px-6 py-3 text-left text-gray-700 font-semibold">Name</th>
                    <th className="border border-gray-300 px-6 py-3 text-left text-gray-700 font-semibold">Score</th>
                    <th className="border border-gray-300 px-6 py-3 text-left text-gray-700 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedLeaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="border border-gray-300 px-6 py-8 text-center text-gray-500">
                        No players found matching "{searchTerm}"
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedLeaderboard.map((entry, index) => (
                      <tr 
                        key={index} 
                        className={`border border-gray-300 ${index === 0 && sortOrder === 'highest' ? 'bg-yellow-100 font-bold' : 'bg-white'}`}
                      >
                        <td className="border border-gray-300 px-6 py-3">{index + 1}</td>
                        <td className="border border-gray-300 px-6 py-3">{entry.name}</td>
                        <td className="border border-gray-300 px-6 py-3">{entry.score}/5</td>
                        <td className="border border-gray-300 px-6 py-3">{new Date(entry.date).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-center gap-6">
              <button 
                onClick={handleGoHome} 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
              >
                Back to Home
              </button>
              <button 
                onClick={handlePlayAgain} 
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
              >
                Play Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
