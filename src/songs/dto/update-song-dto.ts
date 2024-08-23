import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  readonly title;

  @IsArray()
  @IsOptional()
  @IsNumberString({}, { each: true })
  readonly artists;

  @IsDateString()
  @IsOptional()
  readonly releasedDate: Date;

  @IsMilitaryTime()
  @IsOptional()
  readonly duration: Date;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
