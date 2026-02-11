# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copiar dependencias del builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copiar código fuente
COPY src ./src

# Exponer puerto
EXPOSE 3000

USER node

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/ping', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Iniciar la aplicación
CMD ["npm", "start"]
