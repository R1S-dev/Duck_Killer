import React, { useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";

import BeautifulSky from "../components/BeautifulSky";
import InfiniteGround from "../components/InfiniteGround";
import CharacterPlayer from "../components/CharacterPlayer";
import EnemyManager from "../components/EnemyManager";
import BulletManager from "../components/BulletManager";
import GameUI from "../components/GameUI";
import useGameLogic from "../hooks/useGameLogic";

export default function GameScreen({ onExit }) {
  const inputX = useRef(0);
  const playerRef = useRef(null);
  const bulletRef = useRef(null);

  const enemyRefs = useRef({});

  const handleEnemyRefsChange = useCallback((refsMap) => {
    enemyRefs.current = refsMap.current || {};
  }, []);

  const [score, setScore] = useState(0);
  const [kills, setKills] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleKill = useCallback(() => {
    setKills((k) => k + 1);
  }, []);

  useGameLogic({
    playerRef,
    enemyRefs,
    setScore,
    setGameOver,
    gameOver,
    bulletRef,
  });

  const handlePointerMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    inputX.current = x * 2;
  };

  const handleRestart = () => {
    setScore(0);
    setKills(0);
    setGameOver(false);
  };

  return (
    <div
      className="w-screen h-screen bg-black relative overflow-hidden touch-none"
      onPointerMove={handlePointerMove}
    >
      <GameUI
        score={score}
        kills={kills}
        gameOver={gameOver}
        onRestart={handleRestart}
        onExit={onExit}
      />

      <Canvas
        shadows
        fog={new THREE.FogExp2("#b0c4de", 0.01)} // magla u sceni
      >
        <PerspectiveCamera makeDefault position={[0, 3, 5]} fov={60} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Environment preset="sunset" />

        <BeautifulSky />

        <InfiniteGround />
        <CharacterPlayer ref={playerRef} inputX={inputX} />
        <EnemyManager
          playerRef={playerRef}
          onEnemyRefsChange={handleEnemyRefsChange}
          onKill={handleKill}
        />
        <BulletManager ref={bulletRef} enemyRefs={enemyRefs} playerRef={playerRef} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0" />
    </div>
  );
}
