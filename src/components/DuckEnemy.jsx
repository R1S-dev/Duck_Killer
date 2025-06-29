import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

useGLTF.preload("/duck.glb");

const DuckEnemy = forwardRef(({ positionZ, playerRef, onDeath }, ref) => {
  const group = useRef();
  const { scene, animations } = useGLTF("/duck.glb");
  const { actions } = useAnimations(animations, group);

  const speed = 0.3;
  const initialX = useRef((Math.random() - 0.5) * 4);
  const startZ = useRef(positionZ);
  const endZ = 6;

  // State koji prati da li je neprijatelj ziv i vidljiv
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const animName = "walkcycle_1";
    if (actions[animName]) {
      actions[animName].reset().fadeIn(0.2).play();
    }
    if (scene) {
      scene.visible = true;
      scene.position.set(0, 0, 0);
      scene.scale.set(1, 1, 1);
    }
  }, [actions, scene]);

  useImperativeHandle(ref, () => ({
    getObject: () => group.current,
    isAlive: () => visible,
    takeHit: () => {
      if (!visible) return;
      setVisible(false);
      if (onDeath) {
        onDeath();
      }
    },
  }));

  useFrame(() => {
    if (!group.current || !playerRef.current || !visible) return;

    group.current.position.z += speed;

    const playerPos = new THREE.Vector3();
    playerRef.current.getWorldPosition(playerPos);

    // Okreni se prema igracu (plus rotacija za model)
    group.current.lookAt(playerPos.x, group.current.position.y, playerPos.z);
    group.current.rotation.y += Math.PI;

    // Resetuj poziciju i vrati vidljivost ako je prosao kraj
    if (group.current.position.z > endZ) {
      group.current.position.z = startZ.current;
      group.current.position.x = (Math.random() - 0.5) * 4;
      setVisible(true);
    }
  });

  return (
    <group ref={group} position={[initialX.current, 0.2, startZ.current]} scale={1.5} visible={visible}>
      <primitive object={scene} visible={visible} />
      {/* Hitbox je uvek sinhronizovan sa vidljivošću patke */}
      {visible && (
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1, 2, 1]} />
          <meshBasicMaterial color="red" transparent opacity={0.3} wireframe />
        </mesh>
      )}
    </group>
  );
});

export default DuckEnemy;
