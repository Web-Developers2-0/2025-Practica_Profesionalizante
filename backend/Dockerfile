# Usa una imagen base de Python 3.12
FROM python:3.12

# Establece el directorio de trabajo en /backend
WORKDIR /backend

# Copia el archivo .env al contenedor
COPY .env /backend/.env

# Copia todos los archivos al contenedor
COPY . .

# Crea el directorio de logs
RUN mkdir -p /backend/logs

# Instala las dependencias del proyecto
RUN pip install --no-cache-dir -r requirements.txt

# Instala psycopg2-binary
RUN pip install psycopg2-binary

# Comando para recopilar archivos estáticos
RUN python manage.py collectstatic --noinput

# Genera las migraciones automáticamente
RUN python manage.py makemigrations

# Ejecuta las migraciones automáticamente
RUN python manage.py migrate

# Expone el puerto de la aplicación
EXPOSE 8000

# Comando para ejecutar la aplicación con Gunicorn
CMD ["gunicorn", "PlanetSuperheroes.wsgi:application", "--bind", "0.0.0.0:8000", "--error-logfile", "/backend/logs/django_error.log"]
