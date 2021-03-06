import { Router } from 'express';
import { showAllTodosControllerFactory } from '../../factories/todos';
import { expressRouteAdapter } from '../../adapters/express-route-adapter';

export const showAllTodosRoute = (router: Router): void => {
  router.get('/todos', expressRouteAdapter(showAllTodosControllerFactory()));
};
