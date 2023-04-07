import { DataSource } from 'typeorm'
import config from '@app/typeorm.config';

export async function createTestingConnections(): Promise<DataSource[]> {
  const connection = await config.initialize()
  return [connection];
}

export async function closeTestingConnections(connections: DataSource[]): Promise<void> {
  await Promise.all(connections.map((connection) => connection.destroy()));
}