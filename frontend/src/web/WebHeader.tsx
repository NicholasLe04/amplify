import { useContext, useEffect, useState } from 'react'
import { login, logout } from '../lib/auth'
import { ProfileContext } from '../lib/context'
import { getUserDetails } from '../lib/user'

type Props = {
    authenticated: boolean,
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

export default function WebHeader({ authenticated, setAuthenticated }: Props) {

    const [logoutMenu, setLogoutMenu] = useState(false)
    const profileContext = useContext(ProfileContext)

    useEffect(() => {
        if (authenticated) {
            // idk i put a setTimeout so there isnt race with localStorage
            setTimeout(() => {
                getUserDetails().then((data) => {
                    profileContext?.setProfile(data)
                })
            }, 500)
        }
    }, [])

    return (
        <>
            <div className='w-full h-14 border-b-4 border-space-light px-5 py-3 flex justify-between'>
                <div className='text-lg'>Amplify</div>
                {
                    authenticated ?
                        logoutMenu ?
                            <div className='text-lg px-2 bg-space-light rounded-lg' onClick={() => { logout(); setAuthenticated(false) }}>logout</div>
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
                        <div className='text-lg px-2 bg-space-light rounded-lg' onClick={login}>login</div>
                }
            </div>
        </>
    )
}