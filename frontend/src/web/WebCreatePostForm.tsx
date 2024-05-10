import { useEffect, useState } from 'react';
import { createPost } from '../lib/post'
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Props = {
    setShowCreatePostForm: React.Dispatch<React.SetStateAction<boolean>>
}

export default function WebCreatePostPopup({ setShowCreatePostForm }: Props) {

    const queryClient = useQueryClient()

    const [spotifyLink, setSpotifyLink] = useState('');
    const [caption, setCaption] = useState('');

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
            }, 1000)
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
                setShowCreatePostForm(false);
            }
        })
        return () => { removeEventListener('keydown', () => { }) }
    }, [])

    return (
        <div className='fixed w-screen h-screen bottom-0 right-0 z-10 flex justify-center items-center'>
            <div className='w-full h-full absolute bg-black opacity-50' onClick={() => { setShowCreatePostForm(false) }}></div>
            <div className='max-w-[700px] max-h-[500px] w-1/2 h-1/2 z-20 px-10 py-10 bg-space rounded-2xl shadow-xl flex flex-col relative overflow-hidden'>
                <div className='flex flex-col gap-4'>
                    <div className='text-2xl font-semibold'>Create a post</div>
                    <div className='flex flex-col gap-1'>
                        Spotify Link
                        <input className='w-full p-2 rounded-md bg-space-light' type='text' onChange={(e) => { setSpotifyLink(e.target.value) }} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        Caption
                        <textarea className='w-full p-2 rounded-md bg-space-light min-h-52 max-h-52' onChange={(e) => { setCaption(e.target.value) }} />
                    </div>
                </div>
                <div className='absolute bottom-8 right-10 flex gap-2'>
                    <div className='bg-red-500 p-2 w-[85px] text-center rounded-md hover:bg-red-400 transition ease-in-out duration-200' onClick={() => { setShowCreatePostForm(false) }}>Cancel</div>
                    <div
                        className='bg-green-500 p-2 w-[85px] text-center rounded-md hover:bg-green-400 transition ease-in-out duration-200'
                        onClick={() => { setShowCreatePostForm(false); onFormSubmit(localStorage.getItem('email') || '', caption, spotifyLink) }}
                    >
                        Confirm
                    </div>
                </div>
            </div>
        </div>
    )
}

