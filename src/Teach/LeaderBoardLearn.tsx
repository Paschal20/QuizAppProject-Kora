import React, { useState, useEffect } from "react";
// Import React and React hooks useState and useEffect.
// useState is for managing component state.
// useEffect is for running side effects, like fetching or reading data on mount.

import { useNavigate } from "react-router-dom";
// Import useNavigate hook from react-router-dom to programmatically navigate routes.

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}
// Define a TypeScript interface describing each leaderboard entry.
// Each entry has a name (string), score (number), and date (string).

const Leaderboard: React.FC = () => {
  // Define the Leaderboard functional component.

  const navigate = useNavigate();
  // Initialize the navigate function to allow navigation between pages.

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  // State variable 'leaderboard' holds an array of LeaderboardEntry objects.
  // Initialized as an empty array.
  // setLeaderboard updates this state.

  const [searchTerm, setSearchTerm] = useState("");
  // State variable 'searchTerm' holds the current search input text.
  // Initialized as empty string.

  const [sortOrder, setSortOrder] = useState<"highest" | "lowest" | "none">(
    "none"
  );
  // State variable 'sortOrder' holds the current sorting order for scores.
  // It can be "highest", "lowest", or "none".
  // Initialized as 'none'.

  useEffect(() => {
    // useEffect hook runs once after the component mounts (empty dependency array []).

    const savedLeaderboard = localStorage.getItem("leaderboard");
    // Attempt to read saved leaderboard data from localStorage.

    if (savedLeaderboard) {
      // If leaderboard data is found in localStorage...

      const parsedLeaderboard = JSON.parse(savedLeaderboard);
      // Parse the JSON string into a JavaScript array of leaderboard entries.

      setLeaderboard(parsedLeaderboard);
      // Update the leaderboard state with the parsed data.
    }
  }, []);
  // Empty dependency array ensures this effect runs only once on component mount.

  const handleGoHome = () => {
    navigate("/");
  };
  // Function to navigate back to the home page ("/").

  const handlePlayAgain = () => {
    navigate("/quiz2");
  };
  // Function to navigate to the quiz page ("/quiz2").

  const handleReset = () => {
    // Function to clear the entire leaderboard.

    if (
      window.confirm(
        "Are you sure you want to clear all players from the leaderboard? This action cannot be undone."
      )
    ) {
      // Show a confirmation dialog to prevent accidental clearing.

      localStorage.removeItem("leaderboard");
      // Remove leaderboard data from localStorage.

      setLeaderboard([]);
      // Clear the leaderboard state in memory.
    }
  };

  const handleDeleteUser = (index: number) => {
    // Function to delete a specific user from the leaderboard.
    // Receives the index of the user in the filteredAndSortedLeaderboard array.

    const entryToDelete = filteredAndSortedLeaderboard[index];
    // Find the actual leaderboard entry to delete based on the filtered and sorted list.

    if (
      window.confirm(
        `Are you sure you want to delete ${entryToDelete.name} with score ${entryToDelete.score}/5?`
      )
    ) {
      // Confirm deletion with user.

      const updatedLeaderboard = leaderboard.filter(
        (entry) =>
          !(
            entry.name === entryToDelete.name &&
            entry.score === entryToDelete.score &&
            entry.date === entryToDelete.date
          )
      );
      // Filter out the entry to delete by matching name, score, and date.
      // This ensures only the exact matching entry is removed.

      localStorage.setItem("leaderboard", JSON.stringify(updatedLeaderboard));
      // Save the updated leaderboard back to localStorage.

      setLeaderboard(updatedLeaderboard);
      // Update the leaderboard state with the new filtered list.
    }
  };

  // Filter and sort the leaderboard based on searchTerm and sortOrder:
  const filteredAndSortedLeaderboard = leaderboard
    .filter((entry) => {
      // Filter entries where either:
      const nameMatch = entry.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      // - The player's name includes the search term (case insensitive)

      const scoreMatch =
        searchTerm === "" ||
        entry.score.toString().includes(searchTerm) ||
        searchTerm === entry.score.toString();
      // - OR the search term is empty
      // - OR the search term matches or is included in the score (converted to string)

      return nameMatch || scoreMatch;
      // Keep entries matching either condition.
    })
    .sort((a, b) => {
      // Sort entries based on current sortOrder:

      if (sortOrder === "highest") {
        return b.score - a.score;
        // Sort descending by score (highest first).
      } else if (sortOrder === "lowest") {
        return a.score - b.score;
        // Sort ascending by score (lowest first).
      }
      return 0;
      // No sorting (maintain original order).
    });

  return (
    // Render JSX for the Leaderboard UI.

    <div className="min-h-screen bg-blue-400 flex items-center justify-center p-4">
      {/* 
        Outer container div:
        - min-h-screen: fills the entire vertical screen.
        - bg-blue-400: blue background.
        - flex with centered alignment vertically and horizontally.
        - padding 4.
      */}

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full">
        {/* 
          Inner container styled like a card:
          - Slightly transparent white background with blur effect.
          - Rounded corners and shadow for depth.
          - Padding on small and medium screens.
          - Max width large (4xl) and full width inside that limit.
        */}

        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Quiz Leaderboard
        </h1>
        {/* Page title, centered with large bold font */}

        {leaderboard.length === 0 ? (
          // If leaderboard is empty...

          <div className="text-center text-gray-700">
            {/* Centered message */}

            <p className="mb-6 text-lg">
              No scores yet! Be the first to take the quiz.
            </p>
            {/* Inform user no scores exist yet */}

            <button
              onClick={handlePlayAgain}
              className="bg-amber-300 text-white font-bold py-3 px-8 rounded-full text-lg  transition-all duration-300 shadow-lg"
            >
              Take Quiz
            </button>
            {/* Button to take quiz, navigates to quiz page */}
          </div>
        ) : (
          // If leaderboard has entries, render the main content:

          <>
            {/* Search and Sort Controls */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Container for search and sort inputs, stacks vertically on small screens, horizontally on larger screens */}

                <div className="flex-1">
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                  {/* Input for typing a search term to filter leaderboard */}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by score
                  </label>
                  <div className="flex gap-2">
                    {/* Buttons to set sorting order */}

                    <button
                      onClick={() => setSortOrder("highest")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        sortOrder === "highest"
                          ? "bg-blue-400 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Highest ➡️ Lowest
                    </button>

                    <button
                      onClick={() => setSortOrder("lowest")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        sortOrder === "lowest"
                          ? "bg-blue-400 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Lowest ➡️ Highest
                    </button>

                    {sortOrder !== "none" && (
                      <button
                        onClick={() => setSortOrder("none")}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                      >
                        Reset
                      </button>
                    )}
                    {/* Reset button appears only if some sorting is active */}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredAndSortedLeaderboard.length} of{" "}
              {leaderboard.length} entries
              {searchTerm && ` (filtered by "${searchTerm}")`}
            </div>
            {/* Show how many entries are visible out of total, plus filtering info */}

            {/* Leaderboard Table */}
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-6 py-3 text-left text-gray-700 font-semibold">
                      Rank
                    </th>
                    <th className="border border-gray-300 px-6 py-3 text-left text-gray-700 font-semibold">
                      Name
                    </th>
                    <th className="border border-gray-300 px-6 py-3 text-left text-gray-700 font-semibold">
                      Score
                    </th>
                    <th className="border border-gray-300 px-6 py-3 text-left text-gray-700 font-semibold">
                      Date
                    </th>
                    <th className="border border-gray-300 px-6 py-3 text-left text-gray-700 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAndSortedLeaderboard.length === 0 ? (
                    // If after filtering no entries are found...

                    <tr>
                      <td
                        colSpan={5}
                        className="border border-gray-300 px-6 py-8 text-center text-gray-500"
                      >
                        No players found matching "{searchTerm}"
                      </td>
                    </tr>
                  ) : (
                    // Otherwise, render each leaderboard entry as a table row:

                    filteredAndSortedLeaderboard.map((entry, index) => (
                      <tr
                        key={index}
                        className={`border border-gray-300 ${
                          index === 0 && sortOrder === "highest"
                            ? "bg-yellow-100 font-bold"
                            : "bg-white"
                        }`}
                      >
                        <td className="border border-gray-300 px-6 py-3">
                          {index + 1}
                        </td>
                        {/* Rank number, starting at 1 */}

                        <td className="border border-gray-300 px-6 py-3">
                          {entry.name}
                        </td>
                        {/* Player's name */}

                        <td className="border border-gray-300 px-6 py-3">
                          {entry.score}/9
                        </td>
                        {/* Player's score, max 9 */}

                        <td className="border border-gray-300 px-6 py-3">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        {/* Date formatted in local date format */}

                        <td className="border border-gray-300 px-6 py-3">
                          <button
                            onClick={() => handleDeleteUser(index)}
                            className="bg-red-200 hover:bg-red-600 text-white font-bold py-1 px-3 rounded transition-colors duration-200"
                          >
                            Delete
                          </button>
                          {/* Delete button to remove this entry */}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom action buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={handleGoHome}
                className=" text-white font-bold py-3 px-8 rounded-full text-lg bg-blue-400 transition-all duration-300 shadow-lg"
              >
                Back to Home
              </button>

              <button
                onClick={handlePlayAgain}
                className=" text-white font-bold py-3 px-8 rounded-full text-lg bg-green-500 transition-all duration-300 shadow-lg"
              >
                Play Again
              </button>

              <button
                onClick={handleReset}
                className=" text-white font-bold py-3 px-8 rounded-full text-lg bg-blue-400 transition-all duration-300 shadow-lg"
              >
                Reset Leaderboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
// Export the Leaderboard component as the default export.
