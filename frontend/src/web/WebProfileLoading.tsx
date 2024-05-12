import WebPostsLoading from "./WebPostsLoading";

export default function WebProfileLoading() {
  return (
    <>
        {/* Header */}
        <div className="flex flex-wrap gap-8 px-32 items-end">
            <div className="w-48 h-48 rounded-full bg-space-light" />
            <div>
                <p className="text-gray-400">Profile</p>
                <div className='flex gap-3 my-4 items-center'>
                    <div className="w-64 h-12 bg-space-light rounded-lg" />
                </div>
                <div className="w-16 h-6 bg-space-light rounded-lg" />
            </div>
        </div>
        {/* Divider */}
        <hr className='border-space-lightest mx-32' />
        {/* Similar Users */}
        <div className="px-32">
            <h1 className="text-2xl font-bold mb-4">Similar Users</h1>
            <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-2 w-[244px] p-4 rounded-lg bg-space-light">
                    <div className="w-full aspect-square rounded-full bg-space-lighter" />
                    <div className="w-32 h-6 bg-space-lighter rounded-lg" />
                    <p className="text text-gray-400">Profile</p>
                </div>
                <div className="flex flex-col gap-2 w-[244px] p-4 rounded-lg bg-space-light">
                    <div className="w-full aspect-square rounded-full bg-space-lighter" />
                    <div className="w-32 h-6 bg-space-lighter rounded-lg" />
                    <p className="text text-gray-400">Profile</p>
                </div>
                <div className="flex flex-col gap-2 w-[244px] p-4 rounded-lg bg-space-light">
                    <div className="w-full aspect-square rounded-full bg-space-lighter" />
                    <div className="w-32 h-6 bg-space-lighter rounded-lg" />
                    <p className="text text-gray-400">Profile</p>
                </div>
            </div>
        </div>
        {/* User Posts */}
        <div className="px-32">
            <h1 className="text-2xl font-bold mb-4">User Posts</h1>
            <div className='flex'>
                <div className="flex flex-col gap-4 w-full">
                    <WebPostsLoading />
                </div>
            </div>
        </div>
    </>
  )
}
