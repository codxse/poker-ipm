import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { config as loadEnvConfig } from 'dotenv';

const currentEnvironment = process.env.NODE_ENV || 'development'
loadEnvConfig({ path: path.join(__dirname, '..', `.env.${currentEnvironment}`) })

export const configOption: DataSourceOptions = {
  type: process.env.TYPEORM_CONNECTION as 'postgres',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '**', '*','./migrations/*.{ts,js}')],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
}

const config = new DataSource(configOption);

export default config;
