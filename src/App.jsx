/* eslint-disable react/no-children-prop */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import './App.css'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('https://github.com/baltazarparra/baltazarparra.github.io/blob/creative/public/smile.glb')
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
            <pointLight position={[10, 10, 10]} />
            <Model />
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
