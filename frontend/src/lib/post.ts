type Post = {
    id: number,
    spotifyUrl: string,
    postedAt: string,
    type: string,
    author: {
        email: string,
        country: string,
        externalUrl: string,
        imgUrl: string,
        displayName: string
    },
    description: string
}

async function getRecentPosts(page: number, size: number = 10) {
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/posts?page=${page}&size=${size}`, {
        method: 'GET'
    })
    const json = await res.json()
    return json
}

async function getRecommendedPosts(email: string): Promise<[Post]> {
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/posts/recommended/${email}`, {
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

async function createPost(email: string, type: string, description: string, spotifyUrl: string) {
    const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/v1/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
            authorEmail: email,
            type: type,
            description: description,
            spotifyUrl: spotifyUrl
        })
    })
    const json = await res.json()
    return json
}

export { getRecentPosts, getRecommendedPosts, getUserPosts, createPost }