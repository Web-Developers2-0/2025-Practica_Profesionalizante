package com.example.planetsuperheroes;

import com.bumptech.glide.Glide;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.planetsuperheroes.models.UserCrudInfo;
import com.example.planetsuperheroes.network.ApiService;
import com.example.planetsuperheroes.network.RetrofitClient;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class infoPersonal extends AppCompatActivity {

    private static final int PICK_IMAGE_REQUEST = 1;
    private ApiService apiService;
    private EditText nameEditText, lastNameEditText, addressEditText;
    private Button saveButton;
    private ImageView imageViewContact;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_info_personal);

        nameEditText = findViewById(R.id.editTextName);
        lastNameEditText = findViewById(R.id.editTextlastName);
        addressEditText = findViewById(R.id.editTextAdress);
        saveButton = findViewById(R.id.btnGuardarCambios);
        imageViewContact = findViewById(R.id.imageViewContact);

        apiService = RetrofitClient.getClient(this).create(ApiService.class);

        getUserInfo();

        imageViewContact.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            startActivityForResult(intent, PICK_IMAGE_REQUEST);
        });

        saveButton.setOnClickListener(v -> {
            if (validateFields()) {
                UserCrudInfo updatedUser = new UserCrudInfo(
                        0,  nameEditText.getText().toString(),
                        lastNameEditText.getText().toString(), addressEditText.getText().toString(),
                        null, null, null, null
                );
                updateUserInfo(updatedUser);
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK && data != null) {
            Uri selectedImageUri = data.getData();
            if (selectedImageUri != null) {
                uploadImageToCloudinary(selectedImageUri);
            }
        }
    }

    private void getUserInfo() {
        Call<UserCrudInfo> call = apiService.getUserCrudInfo();
        call.enqueue(new Callback<UserCrudInfo>() {
            @Override
            public void onResponse(Call<UserCrudInfo> call, Response<UserCrudInfo> response) {
                if (response.isSuccessful() && response.body() != null) {
                    UserCrudInfo userInfo = response.body();
                    String imageUrl = userInfo.getImageUrl();
                    Glide.with(infoPersonal.this)
                            .load(imageUrl != null && !imageUrl.trim().isEmpty() ? imageUrl.trim() : R.drawable.gatitoinfo)
                            .placeholder(R.drawable.gatitoinfo)
                            .error(R.drawable.gatitoinfo)
                            .into(imageViewContact);


                    nameEditText.setText(userInfo.getName());
                    lastNameEditText.setText(userInfo.getLastName());
                    addressEditText.setText(userInfo.getAddress());
                } else {
                    Log.e("InfoPersonal", "Error al obtener usuario: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<UserCrudInfo> call, Throwable t) {
                Log.e("InfoPersonal", "Error al obtener usuario: " + t.getMessage());
            }
        });
    }

    private void updateUserInfo(UserCrudInfo updatedUser) {
        Call<Void> call = apiService.updateUserCrudInfo(updatedUser);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(infoPersonal.this, "Datos actualizados correctamente", Toast.LENGTH_SHORT).show();
                    getUserInfo();
                } else {
                    Log.e("InfoPersonal", "Error en la actualización: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("InfoPersonal", "Error: " + t.getMessage());
            }
        });
    }

    private void uploadImageToCloudinary(Uri imageUri) {
        try {
            File file = new File(getRealPathFromURI(imageUri));
            RequestBody requestBody = RequestBody.create(MediaType.parse("image/*"), file);
            MultipartBody.Part imagePart = MultipartBody.Part.createFormData("image", file.getName(), requestBody);

            Call<Void> call = apiService.updateUserImage(imagePart);
            call.enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(infoPersonal.this, "Imagen actualizada correctamente", Toast.LENGTH_SHORT).show();
                        getUserInfo();
                    } else {
                        Log.e("InfoPersonal", "Error al actualizar imagen: " + response.code());
                    }
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    Log.e("InfoPersonal", "Error al subir imagen: " + t.getMessage());
                }
            });
        } catch (Exception e) {
            Log.e("InfoPersonal", "Error al leer imagen: " + e.getMessage());
        }
    }
    private String getRealPathFromURI(Uri uri) {
        String result;
        Cursor cursor = getContentResolver().query(uri, null, null, null, null);
        if (cursor == null) {
            result = uri.getPath();
        } else {
            cursor.moveToFirst();
            int idx = cursor.getColumnIndex(MediaStore.Images.ImageColumns.DATA);
            result = cursor.getString(idx);
            cursor.close();
        }
        return result;
    }

    private boolean validateFields() {
        int minLength = 3, maxLength = 30;
        String nombre = nameEditText.getText().toString();
        String apellido = lastNameEditText.getText().toString();

        String direccion = addressEditText.getText().toString();

        if (nombre.isEmpty() || nombre.length() < minLength || nombre.length() > maxLength) {
            Toast.makeText(infoPersonal.this, "El nombre debe tener entre " + minLength + " y " + maxLength + " caracteres", Toast.LENGTH_SHORT).show();
            return false;
        }
        if (apellido.isEmpty() || apellido.length() < minLength || apellido.length() > maxLength) {
            Toast.makeText(infoPersonal.this, "El apellido debe tener entre " + minLength + " y " + maxLength + " caracteres", Toast.LENGTH_SHORT).show();
            return false;
        }

        if (direccion.isEmpty() || direccion.length() < minLength || direccion.length() > maxLength) {
            Toast.makeText(infoPersonal.this, "La dirección debe tener entre " + minLength + " y " + maxLength + " caracteres", Toast.LENGTH_SHORT).show();
            return false;
        }
        return true;
    }
}
