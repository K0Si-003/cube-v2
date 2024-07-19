import { OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import Cube from './Cube.jsx'
import Ball from './Ball.jsx'
import { Perf } from 'r3f-perf'

export default function Experience() {
  return (
    <>
      {/* <Perf position='top-left' /> */}
      {/* <OrbitControls makeDefault /> */}
      <Lights />
      <Cube />
      <Ball />
    </>
  )
}
