import { createContext } from 'react'

type Profile = {
    id: string,
    email: string,
    country: string,
    imgUrl: string,
    displayName: string
}

const ProfileContext = createContext<{ profile: Profile, setProfile: React.Dispatch<React.SetStateAction<Profile>> } | null>(null)

export { ProfileContext }