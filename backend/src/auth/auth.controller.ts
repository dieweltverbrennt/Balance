import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.assertTrustedOrigin(request);
    const { refreshToken, ...authResponse } =
      await this.authService.register(dto);
    this.setRefreshCookie(response, refreshToken);
    return authResponse;
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.assertTrustedOrigin(request);
    const { refreshToken, ...authResponse } = await this.authService.login(dto);
    this.setRefreshCookie(response, refreshToken);
    return authResponse;
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.assertTrustedOrigin(request);
    const refreshToken = this.getRefreshToken(request);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    try {
      const { refreshToken: nextRefreshToken, ...authResponse } =
        await this.authService.refresh(refreshToken);
      this.setRefreshCookie(response, nextRefreshToken);
      return authResponse;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        this.clearRefreshCookie(response);
      }
      throw error;
    }
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.assertTrustedOrigin(request);
    await this.authService.revokeRefreshToken(this.getRefreshToken(request));
    this.clearRefreshCookie(response);
    return { success: true };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    return user.name;
  }

  private assertTrustedOrigin(request: Request): void {
    const requestOrigin = request.headers.origin;
    if (!requestOrigin) return;

    const configuredOrigin = this.configService.get<string>(
      'FRONTEND_ORIGIN',
      'http://localhost:5173',
    );

    if (requestOrigin !== new URL(configuredOrigin).origin) {
      throw new ForbiddenException('Untrusted request origin');
    }
  }

  private getRefreshToken(request: Request): string | undefined {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) return undefined;

    const cookie = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('refresh_token='));

    return cookie?.slice('refresh_token='.length);
  }

  private setRefreshCookie(response: Response, token: string): void {
    const ttlDays = Number(
      this.configService.get<string>(
        'REFRESH_TOKEN_TTL_DAYS',
        '30',
      ),
    );
    const maxAge = Math.floor(ttlDays * 24 * 60 * 60);
    const sameSite = this.configService
      .get<string>('REFRESH_COOKIE_SAME_SITE', 'lax')
      .toLowerCase();

    if (!['strict', 'lax', 'none'].includes(sameSite)) {
      throw new Error('REFRESH_COOKIE_SAME_SITE must be strict, lax, or none');
    }

    const secure =
      process.env.NODE_ENV === 'production' || sameSite === 'none'
        ? '; Secure'
        : '';

    response.setHeader(
      'Set-Cookie',
      `refresh_token=${token}; Path=/auth; HttpOnly; SameSite=${sameSite}; Max-Age=${maxAge}${secure}`,
    );
  }

  private clearRefreshCookie(response: Response): void {
    const sameSite = this.configService
      .get<string>('REFRESH_COOKIE_SAME_SITE', 'lax')
      .toLowerCase();
    const secure =
      process.env.NODE_ENV === 'production' || sameSite === 'none'
        ? '; Secure'
        : '';

    response.setHeader(
      'Set-Cookie',
      `refresh_token=; Path=/auth; HttpOnly; SameSite=${sameSite}; Max-Age=0${secure}`,
    );
  }
}
