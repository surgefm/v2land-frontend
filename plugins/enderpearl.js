export default () => {
  const hook = function(document) {
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute(
      'src',
      'https://enderman.v2land.net/enderpearl/bundle.js',
    );
    window.__ENDERPEARL_OPTION__ = {
      reportBaseUrl: 'https://enderman.v2land.net/',
      repositoryName: 'v2land',
    };
    document.body.appendChild(scriptElement);
  };

  if (typeof document !== 'undefined') {
    hook(document);
  }
};
