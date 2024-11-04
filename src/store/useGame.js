import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(
    subscribeWithSelector((set) => {
        return {
            /**
             * Images loading
             */
            imagesLoaded: false,

            setImagesLoadingStatus: () => {
                set(() => {
                    return { imagesLoaded: true }
                })
            },

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
             * Time
             */
            startTime: 0,
            endTime: 0,

            /**
             * Phases
             */
            phase: 'loading',

            intro: () => {
                set((state) => {
                    if (state.phase === 'loading') return { phase: 'intro' }
                    return {}
                })
            },

            ready: () => {
                set((state) => {
                    if (state.phase === 'intro')
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

            restart: () => {
                set((state) => {
                    if (state.phase === 'playing' || state.phase === 'ended') {
                        return { phase: 'intro' }
                    }
                    return {}
                })
            },

            end: () => {
                set((state) => {
                    if (state.phase === 'playing')
                        return { phase: 'ended', endTime: Date.now() }
                    return {}
                })
            },
        }
    })
)
