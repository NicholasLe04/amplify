import { redirect } from 'react-router-dom'
import { GrHomeRounded, GrSearch, GrUser } from "react-icons/gr";

export default function WebSidebar() {
    return (
        <>
            <div className='w-60 h-full px-5 py-10 flex flex-col justify-between border-r-4 border-space-light'>
                <div className='flex flex-col gap-3'>
                    <div className='flex p-5 gap-5 bg-space-light rounded-xl' onClick={() => { redirect('/home') }}>
                        <GrHomeRounded className='my-auto' />
                        <div className='flex-1 text-lg'>Home</div>
                    </div>
                    <div className='flex p-5 gap-5 bg-space-light rounded-xl' onClick={() => { redirect('/home') }}>
                        <GrSearch className='my-auto' />
                        <div className='flex-1 text-lg'>Search</div>
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    <div>
                        now playing
                    </div>
                    <div className='flex p-5 gap-5 bg-space-light rounded-xl' onClick={() => { redirect('/home') }}>
                        <GrUser className='my-auto' />
                        <div className='flex-1 text-lg'>Profile</div>
                    </div>
                </div>
            </div>
        </>
    )
}