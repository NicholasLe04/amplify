import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ProfileContext } from '../lib/context'

type Props = {
    queryClient: QueryClient,
    profile: {
        id: string,
        country: string,
        email: string,
        imgUrl: string,
        displayName: string
    },
    setProfile: React.Dispatch<React.SetStateAction<{
        id: string,
        country: string,
        email: string,
        imgUrl: string,
        displayName: string
    }>>,
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