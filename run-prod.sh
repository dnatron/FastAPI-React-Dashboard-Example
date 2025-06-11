#!/bin/bash

# Script pro spuštění aplikace v produkčním režimu
echo "Spouštění aplikace v produkčním režimu..."
echo "========================================="

# Zastavení případných existujících kontejnerů
docker-compose -f docker-compose.prod.yml down

# Sestavení a spuštění kontejnerů podle produkční konfigurace
docker-compose -f docker-compose.prod.yml up --build -d

echo "Aplikace běží na pozadí v produkčním režimu"
echo "Backend API: http://localhost:8000"
echo "Frontend: http://localhost"
echo "Pro zobrazení logů použijte: docker-compose -f docker-compose.prod.yml logs -f"
echo "Pro zastavení použijte: docker-compose -f docker-compose.prod.yml down"
