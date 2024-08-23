import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';
import { Song } from 'src/songs/song.entity';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsArray()
  @IsNumberString({}, { each: true })
  readonly songs: Song[];

  @IsNumber()
  @IsNotEmpty()
  readonly user: number;
}
