package com.example.planetsuperheroes.models;
import com.google.gson.annotations.SerializedName;

public class Event{
    private int id;
    private String title;
    private String description;

    @SerializedName("image_url")
    private String image;

    private String date;
    private String location;
    private String link;

    @SerializedName("created_at")
    private String createdAt;

    // Getters
    public int getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImage() { return image; }
    public String getDate() { return date; }
    public String getLocation() { return location; }
    public String getLink() { return link; }
    public String getCreatedAt() { return createdAt; }
}
