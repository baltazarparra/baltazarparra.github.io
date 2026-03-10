/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useRef, Suspense, useState, useEffect, memo, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  EffectComposer,
  ChromaticAberration
} from "@react-three/postprocessing";
import * as THREE from "three";
import { getQualityConfig } from "../config/qualityConfig";

const ZERO_POINTER = { x: 0, y: 0 };

const HERO_RENDER_PROFILES = {
  ULTRA: {
    desktop: { dpr: [1.25, 2], antialias: true, enablePost: true, multisampling: 4 },
    mobile: { dpr: [1.1, 1.6], antialias: true, enablePost: false, multisampling: 0 }
  },
  HIGH: {
    desktop: { dpr: [1, 1.75], antialias: true, enablePost: true, multisampling: 2 },
    mobile: { dpr: [1, 1.4], antialias: true, enablePost: false, multisampling: 0 }
  },
  MEDIUM: {
    desktop: { dpr: [0.9, 1.25], antialias: true, enablePost: false, multisampling: 0 },
    mobile: { dpr: [0.85, 1.15], antialias: true, enablePost: false, multisampling: 0 }
  },
  LOW: {
    desktop: { dpr: [0.75, 1], antialias: false, enablePost: false, multisampling: 0 },
    mobile: { dpr: [0.7, 0.9], antialias: false, enablePost: false, multisampling: 0 }
  }
};

const getHeroRenderSettings = (tierName, isMobile, reduceMotion) => {
  const profile = HERO_RENDER_PROFILES[tierName] || HERO_RENDER_PROFILES.HIGH;
  const deviceProfile = isMobile ? profile.mobile : profile.desktop;

  return {
    dpr: deviceProfile.dpr,
    antialias: deviceProfile.antialias,
    enablePost: deviceProfile.enablePost && !reduceMotion,
    multisampling: deviceProfile.enablePost && !reduceMotion
      ? deviceProfile.multisampling
      : 0
  };
};

const getModelFitProfile = (width, isMobileViewport) => {
  if (!isMobileViewport) {
    if (width <= 280) {
      return { fillX: 0.62, fillY: 0.62 };
    }
    if (width <= 320) {
      return { fillX: 0.64, fillY: 0.64 };
    }
    if (width <= 400) {
      return { fillX: 0.66, fillY: 0.66 };
    }
    if (width <= 480) {
      return { fillX: 0.68, fillY: 0.68 };
    }
    if (width <= 560) {
      return { fillX: 0.7, fillY: 0.7 };
    }
    return { fillX: 0.72, fillY: 0.72 };
  }

  if (width <= 280) {
    return { fillX: 0.72, fillY: 0.72 };
  }
  if (width <= 320) {
    return { fillX: 0.74, fillY: 0.74 };
  }
  if (width <= 400) {
    return { fillX: 0.76, fillY: 0.76 };
  }
  if (width <= 480) {
    return { fillX: 0.78, fillY: 0.78 };
  }
  return { fillX: 0.78, fillY: 0.78 };
};

const getCameraSettings = (width, isMobileViewport) => {
  if (!isMobileViewport) {
    if (width <= 280) {
      return { position: [1, -2, 7.4], fov: 45 };
    }
    if (width <= 320) {
      return { position: [1, -2, 7.1], fov: 44 };
    }
    if (width <= 400) {
      return { position: [1, -2, 6.7], fov: 42 };
    }
    if (width <= 480) {
      return { position: [1, -2, 6.35], fov: 40 };
    }
    if (width <= 560) {
      return { position: [1, -2, 6.15], fov: 38 };
    }
    return { position: [1, -2, 6.05], fov: 37 };
  }

  if (width <= 280) {
    return {
      position: [0.85, -1.85, 6.95],
      fov: 42
    };
  }
  if (width <= 320) {
    return {
      position: [0.9, -1.9, 6.55],
      fov: 40
    };
  }
  if (width <= 400) {
    return {
      position: [1, -1.95, 6.15],
      fov: 39
    };
  }
  if (width <= 480) {
    return { position: [1, -2, 5.95], fov: 39 };
  }
  return { position: [1, -2, 5.9], fov: 38 };
};

const getScrollMotionProfile = (width, isMobileViewport) => {
  if (isMobileViewport) {
    if (width <= 320) {
      return {
        scaleBoost: 0.12,
        liftMultiplier: 0.18,
        gazeRotation: 0.14,
        gazeOffset: 0.08
      };
    }

    return {
      scaleBoost: 0.16,
      liftMultiplier: 0.22,
      gazeRotation: 0.16,
      gazeOffset: 0.1
    };
  }

  if (width <= 400) {
    return {
      scaleBoost: 0.1,
      liftMultiplier: 0.14,
      gazeRotation: 0.15,
      gazeOffset: 0.08
    };
  }

  return {
    scaleBoost: 0.14,
    liftMultiplier: 0.18,
    gazeRotation: 0.18,
    gazeOffset: 0.1
  };
};

const getStageMotionProfile = (width, isMobileViewport) => {
  if (isMobileViewport) {
    if (width <= 320) {
      return {
        baseYOffset: 0,
        floatAmplitude: 0.08
      };
    }

    return {
      baseYOffset: 0,
      floatAmplitude: 0.085
    };
  }

  if (width <= 400) {
    return {
      baseYOffset: 0.01,
      floatAmplitude: 0.085
    };
  }

  return {
    baseYOffset: 0.015,
    floatAmplitude: 0.09
  };
};

const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

const CameraTarget = memo(({ cameraPosition }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...cameraPosition);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, cameraPosition]);

  return null;
});

CameraTarget.displayName = "CameraTarget";

const FloatingModel = memo(
  ({ mouseRef, scrollProgressRef, containerSize, isMobile, reduceMotion }) => {
    const scrollGroupRef = useRef();
    const baseGroupRef = useRef();
    const gazeGroupRef = useRef();
    const modelRef = useRef();
    const accentLightRef = useRef();
    const gazeLightRef = useRef();
  const { scene } = useGLTF("/smile.glb");
  const { viewport } = useThree();
    const modelFitProfile = useMemo(
      () => getModelFitProfile(containerSize.width, isMobile),
      [containerSize.width, isMobile]
    );
    const motionProfile = useMemo(
      () => getScrollMotionProfile(containerSize.width, isMobile),
      [containerSize.width, isMobile]
    );
    const stageMotionProfile = useMemo(
      () => getStageMotionProfile(containerSize.width, isMobile),
      [containerSize.width, isMobile]
    );
    const modelBounds = useMemo(() => {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      return {
        centerOffset: [-center.x, -center.y, -center.z],
        size
      };
    }, [scene]);
    const fittedBaseScale = useMemo(() => {
      const safeWidth = Math.max(modelBounds.size.x, 0.001);
      const safeHeight = Math.max(modelBounds.size.y, 0.001);
      const fitWidth = viewport.width * modelFitProfile.fillX / safeWidth;
      const fitHeight = viewport.height * modelFitProfile.fillY / safeHeight;

      return Math.min(fitWidth, fitHeight);
    }, [
      modelBounds.size.x,
      modelBounds.size.y,
      modelFitProfile.fillX,
      modelFitProfile.fillY,
      viewport.width,
      viewport.height
    ]);

  // Apply smooth shading to all meshes for better quality
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry.computeVertexNormals();
        if (child.material) {
          child.material.flatShading = false;
          child.material.roughness = 0.32;
          child.material.metalness = 0.06;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame(({ clock }) => {
    const mouse = mouseRef.current || ZERO_POINTER;
    const scrollProgress = reduceMotion
      ? 0
      : THREE.MathUtils.clamp(scrollProgressRef.current || 0, 0, 1);
    const scrollEase = easeOutCubic(scrollProgress);
    const floatY =
      stageMotionProfile.baseYOffset +
      Math.sin(clock.getElapsedTime() * 0.6) * stageMotionProfile.floatAmplitude;
    const gazeWeight = 1 - scrollEase * 0.45;
    const targetScrollLift =
      viewport.height * motionProfile.liftMultiplier * scrollEase;
    const targetScale =
      fittedBaseScale * (1 + scrollEase * motionProfile.scaleBoost);

    if (scrollGroupRef.current) {
      scrollGroupRef.current.position.y = THREE.MathUtils.lerp(
        scrollGroupRef.current.position.y,
        targetScrollLift,
        0.08
      );
      scrollGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(
          scrollGroupRef.current.scale.x,
          targetScale,
          0.08
        )
      );
      scrollGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        scrollGroupRef.current.rotation.z,
        mouse.x * -0.04 * gazeWeight,
        0.04
      );
    }

    if (baseGroupRef.current) {
      const t = clock.getElapsedTime();

      // Mouse interaction - smooth follow
      baseGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        baseGroupRef.current.rotation.y,
        mouse.x * 0.32,
        0.05
      );
      baseGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        baseGroupRef.current.rotation.x,
        mouse.y * 0.2,
        0.05
      );

      // Subtle rotation
      baseGroupRef.current.rotation.z = Math.cos(t * 0.4) * 0.1;
      baseGroupRef.current.position.y = THREE.MathUtils.lerp(
        baseGroupRef.current.position.y,
        floatY,
        0.08
      );
    }

    if (gazeGroupRef.current) {
      gazeGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        gazeGroupRef.current.rotation.y,
        mouse.x * motionProfile.gazeRotation * gazeWeight,
        0.08
      );
      gazeGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        gazeGroupRef.current.rotation.x,
        mouse.y * motionProfile.gazeRotation * 0.65 * gazeWeight,
        0.08
      );
      gazeGroupRef.current.position.x = THREE.MathUtils.lerp(
        gazeGroupRef.current.position.x,
        mouse.x * motionProfile.gazeOffset * gazeWeight,
        0.08
      );
      gazeGroupRef.current.position.y = THREE.MathUtils.lerp(
        gazeGroupRef.current.position.y,
        mouse.y * motionProfile.gazeOffset * 0.7 * gazeWeight,
        0.08
      );
    }

    if (modelRef.current) {
      modelRef.current.rotation.z = THREE.MathUtils.lerp(
        modelRef.current.rotation.z,
        mouse.x * -0.025 * gazeWeight,
        0.06
      );
    }

    // Dynamic light following mouse
    if (accentLightRef.current) {
      accentLightRef.current.position.x = THREE.MathUtils.lerp(
        accentLightRef.current.position.x,
        mouse.x * viewport.width * 0.5,
        0.06
      );
      accentLightRef.current.position.y = THREE.MathUtils.lerp(
        accentLightRef.current.position.y,
        mouse.y * viewport.height * 0.5,
        0.06
      );
    }

    if (gazeLightRef.current) {
      gazeLightRef.current.position.x = THREE.MathUtils.lerp(
        gazeLightRef.current.position.x,
        mouse.x * viewport.width * 0.22,
        0.08
      );
      gazeLightRef.current.position.y = THREE.MathUtils.lerp(
        gazeLightRef.current.position.y,
        viewport.height * 0.1 + mouse.y * viewport.height * 0.18,
        0.08
      );
      gazeLightRef.current.intensity = THREE.MathUtils.lerp(
        gazeLightRef.current.intensity,
        1.35 + (1 - scrollEase) * 0.35,
        0.06
      );
    }
  });

  return (
    <>
      <group ref={scrollGroupRef} scale={fittedBaseScale}>
        <group ref={baseGroupRef}>
          <group ref={gazeGroupRef}>
            <primitive
              ref={modelRef}
              object={scene}
              position={modelBounds.centerOffset}
            />
          </group>
        </group>
      </group>
      <pointLight
        ref={accentLightRef}
        position={[0, 0, 5]}
        intensity={2}
        color="#C1121F"
        distance={8}
      />
      <pointLight
        ref={gazeLightRef}
        position={[0, 0.4, 4.2]}
        intensity={1.35}
        color="#FFF4D6"
        distance={6}
      />
    </>
  );
  }
);

FloatingModel.displayName = "FloatingModel";

useGLTF.preload("/smile.glb");

const Hero3D = ({ reduceMotion = false, isMobile = false }) => {
  const [containerSize, setContainerSize] = useState({
    width: 400,
    height: 400
  });
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef(null);
  const rafIdRef = useRef(null);
  const scrollRafIdRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);
  const qualityConfig = useMemo(() => getQualityConfig(), []);
  const renderSettings = useMemo(
    () => getHeroRenderSettings(qualityConfig?.name, isMobile, reduceMotion),
    [qualityConfig, isMobile, reduceMotion]
  );
  const shouldAnimate = !reduceMotion && isInView;

  const updatePointerPosition = (clientX, clientY) => {
    const heroSection = containerRef.current?.closest(".hero");
    const bounds = heroSection?.getBoundingClientRect();

    if (bounds?.width && bounds?.height) {
      lastMouseRef.current.x = THREE.MathUtils.clamp(
        ((clientX - bounds.left) / bounds.width) * 2 - 1,
        -1,
        1
      );
      lastMouseRef.current.y = THREE.MathUtils.clamp(
        -((clientY - bounds.top) / bounds.height) * 2 + 1,
        -1,
        1
      );
      return;
    }

    lastMouseRef.current.x = THREE.MathUtils.clamp(
      clientX / window.innerWidth * 2 - 1,
      -1,
      1
    );
    lastMouseRef.current.y = THREE.MathUtils.clamp(
      -(clientY / window.innerHeight) * 2 + 1,
      -1,
      1
    );
  };

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

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "200px 0px", threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const containerElement = containerRef.current;

    if (reduceMotion) {
      scrollProgressRef.current = 0;
      if (containerElement) {
        containerElement.style.setProperty("--hero-scroll-scale", "1");
        containerElement.style.setProperty("--hero-scroll-translate-y", "0px");
      }
      return undefined;
    }

    const updateScrollProgress = () => {
      if (!containerRef.current) return;

      const heroSection = containerRef.current.closest(".hero");
      if (!heroSection) return;

      const rect = heroSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const startOffset = viewportHeight * 0.08;
      const travelDistance = Math.max(
        rect.height * 0.9,
        viewportHeight * 0.95
      );
      const progress = THREE.MathUtils.clamp(
        (-rect.top - startOffset) / travelDistance,
        0,
        1
      );
      const easedProgress = easeOutCubic(progress);
      const domScale = isMobile
        ? 1 + easedProgress * 0.22
        : 1 + easedProgress * 0.38;
      const domTranslateY = isMobile
        ? -viewportHeight * 0.18 * easedProgress
        : -viewportHeight * 0.36 * easedProgress;

      scrollProgressRef.current = progress;
      containerRef.current.style.setProperty(
        "--hero-scroll-scale",
        domScale.toFixed(4)
      );
      containerRef.current.style.setProperty(
        "--hero-scroll-translate-y",
        `${domTranslateY.toFixed(2)}px`
      );
    };

    const scheduleScrollUpdate = () => {
      if (scrollRafIdRef.current) return;

      scrollRafIdRef.current = requestAnimationFrame(() => {
        updateScrollProgress();
        scrollRafIdRef.current = null;
      });
    };

    updateScrollProgress();
    window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
    window.addEventListener("resize", scheduleScrollUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleScrollUpdate);
      window.removeEventListener("resize", scheduleScrollUpdate);
      if (scrollRafIdRef.current) cancelAnimationFrame(scrollRafIdRef.current);
      if (containerElement) {
        containerElement.style.removeProperty("--hero-scroll-scale");
        containerElement.style.removeProperty("--hero-scroll-translate-y");
      }
    };
  }, [isMobile, reduceMotion]);

  const scheduleMouseUpdate = () => {
    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(() => {
        mouseRef.current.x = lastMouseRef.current.x;
        mouseRef.current.y = lastMouseRef.current.y;
        rafIdRef.current = null;
      });
    }
  };

  // Global touch event for mobile - react to touch anywhere on screen
  useEffect(() => {
    if (reduceMotion) return undefined;

    const handleGlobalMouse = (e) => {
      updatePointerPosition(e.clientX, e.clientY);
      scheduleMouseUpdate();
    };

    const resetPointer = () => {
      lastMouseRef.current.x = 0;
      lastMouseRef.current.y = 0;
      scheduleMouseUpdate();
    };

    window.addEventListener("mousemove", handleGlobalMouse, { passive: true });
    window.addEventListener("blur", resetPointer);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouse);
      window.removeEventListener("blur", resetPointer);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const handleGlobalTouch = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updatePointerPosition(touch.clientX, touch.clientY);
        scheduleMouseUpdate();
      }
    };

    window.addEventListener("touchmove", handleGlobalTouch, { passive: true });
    window.addEventListener("touchstart", handleGlobalTouch, { passive: true });

    return () => {
      window.removeEventListener("touchmove", handleGlobalTouch);
      window.removeEventListener("touchstart", handleGlobalTouch);
    };
  }, [reduceMotion]);

  const handlePointerMove = (e) => {
    updatePointerPosition(e.clientX, e.clientY);
    scheduleMouseUpdate();
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updatePointerPosition(touch.clientX, touch.clientY);
      scheduleMouseUpdate();
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updatePointerPosition(touch.clientX, touch.clientY);
      mouseRef.current.x = lastMouseRef.current.x;
      mouseRef.current.y = lastMouseRef.current.y;
    }
  };

  const cameraSettings = useMemo(() => {
    return getCameraSettings(containerSize.width, isMobile);
  }, [containerSize.width, isMobile]);

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
        dpr={renderSettings.dpr}
        gl={{
          antialias: renderSettings.antialias,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        frameloop={shouldAnimate ? "always" : "demand"}
      >
        <CameraTarget cameraPosition={cameraSettings.position} />

        <directionalLight
          position={[10, 15, 15]}
          intensity={25}
          castShadow={false}
        />

        <Suspense fallback={null}>
          <FloatingModel
            mouseRef={mouseRef}
            scrollProgressRef={scrollProgressRef}
            containerSize={containerSize}
            isMobile={isMobile}
            reduceMotion={reduceMotion}
          />
        </Suspense>

        {renderSettings.enablePost && (
          <EffectComposer
            multisampling={renderSettings.multisampling}
            disableNormalPass={true}
          >
            <ChromaticAberration offset={[0.004, 0.004]} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default Hero3D;
