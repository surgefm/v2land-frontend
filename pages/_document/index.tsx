// #region Global Imports
import * as React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
// #endregion Global Imports

class WebAppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const antdCache = createCache();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => {
            const A = App as any;
            return sheet.collectStyles(
              <StyleProvider cache={antdCache}>
                <A {...props} />
              </StyleProvider>
            );
          },
        });

      const initialProps = await Document.getInitialProps(ctx);
      const antdStyle = extractStyle(antdCache, true);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
            <style dangerouslySetInnerHTML={{ __html: antdStyle }} />
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <meta charSet="utf-8" />
          <meta name="lang" property="lang" content="zh-hans" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default WebAppDocument;
