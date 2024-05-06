import { useNavigate, useSearchParams } from 'react-router-dom'
import { loginCallback } from '../lib/auth'
import { useEffect } from 'react'

type Props = {
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Callback({ setAuthenticated }: Props) {

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    useEffect(() => {
        if (code) {
            loginCallback(code)
            setAuthenticated(true)
            navigate('/')
        } else {
            console.log(error)
        }
    }, [])

    return (
        <>
        </>
    )
}