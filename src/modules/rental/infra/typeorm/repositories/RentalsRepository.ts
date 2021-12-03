import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rental/dtos/ICreateRentalDTO';
import { IRentalsRepository } from '@modules/rental/repositories/IRentalsRepository';

import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async create({
    car_id,
    expected_return_date,
    user_id,
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = await this.repository.create({
      car_id,
      expected_return_date,
      user_id,
    });

    await this.repository.save(rental);

    return rental;
  }

  async findCarActiveRental(car_id: string): Promise<Rental> {
    const activeRental = await this.repository.findOne({ car_id });
    return activeRental;
  }

  async findUserActiveRental(user_id: string): Promise<Rental> {
    const activeRental = await this.repository.findOne({ user_id });
    return activeRental;
  }
}

export { RentalsRepository };
