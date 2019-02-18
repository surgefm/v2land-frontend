const test = require('ava');
const { Nuxt, Builder } = require('nuxt');
const { resolve } = require('path');

// We keep a reference to Nuxt so we can close
// the server at the end of the test
let nuxt = null;

// Init Nuxt.js and start listening on localhost:4000
test.before('Init Nuxt.js', async t => {
  const rootDir = resolve(__dirname, '..');
  let config = {};
  try {
    config = require(resolve(rootDir, 'nuxt.config.js'));
  } catch (e) {
    // do nothing.
  }
  config.rootDir = rootDir; // project folder
  config.dev = false; // production build
  config.mode = 'universal'; // Isomorphic application
  nuxt = new Nuxt(config);
  await new Builder(nuxt).build();
  nuxt.listen(4000, 'localhost');
});

test('Route /about exits and render HTML', async t => {
  const context = {};
  const { html } = await nuxt.renderRoute('/about', context);
  t.true(html.includes('关于浪潮'));
});

// Close the Nuxt server
test.after('Closing server', t => {
  nuxt.close();
});
