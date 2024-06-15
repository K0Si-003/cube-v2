import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

const boxMaterial = new THREE.MeshStandardMaterial({ 
    color: '#459E15',
    metalness: '0.5',
    roughness: '1',
    // wireframe: true
    transparent: true,
    opacity: '0.5'
})

const levelMaterial = new THREE.MeshStandardMaterial({ 
    color: '#101010'
})


export function Top() {
    const top = useGLTF('./meshes/all_pieces.glb')
    
    return (
        <mesh scale={[0.2, 0.2, 0.2]} geometry={top.nodes.Top.geometry} material={boxMaterial} />
    )
}

// export function Level1() {
//     const level1 = useGLTF('./meshes/1_level-1.glb')
//     return (
//         <mesh scale={[0.2, 0.2, 0.2]} geometry={level1.nodes.Level1.geometry} material={levelMaterial} />
//     )
// }
