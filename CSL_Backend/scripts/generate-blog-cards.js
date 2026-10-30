// Run from any directory: node scripts/generate-blog-cards.js [--write]
// Without --write, only report what would be processed. Run against a backup first.
const fs = require('fs/promises');
const path = require('path');
const { createCardImage, isBlogImageName } = require('../utills/blogCardImages');

async function generateBlogCards(blogDir, cardDir, write = false) {
  const files = (await fs.readdir(blogDir)).filter(isBlogImageName);
  let created = 0, existing = 0, animated = 0, failed = 0;
  for (const filename of files) {
    try {
      if (await fs.access(path.join(cardDir, `${filename}.webp`)).then(() => true, () => false)) {
        existing++;
      } else if (!write) {
        created++;
      } else if (await createCardImage(await fs.readFile(path.join(blogDir, filename)), filename, cardDir)) {
        created++;
      } else {
        animated++;
      }
    } catch (error) {
      failed++;
      console.error(`${filename}: ${error.message}`);
    }
  }
  return { created, existing, animated, failed };
}

if (require.main === module) {
  const write = process.argv.includes('--write');
  generateBlogCards(path.join(__dirname, '../public/blog'), path.join(__dirname, '../public/blog-card'), write)
    .then(({ created, existing, animated, failed }) => {
      console.log(`${write ? 'Created' : 'Candidates (may include animated or unsupported files)'}: ${created}; already present: ${existing}; animated skipped: ${animated}; failed: ${failed}`);
      if (failed) process.exitCode = 1;
    }).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { generateBlogCards };
