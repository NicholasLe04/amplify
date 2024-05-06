import { Link } from 'react-router-dom'
import { GrHomeRounded, GrSearch, GrUser } from 'react-icons/gr'
import { useQuery } from '@tanstack/react-query'

export default function WebSidebar() {

    const nowPlaying = useQuery({
        queryKey: ['nowPlaying'],
        queryFn: async () => {
            const token = localStorage.getItem('access_token')
            const res = await fetch(
                'https://api.spotify.com/v1/me/player/currently-playing',
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            const data = await res.json()
            return data
        },
        refetchInterval: 1000
    })

    return (
        <>
            <div className='w-60 h-full px-5 py-10 flex flex-col justify-between border-r-4 border-space-light'>
                <div className='flex flex-col gap-3'>
                    <Link className='flex p-5 gap-5 bg-space-light rounded-xl' to='/home'>
                        <GrHomeRounded className='my-auto' />
                        <div className='flex-1 text-lg'>Home</div>
                    </Link>
                    <div className='flex p-5 gap-5 bg-space-light rounded-xl' onClick={() => { console.log('unimplemented') }}>
                        <GrSearch className='my-auto' />
                        <div className='flex-1 text-lg'>Search</div>
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    {nowPlaying.isSuccess ?
                        < div className='flex flex-col gap-3'>
                            <img className='' src={nowPlaying.data.item?.album.images[0].url} />
                            <div>
                                <div className='truncate'>{nowPlaying.data.item?.name}</div>
                                <div className='truncate text-gray-400'>{nowPlaying.data.item?.artists.map((artist: any) => { return artist.name }).join(', ')}</div>
                            </div>
                        </div>
                        : 'loading'
                    }
                    <Link className='flex p-5 gap-5 bg-space-light rounded-xl' to='/profile'>
                        <GrUser className='my-auto' />
                        <div className='flex-1 text-lg'>Profile</div>
                    </Link>
                </div>
            </div >
        </>
    )
}