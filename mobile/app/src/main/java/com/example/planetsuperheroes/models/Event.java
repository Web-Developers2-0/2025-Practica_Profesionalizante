package com.example.planetsuperheroes.models;

public class Event {
    private int id;
    private String title;
    private String description;
    private String image;
    private String date;
    private String location;
    private String link;
    private String created_at; // Si lo necesitas

    public int getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImage() { return image; }
    public String getDate() { return date; }
    public String getLocation() { return location; }
    public String getLink() { return link; }
    public String getCreated_at() { return created_at; }
}