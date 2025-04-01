import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {};
  #isLoaded = false;

  constructor() {
    this.#loadDatabase();
  }

  async #loadDatabase() {
    if (this.#isLoaded) return;

    try {
      const data = await fs.readFile(databasePath, 'utf8');
      this.#database = JSON.parse(data);
    } catch {
      this.#database = {};
      this.#persist();
    }

    this.#isLoaded = true;
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
  }

  async ensureLoaded() {
    if (!this.#isLoaded) {
      await this.#loadDatabase();
    }
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          if (!value) return true;
          return row[key]?.includes(value);
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (!Array.isArray(this.#database[table])) {
      this.#database[table] = [];
    }
    this.#database[table].push(data);
    this.#persist();
    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { ...this.#database[table][rowIndex], ...data };
      this.#persist();
    } else {
      throw new Error(`Task with ID ${id} not found`);
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    } else {
      throw new Error(`Task with ID ${id} not found`);
    }
  }

  toggleComplete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      const now = new Date().toISOString();
      this.#database[table][rowIndex] = {
        ...this.#database[table][rowIndex],
        completed_at: this.#database[table][rowIndex].completed_at ? null : now
      };
      this.#persist();
    } else {
      throw new Error(`Task with ID ${id} not found`);
    }
  }
}