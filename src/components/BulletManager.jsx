import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BulletManager = forwardRef(({ playerRef, enemyRefs, playShootSound }, ref) => {
  const bullets = useRef([]);
  const meshRefs = useRef({});
  const speed = 60;
  const [, setTick] = useState(0);

  useImperativeHandle(ref, () => ({
    shoot: () => {
      if (!playerRef || !playerRef.current) {
        console.warn("playerRef.current nije spreman za pucanje");
        return;
      }

      const pos = new THREE.Vector3();
      playerRef.current.getWorldPosition(pos);

      const velocity = new THREE.Vector3(0, 0, -1).multiplyScalar(speed);

      bullets.current.push({
        id: Date.now() + Math.random(),
        position: pos.clone(),
        velocity,
        hit: false,
      });

      if (playShootSound) {
        playShootSound();
      }

      setTick((t) => t + 1);
    },
  }));

  useFrame((state, delta) => {
    if (bullets.current.length === 0) return;

    let removedAny = false;

    bullets.current.forEach((bullet) => {
      if (bullet.hit) return;

      bullet.position.add(bullet.velocity.clone().multiplyScalar(delta));

      for (const enemy of Object.values(enemyRefs.current || {})) {
        if (!enemy) continue;
        const alive = enemy.isAlive?.();
        if (!alive) continue;

        const enemyObj = enemy.getObject?.();
        if (!enemyObj) continue;

        if (bullet.position.distanceTo(enemyObj.position) < 1) {
          bullet.hit = true;
          enemy.takeHit?.();
          removedAny = true;
          break;
        }
      }

      if (bullet.position.z < -50) {
        bullet.hit = true;
        removedAny = true;
      }

      const mesh = meshRefs.current[bullet.id];
      if (mesh) {
        mesh.position.copy(bullet.position);
      }
    });

    if (removedAny) {
      bullets.current = bullets.current.filter((b) => !b.hit);
      for (const id in meshRefs.current) {
        if (!bullets.current.find((b) => b.id === id)) {
          delete meshRefs.current[id];
        }
      }
    }

    setTick((t) => t + 1);
  });

  return (
    <>
      {bullets.current.map((bullet) => (
        <mesh
          key={bullet.id}
          ref={(el) => {
            if (el) meshRefs.current[bullet.id] = el;
            else delete meshRefs.current[bullet.id];
          }}
          castShadow
          receiveShadow
          position={bullet.position}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="orange"
            emissive="yellow"
            emissiveIntensity={1}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
      ))}
    </>
  );
});

export default BulletManager;
