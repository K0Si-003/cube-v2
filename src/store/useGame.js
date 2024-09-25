import { create } from 'zustand'

export default create((set) => {
    return {
        /**
         * ballPosition
         */
        ballPosition: null,

        changePosition: (newPosition) => {
            set(() => {
                return { ballPosition: newPosition }
            })
        },
    }
})
