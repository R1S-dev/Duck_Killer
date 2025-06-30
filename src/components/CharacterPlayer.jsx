import React, { forwardRef, useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const CharacterPlayer = forwardRef(({ inputX }, ref) => {
  const group = useRef();
  const { scene, animations } = useGLTF("/character.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const animName = "Armature|Armature|mixamo.com|Layer0.001";
    if (actions[animName]) {
      actions[animName].reset().fadeIn(0.2).play();
    }
    if (scene) {
      scene.visible = true;
      scene.position.set(0, 0, 0);
      scene.scale.set(1, 1, 1);
    }
    scene.rotation.y = 0;
  }, [actions, scene]);

  useFrame(() => {
    if (group.current) {
      group.current.position.x += (inputX.current - group.current.position.x) * 0.2;
    }
  });

  React.useImperativeHandle(ref, () => ({
    getWorldPosition: (target) => {
      if (group.current) group.current.getWorldPosition(target);
    },
    object: group.current,
  }));

  return (
    <group ref={group} position={[0, 0, -1.5]} scale={1.2}>
      <primitive object={scene} />
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 2, 1]} />
        <meshBasicMaterial color="blue" transparent opacity={0.3} />
      </mesh>
    </group>
  );
});

export default CharacterPlayer;
