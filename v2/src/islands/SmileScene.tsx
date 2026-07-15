import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import {
  Box3,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import { useCapabilityProfile } from "./useCapabilityProfile";

const fallback = (
  <span aria-hidden="true" className="smile-fallback">
    <i />
  </span>
);

function SmileModel({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  const { scene } = useLoader(GLTFLoader, "/smile.glb");

  const fittedScene = useMemo(() => {
    const clone = scene.clone(true);
    const box = new Box3().setFromObject(clone);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const largestAxis = Math.max(size.x, size.y, size.z, 0.001);
    const scale = 3.25 / largestAxis;

    clone.position.set(-center.x, -center.y, -center.z);
    clone.scale.setScalar(scale);
    clone.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      child.geometry.computeVertexNormals();
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];
      materials.forEach((material) => {
        if (!(material instanceof MeshStandardMaterial)) return;
        material.roughness = 0.36;
        material.metalness = 0.05;
      });
    });

    return clone;
  }, [scene]);

  useFrame(({ pointer }) => {
    if (!animate || !group.current) return;
    group.current.rotation.y = MathUtils.clamp(pointer.x * 0.16, -0.16, 0.16);
    group.current.rotation.x = MathUtils.clamp(pointer.y * 0.09, -0.09, 0.09);
  });

  return (
    <group ref={group} onPointerMove={() => animate && invalidate()}>
      <primitive object={fittedScene} />
    </group>
  );
}

export function SmileScene() {
  const profile = useCapabilityProfile();

  if (!profile?.renderWebGL) {
    return <div className="smile-island is-fallback">{fallback}</div>;
  }

  return (
    <div className="smile-island" data-quality-tier={profile.tier}>
      {fallback}
      <SceneErrorBoundary fallback={null}>
        <Canvas
          aria-hidden="true"
          camera={{ position: [0, 0, 5.5], fov: 34 }}
          dpr={profile.dpr}
          frameloop="demand"
          gl={{ alpha: false, antialias: profile.tier === "high" }}
          onCreated={({ gl }) => gl.setClearColor("#0c0d0f", 1)}
        >
          <ambientLight intensity={1.45} />
          <directionalLight position={[4, 5, 5]} intensity={2.2} />
          <pointLight color="#ff7448" position={[-3, -2, 3]} intensity={16} />
          <Suspense fallback={null}>
            <SmileModel animate={profile.animate} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
