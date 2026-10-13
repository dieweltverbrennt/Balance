import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(
    email: string,
    manager?: EntityManager,
  ): Promise<User | null> {
    const repository = manager
      ? manager.getRepository(User)
      : this.usersRepository;

    return repository.findOne({
      where: { email },
    });
  }

  async create(
    name: string,
    email: string,
    passwordHash: string,
    manager: EntityManager,
  ): Promise<User> {
    const user = manager.create(User, {
      name,
      email,
      passwordHash,
    });

    return manager.save(User, user);
  }
}
