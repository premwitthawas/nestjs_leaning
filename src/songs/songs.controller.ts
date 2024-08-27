import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { Song } from './song.entity';
import { UpdateSongDto } from './dto/update-song-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ArtistJwtGuard } from 'src/auth/artists.jwt.guard';

@Controller('songs')
export class SongsController {
  constructor(private songsServices: SongsService) {}

  @Post()
  @UseGuards(ArtistJwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSongDto: CreateSongDTO): Promise<Song> {
    return await this.songsServices.create(createSongDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Song>> {
    try {
      return this.songsServices.paginate({
        page,
        limit,
      });
    } catch (e: any) {
      throw new HttpException(
        'server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: e,
        },
      );
    }
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    const data = await this.songsServices.findOne(id);
    if (!data) {
      throw new HttpException('Data Not Found', HttpStatus.NOT_FOUND);
    }
    return data;
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updateSongDto: UpdateSongDto,
  ) {
    const result = await this.songsServices.update(id, updateSongDto);
    if (result.affected == 0) {
      throw new HttpException(
        'Bad Request Update Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { msg: 'Updated Successfully.' };
  }

  @Delete(':id')
  async delete(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    const { affected } = await this.songsServices.remove(id);
    if (affected == 0) {
      throw new HttpException(
        'Bad Request Deleted Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { msg: 'Deleted Successfully.' };
  }
}
