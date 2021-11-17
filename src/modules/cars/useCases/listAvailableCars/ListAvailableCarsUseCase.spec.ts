import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('List Cars', () => {
  beforeAll(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it('should be able to list all cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'name1',
      description: 'description1',
      daily_rate: 100,
      license_plate: '123',
      fine_amount: 100,
      brand: 'brand1',
      category_id: 'id1',
    });

    const list = await listAvailableCarsUseCase.execute({});

    expect(list).toEqual([car]);
  });

  it('should be able to list all available cars by brand', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'name2',
      description: 'description2',
      daily_rate: 100,
      license_plate: '1234',
      fine_amount: 100,
      brand: 'brand2',
      category_id: 'id2',
    });
    const list = await listAvailableCarsUseCase.execute({ brand: car.brand });

    expect(list).toEqual([car]);
  });

  it('should be able to list all available cars by category_id', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'name3',
      description: 'description3',
      daily_rate: 100,
      license_plate: '1334',
      fine_amount: 100,
      brand: 'brand3',
      category_id: 'id3',
    });
    const list = await listAvailableCarsUseCase.execute({
      category_id: car.category_id,
    });

    expect(list).toEqual([car]);
  });

  it('should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'name4',
      description: 'description4',
      daily_rate: 100,
      license_plate: '1434',
      fine_amount: 100,
      brand: 'brand4',
      category_id: 'id4',
    });
    const list = await listAvailableCarsUseCase.execute({ name: car.name });

    expect(list).toEqual([car]);
  });
});
