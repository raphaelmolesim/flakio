import { Database } from 'bun:sqlite';
import { findOrCreateTable } from './data_mapper';

export interface Crendetials {
  id?: number;
  project_id: string;
  api_url: string;
  private_token: string;
}

export class CredentialsDatabase {
  private db: Database;

  constructor() {
    this.db = new Database('credentials.db', { create: true });
    findOrCreateTable(this.db, 'credentials')
  }

  all() {
    return this.db.query('SELECT * FROM credentials').all();
  }

  create(credentials: Crendetials) {
    return this.db.query(`INSERT INTO credentials (project_id, api_url, private_token) VALUES (?, ?, ?) RETURNING id`).get(credentials.project_id, credentials.api_url, credentials.private_token) as Book;
  }

  destroy(id: number) {
    return this.db.query(`DELETE FROM credentials WHERE id = ?`).run(id);
  }

  update(id: number, params: Crendetials) {
    return this.db.query(`UPDATE credentials SET project_id = ?, api_url = ?, private_token = ? WHERE id = ?`).run(params.project_id, params.api_url, params.private_token, id);
  }
}