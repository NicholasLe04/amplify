import { useNavigate } from 'react-router-dom'

async function login() {
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/auth/authorize`, {
        method: 'GET',
        credentials: 'include'
    })
    const text = await res.text()
    window.location.href = text
}

// we use useNavigate here to avoid reloading the page
async function loginCallback(code: string) {
    const navigate = useNavigate()
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/auth/callback?code=${code}`, {
        method: 'GET',
        credentials: 'include'
    })
    const text = await res.text()
    console.log(text)
    navigate(`/home`)
}

// we use useNavigate here to avoid reloading the page
async function logout() {
    const navigate = useNavigate()
    await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/auth/logout`, {
        method: 'GET',
        credentials: 'include'
    })
    navigate('/')
}

async function isSessionValid() {
    let response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/auth/session/validate`, {
        method: 'GET',
        credentials: 'include'
    })
    const jsonResponse = await response.json()
    if (jsonResponse.status === "valid") {
        return true
    } else {
        return false
    }
}

export { login, loginCallback, logout, isSessionValid }