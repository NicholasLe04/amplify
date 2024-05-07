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

    function getPostType(spotifyUrl: string): string {
        return spotifyUrl.split('/')[3];
    }

    const postType = getPostType(post.spotifyUrl);

    return (
        <div key={post.id} className="bg-space-light rounded-lg p-6 mb-4">
            <div className="flex items-center mb-2">
                <img className="rounded-full" width={32} src={post.author.imgUrl} />
                <p className="text-white ml-2">{post.author.displayName} is sharing {postType === 'artist' ? 'an' : 'a'} {postType}</p>
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