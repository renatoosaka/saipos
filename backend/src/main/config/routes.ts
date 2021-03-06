import { Express, Router } from 'express';
import { showAllTodosRoute, createTodoRoute } from '../routes/todos';

export default (app: Express): void => {
  const router = Router();

  app.use('/api', router);

  router.get('/', (_, response) => {
    return response.json({
      message: 'Hello world',
    });
  });

  createTodoRoute(router);
  showAllTodosRoute(router);
};
