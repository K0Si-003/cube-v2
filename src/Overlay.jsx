import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'
import useGame from './store/useGame.js'

export default function Overlay() {
    const [isLoaded, setIsLoaded] = useState(false)

    const { progress } = useProgress()

    const ready = useGame((state) => state.ready)
    const phase = useGame((state) => state.phase)

    console.log(phase)

    useEffect(() => {
        if (progress == 100) {
            ready()

            const timer = setTimeout(() => {
                setIsLoaded(true)
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [progress])

    return (
        <div className={`overlay ${isLoaded ? 'loaded' : ''}`}>
            <div className="container">
                <p>{progress} % loaded</p>
            </div>
        </div>
    )
}
