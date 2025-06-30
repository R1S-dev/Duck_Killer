import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

const DuckEnemy = forwardRef(
  (
    { positionZ, initialX = 0, playerRef, onDeath, isBoss = false, visible = true },
    ref
  ) => {
    const group = useRef();
    const { scene: originalScene, animations } = useGLTF(isBoss ? "/boss_duck.glb" : "/duck.glb");
    const [scene, setScene] = useState(null);

    useEffect(() => {
      const cloned = clone(originalScene);
      setScene(cloned);
    }, [originalScene]);

    const { actions } = useAnimations(animations, group);

    const speed = isBoss ? 15 : 18;
    const maxHP = isBoss ? 3 : 1;
    const scaleAmount = isBoss ? 0.7 : 3.0; // boss manji, obicne duplo vece

    const endZ = 6;

    const [hp, setHp] = useState(maxHP);
    const currentPos = useRef(new THREE.Vector3(initialX, 0.2, positionZ));

    useEffect(() => {
      if (group.current) {
        group.current.position.copy(currentPos.current);
      }
    }, []);

    useEffect(() => {
      if (actions && scene) {
        const animName = "walkcycle_1";
        if (actions[animName]) {
          actions[animName].reset().fadeIn(0.2).play();
        }
      }
    }, [actions, scene]);

    useImperativeHandle(ref, () => ({
      getObject: () => group.current,
      isAlive: () => hp > 0,
      takeHit: () => {
        setHp((h) => {
          const newHp = h - 1;
          if (newHp <= 0) {
            if (onDeath) setTimeout(() => onDeath(isBoss), 0);
          }
          return newHp;
        });
      },
    }));

    useEffect(() => {
      if (visible) {
        setHp(maxHP);
      }
    }, [visible, maxHP]);

    useFrame((state, delta) => {
      if (!group.current || !playerRef?.current || !visible || hp <= 0 || !scene) return;

      const playerPos = new THREE.Vector3();
      if (typeof playerRef.current.getWorldPosition === "function") {
        playerRef.current.getWorldPosition(playerPos);
      } else if (playerRef.current.position) {
        playerPos.copy(playerRef.current.position);
      } else {
        console.warn("playerRef nema poziciju!");
        return;
      }

      const direction = new THREE.Vector3();
      direction.subVectors(playerPos, currentPos.current);
      direction.y = 0;

      if (direction.length() < 0.01) return;

      direction.normalize();

      currentPos.current.addScaledVector(direction, speed * delta);

      group.current.position.copy(currentPos.current);

      group.current.lookAt(playerPos.x, group.current.position.y, playerPos.z);

      if (!isBoss) {
        group.current.rotation.y += Math.PI;
      }

      if (currentPos.current.z > endZ) {
        currentPos.current.z = positionZ;
        currentPos.current.x = (Math.random() - 0.5) * 6;
        group.current.position.copy(currentPos.current);
      }
    });

    if (!visible || hp <= 0 || !scene) return null;

    return (
      <group
        ref={group}
        position={currentPos.current.toArray()}
        scale={scaleAmount}
        visible={visible}
      >
        <primitive object={scene} />
        {/* Vidljiv hitbox za testiranje i koliziju */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1, 2, 1]} />
          <meshBasicMaterial
            color={isBoss ? "orange" : "cyan"}
            transparent
            opacity={0.2}
            wireframe
            wireframeLinewidth={3}
          />
        </mesh>
      </group>
    );
  }
);

export default DuckEnemy;
