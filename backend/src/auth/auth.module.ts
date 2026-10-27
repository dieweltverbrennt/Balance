import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { CategoriesModule } from '../categories/categories.module';
import { AuthController } from './auth.controller';
import { RefreshSession } from './entities/refresh-session.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    CategoriesModule,
    TypeOrmModule.forFeature([RefreshSession]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN') as any,
        },
      }),
    }),
  ],

  providers: [AuthService, JwtStrategy],

  exports: [AuthService],

  controllers: [AuthController],
})
export class AuthModule {}
