import { Router } from 'express';

import { CreateRentalController } from '@modules/rental/useCases/createRental/CreateRentalController';

import { ensureAuthenticated } from '../middleware/ensureAuthenticated';

const rentalRoutes = Router();

const createRentalController = new CreateRentalController();

rentalRoutes.post('/', ensureAuthenticated, createRentalController.handle);

export { rentalRoutes };
