import { DataSource, DataSourceOptions } from 'typeorm'
import * as path from 'path'
import { config as loadEnvConfig } from 'dotenv'

const currentEnvironment = process.env.NODE_ENV || 'development'
const { parsed: envConfig } = loadEnvConfig({
  path: path.join(__dirname, '..', `.env.${currentEnvironment}`),
})

export const configOption: DataSourceOptions = {
  type: envConfig.TYPEORM_CONNECTION as 'postgres',
  host: envConfig.TYPEORM_HOST,
  port: parseInt(envConfig.TYPEORM_PORT),
  username: envConfig.POSTGRES_USER,
  password: envConfig.POSTGRES_PASSWORD,
  database: envConfig.POSTGRES_DB,
  entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '**', '*', './migrations/*.{ts,js}')],
  synchronize: envConfig.TYPEORM_SYNCHRONIZE === 'true',
  ssl: {
    rejectUnauthorized: envConfig.TYPEORM_SSL_REJECT_UNAUTHORIZED === 'true',
    ca: envConfig.TYPEORM_SSL_CA ? Buffer.from(envConfig.TYPEORM_SSL_CA, 'base64').toString('ascii') : null
  },
}

const config = new DataSource(configOption)

export default config
