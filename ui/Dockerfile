# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Construir aplicación
RUN npm run build

# Runtime stage - usar nginx para servir la aplicación
FROM nginx:alpine

# Copiar archivo de configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos compilados desde builder
COPY --from=builder /app/build /usr/share/nginx/html

# Exponer puerto
EXPOSE 3000

# Healthcheck
#HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
#  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
