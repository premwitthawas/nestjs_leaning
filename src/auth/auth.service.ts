import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { Enable2FAType, PayloadType } from './payload.type';
import * as speakeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private artistService: ArtistsService,
  ) {}

  async login(
    loginDTO: LoginDTO,
  ): Promise<{ accessToken: string } | { validate2FA: string; msg: string }> {
    const user = await this.usersService.findOne(loginDTO);
    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );
    if (!passwordMatched) {
      throw new UnauthorizedException('Password does not match');
    }
    delete user.password;
    const artist = await this.artistService.findArtist(user.id);
    const payload: PayloadType = {
      email: user.email,
      userId: user.id,
    };
    if (artist) {
      payload.artistId = artist.id;
    }
    if (user.enable2FA && user.twoFASecret) {
      return {
        validate2FA: 'http://localhost:3000/auth/validate-2fa',
        msg: 'Please sends the one times password/token from your Google Authenticator App',
      };
    }
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.usersService.findById(userId);

    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }

    const secret = speakeasy.generateSecret();

    console.log(secret);

    await this.usersService.updateSecertKey(userId, secret.base32);

    return { secret: secret.base32 };
  }
  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new NotFoundException('User Not Found');
      }

      console.log(user.twoFASecret);

      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
        window: 1,
      });

      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch {
      throw new UnauthorizedException('Error verified token.');
    }
  }
  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.usersService.disable2FA(userId);
  }
  async validateUserByApiKey(apikey: string) {
    const user = await this.usersService.findByApiKey(apikey);
    if (!user) {
      throw new UnauthorizedException();
    }
    delete user.password;
    return user;
  }
}
