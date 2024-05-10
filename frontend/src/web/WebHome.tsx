import { getRecommendedPosts } from "../lib/post"
import Post from "../components/Post"
import { useQuery } from '@tanstack/react-query'
import WebLoading from './WebLoading'

export default function WebHome() {

    const posts = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            return getRecommendedPosts(localStorage.getItem('user_id') || '')
        },
    })

    return (
        <>
            <div className='flex flex-col items-center p-6 overflow-y-scroll h-full w-full'>
                <div className='flex flex-col gap-4 min-w-[500px] w-1/2'>
                    {posts.isLoading ?
                        <>
                            <WebLoading />
                        </> : null}
                    {posts.isError ? <div>Error fetching :(</div> : null}
                    {posts.isSuccess ?
                        posts.data.length ?
                            <>
                                {posts.data.map((post: any) => (
                                    <Post key={post.id} post={post} />
                                ))}
                            </>
                            :
                            <>
                                <div className='mx-auto'>No posts yet :(</div>
                            </>
                        : null
                    }
                </div>
            </div>
        </>
    )
}