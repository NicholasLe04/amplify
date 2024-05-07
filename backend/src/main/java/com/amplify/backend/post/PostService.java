package com.amplify.backend.post;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.amplify.backend.user.User;
import com.amplify.backend.user.UserRepository;

@Service
public class PostService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Autowired
    public PostService(UserRepository userRepository, PostRepository postRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
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

    public Post createPost(String spotifyUrl, String description, String authorEmail) {
        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new IllegalStateException("User " + authorEmail + " not found"));

        Post post = new Post(spotifyUrl, description, author);
        return postRepository.save(post);
    }
}
