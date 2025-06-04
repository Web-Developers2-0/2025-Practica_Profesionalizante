package com.example.planetsuperheroes.events;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.planetsuperheroes.R;

import java.util.ArrayList;
import java.util.List;

public class EventsActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private List<Event> eventList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_events);

        recyclerView = findViewById(R.id.recyclerEvents);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        eventList = new ArrayList<>();

        eventList.add(new Event(
                "Argentina ComicCon",
                "10–12 de mayo, 2025",
                "Centro de Convenciones, CABA",
                "La mayor convención de cómics de Argentina, con invitados especiales, paneles, lanzamientos exclusivos y zonas interactivas.",
                R.drawable.comiccon
        ));

        eventList.add(new Event(
                "CAF",
                "11 de mayo, 2025",
                "Quality Espacio, Córdoba",
                "El evento de historietas y editoriales independientes más importante del país, con charlas, exposiciones y venta de cómics autogestionados.",
                R.drawable.cafevento
        ));

        eventList.add(new Event(
                "El Eternauta",
                "Durante todo mayo, 2025",
                "Exposición virtual",
                "Homenaje al clásico argentino con galerías ilustradas, entrevistas a artistas invitados y una mirada al impacto cultural del Eternauta.",
                R.drawable.eternautaevent
        ));

        eventList.add(new Event(
                "AnimeCon",
                "25 y 26 de mayo, 2025",
                "Palais Rouge, CABA",
                "Convención de cultura asiática con zona de cosplay, artistas invitados, merchandising, k-pop, concursos y talleres.",
                R.drawable.animecon
        ));

        // 🔥 Esto es lo que faltaba
        EventAdapter adapter = new EventAdapter(eventList);
        recyclerView.setAdapter(adapter);
    }
}


