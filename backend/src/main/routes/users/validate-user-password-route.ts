import { Router } from 'express';
import { expressRouteAdapter } from '../../adapters/express-route-adapter';
import { validateUserPasswordControllerFactory } from '../../factories/users';

export const validateUserPasswordRoute = (router: Router): void => {
  router.post(
    '/users/validate',
    expressRouteAdapter(validateUserPasswordControllerFactory()),
  );
};
