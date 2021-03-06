import mysql from 'mysql2/promise';

export interface MySQLConnectionOptions {
  user: string;
  password: string;
  host: string;
  database: string;
  port?: number;
}

export const MySQLDB = {
  client: (null as unknown) as mysql.Connection,
  async connect(options: MySQLConnectionOptions): Promise<void> {
    const conn = await mysql.createConnection({
      ...options,
    });

    this.client = conn;
  },
  async disconnect(): Promise<void> {
    await this.client.end();
    this.client = null;
  },
};
