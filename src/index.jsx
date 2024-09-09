import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Experience from './Experience.jsx'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import Interface from './Interface.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <React.StrictMode>
        <KeyboardControls
            map={[
                { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
                { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
                { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
                { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
            ]}
        >
            <Canvas
                shadows
                camera={{
                    fov: 35,
                    near: 0.5,
                    far: 600,
                    position: [0, 50, 25],
                }}
            >
                <Experience />
            </Canvas>
            <Interface />
        </KeyboardControls>
    </React.StrictMode>
)
