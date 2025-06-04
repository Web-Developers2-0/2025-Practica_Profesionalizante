package com.example.planetsuperheroes.events;

public class Event {

    private final String title;
    private final String date;
    private final String location;
    private final String fullDescription;
    private final int imageResId;

    public Event(String title, String date, String location, String fullDescription, int imageResId) {
        this.title = title;
        this.date = date;
        this.location = location;
        this.fullDescription = fullDescription;
        this.imageResId = imageResId;
    }

    public String getTitle() {
        return title;
    }

    public String getDate() {
        return date;
    }

    public String getLocation() {
        return location;
    }

    public String getFullDescription() {
        return fullDescription;
    }

    public int getImageResId() {
        return imageResId;
    }
}


