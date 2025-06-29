import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function InfiniteGround() {
  const groupRef = useRef();
  const tiles = 40;
  const tileLength = 12;
  const tileWidth = 10;
  const speed = 0.3;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((tile) => {
        tile.position.z += speed;
        if (tile.position.z > tileLength * 2) {
          tile.position.z -= tileLength * tiles;
        }
      });
    }
  });

  return (
    <group ref={groupRef} receiveShadow>
      {Array.from({ length: tiles }).map((_, i) => (
        <group key={i} position={[0, 0, -i * tileLength]}>
          {/* Ploča - naizmenično sive boje */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[tileWidth, tileLength]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#333" : "#3a3a3a"}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>

          {/* Centralna žuta traka */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.01, 0]}
          >
            <planeGeometry args={[0.4, tileLength]} />
            <meshStandardMaterial
              color="#ffdd55"
              emissive="#ffdd55"
              emissiveIntensity={0.6}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>

          {/* Diskretne bele linije za ivice puta */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-tileWidth / 2 + 0.2, 0.02, 0]}
          >
            <planeGeometry args={[0.1, tileLength]} />
            <meshStandardMaterial color="#ddd" roughness={0.8} />
          </mesh>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[tileWidth / 2 - 0.2, 0.02, 0]}
          >
            <planeGeometry args={[0.1, tileLength]} />
            <meshStandardMaterial color="#ddd" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
