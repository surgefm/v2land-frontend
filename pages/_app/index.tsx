// #region Global Imports
import * as React from 'react';
import App, { AppInitialProps, AppContext } from 'next/app';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import withRedux from 'next-redux-wrapper';
import { PageTransition } from 'next-page-transitions';
// #endregion Global Imports

// #region Local Imports
import { theme } from '@Definitions/Styled';
import { appWithTranslation } from '@Server/i18n';
import { AppWithStore } from '@Interfaces';
import { makeStore } from '@Redux';
import { Header } from '@Components';

import '@Static/css/common.scss';
// #endregion Local Imports

class WebApp extends App<AppWithStore> {
  static async getInitialProps({ Component, ctx }: AppContext): Promise<AppInitialProps> {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps, store, router } = this.props;

    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Header />
          <PageTransition timeout={200} classNames="page-transition">
            <Component {...pageProps} key={router.route} />
          </PageTransition>
          <style jsx global>
            {`
              .page-transition-enter {
                opacity: 0;
              }
              .page-transition-enter-active {
                opacity: 1;
                transition: opacity 200ms;
              }
              .page-transition-exit {
                opacity: 1;
              }
              .page-transition-exit-active {
                opacity: 0;
                transition: opacity 200ms;
              }
            `}
          </style>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default withRedux(makeStore)(appWithTranslation(WebApp));
