import * as THREE from 'three'
import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Cube() {
    const cube = useRef([])
    const [subscribeKeys, getKeys] = useKeyboardControls()
    
    const [ transparency, setTransparency ] = useState(false)
    const [ isWireframe, setIsWireframe ] = useState(false)

    /**
     * Import/Assign Meshes
     */
    const { nodes } = useGLTF('./meshes/cube.glb')
    const cubeArray = Object.values(nodes).slice(1)

    /**
     * Material
     */
    const boxMaterial = new THREE.MeshStandardMaterial({
        color: '#459E15',
        metalness: '0.5',
        roughness: '1',
        transparent: transparency,
        opacity: '0.5',
    })

    const levelMaterial = new THREE.MeshStandardMaterial({
        color: '#101010',
        wireframe: isWireframe
    })

    useFrame((state, delta) => {
        /**
         * Controls
         */
        // Getkeys state
        const { forward, backward, leftward, rightward, transparent, wireframe } = getKeys()

        // Get Cube Rotation state
        const levelObj = state.scene.children.find((item) =>
            item.name.startsWith('cube')
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

        if (transparent) {
            setTransparency(true);
        } else {
            setTransparency(false);
        }

        if (wireframe) {
            console.log('wireframe')
            setIsWireframe(true);
        } else {
            setIsWireframe(false);
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
                        name={`cube${cubePart.name}`}
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
