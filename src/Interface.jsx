import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import useGame from './store/useGame.js'
import useControls from './store/useControls.js'
import { addEffect } from '@react-three/fiber'
import { isMobile, isDesktop } from 'react-device-detect'
import { Joystick } from 'react-joystick-component'

const images = [
    '/images/lvl-1.png',
    '/images/lvl-2.png',
    '/images/lvl-3.png',
    '/images/lvl-4.png',
    '/images/bottom.png',
]

const preloadImages = async (imagesArray) => {
    const promises = imagesArray.map(
        (src) =>
            new Promise((resolve, reject) => {
                const img = new Image()
                img.onload = () => resolve(src)
                img.onerror = () =>
                    reject(new Error(`Failed to load image: ${src}`))
                img.src = src
            })
    )

    await Promise.allSettled(promises)
}

export default function Interface() {
    const time = useRef()
    const fullscreen = useRef()
    const phase = useGame((state) => state.phase)
    const restart = useGame((state) => state.restart)

    /**
     * Render interface / modal
     */
    const [isVisible, setIsVisible] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(true)
    const [isHelpOpen, setIsHelpOpen] = useState(false)

    useEffect(() => {
        if (phase !== 'loading' && phase !== 'intro') {
            setIsVisible(true)
        }

        if (phase !== 'ended') {
            setIsModalVisible(true)
        }

        if (phase === 'intro') {
            setIsHelpOpen(false)
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
     * Controls
     */
    const ControlKey = memo(({ isActive }) => {
        return <div className={`key${isActive ? ' active' : ''}`}>↑</div>
    })

    // Desktop with keyboard
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)

    // Mobile with joystick and click
    const setClickControls = useControls((state) => state.setClickControls)
    const setBoxHelper = useControls((state) => state.setBoxHelper)
    const setLevelHelper = useControls((state) => state.setLevelHelper)

    const joystickMove = useCallback((event) => {
        switch (event.direction) {
            case 'FORWARD':
                setClickControls(true, false, false, false)
                break
            case 'RIGHT':
                setClickControls(false, true, false, false)
                break
            case 'BACKWARD':
                setClickControls(false, false, true, false)
                break
            case 'LEFT':
                setClickControls(false, false, false, true)
                break
            default:
                break
        }
    }, [])
    const joystickStop = () => setClickControls(false, false, false, false)

    const touchStartBoxHelper = () => setBoxHelper(true)
    const touchEndBoxHelper = () => setBoxHelper(false)
    const touchStartLevelHelper = () => setLevelHelper(true)
    const touchEndLevelHelper = () => setLevelHelper(false)

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
            elapsedTime = elapsedTime.toFixed()

            const minutes = Math.floor(elapsedTime / 60)
            const seconds = elapsedTime % 60

            function padTo2Digits(number) {
                return number.toString().padStart(2, '0')
            }

            const result = `${minutes}:${padTo2Digits(seconds)}`

            if (time.current) time.current.textContent = result
        })

        return () => {
            unsubscribeEffect
        }
    }, [])

    /**
     * Fullscreen toggle
     */
    const fullscreenToggle = useCallback(() => {
        if (document.fullscreenElement) {
            fullscreen.current.src = '/images/fullscreen.svg'
            document.exitFullscreen()
        } else {
            fullscreen.current.src = 'images/fullscreen-exit.svg'
            document.documentElement.requestFullscreen()
        }
    }, [])

    return (
        <>
            <div className={`interface${isVisible ? '--visible' : ''}`}>
                {/* Map */}
                <div className="interface__map">
                    {images.map((image, index) => {
                        return (
                            <img
                                loading="lazy"
                                key={image}
                                src={image}
                                alt="map"
                                className={`map__level${
                                    activLevel === index ? '--active' : ''
                                }`}
                            />
                        )
                    })}
                </div>

                {/* Controls */}
                <div className="interface__controls">
                    {isDesktop && (
                        <div className="controls_keys">
                            <div className="row">
                                <ControlKey isActive={forward} />
                            </div>
                            <div className="row">
                                <ControlKey isActive={leftward} />
                                <ControlKey isActive={backward} />
                                <ControlKey isActive={rightward} />
                            </div>
                        </div>
                    )}
                    {isMobile && (
                        <div className="controls__joystick">
                            <Joystick
                                baseColor={'#283739'}
                                stickColor={'#a9c52f'}
                                size={90}
                                stickSize={55}
                                baseShape="square"
                                throttle={100}
                                move={joystickMove}
                                stop={joystickStop}
                            />
                        </div>
                    )}
                </div>

                {/* Time */}
                <div ref={time} className="interface__time">
                    0.00
                </div>

                {/* Restart */}
                {(phase === 'ended' || phase === 'playing') && (
                    <div className="interface__restart" onClick={restart}>
                        Restart
                    </div>
                )}

                {/* Credits */}
                <div className="interface__credits">
                    <span className="credits__text">
                        Inspired by INSIDE³ Cube
                    </span>
                    <span className="credits__dash">-</span>
                    <span className="credits__text">
                        Made by{' '}
                        <a
                            href="https://github.com/K0Si-003"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Kosi
                        </a>
                    </span>
                </div>

                {/* Help */}
                <div className="interface__help">
                    <button
                        className="help__button"
                        onClick={() => setIsHelpOpen(!isHelpOpen)}
                    >
                        ?
                    </button>
                    {isMobile && (
                        <div className="help__button--mobile">
                            <div
                                className="help__box"
                                onTouchStart={touchStartBoxHelper}
                                onTouchEnd={touchEndBoxHelper}
                            >
                                <img
                                    className="box__img"
                                    src="./images/icon-box.png"
                                    alt="Green box icon with perspective"
                                />
                            </div>
                            <div
                                className="help__level"
                                onTouchStart={touchStartLevelHelper}
                                onTouchEnd={touchEndLevelHelper}
                            >
                                <img
                                    className="level__img"
                                    src="./images/icon-level.png"
                                    alt="Level icon with perspective"
                                />
                            </div>
                        </div>
                    )}

                    <div
                        className={`help__modal${
                            isHelpOpen ? '--visible' : ''
                        }`}
                    >
                        <div className="modal__content">
                            <h3>Helpers</h3>
                            <p>
                                Hard to find your way around ? You can use a
                                helper :
                            </p>
                            <ul>
                                <li>
                                    {isMobile
                                        ? 'Touch the box icon to make the cube transparent'
                                        : 'Press Left Shift Key to make the cube transparent'}
                                </li>
                                <li>
                                    {isMobile
                                        ? 'Touch the level icon to see levels in wireframe'
                                        : 'Press Left Control Key to see the levels in wireframe'}
                                </li>
                            </ul>
                            <p>Don't overuse it !</p>
                            <h3>Controls</h3>
                            <p>
                                {isMobile
                                    ? 'Use the joystick to rotate the cube'
                                    : 'Use arrows or WASD keys to rotate the cube.'}
                            </p>
                        </div>
                        <button
                            className="btn--small"
                            onClick={() => setIsHelpOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Fullscreen */}
                <div className="interface__fullscreen">
                    <img
                        ref={fullscreen}
                        src='images/fullscreen.svg'
                        className="fullscreen__img"
                        onClick={fullscreenToggle}
                    />
                </div>

                {/* Pop-up Finish */}
                {phase === 'ended' && (
                    <div
                        className={`interface__finish${
                            isModalVisible ? '--visible' : ''
                        }`}
                    >
                        <p className="finish__text">
                            Congrats 🎉! You did it 😉! You can retry for a
                            better time or the reverse path.
                        </p>
                        <button
                            className="btn--small"
                            onClick={() => setIsModalVisible(false)}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}
