import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getRecommendedUsers, getUserDetails } from "../lib/user";
import { getUserPosts } from "../lib/post";
import Post from "../components/Post";
import { GrShare } from "react-icons/gr";
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
        async function fetchData(id?:string) {
            setUserData(await getUserDetails(id))
            setRecommendedUsers(await getRecommendedUsers(id))
            setUserPosts(await getUserPosts(id))
        }

        fetchData(user_id)
    }, [user_id])

    return (
        <>
            <div className='flex flex-col gap-16 w-full h-full py-16 overflow-x-clip overflow-y-scroll'>
                {!userData || !recommendedUsers || !userPosts ? 
                    <WebProfileLoading />
                    :
                    <>
                        {/* Header */}
                        <div className="flex flex-wrap gap-8 px-32 items-end">
                            <img className="w-48 h-48 rounded-full" src={userData.imgUrl}></img>
                            <div>
                                <p className="text-gray-400">Profile</p>
                                <div className='flex gap-3 my-4 items-center'>
                                    <h1 className="text-6xl font-bold">{userData.displayName}</h1>
                                    <a href={`https://open.spotify.com/user/${userData.id}`} target="_blank" className='p-2 bg-space-light rounded-md hover:bg-space-lighter transition ease-in-out shadow-md'>
                                        <GrShare style={{ width: 12, height: 12 }} />
                                    </a>
                                </div>
                                <p className="text-gray-400">{userData.country}</p>
                            </div>
                        </div>
                        {/* Divider */}
                        <hr className='border-space-lightest mx-32'/>
                        {/* Similar Users */}
                        <div className="px-32">
                            <h1 className="text-2xl font-bold mb-4">Similar Users</h1>
                            <div className="flex flex-wrap gap-4">
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
                        <div className="px-32">
                            <h1 className="text-2xl font-bold mb-4">User Posts</h1>
                            <div className='flex'>
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
        </>
    )
}