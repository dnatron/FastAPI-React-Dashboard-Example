#!/bin/bash

# Script pro spuštění aplikace v režimu vývoje
echo "Spouštění aplikace v režimu vývoje..."
echo "======================================"

# Zastavení existujících kontejnerů a odstranění dat
docker-compose down

# Sestavení a spuštění kontejnerů
docker-compose up --build

# Poznámka: Pro spuštění v detached módu (na pozadí) použít:
# docker-compose up --build -d
