import dayjs from 'dayjs';

import { RentalsRepositoryInMemory } from '@modules/rental/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dateProvider: DayjsDateProvider;

describe('Create Rental', () => {
  beforeAll(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dateProvider
    );
  });

  it('should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '121212',
      expected_return_date: dayjs().add(1, 'day').toDate(),
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should be not able to create a new rental if a user already has an active rental', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: '121213',
        expected_return_date: dayjs().add(1, 'day').toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to create a new rental if a car already has an active rental', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12344',
        car_id: '121212',
        expected_return_date: dayjs().add(1, 'day').toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to create a new rental with an invalid return time', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12344',
        car_id: '121212',
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
