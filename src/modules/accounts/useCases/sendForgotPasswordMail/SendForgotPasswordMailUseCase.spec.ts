import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe('Send forgot password mail', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it('Should be able to send forgot password mail', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await usersRepositoryInMemory.create({
      name: 'name',
      email: 'email@example.com',
      driver_license: '123456',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('email@example.com');

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should be able to create a new after forgot password', async () => {
    const createToken = jest.spyOn(usersTokensRepositoryInMemory, 'create');

    await usersRepositoryInMemory.create({
      name: 'name',
      email: 'email@example.com',
      driver_license: '123456',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('email@example.com');

    expect(createToken).toHaveBeenCalled();
  });

  it('Should be able to send forgot password mail', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await expect(
      sendForgotPasswordMailUseCase.execute('email@example.com')
    ).rejects.toEqual(new AppError('Email is not registered to any account'));

    expect(sendMail).not.toHaveBeenCalled();
  });
});
