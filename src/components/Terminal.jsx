import { useEffect, useState, memo, useRef } from "react";
import "./Terminal.css";
import Draggable from "react-draggable";

const Terminal = memo(({ children }) => {
  const [blinkCursor, setBlinkCursor] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const nodeRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Função para verificar se é dispositivo móvel
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Checa inicialmente
    checkMobile();

    // Adiciona listener para redimensionamento
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Move via teclado para acessibilidade
  const handleKeyDown = (e) => {
    const step = 10;
    let { x, y } = position;
    switch (e.key) {
      case 'ArrowUp': y -= step; break;
      case 'ArrowDown': y += step; break;
      case 'ArrowLeft': x -= step; break;
      case 'ArrowRight': x += step; break;
      default: return;
    }
    setPosition({ x, y });
    e.preventDefault();
  };

  return (
    <Draggable
      disabled={isMobile}
      cancel="a, a *"
      defaultPosition={position}
      onStop={(_, data) => setPosition({ x: data.x, y: data.y })}
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className="terminal-window"
        style={{}}
      >
        <div className="terminal-header" tabIndex="0" role="button" onKeyDown={handleKeyDown}>
          <div className="terminal-buttons">
            <span className="terminal-circle red"></span>
            <span className="terminal-circle yellow"></span>
            <span className="terminal-circle green"></span>
          </div>
        </div>
        <div className="terminal-content">
          <div className="terminal-output">
            {children}
          </div>
          <div className="terminal-line">
            <span className="terminal-prompt">baltz@terminal:~$</span>
            <span className={`terminal-cursor ${blinkCursor ? 'blink' : ''}`}>█</span>
          </div>
        </div>
      </div>
    </Draggable>
  );
});

Terminal.displayName = "Terminal";

export default Terminal;