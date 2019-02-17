import queryString from 'query-string';

export default function(req, res, next) {
  const url = req.originalUrl;
  if (url.slice(0, 10) === '/redirect?' ||
    url.slice(0, 15) === '/redirect.html?') {
    const params = queryString.parse(url.slice(url.indexOf('?')));
    if (params.to) {
      res.writeHead(302, { 'Location': params.to });
      return res.end();
    }
  }

  next();
}
