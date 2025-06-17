package com.example.planetsuperheroes.models;

import android.os.Parcel;
import android.os.Parcelable;
import com.google.gson.annotations.SerializedName;

public class OrderItem implements Parcelable {
    @SerializedName("id_order_items")
    private int idOrderItem;
    private int productId;
    @SerializedName("product") // <-- ¡GSON mapea el campo "product" del JSON a este String!
    private String productName;
    @SerializedName("quantity")
    private int quantity;
    public OrderItem(int productId, String productName, int quantity) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
    }

    protected OrderItem(Parcel in) {
        idOrderItem = in.readInt();
        productId = in.readInt(); // Lee el ID del producto
        productName = in.readString();
        quantity = in.readInt();
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeInt(idOrderItem);
        dest.writeInt(productId); // Escribe el ID del producto
        dest.writeString(productName);
        dest.writeInt(quantity);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public static final Creator<OrderItem> CREATOR = new Creator<OrderItem>() {
        @Override
        public OrderItem createFromParcel(Parcel in) {
            return new OrderItem(in);
        }

        @Override
        public OrderItem[] newArray(int size) {
            return new OrderItem[size];
        }
    };

    // --- Getters ---
    public int getIdOrderItem() {
        return idOrderItem;
    }

    public int getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public int getQuantity() {
        return quantity;
    }
}