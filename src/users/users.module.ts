import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from './authService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Postingan } from './entities/postingan.entity';
import { Likes } from './entities/likes.entity';
import { BookmarkEntity } from './entities/bookmark.entity';
import { Pelamar } from './entities/pelamar.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Postingan,
      Likes,
      BookmarkEntity,
      Pelamar,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
