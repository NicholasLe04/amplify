import { createContext } from 'react'

const ProfileContext = createContext<{
    profile: { 
        email: string, 
        country: string, 
        externalUrl: string, 
        imgUrl: string,
        displayName: string 
    },
    setProfile: React.Dispatch<React.SetStateAction<{ 
        email: string, 
        country: string, 
        externalUrl: string, 
        imgUrl: string,
        displayName: string 
    }>>
}>(
    { 
        profile: { 
            email: '', 
            country: '', 
            externalUrl: '', 
            imgUrl: '',
            displayName: '' 
        }, 
        setProfile: () => {} 
    }
)

export { ProfileContext }