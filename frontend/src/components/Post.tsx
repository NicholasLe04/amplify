type User = {
    email: string,
    country: string,
    externalUrl: string,
    imgUrl: string,
    displayName: string
}

type Post = {
    id: number,
    spotifyUrl: string,
    type: string,
    description: string,
    postedAt: string,
    author: User
}

type Props = {
    post: Post
}

export default function Post({post}: Props) {

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
        <div key={post.id} className="bg-space-light rounded-lg p-6 mb-4">
            <div className="flex items-center mb-2">
                <img className="rounded-full" width={32} src={post.author.imgUrl} />
                <p className="text-white ml-2">{post.author.displayName} is sharing {post.type === 'artist' || post.type === 'album' || post.type === 'episode' ? 'an' : 'a'} {post.type}</p>
                <p className="text-sm text-gray-400 ml-2">{monthName} {day} at {time}</p>
            </div>
            <p className="text-sm text-white font-thin tracking-wider mb-4">{post.description}</p>
            <iframe
                width="100%" 
                height="152" 
                title="Spotify Embed" 
                src={convertToEmbedUrl(post.spotifyUrl)} 
            />
        </div>
    )
}