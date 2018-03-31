import config from '~/const';

const charset = {};
let current;
let axios;
let fontEl;

export default ({ app, $axios }, inject) => {
  axios = $axios;
  updateFontFace();
  app.router.afterEach(updateFontFace);
  inject('updateFont', updateFontFace);
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

async function checkPageLoad() {
  let newset = getChar();
  while (newset === current) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    newset = getChar();
  }
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
  const char = await checkPageLoad();
  const newset = getUniqueCharset(char);
  if (!newset.length) return;
  let url = 'https://go.justfont.com/jfont/api?';
  url += 't=woff&';
  url += `p=${config.justfont}&`;
  url += `o=${window.location.origin}&`;
  url += `fs=${newset}&`;
  url += 'callback=jfgetData&';
  url += 'fn=notoserifcjktc_bold';
  let { data } = await axios.get(url);
  data = data.replace('jfgetData(', '');
  data = data.slice(0, data.length - 2);
  const json = JSON.parse(data);
  let woff = json.fu[0];
  if (woff.slice(0, 5) === 'http:') {
    woff = 'https:' + woff.slice(5);
  }

  const fontData = await axios.get(woff, { responseType: 'arraybuffer' });
  const base64String = btoa(String.fromCharCode(...new Uint8Array(fontData.data)));
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
      src: local(" "), url(data:font/woff;charset=utf-8;base64,${woff}) format('woff');
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
