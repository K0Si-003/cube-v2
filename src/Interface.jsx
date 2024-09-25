import { useEffect, useState } from "react"
import { useKeyboardControls  } from "@react-three/drei"
import useGame from "./store/useGame.js"

export default function Interface() {
    // Get pressed keyboard touch
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)

    // Set maps img src from store
    const ballPosition = useGame((state) => state.ballPosition)
    const [imageSrc, setImageSrc] = useState(ballPosition)
    useEffect(() => {
        const getImageSrc = () => {
            switch (ballPosition) {
              case 'cubeLevel1':
                return '/images/lvl-1.png';
              case 'cubeLevel2':
                return '/images/lvl-2.png';
              case 'cubeLevel3':
                return '/images/lvl-3.png';
              case 'cubeLevel4':
                return '/images/lvl-4.png';
              case 'cubeBottom':
                return '/images/bottom.png';
              default:
                return '/images/lvl-1.png';
            }
          };
        setImageSrc(getImageSrc())
    }, [ballPosition])

    return (
        <div className="interface">
            <div className="map">
                <img loading="lazy" src={imageSrc} alt="map" />
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
