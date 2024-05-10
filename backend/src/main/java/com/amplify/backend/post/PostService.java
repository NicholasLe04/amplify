package com.amplify.backend.post;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.amplify.backend.user.User;
import com.amplify.backend.user.UserRepository;
import com.amplify.backend.user.UserRepositoryVector;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class PostService {

    private final UserRepository userRepository;
    private final UserRepositoryVector userRepositoryVector;
    private final PostRepository postRepository;
    private final PostRepositoryVector postRepositoryVector;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public PostService(UserRepository userRepository, UserRepositoryVector userRepositoryVector,
            PostRepository postRepository,
            PostRepositoryVector postRepositoryVector) {
        this.userRepository = userRepository;
        this.userRepositoryVector = userRepositoryVector;
        this.postRepository = postRepository;
        this.postRepositoryVector = postRepositoryVector;
    }

    public List<Post> getPostsByAuthorId(String authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new IllegalStateException("User " + authorId + " not found"));

        return postRepository.findByAuthor(author)
                .orElseThrow(() -> new IllegalStateException("Posts by user " + author.getId() + " not found"));
    }

    public List<Post> getPostsByAuthorEmail(String authorEmail) {
        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new IllegalStateException("User " + authorEmail + " not found"));

        return postRepository.findByAuthor(author)
                .orElseThrow(() -> new IllegalStateException("Posts by user " + author.getEmail() + " not found"));
    }

    public List<Post> getRecentPosts(int page, int size) {
        return postRepository.findAllByOrderByPostedAtDesc(PageRequest.of(page, size)).getContent();
    }

    public Post createPost(String spotifyUrl, PostType type, String description, String authorId, String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", accessToken);
        HttpEntity<String> reqEntity = new HttpEntity<>(headers);

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new IllegalStateException("User " + authorId + " not found"));
        List<Float> avgFeatures = List.of(0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f);

        if (type == PostType.track) {
            try {
                String trackFeaturesUrl = "https://api.spotify.com/v1/audio-features/"
                        + spotifyUrl.substring(0, spotifyUrl.indexOf("?")).split("/")[4];
                ResponseEntity<String> resTrackFeatures = new RestTemplate().exchange(
                        trackFeaturesUrl,
                        HttpMethod.GET,
                        reqEntity,
                        String.class);
                JsonNode resTrackFeaturesJson = objectMapper.readTree(resTrackFeatures.getBody());
                avgFeatures = List.of(
                        avgFeatures.get(0) + resTrackFeaturesJson.get("acousticness").floatValue(),
                        avgFeatures.get(1) + resTrackFeaturesJson.get("danceability").floatValue(),
                        avgFeatures.get(2) + resTrackFeaturesJson.get("energy").floatValue(),
                        avgFeatures.get(3) + resTrackFeaturesJson.get("instrumentalness").floatValue(),
                        avgFeatures.get(4) + resTrackFeaturesJson.get("liveness").floatValue(),
                        avgFeatures.get(5) + resTrackFeaturesJson.get("loudness").floatValue(),
                        avgFeatures.get(6) + resTrackFeaturesJson.get("speechiness").floatValue(),
                        avgFeatures.get(7) + resTrackFeaturesJson.get("tempo").floatValue(),
                        avgFeatures.get(8) + resTrackFeaturesJson.get("valence").floatValue());
                Post post = postRepository.save(new Post(spotifyUrl, type, description, author));
                postRepositoryVector.save(post.getId(), avgFeatures);
                return post;
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (type == PostType.album) {
            try {
                // get album tracks
                String albumTracksUrl = "https://api.spotify.com/v1/albums/"
                        + spotifyUrl.substring(0, spotifyUrl.indexOf("?")).split("/")[4] + "/tracks";
                ResponseEntity<String> resAlbumTracks = new RestTemplate().exchange(
                        albumTracksUrl,
                        HttpMethod.GET,
                        reqEntity,
                        String.class);
                JsonNode resAlbumTracksJson = objectMapper.readTree(resAlbumTracks.getBody());

                // get track ids
                int count = 0;
                String trackList = "";
                for (JsonNode item : resAlbumTracksJson.get("items")) {
                    trackList += item.get("id").asText() + ",";
                    count++;
                }

                // get track features
                String trackFeaturesUrl = "https://api.spotify.com/v1/audio-features?ids="
                        + trackList.substring(0, trackList.length() - 1);
                ResponseEntity<String> resTrackFeatures = new RestTemplate().exchange(
                        trackFeaturesUrl,
                        HttpMethod.GET,
                        reqEntity,
                        String.class);
                JsonNode resTrackFeaturesJson = objectMapper.readTree(resTrackFeatures.getBody());

                // get avg track features
                avgFeatures = List.of(0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f);
                for (JsonNode song : resTrackFeaturesJson.get("audio_features")) {
                    avgFeatures = List.of(
                            avgFeatures.get(0) + song.get("acousticness").floatValue(),
                            avgFeatures.get(1) + song.get("danceability").floatValue(),
                            avgFeatures.get(2) + song.get("energy").floatValue(),
                            avgFeatures.get(3) + song.get("instrumentalness").floatValue(),
                            avgFeatures.get(4) + song.get("liveness").floatValue(),
                            avgFeatures.get(5) + song.get("loudness").floatValue(),
                            avgFeatures.get(6) + song.get("speechiness").floatValue(),
                            avgFeatures.get(7) + song.get("tempo").floatValue(),
                            avgFeatures.get(8) + song.get("valence").floatValue());
                }

                avgFeatures = List.of(
                        avgFeatures.get(0) / count,
                        avgFeatures.get(1) / count,
                        avgFeatures.get(2) / count,
                        avgFeatures.get(3) / count,
                        avgFeatures.get(4) / count,
                        avgFeatures.get(5) / count,
                        avgFeatures.get(6) / count,
                        avgFeatures.get(7) / count,
                        avgFeatures.get(8) / count);

                Post post = postRepository.save(new Post(spotifyUrl, type, description, author));
                postRepositoryVector.save(post.getId(), avgFeatures);
                return post;
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (type == PostType.artist) {
            try {
                // get artist tracks
                String albumTracksUrl = "https://api.spotify.com/v1/artists/"
                        + spotifyUrl.substring(0, spotifyUrl.indexOf("?")).split("/")[4] + "/top-tracks";
                ResponseEntity<String> resArtistTracks = new RestTemplate().exchange(
                        albumTracksUrl,
                        HttpMethod.GET,
                        reqEntity,
                        String.class);
                JsonNode resArtistTracksJson = objectMapper.readTree(resArtistTracks.getBody());

                // get track ids
                int count = 0;
                String trackList = "";
                for (JsonNode item : resArtistTracksJson.get("tracks")) {
                    trackList += item.get("id").asText() + ",";
                    count++;
                }

                // get track features
                String trackFeaturesUrl = "https://api.spotify.com/v1/audio-features?ids="
                        + trackList.substring(0, trackList.length() - 1);
                ResponseEntity<String> resTrackFeatures = new RestTemplate().exchange(
                        trackFeaturesUrl,
                        HttpMethod.GET,
                        reqEntity,
                        String.class);
                JsonNode resTrackFeaturesJson = objectMapper.readTree(resTrackFeatures.getBody());

                // get summed track features
                avgFeatures = List.of(0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f);
                for (JsonNode song : resTrackFeaturesJson.get("audio_features")) {
                    avgFeatures = List.of(
                            avgFeatures.get(0) + song.get("acousticness").floatValue(),
                            avgFeatures.get(1) + song.get("danceability").floatValue(),
                            avgFeatures.get(2) + song.get("energy").floatValue(),
                            avgFeatures.get(3) + song.get("instrumentalness").floatValue(),
                            avgFeatures.get(4) + song.get("liveness").floatValue(),
                            avgFeatures.get(5) + song.get("loudness").floatValue(),
                            avgFeatures.get(6) + song.get("speechiness").floatValue(),
                            avgFeatures.get(7) + song.get("tempo").floatValue(),
                            avgFeatures.get(8) + song.get("valence").floatValue());
                }

                // get avg of tracks
                avgFeatures = List.of(
                        avgFeatures.get(0) / count,
                        avgFeatures.get(1) / count,
                        avgFeatures.get(2) / count,
                        avgFeatures.get(3) / count,
                        avgFeatures.get(4) / count,
                        avgFeatures.get(5) / count,
                        avgFeatures.get(6) / count,
                        avgFeatures.get(7) / count,
                        avgFeatures.get(8) / count);

                Post post = postRepository.save(new Post(spotifyUrl, type, description, author));
                postRepositoryVector.save(post.getId(), avgFeatures);
                return post;
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (type == PostType.playlist) {
            try {
                // get playlist tracks
                String albumTracksUrl = "https://api.spotify.com/v1/playlists/"
                        + spotifyUrl.substring(0, spotifyUrl.indexOf("?")).split("/")[4] + "/tracks";
                ResponseEntity<String> resArtistTracks = new RestTemplate().exchange(
                        albumTracksUrl,
                        HttpMethod.GET,
                        reqEntity,
                        String.class);
                JsonNode resArtistTracksJson = objectMapper.readTree(resArtistTracks.getBody());

                // get track ids
                int count = 0;
                String trackList = "";
                for (JsonNode item : resArtistTracksJson.get("items")) {
                    trackList += item.get("track").get("id").asText() + ",";
                    count++;
                }

                // get track features
                String trackFeaturesUrl = "https://api.spotify.com/v1/audio-features?ids="
                        + trackList.substring(0, trackList.length() - 1);
                ResponseEntity<String> resTrackFeatures = new RestTemplate().exchange(
                        trackFeaturesUrl,
                        HttpMethod.GET,
                        reqEntity,
                        String.class);
                JsonNode resTrackFeaturesJson = objectMapper.readTree(resTrackFeatures.getBody());

                // get summed track features
                avgFeatures = List.of(0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f);
                for (JsonNode song : resTrackFeaturesJson.get("audio_features")) {
                    avgFeatures = List.of(
                            avgFeatures.get(0) + song.get("acousticness").floatValue(),
                            avgFeatures.get(1) + song.get("danceability").floatValue(),
                            avgFeatures.get(2) + song.get("energy").floatValue(),
                            avgFeatures.get(3) + song.get("instrumentalness").floatValue(),
                            avgFeatures.get(4) + song.get("liveness").floatValue(),
                            avgFeatures.get(5) + song.get("loudness").floatValue(),
                            avgFeatures.get(6) + song.get("speechiness").floatValue(),
                            avgFeatures.get(7) + song.get("tempo").floatValue(),
                            avgFeatures.get(8) + song.get("valence").floatValue());
                }

                // get avg of tracks
                avgFeatures = List.of(
                        avgFeatures.get(0) / count,
                        avgFeatures.get(1) / count,
                        avgFeatures.get(2) / count,
                        avgFeatures.get(3) / count,
                        avgFeatures.get(4) / count,
                        avgFeatures.get(5) / count,
                        avgFeatures.get(6) / count,
                        avgFeatures.get(7) / count,
                        avgFeatures.get(8) / count);

                Post post = postRepository.save(new Post(spotifyUrl, type, description, author));
                postRepositoryVector.save(post.getId(), avgFeatures);
                return post;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    public List<Post> getRecommendedPosts(String id) {
        String email = userRepository.findById(id)
            .orElseThrow(() -> new IllegalStateException("User with id " + id + " not found"))
            .getEmail();
        List<Float> userVector = userRepositoryVector.findByEmail(email);
        List<Long> postIds = postRepositoryVector.findByVector(userVector);
        List<Post> posts = new ArrayList<>();
        for (Long postId : postIds) {
            if (postRepository.findById(postId).isPresent()) {
                posts.add(postRepository.findById(postId).get());
            }
        }
        return posts;
    }
}