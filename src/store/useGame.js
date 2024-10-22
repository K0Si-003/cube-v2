import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(
    subscribeWithSelector((set) => {
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

            /**
             * Phases
             */
            phase: 'playing',

            end: () => {
                set((state) => {
                    if (state.phase === 'playing')
                        return { phase: 'ended', startTime: Date.now() }
                    return {}
                })
            },
        }
    })
)
