"""
Security Test - Login Endpoint

This script performs security-focused tests against the /api/login/ endpoint
of the Planet Superheroes backend, checking for common vulnerabilities such as:
- SQL injection attempts
- XSS in input fields
- Generic vs. detailed error responses
- Proper status codes
"""

import requests

url = "https://planetsuperheroes.onrender.com/api/login/"

# Lista de pruebas con tipo y payload
tests = [
    {
        "tipo": "SQL Injection en email",
        "payload": {"email": "admin' OR '1'='1", "password": "123456"}
    },
    {
        "tipo": "XSS Injection",
        "payload": {"email": "<script>alert('xss')</script>", "password": "123"}
    },
    {
        "tipo": "Password SQL Bypass",
        "payload": {"email": "test@example.com", "password": "' OR ''='"}
    },
    {
        "tipo": "Login válido",
        "payload": {"email": "emi.test@gmail.com", "password": "MiPassword123!"}
    },
]

headers = {
    "Content-Type": "application/json"
}

print("🔒 Iniciando pruebas de seguridad sobre el endpoint de login...\n")

for i, test in enumerate(tests, 1):
    tipo = test["tipo"]
    payload = test["payload"]

    print(f"--- Test #{i}: {tipo} ---")
    print(f"Payload enviado: {payload}")
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        status = response.status_code

        # Mostrar respuesta legible
        try:
            body = response.json()
        except:
            body = response.text

        print(f"Status Code: {status}")
        print(f"Respuesta del servidor: {body}")

        # Evaluación de resultados
        if status == 200:
            if tipo == "Login válido":
                print("✅ Login exitoso con usuario válido.")
            else:
                print("⚠️  Posible riesgo: se aceptó una credencial inesperada.")
        elif status == 401 or status == 403:
            print("✅ Rechazo esperado del intento no autorizado.")
        elif status == 400:
            print("✅ Rechazo esperado de entrada malformada o inválida.")
        elif status >= 500:
            print("🚨 Error del servidor: posible vulnerabilidad grave.")
        else:
            print("ℹ️ Respuesta recibida, revisar comportamiento.")

    except requests.exceptions.Timeout:
        print("⏱️ Error: el servidor no respondió dentro del tiempo esperado.")
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de red inesperado: {e}")

    print("-------------------------\n")


