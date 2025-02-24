# Filmothèque 

## Installation

### Cloner le dépôt

```bash
git clone https://github.com/LoganFerreira/nodeJs.git
```
### Installation les dépendances

```bash
npm i
```

### Installation des conteneurs dockers
```bash
docker run --name hapi-mysql -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -p 3307:3306 -d mysql:8.0
```

```bash
docker run --name rabbitmq -p 15672:15672 -p 5672:5672 -d rabbitmq:management
```
### Configuration du .env

```
# Port pour le serveur (par défaut 3000)
PORT=3000

# Configuration de la base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=hapi
DB_NAME=user

# Configuration du serveur de mails (exemple avec Ethereal)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=(utilisateur ethereal)
EMAIL_PASS=(mot de passe du compte ethereal)
```

### Lancement du serveur

```bash
npm start
```

### Précision
Pour faire fonctionner les routes Films, l'utilsateur doit être un "admin", pour se faire une route permet d'assigner le rôle à un utilisateur. Pour que le changement soit effectif, il est nécessaire de se login et de s'authentifier une nouvelle fois 

