#!/bin/bash

# DevCraft AI - Script de déploiement automatisé
# Usage: ./deploy.sh [local|production]

set -e  # Arrêter en cas d'erreur

ENVIRONMENT=${1:-local}
PROJECT_NAME="DevCraft AI"

echo "🚀 Déploiement de $PROJECT_NAME - Mode: $ENVIRONMENT"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier les prérequis
check_requirements() {
    log_info "Vérification des prérequis..."
    
    # Vérifier Python
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 n'est pas installé"
        exit 1
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    log_success "Tous les prérequis sont satisfaits"
}

# Nettoyer les anciennes installations
cleanup() {
    log_info "Nettoyage des anciennes installations..."
    
    # Nettoyer les caches Python
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    find . -name "*.pyc" -delete 2>/dev/null || true
    
    # Nettoyer les dossiers de build
    rm -rf dist/ build/ .vite/ 2>/dev/null || true
    
    log_success "Nettoyage terminé"
}

# Installer les dépendances Python
install_python_deps() {
    log_info "Installation des dépendances Python..."
    
    # Créer un environnement virtuel si nécessaire (développement local)
    if [ "$ENVIRONMENT" = "local" ] && [ ! -d "venv" ]; then
        log_info "Création de l'environnement virtuel..."
        python3 -m venv venv
        source venv/bin/activate
    elif [ "$ENVIRONMENT" = "local" ]; then
        source venv/bin/activate
    fi
    
    # Mettre à jour pip
    pip install --upgrade pip
    
    # Installer les dépendances
    pip install -r requirements.txt
    
    log_success "Dépendances Python installées"
}

# Installer les dépendances Node.js
install_node_deps() {
    log_info "Installation des dépendances Node.js..."
    
    # Utiliser npm ci pour une installation plus rapide et déterministe
    if [ -f "package-lock.json" ]; then
        npm ci --legacy-peer-deps
    else
        npm install --legacy-peer-deps
    fi
    
    log_success "Dépendances Node.js installées"
}

# Builder le frontend
build_frontend() {
    log_info "Construction du frontend..."
    
    # Vérifier que le frontend existe
    if [ ! -f "package.json" ]; then
        log_error "package.json non trouvé"
        exit 1
    fi
    
    # Builder avec Vite
    npm run build
    
    # Vérifier que le build a réussi
    if [ ! -d "dist" ]; then
        log_error "Le build du frontend a échoué"
        exit 1
    fi
    
    log_success "Frontend construit avec succès"
}

# Tester l'application
test_app() {
    log_info "Tests de l'application..."
    
    # Tests Python (si disponibles)
    if [ -f "pytest.ini" ] || [ -d "tests" ]; then
        log_info "Exécution des tests Python..."
        python -m pytest --tb=short
    fi
    
    # Tests Node.js (si disponibles)
    if grep -q "test" package.json; then
        log_info "Exécution des tests Node.js..."
        npm test -- --passWithNoTests
    fi
    
    log_success "Tests réussis"
}

# Démarrer l'application
start_app() {
    log_info "Démarrage de l'application..."
    
    if [ "$ENVIRONMENT" = "local" ]; then
        log_info "Mode développement - Démarrage sur http://localhost:8000"
        if [ -d "venv" ]; then
            source venv/bin/activate
        fi
        python main.py
    else
        log_info "Mode production"
        python main.py
    fi
}

# Vérifier la santé de l'application
health_check() {
    log_info "Vérification de la santé de l'application..."
    
    # Attendre que l'application démarre
    sleep 5
    
    # Tester l'endpoint de santé
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        log_success "Application en cours d'exécution et saine"
    else
        log_warning "Impossible de vérifier la santé de l'application"
    fi
}

# Fonction principale
main() {
    log_info "Début du déploiement de $PROJECT_NAME"
    
    check_requirements
    cleanup
    install_python_deps
    install_node_deps
    build_frontend
    
    if [ "$ENVIRONMENT" = "production" ]; then
        test_app
    fi
    
    log_success "Déploiement terminé avec succès!"
    
    if [ "$ENVIRONMENT" = "local" ]; then
        log_info "Pour démarrer l'application: python main.py"
        log_info "API disponible sur: http://localhost:8000/api"
        log_info "Documentation: http://localhost:8000/api/docs"
    fi
}

# Gestion des signaux
trap 'log_error "Déploiement interrompu"; exit 1' INT TERM

# Exécution
main "$@"