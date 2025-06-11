FROM node:18-alpine

WORKDIR /app

# Kopírování package.json a instalace závislostí
COPY package.json .
RUN npm install

# Kopírování zdrojového kódu
COPY . .

# Proměnná prostředí pro React - v produkci nastavíme na 'production'
ENV NODE_ENV=development

# Proměnná prostředí pro URL API - výchozí hodnota pro vývoj
ENV REACT_APP_API_URL=http://backend:8000

# Spuštění vývojového serveru
CMD ["npm", "start"]
