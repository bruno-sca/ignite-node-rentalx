import { inject, injectable } from 'tsyringe';

import { AppError } from '@errors/AppError';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Rental } from '@modules/rental/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rental/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';

interface IRequest {
  car_id: string;
  expected_return_date: Date;
  user_id: string;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({
    car_id,
    expected_return_date,
    user_id,
  }: IRequest): Promise<Rental> {
    const minRentalDuration = 24;
    const carUnavailable = await this.rentalsRepository.findCarActiveRental(
      car_id
    );

    if (carUnavailable) throw new AppError('Car selected is not available!');

    const userActiveRental = await this.rentalsRepository.findUserActiveRental(
      user_id
    );

    if (userActiveRental)
      throw new AppError('User already has an active rental!');

    const compare = this.dateProvider.hourDiff(
      this.dateProvider.dateNow(),
      expected_return_date
    );

    if (compare < minRentalDuration) throw new AppError('Invalid return time!');

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    await this.carsRepository.updateAvailability(car_id, false);

    return rental;
  }
}

export { CreateRentalUseCase };
