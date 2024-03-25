package com.amplify.backend.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
public class AuthController {
    @Value("${CLIENT_ID}")
	private String clientId;
	@Value("${CLIENT_SECRET}")
	private String clientSecret;

	@GetMapping("/api/auth/login")
	public RedirectView login() {
		String authUrl = UriComponentsBuilder.fromHttpUrl("https://accounts.spotify.com/authorize")
			.queryParam("response_type", "code")
            .queryParam("client_id", clientId)
            .queryParam("scope", "user-read-private user-read-email")
            .queryParam("redirect_uri", "http://localhost:8080/api/auth/get-access")
            .build()
            .toString();

		return new RedirectView(authUrl);
	}

	@GetMapping("/api/auth/get-access")
	public String getUserCode(@RequestParam String code) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("content-type", "application/x-www-form-urlencoded");

		String authUrl = UriComponentsBuilder.fromHttpUrl("https://accounts.spotify.com/api/token")
			.queryParam("code", code)
            .queryParam("redirect_uri", "http://localhost:8080/api/auth/get-access")
            .queryParam("grant_type", "authorization_code")
			.queryParam("client_id", clientId)
			.queryParam("client_secret", clientSecret)
            .build()
            .toString();
		
		ResponseEntity<String> response = new RestTemplate().postForEntity(authUrl, null, String.class, headers);

		return response.getBody();
	}

    @GetMapping("/api/auth/refresh")
    public String refreshToken(@RequestParam String refreshToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("content-type", "application/x-www-form-urlencoded");

        String authUrl = UriComponentsBuilder.fromHttpUrl("https://accounts.spotify.com/api/token")
            .queryParam("grant_type", "refresh_token")
            .queryParam("refresh_token", refreshToken)
			.queryParam("client_id", clientId)
			.queryParam("client_secret", clientSecret)
            .build()
            .toString();

        ResponseEntity<String> response = new RestTemplate().postForEntity(authUrl, null, String.class, headers);

        return response.getBody();
    }
}
