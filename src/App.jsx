/* eslint-disable react/no-children-prop */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import './App.css'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Float } from '@react-three/drei'
import { Bloom, EffectComposer, ChromaticAberration, DotScreen, Noise } from '@react-three/postprocessing'
import { Resizer, KernelSize, BlendFunction } from 'postprocessing'

function Model() {
  const { scene } = useGLTF('/smile.glb')
  const boxRef = useRef()
  const [position, setPosition] = useState(0)

  const handleScroll = () => {
    const scrollPosition = window.scrollY
    setPosition(scrollPosition)
  }

  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useFrame(({ clock }) => {
    boxRef.current.rotation.z = position * 0.008
    boxRef.current.position.y = position * 0.004
    boxRef.current.position.x = position * 0.01
    boxRef.current.rotation.y = clock.elapsedTime * 0.4
  })

  return (
    <group ref={boxRef}>
      <primitive object={scene} />
    </group>
  )
}

function App() {
  return (
    <>
      <main>
        <h1 className="firstname">baltazar</h1>
        <div className="core">
          <Canvas flat linear camera={{ position: [4, 0, 0] }}>
            <directionalLight position={[10, 0, 0]} intensity={1} />
            <directionalLight position={[10, 0, 0]} intensity={1} />
            <pointLight position={[10, 0, 0]} intensity={1} />
            <spotLight position={[10, 0, 0]} intensity={1} />
            <Float floatIntensity={1} speed={3}>
              <Model />
            </Float>
            <EffectComposer>
              <DotScreen
                blendFunction={BlendFunction.NORMAL} // blend mode
                angle={Math.PI * 0.5} // angle of the dot pattern
                scale={1.0} // scale of the dot pattern
              />
              <Noise premultiply blendFunction={BlendFunction.ADD} />
              <ChromaticAberration offset={[0.002, 0.0002]} />
              <Bloom
                intensity={1.0} // The bloom intensity.
                blurPass={undefined} // A blur pass.
                width={Resizer.AUTO_SIZE} // render width
                height={Resizer.AUTO_SIZE} // render height
                kernelSize={KernelSize.LARGE} // blur kernel size
                luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
                luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
              />
            </EffectComposer>
          </Canvas>
        </div>
        <h1 className="surname">parra</h1>
      </main>
      <nav>
        <ul>
          <li>
            <a href="/">github</a>
          </li>
          <li>
            <a href="/">linkedIn</a>
          </li>
          <li>
            <a href="/">spotify</a>
          </li>
        </ul>
      </nav>
      <div style={{ height: '100vh' }}></div>
    </>
  )
}

export default App
