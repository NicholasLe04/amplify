import { useSearchParams } from 'react-router-dom'
import { loginCallback } from '../lib/auth'

export default function Callback() {

    const [searchParams] = useSearchParams()
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (code) {
        loginCallback(code)
    } else {
        console.log(error)
    }

    return (
        <>
        </>
    )
}