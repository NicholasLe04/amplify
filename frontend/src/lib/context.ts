import { createContext } from 'react'

const ProfileContext = createContext<{
    profile: { displayName: string, imgUrl: string },
    setProfile: React.Dispatch<React.SetStateAction<{ displayName: string, imgUrl: string }>>
}>({ profile: { displayName: '', imgUrl: '' }, setProfile: () => { } })

export { ProfileContext }