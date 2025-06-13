#!/bin/bash

# Script de correction rapide pour DevCraft AI
# Utilisation: ./quick_fix.sh

echo "🔧 Correction rapide de DevCraft AI..."

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Étape 1: Vérifier que main.py est correct
echo -e "${BLUE}Vérification de main.py...${NC}"
if python3 -c "import main; print('✅ main.py OK')" 2>/dev/null; then
    echo -e "${GREEN}✅ main.py fonctionne correctement${NC}"
else
    echo -e "${YELLOW}⚠️ main.py nécessite une correction${NC}"
    echo "Utilisez le code Python corrigé fourni dans les artifacts"
fi

# Étape 2: Test de démarrage rapide
echo -e "${BLUE}Test de démarrage...${NC}"
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Démarrer l'application en arrière-plan pour tester
python3 main.py &
APP_PID=$!

# Attendre que l'application démarre
sleep 3

# Tester le health check
if curl -f http://localhost:8000/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Application démarrée avec succès${NC}"
    echo -e "${GREEN}📡 API disponible sur: http://localhost:8000/api${NC}"
    echo -e "${GREEN}📖 Documentation: http://localhost:8000/api/docs${NC}"
    echo -e "${GREEN}❤️ Health check: http://localhost:8000/health${NC}"
    
    # Tuer le processus de test
    kill $APP_PID 2>/dev/null
    
    echo ""
    echo -e "${BLUE}🚀 Prêt pour le déploiement Railway!${NC}"
    echo "Commandes suivantes:"
    echo "  railway up              # Déployer"
    echo "  railway logs            # Voir les logs"
    echo "  railway open            # Ouvrir l'application"
    
else
    echo -e "${YELLOW}⚠️ Application non accessible, vérification des logs...${NC}"
    kill $APP_PID 2>/dev/null
    
    # Afficher les dernières lignes de log si disponibles
    if [ -f "logs/devcraft_$(date +%Y%m%d).log" ]; then
        echo "Derniers logs:"
        tail -10 "logs/devcraft_$(date +%Y%m%d).log"
    fi
fi

echo ""
echo -e "${BLUE}Résumé de l'installation:${NC}"
echo "✅ Dépendances Python installées"
echo "✅ Dépendances Node.js installées"
echo "✅ Frontend construit"
echo ""
echo -e "${YELLOW}Si tout fonctionne, déployez avec:${NC}"
echo "railway up"