package com.amplify.backend.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    private String id;
    private String email;
    private String display_name;
    private String country;
    @Column(name = "img_url")
    private String imgUrl;

    protected User() {
    }

    public User(String id, String email, String display_name, String imgUrl, String country) {
        this.id = id;
        this.email = email;
        this.display_name = display_name;
        this.imgUrl = imgUrl;
        this.country = country;
    }

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getDisplayName() {
        return display_name;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public String getCountry() {
        return country;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setDisplayName(String display_name) {
        this.display_name = display_name;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    @Override
    public String toString() {
        return "User [id=" + id +
                ", email=" + email +
                ", display_name=" + display_name +
                ", imgUrl=" + imgUrl +
                ", country=" + country + "]";
    }
}
