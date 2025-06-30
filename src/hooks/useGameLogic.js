import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function useGameLogic({
  playerRef,
  enemyRefs,
  setScore,
  setGameOver,
  gameOver,
  bulletRef,
}) {
  const lastShotTime = useRef(0);
  const shootCooldown = 500;

  useEffect(() => {
    if (gameOver) return;

    const playerPos = new THREE.Vector3();

    const tick = () => {
      if (gameOver) return;

      if (!playerRef.current || !bulletRef?.current?.shoot) {
        requestAnimationFrame(tick);
        return;
      }

      playerRef.current.getWorldPosition(playerPos);

      const now = Date.now();

      Object.values(enemyRefs.current || {}).forEach((enemy) => {
        if (!enemy) return;
        const alive = enemy.isAlive?.();
        if (!alive) return;

        const enemyObj = enemy.getObject?.();
        if (!enemyObj) return;

        const enemyPos = new THREE.Vector3();
        enemyObj.getWorldPosition(enemyPos);

        const distance = playerPos.distanceTo(enemyPos);

        if (distance < 40 && now - lastShotTime.current > shootCooldown) {
          bulletRef.current.shoot(playerPos, enemyPos.clone().sub(playerPos).normalize());
          lastShotTime.current = now;
        }

        if (distance < 1.2 && alive) {
          setGameOver(true);
        }
      });

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);

    return () => {};
  }, [gameOver, playerRef, enemyRefs, bulletRef, setGameOver]);
}
