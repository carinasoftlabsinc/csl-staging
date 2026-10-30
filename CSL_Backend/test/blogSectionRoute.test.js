const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const Blog = require('../model/blog.model');
const auth = require('../controller/AuthController');

test('get blog section reads the requested section without modifying it', async (t) => {
  const originalProtect = auth.protect;
  const originalFindById = Blog.findById;
  const section = { _id: 'section-id', heading: 'Existing heading' };
  let saves = 0;
  auth.protect = (req, res, next) => next();
  Blog.findById = async (id) => id === 'blog-id' ? {
    sections: { id: (sectionId) => sectionId === 'section-id' ? section : null },
    save: async () => { saves++; },
  } : null;

  const app = express();
  app.use(express.json());
  app.use(require('../routes/admin/blog.router'));
  app.use((err, req, res, next) => res.status(err.statusCode || 500).json({ message: err.message }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    auth.protect = originalProtect;
    Blog.findById = originalFindById;
  });

  const base = `http://127.0.0.1:${server.address().port}/get_blog_section`;
  const response = await fetch(`${base}/blog-id/section-id`);
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, section);
  assert.equal((await fetch(`${base}/blog-id/missing`)).status, 404);
  assert.equal((await fetch(`${base}/missing/section-id`)).status, 404);
  assert.equal(saves, 0);
});
