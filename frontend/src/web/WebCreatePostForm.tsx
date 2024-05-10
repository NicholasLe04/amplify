import { useEffect } from 'react';
import { createPost } from '../lib/post'
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Props = {
    spotifyLink: string,
    setSpotifyLink: React.Dispatch<React.SetStateAction<string>>,
    caption: string,
    setCaption: React.Dispatch<React.SetStateAction<string>>,
    setShowCreatePostForm: React.Dispatch<React.SetStateAction<boolean>>
}

export default function WebCreatePostPopup({ spotifyLink, setSpotifyLink, caption, setCaption, setShowCreatePostForm }: Props) {

    const queryClient = useQueryClient()

    function getPostType(spotifyUrl: string): string {
        return spotifyUrl.split('/')[3];
    }

    const createPostMutation = useMutation({
        mutationKey: ['posts'],
        mutationFn: (params: { email: string, type: string, description: string, spotifyUrl: string }) => {
            const { email, type, description, spotifyUrl } = params;
            return createPost(email, type, description, spotifyUrl);
        },
        onSuccess: () => {
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['posts'] })
            }, 250)
        }
    })

    function onFormSubmit(email: string, description: string, spotifyUrl: string) {
        if (email === null || spotifyUrl === '') {
            alert('Please fill in all fields');
            return;
        }
        else if (!spotifyUrl.includes('https://open.spotify.com')) {
            alert('Please enter a valid Spotify link');
            return;
        }
        else {
            fetch(`https://open.spotify.com/oembed?url=${spotifyUrl}`, {
                method: 'GET',
            }).then(response => {
                if (response.ok) {
                    createPostMutation.mutate({
                        email: email,
                        type: getPostType(spotifyUrl),
                        description: description,
                        spotifyUrl: spotifyUrl
                    })
                    setShowCreatePostForm(false);
                    setSpotifyLink('')
                    setCaption('')
                }
                else {
                    alert('Please enter a valid Spotify link');
                    return;
                }
            })
        }
    }

    // esc to exit
    useEffect(() => {
        addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                setShowCreatePostForm(false)
                setSpotifyLink('')
                setCaption('')
            }
        })
        return () => { removeEventListener('keydown', () => { }) }
    }, [])

    return (
        <div className='fixed w-screen h-screen bottom-0 right-0 z-10 flex justify-center items-center select-none'>
            <div className='w-full h-full absolute bg-black opacity-50' onClick={() => { setShowCreatePostForm(false); setSpotifyLink(''); setCaption('') }}></div>
            <div className='max-w-[700px] max-h-[550px] w-1/2 h-1/2 z-20 px-10 py-10 bg-space rounded-2xl shadow-2xl flex flex-col relative overflow-hidden'>
                <div className='flex flex-col gap-4'>
                    <div className='text-2xl font-semibold'>Create a post</div>
                    <div className='flex flex-col gap-2'>
                        Spotify Link
                        <input className='w-full p-2 rounded-lg bg-space-light shadow-md' type='text' placeholder='https://open.spotify.com/track/...' value={spotifyLink} onChange={(e) => { setSpotifyLink(e.target.value) }} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        Caption
                        <textarea className='w-full p-2 rounded-lg bg-space-light min-h-52 max-h-52 shadow-md' placeholder='this is my favorite song..' value={caption} onChange={(e) => { setCaption(e.target.value) }} />
                    </div>
                </div>
                <div className='absolute bottom-8 right-10 flex gap-2'>
                    <button className='bg-space-light p-2 w-[85px] text-center rounded-md hover:bg-space-lighter transition ease-in-out duration-200 shadow-md'
                        onClick={() => { setShowCreatePostForm(false); setSpotifyLink(''); setCaption('') }}
                    >
                        Cancel
                    </button>
                    <button
                        className='bg-green-600 p-2 w-[85px] text-center rounded-md hover:bg-green-500 transition ease-in-out duration-200 shadow-md'
                        onClick={() => { setShowCreatePostForm(false); setSpotifyLink(''); setCaption(''); onFormSubmit(localStorage.getItem('email') || '', caption, spotifyLink) }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}

