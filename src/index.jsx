import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <React.StrictMode>
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
    </React.StrictMode>
)
