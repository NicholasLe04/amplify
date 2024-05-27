import { QueryClient } from '@tanstack/react-query'
import lodash from 'lodash'
import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Callback from './common/Callback'
import Wrapper from './common/Wrapper'
import { refreshToken } from './lib/auth'
import MobileFooter from './mobile/MobileFooter'
import MobileHeader from './mobile/MobileHeader'
import MobileHome from './mobile/MobileHome'
import MobileProfile from './mobile/MobileProfile'
import WebHeader from './web/WebHeader'
import WebHome from './web/WebHome'
import WebProfile from './web/WebProfile'
import WebSidebar from './web/WebSidebar'

const queryClient = new QueryClient()

export default function App() {

    const [authenticated, setAuthenticated] = useState<boolean | null>(null)
    const [profile, setProfile] = useState({
        id: '',
        country: '',
        email: '',
        imgUrl: '',
        displayName: ''
    })
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    // debounced window resize handler
    const debouncedHandleResize = lodash.throttle((size) => {
        setWindowWidth(size)
    }, 500)

    // check logged in
    useEffect(() => {
        function checkExpiration() {
            const expiresAt = localStorage.getItem('expires_at')
            if (expiresAt) {
                if (new Date() > new Date(expiresAt)) { // if expired initiate refresh
                    refreshToken()
                }
                // idk i put a setTimeout so there isnt race condition with localStorage
                setTimeout(() => {
                    setAuthenticated(true)
                }, 500)
            } else {
                setAuthenticated(false)
            }
        }

        checkExpiration()
        const interval = setInterval(checkExpiration, 5 * 60 * 1000) // Check every 5 minutes

        return () => clearInterval(interval)
    }, [])

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

    useEffect(() => {

    })

    return (
        <>
            {authenticated === true ? // need to do this bc null is falsey value
                <Wrapper queryClient={queryClient} profile={profile} setProfile={setProfile}>
                    {
                        windowWidth < 800 ?
                            // mobile
                            <div className='w-full h-full flex flex-col'>
                                <MobileHeader authenticated={authenticated} setAuthenticated={setAuthenticated} />
                                <div className='h-[calc(100%-112px)]'>
                                    <Routes>
                                        <Route path='/' element={<MobileHome />} />
                                        <Route path='/profile/:user_id' element={<MobileProfile />} />
                                        <Route path='/callback' element={<Callback setAuthenticated={setAuthenticated} />} />
                                    </Routes>
                                </div>
                                <MobileFooter />
                            </div>
                            :

                            // web
                            <div className='h-full w-full flex'>
                                <WebSidebar />
                                <div className='flex flex-col flex-1'>
                                    <WebHeader authenticated={authenticated} setAuthenticated={setAuthenticated} />
                                    <Routes>
                                        <Route path='/' element={<WebHome />} />
                                        <Route path='/profile/:user_id' element={<WebProfile />} />
                                        <Route path='/callback' element={<Callback setAuthenticated={setAuthenticated} />} />
                                    </Routes>
                                </div>
                            </div>
                    }
                </Wrapper>
                : null
            }
            {authenticated === false ? // need to do this bc null is falsey value
                <>
                    {
                        windowWidth < 800 ?
                            // mobile
                            <Wrapper queryClient={queryClient} profile={profile} setProfile={setProfile}>
                                <Routes>
                                    <Route path='/' element={
                                        <>
                                            <MobileHeader />
                                            <div>home page here</div>
                                        </>
                                    } />
                                    <Route path='/callback' element={<Callback setAuthenticated={setAuthenticated} />} />
                                </Routes>
                            </Wrapper>
                            :
                            // web
                            <Wrapper queryClient={queryClient} profile={profile} setProfile={setProfile}>
                                <Routes>
                                    <Route path='/' element={
                                        <>
                                            <WebHeader authenticated={authenticated} setAuthenticated={setAuthenticated} />
                                            <div>home page here</div>
                                        </>
                                    } />
                                    <Route path='/callback' element={<Callback setAuthenticated={setAuthenticated} />} />
                                </Routes>
                            </Wrapper>
                    }
                </> : null
            }
        </>
    )
}