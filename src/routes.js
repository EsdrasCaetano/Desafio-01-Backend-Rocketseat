import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { exportCsv } from '../streams/export-csv.js';

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;
  
      if (!title || !description) {
        const missingFields = [];
        if (!title) missingFields.push('title');
        if (!description) missingFields.push('description');
  
        return res.writeHead(400).end(
          JSON.stringify({
            message: `The following fields are required: ${missingFields.join(', ')}.`,
          }),
        );
      }
  
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
  
      database.insert('tasks', task);
  
      return res.writeHead(201).end();
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', {
        title: search,
        description: search
      })

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
  
      if (!title && !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: 'At least one of the following fields is required: title or description.',
          }),
        );
      }
  
      const [task] = database.select('tasks', { id });
      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({
            message: `Task with ID ${id} not found.`,
          }),
        );
      }
  
      database.update('tasks', id, {
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date(),
      });
  
      return res.writeHead(204).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
  
      const [task] = database.select('tasks', { id });
      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({
            message: `Task with ID ${id} not found.`,
          }),
        );
      }
  
      database.delete('tasks', id);
  
      return res.writeHead(204).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
  
      const [task] = database.select('tasks', { id });
      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({
            message: `Task with ID ${id} not found.`,
          }),
        );
      }
  
      const isTaskCompleted = !!task.completed_at;
      const completed_at = isTaskCompleted ? null : new Date();
  
      database.update('tasks', id, { completed_at });
  
      return res.writeHead(204).end();
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/export'),
    handler: async (req, res) => {
      const csvPath = 'tasks.csv';
  
      try {
        res.writeHead(202, { 'Content-Type': 'text/plain' }).end(`Export started. The file will be available at ${csvPath} shortly.`);
  
        await database.ensureLoaded();
  
        const tasks = database.select('tasks');
        await exportCsv(tasks, csvPath);
      } catch (error) {
        console.error('Error exporting tasks:', error.message);
      }
    }
  }
]