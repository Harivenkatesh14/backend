// netlify/functions/tasks.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Here are your tasks' }),
  };
};
