import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async authentication(name: string, password: string) {
    try {
      const user = await this.userService.login(name, password);

      const token = jwt.sign(
        {
          id: user.userId,
        },
        process.env.SECRET_JWT,
        {
          expiresIn: '7d',
        },
      );
      return { token, user: { id: user.userId } };
    } catch (err) {
      throw new BadRequestException('Kesalahan pada server terjadi', {
        cause: new Error(),
        description: err,
      });
    }
  }
}
