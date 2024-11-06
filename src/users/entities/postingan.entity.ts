import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Likes } from './likes.entity';
import { BookmarkEntity } from './bookmark.entity';

@Entity()
export class Postingan {
  @PrimaryGeneratedColumn()
  postId: number;

  // nama instansi/ tempat kerja
  @Column({ default: '' })
  nama_instansi: string;

  // detail dan jenis pekerjaan
  @Column({ default: '' })
  nama_pekerjaan: string;

  @Column({ default: '' })
  bidang_pekerjaan: string;

  // tipe pekerjaan
  @Column({ type: 'varchar', default: '' })
  penuh_waktu: string;

  @Column({ type: 'varchar', default: '' })
  paruh_waktu: string;

  @Column({ type: 'varchar', default: '' })
  magang: string;

  @Column({ type: 'varchar', default: '' })
  kontrak: string;

  @Column({ type: 'varchar', default: '' })
  harian: string;

  //Lokasi
  @Column({ default: '' })
  provinsi: string;

  @Column({ default: '' })
  kabupaten: string;

  @Column({ default: '' })
  kecamatan: string;

  // deskripsi pekerjaan
  @Column({ type: 'varchar', length: 2000, default: '' })
  deskripsi: string;

  // gaji
  @Column({ default: '', type: 'varchar' })
  gaji: string;

  // persyaratan kerja
  @Column({ type: 'varchar', default: '' })
  skils: string;

  @Column({ type: 'varchar', default: '' })
  minimal_pendidikan: string;

  @Column({ type: 'varchar', default: '' })
  pengalaman_kerja: string;

  @Column({ default: '' })
  originalName: string;

  @Column({ default: '' })
  fileName: string;

  @Column({ default: '' })
  filePath: string;

  @ManyToOne(() => Users, (user) => user.postings)
  user: Users;

  @OneToMany(() => Likes, (likes) => likes.liked)
  liked: Likes[];

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.postingan)
  bookmark: BookmarkEntity[];

  @CreateDateColumn()
  created_at: Date; 
}
