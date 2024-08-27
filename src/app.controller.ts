import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() request) {
    const user = await this.userService.findById(request.user.userId);
    delete user.password;
    return user;
  }
}
