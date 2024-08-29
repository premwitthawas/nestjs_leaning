import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('playlists')
@ApiTags('playlists')
export class PlaylistsController {
  constructor(private playListsServices: PlaylistsService) {}
  @Post()
  async create(@Body() playlitsDto: CreatePlaylistDto) {
    return this.playListsServices.create(playlitsDto);
  }
}
