import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { GrAdd, GrHomeRounded, GrSearch, GrUser } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import { getNowPlaying } from '../lib/user';
import WebCreatePostPopup from './WebCreatePostForm';

export default function WebSidebar() {

    const [showCreatePostForm, setShowCreatePostForm] = useState(false);

    const nowPlaying = useQuery({
        queryKey: ['nowPlaying'],
        queryFn: getNowPlaying,
        refetchInterval: 1000
    })

    return (
        <>
            {showCreatePostForm ? <WebCreatePostPopup setShowCreatePostForm={setShowCreatePostForm} /> : null}
            <div className='w-60 h-full px-5 py-10 flex flex-col justify-between border-r-4 border-space-light'>
                <div className='flex flex-col gap-3'>
                    <Link className='flex p-5 gap-5 bg-space-light rounded-xl hover:bg-space-lighter-hover transition ease-in-out' to='/'>
                        <GrHomeRounded className='my-auto' />
                        <div className='flex-1 text-lg'>Home</div>
                    </Link>
                    <div className='flex p-5 gap-5 bg-space-light rounded-xl hover:bg-space-lighter-hover transition ease-in-out' onClick={() => { console.log('unimplemented') }}>
                        <GrSearch className='my-auto' />
                        <div className='flex-1 text-lg'>Search</div>
                    </div>
                    <div className='flex p-5 gap-5 bg-space-light rounded-xl hover:bg-space-lighter-hover transition ease-in-out' onClick={() => { setShowCreatePostForm(true) }}>
                        <GrAdd className='my-auto' />
                        <div className='flex-1 text-lg'>Create Post</div>
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    {nowPlaying.isSuccess ?
                        <div className='flex flex-col gap-3'>
                            <img className='' src={nowPlaying.data.item?.album.images[0].url} />
                            <div>
                                <div className='truncate'>{nowPlaying.data.item?.name}</div>
                                <div className='truncate text-space-lightest'>{nowPlaying.data.item?.artists.map((artist: any) => { return artist.name }).join(', ')}</div>
                            </div>
                        </div>
                        :
                        <div className='flex flex-col gap-3'>
                            <div className='bg-space-light rounded-xl h-48'></div>
                            <div className='bg-space-light rounded-xl h-12'></div>
                        </div>
                    }
                    <Link className='flex p-5 gap-5 bg-space-light rounded-xl hover:bg-space-lighter-hover transition ease-in-out' to='/profile'>
                        <GrUser className='my-auto' />
                        <div className='flex-1 text-lg'>Profile</div>
                    </Link>
                </div>
            </div >
        </>
    )
}