import {
  ConflictException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.usersService.create(
      dto.name,
      dto.email,
      passwordHash,
    );

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
    });

    return {
      accessToken: await this.generateAccessToken(user.id),
    };
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
      accessToken: await this.generateAccessToken(user.id),
    };
  }

  private generateAccessToken(userId: string) {
    return this.jwtService.signAsync({
      sub: userId,
    });
  }
}
