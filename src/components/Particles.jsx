/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Particles = ({
  count = 800,
  scrollRef,
  connectRef
}) => {
  const pointsRef = useRef();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const vertexShader = `
    uniform float uTime;
    uniform float uSize;
    uniform float uScrollProgress;
    uniform float uConnectProgress;

    attribute float aScale;
    attribute float aSpeed;
    attribute vec3 aOffset;

    varying float vAlpha;
    varying float vIntensity;

    void main() {
      vec3 pos = position;

      // Smooth floating animation with eased CONNECT intensity
      float intensity = 1.0 + uConnectProgress * uConnectProgress * 1.8;
      float t = uTime * aSpeed;
      pos.y += sin(t * intensity + aOffset.x) * (0.5 + uConnectProgress * uConnectProgress * 0.5);
      pos.x += cos(t * 0.7 * intensity + aOffset.y) * (0.3 + uConnectProgress * uConnectProgress * 0.3);
      pos.z += sin(t * 0.5 * intensity + aOffset.z) * (0.4 + uConnectProgress * uConnectProgress * 0.4);

      // Smooth expansion with easing
      float easedConnect = uConnectProgress * uConnectProgress;
      pos *= 1.0 + uScrollProgress * 0.3 + easedConnect * 0.35;

      // Gentle spiral effect with smooth transition
      float spiralStrength = easedConnect * 0.25;
      if (spiralStrength > 0.03) {
        float angle = uTime * 0.25 * spiralStrength;
        float r = length(pos.xz);
        vec2 spiralPos = vec2(cos(angle) * r, sin(angle) * r);
        pos.xz = mix(pos.xz, spiralPos, spiralStrength);
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Smooth size scaling
      float easedSize = 1.0 + easedConnect * 2.2;
      gl_PointSize = uSize * aScale * (300.0 / -mvPosition.z) * easedSize;

      // Higher alpha for better visibility
      vAlpha = (1.0 - length(pos) * 0.06) * (0.9 + easedConnect * 0.1);
      vIntensity = easedConnect;
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uTime;

    varying float vAlpha;
    varying float vIntensity;

    void main() {
      // Optimized circular particle
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);

      if (dist > 0.5) discard;

      // Smooth glow
      float strength = 1.0 - dist * 2.0;
      strength = pow(strength, 1.5 - vIntensity * vIntensity * 0.25);

      // Smooth color mixing com gradiente harmonioso
      vec3 color = mix(uColor1, uColor2, dist);
      // Adiciona sutil destaque vermelho nas partes mais intensas
      color += vec3(0.757, 0.071, 0.122) * vIntensity * vIntensity * strength * 0.15;

      // Smooth pulsing
      float pulse = sin(uTime * 2.0) * 0.25 + 0.75;

      // Higher alpha for visibility
      float alpha = strength * vAlpha * pulse * (0.85 + vIntensity * 0.15);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const { positions, scales, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Create spherical distribution with varying density
      // Adjusted to be visible with camera at z=8
      const radius = Math.random() * 8 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) - 5; // Offset towards camera

      // Random scale (smaller particles are more common)
      scales[i] = Math.pow(Math.random(), 2) * 1.2 + 0.3;

      // Random speed for animation
      speeds[i] = Math.random() * 0.5 + 0.3;

      // Random offsets for variation
      offsets[i3] = Math.random() * Math.PI * 2;
      offsets[i3 + 1] = Math.random() * Math.PI * 2;
      offsets[i3 + 2] = Math.random() * Math.PI * 2;
    }

    return { positions, scales, speeds, offsets };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: isMobile ? 9.0 : 12.0 },
      uScrollProgress: { value: 0 },
      uConnectProgress: { value: 0 },
      // Paleta tema FOGO: vermelho → laranja → amarelo
      uColor1: { value: new THREE.Color("#FF6600") }, // laranja vibrante
      uColor2: { value: new THREE.Color("#CC1A00") }  // vermelho vivo
    }),
    [isMobile]
  );

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const time = clock.getElapsedTime();
      const scrollProgress = scrollRef?.current ?? 0;
      const connectProgress = connectRef?.current ?? 0;
      pointsRef.current.material.uniforms.uTime.value = time;
      pointsRef.current.material.uniforms.uScrollProgress.value =
        scrollProgress;
      pointsRef.current.material.uniforms.uConnectProgress.value =
        connectProgress;

      // Smooth rotation with easing
      if (connectProgress > 0) {
        const easedRotation = connectProgress * connectProgress;
        const rotationSpeed = 0.02 + easedRotation * 0.06;
        pointsRef.current.rotation.y = time * rotationSpeed;
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScale"
          count={scales.length}
          array={scales}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={speeds.length}
          array={speeds}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          count={offsets.length / 3}
          array={offsets}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        depthTest={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default Particles;
