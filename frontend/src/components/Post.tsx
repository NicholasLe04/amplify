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

export default function Post({ post }: Props) {

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
        <div key={post.id} className="flex flex-col gap-3 bg-space-light rounded-xl p-6 h-min">
            <div className="flex items-center">
                <img className="aspect-square rounded-full w-8" src={post.author.imgUrl} />
                <p className="text-white ml-2">{post.author.displayName} is sharing {postType === 'artist' ? 'an' : 'a'} {postType}</p>
            </div>
            {postType === 'track' ?
                < iframe
                    width="100%"
                    height="80px"
                    title="Spotify Embed"
                    src={convertToEmbedUrl(post.spotifyUrl)}
                /> : null
            }
            {postType === 'album' ?
                < iframe
                    width="100%"
                    height="420px"
                    title="Spotify Embed"
                    src={convertToEmbedUrl(post.spotifyUrl)}
                /> : null
            }
            {postType === 'playlist' ?
                < iframe
                    width="100%"
                    height="420px"
                    title="Spotify Embed"
                    src={convertToEmbedUrl(post.spotifyUrl)}
                /> : null
            }
            {postType === 'artist' ?
                < iframe
                    width="100%"
                    height="420px"
                    title="Spotify Embed"
                    src={convertToEmbedUrl(post.spotifyUrl)}
                /> : null
            }
            <p className="text-sm text-white font-thin tracking-wider">{post.description}</p>
        </div>
    )
}