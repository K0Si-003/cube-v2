import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useRef } from 'react'

export default function Cube() {
    const cube = useRef()

    const boxMaterial = new THREE.MeshStandardMaterial({
        color: '#459E15',
        metalness: '0.5',
        roughness: '1',
        // wireframe: true
        transparent: true,
        opacity: '0.5',
    })

    const levelMaterial = new THREE.MeshStandardMaterial({
        color: '#101010',
    })

    const { nodes } = useGLTF('./meshes/cube.glb')

    return (
        <RigidBody
            ref={cube}
            type="kinematicPosition"
            colliders="trimesh"
            name="level"
            position={[0, 0, 0]}
            restitution={0.2}
            friction={0}
        >
            <group scale={[0.2, 0.2, 0.2]}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Top.geometry}
                    material={boxMaterial}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Level1.geometry}
                    material={levelMaterial}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Level2.geometry}
                    material={levelMaterial}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Level3.geometry}
                    material={levelMaterial}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Level4.geometry}
                    material={levelMaterial}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Bottom.geometry}
                    material={boxMaterial}
                />
            </group>
        </RigidBody>
    )
}

useGLTF.preload('meshes/cube.glb')
