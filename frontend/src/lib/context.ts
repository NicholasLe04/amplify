import { createContext } from 'react'

type Profile = {
    email: string,
    country: string,
    externalUrl: string,
    imgUrl: string,
    displayName: string
}

const ProfileContext = createContext<{ profile: Profile, setProfile: React.Dispatch<React.SetStateAction<Profile>> } | null>(null)

export { ProfileContext }