import { ServerError } from '../../errors';
import { ok, serverError, unauthorized } from '../../helpers/http-helpers';
import { Controller } from '../../protocols/controller-protocol';
import { HTTPRequest, HTTPResponse } from '../../protocols/http-protocol';

export class ValidateUserPasswordController implements Controller {
  async handle({ body }: HTTPRequest): Promise<HTTPResponse> {
    try {
      const { password } = body;

      if (password.toLowerCase() !== 'trabalhenasaipos') {
        return unauthorized();
      }

      return ok({
        ok: 'OK',
      });
    } catch (error) {
      return serverError(new ServerError(error.stack));
    }
  }
}
