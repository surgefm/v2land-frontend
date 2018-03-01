/* eslint-disable */

import config from '~/const'

let domain = config.publicPath;
if (domain.slice(-6) === '_nuxt/') {
  domain = domain.slice(0, -6);
}

export default () => {
  (function (d) {
    var config = {
      scriptTimeout: 3000,
      async: true
    },
      h = d.documentElement, t = setTimeout(function () { h.className = h.className.replace(/\bwf-loading\b/g, "") + " wf-inactive"; }, config.scriptTimeout), tk = d.createElement("script"), f = false, s = d.getElementsByTagName("script")[0], a; h.className += " wf-loading"; tk.src = domain + 'typekit.js'; tk.async = true; tk.onload = tk.onreadystatechange = function () { a = this.readyState; if (f || a && a != "complete" && a != "loaded") return; f = true; clearTimeout(t); try { Typekit.load(config) } catch (e) { } }; s.parentNode.insertBefore(tk, s)
  })(document)
}
