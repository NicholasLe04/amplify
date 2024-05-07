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
            <div className='flex flex-col items-center p-6 overflow-y-scroll h-full w-full'>
                <div className='flex flex-col gap-4 w-1/2'>
                    {recentPosts?.map((post: any) => (
                        <Post post={post} />
                    ))}
                </div>
            </div>
        </>
    )
}