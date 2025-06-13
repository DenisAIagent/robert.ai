# =============================================================================
# DevCraft AI - Configuration d'environnement
# =============================================================================

# --- CONFIGURATION BACKEND ---
# Port du serveur (Railway utilise la variable PORT automatiquement)
PORT=8000

# Environnement de déploiement
RAILWAY_ENVIRONMENT=production

# Configuration Python
PYTHONPATH=/app
PYTHONUNBUFFERED=1
PYTHONDONTWRITEBYTECODE=1

# Configuration de logging
LOG_LEVEL=INFO
LOG_FORMAT=json

# --- CONFIGURATION FRONTEND ---
# URL de l'API (automatiquement détectée en production)
VITE_API_URL=http://localhost:8000

# Mode de développement
NODE_ENV=production

# --- CONFIGURATION SÉCURITÉ ---
# Clé secrète pour JWT (à générer en production)
SECRET_KEY=your-secret-key-here

# CORS origins (à adapter selon votre domaine)
CORS_ORIGINS=*

# --- CONFIGURATION OPTIONNELLE ---
# Clés API pour services externes
OPENAI_API_KEY=your-openai-key
GOOGLE_API_KEY=your-google-key
ANTHROPIC_API_KEY=your-anthropic-key

# Configuration base de données (si utilisée)
DATABASE_URL=sqlite:///./devcraft.db

# --- INSTRUCTIONS D'UTILISATION ---
# 1. Copiez ce fichier vers .env
# 2. Modifiez les valeurs selon votre environnement
# 3. Pour Railway, définissez ces variables dans le dashboard
# 4. Pour le développement local, utilisez python-dotenv

# --- VARIABLES RAILWAY AUTOMATIQUES ---
# Ces variables sont automatiquement définies par Railway :
# - PORT : Port d'écoute
# - RAILWAY_ENVIRONMENT : Environnement (production/staging)
# - RAILWAY_PROJECT_ID : ID du projet
# - RAILWAY_SERVICE_ID : ID du service