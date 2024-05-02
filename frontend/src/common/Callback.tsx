import { useNavigate, useSearchParams } from 'react-router-dom'
import { loginCallback } from '../lib/auth'
import { useEffect } from 'react'

export default function Callback() {

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    useEffect(() => {
        if (code) {
            loginCallback(code)
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