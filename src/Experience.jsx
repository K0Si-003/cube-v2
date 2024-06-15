import { OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Top } from './Level.jsx'

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />
      <Lights />
      <Top />
      {/* <Level1 /> */}
    </>
  )
}
