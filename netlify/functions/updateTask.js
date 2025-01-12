// netlify/functions/updateTask.js
const { MongoClient } = require('mongodb');

// Replace with your MongoDB URI
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event, context) => {
  if (event.httpMethod === 'PUT') {
    const { id, title, category, priority } = JSON.parse(event.body);

    try {
      await client.connect();
      const db = client.db('tasksDb');
      const tasks = db.collection('tasks');
      
      const updatedTask = await tasks.findOneAndUpdate(
        { _id: id },
        {
          $set: { title, category, priority }
        },
        { returnDocument: 'after' }
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Task updated successfully', task: updatedTask.value }),
      };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to update task' }) };
    } finally {
      await client.close();
    }
  }
};
