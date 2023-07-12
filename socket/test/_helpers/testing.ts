import { DataSource } from 'typeorm'
import config from '@app/typeorm.config'
import { JwtService } from '@nestjs/jwt'

export async function createTestingConnections(): Promise<DataSource[]> {
  const connection = await config.initialize()
  return [connection]
}

export async function closeTestingConnections(
  connections: DataSource[],
): Promise<void> {
  await Promise.all(connections.map((connection) => connection.destroy()))
}

export function generateTestJwtToken(payload): string {
  const jwtService = new JwtService()
  return jwtService.sign(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: 3600,
    algorithm: 'HS512',
  })
}
