export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`then email ${email} is not valid`);
    this.name = 'InvalidEmailError';
  }
}
