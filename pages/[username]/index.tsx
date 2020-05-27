// #region Global Imports
import React from 'react';
import { useSelector } from 'react-redux';
import { NextPage } from 'next';
// #endregion Global Imports

// #region Local Imports
import { withTranslation } from '@Server/i18n';
import { Background, Footer, Card, EventTitle } from '@Components';
import { ClientActions } from '@Actions';
import { getClientWithUsername, getClient } from '@Selectors';
import { UtilService } from '@Services';
// #endregion Local Imports

// #region Interface Imports
import { IClientPage, ReduxNextPageContext } from '@Interfaces';
// #endregion Interface Imports

const ClientPage: NextPage<IClientPage.IProps, IClientPage.InitialProps> = ({ clientId }) => {
  const client = useSelector(getClient(clientId));
  if (!client) return <React.Fragment />;

  return (
    <Background>
      <Card>
        <EventTitle>{client.username}</EventTitle>
      </Card>
      <Footer />
    </Background>
  );
};

ClientPage.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IClientPage.InitialProps> => {
  const props = { namespacesRequired: ['common'] };

  let username = ctx.query.username as string;
  if (+username === +username) {
    UtilService.redirect(ctx, `/@Newspect/${username}`);
    return props;
  }

  if (username.startsWith('@')) username = username.slice(1);
  let client = getClientWithUsername(username)(ctx.store.getState());

  if (!client) {
    await ctx.store.dispatch(ClientActions.GetClient(username));
  }

  client = getClientWithUsername(username)(ctx.store.getState());
  if (!client) {
    UtilService.redirect(ctx, '/', { hiddenQuery: { client_not_found: 1 } });
    return props;
  }

  return {
    ...props,
    clientId: client.id,
  };
};

export default withTranslation('common')(ClientPage);
