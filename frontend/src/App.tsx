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
import axios from 'axios'

export default function App() {

    const queryClient = new QueryClient()
    const ProfileContext = createContext({ username: '', track: '', artists: [], artwork: '' });
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const profile = useQuery({
        queryKey: ['nowPlaying'],
        queryFn: async () => {
            return axios.get('')
        }
    })

    const debouncedHandleResize = lodash.throttle((size) => {
        setWindowWidth(size)
    }, 250)

    // mobile and 
    useEffect(() => {
        window.addEventListener("resize", () => {
            debouncedHandleResize(window.innerWidth)
        })

        return () => {
            window.removeEventListener("resize", () => {
                debouncedHandleResize(window.innerWidth)
            })
        }
    }, [])

    return (
        <>
            {
                windowWidth < 768 ?
                    // mobile
                    <Wrapper queryClient={queryClient} ProfileContext={ProfileContext}>
                        <div className='w-full h-full flex flex-col'>
                            <MobileHeader />
                            <div className='flex-1'>
                                <Routes>
                                    <Route path="/home" element={<MobileHome />} />
                                    <Route path="/profile" element={<MobileProfile />} />
                                </Routes>
                            </div>
                            <MobileFooter />
                        </div>
                    </Wrapper>
                    :
                    // web
                    <Wrapper queryClient={queryClient} ProfileContext={ProfileContext}>
                        <div className='h-full w-full flex'>
                            <WebSidebar />
                            <div className='flex flex-col flex-1'>
                                <WebHeader />
                                <Routes>
                                    <Route path="/home" element={<WebHome />} />
                                    <Route path="/profile" element={<WebProfile />} />
                                </Routes>
                            </div>
                        </div>
                    </Wrapper>
            }
        </>
    )
}