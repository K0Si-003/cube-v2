import { useEffect, useRef, useState } from 'react'
import { RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useGame from './store/useGame.js'
import { gsap } from 'gsap'

export default function Ball() {
    const ball = useRef()
    const mesh = useRef()

    const [levelPosition, setLevelPosition] = useState(null)

    const [isAsleep, setIsAsleep] = useState(false)

    const [smoothCameraPosition] = useState(() => new THREE.Vector3(0, 50, 25))
    const [smoothCameraTarget] = useState(() => new THREE.Vector3())

    // Store data
    const changePosition = useGame((state) => state.changePosition)

    useEffect(() => {
        // Timer to not send bounce collision to Store
        const timer = setTimeout(() => {
            changePosition(levelPosition)
        }, 500)
        return () => clearTimeout(timer)
    }, [levelPosition])

    /**
     * Enter Animation
     */
    const tl = useRef() // ref for timeline gsap
    const phase = useGame((state) => state.phase)

    const resetBall = () => {
        if (ball.current) {
            ball.current.setTranslation({ x: -7, y: 10, z: -2 })
            ball.current.setLinvel({ x: 0, y: 0, z: 0 })
            ball.current.setAngvel({ x: 0, y: 0, z: 0 })
        }
    }

    const hasRestart = useGame((state) => state.hasRestart)

    useEffect(() => {
        tl.current = gsap.timeline()
        const vh = window.innerHeight

        const unsubscribeReset = useGame.subscribe(
            (state) => state.phase,
            (value) => {
                if (value === 'intro') {
                    setTimeout(() => {
                        resetBall()
                    }, 50);
                }
            }
        )

        if (phase === 'intro' && hasRestart === false) {
            tl.current.from(
                mesh.current.position,
                { duration: 3, y: vh * 0.1, ease: 'circ.out' },
                0
            )
        }

        return () => {
            tl.current.kill() // Clean timeline
            unsubscribeReset()
        }
    }, [])

    useFrame((state, delta) => {
        /**
         * Camera
         */
        if (ball.current) {
            const bodyPosition = ball.current.translation()

            const cameraPosition = new THREE.Vector3()
            cameraPosition.copy(bodyPosition)
            cameraPosition.z += 35
            cameraPosition.y += 45

            const cameraTarget = new THREE.Vector3()
            cameraTarget.copy(bodyPosition)
            cameraTarget.y += 0

            // smoothCameraPosition.lerp(cameraPosition, 5 * delta)
            // smoothCameraTarget.lerp(cameraTarget, 5 * delta)

            state.camera.position.copy(cameraPosition)
            state.camera.lookAt(cameraTarget)
        }
    })

    return (
        <RigidBody
            name="ball"
            ref={ball}
            canSleep={false}
            onSleep={() => setIsAsleep(true)}
            onWake={() => setIsAsleep(false)}
            position={[-7, 10, -2]}
            colliders="ball"
            restitution={0.2}
            friction={1}
            linearDamping={0.4}
            angularDamping={0.4}
            onCollisionEnter={(other) => {
                if (
                    other.rigidBodyObject.name.includes('Level') ||
                    other.rigidBodyObject.name.includes('Bottom')
                ) {
                    setLevelPosition(other.rigidBodyObject.name)
                }
            }}
        >
            <mesh ref={mesh} castShadow>
                <icosahedronGeometry args={[0.85, 20]} />
                <meshStandardMaterial
                    flatShading
                    color="#fff"
                    metalness={0.7}
                    roughness={0.2}
                />
            </mesh>
        </RigidBody>
    )
}
