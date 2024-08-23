import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { CreatePlaylistDto } from './dto/create.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Song) private songsRepository: Repository<Song>,
    @InjectRepository(Playlist)
    private playlistsRepository: Repository<Playlist>,
  ) {}

  async create(playlistsDto: CreatePlaylistDto) {
    const [songs, user] = await Promise.all([
      this.songsRepository.findByIds(playlistsDto.songs),
      this.usersRepository.findOneBy({
        id: playlistsDto.user,
      }),
    ]);

    const playLists = new Playlist();
    playLists.name = playlistsDto.name;
    playLists.songs = songs;
    playLists.user = user;
    return this.playlistsRepository.save(playLists);
  }
}
