#!/bin/bash

# Script pour créer/réinitialiser un superutilisateur Django
# Usage: ./create_superuser.sh

set -e

CONTAINER_NAME="pharma_ethique_web"
USERNAME="admin"
EMAIL="admin@pharmaethique.com"
PASSWORD="admin"

echo "👤 Création/Réinitialisation du superutilisateur..."
echo "   Username: ${USERNAME}"
echo "   Email: ${EMAIL}"
echo "   Password: ${PASSWORD}"

# Vérifier que le container est en cours d'exécution
if ! docker ps | grep -q "${CONTAINER_NAME}"; then
    echo "❌ Erreur: Le container web n'est pas en cours d'exécution"
    echo "💡 Lancez d'abord: docker-compose up -d"
    exit 1
fi

# Créer/réinitialiser le superutilisateur avec Python
docker exec -i "${CONTAINER_NAME}" python manage.py shell << 'PYTHON_SCRIPT'
from django.contrib.auth import get_user_model
import sys

User = get_user_model()

username = "admin"
email = "admin@pharmaethique.com"
password = "admin"

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
        try:
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            print(f"✅ Superutilisateur '{username}' créé avec succès!")
        except Exception as e:
            print(f"❌ Erreur lors de la création: {e}")
            sys.exit(1)
    
    # Vérifier que l'utilisateur existe et peut se connecter
    user = User.objects.get(username=username)
    if user.check_password(password):
        print(f"✅ Vérification: Le mot de passe est correct")
    else:
        print(f"❌ Erreur: Le mot de passe ne correspond pas!")
        sys.exit(1)
    
    print(f"\n📋 Informations de connexion:")
    print(f"   URL: http://localhost:8001/admin/")
    print(f"   Username: {username}")
    print(f"   Password: {password}")
    print(f"\n✅ L'utilisateur est prêt à être utilisé!")
    
except Exception as e:
    print(f"❌ Erreur: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
PYTHON_SCRIPT

if [ $? -eq 0 ]; then
    echo ""
    echo "✨ Terminé avec succès!"
    echo ""
    echo "🔗 Connectez-vous maintenant à: http://localhost:8001/admin/"
else
    echo ""
    echo "❌ Erreur lors de la création du superutilisateur"
    exit 1
fi
