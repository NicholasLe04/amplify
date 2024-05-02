package com.amplify.backend.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.amplify.backend.user.User;
import com.amplify.backend.user.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin
public class AuthController {

    @Value("${CLIENT_ID}")
    private String clientId;

    @Value("${CLIENT_SECRET}")
    private String clientSecret;

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    private final UserService userService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/authorize")
    public String authorize() {
        String authUrl = UriComponentsBuilder.fromHttpUrl("https://accounts.spotify.com/authorize")
                .queryParam("response_type", "code")
                .queryParam("client_id", clientId)
                .queryParam("scope", "user-read-private%20user-read-email%20user-read-playback-state")
                .queryParam("redirect_uri", frontendUrl + "/callback")
                .build()
                .toString();

        return authUrl;
    }

    @GetMapping("/callback")
    public String callback(@RequestParam String code, HttpServletRequest request, HttpServletResponse response) {

        // Get and parse user tokens
        String accessToken = "", refreshToken = "";
        try {
            JsonNode tokenRoot = getUserTokens(code);
            accessToken = tokenRoot.get("access_token").asText();
            refreshToken = tokenRoot.get("refresh_token").asText();
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Get and parse user profile data
        String country = "", displayName = "", email = "", externalUrl = "", imgUrl = "";
        try {
            JsonNode profileRoot = getUserProfile(accessToken);
            country = profileRoot.get("country").asText();
            displayName = profileRoot.get("display_name").asText();
            email = profileRoot.get("email").asText();
            externalUrl = profileRoot.get("external_urls").get("spotify").asText();
            imgUrl = profileRoot.get("images").get(0).get("url").asText();
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Save / update user data to database
        User user = new User(email, displayName, externalUrl, imgUrl, country);
        userService.saveUser(user);

        // Return the user's access and refresh token
        ObjectNode tokenObject = objectMapper.createObjectNode();
        tokenObject.put("access_token", accessToken);
        tokenObject.put("refresh_token", refreshToken);
        return tokenObject.toString();
    }

    private JsonNode getUserTokens(String code) throws Exception {
        HttpHeaders authUrlHeaders = new HttpHeaders();
        authUrlHeaders.add("content-type", "application/x-www-form-urlencoded");

        String authUrl = UriComponentsBuilder.fromHttpUrl("https://accounts.spotify.com/api/token")
                .queryParam("code", code)
                .queryParam("redirect_uri", frontendUrl + "/callback")
                .queryParam("grant_type", "authorization_code")
                .queryParam("client_id", clientId)
                .queryParam("client_secret", clientSecret)
                .build()
                .toString();

        ResponseEntity<String> response = new RestTemplate().postForEntity(authUrl, null, String.class, authUrlHeaders);

        return objectMapper.readTree(response.getBody());
    }

    private JsonNode getUserProfile(String accessToken) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        String profileUrl = UriComponentsBuilder.fromHttpUrl("https://api.spotify.com/v1/me")
                .build()
                .toString();

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = new RestTemplate().exchange(
                profileUrl,
                HttpMethod.GET,
                requestEntity,
                String.class);

        return objectMapper.readTree(response.getBody());
    }
}
