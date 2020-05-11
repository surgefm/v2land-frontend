// #region Global Imports
import 'isomorphic-unfetch';
import * as React from 'react';
import getConfig from 'next/config';
import App, { AppInitialProps, AppContext } from 'next/app';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import withRedux from 'next-redux-wrapper';
import { PageTransition } from 'next-page-transitions';
import { message } from 'antd';
// #endregion Global Imports

// #region Local Imports
import { theme } from '@Definitions/Styled';
import { appWithTranslation } from '@Server/i18n';
import { AppWithStore, ReduxNextPageContext } from '@Interfaces';
import { makeStore } from '@Redux';
import { isLoggedIn as isLoggedInSelector } from '@Selectors';
import { ClientActions } from '@Actions';
import { Header } from '@Components';

import 'antd/dist/antd.css';
import '@Static/css/common.scss';
// #endregion Local Imports

const {
  publicRuntimeConfig: { API_URL },
} = getConfig();

class WebApp extends App<AppWithStore> {
  componentDidMount() {
    message.config({ top: 64 });
  }

  static async getInitialProps({ Component, ctx }: AppContext): Promise<AppInitialProps> {
    const { store } = ctx as ReduxNextPageContext;
    const isLoggedIn = isLoggedInSelector(store.getState());
    if (!isLoggedIn && ctx.res && ctx.req && ctx.req.headers.cookie) {
      try {
        const response = await fetch(`${API_URL}/client/me`, {
          cache: 'no-cache',
          credentials: 'include',
          headers: {
            cookie: ctx.req.headers.cookie,
            'content-type': 'application/json',
          },
          method: 'GET',
        });
        const { client } = await response.json();
        store.dispatch(ClientActions.AddClient(client));
        store.dispatch(ClientActions.SetLoggedInClient(client.id));
      } catch (err) {
        // Do nothing
      }
    }

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
