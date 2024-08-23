import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Artist } from 'src/artists/artists.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Song, Artist])],
  exports: [TypeOrmModule],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
