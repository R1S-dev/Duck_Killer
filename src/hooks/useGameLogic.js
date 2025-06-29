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
  const shootCooldown = 500; // cooldown u milisekundama (npr. 500ms = 2 metka u sekundi)

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
        const enemyObj = enemy.getObject?.();
        const alive = enemy.isAlive?.();
        if (!enemyObj || !alive) return;

        const enemyPos = new THREE.Vector3();
        enemyObj.getWorldPosition(enemyPos);

        const distance = playerPos.distanceTo(enemyPos);

        if (distance < 40 && now - lastShotTime.current > shootCooldown) {
          const direction = new THREE.Vector3()
            .subVectors(enemyPos, playerPos)
            .normalize();

          bulletRef.current.shoot(playerPos, direction);
          lastShotTime.current = now; // update poslednjeg pucanja
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
