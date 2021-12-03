import { container } from 'tsyringe';

import '@shared/container/providers';

import { UsersRepository } from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { CarsImagesRepository } from '@modules/cars/infra/typeorm/repostories/CarsImagesRepository';
import { CarsRepository } from '@modules/cars/infra/typeorm/repostories/CarsRepository';
import { CategoriesRepository } from '@modules/cars/infra/typeorm/repostories/CategoriesRepository';
import { SpecificationsRepository } from '@modules/cars/infra/typeorm/repostories/SpecificationsRepository';
import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { ICategoriesRepository } from '@modules/cars/repositories/ICategoriesRepository';
import { ISpecificationsRepository } from '@modules/cars/repositories/ISpecificationsRepository';
import { RentalsRepository } from '@modules/rental/infra/typeorm/repositories/RentalsRepository';
import { IRentalsRepository } from '@modules/rental/repositories/IRentalsRepository';

container.registerSingleton<ICarsRepository>('CarsRepository', CarsRepository);

container.registerSingleton<ICarsImagesRepository>(
  'CarsImagesRepository',
  CarsImagesRepository
);

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository
);

container.registerSingleton<IRentalsRepository>(
  'RentalsRepository',
  RentalsRepository
);

container.registerSingleton<ISpecificationsRepository>(
  'SpecificationsRepository',
  SpecificationsRepository
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);
