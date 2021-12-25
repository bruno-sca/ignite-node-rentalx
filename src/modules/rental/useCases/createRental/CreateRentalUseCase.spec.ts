import dayjs from 'dayjs';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rental/repositories/in-memory/RentalsRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let car: Car;
let car2: Car;

describe('Create Rental', () => {
  beforeAll(async () => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      carsRepositoryInMemory,
      dateProvider
    );
    car = await carsRepositoryInMemory.create({
      name: 'car',
      description: 'car',
      daily_rate: 10,
      license_plate: '123',
      fine_amount: 10,
      brand: 'brand',
      category_id: '123',
    });
    car2 = await carsRepositoryInMemory.create({
      name: 'car2',
      description: 'car2',
      daily_rate: 10,
      license_plate: '1234',
      fine_amount: 10,
      brand: 'brand',
      category_id: '1234',
    });
  });

  it('should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: car.id,
      expected_return_date: dayjs().add(1, 'day').toDate(),
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should be not able to create a new rental if a user already has an active rental', async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: '12345',
        car_id: car2.id,
        expected_return_date: dayjs().add(1, 'day').toDate(),
      })
    ).rejects.toEqual(new AppError('User already has an active rental!'));
  });

  it('should be not able to create a new rental if a car already has an active rental', async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: '12344',
        car_id: car.id,
        expected_return_date: dayjs().add(1, 'day').toDate(),
      })
    ).rejects.toEqual(new AppError('Car selected is not available!'));
  });

  it('should be not able to create a new rental with an invalid return time', async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: '12344',
        car_id: '121212',
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError('Invalid return time!'));
  });
});
