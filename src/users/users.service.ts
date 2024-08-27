import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login.dto';
import * as uuid from 'uuid';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(userDTO: CreateUserDTO): Promise<User> {
    const newUser = new User();
    newUser.email = userDTO.email;
    newUser.firstName = userDTO.firstName;
    newUser.lastName = userDTO.lastName;
    newUser.lastName = userDTO.lastName;
    newUser.apiKey = uuid.v4();
    const salt = await bcrypt.genSalt();
    newUser.password = await bcrypt.hash(userDTO.password, salt);
    const user = await this.usersRepository.save(newUser);
    delete user.password;
    return user;
  }

  async findOne(data: LoginDTO): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }
    return user;
  }

  async findById(userId: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: userId });
  }

  async updateSecertKey(userId: number, scretKey: any) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('UserNotFound');
    }
    return this.usersRepository.update(
      { id: userId },
      { twoFASecret: scretKey, enable2FA: true },
    );
  }

  async disable2FA(userId: number) {
    return this.usersRepository.update(
      { id: userId },
      {
        enable2FA: false,
        twoFASecret: null,
      },
    );
  }

  async findByApiKey(apiKey: string): Promise<User> {
    return this.usersRepository.findOneBy({ apiKey });
  }
}
