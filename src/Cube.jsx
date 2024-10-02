import * as THREE from 'three'
import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Cube() {
    const cube = useRef([])
    const [subscribeKeys, getKeys] = useKeyboardControls()

    const [transparency, setTransparency] = useState(false)
    const [isWireframe, setIsWireframe] = useState(false)

    /**
     * Import/Assign Meshes
     */
    const { nodes } = useGLTF('./meshes/cube.glb')
    const cubeArray = Object.values(nodes).slice(1)

    /**
     * Material
     */
    const boxMaterial = new THREE.MeshStandardMaterial({
        color: '#94ac3c',
        metalness: '0.6',
        roughness: '0.7',
        transparent: transparency,
        opacity: '0.5',
    })

    const levelMaterial = new THREE.MeshStandardMaterial({
        color: '#101010',
        wireframe: isWireframe,
    })

    useFrame((state, delta) => {
        // Getkeys state for controls
        const {
            forward,
            backward,
            leftward,
            rightward,
            transparent,
            wireframe,
        } = getKeys()

        /**
         * Cube rotation
         */
        // Get preview cube rotation
        const levelObj = state.scene.children.find((item) =>
            item.name.startsWith('cube')
        )
        const lastRotationState = {
            x: levelObj.rotation.x,
            y: levelObj.rotation.y,
            z: levelObj.rotation.z,
        }

        // Function to rotate cube
        const updateRotation = (axis, direction) => {
            const rotation = new THREE.Quaternion()
            rotation.setFromEuler(
                new THREE.Euler(
                    lastRotationState.x +
                        direction * 0.01 * (axis === 'x' ? 1 : 0),
                    lastRotationState.y +
                        direction * 0.01 * (axis === 'y' ? 1 : 0),
                    lastRotationState.z +
                        direction * 0.01 * (axis === 'z' ? 1 : 0)
                )
            )

            if (cube.current) {
                for (let i = 0; i < cube.current.length; i++) {
                    cube.current[i].setNextKinematicRotation(rotation)
                }
            }
        }

        // Rotate cube depending keys pressed
        if (forward) updateRotation('x', -1)
        if (backward) updateRotation('x', 1)
        if (leftward) updateRotation('z', 1)
        if (rightward) updateRotation('z', -1)

        /**
         * Helpers
         */
        // Set boxMaterial transparent
        if (transparent) {
            setTransparency(true)
        } else {
            setTransparency(false)
        }

        // Set levelMaterial wireframe
        if (wireframe) {
            console.log('wireframe')
            setIsWireframe(true)
        } else {
            setIsWireframe(false)
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
