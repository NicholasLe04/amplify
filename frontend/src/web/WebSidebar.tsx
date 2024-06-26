import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { GrAdd, GrHomeRounded, GrSearch, GrUser } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import { getNowPlaying } from '../lib/user';
import WebCreatePostForm from './WebCreatePostForm';
import { GrShare } from "react-icons/gr";
import { FormProvider, useForm } from 'react-hook-form';

export default function WebSidebar() {

    const [showCreatePostForm, setShowCreatePostForm] = useState(false);
    const methods = useForm()

    const nowPlaying = useQuery({
        queryKey: ['nowPlaying'],
        queryFn: getNowPlaying,
        refetchInterval: 1000
    })

    return (
        <>
            <FormProvider {...methods}>
                {showCreatePostForm ? <WebCreatePostForm setShowCreatePostForm={setShowCreatePostForm} /> : null}
            </FormProvider>
            <div className='w-60 h-full px-5 py-10 flex flex-col justify-between border-r-2 border-space-lighter select-none'>
                <div className='flex flex-col gap-3'>
                    <Link className='flex p-5 gap-5 bg-space-light rounded-xl hover:bg-space-lighter transition ease-in-out shadow-xl duration-200' to='/'>
                        <GrHomeRounded className='my-auto' />
                        <div className='flex-1 text-lg'>Home</div>
                    </Link>
                    <button className='flex p-5 gap-5 bg-space-light rounded-xl hover:bg-space-lighter transition ease-in-out shadow-xl duration-200' onClick={() => { console.log('unimplemented') }}>
                        <GrSearch className='my-auto' />
                        <div className='flex-1 text-lg text-left'>Search</div>
                    </button>
                    <button className='flex p-5 gap-5 bg-space-light rounded-xl hover:bg-space-lighter transition ease-in-out shadow-xl duration-200' onClick={() => { setShowCreatePostForm(true) }}>
                        <GrAdd className='my-auto' />
                        <div className='flex-1 text-lg text-left'>Create Post</div>
                    </button>
                </div>
                <div className='flex flex-col gap-3'>
                    {nowPlaying.isSuccess && nowPlaying.data !== null ?
                        <div className='flex flex-col gap-3'>
                            <div className='flex flex-row-reverse'>
                                <button className='p-2 bg-space-light rounded-md hover:bg-space-lighter transition ease-in-out shadow-lg duration-200' onClick={() => {
                                    setShowCreatePostForm(true)
                                    methods.setValue('link', `https://open.spotify.com/track/${nowPlaying.data.item.id}?`)
                                }}>
                                    <GrShare style={{ width: 16, height: 16 }} />
                                </button>
                            </div>
                            <img className='shadow-xl' src={nowPlaying.data.item?.album.images[0].url} />
                            <div className='bg-space-light overflow-hidden'>
                                <div style={{ width: `${(nowPlaying.data.progress_ms / nowPlaying.data.item?.duration_ms * 100).toFixed(1)}%` }} className={'bg-space-lightest h-1'}></div>
                            </div>
                            <div>
                                <div className='truncate'>{nowPlaying.data.item?.name}</div>
                                <div className='truncate text-space-lightest'>{nowPlaying.data.item?.artists.map((artist: any) => { return artist.name }).join(', ')}</div>
                            </div>
                        </div>
                        :
                        <div className='flex flex-col gap-3'>
                            <div className='bg-space-light rounded-xl h-12 flex justify-center '>
                                <div className='my-auto text-space-lightest'>
                                    Put something on!
                                </div>
                            </div>
                        </div>
                    }
                    <Link className='flex p-5 gap-5 bg-space-light rounded-xl hover:bg-space-lighter-hover transition ease-in-out shadow-xl duration-200' to={`/profile/${localStorage.getItem('user_id')}`}>
                        <GrUser className='my-auto' />
                        <div className='flex-1 text-lg'>Profile</div>
                    </Link>
                </div>
            </div >
        </>
    )
}