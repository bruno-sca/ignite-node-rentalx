import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import auth from '@config/auth';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
class SendForgotPasswordMailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  async execute(email: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('Email is not registered to any account');

    const token = uuidv4();

    await this.usersTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expire_date: this.dateProvider.addMinutes(
        auth.forgot_pass_email_duration_minutes
      ),
    });

    await this.mailProvider.sendMail(
      email,
      'Recuperação de senha',
      {
        name: user.name,
        link: `${process.env.SERVER_URL}/reset-password?token=${token}`,
      },
      resolve(__dirname, '..', '..', 'views', 'emails', 'forgotPassword.hbs')
    );
  }
}

export { SendForgotPasswordMailUseCase };
