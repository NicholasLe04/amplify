# Amplify

Amplify proposes the development of a social media platform to harness the universal language of music, aiming to connect users based on their musical preferences. Recognizing the absence of a major social media platform dedicated to music, the project envisions a solution where users can share playlists, artists, and albums, with the platform’s recommendation system curating personalized feeds.

## Functional Requirements + Design
### User Creation
1. User links Spotify account
2. We analyze their recent songs or something and place them in the vector database
3. This is their "taste rating"

### Create Post
1. User creates post
2. Posts can be playlists, songs, artists, albums
    1. Users can choose to take a "snapshot" of their current playlist or just post the playlist
    2. Snapshots will be stored as a list of songs or something
3. Posts get condensed into one data point (in the case of playlists or albums) and get stored in vector database (?)

### L + C on Posts
1. Just like idk

### Feed Recommendation
1. User requests feed
2. Posts are currated based on recentness and user's taste rating

### Friend Recommendations
1. 10 Nearest Neighbors are recommended or something and they can go make friends off that

### Following People
1. You can follow people that's basically it

