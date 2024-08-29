import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { SeedService } from './seed/seed.service';

declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const configSwager = new DocumentBuilder()
    .setTitle('NestAPI')
    .setDescription('THE BASIC API IN NESTJS')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entet jwt token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, configSwager);
  SwaggerModule.setup('docs', app, document);
  // const seedService = app.get(SeedService);
  // await seedService.seed();
  await app.listen(configService.get<number>('APP_PORT'));
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
