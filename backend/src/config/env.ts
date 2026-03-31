import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  accessSecret: process.env.JWT_ACCESS_SECRET ?? 'access-secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:3000'
};
