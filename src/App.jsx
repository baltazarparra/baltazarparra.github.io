/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
import "./App.css";

import { useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  DepthOfField,
  ChromaticAberration,
  DotScreen,
  Noise,
  Glitch,
  Pixelation,
  SMAA
} from "@react-three/postprocessing";

import { GlobalCanvas, SmoothScrollbar } from "@14islands/r3f-scroll-rig";
import "@14islands/r3f-scroll-rig/css";

const Model = () => {
  const myMesh = useRef();

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    myMesh.current.rotation.z = a * 0.21;
    myMesh.current.rotation.y = a * 0.18;
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
  const [toggle, setToggle] = useState(true);

  return (
    <>
      <aside>
        <Canvas flat linear camera={{ position: [3, 0, 0] }}>
          <directionalLight
            position={[6, 0, 0]}
            castShadow
            intensity={Math.PI * 3}
          />

          <Suspense fallback={"loading..."}>
            <Model />
          </Suspense>
          {!toggle && (
            <Suspense fallback={"loading..."}>
              <EffectComposer multisampling={0}>
                <DotScreen
                  angle={Math.PI * 0.5} // angle of the dot pattern
                  scale={1.0} // scale of the dot pattern
                />
                <Noise premultiply />
                <ChromaticAberration offset={[0.002, 0.0002]} />
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
                <Glitch
                  delay={[1, 3]} // min and max glitch delay
                  duration={[0.08, 0.04]} // min and max glitch duration
                  strength={[0.1, 0.2]} // min and max glitch strength
                  active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
                  ratio={1} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
                />
                <Pixelation
                  granularity={1} // pixel granularity
                />
                <SMAA />
              </EffectComposer>
            </Suspense>
          )}
        </Canvas>
      </aside>
      <div className="container">
        <header>
          <div className="name">
            <img
              className="avatar"
              src="https://avatars.githubusercontent.com/u/7395304?v=4"
            />
            <span>― baltazarparra</span>
          </div>
          <div className="performance" onClick={() => setToggle(!toggle)}>
            effects
            <div className={toggle ? "toggle" : "toggle off"}>
              <span></span>
            </div>
          </div>
        </header>
        <main>
          <h1>
            hi, I'm baltz<span>🤙</span>
            <br />
            a tech manager
            <br />
            based in Bra<b>z</b>sil
            <br />
          </h1>
          <hr></hr>
          <h2>
            I'm currently working for the{" "}
            <a
              href="https://groupe.up.coop/en/who-are-we/international-presence"
              target="_blank"
            >
              groupe UP ―
            </a>
            , focused on create great experiences, enthusiastic about agile,
            with extensive software engineering background
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
              <a href="https://dev.to/baltz" target="_blank">
                <span>dev.to</span>
                <img className="icon" src="dt.png" />
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
        <SmoothScrollbar />
        <GlobalCanvas />
      </div>
    </>
  );
}

export default App;
