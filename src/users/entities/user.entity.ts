import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Postingan } from './postingan.entity';
import { BookmarkEntity } from './bookmark.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  password: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  noHp: string;

  @OneToMany(() => Postingan, (postingan) => postingan.user)
  postings: Postingan[];

  
}
