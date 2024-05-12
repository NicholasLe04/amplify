import { Link } from "react-router-dom"

type User = {
  id: string,
  displayName: string,
  imgUrl: string,
  country: string
}

type Props = {
    user: User,
}

export default function UserCard({ user }:Props) {
  return (
    <Link className="flex flex-col gap-2 w-[244px] p-4 rounded-lg hover:bg-space-light" to={`${import.meta.env.VITE_APP_FRONTEND_URL}/profile/${user.id}`}>
        <img className="w-full aspect-square rounded-full" src={user.imgUrl}></img>
        <p className="text-lg">{user.displayName}</p>
        <p className="text text-gray-400">Profile</p>
    </Link>
  )
}
