import React from 'react';
import { NextPage } from 'next';

import { get } from '@Services/API/Http';
import { redirect as r } from '@Services/Utils';
import { ReduxNextPageContext } from '@Interfaces';

const SSOPage: NextPage = () => {
  return <></>;
};

SSOPage.getInitialProps = async (ctx: ReduxNextPageContext): Promise<any> => {
  const { site, token, verifier, authId, code, redirect } = ctx.query;
  try {
    await get(
      `/auth/${site}/redirect?token=${token}&verifier=${verifier}&authId=${authId}&code=${code}`
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(await (err as any).json());
    return r(ctx, '/login');
  }
  r(ctx, redirect as string);
  return {};
};

export default SSOPage;
