import { User } from 'src/users/user.entity';
import { EntityManager } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as bryptjs from 'bcryptjs';
import * as uuid from 'uuid';
import { Logger } from '@nestjs/common';
export const seedData = async (manager: EntityManager) => {
  const logger = new Logger('Data State');
  const seeUsers = async () => {
    const salt = await bryptjs.genSalt();
    const passwordEncrypt = await bryptjs.hash('123456', salt);
    const newUser = new User();
    newUser.email = faker.internet.email();
    newUser.firstName = faker.person.firstName();
    newUser.lastName = faker.person.lastName();
    newUser.password = passwordEncrypt;
    newUser.apiKey = uuid.v4();
    newUser.phone = '123-456-789';
    logger.verbose(JSON.stringify(newUser));
    await manager.getRepository(User).save(newUser);
  };

  await seeUsers();
};
