import { AppError } from '@errors/AppError';
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let user: ICreateUserDTO;

describe('Authenticate User', () => {
  beforeAll(async () => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    user = {
      driver_license: '111111',
      email: 'user@example.com',
      password: 'password',
      name: 'test name',
    };

    await createUserUseCase.execute(user);
  });

  it('Should be able to authenticate an user', async () => {
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
  });

  it('Should not be able to authenticate an non-existing user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: '123',
        password: user.password,
      })
    ).rejects.toEqual(new AppError('Incorrect email or password!', 401));
  });

  it('Should not be able to authenticate an user with incorrect password', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: '123',
      })
    ).rejects.toEqual(new AppError('Incorrect email or password!'));
  });
});
