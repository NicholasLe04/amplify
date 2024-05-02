async function login() {
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/auth/authorize`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    const text = await res.text()
    window.location.href = text
}

// we use useNavigate here to avoid reloading the page
async function loginCallback(code: string) {
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/auth/callback?code=${code}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    const data = await res.json()
    // store token in browser localStorage
    console.log(data)
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('uuid', data.uuid)
}

// we use useNavigate here to avoid reloading the page
async function logout() {
    localStorage.removeItem('token')
}

// checks if token is valid by calling spotify api
async function isSessionValid() {
    let res = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    const jsonResponse = await res.json()
    if (jsonResponse.status === 'valid') {
        return true
    } else {
        return false
    }
}

export { login, loginCallback, logout, isSessionValid }