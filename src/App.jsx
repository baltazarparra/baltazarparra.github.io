// eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
import "./App.css";
import { Suspense, lazy } from "react";

// Importação com lazy loading
const Terminal = lazy(() => import("./components/Terminal"));

function App() {
  return (
    <div className="app">
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
