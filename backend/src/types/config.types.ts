export interface EnvironmentVariables {
  PORT: number;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  API_URL: string;
  FRONTEND_URL: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_URL: string;
  DB_PASSWORD?: string;
}
