"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  MeshDistortMaterial,
  Sphere,
  Environment,
  ContactShadows,
  Text
} from "@react-three/drei";

function CodingPerson() {
  const personRef = useRef(null);
  const screenRef = useRef(null);

  return (
    <group ref={personRef} position={[0, -1, 0]}>
      {/* Desk */}
      <group position={[0, 0.5, 0]}>
        {/* Desk top */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.1, 1.5]} />
          <meshStandardMaterial color="#8B4513" roughness={0.6} metalness={0.2} />
        </mesh>

        {/* Desk legs */}
        <mesh position={[-1.2, -0.4, -0.6]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[1.2, -0.4, -0.6]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[-1.2, -0.4, 0.6]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[1.2, -0.4, 0.6]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </group>

      {/* Laptop */}
      <group position={[0, 0.6, 0.2]} rotation={[0, 0, 0]}>
        {/* Laptop base */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 0.05, 0.7]} />
          <meshStandardMaterial color="#2C3E50" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Keyboard keys representation */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[-0.3 + i * 0.15, 0.03, 0]} castShadow>
            <boxGeometry args={[0.12, 0.02, 0.5]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        ))}

        {/* Laptop screen */}
        <group position={[0, 0.4, -0.3]} rotation={[-0.2, 0, 0]}>
          {/* Screen frame */}
          <mesh castShadow>
            <boxGeometry args={[1.1, 0.7, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
          </mesh>

          {/* Screen display */}
          <mesh ref={screenRef} position={[0, 0, 0.03]} castShadow>
            <boxGeometry args={[0.95, 0.6, 0.01]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={0.5}
              roughness={0.1}
            />
          </mesh>

          {/* Code lines on screen */}
          <Text
            position={[-0.35, 0.15, 0.04]}
            fontSize={0.05}
            color="#000000"
            anchorX="left"
            anchorY="top"
          >
            {'function malas() {'}
          </Text>
          <Text
            position={[-0.3, 0.05, 0.04]}
            fontSize={0.05}
            color="#000000"
            anchorX="left"
            anchorY="top"
          >
            {'  return tidur;'}
          </Text>
          <Text
            position={[-0.35, -0.05, 0.04]}
            fontSize={0.05}
            color="#000000"
            anchorX="left"
            anchorY="top"
          >
            {'}'}
          </Text>
        </group>
      </group>

      {/* Chair */}
      <group position={[0, 0, -0.8]}>
        {/* Seat */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.4, 0.1, 32]} />
          <meshStandardMaterial color="#34495E" roughness={0.7} />
        </mesh>

        {/* Backrest */}
        <mesh position={[0, 0.7, -0.3]} castShadow>
          <boxGeometry args={[0.7, 0.8, 0.1]} />
          <meshStandardMaterial color="#34495E" roughness={0.7} />
        </mesh>

        {/* Chair pole */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
          <meshStandardMaterial color="#2C3E50" metalness={0.8} />
        </mesh>

        {/* Chair base */}
        <mesh position={[0, -0.3, 0]} rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 5]} />
          <meshStandardMaterial color="#2C3E50" metalness={0.8} />
        </mesh>
      </group>

      {/* Coffee Cup */}
      <group position={[0.8, 0.65, 0.4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.15, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* Coffee */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 0.1, 16]} />
          <meshStandardMaterial color="#6F4E37" roughness={0.5} />
        </mesh>
        {/* Handle */}
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.06, 0.015, 8, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
      </group>

      {/* Floating code symbols */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Text
          position={[-1, 1.8, 0]}
          fontSize={0.2}
          color="#00ff88"
        >
          {'</>'}
        </Text>
      </Float>

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <Text
          position={[1.2, 1.5, 0]}
          fontSize={0.18}
          color="#3498DB"
        >
          {'{ }'}
        </Text>
      </Float>
    </group>
  );
}

// Main Component
export default function CodingScene() {
  return (
    <div className="relative w-full h-full bg-transparent">
      <Canvas
        camera={{ position: [10, 10, 5], fov: 15 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.36} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color={"#3498DB"} />
        <pointLight position={[10, -10, -10]} intensity={0.4} color={"#87CEEB"} />
        <directionalLight position={[0, 5, 5]} intensity={1} color="#ffffff" castShadow />

        {/* Environment for better lighting */}
        <Environment preset={"city"} />

        {/* Coding Person */}
        <CodingPerson />

        {/* Floating Spheres */}
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
          <Sphere position={[-2, 1, 0]} args={[0.2, 32, 32]}>
            <MeshDistortMaterial
              color="#00ff88"
              attach="material"
              distort={0.3}
              speed={2}
              roughness={0.2}
            />
          </Sphere>
        </Float>

        <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
          <Sphere position={[2, -1, -1]} args={[0.15, 32, 32]}>
            <MeshDistortMaterial
              color="#3498DB"
              attach="material"
              distort={0.4}
              speed={1.5}
              roughness={0.2}
            />
          </Sphere>
        </Float>

        {/* Contact Shadows */}
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.5}
          scale={10}
          blur={1}
          far={10}
        />

        {/* Orbit Controls for interaction */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
          autoRotate
          autoRotateSpeed={0.5}
          minDistance={3}
          maxDistance={12}
          zoomSpeed={1}
        />
      </Canvas>
    </div>
  );
}