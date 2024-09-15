import { useKeyboardControls  } from "@react-three/drei"

export default function Interface() {
    const text = 'Test OK text for interface'

    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)

    return (
        <div className="interface">
            <p>{text}</p>
            <div className="map">
                <img loading="lazy" src="images/lvl-1.png" alt="map" />
            </div>
            {/* Controls */}
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
