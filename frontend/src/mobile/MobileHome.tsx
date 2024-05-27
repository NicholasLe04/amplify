import { getRecommendedPosts } from "../lib/post"
import { useQuery } from '@tanstack/react-query'
import MobilePost from "./MobilePost"
import MobilePostsLoading from './MobilePostsLoading'

export default function MobileHome() {

    const posts = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            return getRecommendedPosts(localStorage.getItem('user_id') || '')
        },
    })

    return (
        <>
            <div className='flex flex-col items-center p-6 overflow-y-scroll h-full w-full'>
                <div className='flex flex-col gap-4 w-full'>
                    {posts.isLoading ?
                        <>
                            <MobilePostsLoading />
                        </> : null}
                    {posts.isError ? <div>Error fetching :(</div> : null}
                    {posts.isSuccess ?
                        posts.data.length ?
                            <>
                                {posts.data.map((post: any) => (
                                    <MobilePost key={post.id} post={post} />
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