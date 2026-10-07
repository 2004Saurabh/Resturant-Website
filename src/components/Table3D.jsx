import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export default function Table3D({ table, isSelected, onSelect }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Status colors
  const statusColors = {
    AVAILABLE: '#10B981', // Emerald green
    SELECTED: '#D4AF37',  // Gold
    RESERVED: '#F59E0B',  // Amber
    OCCUPIED: '#EF4444'   // Crimson
  };

  const currentColor = isSelected
    ? statusColors.SELECTED
    : statusColors[table.status] || statusColors.AVAILABLE;

  useFrame((_, delta) => {
    if (meshRef.current && (isSelected || hovered)) {
      meshRef.current.position.y = Math.sin(Date.now() * 0.003) * 0.05;
    } else if (meshRef.current) {
      meshRef.current.position.y = 0;
    }
  });

  const isSquare = table.shape === 'square' || table.shape === 'rectangle';

  return (
    <group
      position={table.position || [0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(table);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <group ref={meshRef}>
        {/* Table Top */}
        {isSquare ? (
          <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
            <boxGeometry args={[table.shape === 'rectangle' ? 2.2 : 1.4, 0.1, 1.4]} />
            <meshStandardMaterial
              color={hovered ? '#26262E' : '#1A1A20'}
              roughness={0.2}
              metalness={0.6}
            />
          </mesh>
        ) : (
          <mesh castShadow receiveShadow position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.85, 0.85, 0.1, 32]} />
            <meshStandardMaterial
              color={hovered ? '#26262E' : '#1A1A20'}
              roughness={0.2}
              metalness={0.6}
            />
          </mesh>
        )}

        {/* Center Pedestal / Table Leg */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.7, 16]} />
          <meshStandardMaterial color="#0E0E12" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Base Ring / Stand */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.04, 32]} />
          <meshStandardMaterial color="#0E0E12" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Glowing Indicator Ring */}
        <mesh position={[0, 0.76, 0]}>
          <ringGeometry args={[0.25, 0.32, 32]} />
          <meshBasicMaterial
            color={currentColor}
            toneMapped={false}
          />
        </mesh>

        {/* Floating Table ID Text */}
        <Text
          position={[0, 1.1, 0]}
          fontSize={0.28}
          color={isSelected ? '#D4AF37' : '#FFFFFF'}
          anchorX="center"
          anchorY="middle"
        >
          {table.id}
        </Text>

        {/* Miniature Chairs around the table */}
        <mesh position={[0, 0.4, 0.95]} castShadow>
          <boxGeometry args={[0.5, 0.08, 0.45]} />
          <meshStandardMaterial color="#2B0E14" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.7, 1.15]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.08]} />
          <meshStandardMaterial color="#2B0E14" roughness={0.5} />
        </mesh>

        <mesh position={[0, 0.4, -0.95]} castShadow>
          <boxGeometry args={[0.5, 0.08, 0.45]} />
          <meshStandardMaterial color="#2B0E14" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.7, -1.15]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.08]} />
          <meshStandardMaterial color="#2B0E14" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
