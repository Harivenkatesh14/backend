// netlify/functions/prioritizeTask.js
const { MongoClient } = require('mongodb');

// Replace with your MongoDB URI
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event, context) => {
  if (event.httpMethod === 'PATCH') {
    const { id, priority } = JSON.parse(event.body);

    try {
      await client.connect();
      const db = client.db('tasksDb');
      const tasks = db.collection('tasks');
      
      const updatedTask = await tasks.findOneAndUpdate(
        { _id: id },
        { $set: { priority } },
        { returnDocument: 'after' }
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Task prioritized successfully', task: updatedTask.value }),
      };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to prioritize task' }) };
    } finally {
      await client.close();
    }
  }
};
