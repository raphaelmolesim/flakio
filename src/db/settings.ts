import { Database } from 'bun:sqlite';
import { findOrCreateTable, insertInto } from './data_mapper';

export interface Settings {
  id?: number;
  key: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export class SettingsDatabase {
  private db: Database;

  constructor(db: Database) {
    this.db = db
  }

  database() {
    return findOrCreateTable(this.db, 'settings').then(() => { return this.db })
  }

  async all() {
    return await this.database().then((db) => db.query('SELECT * FROM settings').all())
  }

  async create(settings: Settings) {
    const now = new Date().toISOString()
    console.log("Date now:", now, typeof(now), settings)
    return await this.database().then((db) => {
      return insertInto(db, 'settings', {
        key: settings.key,
        value: settings.value
      })
    })
  }

  async destroy(id: number) {
    return await this.database().then((db) => db.query(`DELETE FROM settings WHERE id = ?`).run(id))
  }

  async update(key: string, value: string) {
    const parsedValue = (typeof(value) === "object") ? JSON.stringify(value) : value
    return await this.database().then((db) => db.query(`UPDATE settings SET value = ?, updated_at = ? WHERE key = ?`).run(parsedValue, new Date().toISOString(), key))
  }
}