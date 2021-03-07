import { Controller } from '../../../presentation/protocols/controller-protocol';
import { ValidateUserPasswordController } from '../../../presentation/controllers/users/validate-user-password-controller';

export const validateUserPasswordControllerFactory = (): Controller => {
  return new ValidateUserPasswordController();
};
