const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const AppError = require('../utills/appError');
const errorController = require('../utills/errorController');

test('API errors return JSON in development and when NODE_ENV is unset', async (t) => {
  const previousEnv = process.env.NODE_ENV;
  const app = express();
  app.get('/web/test', (req, res, next) => next(new AppError('Test error', 400)));
  app.use(errorController);
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    if (previousEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnv;
  });

  for (const env of ['development', undefined]) {
    if (env === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = env;
    const response = await fetch(`http://127.0.0.1:${server.address().port}/web/test`, {
      signal: AbortSignal.timeout(3000),
    });
    assert.equal(response.status, 400);
    assert.match(response.headers.get('content-type'), /application\/json/);
    assert.equal((await response.json()).message, 'Test error');
  }
});
