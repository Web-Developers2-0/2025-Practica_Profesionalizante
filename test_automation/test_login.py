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

# Ir a la página de login
driver.get("https://planetsuperheroes.vercel.app/login")
time.sleep(2)

# Datos del usuario registrado
email = "emi.test@gmail.com"
password = "MiPassword123!"

# Completar campo Email
try:
    campo_email = driver.find_element(By.XPATH, '//input[@placeholder="Email"]')
    campo_email.send_keys(email)
    print("✅ Campo 'Email' completado.")
except:
    print("❌ Error al completar el campo 'Email'.")

# Completar campo Contraseña
try:
    campo_password = driver.find_element(By.XPATH, '//input[@placeholder="Contraseña"]')
    campo_password.send_keys(password)
    print("✅ Campo 'Contraseña' completado.")
except:
    print("❌ Error al completar el campo 'Contraseña'.")

# Esperar a que el botón se habilite y hacer clic
try:
    boton = WebDriverWait(driver, 10).until(lambda d: d.find_element(By.XPATH, '//button[@type="submit"]'))

    if boton.is_enabled():
        print("✅ Botón 'Ingresar' habilitado. Haciendo clic...")
        boton.click()
    else:
        print("❌ El botón está deshabilitado, posible error en validación.")
except Exception as e:
    print(f"⚠️ Error al hacer clic en el botón de login: {e}")

# Esperar resultado
time.sleep(4)

# Verificar si el usuario fue redirigido (login exitoso)
if "login" not in driver.current_url:
    print("✅ Login exitoso. Usuario ingresó correctamente.")
else:
    print("❌ Login fallido. Aún permanece en la pantalla de login.")

# Cerrar navegador
driver.quit()
