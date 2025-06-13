# 🚨 Guide de Résolution des Problèmes - DevCraft AI

## 🔧 Actions Immédiates

### 1. Erreur `NameError: name 'cat' is not defined`
**Cause :** Le fichier `main.py` contient du code bash au lieu de Python.

**Solution :**
```bash
# Remplacer main.py par le code Python corrigé
cp main_corrected.py main.py
```

### 2. Erreur de déploiement Railway
**Cause :** Configuration incorrecte ou dépendances manquantes.

**Solutions :**
```bash
# 1. Vérifier la configuration Railway
railway logs

# 2. Redéployer avec la nouvelle configuration
railway up

# 3. Vérifier les variables d'environnement
railway variables
```

## 🐛 Diagnostics Courants

### Problèmes de Build

#### Frontend ne se build pas
```bash
# Vérifier les dépendances
npm install --legacy-peer-deps

# Nettoyer le cache
npm run build -- --force

# Vérifier la configuration Vite
cat vite.config.ts
```

#### Backend ne démarre pas
```bash
# Vérifier les dépendances Python
pip install -r requirements.txt

# Tester le serveur localement
python main.py

# Vérifier les imports
python -c "from api.server import app; print('OK')"
```

### Problèmes de Communication Frontend/Backend

#### CORS Errors
```python
# Dans main.py, vérifier la configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### API Non Accessible
```bash
# Vérifier l'URL de l'API
echo $VITE_API_URL

# Tester l'endpoint de santé
curl http://localhost:8000/health
```

## 🔍 Tests de Diagnostic

### Test Complet du Système
```bash
#!/bin/bash
echo "=== Diagnostic DevCraft AI ==="

# 1. Vérifier Python
python3 --version || echo "❌ Python non installé"

# 2. Vérifier Node.js
node --version || echo "❌ Node.js non installé"

# 3. Vérifier les fichiers critiques
[ -f main.py ] && echo "✅ main.py exists" || echo "❌ main.py missing"
[ -f requirements.txt ] && echo "✅ requirements.txt exists" || echo "❌ requirements.txt missing"
[ -f package.json ] && echo "✅ package.json exists" || echo "❌ package.json missing"

# 4. Tester les imports Python
python3 -c "
try:
    from fastapi import FastAPI
    print('✅ FastAPI OK')
except ImportError:
    print('❌ FastAPI manquant')

try:
    import uvicorn
    print('✅ Uvicorn OK')
except ImportError:
    print('❌ Uvicorn manquant')
"

# 5. Vérifier la structure
echo "=== Structure du projet ==="
tree -L 2 -I 'node_modules|__pycache__|.git|dist|venv'
```

### Test des Endpoints
```python
import requests
import json

def test_api_endpoints():
    base_url = "http://localhost:8000"
    
    # Test health check
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✅ Health check: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"❌ Health check failed: {e}")
    
    # Test API analyze
    try:
        data = {
            "description": "Test project",
            "features": ["test"]
        }
        response = requests.post(f"{base_url}/api/analyze", json=data)
        print(f"✅ API analyze: {response.status_code}")
    except Exception as e:
        print(f"❌ API analyze failed: {e}")

if __name__ == "__main__":
    test_api_endpoints()
```

## 🛠️ Actions Préventives

### 1. Monitoring Continu
```python
# healthcheck.py
import requests
import time
import os

def monitor_health():
    url = os.getenv("HEALTH_URL", "http://localhost:8000/health")
    
    while True:
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                print(f"✅ {time.ctime()} - Service healthy")
            else:
                print(f"⚠️ {time.ctime()} - Service unhealthy: {response.status_code}")
        except Exception as e:
            print(f"❌ {time.ctime()} - Service down: {e}")
        
        time.sleep(60)  # Vérifier chaque minute

if __name__ == "__main__":
    monitor_health()
```

### 2. Validation des Déploiements
```bash
# validate_deployment.sh
#!/bin/bash

echo "🔍 Validation du déploiement..."

# Vérifier que tous les fichiers critiques existent
CRITICAL_FILES=("main.py" "requirements.txt" "package.json" "railway.json")

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file MANQUANT!"
        exit 1
    fi
done

# Vérifier la syntaxe Python
python3 -m py_compile main.py && echo "✅ main.py syntaxe OK" || echo "❌ Erreur syntaxe main.py"

# Vérifier la configuration JSON
python3 -c "import json; json.load(open('railway.json'))" && echo "✅ railway.json valide" || echo "❌ railway.json invalide"

echo "✅ Validation terminée"
```

## 📞 Support et Resources

### Commandes d'Urgence
```bash
# Rollback rapide
git checkout HEAD~1 main.py

# Restart service Railway
railway service restart

# Logs en temps réel
railway logs --tail

# Variables d'environnement
railway variables set RAILWAY_ENVIRONMENT=production
```

### Contacts et Documentation
- **Railway Docs :** https://docs.railway.app
- **FastAPI Docs :** https://fastapi.tiangolo.com
- **React Docs :** https://react.dev

### Checklist de Déploiement
- [ ] `main.py` contient du Python (pas de bash)
- [ ] `requirements.txt` à jour avec FastAPI
- [ ] `railway.json` configure correctement
- [ ] Variables d'environnement définies
- [ ] Frontend build sans erreurs
- [ ] Tests passent
- [ ] Health check fonctionne