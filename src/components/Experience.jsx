import { Physics } from '@react-three/rapier'
import Lights from './Lights.jsx'
import Cube from './Cube.jsx'
import Ball from './Ball.jsx'
import { ContactShadows } from '@react-three/drei'

export default function Experience() {
    return (
        <Physics>
            <Lights />
            <Cube />
            <Ball />
            <ContactShadows position={[0, -10, 0]} opacity={0.5} scale={100} blur={1} far={30} />
        </Physics>
    )
}
