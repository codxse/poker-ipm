CREATE TABLE users (
    id        SERIAL PRIMARY KEY,
    firstName VARCHAR(20),
    lastName  VARCHAR(20),
    email     VARCHAR(128) UNIQUE
);