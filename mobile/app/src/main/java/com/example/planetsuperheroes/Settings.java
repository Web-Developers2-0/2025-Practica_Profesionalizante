package com.example.planetsuperheroes;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.content.Intent;
import android.widget.TextView;
import android.widget.Toast;
import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.example.planetsuperheroes.network.ApiService;
import com.example.planetsuperheroes.models.User;
import com.example.planetsuperheroes.network.AuthInterceptor;
import com.example.planetsuperheroes.network.RetrofitClient;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import androidx.appcompat.app.AlertDialog;

public class Settings extends AppCompatActivity {
    private ImageButton imageButtonProfile;
    private Button logoutButton;
    private SharedPreferences sharedPreferences;
    private static final String PREFS_NAME = "LoginPrefs";
    private static final String KEY_TOKEN = "auth_token";

    private ImageButton flechaBotonPreguntas;
    private ImageButton flechaBotonContactanos;
    private ApiService apiService;
    private TextView userName;
    private TextView userEmail;
    private ImageButton imageButtonhistorialcompra;
    private ImageButton flechaBotonTerminos;
    private ImageView imageViewPassword;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_settings);

        imageButtonProfile = findViewById(R.id.imageButtonProfile);
        flechaBotonPreguntas = findViewById(R.id.flechaBotonPreguntas);
        flechaBotonContactanos = findViewById(R.id.flechaBotonContactanos);
        userName = findViewById(R.id.userName);
        userEmail = findViewById(R.id.userEmail);
        apiService = RetrofitClient.getClient(this).create(ApiService.class);
        imageButtonhistorialcompra = findViewById(R.id.imageButtonhistorialcompra);
        flechaBotonTerminos = findViewById(R.id.flechaBotonTerminos);
        logoutButton = findViewById(R.id.logoutButton);
        imageViewPassword = findViewById(R.id.imageViewPassword);
        sharedPreferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);

        getUserInfo();

        imageButtonProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Settings.this, infoPersonal.class);
                startActivity(intent);
            }
        });

        imageButtonhistorialcompra.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Settings.this, Historial_Compras.class);
                startActivity(intent);
            }
        });

        flechaBotonPreguntas.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Settings.this, FaqActivity.class);
                startActivity(intent);
            }
        });

        flechaBotonContactanos.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Settings.this, ContactActivity.class);
                startActivity(intent);
            }
        });

        flechaBotonTerminos.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Settings.this, TermsActivity.class);
                startActivity(intent);
                }
        });

        ImageButton flechaBotonContrasena = findViewById(R.id.flechaBotonContrasena);
        flechaBotonContrasena.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                new AlertDialog.Builder(Settings.this)
                .setTitle("Cambiar contraseña")
                .setMessage(
                    "Por seguridad, el cambio de contraseña solo se puede hacer desde la página web.\n\n" +
                    "Te llevaremos al sitio donde deberás iniciar sesión. Después de ingresar, busca la opción 'Cambiar contraseña' en el menú de usuario y sigue las instrucciones."
                )
                .setPositiveButton("Ir a la web", (dialog, which) -> {
                    String url = "https://planetsuperheroes-git-develop-marco-virinnis-projects.vercel.app/login";
                    Intent intent = new Intent(Intent.ACTION_VIEW);
                    intent.setData(android.net.Uri.parse(url));
                    startActivity(intent);
                })
                .setNegativeButton("Cancelar", null)
                .show();
            }
        });

        logoutButton.setOnClickListener(v -> showLogoutConfirmationDialog());

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.Settings), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    private void showLogoutConfirmationDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("¿Queres cerrar sesión?")
                .setPositiveButton("Sí", (dialog, id) -> performLogout())
                .setNegativeButton("No", (dialog, id) -> dialog.dismiss());
        builder.create().show();
    }

    private void performLogout() {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.remove(KEY_TOKEN);
        editor.apply();

        Toast.makeText(this, "Has cerrado sesión con exito.", Toast.LENGTH_SHORT).show();

        Intent intent = new Intent(Settings.this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }

    private void getUserInfo() {
        Call<User> call = apiService.getUserInfo();

        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    User user = response.body();
                    if (user != null) {
                        String username = user.getUsername();
                        String email = user.getEmail();

                        userName.setText(username);
                        userEmail.setText(email);
                    }
                } else {
                    Log.e("SettingsActivity", "Error en la respuesta: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.e("SettingsActivity", "Error: " + t.getMessage());
            }
        });
    }
}