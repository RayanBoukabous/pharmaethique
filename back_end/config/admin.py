from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse


# Personnalisation du site admin
admin.site.site_header = "Pharma Ethique - Administration"
admin.site.site_title = "Pharma Ethique Admin"
admin.site.index_title = "Panneau d'administration"

# Personnalisation de l'interface
admin.site.site_url = "/"
admin.site.empty_value_display = '-'


