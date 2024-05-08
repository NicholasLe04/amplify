package com.amplify.backend.post;

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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.zerodep.shaded.org.apache.hc.core5.http.io.entity.HttpEntities;

@Service
public class PostService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostRepositoryVector postRepositoryVector;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public PostService(UserRepository userRepository, PostRepository postRepository,
            PostRepositoryVector postRepositoryVector) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.postRepositoryVector = postRepositoryVector;
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

    public Post createPost(String spotifyUrl, PostType type, String description, String authorEmail,
            String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", accessToken);

        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new IllegalStateException("User " + authorEmail + " not found"));

        List<Float> avgFeatures = List.of(0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f);
        if (type == PostType.track) {
            String trackFeaturesUrl = "https://api.spotify.com/v1/audio-features/" + spotifyUrl.split("/")[4];
            trackFeaturesUrl = trackFeaturesUrl.substring(0, trackFeaturesUrl.indexOf("?"));
            HttpEntity<String> reqEntity = new HttpEntity<>(headers);
            ResponseEntity<String> resTrackFeatures = new RestTemplate().exchange(
                    trackFeaturesUrl,
                    HttpMethod.GET,
                    reqEntity,
                    String.class);
            try {
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
        }
        if (type == PostType.album) {

        }
        if (type == PostType.artist) {

        }
        if (type == PostType.playlist) {

        }
        return null;
    }
}