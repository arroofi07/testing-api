import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateRegisterDto } from './dto/create-user.dto';
import { AuthService } from './authService';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { PostinganDto } from './dto/postinga.dto';
import { BookmarkDto } from './dto/bookmarkId.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // register
  @Post('/register')
  create(@Body() createRegisterDto: CreateRegisterDto) {
    return this.usersService.createRegister(createRegisterDto);
  }

  // login
  @Post('/login')
  async login(@Body() body: { name: string; password: string }) {
    try {
      return await this.authService.authentication(body.name, body.password);
    } catch (err) {
      throw new UnauthorizedException(
        'login gagal karena authnetikasi tidak valid',
      );
    }
  }

  // tampil postingan
  @Get('/postingan/:filename')
  async serverAvatar(@Param('filename') filename, @Res() res): Promise<any> {
    const path = join(process.cwd(), 'uploads', filename);
    return res.sendFile(path);
  }

  // postingan
  @Post('/postingan/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.originalname} - ${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async handleUpload(
    @Param('userId') userId: number,
    @Body() postingaDto: PostinganDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.usersService.createPostingan(
      userId,
      postingaDto,
      file,
    );
    return result;
  }

  @Post('/bookmark')
  async handleBookmark(
    @Body() bookmarkDto: BookmarkDto,
    @Body('id') id: number,
    @Body('postId') postId: number,
    @Body('userId') userId: number,
  ) {
    const result = await this.usersService.addBokkmark(
      bookmarkDto,
      id,
      postId,
      userId,
    );
  }

  // delete postingan
  @Delete('/remove/:userId/:postId')
  async removePostingan(
    @Param('userId') userId: number,
    @Param('postId') postId: number,
  ) {
    await this.usersService.deletePostingan(userId, postId);
    return { message: 'Postingan berhasil dihapus' };
  }

  // tampilkan semua data users
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('/:userId')
  findOne(@Param('userId') userId: string) {
    return this.usersService.findOne(+userId);
  }

  @Get('/post/:postId')
  findOnePostingan(@Param('postId') postId: string) {
    return this.usersService.findOnePostingan(+postId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
