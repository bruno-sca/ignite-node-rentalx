import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController';
import { UpdateUserAvatarController } from '@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController';
import { UserProfileController } from '@modules/accounts/useCases/userProfile/UserProfileController';
import { ensureAuthenticated } from '@shared/infra/http/middleware/ensureAuthenticated';

const usersRoutes = Router();

const uploadAvatar = multer(uploadConfig);

const createUserController = new CreateUserController();
const userProfileController = new UserProfileController();
const updateUserAvatarController = new UpdateUserAvatarController();

usersRoutes.post('/', createUserController.handle);
usersRoutes.get('/profile', ensureAuthenticated, userProfileController.handle);
usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  uploadAvatar.single('avatar'),
  updateUserAvatarController.handle
);

export { usersRoutes };
