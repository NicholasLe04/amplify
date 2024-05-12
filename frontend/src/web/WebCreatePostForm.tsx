import { useEffect } from 'react';
import { createPost } from '../lib/post'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFormContext } from 'react-hook-form';

type Props = {
    setShowCreatePostForm: React.Dispatch<React.SetStateAction<boolean>>
}

type RequestData = {
    authorId: string,
    type: string,
    description: string,
    spotifyUrl: string
}

export default function WebCreatePostPopup({ setShowCreatePostForm }: Props) {

    const queryClient = useQueryClient()
    const { register, handleSubmit, setValue, formState: { errors } } = useFormContext()

    function getPostType(spotifyUrl: string): string {
        return spotifyUrl.split('/')[3];
    }

    const createPostMutation = useMutation({
        mutationKey: ['posts'],
        mutationFn: (params: RequestData) => {
            console.log(params)
            const { authorId, type, description, spotifyUrl } = params;
            return createPost(authorId, type, description, spotifyUrl);
        },
        onSuccess: () => {
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['posts'] })
            }, 250)
        }
    })

    // esc to exit
    useEffect(() => {
        addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                setShowCreatePostForm(false)
            }
        })
        return () => { removeEventListener('keydown', () => { }) }
    }, [])

    return (
        <div className='fixed w-screen h-screen bottom-0 right-0 z-10 flex justify-center items-center select-none'>
            <div className='w-full h-full absolute bg-black opacity-50' onClick={() => { setShowCreatePostForm(false) }}></div>
            <form className='max-w-[700px] max-h-[550px] w-1/2 h-1/2 z-20 px-10 py-10 bg-space rounded-2xl shadow-2xl flex flex-col relative overflow-hidden'
                onSubmit={handleSubmit((data, e: any) => {
                    e.preventDefault()
                    createPostMutation.mutate({
                        authorId: localStorage.getItem('user_id') ?? '',
                        type: getPostType(data.link),
                        description: data.caption,
                        spotifyUrl: data.link
                    })
                    setShowCreatePostForm(false)
                })}
            >
                <div className='flex flex-col gap-4'>
                    <div className='text-2xl font-semibold'>Create a post</div>
                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-between'>
                            <div>
                                Spotify Link
                            </div>
                            <div>
                                {errors.link && <span className='text-red-500'>{errors.link.message?.toString()}</span>}
                            </div>
                        </div>
                        <input className='w-full p-2 rounded-lg bg-space-light shadow-lg' type='text' placeholder='https://open.spotify.com/track/...'
                            onChange={(e) => { setValue('link', e.target.value) }}
                            ref={register('link', {
                                required: {
                                    value: true,
                                    message: 'Link is required.'
                                },
                                pattern: {
                                    value: /^https:\/\/open\.spotify\.com\/(track|album|artist|playlist)\/[a-zA-Z0-9]+\?/,
                                    message: 'Link has to be to a spotify track, album, artist, or playlist.'
                                }
                            }).ref}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        Caption
                        <textarea className='w-full p-2 rounded-lg bg-space-light min-h-52 max-h-52 shadow-lg' placeholder='this is my favorite song..'
                            {...register('caption')}
                        />
                    </div>
                </div>
                <div className='absolute bottom-8 right-10 flex gap-2'>
                    <button className='bg-space-light p-2 w-[85px] text-center rounded-md hover:bg-space-lighter transition ease-in-out duration-200 shadow-lg'
                        type='button'
                        onClick={() => { setShowCreatePostForm(false) }}
                    >
                        Cancel
                    </button>
                    <button
                        className='bg-green-600 p-2 w-[85px] text-center rounded-md hover:bg-green-500 transition ease-in-out duration-200 shadow-lg'
                        type='submit'
                    >
                        Confirm
                    </button>
                </div>
            </form >
        </div >
    )
}