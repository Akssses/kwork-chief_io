FROM python:3.10-slim

# Установка зависимостей
RUN apt-get update && apt-get install -y gcc libpq-dev

# Установка рабочей директории
WORKDIR /app

# Копирование зависимостей
COPY req.txt .
RUN pip install --no-cache-dir -r req.txt

# Копирование всех файлов проекта
COPY . .

# Команда для запуска: выполняем миграции и запускаем gunicorn
CMD ["sh", "-c", "python manage.py migrate && gunicorn ent.wsgi:application --bind 0.0.0.0:8000"]
