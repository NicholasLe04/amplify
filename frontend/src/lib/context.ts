import { createContext } from 'react'

type Profile = {
    email: string,
    country: string,
    externalUrl: string,
    imgUrl: string,
    displayName: string
}

const ProfileContext = createContext<{ profile: Profile, setProfile: React.Dispatch<React.SetStateAction<Profile>> }>({
    profile: {
        email: '',
        country: '',
        externalUrl: '',
        imgUrl: '',
        displayName: ''
    },
    setProfile: () => { }
})

export { ProfileContext }