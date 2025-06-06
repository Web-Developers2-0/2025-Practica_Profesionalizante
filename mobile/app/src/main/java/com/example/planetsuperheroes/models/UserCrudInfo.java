package com.example.planetsuperheroes.models;

import com.google.gson.annotations.SerializedName;

public class UserCrudInfo {
    private int id;

    private String first_name;
    private String last_name;
    private String address;
    private String phone;
    private String password;
    private String confirmPassword;


    @SerializedName("image")  // <-- Esto hace que Retrofit sepa que el campo JSON "image" va aquí
    private String imageUrl;
    // Constructor con todos los campos
    public UserCrudInfo(int id, String first_name, String last_name,
                        String address, String phone, String password,
                        String confirmPassword, String imageUrl) {
        this.id = id;

        this.first_name = first_name;
        this.last_name = last_name;
        this.address = address;
        this.phone = phone;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.imageUrl = imageUrl;
    }


    // Getters y Setters para cada campo
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }



    public String getName() {
        return first_name;
    }

    public void setName(String first_name) {
        this.first_name = first_name;
    }

    public String getLastName() {
        return last_name;
    }

    public void setLastName(String last_name) {
        this.last_name = last_name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }


    // Constructor, getters y setters
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + first_name + '\'' +
                ", lastName='" + last_name + '\'' +
                ", address='" + address + '\'' +
                '}';
    }
}



