/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useRef, useMemo, useState, useEffect, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Particles from "./Particles";
import PerformanceMonitor from "./PerformanceMonitor";
import { TVNoiseEffect } from "./TVNoiseEffect";

const NoiseShader = memo(({ mouse }) => {
  const meshRef = useRef();

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    #define LAYER_COUNT 25

    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;

    // 3D Perlin noise from iq / stegu
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289((x * 34.0 + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    mat2 rotate2D(float a) {
      float s = sin(a);
      float c = cos(a);
      return mat2(c, -s, s, c);
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      vec2 mouse = vec2(uMouse.x, -uMouse.y);

    // Nova paleta refinada para melhor harmonia
    vec3 deep = vec3(0.47, 0.0, 0.0);          // #780000 - vermelho escuro (base)
    vec3 mid = vec3(0.0, 0.188, 0.286);        // #003049 - azul escuro (camada média)
    vec3 highlight = vec3(0.4, 0.608, 0.737);  // #669BBC - azul claro (destaques)

      vec3 accum = vec3(0.0);
      float weight = 0.0;

      float swirl = 0.14 + length(mouse) * 0.08;
      float time = uTime * 0.034;

      for (int i = 0; i < LAYER_COUNT; i++) {
        float t = float(i) / float(LAYER_COUNT - 1);

        vec2 rotated = rotate2D(swirl * t + time * 0.65) * uv;
        vec3 samplePos = vec3(rotated * (1.4 + t * 1.2), time + t * 1.5);

        float base = snoise(samplePos);
        float density = smoothstep(-0.4, 0.85, base);

        vec3 shade = mix(deep, mid, density);
        shade += highlight * smoothstep(0.38, 0.72, density) * 0.55;

        accum += shade * density;
        weight += density;
      }

      vec3 color = accum / max(weight, 0.0001);

      float distToMouse = length((vUv - 0.5) - mouse * 0.25);
      float mouseGlow = exp(-distToMouse * 2.4);
      color += highlight * mouseGlow * 0.95;

      float vignette = smoothstep(1.38, 0.58, length(uv));
      color *= vignette;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) }
    }),
    []
  );

  const mouseVector = useRef(new THREE.Vector2(0, 0));

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();

      // Reuse vector instead of creating new one
      mouseVector.current.set(mouse.x, mouse.y);
      meshRef.current.material.uniforms.uMouse.value.lerp(
        mouseVector.current,
        0.1
      );
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -20]} renderOrder={-1}>
      <planeGeometry args={[100, 100, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
});

NoiseShader.displayName = "NoiseShader";

const NoiseBackground = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [connectProgress, setConnectProgress] = useState(0);

  // Adaptive performance settings
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const dpr = isMobile ? [0.3, 0.5] : [0.5, 0.8];
  const particleCount = isMobile ? 400 : 800;

  useEffect(() => {
    let rafId = null;
    let lastX = 0;
    let lastY = 0;

    // Throttle mouse updates on mobile
    const handleMouseMove = isMobile ? null : (e) => {
      lastX = e.clientX / window.innerWidth;
      lastY = -(e.clientY / window.innerHeight);

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          setMouse({ x: lastX, y: lastY });
          rafId = null;
        });
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        lastX = touch.clientX / window.innerWidth - 1;
        lastY = -(touch.clientY / window.innerHeight) + 1;

        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            setMouse({ x: lastX, y: lastY });
            rafId = null;
          });
        }
      }
    };

    const handleScroll = () => {
      // Calculate scroll progress (0 to 1)
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(scrolled / documentHeight, 1);

      // Calculate CONNECT section progress with smoother transition
      const connectSection = document.querySelector('.connect-section');
      if (connectSection) {
        const rect = connectSection.getBoundingClientRect();
        const sectionTop = rect.top + scrolled;
        const sectionHeight = rect.height;

        // Extended trigger range for smoother transition
        const triggerStart = sectionTop - windowHeight * 1.5;
        const triggerEnd = sectionTop + sectionHeight * 0.5;
        const triggerRange = triggerEnd - triggerStart;

        const rawProgress = Math.max(0, Math.min(1, (scrolled - triggerStart) / triggerRange));

        // Apply easing for smoother transition
        const connectScroll = rawProgress * rawProgress * (3 - 2 * rawProgress); // Smoothstep easing

        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            setScrollProgress(progress);
            setConnectProgress(connectScroll);
            rafId = null;
          });
        }
      } else if (!rafId) {
        rafId = requestAnimationFrame(() => {
          setScrollProgress(progress);
          rafId = null;
        });
      }
    };

    if (handleMouseMove) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Trigger initial scroll calculation
    handleScroll();

    return () => {
      if (handleMouseMove) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none"
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        dpr={dpr}
        performance={{ min: 0.3, max: 0.8, debounce: 200 }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: false,
          logarithmicDepthBuffer: false
        }}
        frameloop="always"
      >
        <PerformanceMonitor />
        <TVNoiseEffect particleCount={isMobile ? 100 : 200} />
        <Particles count={particleCount} scrollProgress={scrollProgress} connectProgress={connectProgress} />
        <NoiseShader mouse={mouse} />
      </Canvas>
    </div>
  );
};

export default NoiseBackground;
