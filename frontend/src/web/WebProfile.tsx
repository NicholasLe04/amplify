import { useQuery } from '@tanstack/react-query';
import { GrShare, GrSpotify } from "react-icons/gr";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import UserCard from "../components/UserCard";
import { getUserPosts } from "../lib/post";
import { getRecommendedUsers, getUserDetails } from "../lib/user";
import WebProfileLoading from "./WebProfileLoading";
import { useState } from 'react';

export default function WebProfile() {

    const { user_id } = useParams();
    const [copyOpacity, setCopyOpacity] = useState(0)

    function displayCopied() {
        setCopyOpacity(100)
        setTimeout(() => {
            setCopyOpacity(0)
        }, 2000)
    }

    const profile = useQuery({
        queryKey: ['profile', user_id],
        queryFn: async () => {
            const res = await getUserDetails(user_id)
            console.log('user details', res)
            return res
        }
    })

    const recommendedUsers = useQuery({
        queryKey: ['recommendedUsers', user_id],
        queryFn: async () => {
            const res = await getRecommendedUsers(user_id)
            console.log('recommendedUsers', res)
            return res
        }
    })

    const posts = useQuery({
        queryKey: ['posts', user_id],
        queryFn: async () => {
            const res = await getUserPosts(user_id)
            console.log('posts', res)
            return res
        }
    })

    return (
        <>
            <div className='flex flex-col items-center w-full h-full py-16 overflow-y-scroll'>
                <div className='flex flex-col gap-8 w-1/2 min-w-[500px]'>
                    {profile.isSuccess && recommendedUsers.isSuccess && posts.isSuccess ?
                        <>
                            <div className='flex flex-col gap-6'>
                                <div className='flex justify-between'>
                                    <div className="flex flex-wrap gap-8 items-end">
                                        <img className="w-48 h-48 rounded-full shadow-md" src={profile.data.imgUrl}></img>
                                        <div className='flex gap-4 flex-col'>
                                            <p className="text-space-lightest">Profile</p>
                                            <div className='flex gap-3 items-center'>
                                                <h1 className="text-6xl font-bold">{profile.data.displayName}</h1>
                                            </div>
                                            <p className="text-space-lightest">{profile.data.country}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col-reverse gap-2'>
                                        <div className='flex gap-2 h-8'>
                                            <a href={`https://open.spotify.com/user/${profile.data.id}`} target="_blank" className='inline-block p-2 bg-space-light rounded-md hover:bg-space-lighter transition ease-in-out shadow-md'>
                                                <GrSpotify style={{ width: 16, height: 16 }} />
                                            </a>
                                            <button className='p-2 bg-space-light rounded-md hover:bg-space-lighter transition ease-in-out duration-200 shadow-md' onClick={() => { navigator.clipboard.writeText(window.location.href); displayCopied() }}>
                                                <GrShare style={{ width: 16, height: 16 }} />
                                            </button>
                                        </div>
                                        <div className={`text-right opacity-${copyOpacity} transition-opacity ease-in-out duration-200`}>Copied!</div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-3'>
                                <hr className='border-space-lightest' />
                            </div>
                            <div className='w-full'>
                                <h1 className="text-2xl font-bold mb-4">Similar Users</h1>
                                <div className="flex flex-wrap gap-4 overflow-x-auto">
                                    {
                                        recommendedUsers.data.length ?
                                            <>
                                                {recommendedUsers.data.map((user: any) => user.id === user_id ?
                                                    <>
                                                    </>
                                                    :
                                                    <UserCard user={user} />
                                                )}
                                            </>
                                            :
                                            <>
                                                <div className='mx-auto'>No users yet :(</div>
                                            </>
                                    }
                                </div>
                            </div>
                            <hr className='border-space-lightest' />
                            <div className="">
                                <h1 className="text-2xl font-bold mb-4">User Posts</h1>
                                <div className='flex flex-col items-center'>
                                    <div className="flex flex-col gap-4 w-full">
                                        {
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
                                        }
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <WebProfileLoading />
                    }
                </div>
            </div >
        </>
    )
}