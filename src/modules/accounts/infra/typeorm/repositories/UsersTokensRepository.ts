import { getRepository, Repository } from 'typeorm';

import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';

import { UserTokens } from '../entities/UserTokens';

class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserTokens>;

  constructor() {
    this.repository = getRepository(UserTokens);
  }

  async create(data: ICreateUserTokenDTO): Promise<UserTokens> {
    const user = this.repository.create(data);
    await this.repository.save(user);
    return user;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async matchRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    const userTokens = await this.repository.findOne({
      user_id,
      refresh_token,
    });
    return userTokens;
  }
}

export { UsersTokensRepository };
