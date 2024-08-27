import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Enable2FAType } from './payload.type';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ValidateTokenDTO } from './dto/tokenvalidate.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() userDTO: CreateUserDTO): Promise<User> {
    return this.usersService.create(userDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Get('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2Fa(@Request() req): Promise<Enable2FAType> {
    return this.authService.enable2FA(req.user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate(
    @Request() req,
    @Body() tokenValidateDTO: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.validate2FAToken(
      req.user.userId,
      tokenValidateDTO.token,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('disable-2fa')
  @UseGuards(JwtAuthGuard)
  disable2FA(@Request() req): Promise<UpdateResult> {
    return this.authService.disable2FA(req.user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  getProfile(@Request() req) {
    return {
      msg: 'Authenticate with API KEY',
      user: req.user,
    };
  }
}
