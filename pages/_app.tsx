// #region Global Imports
import 'isomorphic-unfetch';
import * as React from 'react';
import App, { AppInitialProps, AppContext, AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
// #endregion Global Imports

// #region Local Imports
import { storeWrapper } from '@Redux';
import { isLoggedIn as isLoggedInSelector } from '@Selectors';
import { ClientActions, AppActions } from '@Actions';
import { Header, BasicHead } from '@Components';
import { setCookies, clearCookies, RedstoneService } from '@Services';

import 'antd/dist/antd.min.css';
import '@Static/css/styles.scss';

const SurgeApp: React.FC<AppProps> = ({ Component, router, ...rest }) => {
  const { store, props } = storeWrapper.useWrappedStore(rest);
  const C = Component as any;

  return (
    <Provider store={store}>
      <ConfigProvider>
        <BasicHead />
        <Header />
        <C {...props.pageProps} key={router.route} />
      </ConfigProvider>
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
