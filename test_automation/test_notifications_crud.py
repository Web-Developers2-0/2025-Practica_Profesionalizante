import requests
import json

# Endpoint base de la API de notificaciones
BASE_URL = "https://planetsuperheroes.onrender.com/api/notifications/"

# Credenciales válidas (usuario registrado previamente)
email = "emi.test@gmail.com"
password = "MiPassword123!"

print("🔐 Autenticando usuario...")

# Paso 1: Obtener el token JWT
auth_response = requests.post(
    "https://planetsuperheroes.onrender.com/api/login/",
    headers={"Content-Type": "application/json"},
    json={"email": email, "password": password}
)

if auth_response.status_code == 200:
    token = auth_response.json().get("token")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    print("✅ Autenticación exitosa.\n")
else:
    print(f"❌ Error en autenticación: {auth_response.status_code}")
    print(auth_response.text)
    exit()

# Paso 2: Crear una notificación
print("🟢 POST / Crear notificación")
notification_data = {
    "usuario": 9,  # ID del usuario autenticado (verificado en admin)
    "mensaje": "Nueva promo en cómics 🎉",
    "tipo": "promo",
    "leida": False
}

create_response = requests.post(BASE_URL, headers=headers, json=notification_data)
status = create_response.status_code

if status in [200, 201]:
    print(f"Status: {status}")
    print("✅ Notificación creada.")
    notification_id = create_response.json().get("id")
else:
    print(f"❌ Error al crear notificación (HTTP {status})")
    try:
        print("Respuesta:", create_response.json())
    except json.decoder.JSONDecodeError:
        print("⚠️ El servidor devolvió una respuesta no JSON (posiblemente HTML).")
    exit()

# Paso 3: Listar notificaciones
print("\n🔵 GET / Listar notificaciones")
list_response = requests.get(BASE_URL, headers=headers)
print(f"Status: {list_response.status_code}")
print("Respuesta:", list_response.text)

# Paso 4: Actualizar notificación
print("\n🟠 PUT / Actualizar notificación")
update_data = {
    "usuario": 9,  # Necesario para que no dé error de validación
    "mensaje": "¡Oferta extendida solo por hoy! 🎁",
    "tipo": "promo",
    "leida": True
}
update_response = requests.put(f"{BASE_URL}{notification_id}/", headers=headers, json=update_data)
print(f"Status: {update_response.status_code}")
print("Respuesta:", update_response.text)

# Paso 5: Eliminar notificación
print("\n🔴 DELETE / Eliminar notificación")
delete_response = requests.delete(f"{BASE_URL}{notification_id}/", headers=headers)
print(f"Status: {delete_response.status_code}")
print("Respuesta:", delete_response.text)

print("\n✅ Test de CRUD de notificaciones finalizado.")
