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
    this.db = new Database('credentials.db', { create: true })
  }

  database() {
    return findOrCreateTable(this.db, 'credentials').then(() => { return this.db })
  }

  async all() {
    return await this.database().then((db) => db.query('SELECT * FROM credentials').all())
  }

  async create(credentials: Crendetials) {
    return await this.database().then((db) => db.query(`INSERT INTO credentials (project_id, api_url, private_token) VALUES (?, ?, ?) RETURNING id`).get(credentials.project_id, credentials.api_url, credentials.private_token) as Credentials)
  }

  async destroy(id: number) {
    return await this.database().then((db) => db.query(`DELETE FROM credentials WHERE id = ?`).run(id))
  }

  async update(id: number, params: Crendetials) {
    return await this.database().then((db) => db.query(`UPDATE credentials SET project_id = ?, api_url = ?, private_token = ? WHERE id = ?`).run(params.project_id, params.api_url, params.private_token, id))
  }
}