const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const { randomUUID } = require('crypto');

const isBlogImageName = (name) =>
  typeof name === 'string' && /^image_2-[a-zA-Z0-9_-]+\.(png|jpe?g|webp|gif)$/i.test(name);

async function createCardImage(input, filename, cardDir) {
  if (!isBlogImageName(filename)) throw new Error('Invalid blog image name');
  const metadata = await sharp(input, { animated: true, limitInputPixels: 40000000 }).metadata();
  if (metadata.pages > 1) return false;
  const image = await sharp(input, { limitInputPixels: 40000000 })
    .rotate().resize({ width: 960, height: 960, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 88 }).toBuffer();
  await fs.mkdir(cardDir, { recursive: true });
  // Publish only a complete file; another migration process may finish first.
  const destination = path.join(cardDir, `${filename}.webp`);
  const temporary = path.join(cardDir, `.${randomUUID()}.tmp`);
  try {
    await fs.writeFile(temporary, image, { flag: 'wx' });
    await fs.link(temporary, destination);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  } finally {
    await fs.unlink(temporary).catch((error) => {
      if (error.code !== 'ENOENT') console.error('Unable to remove temporary blog card:', error.message);
    });
  }
  return true;
}

function generateUploadedBlogCard(cardDir) {
  return async (req, res, next) => {
    const file = req.files?.image_2?.[0];
    const filename = typeof req.body.image_2 === 'string' ? path.basename(req.body.image_2) : '';
    if (file && isBlogImageName(filename)) {
      try {
        await createCardImage(file.buffer, filename, cardDir);
      } catch (error) {
        // The upload remains usable through the original image.
        console.error('Unable to create blog card image:', error.message);
      }
    }
    next();
  };
}

function createBlogCardHandler(blogDir, cardDir) {
  return async (req, res) => {
    const filename = req.params.filename.endsWith('.webp')
      ? req.params.filename.slice(0, -5)
      : '';
    if (!isBlogImageName(filename)) return res.sendStatus(404);
    const original = path.join(blogDir, filename);
    try {
      await fs.access(original);
      const card = path.join(cardDir, `${filename}.webp`);
      const exists = await fs.access(card).then(() => true, () => false);
      if (!exists) {
        res.set('Cache-Control', 'no-store');
        return res.redirect(302, `../blog/${encodeURIComponent(filename)}`);
      }
      res.set('Cache-Control', 'public, max-age=86400');
      return res.sendFile(card, (error) => {
        if (!error || res.headersSent || error.code === 'ECONNABORTED') return;
        res.sendStatus(error.statusCode === 404 ? 404 : 500);
      });
    } catch {
      return res.sendStatus(404);
    }
  };
}

module.exports = { createCardImage, createBlogCardHandler, generateUploadedBlogCard, isBlogImageName };
