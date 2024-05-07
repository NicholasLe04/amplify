import { useEffect, useState } from "react"
import { getRecentPosts } from "../lib/post"
import Post from "../components/Post"

export default function WebHome() {

    const [recentPosts, setRecentPosts] = useState([])

    useEffect(() => {
        getRecentPosts(0, 10)
            .then(data => {
                setRecentPosts(data)
            })
    }, [])

    return (
        <>
            <div className='flex flex-col items-center p-6 overflow-scroll'>
                <h1 className="text-2xl font-bold mb-4">Recent Posts</h1>
                <div className='w-full w-6/12'>
                    {recentPosts.map((post: any) => (
                        <Post post={post}/>
                    ))}
                </div>
            </div>
        </>
    )
}