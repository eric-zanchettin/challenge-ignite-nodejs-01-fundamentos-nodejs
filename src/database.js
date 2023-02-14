import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export default class Database {
    #db = {};

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#db));
    };

    constructor() {
        fs.readFile(databasePath, 'utf-8')
            .then(data => {
                this.#db = JSON.parse(data);
            })
            .catch(() => {
                this.#persist();
            });
    };

    async select(table) {
        let data = this.#db[table] ?? [];

        return data;
    };

    async insert(table, data) {
        try {
            this.#db[table].push(data)
        } catch {
            this.#db[table] = [data];
        };

        this.#persist();

        return;
    };

    async completeTask(uuid) {
        try {
            const task = this.#db.tasks.find(task => task.id === uuid);

            task.completed_at = new Date();
            task.updated_at = new Date();

            return true;
        } catch {
            return false;
        };
    };

    async update(uuid, data) {
        try {
            const task = this.#db.tasks.find(task => task.id === uuid);

            task.title = data.title;
            task.description = data.description;
            task.completed_at = data.completed ? new Date() : null;
            task.updated_at = new Date();

            return true;
        } catch {
            return false;
        };
    };

    async delete(table, uuid) {
        const rowIdx = this.#db[table].findIndex(row => row.id === uuid);
        
        if (rowIdx >= 0) {
            this.#db[table].splice(rowIdx, 1);

            return true;
        }
        
        return false;
    };
};