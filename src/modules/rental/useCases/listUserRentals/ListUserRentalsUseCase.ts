import { inject, injectable } from 'tsyringe';

import { Rental } from '@modules/rental/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rental/repositories/IRentalsRepository';

@injectable()
class ListUserRentalsUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository
  ) {}

  async execute(user_id: string): Promise<Rental[]> {
    const userRentals = await this.rentalsRepository.findUserRentals(user_id);
    return userRentals;
  }
}

export { ListUserRentalsUseCase };
