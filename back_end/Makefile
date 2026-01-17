.PHONY: help build up down logs shell migrate makemigrations createsuperuser test clean cleanup

help: ## Affiche cette aide
	@echo "Commandes disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Construire les images Docker
	docker-compose build

up: ## Démarrer les conteneurs
	docker-compose up -d

down: ## Arrêter les conteneurs
	docker-compose down

logs: ## Afficher les logs
	docker-compose logs -f

shell: ## Ouvrir un shell dans le conteneur web
	docker-compose exec web bash

migrate: ## Appliquer les migrations
	docker-compose exec web python manage.py migrate

makemigrations: ## Créer les migrations
	docker-compose exec web python manage.py makemigrations

createsuperuser: ## Créer un superutilisateur (admin/admin)
	./create_superuser.sh

test: ## Lancer les tests
	docker-compose exec web python manage.py test

clean: ## Nettoyer les volumes et conteneurs
	docker-compose down -v
	docker system prune -f

restart: ## Redémarrer les conteneurs
	docker-compose restart

recreate: ## Recréer les containers avec la nouvelle configuration (garde les données)
	./recreate_containers.sh

cleanup: ## Nettoyer les conteneurs Docker orphelins (back_end, backend, xdocker)
	./cleanup_containers.sh

backup: ## Créer un backup de la base de données
	./backup_db.sh

restore: ## Restaurer la base de données (usage: make restore BACKUP=backups/fichier.sql.gz)
	@if [ -z "$(BACKUP)" ]; then \
		echo "❌ Erreur: Veuillez spécifier un fichier de backup"; \
		echo "💡 Usage: make restore BACKUP=backups/pharma_ethique_backup_20240101_120000.sql.gz"; \
		exit 1; \
	fi
	./restore_db.sh $(BACKUP)

db-shell: ## Ouvrir un shell PostgreSQL
	docker-compose exec db psql -U postgres -d pharma_ethique_db

db-logs: ## Afficher les logs de la base de données
	docker-compose logs -f db

volumes: ## Lister les volumes Docker
	docker volume ls | grep pharma_ethique

volumes-inspect: ## Inspecter les volumes (pour voir où sont stockées les données)
	docker volume inspect pharma_ethique_postgres_data


