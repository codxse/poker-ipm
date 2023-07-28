## Setup Docker
```
./bin/docker/build

## or
DOCKER_BUILDKIT=1 docker pull node:lts-alpine3.17
DOCKER_BUILDKIT=1 docker build -f Dockerfile.base . -t poker.ipm/base:latest
DOCKER_BUILDKIT=1 docker build -f Dockerfile.socket . -t poker.ipm/socket:latest
```

## Running Docker
```
docker compose run -d --rm --service-ports backend
docker compose exec backend bash 
```

## Enter Postgres
```
psql -U postgres -h postgres 
```

## Shutdown Docker
```
docker compose down
```

## Force Shutdown
Warning, this will terminate all the running docker
```
docker kill $(docker ps -q)   
```

### Prepare Database for Testing

```
CREATE DATABASE socket_test;
CREATE USER socket_test WITH ENCRYPTED PASSWORD 'socket_test';
GRANT ALL PRIVILEGES ON DATABASE socket_test TO socket_test;
GRANT ALL ON SCHEMA public TO socket_test;
ALTER DATABASE socket_test OWNER TO socket_test;
```

### Prepare Database for Development

```
CREATE DATABASE socket_dev;
CREATE USER socket_dev WITH ENCRYPTED PASSWORD 'socket_dev';
GRANT ALL PRIVILEGES ON DATABASE socket_dev TO socket_dev;
GRANT ALL ON SCHEMA public TO socket_dev;
ALTER DATABASE socket_dev OWNER TO socket_dev;
```

### Setup Env
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
POSTGRES_HOST_AUTH_METHOD=trust
NODE_PATH=/node_module
TYPEORM_CONNECTION=postgres
TYPEORM_HOST=postgres
TYPEORM_PORT=5432
TYPEORM_SYNCHRONIZE=false
JWT_SECRET=jwt_secret
GOOGLE_CLIENT_ID=myappid.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=MyGoogleScreet
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```