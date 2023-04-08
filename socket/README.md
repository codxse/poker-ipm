### Prepare Database for Testing

```
CREATE DATABASE sockettest;
CREATE USER sockettest WITH ENCRYPTED PASSWORD 'sockettest';
GRANT ALL PRIVILEGES ON DATABASE sockettest TO sockettest;
GRANT ALL ON SCHEMA public TO sockettest;
ALTER DATABASE sockettest OWNER TO sockettest;
```