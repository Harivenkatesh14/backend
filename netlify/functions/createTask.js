// netlify/functions/createTask.js
const { MongoClient } = require('mongodb');

// Replace with your MongoDB URI
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    const { title, category } = JSON.parse(event.body);
    
    try {
      await client.connect();
      const db = client.db('tasksDb');
      const tasks = db.collection('tasks');
      
      const newTask = {
        title,
        category,
        createdAt: new Date(),
        priority: 'Medium', // Default priority
      };

      const result = await tasks.insertOne(newTask);

      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Task created successfully', task: result.ops[0] }),
      };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to create task' }) };
    } finally {
      await client.close();
    }
  }
};
