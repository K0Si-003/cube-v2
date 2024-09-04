import * as THREE from 'three'
import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Cube() {
    const cube = useRef()

    const boxMaterial = new THREE.MeshStandardMaterial({
        color: '#459E15',
        metalness: '0.5',
        roughness: '1',
        transparent: true,
        opacity: '0.5',
    })

    const levelMaterial = new THREE.MeshStandardMaterial({
        color: '#101010',
    })

    const { nodes } = useGLTF('./meshes/cube.glb')

    const [subscribeKeys, getKeys] = useKeyboardControls()

    useFrame((state, delta) => {
        /**
         * Controls
         */
        const { forward, backward, leftward, rightward } = getKeys()

        if (forward) {
            const levelObj = state.scene.children.find(
                (item) => item.name === 'level'
            )
            const lastRotationState = {
                x: levelObj.rotation.x,
                y: levelObj.rotation.y,
                z: levelObj.rotation.z,
            }

            const rotation = new THREE.Quaternion()
            rotation.setFromEuler(
                new THREE.Euler(
                    lastRotationState.x - 0.01,
                    lastRotationState.y,
                    lastRotationState.z
                )
            )

            if (cube.current) {
                cube.current.setNextKinematicRotation(rotation)
            }
        }

        if (backward) {
            const levelObj = state.scene.children.find(
                (item) => item.name === 'level'
            )
            const lastRotationState = {
                x: levelObj.rotation.x,
                y: levelObj.rotation.y,
                z: levelObj.rotation.z,
            }

            const rotation = new THREE.Quaternion()
            rotation.setFromEuler(
                new THREE.Euler(
                    lastRotationState.x + 0.01,
                    lastRotationState.y,
                    lastRotationState.z
                )
            )

            if (cube.current) {
                cube.current.setNextKinematicRotation(rotation)
            }
        }
        if (leftward) {
            const rotation = new THREE.Quaternion()
            rotation.setFromEuler(
                new THREE.Euler(
                    lastRotationState.x,
                    lastRotationState.y,
                    lastRotationState.z + 0.01
                )
            )

            if (cube.current) {
                cube.current.setNextKinematicRotation(rotation)
            }
        }
        if (rightward) {
            const rotation = new THREE.Quaternion()
            rotation.setFromEuler(
                new THREE.Euler(
                    lastRotationState.x,
                    lastRotationState.y,
                    lastRotationState.z - 0.01
                )
            )

            if (cube.current) {
                cube.current.setNextKinematicRotation(rotation)
            }
        }
    })

    return (
        <RigidBody
            ref={cube}
            type="kinematicPosition"
            colliders="trimesh"
            name="level"
            position={[-5, 0, 0]}
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
