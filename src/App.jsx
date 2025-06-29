import React, { useState } from "react";
import MainMenu from "./screens/MainMenu.jsx";
import GameScreen from "./screens/GameScreen.jsx";

export default function App() {
  const [screen, setScreen] = useState("menu");

  return screen === "menu" ? (
    <MainMenu onStart={() => setScreen("game")} />
  ) : (
    <GameScreen onExit={() => setScreen("menu")} />
  );
}
