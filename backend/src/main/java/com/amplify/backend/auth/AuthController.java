package com.amplify.backend.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
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

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin
public class AuthController {

    @Value("${CLIENT_ID}")
<<<<<<< HEAD
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
            .queryParam("scope", "user-read-private user-read-email")
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

        // Create sessionID
        String sessionId = request.getSession(true).getId();

        // Save user data to database
        User user = new User(email, displayName, externalUrl, imgUrl, country, accessToken, refreshToken, sessionId);
        // Create user, if user already exists, update their data
        if (userService.createUser(user) == null) {
            userService.updateUser(user);
        }

        // Create and add sessionID to cookie
        Cookie cookie = new Cookie("JSESSIONID", sessionId);
        cookie.setMaxAge(31536000);
        cookie.setPath("/");
        response.addCookie(cookie);
        response.setHeader("Access-Control-Allow-Origin", frontendUrl);
        response.setHeader("Access-Control-Allow-Credentials", "true");

        // Return the user's access and refresh token
		return "{\"session_id\": \"" + sessionId + "\"}";
	}

    @GetMapping("/session/validate")
    public String validateSession(@CookieValue(value="JSESSIONID", required=false) String sessionId, HttpServletRequest request, HttpServletResponse response) {
        System.out.println(sessionId);
        response.setHeader("Access-Control-Allow-Origin", frontendUrl);
        response.setHeader("Access-Control-Allow-Credentials", "true");
        if (sessionId == null) {
            return "{\"status\":\"invalid\"}";
        }
        try {
            userService.getUserBySessionId(sessionId);
            return "{\"status\":\"valid\"}";
        }
        catch (Exception e) {
            return "{\"status\":\"invalid\"}";
        }

    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        // If you need to explicitly remove the session cookie
        Cookie cookie = new Cookie("JSESSIONID", "");
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        response.setHeader("Access-Control-Allow-Origin", frontendUrl);
        response.setHeader("Access-Control-Allow-Credentials", "true");

        return "logged out";
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
=======
    private String clientId;
    @Value("${CLIENT_SECRET}")
    private String clientSecret;

    @GetMapping("/login")
    public RedirectView login() {
        String authUrl = UriComponentsBuilder.fromHttpUrl("https://accounts.spotify.com/authorize")
                .queryParam("response_type", "code")
                .queryParam("client_id", clientId)
                .queryParam("scope", "user-read-private user-read-email")
                .queryParam("redirect_uri", "/api/v1/auth/callback")
                .build()
                .toString();

        return new RedirectView(authUrl);
    }

    @GetMapping("/callback")
    public String getUserCode(@RequestParam String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("content-type", "application/x-www-form-urlencoded");

        String authUrl = UriComponentsBuilder.fromHttpUrl("https://accounts.spotify.com/api/token")
                .queryParam("code", code)
                .queryParam("redirect_uri", "/api/v1/auth/callback")
                .queryParam("grant_type", "authorization_code")
                .queryParam("client_id", clientId)
                .queryParam("client_secret", clientSecret)
                .build()
                .toString();

        ResponseEntity<String> response = new RestTemplate().postForEntity(authUrl, null, String.class, headers);

        return response.getBody();
    }
>>>>>>> main

        return objectMapper.readTree(response.getBody());
    }


    private JsonNode getUserProfile(String accessToken) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

<<<<<<< HEAD
        String profileUrl = UriComponentsBuilder.fromHttpUrl("https://api.spotify.com/v1/me")
            .build()
            .toString();
=======
        String authUrl = UriComponentsBuilder.fromHttpUrl("https://accounts.spotify.com/api/token")
                .queryParam("grant_type", "refresh_token")
                .queryParam("refresh_token", token)
                .queryParam("client_id", clientId)
                .queryParam("client_secret", clientSecret)
                .build()
                .toString();
>>>>>>> main

        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<String> response = new RestTemplate().exchange(
                profileUrl,
                HttpMethod.GET,
                requestEntity,
                String.class
        );

        return objectMapper.readTree(response.getBody());
    }
}
