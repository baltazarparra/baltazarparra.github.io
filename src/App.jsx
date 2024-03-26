/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
import "./App.css";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  DepthOfField,
} from "@react-three/postprocessing";

const Model = () => {
  const myMesh = useRef();

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    myMesh.current.rotation.z = a * 0.09;
    myMesh.current.rotation.y = a * 0.12;
    myMesh.current.rotation.x = a * 0.15;
  });

  const { scene } = useGLTF("./smile.glb");

  return (
    <>
      <primitive ref={myMesh} object={scene} scale={1} />
    </>
  );
};

function App() {
  return (
    <div className="container">
      <header>
        <img
          className="avatar"
          src="https://avatars.githubusercontent.com/u/7395304?v=4"
        />
        <span>― baltazarparra</span>
      </header>
      <aside>
        <Canvas flat linear camera={{ position: [3, 0, 0] }}>
          <directionalLight position={[4, 0, 0]} intensity={10} />

          <Suspense fallback={"loading..."}>
            <Model />
          </Suspense>
          <EffectComposer>
            <DepthOfField
              focusDistance={0}
              focalLength={0.02}
              bokehScale={2}
              height={480}
            />
            <Bloom
              luminanceThreshold={0}
              luminanceSmoothing={0.9}
              height={300}
            />
          </EffectComposer>
        </Canvas>
      </aside>
      <main>
        <h1>
          hi, I'm baltz<span>🤙</span>
          <br />
          a tech leader
          <br />
          based in Bra<b>z</b>sil
          <br />
        </h1>
        <h2>
          I'm currently working for the{" "}
          <a href="https://www.gft.com/int/en" target="_blank">
            GFT group―
          </a>
          , focused on create great experiences, enthusiastic about agile, with
          extensive software engineering background
        </h2>
      </main>
      <nav>
        <ul>
          <li>
            <a
              href="https://www.linkedin.com/in/baltazarparra/"
              target="_blank"
            >
              <span>linkedIn</span>
              <img className="icon" src="in.png" />
            </a>
          </li>
          <li>
            <a href="https://github.com/baltazarparra" target="_blank">
              <span>github</span>
              <img className="icon" src="gh.png" />
            </a>
          </li>
          <li>
            <a
              href="https://open.spotify.com/intl-pt/album/6BFeIsMZ4zcuGbs5cugxLM?si=8g7V-wvuSlyE9nC9tRoUKQ"
              target="_blank"
            >
              <span>spotify</span>
              <img className="icon" src="sp.png" />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default App;
