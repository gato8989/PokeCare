#!/bin/bash
# Script de verificación para la implementación de PokeCare en Kubernetes

echo "=== Verificación de la implementación de PokeCare en Kubernetes ==="
echo "Fecha: $(date)"
echo ""

# Colores para mejor legibilidad
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
NC="\033[0m" # No Color

# Función para verificar el resultado de un comando
check_result() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ ÉXITO${NC}: $1"
  else
    echo -e "${RED}✗ ERROR${NC}: $1"
    ERRORS=$((ERRORS+1))
  fi
}

# Inicializar contador de errores
ERRORS=0

echo -e "${YELLOW}1. Verificando conexión al clúster de Kubernetes...${NC}"
kubectl get nodes
check_result "Conexión al clúster de Kubernetes"
echo ""

echo -e "${YELLOW}2. Verificando namespace de la aplicación...${NC}"
kubectl get namespace pokecare
check_result "Namespace pokecare existe"
echo ""

echo -e "${YELLOW}3. Verificando deployments de PokeCare...${NC}"
kubectl get deployments -n pokecare
check_result "Deployments de PokeCare"
echo ""

echo -e "${YELLOW}4. Verificando servicios de PokeCare...${NC}"
kubectl get services -n pokecare
check_result "Servicios de PokeCare"
echo ""

echo -e "${YELLOW}5. Verificando pods en ejecución...${NC}"
kubectl get pods -n pokecare
check_result "Pods de PokeCare en ejecución"
echo ""

echo -e "${YELLOW}6. Verificando Helm releases...${NC}"
helm list -n pokecare
check_result "Helm releases de PokeCare"
echo ""

echo -e "${YELLOW}7. Verificando estado de Prometheus...${NC}"
kubectl get pods -n monitoring -l app=prometheus
check_result "Pods de Prometheus"
echo ""

echo -e "${YELLOW}8. Verificando estado de Grafana...${NC}"
kubectl get pods -n monitoring -l app=grafana
check_result "Pods de Grafana"
echo ""

echo -e "${YELLOW}9. Verificando endpoints de servicios...${NC}"
kubectl get endpoints -n pokecare
check_result "Endpoints de servicios"
echo ""

echo -e "${YELLOW}10. Verificando logs del servicio de Pokémon...${NC}"
POKEMON_POD=$(kubectl get pods -n pokecare -l component=pokemon-service -o jsonpath='{.items[0].metadata.name}')
kubectl logs $POKEMON_POD -n pokecare --tail=10
check_result "Logs del servicio de Pokémon"
echo ""

echo -e "${YELLOW}11. Verificando métricas de Prometheus...${NC}"
PROM_POD=$(kubectl get pods -n monitoring -l app=prometheus -o jsonpath='{.items[0].metadata.name}')
kubectl port-forward $PROM_POD 9090:9090 -n monitoring &
PORT_FWD_PID=$!
sleep 5
curl -s http://localhost:9090/api/v1/targets | grep -q "pokemon-service"
check_result "Métricas de Prometheus para el servicio de Pokémon"
kill $PORT_FWD_PID
echo ""

echo -e "${YELLOW}12. Verificando configuración de HPA...${NC}"
kubectl get hpa -n pokecare
check_result "Configuración de HPA"
echo ""

echo -e "${YELLOW}13. Verificando secretos...${NC}"
kubectl get secrets -n pokecare
check_result "Secretos de la aplicación"
echo ""

echo -e "${YELLOW}14. Verificando configmaps...${NC}"
kubectl get configmaps -n pokecare
check_result "ConfigMaps de la aplicación"
echo ""

echo -e "${YELLOW}15. Verificando ingress...${NC}"
kubectl get ingress -n pokecare
check_result "Ingress de la aplicación"
echo ""

# Resumen final
echo "=== Resumen de la verificación ==="
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ Todos los componentes verificados correctamente.${NC}"
  echo -e "La implementación de PokeCare en Kubernetes está funcionando según lo esperado."
else
  echo -e "${RED}✗ Se encontraron $ERRORS errores durante la verificación.${NC}"
  echo -e "Revise los mensajes de error anteriores para solucionar los problemas."
fi

echo ""
echo "Para acceder a los dashboards de monitoreo:"
echo "1. Prometheus: kubectl port-forward svc/prometheus-server -n monitoring 9090:80"
echo "2. Grafana: kubectl port-forward svc/grafana -n monitoring 3000:80"
echo "   Usuario predeterminado: admin"
echo "   Contraseña: consulte el secreto con: kubectl get secret grafana -n monitoring -o jsonpath='{.data.admin-password}' | base64 --decode"
echo ""
echo "Para acceder a la aplicación:"
echo "kubectl port-forward svc/pokecare-frontend -n pokecare 8080:80"
echo "Luego abra http://localhost:8080 en su navegador"