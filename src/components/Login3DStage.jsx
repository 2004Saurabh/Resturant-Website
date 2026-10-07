import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, ContactShadows, MeshDistortMaterial } from '@react-three/drei';
import { RotateCw, Sparkles, Compass, Award, Flame, Eye } from 'lucide-react';
import * as THREE from 'three';

// 3D Procedural Haute Cuisine Centerpiece
function CulinaryModel3D({ dishPreset, isAutoSpin }) {
  const groupRef = useRef();
  const ringRef = useRef();
  const garnishRef = useRef();

  useFrame((state, delta) => {
    if (isAutoSpin && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.25;
    }
    if (garnishRef.current) {
      garnishRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.1, 0]}>
      {/* Matte Obsidian Porcelain Base */}
      <mesh position={[0, -0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.6, 1.9, 0.22, 64]} />
        <meshStandardMaterial
          color="#141418"
          roughness={0.16}
          metalness={0.85}
        />
      </mesh>

      {/* 24K Brushed Gold Filigree Rim */}
      <mesh position={[0, -0.13, 0]}>
        <torusGeometry args={[2.55, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>

      {/* Inner Champagne Gold Inlay */}
      <mesh position={[0, -0.12, 0]}>
        <torusGeometry args={[1.8, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#D4AF37"
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>

      {/* Main Gastronomic Core Element */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <sphereGeometry args={[dishPreset.sphereRadius || 0.88, 64, 64]} />
        <MeshDistortMaterial
          color={dishPreset.foodColor || '#881A2D'}
          speed={1.8}
          distort={dishPreset.distort || 0.24}
          roughness={0.25}
          metalness={dishPreset.metalness || 0.6}
        />
      </mesh>

      {/* Floating Micro-Garnish Orbit */}
      <group ref={ringRef} position={[0, 0.45, 0]}>
        <mesh position={[1.35, 0.25, 0]}>
          <boxGeometry args={[0.2, 0.03, 0.2]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.98} roughness={0.08} />
        </mesh>
        <mesh position={[-1.25, -0.15, 0.7]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#10B981" roughness={0.3} />
        </mesh>
        <mesh position={[0.4, -0.25, -1.2]}>
          <torusGeometry args={[0.18, 0.03, 16, 32]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.9} />
        </mesh>
      </group>

      {/* Fine Crystal Glass Cloche with Opalescent Refraction */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[1.75, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transparent
          opacity={0.16}
          roughness={0.08}
          metalness={0.15}
          transmission={0.88}
          ior={1.45}
        />
      </mesh>

      {/* Handcrafted Golden Finial Top */}
      <mesh position={[0, 1.88, 0]}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.98} roughness={0.1} />
      </mesh>
    </group>
  );
}

// Fallback Display if WebGL is unavailable
function Stage3DFallback({ currentPreset }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full p-3 border-2 border-[#D4AF37]/40 bg-[#121216] shadow-2xl shadow-black flex items-center justify-center">
        <img
          src={currentPreset.image}
          alt={currentPreset.name}
          className="w-full h-full rounded-full object-cover shadow-2xl animate-spin-slow"
        />
        <div className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/50 pointer-events-none" />
      </div>
      <p className="mt-4 text-xs font-cinzel text-[#D4AF37] tracking-widest uppercase">
        {currentPreset.name}
      </p>
    </div>
  );
}

export default function Login3DStage({ onSelectDish }) {
  const [hasWebgl, setHasWebgl] = useState(true);
  const [activeDishIndex, setActiveDishIndex] = useState(0);
  const [isAutoSpin, setIsAutoSpin] = useState(true);

  const presets = [
    {
      id: 'biryani',
      name: 'Royal Saffron Dum Biryani',
      cuisine: 'Awadhi Heritage',
      price: '₹590',
      foodColor: '#D97706',
      distort: 0.28,
      metalness: 0.5,
      sphereRadius: 0.9,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
      tag: 'Chef Signature'
    },
    {
      id: 'butter-chicken',
      name: 'Smoked Truffle Butter Chicken',
      cuisine: 'French-Indian Fusion',
      price: '₹650',
      foodColor: '#881A2D',
      distort: 0.22,
      metalness: 0.7,
      sphereRadius: 0.92,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80',
      tag: 'Michelin Starred'
    },
    {
      id: 'paneer-tikka',
      name: 'Charcoal Smoked Paneer Tikka',
      cuisine: 'North Indian Clay Oven',
      price: '₹370',
      foodColor: '#EA580C',
      distort: 0.18,
      metalness: 0.4,
      sphereRadius: 0.85,
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80',
      tag: 'Artisanal Starter'
    },
    {
      id: 'dessert-gold',
      name: '24K Gold Glaze Chocolate Sphere',
      cuisine: 'Pastry & Confectionery',
      price: '₹420',
      foodColor: '#B45309',
      distort: 0.15,
      metalness: 0.9,
      sphereRadius: 0.88,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
      tag: 'Edible 24K Gold'
    }
  ];

  const currentPreset = presets[activeDishIndex];

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebgl(false);
    } catch {
      setHasWebgl(false);
    }
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[640px] rounded-3xl bg-gradient-to-b from-[#16161B]/95 via-[#0F0F13]/98 to-[#0A0A0C] border border-white/10 overflow-hidden flex flex-col justify-between shadow-2xl shadow-black p-5 sm:p-7">
      
      {/* Top Header: Restaurant 3D Stage Telemetry */}
      <div className="flex items-center justify-between z-10 gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
            <span>3D Culinary Stage</span>
          </span>
          <span className="text-xs text-white/60 font-mono hidden sm:inline">
            Realtime 360° Visualizer
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#D4AF37] bg-white/5 border border-white/10 px-3 py-1 rounded-full font-mono">
            {currentPreset.price}
          </span>
          <button
            type="button"
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`p-1.5 rounded-xl border text-xs transition-colors ${
              isAutoSpin
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                : 'bg-white/5 border-white/10 text-[#8E8E99]'
            }`}
            title={isAutoSpin ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoSpin ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          </button>
        </div>
      </div>

      {/* Interactive 3D Canvas Stage */}
      <div className="relative flex-1 w-full flex items-center justify-center my-3 select-none min-h-[320px]">
        {hasWebgl ? (
          <Suspense fallback={<Stage3DFallback currentPreset={currentPreset} />}>
            <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing">
              <Canvas
                shadows
                camera={{ position: [0, 3.2, 5.8], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
              >
                <ambientLight intensity={0.9} />
                <spotLight
                  position={[5, 8, 5]}
                  angle={0.4}
                  penumbra={1}
                  intensity={2.2}
                  color="#FFF8E8"
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                />
                <pointLight position={[-4, 3, -3]} intensity={1.5} color={currentPreset.foodColor} />
                <pointLight position={[3, -1, 3]} intensity={1.4} color="#D4AF37" />

                <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.5}>
                  <CulinaryModel3D dishPreset={currentPreset} isAutoSpin={isAutoSpin} />
                </Float>

                <ContactShadows
                  position={[0, -0.65, 0]}
                  opacity={0.7}
                  scale={7}
                  blur={2.4}
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
            </div>
          </Suspense>
        ) : (
          <Stage3DFallback currentPreset={currentPreset} />
        )}

        {/* Ambient Radial Color Bloom */}
        <div
          className="absolute w-72 h-72 rounded-full blur-[110px] pointer-events-none -z-0 opacity-25 transition-all duration-700"
          style={{ backgroundColor: currentPreset.foodColor }}
        />

        {/* Interaction Hint Pill */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-black/70 border border-white/10 backdrop-blur-md text-[10px] uppercase tracking-wider text-[#D4AF37] pointer-events-none flex items-center gap-1.5 z-10 shadow-lg">
          <Compass className="w-3.5 h-3.5 text-[#D4AF37] animate-spin-slow" />
          <span>Interactive Cloche • Click & Drag to Orbit 360°</span>
        </div>
      </div>

      {/* Bottom: Dish Information & 4-Course Tasting Switcher */}
      <div className="space-y-3.5 z-10 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#F7F4EE]">
              {currentPreset.name}
            </h3>
            <p className="text-xs text-[#D4AF37]">
              {currentPreset.cuisine} • <span className="text-[#8E8E99]">{currentPreset.tag}</span>
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/90">
            Course {activeDishIndex + 1} of {presets.length}
          </span>
        </div>

        {/* 4-Course Tasting Carousel Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((preset, idx) => {
            const isSelected = activeDishIndex === idx;
            return (
              <button
                type="button"
                key={preset.id}
                onClick={() => {
                  setActiveDishIndex(idx);
                  if (onSelectDish) onSelectDish(preset);
                }}
                className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15 ring-1 ring-[#D4AF37]/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <img
                  src={preset.image}
                  alt={preset.name}
                  className="w-9 h-9 rounded-lg object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0 pr-1">
                  <p className={`text-[11px] font-semibold truncate ${isSelected ? 'text-[#D4AF37]' : 'text-[#F7F4EE]'}`}>
                    {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
                  </p>
                  <p className="text-[10px] text-[#8E8E99] font-mono">
                    {preset.price}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
