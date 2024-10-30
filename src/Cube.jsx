import * as THREE from 'three'
import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import useGame from './store/useGame.js'

export default function Cube() {
    /**
     * Import/Assign Meshes
     */
    const { nodes } = useGLTF('./meshes/cube.glb')
    const cubeArray = Object.values(nodes).slice(1)

    const cube = useRef([]) // ref for cube rotation
    const meshes = useRef(cubeArray.map(() => useRef())) // ref for meshes enter animation

    const [subscribeKeys, getKeys] = useKeyboardControls()
    const [transparency, setTransparency] = useState(false)
    const [isWireframe, setIsWireframe] = useState(false)

    /**
     * Phases
     */
    // Store
    const phase = useGame((state) => state.phase)
    const ready = useGame((state) => state.ready)
    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)

    // Enter animation state
    const [isAnimationFinished, setIsAnimationFinished] = useState(false)

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
    const tl = useRef() // ref for timeline gsap
    useEffect(() => {
        tl.current = gsap.timeline()
        const vh = window.innerHeight

        // Level 1
        tl.current.from(
            meshes.current[1].current.position,
            { duration: 3, y: -vh * 0.25, ease: 'slow(0.7,0.7,false)' },
            0
        )
        tl.current.from(
            meshes.current[1].current.rotation,
            { duration: 3, y: Math.PI * 0.5, ease: 'slow(0.7,0.7,false)' },
            0
        )

        // Level 2
        tl.current.from(
            meshes.current[2].current.position,
            { duration: 3, y: -vh * 0.25, ease: 'slow(0.7,0.7,false)' },
            0.5
        )
        tl.current.from(
            meshes.current[2].current.rotation,
            { duration: 3, y: -Math.PI * 0.5, ease: 'slow(0.7,0.7,false)' },
            0.5
        )

        // Level 3
        tl.current.from(
            meshes.current[3].current.position,
            { duration: 3, y: -vh * 0.25, ease: 'slow(0.7,0.7,false)' },
            1
        )
        tl.current.from(
            meshes.current[3].current.rotation,
            { duration: 3, y: Math.PI * 0.5, ease: 'slow(0.7,0.7,false)' },
            1
        )

        // Level 4
        tl.current.from(
            meshes.current[4].current.position,
            { duration: 3, y: -vh * 0.25, ease: 'slow(0.7,0.7,false)' },
            1.5
        )
        tl.current.from(
            meshes.current[4].current.rotation,
            { duration: 3, y: -Math.PI * 0.5, ease: 'slow(0.7,0.7,false)' },
            1.5
        )

        // Top
        tl.current.from(
            meshes.current[0].current.position,
            { duration: 3, y: vh * 0.25, ease: 'slow(0.7,0.7,false)' },
            3
        )

        // Bottom
        tl.current.from(
            meshes.current[5].current.position,
            { duration: 3, y: -vh * 0.25, ease: 'slow(0.7,0.7,false)' },
            2
        )
        tl.current.from(
            meshes.current[6].current.position,
            {
                duration: 3,
                y: -vh * 0.25,
                ease: 'slow(0.7,0.7,false)',
                onComplete: () => {
                    setIsAnimationFinished(true)
                    ready()
                    console.log(meshes.current[6].current)
                },
            },
            2
        )

        return () => {
            tl.current.kill() // Clean timeline
        }
    }, [])

    /**
     * Controls
     */
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
        if (isAnimationFinished) {
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

                if (phase === 'ready') {
                    start()
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
