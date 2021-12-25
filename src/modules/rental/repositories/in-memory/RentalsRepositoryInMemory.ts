import { ICreateRentalDTO } from '@modules/rental/dtos/ICreateRentalDTO';
import { Rental } from '@modules/rental/infra/typeorm/entities/Rental';

import { IRentalsRepository } from '../IRentalsRepository';

class RentalsRepositoryInMemory implements IRentalsRepository {
  rentals: Rental[] = [];

  async create(data: ICreateRentalDTO): Promise<Rental> {
    const rental = new Rental();

    Object.assign(rental, {
      ...data,
      start_date: new Date(),
    });

    this.rentals.push(rental);

    return rental;
  }

  async findById(id: string): Promise<Rental> {
    return this.rentals.find((rental) => rental.id === id);
  }

  async findUserRentals(user_id: string): Promise<Rental[]> {
    return this.rentals.filter((rental) => user_id === rental.user_id);
  }

  async findCarActiveRental(car_id: string): Promise<Rental> {
    return this.rentals.find(
      (rental) => rental.car_id === car_id && !rental.end_date
    );
  }

  async findUserActiveRental(user_id: string): Promise<Rental> {
    return this.rentals.find(
      (rental) => rental.user_id === user_id && !rental.end_date
    );
  }
}

export { RentalsRepositoryInMemory };
