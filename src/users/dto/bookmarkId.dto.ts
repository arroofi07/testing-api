import { IsNotEmpty } from 'class-validator';

export class BookmarkDto {
  @IsNotEmpty()
  postinganId: number;
}
