import * as Joi from 'joi';

type EnvironmentType = 'deveopment' | 'production';

interface IConfiguration {
  environment: EnvironmentType;
  port: number;
  database: {
    type: 'postgres';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize?: boolean;
  };
}

export default (): IConfiguration => ({
  environment: (process.env.NODE_ENV as EnvironmentType) || 'development',
  port: parseInt(process.env.PORT!, 10) || 3000,
  database: {
    type: 'postgres' as const,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10) || 5432,
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    synchronize: true,
  },
});

const config_schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
});

export { config_schema, IConfiguration };
