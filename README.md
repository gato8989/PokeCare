# PokeCare - Implementación con Kubernetes, Helm y Monitoreo

Este proyecto transforma la aplicación PokeCare (originalmente desarrollada con React + Vite) en una arquitectura de microservicios desplegada en Kubernetes, con empaquetado Helm, CI/CD con GitHub Actions y monitoreo con Prometheus/Grafana.

## Estructura del Proyecto

```
PokeCare/
├── docs/                           # Documentación del proyecto
│   └── diseno_implementacion.md    # Diseño detallado de la implementación
├── helm/                           # Configuración de Helm Charts
│   └── pokecare/
│       ├── Chart.yaml              # Definición del Chart
│       └── values.yaml             # Valores configurables
├── kubernetes/                     # Configuración de Kubernetes
│   ├── frontend-deployment.yaml    # Despliegue del frontend
│   ├── pokemon-service-deployment.yaml # Despliegue del servicio de Pokémon
│   └── monitoring/                 # Configuración de monitoreo
│       └── prometheus-values.yaml  # Valores para Prometheus y Grafana
├── src/                            # Código fuente de la aplicación
│   ├── components/                 # Componentes React
│   └── ...
├── .github/                        # Configuración de GitHub
│   └── workflows/                  # Flujos de trabajo de GitHub Actions
│       └── ci-cd.yaml              # Pipeline de CI/CD
├── Dockerfile                      # Configuración de Docker para el frontend
└── README.md                       # Este archivo
```

## Arquitectura de Microservicios

La aplicación se ha dividido en los siguientes microservicios:

1. **Frontend**: Interfaz de usuario React
2. **API Gateway**: Punto de entrada para todas las solicitudes
3. **Servicio de Pokémon**: Gestión de datos de Pokémon y caché de PokeAPI
4. **Servicio de Usuarios**: Gestión de cuentas y autenticación
5. **Servicio de Guardería**: Lógica de negocio para la guardería

## Implementación en Kubernetes

### Requisitos Previos

- Suscripción de Azure
- Azure CLI instalado
- kubectl instalado
- Helm instalado

### Pasos para Implementar

1. **Crear un Cluster AKS**

```bash
# Crear grupo de recursos
az group create --name pokecare-rg --location eastus

# Crear cluster AKS
az aks create --resource-group pokecare-rg --name pokecare-aks --node-count 3 --enable-addons monitoring --generate-ssh-keys

# Obtener credenciales
az aks get-credentials --resource-group pokecare-rg --name pokecare-aks
```

2. **Crear Azure Container Registry (ACR)**

```bash
# Crear ACR
az acr create --resource-group pokecare-rg --name acrpokecare --sku Basic

# Vincular ACR con AKS
az aks update --resource-group pokecare-rg --name pokecare-aks --attach-acr acrpokecare
```

3. **Configurar GitHub Actions**

- Crear secretos en el repositorio de GitHub:
  - `ACR_USERNAME`: Usuario de ACR
  - `ACR_PASSWORD`: Contraseña de ACR
  - `AZURE_CREDENTIALS`: Credenciales de Azure (JSON)

4. **Desplegar con Helm**

```bash
# Agregar repositorios de Helm
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Instalar Chart de PokeCare
helm install pokecare ./helm/pokecare --namespace pokecare --create-namespace
```

5. **Implementar Monitoreo**

```bash
# Instalar Prometheus y Grafana
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace \
  -f ./kubernetes/monitoring/prometheus-values.yaml
```

## CI/CD con GitHub Actions

El pipeline de CI/CD incluye:

1. **Build y Test**: Compilación y pruebas de la aplicación
2. **Construcción de Imágenes Docker**: Creación y publicación de imágenes en ACR
3. **Despliegue en AKS**: Actualización de la aplicación en Kubernetes usando Helm

Los despliegues se realizan automáticamente en diferentes entornos según la rama o etiqueta:
- `develop` → Entorno de desarrollo
- `main` → Entorno de staging
- Tags `rc-*` → Entorno de staging
- Tags `v*` → Entorno de producción

## Monitoreo con Prometheus y Grafana

Se han configurado dashboards para monitorear:

1. **Infraestructura**: Uso de recursos del cluster
2. **Aplicación**: Latencia, tasas de error, solicitudes por segundo
3. **Negocio**: Métricas específicas de la aplicación

Para acceder a Grafana:

```bash
# Obtener contraseña de Grafana
kubectl get secret --namespace monitoring prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 --decode

# Hacer port-forward
kubectl port-forward --namespace monitoring svc/prometheus-grafana 3000:80
```

Luego acceder a http://localhost:3000 con usuario `admin` y la contraseña obtenida.

## Documentación Adicional

Para más detalles sobre la implementación, consultar el documento de diseño en `docs/diseno_implementacion.md`.

## Información Original de React + Vite

Esta aplicación fue creada con React y Vite, que proporciona una configuración mínima con HMR y reglas de ESLint.

Plugins oficiales disponibles:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Babel](https://babeljs.io/) para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/) para Fast Refresh
