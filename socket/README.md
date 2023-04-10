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