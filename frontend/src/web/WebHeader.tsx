import { useContext } from 'react'
import { login, logout } from '../lib/auth'
import { ProfileContext } from '../lib/context'
import { getUserDetails } from '../lib/user'

type Props = {
    authenticated: boolean,
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

export default function WebHeader({ authenticated, setAuthenticated }: Props) {

    const profileContext = useContext(ProfileContext)
    console.log(profileContext.profile)

    return (
        <>
            <div className='w-full h-14 border-b-4 border-space-light px-5 py-3 flex justify-between'>
                <div className='text-lg'>Amplify</div>
                {
                    authenticated ?
                        <div className='flex gap-5'>
                            <div className='flex gap-1'>
                                <img src={profileContext.profile.imgUrl} alt='profile' className='w-8 h-8 rounded-full' />
                                <div>{profileContext.profile.displayName}</div>
                            </div>
                            <div onClick={() => { logout(); setAuthenticated(false) }}>logout</div>
                        </div>
                        :
                        <div onClick={async () => { login() }}>login</div>
                }
            </div>
        </>
    )
}