package com.amplify.backend.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserRepositoryVector userRepositoryVector;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public UserService(UserRepository userRepository, UserRepositoryVector userRepositoryVector) {
        this.userRepository = userRepository;
        this.userRepositoryVector = userRepositoryVector;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User saveUser(User user, String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        try {
            // get user tracks
            String tracksUrl = UriComponentsBuilder.fromHttpUrl("https://api.spotify.com/v1/me/top/tracks")
                    .queryParam("limit", 50)
                    .queryParam("time_range", "short_term")
                    .build()
                    .toString();
            HttpEntity<String> reqEntity = new HttpEntity<>(headers);
            ResponseEntity<String> resTracks = new RestTemplate().exchange(
                    tracksUrl,
                    HttpMethod.GET,
                    reqEntity,
                    String.class);
            JsonNode resTracksJson = objectMapper.readTree(resTracks.getBody());

            // get track ids
            int count = 0;
            String trackList = "";
            for (JsonNode item : resTracksJson.get("items")) {
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
            List<Float> avgFeatures = List.of(0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f);
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

            userRepositoryVector.save(user.getEmail(), avgFeatures);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User with email " + email + " not found"));
    }

    public List<User> getRecommendedUsers(String email) {
        List<Float> userVector = userRepositoryVector.findByEmail(email);
        List<String> emails = userRepositoryVector.findByVector(userVector);
        List<User> users = new ArrayList<>();
        for (String resEmail : emails) {
            users.add(userRepository.findByEmail(resEmail).get());
        }
        return users;
    }
}
