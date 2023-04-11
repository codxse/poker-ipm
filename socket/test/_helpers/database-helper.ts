import { createTestingConnections, closeTestingConnections } from './testing'

export async function createDb() {
  const [connection] = await createTestingConnections()
  const queryRunner = connection.createQueryRunner()
  await queryRunner.query(
    `
    CREATE DATABASE socket_dev;
    CREATE USER socket_dev WITH ENCRYPTED PASSWORD 'socket_dev';
    GRANT ALL PRIVILEGES ON DATABASE socket_dev TO socket_dev;
    GRANT ALL ON SCHEMA public TO socket_dev;
    ALTER DATABASE socket_dev OWNER TO socket_dev;

    CREATE DATABASE socket_test;
    CREATE USER socket_test WITH ENCRYPTED PASSWORD 'socket_test';
    GRANT ALL PRIVILEGES ON DATABASE socket_test TO socket_test;
    GRANT ALL ON SCHEMA public TO socket_test;
    ALTER DATABASE socket_test OWNER TO socket_test;
    `,
  )

  await closeTestingConnections([connection])
}

createDb()
  .then(() => {
    console.info('socket_dev, socket_test db created!')
  })
  .catch((err) => {
    console.error(err)
  })
