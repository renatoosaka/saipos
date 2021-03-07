export interface AddHistoryDTO {
  type: 'created' | 'completed' | 'reopened';
  todo_id: string;
}

export interface AddHistory {
  add(data: AddHistoryDTO): Promise<void>;
}
