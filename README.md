# Créer une note
curl -X POST http://localhost:3000/api/notes \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Projet NodeJS","content":"Apprendre les 100 projets","tags":["nodejs","learning"]}'

# Lister toutes les notes
curl http://localhost:3000/api/notes

# Rechercher
curl "http://localhost:3000/api/notes?search=nodejs"

# Filtrer par tag
curl "http://localhost:3000/api/notes?tag=learning"

# Récupérer par ID
curl http://localhost:3000/api/notes/{id}

# Modifier
curl -X PUT http://localhost:3000/api/notes/{id} \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Titre modifié"}'

# Épingler
curl -X PATCH http://localhost:3000/api/notes/{id}/pin

# Supprimer
curl -X DELETE http://localhost:3000/api/notes/{id}

# Validation — doit retourner 400
curl -X POST http://localhost:3000/api/notes \\
  -H "Content-Type: application/json" \\
  -d '{"title":""}'