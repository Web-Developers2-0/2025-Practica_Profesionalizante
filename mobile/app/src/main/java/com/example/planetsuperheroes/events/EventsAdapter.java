// EventsAdapter.java
package com.example.planetsuperheroes.events;

import android.app.Activity;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.planetsuperheroes.R;
import com.example.planetsuperheroes.models.Event;

import java.util.List;

public class EventsAdapter extends RecyclerView.Adapter<EventsAdapter.EventViewHolder> {
    private List<Event> events;

    public EventsAdapter(List<Event> events) {
        this.events = events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
        notifyDataSetChanged();
    }

    public static class EventViewHolder extends RecyclerView.ViewHolder {
        ImageView image;
        TextView title, date, location;

        public EventViewHolder(@NonNull View itemView) {
            super(itemView);
            image = itemView.findViewById(R.id.eventImage);
            title = itemView.findViewById(R.id.eventTitle);
            date = itemView.findViewById(R.id.eventDate);
            location = itemView.findViewById(R.id.eventLocation);
        }
    }

    @NonNull
    @Override
    public EventViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_event, parent, false);
        return new EventViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull EventViewHolder holder, int position) {
        Event event = events.get(position);

        holder.title.setText(event.getTitle());
        holder.date.setText(event.getDate());
        holder.location.setText(event.getLocation());

        Glide.with(holder.image.getContext())
                .load(event.getImage()) // URL de Cloudinary
                .placeholder(R.drawable.ic_launcher_background)
                .error(R.drawable.ic_launcher_background)
                .into(holder.image);

        holder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(v.getContext(), EventsDetailActivity.class);
            intent.putExtra("title", event.getTitle());
            intent.putExtra("date", event.getDate());
            intent.putExtra("location", event.getLocation());
            intent.putExtra("description", event.getDescription());
            intent.putExtra("imageUrl", event.getImage());
            v.getContext().startActivity(intent);

            if (v.getContext() instanceof Activity) {
                ((Activity) v.getContext()).overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
            }
        });
    }

    @Override
    public int getItemCount() {
        return events != null ? events.size() : 0;
    }
}
