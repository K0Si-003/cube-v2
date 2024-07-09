import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

export default function Cube() {
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
    )
}

useGLTF.preload('meshes/cube.glb')
