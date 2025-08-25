import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { FirebaseResponse, UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
    email: string;
  };
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Body() loginDto: LoginDto): Promise<FirebaseResponse> {
    return this.userService.loginUser(loginDto);
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async registerUser(@Body() createUserDTo: CreateUserDto) {
    return this.userService.createUser(createUserDTo);
  }

  @Post('refresh-auth')
  refreshAuth(@Query('refreshToken') refreshToken: string) {
    return this.userService.refreshAuthToken(refreshToken);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  getProfile(@Req() req: AuthenticatedRequest) {
    return {
      uid: req.user.uid,
      email: req.user.email,
    };
  }
}
