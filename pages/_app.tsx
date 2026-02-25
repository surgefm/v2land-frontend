// #region Global Imports
import 'isomorphic-unfetch';
import React, { useEffect } from 'react';
import App, { AppInitialProps, AppContext, AppProps } from 'next/app';
import Script from 'next/script';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
// #endregion Global Imports

// #region Local Imports
import { storeWrapper } from '@Redux';
import { isLoggedIn as isLoggedInSelector } from '@Selectors';
import { ClientActions, AppActions } from '@Actions';
import { Header, BasicHead } from '@Components';
import { setCookies, clearCookies, RedstoneService, gtag } from '@Services';

import '@Static/css/antd.scss';
import '@Static/css/styles.scss';

const SurgeAppContent: React.FC<{ Component: any; router: AppProps['router']; pageProps: any }> = ({ Component, router, pageProps }) => {
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const C = Component as any;

  return (
    <ConfigProvider>
      <BasicHead />
      <Header />
      <C {...pageProps} key={router.route} />

      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </ConfigProvider>
  );
};

const SurgeApp: React.FC<AppProps> = ({ Component, router, ...rest }) => {
  const { store, props } = storeWrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <SurgeAppContent Component={Component} router={router} pageProps={props.pageProps} />
    </Provider>
  );
};

(SurgeApp as any).getInitialProps = storeWrapper.getInitialAppProps(
  store => async (context: AppContext): Promise<AppInitialProps> => {
    const { ctx } = context;
    clearCookies();
    if (ctx.res) {
      store.dispatch(AppActions.Reset());
    }
    const isLoggedIn = isLoggedInSelector(store.getState());
    if (!isLoggedIn && ctx.res && ctx.req && ctx.req.headers.cookie) {
      try {
        setCookies(ctx.req.headers.cookie);
        const { client } = await RedstoneService.getClientInfo();
        store.dispatch(ClientActions.AddClient(client));
        store.dispatch(ClientActions.SetLoggedInClient(client.id));
      } catch (err) {
        // Do nothing
      }
    }

    return {
      pageProps: {
        ...(await App.getInitialProps(context)).pageProps,
      },
    };
  }
);

export default SurgeApp;
