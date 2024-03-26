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
    myMesh.current.rotation.z = a * 0.1;
    myMesh.current.rotation.y = a * 0.2;
    myMesh.current.rotation.x = a * 0.3;
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
    <section>
      <header>
        <h3>
          baltazarparra
          <img src="https://avatars.githubusercontent.com/u/7395304?v=4" />
        </h3>
        <span>― enabler</span>
        <ul>
          <li>
            <a
              href="https://www.linkedin.com/in/baltazarparra/"
              target="_blank"
            >
              linkedIn
            </a>
          </li>
          <li>
            <a href="https://github.com/baltazarparra" target="_blank">
              github
            </a>
          </li>
          <li>
            <a
              href="https://open.spotify.com/intl-pt/album/6BFeIsMZ4zcuGbs5cugxLM?si=8g7V-wvuSlyE9nC9tRoUKQ"
              target="_blank"
            >
              spotify
            </a>
          </li>
        </ul>
      </header>
      <main>
        <aside>
          <Canvas flat linear camera={{ position: [4, 0, 0] }}>
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
        <h2>
          hey, Im Baltz
          <br />
          a tech leader
          <br />
          based in Brasil
          <br />
        </h2>
        <h1>
          Im currently working for the{" "}
          <a href="https://www.gft.com/int/en" target="_blank">
            ― GFT group
          </a>
          , focused on create great experiences, enthusiastic about agile, with
          extensive software engineering background
        </h1>
      </main>
      <footer>― was mich nicht umbringt, macht mich stärker</footer>
    </section>
  );
}

export default App;
