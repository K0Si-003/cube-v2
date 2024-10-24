import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'
import useGame from './store/useGame.js'

export default function Overlay() {
    const [isLoaded, setIsLoaded] = useState(false)

    const { progress } = useProgress()

    const ready = useGame((state) => state.ready)
    const imagesLoaded = useGame((state) => state.imagesLoaded)

    useEffect(() => {
        if (progress === 100 && imagesLoaded === true) {
            ready()

            const timer = setTimeout(() => {
                setIsLoaded(true)
            }, 1500)

            return () => clearTimeout(timer)
        }
    }, [progress, imagesLoaded])

    return (
        <div className={`overlay${isLoaded ? ' loaded' : ''}`}>
            <div className="loader">
                <p>{progress} % loaded</p>
            </div>
        </div>
    )
}
