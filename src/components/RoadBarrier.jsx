import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

useGLTF.preload("/models/road_barrier.glb");

export default function RoadBarrier({ initialZ, speed, onPassed }) {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/road_barrier.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach((action) => {
        action.reset().fadeIn(0.2).play();
      });
    }
  }, [actions]);

  useEffect(() => {
    if (group.current) {
      group.current.position.set(-14, 0, initialZ); // pomereno još više ulevo
      group.current.rotation.y = Math.PI / 2; // okret 90 stepeni
      group.current.scale.set(-2, 2, 2); // smanjena veličina sa flipom
      group.current.traverse((child) => {
        if (child.isMesh) {
          if (
            child.name.toLowerCase().includes("text") ||
            child.name.toLowerCase().includes("letter")
          ) {
            child.scale.x = 2; // poništava flip na tekstu
          }
        }
      });
    }
  }, [initialZ]);

  useFrame((state, delta) => {
    if (!group.current) return;

    group.current.position.z += speed * delta;

    if (group.current.position.z > 6) {
      if (onPassed) onPassed();
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} castShadow receiveShadow />
    </group>
  );
}
