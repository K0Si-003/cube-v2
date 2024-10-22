import * as THREE from 'three'
import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import useGame from './store/useGame.js'

export default function Cube() {
    const cube = useRef([]) // ref for cube rotation
    const meshes = useRef([]) // ref for meshes enter animation
    const tl = useRef() // ref for timeline gsap

    const [subscribeKeys, getKeys] = useKeyboardControls()

    const [transparency, setTransparency] = useState(false)
    const [isWireframe, setIsWireframe] = useState(false)

    const end = useGame((state) => state.end) // Get method to change phase in store

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

    /**
     * Enter Animation
     */

    useEffect(() => {
        tl.current = gsap.timeline()

        tl.current.from(
            meshes.current[0].current.position,
            { duration: 5, y: 150, ease: 'slow(0.7,0.7,false)' },
            0
        )
        tl.current.from(
            meshes.current[1].current.position,
            { duration: 5, y: -150, ease: 'slow(0.7,0.7,false)' },
            0
        )
        tl.current.from(
            meshes.current[2].current.position,
            { duration: 5, y: -150, ease: 'slow(0.7,0.7,false)' },
            1
        )
        tl.current.from(
            meshes.current[3].current.position,
            { duration: 5, y: -150, ease: 'slow(0.7,0.7,false)' },
            2
        )
        tl.current.from(
            meshes.current[4].current.position,
            { duration: 5, y: -150, ease: 'slow(0.7,0.7,false)' },
            3
        )
        tl.current.from(
            meshes.current[5].current.position,
            { duration: 5, y: -150, ease: 'slow(0.7,0.7,false)' },
            3.5
        )
        tl.current.from(
            meshes.current[6].current.position,
            { duration: 5, y: -150, ease: 'slow(0.7,0.7,false)' },
            4
        )
    }, [])

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

            for (let i = 0; i < cube.current.length; i++) {
                cube.current[i].setNextKinematicRotation(rotation)
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
        // // Set boxMaterial transparent
        if (transparent) {
            setTransparency(true)
        } else {
            setTransparency(false)
        }

        // // Set levelMaterial wireframe
        if (wireframe) {
            setIsWireframe(true)
        } else {
            setIsWireframe(false)
        }
    })

    return (
        <>
            {cubeArray.map((cubePart, id) => {
                if (!meshes.current[id]) {
                    meshes.current[id] = useRef()
                }

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
                        onCollisionEnter={({ target }) => {
                            if (
                                cubePart.name === 'Finish' &&
                                target.rigidBodyObject.name === 'cubeFinish'
                            ) {
                                end()
                            }
                        }}
                    >
                        <mesh
                            ref={meshes.current[id]}
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
