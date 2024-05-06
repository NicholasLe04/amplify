import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ProfileContext } from '../lib/context'

type Props = {
    queryClient: QueryClient,
    profile: { displayName: string, imgUrl: string },
    setProfile: React.Dispatch<React.SetStateAction<{ displayName: string, imgUrl: string }>>,
    children: React.ReactNode
}

export default function Wrapper({ queryClient, profile, setProfile, children }: Props) {
    return (
        <>
            <ProfileContext.Provider value={{ profile, setProfile }} >
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        {children}
                    </BrowserRouter>
                </QueryClientProvider>
            </ProfileContext.Provider>
        </>
    )
}