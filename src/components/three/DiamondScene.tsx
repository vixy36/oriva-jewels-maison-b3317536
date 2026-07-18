import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Sparkles, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Global cinematic 3D scene mounted behind all content.
 * A stylized brilliant-cut diamond floats above a gold band.
 * Scroll drives camera + object choreography across page sections.
 */

// Round-brilliant-ish diamond built from two cones (crown + pavilion).
function Diamond() {
  const group = useRef<THREE.Group>(null!);
  const scroll = useScrollProgress();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const s = scroll.current;
    if (!group.current) return;

    // continuous slow spin + scroll-driven tilt
    group.current.rotation.y += delta * 0.35;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      Math.sin(t * 0.4) * 0.15 + s * Math.PI * 0.6,
      0.05,
    );
    // subtle vertical drift with scroll
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      0.2 + Math.sin(t * 0.6) * 0.1 - s * 1.4,
      0.05,
    );
  });

  const diamondMat = (
    <meshPhysicalMaterial
      color="#ffffff"
      roughness={0}
      metalness={0}
      transmission={1}
      thickness={1.4}
      ior={2.42}
      dispersion={1}
      attenuationDistance={2}
      attenuationColor="#f6efe4"
      clearcoat={1}
      clearcoatRoughness={0}
      envMapIntensity={2.2}
      specularIntensity={1}
    />
  );

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={group} position={[0, 0.2, 0]}>
        {/* Crown */}
        <mesh position={[0, 0.35, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.9, 0.55, 16, 1]} />
          {diamondMat}
        </mesh>
        {/* Table (flat top disc) */}
        <mesh position={[0, 0.625, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.42, 16]} />
          {diamondMat}
        </mesh>
        {/* Pavilion */}
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.9, 1.05, 16, 1]} />
          {diamondMat}
        </mesh>

        {/* Gold band */}
        <group position={[0, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.7, 0.09, 32, 128]} />
            <meshPhysicalMaterial
              color="#d6b98c"
              metalness={1}
              roughness={0.15}
              clearcoat={1}
              clearcoatRoughness={0.05}
              envMapIntensity={1.6}
            />
          </mesh>
          {/* Prongs */}
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
                  roughness={0.2}
                  envMapIntensity={1.6}
                />
              </mesh>
            );
          })}
        </group>
      </group>
    </Float>
  );
}

// Camera that reacts to scroll progress.
function ScrollCamera() {
  const { camera } = useThree();
  const scroll = useScrollProgress();

  useFrame(() => {
    const s = scroll.current;
    // Choreographed keyframes: [scrollPct, camera pos, look target]
    const keys: Array<{
      at: number;
      pos: [number, number, number];
      look: [number, number, number];
    }> = [
      { at: 0, pos: [0, 0.4, 3.4], look: [0, 0.1, 0] },
      { at: 0.15, pos: [2.2, 0.8, 2.8], look: [0, 0, 0] },
      { at: 0.35, pos: [-2.5, 1.4, 2.2], look: [0, -0.2, 0] },
      { at: 0.55, pos: [0, 2.6, 2.4], look: [0, 0, 0] },
      { at: 0.75, pos: [1.8, 0.2, 3.0], look: [0, 0.1, 0] },
      { at: 1, pos: [0, 0.5, 4.2], look: [0, 0, 0] },
    ];

    let a = keys[0], b = keys[keys.length - 1];
    for (let i = 0; i < keys.length - 1; i++) {
      if (s >= keys[i].at && s <= keys[i + 1].at) {
        a = keys[i];
        b = keys[i + 1];
        break;
      }
    }
    const span = Math.max(0.0001, b.at - a.at);
    const k = THREE.MathUtils.smoothstep((s - a.at) / span, 0, 1);
    const px = THREE.MathUtils.lerp(a.pos[0], b.pos[0], k);
    const py = THREE.MathUtils.lerp(a.pos[1], b.pos[1], k);
    const pz = THREE.MathUtils.lerp(a.pos[2], b.pos[2], k);
    camera.position.lerp(new THREE.Vector3(px, py, pz), 0.08);

    const lx = THREE.MathUtils.lerp(a.look[0], b.look[0], k);
    const ly = THREE.MathUtils.lerp(a.look[1], b.look[1], k);
    const lz = THREE.MathUtils.lerp(a.look[2], b.look[2], k);
    camera.lookAt(lx, ly, lz);
  });

  return null;
}

// Shared scroll progress ref (0..1)
const scrollRef = { current: 0 };
function useScrollProgress() {
  return scrollRef;
}
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

export function DiamondScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
      style={{
        // faint radial vignette behind
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(214,185,140,0.09), transparent 60%)",
      }}
    >
      <ScrollProgressBinder />
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.4, 3.4], fov: 38 }}
      >
        <color attach="background" args={["#00000000"]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} color="#fff2d8" />
        <directionalLight position={[-5, 2, -3]} intensity={1.2} color="#8ac6b3" />
        <pointLight position={[0, -2, 2]} intensity={1.5} color="#d6b98c" />

        <ScrollCamera />
        <Diamond />

        <Sparkles count={80} scale={8} size={2.4} speed={0.3} color="#f4e4c4" opacity={0.9} />
        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.45}
          scale={6}
          blur={2.4}
          far={3}
        />

        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}

export default DiamondScene;
