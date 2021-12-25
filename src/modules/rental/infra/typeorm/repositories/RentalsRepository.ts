import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rental/dtos/ICreateRentalDTO';
import { IRentalsRepository } from '@modules/rental/repositories/IRentalsRepository';

import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async create(data: ICreateRentalDTO): Promise<Rental> {
    const rental = await this.repository.create({
      ...data,
    });

    await this.repository.save(rental);

    return rental;
  }

  async findById(id: string): Promise<Rental> {
    const activeRental = await this.repository.findOne(id);
    return activeRental;
  }

  async findUserRentals(user_id: string): Promise<Rental[]> {
    const rentals = await this.repository.find({
      where: { user_id },
      relations: ['car'],
    });
    return rentals;
  }

  async findCarActiveRental(car_id: string): Promise<Rental> {
    const activeRental = await this.repository.findOne({
      where: { car_id, end_date: null },
    });
    return activeRental;
  }

  async findUserActiveRental(user_id: string): Promise<Rental> {
    const activeRental = await this.repository.findOne({
      where: { user_id, end_date: null },
    });
    return activeRental;
  }
}

export { RentalsRepository };
