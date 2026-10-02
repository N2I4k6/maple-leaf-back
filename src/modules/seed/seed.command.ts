import { NestFactory } from '@nestjs/core';

import { AppModule } from '../../app.module';
import { SeedService } from './seed.service';

void (async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seed = app.get(SeedService);
  const force = process.argv.includes('--force');
  await seed.run(force);
  await app.close();
  process.exit(0);
})();