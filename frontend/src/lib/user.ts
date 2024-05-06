async function getNowPlaying() {
    const res = await fetch(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        }
    )
    const data = await res.json()
    return data
}

// get user details
async function getUserDetails() {
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/users/${localStorage.getItem('email')}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    })
    const json = await res.json()
    return json
}

export { getNowPlaying, getUserDetails }