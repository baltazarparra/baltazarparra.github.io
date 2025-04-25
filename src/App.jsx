/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
import "./App.css";

import { Suspense, useRef, lazy } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, useGLTF, Html } from "@react-three/drei";
import {
  EffectComposer,
  Bloom
} from "@react-three/postprocessing";

// Importação com lazy loading
const Terminal = lazy(() => import("./components/Terminal"));

// Componente de carregamento para o modelo 3D
const ModelLoader = () => (
  <Html center>
    <div style={{ color: 'white', background: '#121212', padding: '10px', borderRadius: '4px' }}>
      Carregando modelo...
    </div>
  </Html>
);

const StarBackground = () => {
  return (
    <Stars 
      radius={30}
      depth={20}
      count={800} // Reduzido de 1000 para 800 para melhorar performance
      factor={5}
      saturation={0}
      fade
      speed={0.5}
    />
  );
};

const Model = () => {
  const myMesh = useRef();
  const { viewport } = useThree();

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    myMesh.current.rotation.z = a * 0.1;
    myMesh.current.rotation.y = a * 0.1;
    myMesh.current.position.y = Math.sin(a * 0.5) * 0.2;
  });

  // Usando draco loader para compressão do modelo
  const { scene } = useGLTF("/smile.glb", true);
  
  // Scale model to fit viewport height
  const scale = viewport.height * 0.5;
  
  return (
    <primitive 
      ref={myMesh} 
      object={scene} 
      scale={scale} 
      position={[0, 0, -2]}
    />
  );
};

// Pré-carregamento do modelo para evitar FOUC (Flash of Unstyled Content)
useGLTF.preload("/smile.glb");

function App() {
  return (
    <div className="app">
      <div className="canvas-container">
        <Canvas>
          <color attach="background" args={['#121212']} />
          <ambientLight intensity={0.2} />
          <directionalLight
            position={[2, 1, 2]}
            intensity={1}
          />

          <Suspense fallback={<ModelLoader />}>
            <StarBackground />
            <Model />
          </Suspense>

          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.9} 
              height={200} 
            />
          </EffectComposer>
        </Canvas>
      </div>

      <Suspense fallback={<div>Carregando...</div>}>
        <div className="terminal-container">
          <Terminal>
            <div className="terminal-content-main">
              <h1>
                hi, I'm baltz
                <br />
                a tech lead
                <br />
                based in Bra<b>z</b>sil
              </h1>
              
              <p>
                I'm currently working for{" "}
                <a href="https://tanto.vc" target="_blank" rel="noreferrer">
                  tanto.vc
                </a>
                , A decade in web development, shaping interfaces and experiences. Enthusiastic about genAI, with extensive agile and software engineering background
              </p>

              <div className="terminal-links">
                <p>Find me at:</p>
                <ul>
                  <li><a href="https://www.linkedin.com/in/baltazarparra/" target="_blank" rel="noreferrer">linkedIn</a></li>
                  <li><a href="https://github.com/baltazarparra" target="_blank" rel="noreferrer">github</a></li>
                  <li><a href="https://dev.to/baltz" target="_blank" rel="noreferrer">dev.to</a></li>
                  <li><a href="https://open.spotify.com/intl-pt/album/6BFeIsMZ4zcuGbs5cugxLM?si=8g7V-wvuSlyE9nC9tRoUKQ" target="_blank" rel="noreferrer">spotify</a></li>
                </ul>
              </div>
            </div>
          </Terminal>
        </div>
      </Suspense>
    </div>
  );
}

export default App;
