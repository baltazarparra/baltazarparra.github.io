/* eslint-disable react/no-children-prop */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import './App.css'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Float } from '@react-three/drei'
import { Bloom, EffectComposer, ChromaticAberration, DotScreen, Noise } from '@react-three/postprocessing'
import { Resizer, KernelSize, BlendFunction } from 'postprocessing'
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion'
import { wrap } from '@motionone/utils'

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

function ParallaxText({ children, baseVelocity = 50 }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  })
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)

  const directionFactor = useRef(1)
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()

    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="parallax">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="scroller" style={{ x }}>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </motion.div>
    </div>
  )
}

function App() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <main>
        <motion.h1
          animate={{ x: -scrollY * 2, opacity: 1 }}
          initial={{ opacity: 0, x: -200 }}
          className="firstname"
          transition={{
            ease: 'easeOut',
            duration: 0.3
          }}>
          baltazar
        </motion.h1>
        <div className="core">
          <Canvas flat linear camera={{ position: [4, 0, 0] }}>
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
        <motion.h1
          animate={{ x: scrollY * 2 }}
          initial={{ x: 200 }}
          className="surname"
          transition={{
            ease: 'easeOut',
            duration: 0.3
          }}>
          parra
        </motion.h1>
      </main>
      <footer>
        <h2>baltz</h2>
        <ul>
          <li>
            <a href='https://wa.me/+5514998248021' rel='noreferrer' target='_blank'>
              <motion.span
                variants={
                  {
                    hidden: { opacity: 1 },
                    visible: {
                      opacity: 1,
                      transition: {
                        delay: 1,
                        staggerChildren: 0.08
                      }
                    }
                  }
                }
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {'+55 14 99824 8021'.split('').map((char, index) => {
                  return (
                    <motion.span key={char + '-' + index} variants={
                      {
                        hidden: { opacity: 0, y: 50 },
                        visible: {
                          opacity: 1,
                          y: 0
                        }
                      }
                    }>
                      {char}
                    </motion.span>
                  )
                })}
              </motion.span>
            </a>
          </li>
          <li>
            <a href="mailto:baltazarparra@outlook.com" rel='noreferrer' target='_blank'>
            <motion.span
                variants={
                  {
                    hidden: { opacity: 1 },
                    visible: {
                      opacity: 1,
                      transition: {
                        delay: 1,
                        staggerChildren: 0.08
                      }
                    }
                  }
                }
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {'baltazarparra@outlook.com'.split('').map((char, index) => {
                  return (
                    <motion.span key={char + '-' + index} variants={
                      {
                        hidden: { opacity: 0, y: 50 },
                        visible: {
                          opacity: 1,
                          y: 0
                        }
                      }
                    }>
                      {char}
                    </motion.span>
                  )
                })}
              </motion.span>
            </a>
          </li>
          <li>
            <a href="https://codepen.io/baltazarparra" rel='noreferrer' target='_blank'>
            <motion.span
                variants={
                  {
                    hidden: { opacity: 1 },
                    visible: {
                      opacity: 1,
                      transition: {
                        delay: 1,
                        staggerChildren: 0.08
                      }
                    }
                  }
                }
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {'codepen'.split('').map((char, index) => {
                  return (
                    <motion.span key={char + '-' + index} variants={
                      {
                        hidden: { opacity: 0, y: 50 },
                        visible: {
                          opacity: 1,
                          y: 0
                        }
                      }
                    }>
                      {char}
                    </motion.span>
                  )
                })}
              </motion.span>
            </a>
          </li>
          <li>
            <a href="https://codesandbox.io/u/baltazarparra" rel='noreferrer' target='_blank'>
            <motion.span
                variants={
                  {
                    hidden: { opacity: 1 },
                    visible: {
                      opacity: 1,
                      transition: {
                        delay: 1,
                        staggerChildren: 0.08
                      }
                    }
                  }
                }
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {'codesandbox'.split('').map((char, index) => {
                  return (
                    <motion.span key={char + '-' + index} variants={
                      {
                        hidden: { opacity: 0, y: 150 },
                        visible: {
                          opacity: 1,
                          y: 0
                        }
                      }
                    }>
                      {char}
                    </motion.span>
                  )
                })}
              </motion.span>
            </a>
          </li>
        </ul>
        <small>© baltazarparra ━ 2023</small>
      </footer>
      <nav className="bar">
          <ul>
            <li>
              <a href="https://github.com/baltazarparra" target="_blank" rel="noreferrer">
                github
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/baltazarparra/" target="_blank" rel="noreferrer">
                linkedIn
              </a>
            </li>
            <li>
              <a href="https://open.spotify.com/album/6BFeIsMZ4zcuGbs5cugxLM?si=yWyn03SUQ_WhoSQtAqZzLQ" target="_blank" rel="noreferrer">
                spotify
              </a>
            </li>
          </ul>
        </nav>
        <ParallaxText baseVelocity={1}>
          React ━ Next.js ━ styled-components ━ strapi ━ Figma ━ agile ━ react-three-fiber ━ Framer Motion ━ React ━ Next.js ━
          styled-components ━ strapi ━ Figma ━ agile ━ react-three-fiber ━ Framer Motion ━
        </ParallaxText>
    </>
  )
}

export default App
