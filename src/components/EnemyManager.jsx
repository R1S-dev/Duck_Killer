import React, { useState, useEffect, useRef } from "react";
import DuckEnemy from "./DuckEnemy";

const MAX_ENEMIES = 5;
const SPAWN_INTERVAL = 3000;
const SPAWN_START_Z = -60;

export default function EnemyManager({ playerRef, onEnemyRefsChange, onKill }) {
  const [enemies, setEnemies] = useState([]);
  const refsMap = useRef({});

  useEffect(() => {
    const interval = setInterval(() => {
      setEnemies((prev) => {
        if (prev.length < MAX_ENEMIES) {
          const newId = Date.now() + Math.random();
          return [...prev, { id: newId, index: prev.length }];
        }
        return prev;
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const handleEnemyDeath = (id) => {
    setEnemies((prev) => prev.filter((e) => e.id !== id));
    delete refsMap.current[id];
    onEnemyRefsChange && onEnemyRefsChange(refsMap);
    if (onKill) onKill();
  };

  useEffect(() => {
    onEnemyRefsChange && onEnemyRefsChange(refsMap);
  }, [enemies, onEnemyRefsChange]);

  return (
    <>
      {enemies.map(({ id, index }) => (
        <DuckEnemy
          key={id}
          ref={(el) => {
            refsMap.current[id] = el;
            onEnemyRefsChange && onEnemyRefsChange(refsMap);
          }}
          positionZ={SPAWN_START_Z - index * 15}
          index={index}
          playerRef={playerRef}
          onDeath={() => handleEnemyDeath(id)}
        />
      ))}
    </>
  );
}
