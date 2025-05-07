import { Env } from '@adonisjs/core/env'

const isProduction = process.env.NODE_ENV === 'production'

// Em produção, usa o diretório atual (não precisa ter .env)
// Em dev, aponta para a raiz do projeto para usar `.env`
const envPath = isProduction ? new URL('.', import.meta.url) : new URL('../', import.meta.url)

export default await Env.create(envPath, {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test']),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),
  SMTP_HOST: Env.schema.string(),
  SMTP_PORT: Env.schema.string(),
})
