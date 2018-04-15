import config from '~/const';

const charset = {};
let $app;
let current;
let axios;
let fontEl;

export default async ({ app, $axios }, inject) => {
  $app = app;
  axios = $axios;
  inject('updateFont', updateFontFace);
  setInterval(updateFontFace, 500);
};

function getChar(parent = document.getElementsByTagName('body')[0], force = false) {
  const charset = [];
  let insert = force;
  if (parent.classList) {
    for (const className of ['title', 'event-title']) {
      if (parent.classList.contains(className)) {
        insert = true;
        break;
      }
    }
  }

  if (parent.childNodes && parent.childNodes.length) {
    for (const child of parent.childNodes) {
      if (child.nodeName !== 'SCRIPT') {
        if (child.nodeName === '#text' && insert) {
          charset.push(child.nodeValue.trim());
        } else if (child.nodeName !== '#text') {
          charset.push(getChar(child, insert));
        }
      }
    }

    return charset.join('');
  } else {
    return [];
  }
}

function wait(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

async function stopLoading() {
  const loading = await getLoading();
  loading.finish();
}

async function getLoading() {
  while (!$app.router.app) {
    await wait();
  }
  return $app.router.app.$root.$loading;
}

function checkPageLoad() {
  const newset = getChar();
  current = newset;
  return newset;
}

function getUniqueCharset(set) {
  const array = [];
  for (const char of set) {
    if (!charset[char]) {
      charset[char] = true;
      array.push(char);
    }
  }
  return array.join('');
}

async function getWoffUrl() {
  const char = checkPageLoad();
  const newset = getUniqueCharset(char);
  if (!newset.length) return;
  let url = 'https://go.justfont.com/jfont/api?';
  url += 't=woff&';
  url += `p=${config.justfont}&`;
  url += `o=${window.location.origin}&`;
  url += `fs=${newset}&`;
  url += 'callback=jfgetData&';
  url += 'fn=notoserifcjktc_bold';
  let data = await axios.$get(url, { progress: false });
  data = data.replace('jfgetData(', '');
  data = data.slice(0, data.length - 2);
  const json = JSON.parse(data);
  let woff = json.fu[0];
  if (woff.slice(0, 5) === 'http:') {
    woff = 'https:' + woff.slice(5);
  }

  const fontData = await axios.$get(woff, { responseType: 'arraybuffer', progress: false });
  stopLoading();
  const base64String = btoa(String.fromCharCode(...new Uint8Array(fontData)));
  return base64String;
}

async function updateFontFace() {
  const woff = await getWoffUrl();
  if (!woff) return;
  if (!fontEl) {
    fontEl = document.createElement('style');
    fontEl.setAttribute('type', 'text/css');
    fontEl.setAttribute('font', 'justfont');
    document.head.appendChild(fontEl);
  }
  fontEl.appendChild(document.createTextNode(`
    @font-face {
      font-family: 'source-han-serif-sc';
      font-weight: 700;
      src: url(data:font/woff;charset=utf-8;base64,${woff}) format('woff');
      unicode-range: ${getUnicodeRange(current)};
    }
  `));
}

function getUnicodeRange(charset) {
  const range = [];
  for (const char of charset) {
    range.push('U+' + char.charCodeAt(0).toString(16));
  }
  return range.join(',');
}
