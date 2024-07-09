import { OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import Cube from './Cube.jsx'

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />
      <Lights />
      <Cube />
    </>
  )
}
