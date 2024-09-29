import { useEffect, useState } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import useGame from './store/useGame.js'

export default function Interface() {
    /**
     * Controls
     */
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)

    /**
     * Map
     */
    const images = [
        '/images/lvl-1.png',
        '/images/lvl-2.png',
        '/images/lvl-3.png',
        '/images/lvl-4.png',
        '/images/bottom.png',
    ]

    const ballPosition = useGame((state) => state.ballPosition)
    const [activLevel, setActivLevel] = useState(0)

    const getActivLevel = () => {
        switch (ballPosition) {
            case 'cubeLevel1':
                return 0
            case 'cubeLevel2':
                return 1
            case 'cubeLevel3':
                return 2
            case 'cubeLevel4':
                return 3
            case 'cubeBottom':
                return 4
            default:
                return 0
        }
    }

    useEffect(() => {
        setActivLevel(getActivLevel())
    }, [ballPosition])

    return (
        <div className="interface">
            <div className="map">
                {images.map((image, index) => {
                    return (
                        <img
                            loading="lazy"
                            key={index}
                            src={image}
                            alt="map"
                            className={`map--level ${
                                activLevel === index ? 'active' : ''
                            }`}
                        />
                    )
                })}
            </div>
            <div className="controls">
                <div className="raw">
                    <div className={`key ${forward ? 'active' : ''}`}></div>
                </div>
                <div className="raw">
                    <div className={`key ${leftward ? 'active' : ''}`}></div>
                    <div className={`key ${backward ? 'active' : ''}`}></div>
                    <div className={`key ${rightward ? 'active' : ''}`}></div>
                </div>
            </div>
        </div>
    )
}
