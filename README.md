# FastAPI-React-Dashboard-Example

Ukázková webová aplikace s dashboardem využívající FastAPI (backend), React.js (frontend) a Docker Compose (pro správu služeb).

## Popis projektu

Tento projekt implementuje jednoduchou webovou aplikaci s přihlášením, registrací a chráněným dashboardem. Slouží jako ukázka propojení moderních technologií pro full-stack vývoj.

Upozornění: Modernější řešení pro FrondEnd s FastAPI nemísto React je HTMX s Jinja2 a nebo FastHTML od vývojářů FastAPI.

Jinak pro lepší vzhled pak doporučuji použít Bootatrap nebo Tailwind CSS.

### Hlavní funkce

- Registrace a přihlášení uživatelů
- JWT autentizace
- Zabezpečení hesel pomocí bcrypt
- Chráněná stránka Dashboard
- Responzivní UI

### Technologie

#### Backend
- FastAPI - rychlý Python framework pro API
- SQLModel - ORM pro práci s databází
- JWT pro autentizaci
- SQLite (vývojové prostředí)
- PostgreSQL (produkční prostředí)

#### Frontend
- React.js - knihovna pro tvorbu UI
- React Router - správa routování
- Axios - HTTP klient

#### Deployment
- Docker a Docker Compose
- Konfigurace pro vývoj i produkci

## Struktura projektu

```
myapp/
├── backend/
│   ├── src/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── database.py
│   │   └── auth.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── auth.js
│   │   ├── App.js
│   │   └── App.css
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml          # vývojový
├── docker-compose.prod.yml     # produkční
├── run-dev.sh                  # skript pro spuštění vývoje
└── run-prod.sh                 # skript pro spuštění produkce
```

## Instalace a spuštění

### Požadavky

- Docker a Docker Compose
- Git

### Vývojové prostředí

1. Naklonujte repozitář:
   ```bash
   git clone <URL repozitáře>
   cd FastAPI-React-Dashboard-Example
   ```

2. Nastavte oprávnění pro spouštění skriptů:
   ```bash
   chmod +x run-dev.sh
   chmod +x run-prod.sh
   ```

3. Spusťte aplikaci ve vývojovém režimu:
   ```bash
   ./run-dev.sh
   ```

4. Aplikace bude dostupná na:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API dokumentace: http://localhost:8000/docs

### Produkční prostředí

1. Nastavte produkční proměnné prostředí (volitelné):
   ```bash
   export SECRET_KEY="vas-tajny-klic"
   export FRONTEND_URL="http://vas-frontend-url"
   ```

2. Spusťte aplikaci v produkčním režimu:
   ```bash
   ./run-prod.sh
   ```

3. Aplikace bude dostupná na:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API dokumentace: http://localhost:8000/docs

## Testování

### API Testy

Backend API můžete testovat pomocí Swagger dokumentace dostupné na `/docs` endpointu:
- http://localhost:8000/docs

### Manuální testování

1. Registrujte nového uživatele na `/register`
2. Přihlaste se pomocí vytvořeného účtu na `/login`
3. Po přihlášení budete přesměrováni na dashboard

## Doporučení pro další vylepšení

- **Validace**: Přidat pokročilejší validaci formulářů na frontendu
- **CSS Framework**: Implementovat Bootstrap nebo Material-UI pro lepší vzhled
- **OAuth**: Přidat přihlášení přes třetí strany (Google, Facebook)
- **Unit testy**: Přidat jednotkové testy pro backend i frontend
- **CI/CD**: Nastavit kontinuální integraci a nasazení
- **Monitoring**: Přidat monitoring pomocí např. Prometheus a Grafana
- **Cachování**: Implementovat Redis pro cachování dat
- **Správa uživatelů**: Přidat administrátorské rozhraní
- **Profily uživatelů**: Umožnit uživatelům upravit své profily
- **Email verifikace**: Přidat ověření emailu při registraci
- **Reset hesla**: Implementovat funkci pro obnovení hesla
- **Rate limiting**: Přidat omezení počtu požadavků pro prevenci útoku

## Licence

Tento projekt je licencován pod [MIT licencí](https://opensource.org/licenses/MIT).

Ukázku vytvořil DnaTron.com [DnaTron](https://www.dnatron.com)