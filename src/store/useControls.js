import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(
    subscribeWithSelector((set) => {
        return {
            /**
             * Controls for mobile
             */
            forward: false,
            rightward: false,
            backward: false,
            leftward: false,

            setClickControls: (forward, rightward, backward, leftward) => set({ forward, rightward, backward, leftward })
        }
    })
)