import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const decoded: DecodedIdToken | null =
      await this.userService.validateRequest(request);

    if (!decoded) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    request['user'] = decoded;
    return true;
  }
}
