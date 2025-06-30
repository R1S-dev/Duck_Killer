import React, { useState, useEffect, useRef } from "react";
import DuckEnemy from "./DuckEnemy";

const MAX_ENEMIES = 10;
const SPAWN_INTERVAL = 3000;
const SPAWN_START_Z = -150;
const SPAWN_GAP_Z = 10;

export default function EnemyManager({ playerRef, onEnemyRefsChange, onKill }) {
  const [enemies, setEnemies] = useState([]);
  const refsMap = useRef({});
  const killsCount = useRef(0);

  // Spawn obične patke na interval
  useEffect(() => {
    const interval = setInterval(() => {
      setEnemies((prev) => {
        if (prev.length < MAX_ENEMIES) {
          // Proveravamo da li već postoji boss, ako postoji, ne spawnuj obične patke
          const bossExists = prev.some((e) => e.isBoss);
          if (bossExists) return prev;

          const newId = Date.now() + Math.random();
          return [...prev, { id: newId, index: prev.length, isBoss: false }];
        }
        return prev;
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const spawnBoss = () => {
    setEnemies((prev) => {
      // Proveri da li boss već postoji
      if (prev.some((e) => e.isBoss)) return prev;

      const newId = Date.now() + Math.random();
      return [...prev, { id: newId, index: prev.length, isBoss: true }];
    });
  };

  const handleEnemyDeath = (id, isBoss) => {
    setEnemies((prev) => prev.filter((e) => e.id !== id));
    delete refsMap.current[id];
    if (onEnemyRefsChange) onEnemyRefsChange(refsMap);

    killsCount.current++;
    if (onKill) {
      onKill.count = killsCount.current;
      onKill();
    }

    // Spawn boss na svakih 10 ubijenih pataka
    if (killsCount.current > 0 && killsCount.current % 10 === 0) {
      spawnBoss();
    }
  };

  useEffect(() => {
    if (onEnemyRefsChange) onEnemyRefsChange(refsMap);
  }, [enemies, onEnemyRefsChange]);

  return (
    <>
      {enemies.map(({ id, index, isBoss }) => (
        <DuckEnemy
          key={id}
          ref={(el) => {
            if (el) {
              refsMap.current[id] = el;
              if (onEnemyRefsChange) onEnemyRefsChange(refsMap);
            } else {
              delete refsMap.current[id];
            }
          }}
          positionZ={SPAWN_START_Z + index * SPAWN_GAP_Z}
          initialX={(Math.random() - 0.5) * 6}
          playerRef={playerRef}
          onDeath={() => handleEnemyDeath(id, isBoss)}
          isBoss={isBoss}
          visible={true}
        />
      ))}
    </>
  );
}
