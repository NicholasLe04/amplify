import { QueryClient, useQuery } from '@tanstack/react-query'
import lodash from 'lodash'
import { createContext, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Wrapper from './common/Wrapper'
import MobileHome from './mobile/MobileHome'
import WebHome from './web/WebHome'
import WebProfile from './web/WebProfile'
import MobileProfile from './mobile/MobileProfile'
import WebSidebar from './web/WebSidebar'
import WebHeader from './web/WebHeader'
import MobileHeader from './mobile/MobileHeader'
import MobileFooter from './mobile/MobileFooter'
import Callback from './common/Callback'

export default function App() {

    const queryClient = new QueryClient()
    const ProfileContext = createContext({ username: '', track: '', artists: [], artwork: '' })
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const profile = useQuery({
        queryKey: ['nowPlaying'],
        queryFn: async () => {
            const token = localStorage.getItem('access_token')
            const res = await fetch(
                'https://api.spotify.com/v1/me/player/currently-playing',
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            const data = await res.json()
            console.log(data)
            return data
        },
    }, queryClient)

    // debounced window resize handler
    const debouncedHandleResize = lodash.throttle((size) => {
        setWindowWidth(size)
    }, 250)

    // update window width on resize
    useEffect(() => {
        window.addEventListener('resize', () => {
            debouncedHandleResize(window.innerWidth)
        })

        return () => {
            window.removeEventListener('resize', () => {
                debouncedHandleResize(window.innerWidth)
            })
        }
    }, [])

    return (
        <>
            <Wrapper queryClient={queryClient} ProfileContext={ProfileContext}>
                {
                    windowWidth < 768 ?
                        // mobile
                        <div className='w-full h-full flex flex-col'>
                            <MobileHeader />
                            <div className='flex-1'>
                                <Routes>
                                    <Route path='/home' element={<MobileHome />} />
                                    <Route path='/profile' element={<MobileProfile />} />
                                    <Route path='/callback' element={<Callback />} />
                                </Routes>
                            </div>
                            <MobileFooter />
                        </div>
                        :
                        // web
                        <div className='h-full w-full flex'>
                            <WebSidebar />
                            <div className='flex flex-col flex-1'>
                                <WebHeader />
                                <Routes>
                                    <Route path='/home' element={<WebHome />} />
                                    <Route path='/profile' element={<WebProfile />} />
                                    <Route path='/callback' element={<Callback />} />
                                </Routes>
                            </div>
                        </div>
                }
            </Wrapper>
        </>
    )
}