import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Postingan } from './postingan.entity';
import { Users } from './user.entity';

@Entity()
export class BookmarkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Postingan, (postingan) => postingan.bookmark)
  postingan: Postingan;

  @Column({ default: 0 })
  postId: number;

  @Column({ default: 0 })
  userId: number;

  @Column({ default: true })
  bookmarkStatus: boolean;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
