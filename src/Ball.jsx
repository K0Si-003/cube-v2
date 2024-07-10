import { useRef, useState } from 'react'
import { RigidBody, useRapier } from '@react-three/rapier'

export default function Ball() {
    const ball = useRef()

    const [isAsleep, setIsAsleep] = useState(false)

    const { rapier, world } = useRapier()
    const rapierWorld = world

    return (
        <RigidBody
        name='ball'
        ref={ball}
        // canSleep={false}
        onSleep={() => setIsAsleep(true)}
        onWake={() => setIsAsleep(false)}
        // position={[-10, 50, -10]}
        position={[-2, 10, -2]}
        colliders="ball"
        restitution={0.2}
        friction={1}
        linearDamping={0.1}
        angularDamping={0.1}
        onCollisionEnter={({ manifold, target, other }) => {
            // console.log(
            //   "Collision at world position ",
            //   manifold.solverContactPoint(0)
            // );
    
            if (other.rigidBodyObject) {
              console.log(
                // this rigid body's Object3D
                target.rigidBodyObject.name,
                " collided with ",
                // the other rigid body's Object3D
                other.rigidBodyObject.name
              );
            }

            console.log(target)
          }}
    >
        <mesh castShadow>
            <icosahedronGeometry args={[0.85, 20]} />
            {/* <meshStandardMaterial flatShading color="mediumpurple" /> */}
            <meshPhysicalMaterial color={isAsleep ? "white" : "blue"} />
        </mesh>
    </RigidBody>
    )
}