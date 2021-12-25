import { Router } from 'express';

import { CreateRentalController } from '@modules/rental/useCases/createRental/CreateRentalController';
import { ListUserRentalsController } from '@modules/rental/useCases/listUserRentals/ListUserRentalsController';
import { ReturnRentalController } from '@modules/rental/useCases/returnRental/ReturnRentalController';

import { ensureAuthenticated } from '../middleware/ensureAuthenticated';

const rentalRoutes = Router();

const createRentalController = new CreateRentalController();
const listUserRentalsController = new ListUserRentalsController();
const returnRentalController = new ReturnRentalController();

rentalRoutes.get(
  '/user',
  ensureAuthenticated,
  listUserRentalsController.handle
);

rentalRoutes.post('/', ensureAuthenticated, createRentalController.handle);
rentalRoutes.post(
  '/return/:id',
  ensureAuthenticated,
  returnRentalController.handle
);

export { rentalRoutes };
