/* eslint-disable react/prop-types */
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const PerformanceMonitor = ({ onPerformanceChange }) => {
  const { gl } = useThree();
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef([]);

  useFrame(() => {
    frameCount.current++;

    const currentTime = performance.now();
    const elapsed = currentTime - lastTime.current;

    // Check FPS every second
    if (elapsed >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / elapsed);
      fpsHistory.current.push(fps);

      // Keep only last 5 samples
      if (fpsHistory.current.length > 5) {
        fpsHistory.current.shift();
      }

      // Calculate average FPS
      const avgFps = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;

      // Adjust DPR based on performance
      if (avgFps < 30 && gl.getPixelRatio() > 0.3) {
        gl.setPixelRatio(Math.max(0.3, gl.getPixelRatio() * 0.8));
        onPerformanceChange?.('low');
      } else if (avgFps > 50 && gl.getPixelRatio() < 0.8) {
        gl.setPixelRatio(Math.min(0.8, gl.getPixelRatio() * 1.1));
        onPerformanceChange?.('high');
      }

      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  });

  return null;
};

export default PerformanceMonitor;
