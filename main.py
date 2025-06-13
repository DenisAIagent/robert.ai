cat > main.py << 'EOF'
import os
import sys
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.api_keys import api_keys_bp
from src.routes.generator import generator_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')

# Activer CORS pour toutes les routes
CORS(app, origins=['*'])

# Enregistrer les blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(api_keys_bp, url_prefix='/api')
app.register_blueprint(generator_bp, url_prefix='/api')

# Configuration de la base de données
database_path = os.path.join(os.path.dirname(__file__), 'database', 'app.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{database_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiser la base de données
db.init_app(app)
with app.app_context():
    # Créer le répertoire database s'il n'existe pas
    os.makedirs(os.path.dirname(database_path), exist_ok=True)
    db.create_all()

# Route de santé pour vérifier que l'API fonctionne
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'DevCraft AI Backend opérationnel',
        'version': '2.0.0',
        'timestamp': '2024-12-10T12:00:00Z',
        'environment': os.getenv('RAILWAY_ENVIRONMENT', 'development')
    })

# Route pour servir le frontend build
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # En production, servir les fichiers build de React
    dist_folder = os.path.join(os.path.dirname(__file__), 'dist')
    
    if os.path.exists(dist_folder):
        if path != "" and os.path.exists(os.path.join(dist_folder, path)):
            return send_from_directory(dist_folder, path)
        else:
            return send_from_directory(dist_folder, 'index.html')
    else:
        # En développement, rediriger vers le frontend React
        return jsonify({
            'message': 'DevCraft AI Backend',
            'frontend_dev': 'http://localhost:5173',
            'api': '/api',
            'health': '/api/health'
        })

if __name__ == '__main__':
    # Railway fournit la variable PORT
    port = int(os.getenv('PORT', 5002))
    
    # Environnement de production ou développement
    is_production = os.getenv('RAILWAY_ENVIRONMENT') == 'production'
    
    print("🚀 Démarrage de DevCraft AI Backend...")
    print(f"📡 API disponible sur: http://0.0.0.0:{port}/api")
    print(f"🔍 Health check: http://0.0.0.0:{port}/api/health")
    
    if not is_production:
        print("🎨 Frontend React: http://localhost:5173")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=not is_production
    )
EOF
