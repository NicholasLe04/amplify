import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

type Props = {
    queryClient: QueryClient,
    ProfileContext: React.Context<any>,
    children: React.ReactNode
}

export default function Wrapper({ queryClient, ProfileContext, children }: Props) {
    return (
        <>
            <ProfileContext.Provider value={ProfileContext}>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        {children}
                    </BrowserRouter>
                </QueryClientProvider>
            </ProfileContext.Provider>
        </>
    )
}