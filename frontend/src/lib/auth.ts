import { getUserDetails } from './user'

type Profile = {
    email: string,
    country: string,
    externalUrl: string,
    imgUrl: string,
    displayName: string
}

async function login() {
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/auth/authorize`, {
        method: 'GET'
    });
    const text = await res.text();
    window.location.href = text;
}

// we use useNavigate here to avoid reloading the page
async function loginCallback(code: string) {
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/auth/callback?code=${code}`, {
        method: 'GET'
    });
    const data = await res.json();

    // store token in browser localStorage
    if (data.access_token) {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('email', data.email)
        let date = new Date()
        date.setSeconds(date.getSeconds() + data.expires_in)
        localStorage.setItem('expires_at', date.toISOString())
    }
}

async function refreshToken() {
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/auth/refresh?code=${localStorage.getItem('refresh_token')}`, {
        method: 'GET'
    })
    const data = await res.json()
    if (data.access_token) {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        let date = new Date()
        date.setTime(date.getSeconds() + data.expires_in)
        localStorage.setItem('expires_at', date.toISOString())
    }
}

async function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('email')
}

export { login, loginCallback, refreshToken, logout }