import { useContext, useState } from 'react'
import { login, logout } from '../lib/auth'
import { ProfileContext } from '../lib/context'

type Props = {
    authenticated: boolean,
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

export default function WebHeader({ authenticated, setAuthenticated }: Props) {

    const [logoutMenu, setLogoutMenu] = useState(false)
    const profileContext = useContext(ProfileContext)

    return (
        <>
            <div className='w-full h-14 border-b-4 border-space-light px-5 py-3 flex justify-between'>
                <div className='text-lg'>Amplify</div>
                {
                    authenticated ?
                        logoutMenu ?
                            <div className='text-lg px-2 bg-space-light rounded-lg' onClick={() => { logout(); setAuthenticated(false) }}>logout</div>
                            :
                            <div className='flex' onClick={() => { setLogoutMenu(!logoutMenu); setTimeout(() => { setLogoutMenu(false) }, 3000) }}>
                                <img className='aspect-square rounded-full mr-2' width={30} src={profileContext.profile.imgUrl} alt='profile' />
                                <div className='text-lg'>{profileContext.profile.displayName}</div>
                            </div>

                        :
                        <div className='text-lg' onClick={login}>login</div>
                }
            </div>
        </>
    )
}