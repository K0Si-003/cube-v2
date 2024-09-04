import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Lights from './Lights.jsx'
import Cube from './Cube.jsx'
import Ball from './Ball.jsx'
import { Perf } from 'r3f-perf'

export default function Experience() {
    return (
        <Physics>
            {/* <OrbitControls makeDefault /> */}
            <Lights />
            <Cube />
            <Ball />
        </Physics>
    )
}
