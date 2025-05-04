# Dockerfile para el microservicio de Pokémon
FROM node:20-alpine

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 8080

# Configurar variables de entorno predeterminadas
ENV PORT=8080 \
    NODE_ENV=production \
    POKEAPI_BASE_URL=https://pokeapi.co/api/v2 \
    REDIS_HOST=pokecare-redis-master \
    REDIS_PORT=6379

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Comando para iniciar la aplicación
CMD ["node", "app.js"]