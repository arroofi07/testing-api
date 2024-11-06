import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pelamar {
  @PrimaryGeneratedColumn()
  userId: number;
}
