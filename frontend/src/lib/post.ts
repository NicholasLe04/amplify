async function getRecentPosts(page: number, size:number = 10) {
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/posts?page=${page}&size=${size}`, {
        method: 'GET'
    })
    const json = await res.json()
    return json
}

async function getUserPosts(email: string) {
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/posts/${email}`, {
        method: 'GET'
    })
    const json = await res.json()
    return json
}

async function createPost(email: string, description: string, spotifyUrl: string) {
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            authorEmail: email,
            description: description,
            spotifyUrl: spotifyUrl
        })
    })
    const json = await res.json()
    return json
}

export { getRecentPosts, getUserPosts, createPost }