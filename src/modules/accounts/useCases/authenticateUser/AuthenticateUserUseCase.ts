import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { AppError } from '@errors/AppError';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('Incorrect email or password!', 401);

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) throw new AppError('Incorrect email or password!');

    const {
      secret_token,
      secret_refresh_token,
      expires_in_token,
      expires_in_refresh_token,
      refresh_token_duration_days,
    } = auth;

    const token = sign({}, secret_token, {
      subject: user.id,
      expiresIn: expires_in_token,
    });

    const refresh_token = sign({ email }, secret_refresh_token, {
      subject: user.id,
      expiresIn: expires_in_refresh_token,
    });

    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token,
      expire_date: this.dateProvider.addDays(refresh_token_duration_days),
    });

    return {
      user: { name: user.name, email: user.email },
      token,
      refresh_token,
    };
  }
}

export { AuthenticateUserUseCase };
