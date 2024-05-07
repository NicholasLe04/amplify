package com.amplify.backend.post;

import java.util.Optional;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.amplify.backend.user.User;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>{

    @Query("SELECT p FROM Post p WHERE p.author = ?1")
    Optional<List<Post>> findByAuthor(User author);

    Page<Post> findAllByOrderByPostedAtDesc(Pageable pageable);
}
