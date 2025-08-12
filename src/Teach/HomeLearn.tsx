import React, { useState } from "react";
// Import React and the useState hook from React.
// useState allows you to add state variables to your functional component.

import { useNavigate } from "react-router-dom";
// Import the useNavigate hook from react-router-dom.
// useNavigate is used to programmatically navigate between routes/pages.

const Home: React.FC = () => {
  // Define a React functional component called Home.
  // React.FC is the TypeScript type for a React Function Component.

  const [showForm, setShowForm] = useState(false);
  // Declare a state variable 'showForm' initialized to false.
  // 'showForm' determines whether the name input form is shown.
  // 'setShowForm' is the function to update 'showForm'.

  const [playerName, setPlayerName] = useState("");
  // Declare a state variable 'playerName' initialized to an empty string.
  // This will store the name the user types into the input.
  // 'setPlayerName' is the function to update 'playerName'.

  const navigate = useNavigate();
  // Get the 'navigate' function from the useNavigate hook.
  // This function is used to change the current page programmatically.

  const handleStartQuiz = () => {
    setShowForm(true);
  };
  // Define a function called handleStartQuiz.
  // When called, it sets 'showForm' to true to reveal the name input form.

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent the default form submission behavior which would reload the page.

    if (playerName.trim()) {
      // Check if playerName (after trimming whitespace) is not empty.

      localStorage.setItem("playerName", playerName.trim());
      // Save the trimmed playerName into the browser's local storage under the key 'playerName'.
      // This way the player's name can be accessed later, e.g., in the quiz page.

      navigate("/quiz2");
      // Use the navigate function to move to the route "/quiz2".
      // This will change the page to the quiz component.
    }
  };

  return (
    // The component returns JSX which describes what UI will be rendered.

    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      {/* 
        Outer container div:
        - min-h-screen: minimum height is full viewport height, so it fills screen vertically.
        - bg-blue-600: background color is blue (from Tailwind CSS).
        - flex: use flexbox layout.
        - items-center justify-center: center content vertically and horizontally.
        - p-4: padding on all sides.
      */}

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        {/* 
          Inner card container:
          - bg-white/95: white background with 95% opacity.
          - backdrop-blur-sm: applies a slight blur effect behind the container.
          - rounded-2xl: rounded corners.
          - shadow-2xl: large shadow around the container.
          - p-8 (padding 8) on small screens, p-12 on medium screens.
          - max-w-md: max width medium (about 28rem).
          - w-full: full width within the max-width constraint.
        */}

        <div className="text-center">
          {/* Center all text inside */}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Quiz Challenge
          </h1>
          {/* 
            Main title:
            - text-4xl: large font size on small screens.
            - md:text-5xl: even larger on medium+ screens.
            - font-bold: bold font weight.
            - text-gray-800: dark gray text color.
            - mb-4: margin bottom.
          */}

          <p className="text-gray-600 mb-8 text-lg">
            Test your knowledge and compete for the top spot!
          </p>
          {/* Subtitle or description text */}

          {!showForm ? (
            // If showForm is false, show this button:

            <button
              onClick={handleStartQuiz}
              className="w-full bg-gray-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Quiz
            </button>
          ) : (
            // Otherwise (showForm is true), show this form:

            <form onSubmit={handleNameSubmit} className="space-y-6">
              {/* Form for entering player's name */}

              <h3 className="text-2xl font-semibold text-gray-800">
                Enter Your Name
              </h3>

              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                required
              />
              {/* 
                Text input for the player to type their name.
                - value is bound to the playerName state variable.
                - onChange updates the playerName state when typing.
                - required: prevents form submission if empty.
                - styling includes padding, border, rounded corners, and focus styles.
              */}

              <div className="flex gap-4">
                {/* Container for buttons side by side with gap */}

                <button
                  type="submit"
                  className="flex-1 bg-blue-400 text-white font-bold py-3 px-6 rounded-xl  transition-all duration-300"
                >
                  Begin Quiz
                </button>
                {/* Submit button to trigger form submission and start quiz */}

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-red-400 text-white font-bold py-3 px-6 rounded-xl  transition-all duration-300"
                >
                  Cancel
                </button>
                {/* Cancel button: sets showForm to false to hide form and show Start Quiz button again */}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
// Export the Home component as default so it can be imported elsewhere.
