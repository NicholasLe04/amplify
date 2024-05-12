import { Link } from 'react-router-dom'

type Author = {
    id: string,
    email: string,
    country: string,
    imgUrl: string,
    displayName: string
}

type Post = {
    id: number,
    spotifyUrl: string,
    type: string,
    description: string,
    postedAt: string,
    author: Author
}

type Props = {
    post: Post
}

export default function Post({ post }: Props) {

    function convertToEmbedUrl(spotifyUrl: string): string {
        const urlParts = spotifyUrl.split('/');
        urlParts.splice(3, 0, "embed");
        const embedUrl = urlParts.join('/');
        return embedUrl;
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const date = new Date(post.postedAt);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const monthName = months[monthIndex];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${hours < 12 ? 'AM' : 'PM'}`;

    return (
        <div key={post.id} className="bg-space-light rounded-xl p-6 flex flex-col gap-4 shadow-lg">
            <div className="flex justify-between">
                <div className='flex gap-3'>
                    <Link to={`/profile/${post.author.id}`}><img className="rounded-full aspect-square" width={32} src={post.author.imgUrl} /></Link>
                    <p className="text-white my-auto"><Link to={`/profile/${post.author.id}`}>{post.author.displayName}</Link> is sharing {post.type === 'artist' || post.type === 'album' || post.type === 'episode' ? 'an' : 'a'} <span className='font-semibold'>{post.type}</span></p>
                </div>
                <p className="text-sm text-space-lightest my-auto">{monthName} {day} at {time}</p>
            </div>
            <hr className='border-space-lightest' />
            {
                post.type === 'track' ?
                    < iframe
                        className='shadow-lg rounded-xl'
                        width="100%"
                        height="80px"
                        title="Spotify Embed"
                        src={convertToEmbedUrl(post.spotifyUrl)}
                    /> : null
            }
            {
                post.type === 'album' ?
                    < iframe
                        className='shadow-md rounded-xl'
                        width="100%"
                        height="420px"
                        title="Spotify Embed"
                        src={convertToEmbedUrl(post.spotifyUrl)}
                    /> : null
            }
            {
                post.type === 'playlist' ?
                    < iframe
                        className='shadow-md roundex-xl'
                        width="100%"
                        height="420px"
                        title="Spotify Embed"
                        src={convertToEmbedUrl(post.spotifyUrl)}
                    /> : null
            }
            {
                post.type === 'artist' ?
                    < iframe
                        className='shadow-md roundex-xl'
                        width="100%"
                        height="420px"
                        title="Spotify Embed"
                        src={convertToEmbedUrl(post.spotifyUrl)}
                    /> : null
            }
            {post.description === '' ? null :
                <>
                    <p className="text-sm text-white font-thin tracking-wider">{post.description}</p>
                </>
            }
        </div >
    )
}