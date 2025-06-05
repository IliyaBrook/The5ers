import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { existsSync } from 'fs';
import * as dotenv from 'dotenv';

import type { EnvironmentVariables } from '@/types';

const workspaceRoot = process.env.NX_WORKSPACE_ROOT || process.cwd();
const envPath = join(workspaceRoot, '.env');

if (existsSync(envPath)) {
  try {
    dotenv.config({ path: envPath });
    console.error('Debug: After dotenv.config, DB_URL:', process.env.DB_URL);
  } catch (err) {
    console.error('Debug: Error reading .env file:', err);
  }
}

export const configProvider = ConfigModule.forRoot<EnvironmentVariables>({
  isGlobal: true,
});
