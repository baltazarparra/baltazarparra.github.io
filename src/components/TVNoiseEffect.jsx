/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex Shader
const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader com TV Noise
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;

  varying vec2 vUv;

  // Random function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // 2D Noise
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // FBM
  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 st = vUv;

    // Film grain - very fine and subtle
    float grain = random(st * uResolution + uTime * 10.0) * 0.04;

    // Static noise - TV effect (mais sutil)
    float staticNoise = random(st * 5.0 + floor(uTime * 20.0)) * 0.05;

    // Scanlines (mais sutis)
    float scanline = sin(st.y * uResolution.y * 0.7) * 0.015;

    // Subtle moving pattern
    float pattern = fbm(st * 2.0 + uTime * 0.02) * 0.02;

    // Vignette mais suave
    vec2 center = st - 0.5;
    float vignette = 1.0 - dot(center, center) * 0.3;

    // Base escura com tom de vermelho bordô
    vec3 baseColor = vec3(0.08, 0.01, 0.01);

    // Add all noise effects
    vec3 color = baseColor;
    color += grain;
    color += staticNoise;
    color += scanline;
    color += pattern;
    color *= vignette;

    // Toque muito sutil de azul escuro para harmonizar
    color += vec3(0.0, 0.05, 0.08) * 0.012;

    gl_FragColor = vec4(color, 0.7);
  }
`;

// Vertex Shader para partículas de fundo
const particleVertexShader = `
  uniform float uTime;

  attribute float aScale;
  attribute vec3 aVelocity;

  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Movimento das partículas
    pos += aVelocity * uTime;

    // Wrap around - efeito de loop infinito
    pos = mod(pos + 50.0, 100.0) - 50.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Tamanho baseado na distância
    gl_PointSize = aScale * (300.0 / -mvPosition.z);

    // Alpha varia com a posição Z
    vAlpha = smoothstep(-20.0, -5.0, pos.z);
  }
`;

// Fragment Shader para partículas
const particleFragmentShader = `
  varying float vAlpha;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);

    if (dist > 0.5) discard;

    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha = pow(alpha, 2.5);

    // Gradiente tema FOGO: amarelo ouro para vermelho quente
    vec3 colorLight = vec3(1.0, 0.7, 0.0);      // #FFB300 - amarelo ouro
    vec3 colorDark = vec3(1.0, 0.2, 0.0);       // #FF3300 - vermelho quente
    vec3 color = mix(colorLight, colorDark, dist * 0.6);

    gl_FragColor = vec4(color, alpha * vAlpha * 0.12);
  }
`;

export function TVNoiseEffect({ particleCount = 150 }) {
  const backgroundRef = useRef();
  const particlesRef = useRef();

  // Material do background
  const backgroundMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1920, 1080) }
      },
      transparent: true,
      depthWrite: false
    });
  }, []);

  // Geometria e material das partículas
  const { particlesGeometry, particlesMaterial } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Distribuição aleatória em volume
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 50;
      positions[i3 + 2] = -5 - Math.random() * 15;

      // Tamanho variado
      scales[i] = Math.random() * 0.3 + 0.1;

      // Velocidade lenta e variada
      velocities[i3] = (Math.random() - 0.5) * 0.5;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.5;
      velocities[i3 + 2] = Math.random() * 0.2 + 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime: { value: 0 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    return { particlesGeometry: geometry, particlesMaterial: material };
  }, [particleCount]);

  // Animação
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (backgroundRef.current) {
      backgroundRef.current.material.uniforms.uTime.value = elapsed;
    }

    if (particlesRef.current) {
      particlesRef.current.material.uniforms.uTime.value = elapsed;
    }
  });

  return (
    <group>
      {/* Background plane com ruído de TV */}
      <mesh ref={backgroundRef} position={[0, 0, -25]} renderOrder={-2}>
        <planeGeometry args={[150, 150]} />
        <primitive object={backgroundMaterial} attach="material" />
      </mesh>

      {/* Partículas flutuantes */}
      <points ref={particlesRef}>
        <primitive object={particlesGeometry} attach="geometry" />
        <primitive object={particlesMaterial} attach="material" />
      </points>
    </group>
  );
}
