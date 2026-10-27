import {
  ConflictException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'node:crypto';
import * as argon2 from 'argon2';
import { DataSource, EntityManager, IsNull, Repository } from 'typeorm';

import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshSession } from './entities/refresh-session.entity';

export interface AuthTokens {
  name: string;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    @InjectRepository(RefreshSession)
    private readonly refreshSessionsRepository: Repository<RefreshSession>,
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

      return this.createSession(user.id, user.name, manager);
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

    return this.createSession(user.id, user.name);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const tokenHash = this.hashToken(refreshToken);

    return this.dataSource.transaction(async (manager) => {
      const sessions = manager.getRepository(RefreshSession);
      const session = await sessions.findOne({ where: { tokenHash } });
      const now = new Date();

      if (!session || session.revokedAt || session.expiresAt <= now) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // A conditional update makes concurrent refresh attempts consume the token once.
      const revokeResult = await sessions.update(
        { id: session.id, revokedAt: IsNull() },
        { revokedAt: now },
      );

      if (revokeResult.affected !== 1) {
        throw new UnauthorizedException('Refresh token has already been used');
      }

      const user = await this.usersService.findById(session.userId);

      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      return this.createSession(user.id, user.name, manager);
    });
  }

  async revokeRefreshToken(refreshToken?: string): Promise<void> {
    if (!refreshToken) return;

    await this.refreshSessionsRepository.update(
      { tokenHash: this.hashToken(refreshToken), revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  private async createSession(
    userId: string,
    name: string,
    manager?: EntityManager,
  ): Promise<AuthTokens> {
    const refreshToken = randomBytes(32).toString('base64url');
    const ttlDays = Number(
      this.configService.get<string>('REFRESH_TOKEN_TTL_DAYS', '30'),
    );
    if (!Number.isInteger(ttlDays) || ttlDays < 1) {
      throw new Error('REFRESH_TOKEN_TTL_DAYS must be a positive integer');
    }
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
    const sessions = manager
      ? manager.getRepository(RefreshSession)
      : this.refreshSessionsRepository;

    await sessions.save(
      sessions.create({
        userId,
        tokenHash: this.hashToken(refreshToken),
        expiresAt,
        revokedAt: null,
      }),
    );

    return {
      name,
      accessToken: await this.generateAccessToken(userId),
      refreshToken,
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private generateAccessToken(userId: string) {
    return this.jwtService.signAsync({
      sub: userId,
    });
  }
}
