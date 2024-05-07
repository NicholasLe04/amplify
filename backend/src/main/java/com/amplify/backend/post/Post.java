package com.amplify.backend.post;

import com.amplify.backend.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="spotify_url")
    private String spotifyUrl;

    @Column(name="posted_at")
    private LocalDateTime postedAt;

    @ManyToOne
    private User author;
    private String description;

    protected Post() {
    }

    public Post(String spotifyUrl, String description, User author) {
        this.spotifyUrl = spotifyUrl;
        this.description = description;
        this.postedAt = LocalDateTime.now();
        this.author = author;
    }

    public Long getId() {
        return id;
    }

    public String getSpotifyUrl() {
        return spotifyUrl;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getPostedAt() {
        return postedAt;
    }

    public User getAuthor() {
        return author;
    }

    public void setSpotifyUrl(String spotifyUrl) {
        this.spotifyUrl = spotifyUrl;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPostedAt(LocalDateTime postedAt) {
        this.postedAt = postedAt;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    @Override
    public String toString() {
        return "Post [id=" + id +
                ", author=" + author +
                ", spotifyUrl=" + spotifyUrl +
                ", postedAt=" + postedAt +
                ", description=" + description + "]";
    }
}
