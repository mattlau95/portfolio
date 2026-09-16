// Keep Puppeteer's Chrome download inside this folder instead of
// ~/.cache/puppeteer, so nothing from the check tooling lands in the home
// directory. Found by searching up from the working directory, which is why
// the checks run through `npm run` (cwd = this folder), not bare `node`.
const { join } = require('path');

module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
