export class TodoNotFoundError extends Error {
  constructor(id: string) {
    super(`Todo with id ${id} does not exists`);
    this.name = 'TodoNotFoundError';
  }
}
