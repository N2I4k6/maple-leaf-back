import { plainToInstance } from 'class-transformer';
import { IsString, IsNumberString, IsOptional, validateSync } from 'class-validator';

class EnvVars {
  @IsNumberString()
  @IsOptional()
  PORT?: string;

  @IsString()
  MONGODB_URI!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  @IsOptional()
  CORS_ORIGIN?: string;
}

export function validate(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvVars, config, { enableImplicitConversion: true });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(`❌ ENV validation failed:\n${errors.toString()}`);
  }
  return validated;
}