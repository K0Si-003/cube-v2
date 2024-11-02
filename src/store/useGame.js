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
             * Images loading
             */
            imagesLoaded: false,

            setImagesLoadingStatus: () => {
                set(() => {
                    return { imagesLoaded: true }
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
