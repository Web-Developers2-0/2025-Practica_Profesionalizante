import os
import re
from django.db import connection
from django.conf import settings
from django.db.models.signals import post_migrate
from django.dispatch import receiver

@receiver(post_migrate)
def load_data_script(sender, **kwargs):
    sql_file_path = os.path.join(settings.BASE_DIR, 'User', 'initial_data.sql')

    if not os.path.exists(sql_file_path):
        print(f'SQL file not found: {sql_file_path}')
        return

    # Orden correcto según dependencias
    affected_tables = ['roles', 'categories', 'user', 'products', 'orders', 'order_items']

    with open(sql_file_path, 'r') as file:
        sql = file.read()

    # Dividir en sentencias individuales
    statements = [stmt.strip() for stmt in sql.split(';') if stmt.strip()]

    # Agrupar las sentencias por tabla
    table_statements = {table: [] for table in affected_tables}
    for stmt in statements:
        for table in affected_tables:
            if re.search(rf"insert\s+into\s+`?{table}`?", stmt, re.IGNORECASE):
                table_statements[table].append(stmt + ';')
                break

    with connection.cursor() as cursor:
        for table in affected_tables:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                if count == 0 and table_statements[table]:
                    for insert_stmt in table_statements[table]:
                        cursor.execute(insert_stmt)
                    print(f"✅ Cargados datos en la tabla '{table}'")
                else:
                    print(f"ℹ️ La tabla '{table}' ya tiene datos, se omite")
            except Exception as e:
                print(f"⚠️ Saltando tabla '{table}': {e}")
