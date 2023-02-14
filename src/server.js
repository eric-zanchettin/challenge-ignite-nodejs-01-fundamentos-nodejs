import http from 'node:http';
import { randomUUID } from 'node:crypto';
import Database from './database.js';
import json from './utils/json.js';
import csv from './utils/csv.js';
import extractUUID from './utils/extract-route-param.js';

const db = new Database();

const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    if (method === 'GET') {
        const tasks = await db.select('tasks');

        return res.writeHead(200).end(JSON.stringify(tasks));
    };

    if (method === 'POST') {
        await json(res, req);

        await db.insert('tasks', {
            id: randomUUID(),
            ...req.body,
            completed_at: null,
            created_at: new Date(Date.now()),
            updated_at: new Date(Date.now()),
        });

        return res.writeHead(201).end();
    };

    if (method === 'PATCH') {
        const uuid = extractUUID(url);

        const status = await db.completeTask(uuid);

        return res.writeHead(status ? 202 : 404).end(status ? 'Task marcada como concluída' : 'Task não encontrada');
    };

    if (method === 'PUT') {
        const uuid = extractUUID(url);
        await json(res, req);

        const status = await db.update(uuid, req.body);

        return res.writeHead(status ? 202 : 404).end(status ? 'Task atualizada com sucesso' : 'Task não encontrada');
    };

    if (method === 'DELETE') {
        const uuid = extractUUID(url);

        const status = await db.delete('tasks', uuid);

        return res.writeHead(status ? 202 : 404).end(status ? 'Task deletada com sucesso' : 'Task não encontrada');
    };

    return res.writeHead(404).end();
});

server.listen(3333);