import { Injectable } from '@nestjs/common';
import { CreateSongDTO } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song-dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artists.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song) private songsRepository: Repository<Song>,
    @InjectRepository(Artist) private artistsRepository: Repository<Artist>,
  ) {}
  async create(song: CreateSongDTO): Promise<Song> {
    const artists_repo_data = await this.artistsRepository.findByIds(
      song.artists,
    );
    const data = new Song();
    data.title = song.title;
    data.artists = artists_repo_data;
    data.releasedDate = song.releasedDate;
    data.duration = song.duration;
    data.lyrics = song.lyrics;
    return this.songsRepository.save(data);
  }

  findAll(): Promise<Song[]> {
    return this.songsRepository.find();
  }

  findOne(id: number): Promise<Song> {
    return this.songsRepository.findOneBy({ id: id });
  }

  remove(id: number): Promise<DeleteResult> {
    return this.songsRepository.delete({ id: id });
  }

  update(id: number, updateDto: UpdateSongDto): Promise<UpdateResult> {
    return this.songsRepository.update(id, updateDto);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songsRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.releasedDate', 'DESC');
    return paginate<Song>(queryBuilder, options);
  }
}
