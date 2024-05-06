async function getNowPlaying() {
    const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    }
    )
    const data = await res.json()
    console.log(data)
    return data
}