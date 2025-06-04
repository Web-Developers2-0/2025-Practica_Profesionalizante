from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Configurar navegador
options = Options()
driver = webdriver.Chrome(options=options)
driver.maximize_window()

# Ir al formulario
driver.get("https://planetsuperheroes.vercel.app/register")
time.sleep(3)

# Datos de prueba
nombre = "Emilce"
apellido = "Robles"
email = "emi.test@gmail.com"
telefono = "3512345678"
direccion = "Córdoba Capital"
contraseña = "MiPassword123!"
confirmar = "MiPassword123!"

# Completar campos
try:
    driver.find_element(By.XPATH, '//input[@placeholder="Nombre"]').send_keys(nombre)
    print("✅ Campo 'Nombre' completado.")
except:
    print("❌ Campo 'Nombre' no se pudo completar.")

try:
    driver.find_element(By.XPATH, '//input[@placeholder="Apellido"]').send_keys(apellido)
    print("✅ Campo 'Apellido' completado.")
except:
    print("❌ Campo 'Apellido' no se pudo completar.")

try:
    driver.find_element(By.XPATH, '//input[@placeholder="Email"]').send_keys(email)
    print("✅ Campo 'Email' completado.")
except:
    print("❌ Campo 'Email' no se pudo completar.")

try:
    driver.find_element(By.XPATH, '//input[@placeholder="Teléfono"]').send_keys(telefono)
    print("✅ Campo 'Teléfono' completado.")
except:
    print("❌ Campo 'Teléfono' no se pudo completar.")

try:
    driver.find_element(By.XPATH, '//input[@placeholder="Dirección"]').send_keys(direccion)
    print("✅ Campo 'Dirección' completado.")
except:
    print("❌ Campo 'Dirección' no se pudo completar.")

try:
    driver.find_element(By.XPATH, '//input[@placeholder="Contraseña"]').send_keys(contraseña)
    driver.find_element(By.XPATH, '//input[@placeholder="Confirmar contraseña"]').send_keys(confirmar)
    print("✅ Contraseñas completadas.")
except:
    print("❌ Error al completar las contraseñas.")

# Aceptar términos
try:
    checkbox = driver.find_element(By.ID, "terms")
    driver.execute_script("arguments[0].scrollIntoView(true);", checkbox)
    driver.execute_script("arguments[0].click();", checkbox)
    time.sleep(1)

    if checkbox.is_selected():
        print("✅ Checkbox de términos marcado correctamente.")
    else:
        print("❌ El checkbox NO se marcó.")
except Exception as e:
    print(f"⚠️ Error al marcar el checkbox: {e}")

# Click en botón de registro y manejar alert
try:
    boton = driver.find_element(By.XPATH, '//button[contains(text(),"Registrarse")]')

    if boton.is_enabled():
        print("✅ Botón de registro habilitado.")
        boton.click()

        # Manejar alerta emergente
        try:
            alert = WebDriverWait(driver, 5).until(EC.alert_is_present())
            print("✅ ALERTA DETECTADA:", alert.text)
            alert.accept()
        except:
            print("ℹ️ No apareció ninguna alerta.")
        
        print("✅ Registro procesado. Continuando validación...")

    else:
        print("❌ Botón de registro deshabilitado.")

except Exception as e:
    print(f"⚠️ Error al interactuar con el botón: {e}")

# Esperar
time.sleep(3)

# Confirmar que no haya errores visibles
try:
    errores = driver.find_elements(By.CLASS_NAME, "termsError")
    if errores:
        print("❌ Se detectaron errores en el formulario:")
        for e in errores:
            print("-", e.text)
    else:
        print("✅ No se detectaron errores visuales en el formulario.")
except:
    print("⚠️ No se pudieron verificar errores visuales.")

# Simular paso siguiente: redirigir manualmente a login
driver.get("https://planetsuperheroes.vercel.app/login")
time.sleep(2)
print("✅ Redirección a pantalla de login completada.")

# Cerrar navegador
driver.quit()

