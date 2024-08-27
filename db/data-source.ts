import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenv.config({
  path: '.env',
});

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env['POSTGRES_HOST'] as string,
  port: Number(process.env['POSTGRES_PORT'] as string),
  username: process.env['POSTGRES_USER'] as string,
  password: process.env['POSTGRES_PASSWORD'] as string,
  database: process.env['POSTGRES_DB'] as string,
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/db/migrations/*.js'],
};

export const dataSource = new DataSource(dataSourceOptions);
