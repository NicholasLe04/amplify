import { QueryClient } from '@tanstack/react-query'
import lodash from 'lodash'
import { useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import Wrapper from './common/Wrapper'
import WebHome from './web/WebHome'
import MobileHome from './mobile/MobileHome'

function App() {

    const queryClient = new QueryClient()
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

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
                    <Wrapper queryClient={queryClient}>
                        <Route path="/home" element={<MobileHome />} />
                    </Wrapper>
                    :
                    // web
                    <Wrapper queryClient={queryClient}>
                        <Route path="/home" element={<WebHome />} />
                    </Wrapper>
            }
        </>
    )
}

export default App