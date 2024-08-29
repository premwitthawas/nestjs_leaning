import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

export class EnvironmentValiables {
  @IsEnum(Environment)
  NODE_ENV: Environment;
  @IsString()
  POSTGRES_DB: string;
  @IsString()
  POSTGRES_PASSWORD: string;
  @IsString()
  POSTGRES_USER: string;
  @IsString()
  POSTGRES_HOST: string;
  @IsNumber()
  POSTGRES_PORT: number;
  @IsString()
  SECRET_JWT: string;
  @IsNumber()
  APP_PORT: number;
}

export const validate = (config: Record<string, unknown>) => {
  const validateConfig = plainToInstance(EnvironmentValiables, config, {
    enableImplicitConversion: true,
  });
  const error = validateSync(validateConfig, { skipMissingProperties: false });

  if (error.length > 0) {
    throw new Error(error.toString());
  }

  return validateConfig;
};
