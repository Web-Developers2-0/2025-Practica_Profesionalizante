package com.example.planetsuperheroes.events;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.planetsuperheroes.R;
import com.example.planetsuperheroes.models.Event;
import com.example.planetsuperheroes.network.ApiService;
import com.example.planetsuperheroes.network.RetrofitClient;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EventsActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private EventsAdapter adapter;
    private TextView errorTextView;

    private static final String TAG = "EventsActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_events);

        recyclerView = findViewById(R.id.recyclerEvents);
        errorTextView = findViewById(R.id.errorTextView);

        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new EventsAdapter(new ArrayList<>());
        recyclerView.setAdapter(adapter);

        ApiService apiService = RetrofitClient.getClient(this).create(ApiService.class);

        Call<List<Event>> call = apiService.getEvents();

        call.enqueue(new Callback<List<Event>>() {
            @Override
            public void onResponse(@NonNull Call<List<Event>> call, @NonNull Response<List<Event>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Event> events = response.body();
                    if (!events.isEmpty()) {
                        adapter.setEvents(events);
                        recyclerView.setVisibility(View.VISIBLE);
                        errorTextView.setVisibility(View.GONE);
                    } else {
                        showError("No hay eventos disponibles.");
                    }
                } else {
                    showError("No se pudo obtener la información de eventos.");
                    Log.e(TAG, "Error en response code: " + response.code());
                    try {
                        Log.e(TAG, "Error body: " + response.errorBody().string());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Event>> call, @NonNull Throwable t) {
                showError("Error de conexión. Intenta nuevamente.");
                Log.e(TAG, "Fallo en llamada API", t);
            }
        });
    }

    private void showError(String message) {
        errorTextView.setText(message);
        errorTextView.setVisibility(View.VISIBLE);
        recyclerView.setVisibility(View.GONE);
    }
}
