import { useRef, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, MeshTransmissionMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

const FloatingModel = ({ mouse }) => {
  const meshRef = useRef();
  const lightRef = useRef();
  const { scene } = useGLTF('/smile.glb');
  const { viewport } = useThree();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();

      // Floating animation
      meshRef.current.position.y = Math.sin(t * 0.6) * 0.15;

      // Mouse interaction - smooth follow
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouse.x * 0.5,
        0.05
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouse.y * 0.3,
        0.05
      );

      // Subtle rotation
      meshRef.current.rotation.z = Math.cos(t * 0.4) * 0.1;
    }

    // Dynamic light following mouse
    if (lightRef.current) {
      lightRef.current.position.x = mouse.x * viewport.width * 0.5;
      lightRef.current.position.y = mouse.y * viewport.height * 0.5;
    }
  });

  return (
    <>
      <primitive
        ref={meshRef}
        object={scene}
        scale={2.2}
        position={[0, 0, 0]}
      />
      <pointLight
        ref={lightRef}
        position={[0, 0, 5]}
        intensity={2}
        color="#FF4C00"
        distance={8}
      />
    </>
  );
};

useGLTF.preload('/smile.glb');

const Hero3D = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMouse({ x, y });
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      setMouse({ x, y });
    }
  };

  return (
    <div
      className="hero-3d-container"
      onPointerMove={handlePointerMove}
      onTouchMove={handleTouchMove}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          castShadow
        />

        <Suspense fallback={null}>
          <FloatingModel mouse={mouse} />
        </Suspense>

        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
          />
          <ChromaticAberration
            offset={[0.001, 0.001]}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Hero3D;
