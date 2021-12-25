import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create Car', () => {
  beforeAll(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('Should be able to create a new Car', async () => {
    const car = await createCarUseCase.execute({
      name: 'name',
      description: 'description',
      daily_rate: 100,
      license_plate: '123',
      fine_amount: 100,
      brand: 'brand',
      category_id: 'id',
    });

    expect(car).toHaveProperty('id');
  });

  it('Should be not able to create a car with an already used license plate', async () => {
    await expect(
      createCarUseCase.execute({
        name: 'name',
        description: 'description',
        daily_rate: 100,
        license_plate: '123',
        fine_amount: 100,
        brand: 'brand',
        category_id: 'id',
      })
    ).rejects.toEqual(new AppError('Car already exists!'));
  });

  it('Car should be available by default after its creation', async () => {
    const car = await createCarUseCase.execute({
      name: 'name2',
      description: 'description2',
      daily_rate: 100,
      license_plate: '1234',
      fine_amount: 100,
      brand: 'brand2',
      category_id: 'id2',
    });

    expect(car.available).toBe(true);
  });
});
