import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(
    subscribeWithSelector((set) => {
        return {
            /**
             * Images loading
             */
            imagesLoaded: false,

            setImagesLoadingStatus: () => set({ imagesLoaded: true }),

            /**
             * ballPosition
             */
            ballPosition: null,
            
            changePosition: (newPosition) => set({ ballPosition: newPosition }),

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

            start: () => set({ phase: 'playing', startTime: Date.now() }),

            restart: () => set({ phase: 'intro' }),

            end: () => {
                set((state) => {
                    if (state.phase === 'playing')
                        return { phase: 'ended', endTime: Date.now() }
                    return {}
                })
            }

            
        }
    })
)
