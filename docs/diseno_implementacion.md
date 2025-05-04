# Diseño e Implementación de PokeCare con Kubernetes, Helm y Monitoreo

## 1. Arquitectura de Microservicios

La aplicación PokeCare ha sido transformada de una aplicación monolítica React+Vite a una arquitectura de microservicios, compuesta por los siguientes componentes:

### 1.1 Componentes Principales

- **Frontend**: Interfaz de usuario desarrollada con React y Vite
- **API Gateway**: Punto de entrada único para todas las solicitudes de clientes
- **Servicio de Pokémon**: Gestiona los datos de Pokémon y se comunica con la PokeAPI
- **Servicio de Guardería**: Administra la información de los Pokémon en la guardería
- **Servicio de Usuario**: Gestiona la autenticación y los perfiles de usuario

### 1.2 Diagrama de Arquitectura

```
+----------------+     +----------------+     +----------------+
|                |     |                |     |                |
|    Frontend    |---->|  API Gateway   |---->| Pokémon Service|
|                |     |                |     |                |
+----------------+     +----------------+     +----------------+
                                |                     |
                                v                     v
                       +----------------+    +----------------+
                       |                |    |                |
                       |Daycare Service |    |  User Service  |
                       |                |    |                |
                       +----------------+    +----------------+
                                |                     |
                                v                     v
                       +----------------+    +----------------+
                       |                |    |                |
                       |    MongoDB     |    |     Redis      |
                       |                |    |                |
                       +----------------+    +----------------+
```

## 2. Implementación en Kubernetes

### 2.1 Clúster de Kubernetes

Se ha seleccionado Azure Kubernetes Service (AKS) como plataforma para el despliegue, con las siguientes características:

- **Región**: East US
- **Versión de Kubernetes**: 1.25.5
- **Nodos**: 3 nodos (Standard_DS2_v2)
- **Autoscaling**: Habilitado (2-5 nodos)

### 2.2 Recursos de Kubernetes

Cada microservicio se implementa como un Deployment independiente con su correspondiente Service:

- **Deployments**: Garantizan alta disponibilidad con múltiples réplicas
- **Services**: Proporcionan descubrimiento de servicios y balanceo de carga
- **ConfigMaps**: Almacenan configuración no sensible
- **Secrets**: Almacenan información sensible (credenciales de bases de datos)
- **HorizontalPodAutoscalers**: Escalan automáticamente los pods según la carga

### 2.3 Configuración de Red

- **Ingress Controller**: NGINX Ingress Controller para enrutar el tráfico externo
- **Network Policies**: Restringen la comunicación entre pods para mayor seguridad

## 3. Empaquetado con Helm

### 3.1 Estructura del Chart

Se ha creado un Helm Chart principal (`pokecare`) que incluye todos los componentes de la aplicación:

```
pokecare/
├── Chart.yaml           # Metadatos del chart
├── values.yaml          # Valores predeterminados
├── values-production.yaml # Valores para producción
└── templates/
    ├── frontend.yaml    # Plantillas para el frontend
    ├── api-gateway.yaml # Plantillas para el API Gateway
    ├── pokemon-service.yaml # Plantillas para el servicio de Pokémon
    ├── daycare-service.yaml # Plantillas para el servicio de guardería
    ├── user-service.yaml # Plantillas para el servicio de usuario
    ├── ingress.yaml     # Configuración de Ingress
    └── _helpers.tpl     # Funciones auxiliares
```

### 3.2 Dependencias

El chart principal depende de charts de terceros para servicios de infraestructura:

- **MongoDB**: Bitnami MongoDB chart para almacenamiento persistente
- **Redis**: Bitnami Redis chart para caché y mensajería

### 3.3 Gestión de Versiones

Cada versión de la aplicación se empaqueta como una nueva versión del Helm Chart, siguiendo el versionado semántico (SemVer).

## 4. CI/CD con GitHub Actions

### 4.1 Flujo de Trabajo

Se ha implementado un pipeline de CI/CD completo utilizando GitHub Actions:

1. **Construcción**: Compilación de código y pruebas unitarias
2. **Empaquetado**: Creación de imágenes Docker y publicación en Azure Container Registry
3. **Despliegue**: Actualización de la aplicación en el clúster AKS mediante Helm

### 4.2 Entornos

Se han configurado múltiples entornos para el ciclo de vida de la aplicación:

- **Desarrollo**: Para pruebas durante el desarrollo (rama `develop`)
- **Staging**: Para pruebas de integración (etiquetas `rc-*`)
- **Producción**: Entorno de producción (rama `main` o etiquetas `v*`)

## 5. Monitoreo con Prometheus y Grafana

### 5.1 Recopilación de Métricas

Prometheus se utiliza para recopilar métricas de todos los componentes:

- **Métricas del Sistema**: CPU, memoria, disco, red
- **Métricas de Kubernetes**: Estado de pods, nodos, deployments
- **Métricas de Aplicación**: Latencia de API, tasas de error, solicitudes por segundo

### 5.2 Visualización con Grafana

Se han creado dashboards personalizados en Grafana para visualizar:

- **Estado General**: Vista general del sistema
- **Rendimiento de Microservicios**: Métricas específicas de cada servicio
- **Experiencia de Usuario**: Tiempos de respuesta y disponibilidad

### 5.3 Alertas

Se han configurado alertas para notificar sobre problemas potenciales:

- **Alta Utilización de Recursos**: CPU > 80%, memoria > 85%
- **Latencia Elevada**: Tiempo de respuesta > 2s
- **Errores**: Tasa de error > 5%

## 6. Verificación y Pruebas

### 6.1 Pruebas de Carga

Se han realizado pruebas de carga utilizando k6 para verificar el rendimiento y la escalabilidad:

- **Usuarios Concurrentes**: Hasta 1000 usuarios simultáneos
- **Tiempo de Respuesta**: < 500ms en el percentil 95
- **Throughput**: > 100 solicitudes por segundo

### 6.2 Pruebas de Resiliencia

Se han realizado pruebas de caos para verificar la resiliencia del sistema:

- **Eliminación de Pods**: El sistema se recupera automáticamente
- **Degradación de Red**: La aplicación continúa funcionando con latencia aumentada
- **Fallo de Nodo**: Los servicios se reubican en otros nodos sin interrupción

## 7. Seguridad

### 7.1 Políticas de Seguridad

- **Pod Security Policies**: Restringen los privilegios de los contenedores
- **Network Policies**: Limitan la comunicación entre servicios
- **RBAC**: Control de acceso basado en roles para la administración

### 7.2 Gestión de Secretos

- **Kubernetes Secrets**: Almacenan credenciales y tokens
- **Azure Key Vault**: Integración para secretos más sensibles

## 8. Conclusiones y Recomendaciones

### 8.1 Beneficios Obtenidos

- **Escalabilidad**: Capacidad para manejar picos de tráfico
- **Resiliencia**: Alta disponibilidad y recuperación automática
- **Observabilidad**: Monitoreo completo y detección temprana de problemas

### 8.2 Próximos Pasos

- **Service Mesh**: Implementar Istio para gestión avanzada de tráfico
- **Canary Deployments**: Implementar despliegues graduales
- **Machine Learning**: Incorporar recomendaciones personalizadas de Pokémon