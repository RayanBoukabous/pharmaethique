from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée :
    - Lecture autorisée pour tous
    - Écriture uniquement pour les administrateurs
    """
    
    def has_permission(self, request, view):
        # Lecture autorisée pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Écriture uniquement pour les utilisateurs authentifiés et administrateurs
        return request.user and request.user.is_staff


