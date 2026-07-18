import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, ContactShadows, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

/**
 * Global cinematic 3D scene — stylized brilliant diamond + gold band.
 * Scroll drives camera choreography across the page.
 */

// Shared scroll progress (0..1)
const scrollRef = { current: 0 };

function ScrollProgressBinder() {
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return null;
}

function Diamond() {
  const group = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const s = scrollRef.current;
    if (!group.current) return;
    group.current.rotation.y += delta * 0.4;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      Math.sin(t * 0.4) * 0.12 + s * Math.PI * 0.5,
      0.06,
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      0.25 + Math.sin(t * 0.6) * 0.08 - s * 1.2,
      0.06,
    );
  });

  const diamondMat = (
    <meshPhysicalMaterial
      color="#f7f4ee"
      metalness={0.35}
      roughness={0.05}
      clearcoat={1}
      clearcoatRoughness={0}
      iridescence={1}
      iridescenceIOR={2.0}
      iridescenceThicknessRange={[100, 800]}
      envMapIntensity={2.2}
      emissive="#fff2d8"
      emissiveIntensity={0.15}
    />
  );

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={group} position={[0, 0.15, 0]} scale={1.15}>
        {/* Crown */}
        <mesh position={[0, 0.35, 0]}>
          <coneGeometry args={[0.9, 0.55, 12, 1]} />
          {diamondMat}
        </mesh>
        {/* Table */}
        <mesh position={[0, 0.626, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.42, 12]} />
          {diamondMat}
        </mesh>
        {/* Pavilion */}
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.9, 1.05, 12, 1]} />
          {diamondMat}
        </mesh>

        {/* Girdle glow ring */}
        <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.015, 8, 48]} />
          <meshBasicMaterial color="#fff5e0" />
        </mesh>

        {/* Gold band */}
        <group position={[0, -0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.7, 0.09, 24, 96]} />
            <meshPhysicalMaterial
              color="#d6b98c"
              metalness={1}
              roughness={0.18}
              clearcoat={1}
              clearcoatRoughness={0.05}
              envMapIntensity={1.6}
              emissive="#3a2d18"
              emissiveIntensity={0.25}
            />
          </mesh>
          {Array.from({ length: 4 }).map((_, i) => {
            const a = (i / 4) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(a) * 0.55, Math.sin(a) * 0.55, 0.35]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <cylinderGeometry args={[0.045, 0.045, 0.55, 8]} />
                <meshPhysicalMaterial
                  color="#d6b98c"
                  metalness={1}
                  roughness={0.22}
                  envMapIntensity={1.6}
                  emissive="#3a2d18"
                  emissiveIntensity={0.25}
                />
              </mesh>
            );
          })}
        </group>
      </group>
    </Float>
  );
}

function ScrollCamera() {
  const { camera } = useThree();

  useFrame(() => {
    const s = scrollRef.current;
    const keys: Array<{
      at: number;
      pos: [number, number, number];
      look: [number, number, number];
    }> = [
      { at: 0, pos: [0, 0.4, 3.4], look: [0, 0.1, 0] },
      { at: 0.12, pos: [2.2, 0.8, 2.8], look: [0, 0, 0] },
      { at: 0.28, pos: [-2.5, 1.4, 2.4], look: [0, -0.1, 0] },
      { at: 0.48, pos: [0, 2.4, 2.6], look: [0, 0, 0] },
      { at: 0.7, pos: [1.6, 0.2, 3.0], look: [0, 0.1, 0] },
      { at: 1, pos: [0, 0.6, 4.4], look: [0, 0, 0] },
    ];
    let a = keys[0], b = keys[keys.length - 1];
    for (let i = 0; i < keys.length - 1; i++) {
      if (s >= keys[i].at && s <= keys[i + 1].at) {
        a = keys[i]; b = keys[i + 1]; break;
      }
    }
    const span = Math.max(0.0001, b.at - a.at);
    const k = THREE.MathUtils.smoothstep((s - a.at) / span, 0, 1);
    camera.position.lerp(
      new THREE.Vector3(
        THREE.MathUtils.lerp(a.pos[0], b.pos[0], k),
        THREE.MathUtils.lerp(a.pos[1], b.pos[1], k),
        THREE.MathUtils.lerp(a.pos[2], b.pos[2], k),
      ),
      0.08,
    );
    camera.lookAt(
      THREE.MathUtils.lerp(a.look[0], b.look[0], k),
      THREE.MathUtils.lerp(a.look[1], b.look[1], k),
      THREE.MathUtils.lerp(a.look[2], b.look[2], k),
    );
  });

  return null;
}

// Simple procedural env fallback (no external asset fetch) — small emissive spheres.
function LightRig() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={2.5} color="#fff2d8" />
      <directionalLight position={[-5, 2, -3]} intensity={1.3} color="#8ac6b3" />
      <directionalLight position={[0, -3, 3]} intensity={0.8} color="#d6b98c" />
      <pointLight position={[0, 2, 2]} intensity={1.6} color="#d6b98c" />
    </>
  );
}

export function DiamondScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(214,185,140,0.10), transparent 60%)",
      }}
    >
      <ScrollProgressBinder />
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.4, 3.4], fov: 38 }}
      >
        <LightRig />
        <ScrollCamera />
        <Suspense fallback={null}>
          <Environment preset="studio" />
        </Suspense>
        <Suspense fallback={null}>
          <Diamond />
        </Suspense>
        {/* DEBUG marker — remove once diamond confirmed visible */}
        <mesh position={[0, 0, 0]}>
          <torusKnotGeometry args={[0.4, 0.12, 128, 16]} />
          <meshBasicMaterial color="#ff3355" />
        </mesh>
        <Sparkles count={70} scale={8} size={2.6} speed={0.25} color="#f4e4c4" opacity={0.9} />
        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.5}
          scale={6}
          blur={2.4}
          far={3}
        />
      </Canvas>
    </div>
  );
}

export default DiamondScene;
