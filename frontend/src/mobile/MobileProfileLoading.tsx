import MobilePostsLoading from "./MobilePostsLoading";

export default function MobileProfileLoading() {
    return (
        <>
            <div className="flex flex-wrap gap-8 items-end">
                <div className="w-48 h-48 rounded-full bg-space-light" />
                <div>
                    <p className="text-space-lightest">Profile</p>
                    <div className='flex gap-3 my-4 items-center'>
                        <div className="w-64 h-[60px] bg-space-light rounded-lg" />
                    </div>
                    <div className="w-16 h-6 bg-space-light rounded-lg" />
                </div>
            </div>
            <hr className='border-space-lightest' />
            <div className="">
                <h1 className="text-2xl font-bold mb-4">Similar Users</h1>
                <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col gap-2 w-[244px] p-6 rounded-xl shadow-xl transition ease-in-out bg-space-light hover:bg-space-lighter duration-200">
                        <div className="w-full aspect-square rounded-full shadow-lg bg-space-lighter"></div>
                        <p className="rounded-md h-7 bg-space-lighter w-32"></p>
                        <p className="rounded-md text-space-lightest">Profile</p>
                    </div>
                    <div className="flex flex-col gap-2 w-[244px] p-6 rounded-xl shadow-xl transition ease-in-out bg-space-light hover:bg-space-lighter duration-200">
                        <div className="w-full aspect-square rounded-full shadow-lg bg-space-lighter"></div>
                        <p className="rounded-md h-7 bg-space-lighter w-32"></p>
                        <p className="rounded-md text-space-lightest">Profile</p>
                    </div>
                    <div className="flex flex-col gap-2 w-[244px] p-6 rounded-xl shadow-xl transition ease-in-out bg-space-light hover:bg-space-lighter duration-200">
                        <div className="w-full aspect-square rounded-full shadow-lg bg-space-lighter"></div>
                        <p className="rounded-md h-7 bg-space-lighter w-32"></p>
                        <p className="rounded-md text-space-lightest">Profile</p>
                    </div>
                </div>
            </div>
            <hr className='border-space-lightest' />
            <div className="">
                <h1 className="text-2xl font-bold mb-4">User Posts</h1>
                <div className='flex'>
                    <div className="flex flex-col gap-4 w-full">
                        <MobilePostsLoading />
                    </div>
                </div>
            </div>
        </>
    )
}
