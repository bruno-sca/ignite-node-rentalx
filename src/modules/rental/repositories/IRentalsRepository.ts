import { ICreateRentalDTO } from '../dtos/ICreateRentalDTO';
import { Rental } from '../infra/typeorm/entities/Rental';

interface IRentalsRepository {
  create(data: ICreateRentalDTO): Promise<Rental>;
  findCarActiveRental(car_id: string): Promise<Rental>;
  findUserActiveRental(user_id: string): Promise<Rental>;
}

export { IRentalsRepository };
