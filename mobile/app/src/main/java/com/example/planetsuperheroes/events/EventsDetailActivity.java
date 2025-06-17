// EventsDetailActivity.java
package com.example.planetsuperheroes.events;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.example.planetsuperheroes.R;

public class EventsDetailActivity extends AppCompatActivity {

    ImageView image;
    TextView title, date, location, description;
    Button backButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_detail);

        image = findViewById(R.id.eventDetailImage);
        title = findViewById(R.id.eventDetailTitle);
        date = findViewById(R.id.eventDetailDate);
        location = findViewById(R.id.eventDetailLocation);
        description = findViewById(R.id.eventDetailDescription);
        backButton = findViewById(R.id.backButton);

        Intent intent = getIntent();
        if (intent != null) {
            title.setText(intent.getStringExtra("title"));
            date.setText(intent.getStringExtra("date"));
            location.setText(intent.getStringExtra("location"));
            description.setText(intent.getStringExtra("description"));
            String imageUrl = intent.getStringExtra("imageUrl");
            if (imageUrl != null && !imageUrl.isEmpty()) {
                Glide.with(this).load(imageUrl).into(image);
            }
        }

        backButton.setOnClickListener(v -> {
            finish();
            overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
        });
    }
}
