export interface CountTodoTypeHistoryDTO {
  todo_id: string;
  type: string;
}

export interface CountTodoTypeHistory {
  count(data: CountTodoTypeHistoryDTO): Promise<number>;
}
