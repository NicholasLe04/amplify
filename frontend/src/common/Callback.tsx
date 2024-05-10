import { useNavigate, useSearchParams } from 'react-router-dom'
import { loginCallback } from '../lib/auth'
import { useContext, useEffect } from 'react'
import { ProfileContext } from '../lib/context'

type Props = {
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>
}

export default function Callback({ setAuthenticated }: Props) {

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const profileContext = useContext(ProfileContext)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    useEffect(() => {
        if (code && profileContext) {
            loginCallback(code)
                .then(() => { setAuthenticated(true) })
                .then(() => { navigate('/') });
        } else {
            console.log(error)
        }
    }, [])

    return (
        <>
        </>
    )
}