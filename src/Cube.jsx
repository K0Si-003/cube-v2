import * as THREE from 'three'
import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Cube() {
    const cube = useRef([])

    /**
     * Import/Assign Meshes
     */
    const { nodes } = useGLTF('./meshes/cube.glb')
    let cubeArray = []
    for (let key in nodes) {
        if (nodes.hasOwnProperty(key)) {
            cubeArray.push(nodes[key])
        }
    }
    cubeArray = cubeArray.slice(1)

    /**
     * Material
     */
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

    const [subscribeKeys, getKeys] = useKeyboardControls()

    useFrame((state, delta) => {
        /**
         * Controls
         */
        // Getkeys state
        const { forward, backward, leftward, rightward } = getKeys()

        // Get Cube Rotation state
        const levelObj = state.scene.children.find((item) =>
            item.name.startsWith('level')
        )
        const lastRotationState = {
            x: levelObj.rotation.x,
            y: levelObj.rotation.y,
            z: levelObj.rotation.z,
        }

        // Update cube rotation depends keys pressed
        if (forward) {
            const rotation = new THREE.Quaternion()
            rotation.setFromEuler(
                new THREE.Euler(
                    lastRotationState.x - 0.01,
                    lastRotationState.y,
                    lastRotationState.z
                )
            )

            if (cube.current) {
                for (let i = 0; i < cube.current.length; i++) {
                    cube.current[i].setNextKinematicRotation(rotation)
                }
            }
        }

        if (backward) {
            const rotation = new THREE.Quaternion()
            rotation.setFromEuler(
                new THREE.Euler(
                    lastRotationState.x + 0.01,
                    lastRotationState.y,
                    lastRotationState.z
                )
            )

            if (cube.current) {
                for (let i = 0; i < cube.current.length; i++) {
                    cube.current[i].setNextKinematicRotation(rotation)
                }
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
                for (let i = 0; i < cube.current.length; i++) {
                    cube.current[i].setNextKinematicRotation(rotation)
                }
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
                for (let i = 0; i < cube.current.length; i++) {
                    cube.current[i].setNextKinematicRotation(rotation)
                }
            }
        }
    })

    return (
        <>
            {cubeArray.map((cubePart, id) => {
                return (
                    <RigidBody
                        key={cubePart.name}
                        ref={(cubePart) => (cube.current[id] = cubePart)}
                        type="kinematicPosition"
                        colliders="trimesh"
                        name={`level-${cubePart.name}`}
                        position={[-5, 0, 0]}
                        scale={[0.2, 0.2, 0.2]}
                        restitution={0.2}
                        friction={0}
                    >
                        <mesh
                            castShadow
                            receiveShadow
                            geometry={cubePart.geometry}
                            material={
                                cubePart.name.startsWith('Level')
                                    ? levelMaterial
                                    : boxMaterial
                            }
                        />
                    </RigidBody>
                )
            })}
        </>
    )
}

useGLTF.preload('meshes/cube.glb')
