#--- Etapa de construcción ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
RUN npm install react-dnd react-dnd-html5-backend axios
COPY . .
RUN npm run build

#--- Etapa de producción ---
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
#Copia solo lo necesario (optimización)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

#Instalar un servidor ligero como 'serve' (opción recomendada)
RUN npm install -g serve

#Exponer el puerto (debe coincidir con el que usas en serve)
EXPOSE 3100

#Usar 'serve' para servir la app (más confiable que vite preview)
CMD ["serve", "-s", "dist", "-l", "3100"]