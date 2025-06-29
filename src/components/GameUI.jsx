import React from "react";
import { Star, Skull, ArrowLeft } from "lucide-react";

export default function GameUI({ score, kills, gameOver, onRestart, onExit }) {
  return (
    <>
      {/* Score i Kills bar */}
      <div className="absolute top-4 left-4 flex space-x-6 items-center text-white z-10 select-none">
        <div className="flex items-center space-x-2 bg-black/50 rounded-md px-3 py-1 shadow-md">
          <Star size={24} className="text-yellow-400" />
          <span className="font-semibold text-lg tracking-wide">{score}</span>
        </div>
        <div className="flex items-center space-x-2 bg-black/50 rounded-md px-3 py-1 shadow-md">
          <Skull size={24} className="text-red-500" />
          <span className="font-semibold text-lg tracking-wide">{kills}</span>
        </div>
      </div>

      {/* GAME OVER OVERLAY */}
      {gameOver && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 text-white flex-col px-6 space-y-4">
          <h1 className="text-4xl font-extrabold flex items-center space-x-3">
            <Skull size={36} className="text-red-600" />
            <span>GAME OVER</span>
          </h1>
          <p className="text-lg font-medium">
            Your final score: <span className="font-bold">{score}</span>
          </p>
          <p className="text-lg font-medium">
            Ducks killed: <span className="font-bold">{kills ?? 0}</span>
          </p>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={onRestart}
              className="bg-yellow-400 hover:bg-yellow-500 transition-colors text-black font-semibold px-6 py-3 rounded-lg shadow-lg"
            >
              Restart Game
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="bg-gray-700 hover:bg-gray-800 transition-colors text-white font-semibold px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
              >
                <ArrowLeft size={20} />
                <span>Main Menu</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
