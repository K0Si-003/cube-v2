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
            phase: 'loading',

            ready: () => {
                set((state) => {
                    if (state.phase === 'loading')
                        return { phase: 'ready', startTime: Date.now() }
                    return {}
                })
            },

            start: () => {
                set((state) => {
                    if (state.phase === 'ready')
                        return { phase: 'playing', startTime: Date.now() }
                    return {}
                })
            },

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
