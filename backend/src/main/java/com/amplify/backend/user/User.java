package com.amplify.backend.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    private String email;
    private String display_name;
    private String country;
    @Column(name = "external_url")
    private String externalUrl;
    @Column(name = "img_url")
    private String imgUrl;

    protected User() {
    }

    public User(String email, String display_name, String externalUrl, String imgUrl, String country) {
        this.email = email;
        this.display_name = display_name;
        this.externalUrl = externalUrl;
        this.imgUrl = imgUrl;
        this.country = country;
    }

    public String getEmail() {
        return email;
    }

    public String getDisplayName() {
        return display_name;
    }

    public String getExternalUrl() {
        return externalUrl;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public String getCountry() {
        return country;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setDisplayName(String display_name) {
        this.display_name = display_name;
    }

    public void setExternalUrl(String externalUrl) {
        this.externalUrl = externalUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    @Override
    public String toString() {
        return "User [email=" + email +
                ", display_name=" + display_name +
                ", externalUrl=" + externalUrl +
                ", imgUrl=" + imgUrl +
                ", country=" + country + "]";
    }
}
