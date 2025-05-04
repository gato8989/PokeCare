# Helm Charts para PokeCare

Este directorio contiene los Helm Charts necesarios para desplegar la aplicación PokeCare en un clúster de Kubernetes.

## Estructura

```
helm/
├── pokecare/
│   ├── Chart.yaml           # Definición del chart y dependencias
│   ├── values.yaml          # Valores predeterminados para desarrollo
│   ├── values-production.yaml # Valores optimizados para producción
│   └── templates/           # Plantillas de Kubernetes
│       ├── _helpers.tpl     # Funciones de ayuda para las plantillas
│       ├── api-gateway.yaml # Configuración del API Gateway
│       ├── daycare-service.yaml # Configuración del servicio de guardería
│       ├── frontend.yaml    # Configuración del frontend
│       ├── ingress.yaml     # Configuración de Ingress
│       ├── monitoring.yaml  # Configuración de monitoreo
│       ├── pokemon-service.yaml # Configuración del servicio de Pokémon
│       ├── secrets.yaml     # Configuración de secretos
│       ├── user-service.yaml # Configuración del servicio de usuarios
│       └── NOTES.txt        # Notas mostradas después de la instalación
```

## Requisitos previos

- Kubernetes 1.19+
- Helm 3.2.0+
- Ingress Controller instalado (como NGINX Ingress)
- Prometheus Operator instalado (para monitoreo)

## Instalación

### Desarrollo local

```bash
helm install pokecare ./pokecare --create-namespace --namespace pokecare
```

### Entorno de producción

```bash
helm install pokecare ./pokecare --create-namespace --namespace pokecare --values ./pokecare/values-production.yaml
```

## Configuración

Para personalizar la instalación, puede crear su propio archivo de valores y pasarlo con el parámetro `--values`:

```bash
helm install pokecare ./pokecare --values mi-configuracion.yaml
```

### Parámetros principales

| Parámetro | Descripción | Valor predeterminado |
|-----------|-------------|----------------------|
| `global.environment` | Entorno de despliegue | `development` |
| `global.imageRegistry` | Registro de imágenes Docker | `acrpokecare.azurecr.io` |
| `global.imageTag` | Etiqueta de imagen para todos los servicios | `latest` |
| `frontend.replicaCount` | Número de réplicas del frontend | `2` |
| `apiGateway.replicaCount` | Número de réplicas del API Gateway | `2` |
| `pokemonService.replicaCount` | Número de réplicas del servicio de Pokémon | `2` |
| `userService.replicaCount` | Número de réplicas del servicio de usuarios | `2` |
| `daycareService.replicaCount` | Número de réplicas del servicio de guardería | `2` |
| `mongodb.enabled` | Habilitar MongoDB | `true` |
| `redis.enabled` | Habilitar Redis | `true` |
| `ingress.enabled` | Habilitar Ingress | `true` |
| `monitoring.enabled` | Habilitar monitoreo | `true` |

## Monitoreo

La aplicación está configurada para ser monitoreada con Prometheus y visualizada con Grafana. Los ServiceMonitors se crean automáticamente cuando `monitoring.serviceMonitor.enabled` está establecido en `true`.

## CI/CD

La aplicación utiliza GitHub Actions para CI/CD. El flujo de trabajo está definido en `.github/workflows/ci-cd.yaml` y se encarga de:

1. Construir y probar la aplicación
2. Construir y publicar imágenes Docker
3. Desplegar la aplicación en AKS usando Helm

## Solución de problemas

Para verificar el estado de los pods:

```bash
kubectl get pods -n pokecare
```

Para ver los logs de un servicio específico:

```bash
kubectl logs -l app=pokecare,component=frontend -n pokecare
```

Para acceder a la aplicación localmente:

```bash
kubectl port-forward svc/pokecare-frontend 8080:80 -n pokecare
```

Luego, visite http://localhost:8080 en su navegador.