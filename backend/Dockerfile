FROM python:3.11-slim

WORKDIR /app

# Kopírování a instalace závislostí
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopírování zdrojového kódu
COPY src/ ./src/

# Nastavení proměnné prostředí pro Python cestu
ENV PYTHONPATH=/app

# Příkaz pro spuštění aplikace v režimu pro vývoj
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
