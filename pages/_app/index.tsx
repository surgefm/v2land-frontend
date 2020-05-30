// #region Global Imports
import 'isomorphic-unfetch';
import * as React from 'react';
import App, { AppInitialProps, AppContext } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
// #endregion Global Imports

// #region Local Imports
import { appWithTranslation } from '@Server/i18n';
import { AppWithStore, ReduxNextPageContext } from '@Interfaces';
import { makeStore } from '@Redux';
import { isLoggedIn as isLoggedInSelector } from '@Selectors';
import { ClientActions, AppActions } from '@Actions';
import { Header } from '@Components';
import { setCookies, clearCookies, RedstoneService } from '@Services';

import 'antd/dist/antd.min.css';
import '@Static/css/common.scss';
// #endregion Local Imports

class WebApp extends App<AppWithStore> {
  static async getInitialProps({ Component, ctx }: AppContext): Promise<AppInitialProps> {
    clearCookies();
    const { store } = ctx as ReduxNextPageContext;
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

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps, store, router } = this.props;

    return (
      <Provider store={store}>
        <ConfigProvider locale={zhCN}>
          <Head>
            <meta
              key="keywords"
              name="keywords"
              content="浪潮,社会事件,事件,中国,追踪,社会,关注,langchao,v2land"
            />
            <meta
              key="description"
              name="description"
              content="浪潮是一个社会事件追踪工具。我们帮助你跟进社会事件的最新动态。你也可参与到信息整合的过程中，与社区成员一起添加社会事件与相关资讯，协助他人追踪事件进展。"
            />
            <meta key="twitter:card" name="twitter:card" content="summary" />
            <meta key="twitter:site" name="twitter:site" content="@Wave2Land" />
            <meta key="twitter:title" name="twitter:title" content="浪潮 - 你的社会事件追踪工具" />
            <meta
              key="twitter:description"
              name="twitter:description"
              content="浪潮是一个社会事件追踪工具。我们帮助你跟进社会事件的最新动态。你也可参与到信息整合的过程中，与社区成员一起添加社会事件与相关资讯，协助他人追踪事件进展。"
            />
            <meta
              key="twitter:image"
              name="twitter:image"
              content="https://assets.v2land.net/twitter-icon.png"
            />
            <meta key="og:title" property="og:title" content="浪潮 - 你的社会事件追踪工具" />
            <meta key="og:type" property="og:type" content="website" />
            <meta
              key="og:description"
              property="og:description"
              content="浪潮是一个社会事件追踪工具。我们帮助你跟进社会事件的最新动态。你也可参与到信息整合的过程中，与社区成员一起添加社会事件与相关资讯，协助他人追踪事件进展。"
            />
            <meta
              key="og:image"
              name="og:image"
              content="https://assets.v2land.net/twitter-icon.png"
            />
            <meta key="og:site_name" name="og:site_name" content="浪潮" />
          </Head>
          <Header />
          <Component {...pageProps} key={router.route} />
          <style jsx>
            {`
              :global(body) {
                margin: 0;
                color: rgba(0, 0, 0, 0.65);
                font-size: 14px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
                  Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
                  'Segoe UI Symbol', 'Noto Color Emoji';
                font-variant: tabular-nums;
                line-height: 1.5715;
                font-feature-settings: 'tnum';
              }

              :global(.ant-avatar-string) {
                font-size: 14px;
              }
            `}
          </style>
        </ConfigProvider>
      </Provider>
    );
  }
}

export default withRedux(makeStore)(appWithTranslation(WebApp));
