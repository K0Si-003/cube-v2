import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import useGame from './store/useGame.js'

export default function Overlay() {
    const [isLoaded, setIsLoaded] = useState(false)

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
    const handleButtonClick = () => {
        if (loadingProgress === 100) {
            setIsLoaded(true)
            intro()
        }
    }

    return (
        <div className={`overlay${isLoaded ? ' loaded' : ''}`}>
            <button className="btn" onClick={handleButtonClick}>
                Cliquez ici
            </button>
            <div className="loader">
                <p>{loadingProgress} % loaded</p>
            </div>
        </div>
    )
}
