import { login, logout } from '../lib/auth'

type Props = {
    authenticated: boolean,
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

export default function WebHeader({ authenticated, setAuthenticated }: Props) {

    return (
        <>
            <div className='w-full h-14 border-b-4 border-space-light px-5 py-3 flex justify-between'>
                <div className='text-lg'>Amplify</div>
                {
                    authenticated ?
                        <div onClick={() => { logout(); setAuthenticated(false) }}>logout</div>
                        :
                        <div onClick={login}>login</div>
                }
            </div>
        </>
    )
}