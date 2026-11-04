import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

export interface AccountResponse {
  id: string;
  name: string;
  bankName: string | null;
  type: Account['type'];
  currencyCode: string;
  initialBalance: string;
  isArchived: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async getAccounts(userId: string): Promise<AccountResponse[]> {
    const [accounts, user] = await Promise.all([
      this.accountsRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'ASC' },
      }),
      this.usersRepository.findOne({
        where: { id: userId },
        relations: { defaultAccount: true },
      }),
    ]);

    return accounts.map((account) =>
      this.toResponse(account, user?.defaultAccountId === account.id),
    );
  }

  async getAccount(
    accountId: string,
    userId: string,
  ): Promise<AccountResponse> {
    const account = await this.findUserAccount(accountId, userId);
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { defaultAccount: true },
    });

    return this.toResponse(account, user?.defaultAccountId === account.id);
  }

  async createAccount(
    userId: string,
    data: CreateAccountDto,
  ): Promise<AccountResponse> {
    if (data.isDefault && data.isArchived) {
      throw new BadRequestException(
        'An archived account cannot be the default account',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const accountRepository = manager.getRepository(Account);
      const userRepository = manager.getRepository(User);
      const account = accountRepository.create({
        name: data.name,
        bankName: data.bankName ?? null,
        type: data.type,
        currencyCode: data.currencyCode,
        initialBalance: data.initialBalance ?? '0',
        isArchived: data.isArchived ?? false,
        user: { id: userId },
      });
      const savedAccount = await accountRepository.save(account);

      if (data.isDefault) {
        await manager
          .createQueryBuilder()
          .relation(User, 'defaultAccount')
          .of(userId)
          .set(savedAccount.id);
      }

      return this.toResponse(savedAccount, data.isDefault ?? false);
    });
  }

  async updateAccount(
    accountId: string,
    userId: string,
    data: UpdateAccountDto,
  ): Promise<AccountResponse> {
    return this.dataSource.transaction(async (manager) => {
      const accountRepository = manager.getRepository(Account);
      const userRepository = manager.getRepository(User);
      const account = await accountRepository.findOne({
        where: { id: accountId, user: { id: userId } },
      });

      if (!account) {
        throw new NotFoundException('Account not found');
      }

      const willBeArchived = data.isArchived ?? account.isArchived;
      if (data.isDefault === true && willBeArchived) {
        throw new BadRequestException(
          'An archived account cannot be the default account',
        );
      }

      if (data.name !== undefined) account.name = data.name;
      if (data.bankName !== undefined) account.bankName = data.bankName;
      if (data.type !== undefined) account.type = data.type;
      if (data.currencyCode !== undefined)
        account.currencyCode = data.currencyCode;
      if (data.initialBalance !== undefined)
        account.initialBalance = data.initialBalance;
      if (data.isArchived !== undefined) account.isArchived = data.isArchived;

      const savedAccount = await accountRepository.save(account);

      if (data.isDefault === true) {
        await manager
          .createQueryBuilder()
          .relation(User, 'defaultAccount')
          .of(userId)
          .set(savedAccount.id);
      } else if (data.isDefault === false || willBeArchived) {
        const user = await userRepository.findOne({
          where: { id: userId },
          relations: { defaultAccount: true },
        });
        if (user?.defaultAccountId === accountId) {
          await manager
            .createQueryBuilder()
            .relation(User, 'defaultAccount')
            .of(userId)
            .set(null);
        }
      }

      const user = await userRepository.findOne({
        where: { id: userId },
        relations: { defaultAccount: true },
      });
      return this.toResponse(
        savedAccount,
        user?.defaultAccountId === savedAccount.id,
      );
    });
  }

  async deleteAccount(accountId: string, userId: string) {
    const account = await this.findUserAccount(accountId, userId);
    await this.accountsRepository.remove(account);

    return { message: 'Account deleted' };
  }

  private async findUserAccount(
    accountId: string,
    userId: string,
  ): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { id: accountId, user: { id: userId } },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  private toResponse(account: Account, isDefault: boolean): AccountResponse {
    return {
      id: account.id,
      name: account.name,
      bankName: account.bankName,
      type: account.type,
      currencyCode: account.currencyCode.trim(),
      initialBalance: account.initialBalance,
      isArchived: account.isArchived,
      isDefault,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
}
