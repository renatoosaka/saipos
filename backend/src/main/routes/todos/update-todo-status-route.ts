import { Router } from 'express';
import { updateTodoStatusControllerFactory } from '../../factories/todos';
import { expressRouteAdapter } from '../../adapters/express-route-adapter';

export const updateTodoStatusRoute = (router: Router): void => {
  router.patch(
    '/todos/:id',
    expressRouteAdapter(updateTodoStatusControllerFactory()),
  );
};
