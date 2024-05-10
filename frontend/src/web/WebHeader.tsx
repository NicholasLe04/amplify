import { useContext, useEffect, useState } from 'react'
import { login, logout } from '../lib/auth'
import { ProfileContext } from '../lib/context'
import { getUserDetails } from '../lib/user'

type Props = {
    authenticated: boolean | null,
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>
}

export default function WebHeader({ authenticated, setAuthenticated }: Props) {

    const [logoutMenu, setLogoutMenu] = useState(false)
    const profileContext = useContext(ProfileContext)

    useEffect(() => {
        if (authenticated) {
            getUserDetails().then((data) => {
                profileContext?.setProfile(data)
            })
        }
    }, [])

    return (
        <>
            <div className='w-full h-14 border-b-2 border-space-lighter px-5 py-3 flex justify-between select-none'>
                <div className='text-lg'>Amplify</div>
                {
                    authenticated ?
                        logoutMenu ?
                            <div className='text-lg px-2 bg-space-light rounded-lg transition ease-in-out hover:bg-space-lighter' onClick={() => { logout(); setAuthenticated(false) }}>logout</div>
                            :
                            <div className='flex gap-2' onClick={() => { setLogoutMenu(!logoutMenu); setTimeout(() => { setLogoutMenu(false) }, 3000) }}>
                                {profileContext?.profile.imgUrl ?
                                    <>
                                        <img className='aspect-square rounded-full' width={30} src={profileContext.profile.imgUrl} alt='profile' />
                                        <div className='text-lg'>{profileContext!.profile.displayName}</div>
                                    </>
                                    :
                                    null
                                }
                            </div>

                        :
                        <div className='text-lg px-2 bg-space-light rounded-lg transition ease-in-out hover:bg-space-lighter' onClick={login}>login</div>
                }
            </div>
        </>
    )
}