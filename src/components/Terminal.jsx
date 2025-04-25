import { useEffect, useState } from "react";
import "./Terminal.css";

const Terminal = ({ children }) => {
  const [blinkCursor, setBlinkCursor] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkCursor((prev) => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-circle red"></span>
          <span className="terminal-circle yellow"></span>
          <span className="terminal-circle green"></span>
        </div>
        <div className="terminal-title">baltz@terminal ~ </div>
      </div>
      <div className="terminal-content">
        <div className="terminal-line">
          <span className="terminal-prompt">baltz@terminal:~$</span> cat baltazar-profile.txt
        </div>
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
};

export default Terminal;