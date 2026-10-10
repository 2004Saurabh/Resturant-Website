import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, ContactShadows, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Luxury 3D Haute Dish Centerpiece
function LuxuryCenterpiece() {
  const groupRef = useRef();
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      {/* Fine Porcelain Plate */}
      <mesh position={[0, -0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.5, 1.8, 0.2, 64]} />
        <meshStandardMaterial
          color="#16161A"
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* Plate Gold Rim Accent */}
      <mesh position={[0, -0.09, 0]}>
        <torusGeometry args={[2.45, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Haute Gastronomy Sphere / Molecular Delicacy */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.9, 64, 64]} />
        <MeshDistortMaterial
          color="#881A2D"
          speed={1.5}
          distort={0.22}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Floating Gold Leaf / Orbital Garnishes */}
      <group ref={ringRef} position={[0, 0.45, 0]}>
        <mesh position={[1.4, 0.3, 0]}>
          <boxGeometry args={[0.18, 0.02, 0.18]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[-1.2, -0.2, 0.8]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#10B981" roughness={0.3} />
        </mesh>
        <mesh position={[0.5, -0.3, -1.3]}>
          <torusGeometry args={[0.15, 0.03, 16, 32]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} />
        </mesh>
      </group>

      {/* Cloche Dome Glass Mist */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[1.7, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transparent
          opacity={0.18}
          roughness={0.1}
          metalness={0.1}
          transmission={0.85}
          ior={1.4}
        />
      </mesh>

      {/* Gold Finial Top Knob */}
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.1} />
      </mesh>
    </group>
  );
}

// Fallback visual in case WebGL is unsupported
function Hero3DFallback() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full p-2 border border-[#D4AF37]/30 bg-gradient-to-tr from-[#141418] to-[#241018] shadow-2xl shadow-black/80 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"
          alt="Haute Cuisine"
          className="w-64 h-64 sm:w-80 sm:h-80 rounded-full object-cover shadow-2xl"
        />
        <div className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/40 animate-spin-slow pointer-events-none" />
      </div>
    </div>
  );
}

export default function Hero3D() {
  const [hasWebgl, setHasWebgl] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebgl(false);
    } catch {
      setHasWebgl(false);
    }
  }, []);

  if (!hasWebgl) {
    return <Hero3DFallback />;
  }

  return (
    <div className="w-full h-[400px] sm:h-[480px] lg:h-[550px] relative select-none">
      <Suspense fallback={<Hero3DFallback />}>
        <Canvas
          shadows
          camera={{ position: [0, 3.5, 6], fov: 45 }}
          className="cursor-grab active:cursor-grabbing"
          gl={{ antialias: true, alpha: true }}
        >
          {/* Studio Luxury Lighting */}
          <ambientLight intensity={0.8} />
          <spotLight
            position={[5, 8, 5]}
            angle={0.4}
            penumbra={1}
            intensity={2}
            color="#FFF5E0"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-4, 3, -3]} intensity={1.5} color="#881A2D" />
          <pointLight position={[3, -1, 3]} intensity={1.2} color="#D4AF37" />

          {/* Gentle float */}
          <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.6}>
            <LuxuryCenterpiece />
          </Float>

          {/* Shadow beneath plate */}
          <ContactShadows
            position={[0, -0.6, 0]}
            opacity={0.65}
            scale={8}
            blur={2.5}
            far={4}
            color="#000000"
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            dampingFactor={0.05}
          />
        </Canvas>
      </Suspense>

      {/* Interaction cue badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] uppercase tracking-widest text-[#D4AF37] pointer-events-none flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
        Interactive 3D Dish • Drag to Rotate
      </div>
    </div>
  );
}
