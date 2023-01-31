import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './modules/user/user.module';
import { TodoModule } from './modules/todo/todo.module';

import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './utils/pipes/validation.pipe';
import { JwtAuthGuard } from './utils/guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuard } from './utils/guards/roles.guard';

const ENV = process.env.STAGE;

@Module({
  imports: [
    UserModule,
    TodoModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV=="dev" ? '.env.dev' : '.env.prod'
      // why is `env.${ENV} not work`???
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      
      useFactory: (configService: ConfigService) => {
        console.log();
        
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          synchronize: configService.get('DB_SYNC'),
          autoLoadEntities: true,
        }
      }

    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
  ],
})
export class AppModule {}
