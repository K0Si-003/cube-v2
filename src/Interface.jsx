import { useCallback, useEffect, useRef, useState } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import useGame from './store/useGame.js'
import { addEffect } from '@react-three/fiber'

const images = [
    '/images/lvl-1.png',
    '/images/lvl-2.png',
    '/images/lvl-3.png',
    '/images/lvl-4.png',
    '/images/bottom.png',
]

const preloadImages = (imageArray) => {
    return Promise.all(
        imageArray.map((src) => {
            return new Promise((resolve, reject) => {
                const img = new Image()
                img.src = src
                img.onload = () => resolve(src)
                img.onerror = () =>
                    reject(new Error(`Failed to load image: ${src}`))
            })
        })
    )
}

export default function Interface() {
    const time = useRef()
    const phase = useGame((state) => state.phase)

    /**
     * Render interface
     */
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (phase !== 'loading' && phase !== 'intro') {
            setIsVisible(true)
        }
    }, [phase])

    /**
     * Images loading for levels maps
     */
    const setImagesLoadingStatus = useGame(
        (state) => state.setImagesLoadingStatus
    )

    useEffect(() => {
        preloadImages(images)
            .then(() => {
                setImagesLoadingStatus()
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    /**
     * Controls
     */
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)

    const ControlKey = ({ isActive }) => (
        <div className={`key ${isActive ? 'active' : ''}`}></div>
    )

    /**
     * Level maps
     */
    const [activLevel, setActivLevel] = useState(0)
    const ballPosition = useGame((state) => state.ballPosition)

    const getActivLevel = useCallback(() => {
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
    }, [ballPosition])

    useEffect(() => {
        setActivLevel(getActivLevel())
    }, [ballPosition])

    /**
     * Timer
     */
    useEffect(() => {
        const unsubscribeEffect = addEffect(() => {
            const state = useGame.getState()

            let elapsedTime = 0

            if (state.phase === 'playing')
                elapsedTime = Date.now() - state.startTime
            else if (state.phase === 'ended')
                elapsedTime = state.endTime - state.startTime

            elapsedTime /= 1000
            elapsedTime = elapsedTime.toFixed(1)

            if (time.current)
                time.current.textContent = elapsedTime
            
        })

        return () => {
            unsubscribeEffect
        }
    }, [])

    return (
        <>
            <div className={`interface${isVisible ? ' visible' : ''}`}>
                {/* Time */}
                <div ref={time} className="time">
                    0.00
                </div>

                {/* Map */}
                <div className="map">
                    {images.map((image, index) => {
                        return (
                            <img
                                loading="lazy"
                                key={image}
                                src={image}
                                alt="map"
                                className={`map--level${
                                    activLevel === index ? ' active' : ''
                                }`}
                            />
                        )
                    })}
                </div>

                {/* Controls */}
                <div className="controls">
                    <div className="raw">
                        <ControlKey isActive={forward} />
                    </div>
                    <div className="raw">
                        <ControlKey isActive={leftward} />
                        <ControlKey isActive={backward} />
                        <ControlKey isActive={rightward} />
                    </div>
                </div>
            </div>
        </>
    )
}
