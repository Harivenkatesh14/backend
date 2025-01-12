// netlify/functions/deleteTask.js
const { MongoClient } = require('mongodb');

// Replace with your MongoDB URI
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event, context) => {
  if (event.httpMethod === 'DELETE') {
    const { id } = JSON.parse(event.body);

    try {
      await client.connect();
      const db = client.db('tasksDb');
      const tasks = db.collection('tasks');

      const result = await tasks.deleteOne({ _id: id });

      if (result.deletedCount === 1) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Task deleted successfully' }),
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Task not found' }),
        };
      }
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to delete task' }) };
    } finally {
      await client.close();
    }
  }
};
