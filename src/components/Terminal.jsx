import { useEffect, useState, memo } from "react";
import "./Terminal.css";

const Terminal = memo(({ children }) => {
  const [blinkCursor, setBlinkCursor] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
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

  return (
    <div className="terminal-window">
      <div className="terminal-header">
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
  );
});

Terminal.displayName = "Terminal";

export default Terminal;