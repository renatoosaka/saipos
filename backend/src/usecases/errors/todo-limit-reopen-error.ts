export class TodoLimitReopenError extends Error {
  constructor(id: string) {
    super(
      `Todo with id ${id} reached limits for reopen. Max permitted reopen count is 2`,
    );
    this.name = 'TodoLimitReopenError';
  }
}
