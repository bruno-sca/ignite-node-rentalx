import { inject, injectable } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Rental } from '@modules/rental/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rental/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  id: string;
}

@injectable()
class ReturnRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);

    if (!rental) throw new AppError('Rental does not exists!');
    if (rental.end_date) throw new AppError('Rental already ended!');

    const rentedCar = await this.carsRepository.findById(rental.car_id);

    const rentalElapsedDays = Math.min(
      this.dateProvider.hourDiff(
        rental.start_date,
        this.dateProvider.dateNow()
      ),
      1
    );

    const delay = this.dateProvider.daysDiff(
      this.dateProvider.dateNow(),
      rental.expected_return_date
    );

    let total_amount = rentalElapsedDays * rentedCar.daily_rate;

    if (delay > 0) total_amount += delay * rentedCar.fine_amount;

    rental.end_date = this.dateProvider.dateNow();
    rental.total = total_amount;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailability(rentedCar.id, true);

    return rental;
  }
}

export { ReturnRentalUseCase };
