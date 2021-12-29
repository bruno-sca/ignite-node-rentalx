import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<string> {
    const { secret_token, secret_refresh_token, expires_in_token } = auth;
    const { sub: user_id } = verify(token, secret_refresh_token) as IPayload;

    const userToken = await this.usersTokensRepository.matchRefreshToken(
      user_id,
      token
    );

    if (!userToken) throw new AppError('Refresh Token not found!', 401);

    if (
      this.dateProvider.secondDiff(
        userToken.expire_date,
        this.dateProvider.dateNow()
      ) > 0
    ) {
      await this.usersTokensRepository.deleteById(userToken.id);
      throw new AppError('Refresh Token is expired!', 401);
    }

    const new_token = sign({}, secret_token, {
      subject: user_id,
      expiresIn: expires_in_token,
    });

    return new_token;
  }
}

export { RefreshTokenUseCase };
