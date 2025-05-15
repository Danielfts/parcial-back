import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IConfiguration } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<IConfiguration> = app.get(ConfigService);
  const port = configService.get('port', { infer: true })!;
  await app.listen(port);
}
bootstrap();
