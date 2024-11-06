import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';
import { Postingan } from './entities/postingan.entity';
import * as fs from 'fs';
import { likesDto } from './dto/likes.dto';
import { Likes } from './entities/likes.entity';
import { PostinganDto } from './dto/postinga.dto';
import { BookmarkDto } from './dto/bookmarkId.dto';
import { BookmarkEntity } from './entities/bookmark.entity';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly entityManager: EntityManager,
    @InjectRepository(Postingan)
    private postinganRepository: Repository<Postingan>,
    @InjectRepository(Likes)
    private likesRepository: Repository<Likes>,
    @InjectRepository(BookmarkEntity)
    private bookmarkRepository: Repository<BookmarkEntity>,
  ) {}

  // register
  async createRegister(createRegisterDto: CreateRegisterDto) {
    if (!/^[a-z0-9\s]+$/.test(createRegisterDto.password)) {
      throw new BadRequestException('sandi hanya boleh huruf dan angka');
    }
    if (!/^[a-z@.\s]+$/.test(createRegisterDto.email)) {
      throw new BadRequestException('email hanya boleh berisi huruf');
    }

    const hashedPassword = await bcrypt.hash(createRegisterDto.password, 10);
    const newUser = this.userRepository.create({
      ...createRegisterDto,
      password: hashedPassword,
    });
    await this.entityManager.save(newUser);
  }

  // login
  async login(name: string, password: string | Buffer) {
    const user = await this.userRepository.findOne({
      where: { name },
    });
    if (!user) {
      throw new NotFoundException('Nama User Tidak Ditemukan');
    }
    const userPassword = await bcrypt.compare(password, user.password);
    if (!userPassword) {
      throw new NotFoundException('Password Yang Dimasukkan Salah');
    }
    return user;
  }

  // postingan
  // create post
  async createPostingan(
    userId: number,
    postinganDto: PostinganDto,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({
      where: { userId },
    });

    const postingan = new Postingan();
    if (postinganDto) {
      postingan.user = user;
      postingan.nama_instansi = postinganDto.nama_instansi;
      postingan.nama_pekerjaan = postinganDto.nama_pekerjaan;
      postingan.bidang_pekerjaan = postinganDto.bidang_pekerjaan;
      postingan.penuh_waktu = postinganDto.penuh_waktu;
      postingan.paruh_waktu = postinganDto.paruh_waktu;
      postingan.magang = postinganDto.magang;
      postingan.kontrak = postinganDto.kontrak;
      postingan.harian = postinganDto.harian;
      postingan.provinsi = postinganDto.provinsi;
      postingan.kabupaten = postinganDto.kabupaten;
      postingan.kecamatan = postinganDto.kecamatan;
      postingan.deskripsi = postinganDto.deskripsi;
      postingan.gaji = postinganDto.gaji;
      postingan.skils = postinganDto.skils;
      postingan.minimal_pendidikan = postinganDto.minimal_pendidikan;
      postingan.pengalaman_kerja = postinganDto.pengalaman_kerja;
    }

    if (file) {
      postingan.user = user;
      postingan.originalName = file.originalname;
      postingan.fileName = file.filename;
      postingan.filePath = file.path;
    }
    return this.postinganRepository.save(postingan);
  }

  // delete postingan
  async deletePostingan(userId: number, postId: number): Promise<void> {
    const postingan = await this.postinganRepository.findOne({
      where: { postId: postId, user: { userId: userId } },
    });

    if (postingan.filePath) {
      try {
        fs.unlinkSync(postingan.filePath);
      } catch (err) {
        console.error(err, 'terjadi masalah saat mencoba menghapus postingan');
      }
    }
    await this.postinganRepository.remove(postingan);
  }

  //  temukan id potingan
  async findPostById(postId: number): Promise<Postingan | undefined> {
    return this.postinganRepository.findOne({
      where: { postId },
    });
  }

  // likes postingan
  async createLikes(likesDto: likesDto, liking: number, postinganId: number) {
    const { likedId } = likesDto;
    const liked = await this.findPostById(likedId);

    let likes = await this.likesRepository.findOne({
      where: {
        liking: liking,
        liked: { postId: likedId },
        postinganId: postinganId,
      },
    });

    if (!likes) {
      likes = new Likes();
      (likes.liking = liking),
        (likes.liked = liked),
        (likes.postinganId = postinganId),
        (likes.likesStatus = true),
        await this.likesRepository.save(likes);
      return 'You liked';
    } else {
      likes.likesStatus = !likes.likesStatus;
      await this.likesRepository.remove(likes);
      return 'You Unliked';
    }
  }

  // bookmark
  async addBokkmark(
    bookmarkDto: BookmarkDto,
    id: number,
    postId: number,
    userId: number,
  ) {
    const { postinganId } = bookmarkDto;
    const newBookmark = await this.findPostById(postinganId);

    let bookmark = await this.bookmarkRepository.findOne({
      where: {
        postingan: { postId: postinganId },
        postId,
        userId,
      },
    });

    if (!bookmark) {
      bookmark = new BookmarkEntity();
      bookmark.id = id;
      bookmark.postingan = newBookmark;
      bookmark.postId = postId;
      bookmark.userId = userId;
      bookmark.bookmarkStatus = true;
      await this.bookmarkRepository.save(bookmark);
      return 'succes';
    } else {
      bookmark.bookmarkStatus = !bookmark.bookmarkStatus;
      await this.bookmarkRepository.remove(bookmark);
      return 'Failed';
    }
  }

  // menampilkan semua data
  async findAll(): Promise<Users[]> {
    return this.userRepository.find({
      relations: ['postings', 'postings.bookmark'],
    });
  }

  // menampilkan data users berdasarakan id
  async findOne(userId: number) {
    return this.userRepository.findOne({
      where: { userId },
      relations: ['postings'],
    });
  }

  // menampilkan postingan berdasarkan id
  async findOnePostingan(postId: number) {
    return this.postinganRepository.findOne({
      where: { postId },
    });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
