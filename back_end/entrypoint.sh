#!/bin/bash

set -e

echo "⏳ Attente de la base de données..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "✅ Base de données prête!"

echo "🔄 Application des migrations..."
python manage.py migrate --noinput

echo "📦 Collecte des fichiers statiques..."
python manage.py collectstatic --noinput || true

echo "👤 Création/Réinitialisation du superutilisateur..."
python manage.py shell << 'PYTHON_SCRIPT'
from django.contrib.auth import get_user_model
import os

User = get_user_model()

username = "pharmaethique"
email = "admin@pharmaethique.com"
password = "pharmaethique2026/"

try:
    # Vérifier si l'utilisateur existe déjà
    if User.objects.filter(username=username).exists():
        print(f"⚠️  L'utilisateur '{username}' existe déjà. Réinitialisation...")
        user = User.objects.get(username=username)
        user.set_password(password)
        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save()
        print(f"✅ Superutilisateur '{username}' réinitialisé avec succès!")
    else:
        print(f"🆕 Création du superutilisateur '{username}'...")
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        print(f"✅ Superutilisateur '{username}' créé avec succès!")
except Exception as e:
    print(f"⚠️  Erreur lors de la création/réinitialisation du superutilisateur: {e}")
    print("   Le container continuera à démarrer, mais vous devrez créer le superuser manuellement.")
PYTHON_SCRIPT

echo "🚀 Démarrage du serveur..."
exec "$@"
