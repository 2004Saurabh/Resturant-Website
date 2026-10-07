import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import Table3D from './Table3D';

function FloorAndDecor() {
  return (
    <group>
      {/* Polished Obsidian Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial
          color="#0B0B0E"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Decorative Partition / Bar Wall */}
      <mesh position={[0, 1.5, -6]} receiveShadow castShadow>
        <boxGeometry args={[14, 3, 0.4]} />
        <meshStandardMaterial color="#141418" roughness={0.7} />
      </mesh>

      {/* Subtle Warm Brass Accent Strip */}
      <mesh position={[0, 2.6, -5.78]}>
        <boxGeometry args={[13.8, 0.08, 0.08]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

export default function RestaurantScene3D({ tables, selectedTableId, onSelectTable }) {
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
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-[#121215] rounded-3xl border border-white/10 text-center p-6">
        <div>
          <p className="text-sm text-[#D4AF37] font-serif">Interactive Floor Plan Available Below</p>
          <p className="text-xs text-[#8E8E99] mt-1">WebGL is disabled; use the responsive 2D Table Matrix to reserve.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[460px] sm:h-[540px] relative rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0C] shadow-2xl">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center text-xs text-[#8E8E99]">
          Generating 3D Floor Environment...
        </div>
      }>
        <Canvas
          shadows
          camera={{ position: [0, 8.5, 9.5], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          className="cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.65} />
          <directionalLight
            position={[5, 12, 7]}
            intensity={1.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
            color="#FFF4DC"
          />
          <pointLight position={[-4, 4, -2]} intensity={1.2} color="#881A2D" />
          <pointLight position={[4, 4, 3]} intensity={1.2} color="#D4AF37" />

          <FloorAndDecor />

          {/* Render all tables T01 to T12 */}
          {tables.map(table => (
            <Table3D
              key={table.id}
              table={table}
              isSelected={selectedTableId === table.id}
              onSelect={onSelectTable}
            />
          ))}

          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.7}
            scale={15}
            blur={2}
            far={4}
            color="#000000"
          />

          <OrbitControls
            enableZoom={true}
            maxDistance={15}
            minDistance={6}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            dampingFactor={0.05}
          />
        </Canvas>
      </Suspense>

      {/* 3D Scene Overlay Legend */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] text-white">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] text-white">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] text-white">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] text-white">
          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span>Occupied</span>
        </div>
      </div>

      {/* Interaction Help Cue */}
      <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/70 border border-white/10 backdrop-blur-md text-[10px] text-[#D4AF37] pointer-events-none">
        Orbit: Click + Drag • Click Table to Select
      </div>
    </div>
  );
}
