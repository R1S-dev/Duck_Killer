import React from "react";

export default function MainMenu({ onStart, onSettings, onExit }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-red-400 px-6 select-none">
      <h1 className="text-6xl font-black mb-10 text-center tracking-wide drop-shadow-lg flex items-center space-x-4">
        <span role="img" aria-label="duck" className="animate-bounce">🦆</span>
        <span className="text-white text-shadow-lg">Duck Killer</span>
        <span role="img" aria-label="knife" className="animate-pulse">🔪</span>
      </h1>

      <button
        onClick={onStart}
        className="w-full max-w-xs bg-red-700 hover:bg-red-800 active:bg-red-900 transition-colors duration-300 text-white font-extrabold text-2xl py-4 rounded-xl shadow-lg mb-8 tracking-wide"
      >
        Start Hunt
      </button>

      <div className="max-w-xs text-center text-gray-300 mb-8 font-mono select-text">
        <p className="mb-2">Swipe to move your knife</p>
        <p>Slash the ducks, survive as long as possible</p>
      </div>

      <div className="flex space-x-8 max-w-xs w-full justify-center">
        {onSettings && (
          <button
            onClick={onSettings}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-red-400 rounded-lg py-2 font-semibold shadow-inner"
          >
            Settings
          </button>
        )}
        {onExit && (
          <button
            onClick={onExit}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-red-400 rounded-lg py-2 font-semibold shadow-inner"
          >
            Exit
          </button>
        )}
      </div>

      <footer className="absolute bottom-4 text-gray-600 text-sm select-none w-full text-center font-mono">
        © 2025 Duck Killer — Keep your knife sharp!
      </footer>
    </div>
  );
}
