import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import useGame from './store/useGame.js'

export default function Overlay() {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isStarted, setIsStarted] = useState(false)

    /**
     * Handle assets loading
     */
    const { progress } = useProgress() // loading for meshes
    const imagesLoaded = useGame((state) => state.imagesLoaded) // loading for map images
    const intro = useGame((state) => state.intro) // set phase to intro

    const [loadingProgress, setLoadingProgress] = useState(25)
    const [hasIncrementedImagesLoaded, setHasIncrementedImagesLoaded] =
        useState(false)
    const [hasIncrementedProgress, setHasIncrementedProgress] = useState(false)

    useEffect(() => {
        if (imagesLoaded && !hasIncrementedImagesLoaded) {
            setLoadingProgress((prev) => prev + 25)
            setHasIncrementedImagesLoaded(true)
        }
    }, [imagesLoaded, hasIncrementedImagesLoaded])

    useEffect(() => {
        if (progress === 100 && !hasIncrementedProgress) {
            setLoadingProgress((prev) => prev + 50)
            setHasIncrementedProgress(true)
        }
    }, [progress, hasIncrementedProgress])

    /**
     * Btn Start
     */
    const handleButtonEnter = () => {
        if (loadingProgress === 100) {
            setIsLoaded(true)
        }
    }
    const handleButtonStart = () => {
        if (loadingProgress === 100) {
            setIsStarted(true)
            intro()
        }
    }

    return (
        <div className={`overlay${isStarted ? ' loaded' : ''}`}>
            <div className="landing">
                <h1 className="title">Cube Puzzle 3D</h1>
                <button className="btn" onClick={handleButtonEnter}>
                    Enter
                </button>
                <p className="loading">{loadingProgress}%</p>
            </div>
            <div className={`rules${isLoaded ? ' loaded' : ''}`}>
                <h2 className="title">The rules</h2>
                <p className="text">
                    Resolve this 3D maze puzzle. Guide the ball through the cube
                    to reach the finish !
                </p>
                <h2 className="title">Controls</h2>
                <p className="text">
                    Use arrows or WASD keys to rotate the cube.
                </p>
                <button className="btn" onClick={handleButtonStart}>
                    Start
                </button>
            </div>
        </div>
    )
}
