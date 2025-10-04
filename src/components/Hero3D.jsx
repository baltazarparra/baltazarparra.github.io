/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useRef, Suspense, useState, useEffect, memo, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration
} from "@react-three/postprocessing";
import * as THREE from "three";

const FloatingModel = memo(({ mouse, containerSize }) => {
  const meshRef = useRef();
  const lightRef = useRef();
  const { scene } = useGLTF("/smile.glb");
  const { viewport } = useThree();

  // Calculate responsive scale based on container size - Apple-inspired proportions
  const getResponsiveScale = () => {
    if (containerSize.width <= 280) {
      return 2.4; // Mobile - muito mais conservador
    } else if (containerSize.width <= 320) {
      return 2.5; // Tablet small
    } else if (containerSize.width <= 400) {
      return 1.8; // Desktop
    } else if (containerSize.width <= 480) {
      return 1.6; // Large Desktop
    } else {
      return 2.85; // Extra Large
    }
  };

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

      // Update scale responsively
      const targetScale = getResponsiveScale();
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
      );
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
        scale={getResponsiveScale()}
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
});

FloatingModel.displayName = "FloatingModel";

useGLTF.preload("/smile.glb");

const Hero3D = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({
    width: 400,
    height: 400
  });
  const containerRef = useRef(null);
  const rafIdRef = useRef(null);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let resizeRafId = null;

    const updateSize = () => {
      if (!resizeRafId) {
        resizeRafId = requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setContainerSize({ width: rect.width, height: rect.height });
          }
          resizeRafId = null;
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });
    return () => {
      window.removeEventListener("resize", updateSize);
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
    };
  }, []);

  // Global touch event for mobile - react to touch anywhere on screen
  useEffect(() => {
    const handleGlobalTouch = (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        lastMouseRef.current.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        lastMouseRef.current.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

        if (!rafIdRef.current) {
          rafIdRef.current = requestAnimationFrame(() => {
            setMouse({ ...lastMouseRef.current });
            rafIdRef.current = null;
          });
        }
      }
    };

    window.addEventListener("touchmove", handleGlobalTouch, { passive: true });
    window.addEventListener("touchstart", handleGlobalTouch, { passive: true });

    return () => {
      window.removeEventListener("touchmove", handleGlobalTouch);
      window.removeEventListener("touchstart", handleGlobalTouch);
    };
  }, []);

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    lastMouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    lastMouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(() => {
        setMouse({ ...lastMouseRef.current });
        rafIdRef.current = null;
      });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      lastMouseRef.current.x =
        ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      lastMouseRef.current.y =
        -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          setMouse({ ...lastMouseRef.current });
          rafIdRef.current = null;
        });
      }
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      lastMouseRef.current.x =
        ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      lastMouseRef.current.y =
        -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      setMouse({ ...lastMouseRef.current });
    }
  };

  // Calculate responsive camera settings - Apple-inspired viewport (memoized)
  const cameraSettings = useMemo(() => {
    if (containerSize.width <= 280) {
      return { position: [0, 0, 7.5], fov: 45 }; // Mobile - câmera mais afastada, FOV controlado
    } else if (containerSize.width <= 320) {
      return { position: [0, 0, 7], fov: 45 }; // Tablet small
    } else if (containerSize.width <= 400) {
      return { position: [0, 0, 6.5], fov: 42 }; // Desktop
    } else if (containerSize.width <= 480) {
      return { position: [0, 0, 6], fov: 40 }; // Large Desktop
    } else {
      return { position: [0, 0, 5.8], fov: 38 }; // Extra Large - FOV mais apertado para controle
    }
  }, [containerSize.width]);

  return (
    <div
      ref={containerRef}
      className="hero-3d-container"
      onPointerMove={handlePointerMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
    >
      <Canvas
        camera={{
          position: cameraSettings.position,
          fov: cameraSettings.fov
        }}
        dpr={[0.8, 1.5]}
        performance={{ min: 0.5, max: 0.9 }}
        gl={{
          powerPreference: "high-performance",
          antialias: true
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow={false}
        />
        <spotLight
          position={[10, 20, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          castShadow={false}
        />

        <Suspense fallback={null}>
          <FloatingModel mouse={mouse} containerSize={containerSize} />
        </Suspense>

        <EffectComposer multisampling={1} disableNormalPass={true}>
          <Bloom
            intensity={1.6}
            luminanceThreshold={1.4}
            luminanceSmoothing={1.8}
            mipmapBlur={true}
          />
          <ChromaticAberration offset={[0.001, 0.001]} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Hero3D;
