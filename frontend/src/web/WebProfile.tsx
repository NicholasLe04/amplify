import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getRecommendedUsers, getUserDetails } from "../lib/user";
import { getUserPosts } from "../lib/post";
import Post from "../components/Post";
import { GrShare, GrSpotify } from "react-icons/gr";
import UserCard from "../components/UserCard";
import WebProfileLoading from "./WebProfileLoading";

type User = {
    id: string,
    displayName: string,
    imgUrl: string,
    country: string
}

export default function WebProfile() {

    const { user_id } = useParams();
    const [userData, setUserData] = useState<User>()
    const [recommendedUsers, setRecommendedUsers] = useState<Array<User>>()
    const [userPosts, setUserPosts] = useState<Array<object>>()

    useEffect(() => {
        async function fetchData(id?: string) {
            setUserData(await getUserDetails(id))
            setRecommendedUsers(await getRecommendedUsers(id))
            setUserPosts(await getUserPosts(id))
        }

        fetchData(user_id)
    }, [user_id])

    return (
        <>
            <div className='flex flex-col items-center w-full h-full py-16 overflow-y-scroll'>
                <div className='flex flex-col gap-8 w-1/2 min-w-[500px]'>
                    {!userData || !recommendedUsers || !userPosts ?
                        <WebProfileLoading />
                        :
                        <>
                            {/* Header */}
                            <div className='flex flex-col gap-6'>
                                <div className='flex justify-between'>
                                    <div className="flex flex-wrap gap-8 items-end">
                                        <img className="w-48 h-48 rounded-full shadow-md" src={userData.imgUrl}></img>
                                        <div className='flex gap-4 flex-col'>
                                            <p className="text-gray-400">Profile</p>
                                            <div className='flex gap-3 items-center'>
                                                <h1 className="text-6xl font-bold">{userData.displayName}</h1>
                                            </div>
                                            <p className="text-gray-400">{userData.country}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col-reverse'>
                                        <div className='flex gap-2 h-8'>
                                            <a href={`https://open.spotify.com/user/${userData.id}`} target="_blank" className='inline-block p-2 bg-space-light rounded-md hover:bg-space-lighter transition ease-in-out shadow-md'>
                                                <GrSpotify style={{ width: 16, height: 16 }} />
                                            </a>
                                            <button className='p-2 bg-space-light rounded-md hover:bg-space-lighter transition ease-in-out shadow-md' onClick={() => { navigator.clipboard.writeText(window.location.href) }}>
                                                <GrShare style={{ width: 16, height: 16 }} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Divider */}
                            <div className='flex flex-col gap-3'>
                                <hr className='border-space-lightest' />
                            </div>
                            {/* Similar Users */}
                            <div className='w-full'>
                                <h1 className="text-2xl font-bold mb-4">Similar Users</h1>
                                <div className="flex flex-wrap gap-4 overflow-x-auto">
                                    {
                                        recommendedUsers.length ?
                                            <>
                                                {recommendedUsers.map((user: any) => user.id === user_id ?
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
                            {/* User Posts */}
                            <hr className='border-space-lightest' />
                            <div className="">
                                <h1 className="text-2xl font-bold mb-4">User Posts</h1>
                                <div className='flex flex-col items-center'>
                                    <div className="flex flex-col gap-4 w-full">
                                        {
                                            userPosts.length ?
                                                <>
                                                    {userPosts.map((post: any) => (
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
                    }
                </div>
            </div>
        </>
    )
}