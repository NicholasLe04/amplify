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
    // no content
    if (res.status === 204) {
        return null;
    }
    const data = await res.json()
    return data
}

// get user details
async function getUserDetails(id = localStorage.getItem('user_id')) {
    if (!id) {
        return {
            id: '',
            email: '',
            country: '',
            imgUrl: '',
            displayName: ''
        }
    }
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/users/${id}`, {
        method: 'GET'
    })
    const json = await res.json()
    return json
}

//get recommended users
async function getRecommendedUsers(id = localStorage.getItem('user_id')) {
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/users/recommended/${id}`, {
        method: 'GET'
    })
    const json = await res.json()
    return json
}

export { getNowPlaying, getUserDetails, getRecommendedUsers }