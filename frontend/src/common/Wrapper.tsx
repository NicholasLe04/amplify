import { QueryClient } from '@tanstack/react-query'
import React from 'react'
import { BrowserRouter, Routes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'


type Props = {
    queryClient: QueryClient,
    children: React.ReactNode
}

export default function Wrapper({ queryClient, children }: Props) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        {children}
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </>
    )
}