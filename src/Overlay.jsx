import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import useGame from './store/useGame.js'

export default function Overlay() {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    /**
     * Handle assets loading
     */
    const { progress } = useProgress() // loading for meshes
    const imagesLoaded = useGame((state) => state.imagesLoaded) // loading for map images
    const intro = useGame((state) => state.intro) // set phase to intro

    const [loadingProgress, setLoadingProgress] = useState(25)
    const [hasIncrementedImagesLoaded, setHasIncrementedImagesLoaded] = useState(false)
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
            setIsCompleted(true)
            intro()
        }
    }

    return (
        <div className={`overlay${isCompleted ? '--completed' : ''}`}>
            <div className="overlay__landing">
                <h1 className="landing__title">Cube Puzzle 3D</h1>
                <button className="landing__btn" onClick={handleButtonEnter}>
                    Enter
                </button>
                <p className="landing__loading">{loadingProgress}%</p>
            </div>
            <div className={`overlay__rules${isLoaded ? '--loaded' : ''}`}>
                <h2 className="rules__title">The rules</h2>
                <p className="rules__text">
                    Resolve this 3D maze puzzle. Guide the ball through the cube
                    to reach the finish !
                </p>
                <h2 className="rules__title">Controls</h2>
                <p className="rules__text">
                    Use arrows or WASD keys to rotate the cube.
                </p>
                <button className="rules__btn" onClick={handleButtonStart}>
                    Start
                </button>
            </div>
        </div>
    )
}
