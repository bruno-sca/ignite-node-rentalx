import { Request, Response, Router } from 'express';

import { CategoriesRepository } from '../modules/cars/repositories/CategoriesRepository';
import { CreateCategoryService } from '../modules/cars/services/CreateCategoryService';

const categoriesRoutes = Router();

const categoriesRepository = new CategoriesRepository();

categoriesRoutes.get('/', (request: Request, response: Response) => {
  const categories = categoriesRepository.list();

  return response.json(categories);
});

categoriesRoutes.post('/', (request: Request, response: Response) => {
  const { name, description } = request.body;

  const createCategoryService = new CreateCategoryService(categoriesRepository);

  createCategoryService.execute({ name, description });

  // return response.status(400).json({ error: 'Category name already exists!' });

  return response.status(201).json();
});

export { categoriesRoutes };
