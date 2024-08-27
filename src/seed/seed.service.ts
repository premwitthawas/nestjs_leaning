import { Injectable, Logger } from '@nestjs/common';
import { seedData } from 'db/seed-data';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('Seeding State');
  constructor(private readonly connection: DataSource) {}

  async seed(): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.logger.debug('StartTransaction');
    try {
      const manager = queryRunner.manager;
      await seedData(manager);
      this.logger.debug('Seeding ....');
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(`Error During 'DataBase' Seeding: `, err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      this.logger.debug('Commit Successfully.');
    }
  }
}
