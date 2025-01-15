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
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateLoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/token')
  signIn(@Body() signInDto: CreateLoginDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  @ApiSecurity('Authorization')
  getProfile(@Request() req) {
    return req.user;
  }
}
