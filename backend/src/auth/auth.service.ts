import {
  ConflictException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { DataSource } from 'typeorm';

import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async register(dto: RegisterDto) {
    return this.dataSource.transaction(async (manager) => {
      const existingUser = await this.usersService.findByEmail(
        dto.email,
        manager,
      );

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const passwordHash = await argon2.hash(dto.password);

      const user = await this.usersService.create(
        dto.name,
        dto.email,
        passwordHash,
        manager,
      );

      await this.categoriesService.createDefaultCategories(user.id, manager);

      return {
        name: user.name,
        accessToken: await this.generateAccessToken(user.id),
      };
    });
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      name: user.name,
      accessToken: await this.generateAccessToken(user.id),
    };
  }

  private generateAccessToken(userId: string) {
    return this.jwtService.signAsync({
      sub: userId,
    });
  }
}
