import { Express, Router } from 'express';
import {
  showAllTodosRoute,
  createTodoRoute,
  updateTodoStatusRoute,
} from '../routes/todos';
import { validateUserPasswordRoute } from '../routes/users';

export default (app: Express): void => {
  const router = Router();

  app.use('/api', router);

  router.get('/', (_, response) => {
    return response.json({
      message: 'Hello world',
    });
  });

  createTodoRoute(router);
  updateTodoStatusRoute(router);
  showAllTodosRoute(router);

  validateUserPasswordRoute(router);
};
