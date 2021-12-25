import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarsSpecficationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe('Create Car Specification', () => {
  beforeAll(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarsSpecficationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it('should be able to add a new specification to car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'name1',
      description: 'description1',
      daily_rate: 100,
      license_plate: '123',
      fine_amount: 100,
      brand: 'brand1',
      category_id: 'id1',
    });

    const spec = await specificationsRepositoryInMemory.create({
      name: 'spec',
      description: 'spec',
    });

    const carSpecs = await createCarsSpecficationUseCase.execute({
      car_id: car.id,
      specifications_id: [spec.id],
    });

    expect(carSpecs).toHaveProperty('specifications');
    expect(carSpecs.specifications.length).toBe(1);
  });

  it('should not be able to add a new specification to a non existing car', async () => {
    const car_id = '1234';
    const specifications_id = ['12345'];
    await expect(
      createCarsSpecficationUseCase.execute({
        car_id,
        specifications_id,
      })
    ).rejects.toEqual(new AppError('Car does not exists!'));
  });
});
