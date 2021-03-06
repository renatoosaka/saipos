import { Router } from 'express';
import { createTodoControllerFactory } from '../../factories/todos';
import { expressRouteAdapter } from '../../adapters/express-route-adapter';

export const createTodoRoute = (router: Router): void => {
  router.post('/todos', expressRouteAdapter(createTodoControllerFactory()));
};
