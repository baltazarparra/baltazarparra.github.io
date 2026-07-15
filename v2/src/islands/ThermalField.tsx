import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, ShaderMaterial } from "three";
import { tokens } from "../generated/tokens";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import { useCapabilityProfile } from "./useCapabilityProfile";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uCanvas;
  uniform vec3 uAccent;
  uniform vec3 uAccentStrong;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(9.2, 4.7);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.09;
    float field = fbm(vec2(uv.x * 3.2 - t, uv.y * 2.1 + t * 0.55));
    float cut = smoothstep(0.28, 0.82, field + sin((uv.x + t) * 7.0) * 0.08);
    float edge = smoothstep(0.0, 0.2, uv.y) * smoothstep(0.0, 0.2, 1.0 - uv.y);
    vec3 heat = mix(uAccent, uAccentStrong, smoothstep(0.45, 0.9, field));
    vec3 color = mix(uCanvas, heat, cut * edge);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function ThermalPlane({ animate }: { animate: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCanvas: { value: new Color(tokens.color.canvas) },
      uAccent: { value: new Color(tokens.color.accent) },
      uAccentStrong: { value: new Color(tokens.color.accentStrong) },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!animate || !material.current) return;
    material.current.uniforms.uTime!.value = clock.getElapsedTime();
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        vertexShader={vertexShader}
      />
    </mesh>
  );
}

const fallback = <span className="thermal-fallback" />;

export function ThermalField() {
  const profile = useCapabilityProfile();

  if (!profile?.renderWebGL) return fallback;

  return (
    <SceneErrorBoundary fallback={fallback}>
      <Canvas
        aria-hidden="true"
        dpr={profile.dpr}
        fallback={fallback}
        frameloop={profile.animate ? "always" : "demand"}
        gl={{ alpha: false, antialias: false }}
      >
        <ThermalPlane animate={profile.animate} />
      </Canvas>
    </SceneErrorBoundary>
  );
}
