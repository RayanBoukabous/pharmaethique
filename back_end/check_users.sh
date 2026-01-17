#!/bin/bash

# Script pour vérifier les utilisateurs Django existants
# Usage: ./check_users.sh

set -e

CONTAINER_NAME="pharma_ethique_web"

echo "🔍 Vérification des utilisateurs Django..."

# Vérifier que le container est en cours d'exécution
if ! docker ps | grep -q "${CONTAINER_NAME}"; then
    echo "❌ Erreur: Le container web n'est pas en cours d'exécution"
    echo "💡 Lancez d'abord: docker-compose up -d"
    exit 1
fi

# Lister les utilisateurs
docker exec -i "${CONTAINER_NAME}" python manage.py shell << 'PYTHON_SCRIPT'
from django.contrib.auth import get_user_model
User = get_user_model()

users = User.objects.all()

if users.exists():
    print(f"\n📋 Utilisateurs trouvés ({users.count()}):\n")
    print(f"{'Username':<20} {'Email':<30} {'Staff':<8} {'Superuser':<12} {'Active':<8}")
    print("-" * 80)
    for user in users:
        print(f"{user.username:<20} {str(user.email):<30} {str(user.is_staff):<8} {str(user.is_superuser):<12} {str(user.is_active):<8}")
    
    # Vérifier spécifiquement l'utilisateur admin
    print("\n🔍 Vérification de l'utilisateur 'admin':")
    if User.objects.filter(username='admin').exists():
        admin_user = User.objects.get(username='admin')
        print(f"   ✅ Existe: Oui")
        print(f"   📧 Email: {admin_user.email}")
        print(f"   👔 Staff: {admin_user.is_staff}")
        print(f"   ⭐ Superuser: {admin_user.is_superuser}")
        print(f"   ✅ Active: {admin_user.is_active}")
        
        # Tester le mot de passe
        if admin_user.check_password('admin'):
            print(f"   🔑 Mot de passe 'admin': ✅ Correct")
        else:
            print(f"   🔑 Mot de passe 'admin': ❌ Incorrect")
    else:
        print("   ❌ L'utilisateur 'admin' n'existe pas")
else:
    print("❌ Aucun utilisateur trouvé dans la base de données")
PYTHON_SCRIPT

echo ""
echo "✨ Vérification terminée!"
