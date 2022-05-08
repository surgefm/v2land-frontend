// #region Global Imports
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Space, Button } from 'antd';
import { StarOutlined, SisternodeOutlined } from '@ant-design/icons';
// #endregion Global Imports

// #region Local Imports
import { useTranslation } from '@I18n';
import {
  HeaderCard,
  ClientHead,
  Footer,
  EventCard,
  EventTitle,
  ClientAvatar,
  SectionHeader,
  Wall,
} from '@Components';
import { ClientActions } from '@Actions';
import { getClientWithUsername, getClient, getLoggedInClientId } from '@Selectors';
import { UtilService } from '@Services';
// #endregion Local Imports

// #region Interface Imports
import { IClientPage, ReduxNextPageContext } from '@Interfaces';
// #endregion Interface Imports

const ClientPage: NextPage<IClientPage.IProps, IClientPage.InitialProps> = ({ clientId }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const client = useSelector(getClient(clientId));
  const loggedInClientId = useSelector(getLoggedInClientId);
  const [numEventColumns, setNumEventColumns] = useState<number>(0);
  const events = client && client.events ? client.events : [];
  events.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  if (!client) return <React.Fragment />;

  const isCurrentClient = loggedInClientId === clientId;

  const handleEditClick = () => router.push('/settings');

  const getClientInfoComponent = () => {
    return (
      <div className="row">
        <div className="large">
          <ClientAvatar clientId={client.id} size={160} showTooltip={false} />
        </div>
        <div className="small">
          <ClientAvatar clientId={client.id} size={48} showTooltip={false} className="small" />
        </div>
        <div className="info">
          <Space direction="vertical">
            <div className="name">
              <EventTitle>
                {client.nickname || ''}
                <span className="username">
                  {client.nickname ? ' ' : ''}@{client.username}
                </span>
              </EventTitle>
            </div>
            <p style={{ whiteSpace: 'pre-line' }}>
              {client.description || t('Client_NoDescription')}
            </p>

            <Space style={{ transform: 'translateX(-0.5rem)' }}>
              <Link href={`/@${client.username}`}>
                <a href={`/@${client.username}`}>
                  <Button type="text" size="small">
                    <SisternodeOutlined />
                    {client.events && client.events.length > 0
                      ? `${client.events.length} 条时间线`
                      : '暂无贡献'}
                  </Button>
                </a>
              </Link>
              <Link href={`/@${client.username}/star`}>
                <a href={`/@${client.username}/star`}>
                  <Button type="text" size="small">
                    <StarOutlined />
                    {client.stars && client.stars.length > 0
                      ? `${client.stars.length} 个收藏`
                      : '暂无收藏'}
                  </Button>
                </a>
              </Link>
            </Space>
          </Space>
          {isCurrentClient ? (
            <div className="edit-buttons">
              <Button onClick={handleEditClick}>{t('Client_Edit')}</Button>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="top">
      <ClientHead clientId={clientId} />
      <HeaderCard>{getClientInfoComponent()}</HeaderCard>
      <div
        className="body"
        style={{ visibility: events.length > 0 && numEventColumns > 0 ? 'visible' : 'hidden' }}
      >
        <div
          style={{
            width: `${Math.max(25 * numEventColumns - 1, 24)}rem`,
          }}
          className={`${numEventColumns === 1 && 'only-one'}`}
        >
          <SectionHeader>
            {client.stars && client.stars.length > 0
              ? `${client.nickname || `@${client.username}`} 的收藏`
              : `${client.nickname || `@${client.username}`} 暂无收藏`}
          </SectionHeader>
        </div>
        <Wall
          elementProps={(client.stars || []).map(star => ({
            eventId: star.eventId,
            forcePlain: true,
          }))}
          elementWidth={24}
          gutterWidth={1}
          Component={EventCard}
          onSetColumns={setNumEventColumns}
        />
      </div>
      <Footer />
      <div style={{ height: '1rem' }} />
      <style jsx>
        {`
          .top :global(.row) {
            display: flex;
            width: 100%;
          }

          .top :global(.info) {
            margin-left: 1rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-grow: 1;
            width: calc(100% - 160px - 1rem);
          }

          .top :global(.name) {
            display: inline-flex;
            flex-wrap: wrap;
          }

          .top :global(.name) > :global(*):first-child {
            margin-right: 0.5rem;
          }

          .top :global(.username) {
            font-size: 2rem;
            white-space: nowrap;
            font-weight: 200;
          }

          .top :global(.edit-buttons) {
            display: flex;
            justify-content: flex-end;
          }

          .top :global(.ant-avatar-string) {
            font-size: 96px;
          }

          .top :global(.small) {
            position: fixed;
            left: -10000rem;
          }

          @media (max-width: 600px) {
            .top :global(.small) {
              position: relative;
              left: 0;
            }

            .top :global(.large) {
              position: fixed;
              left: -10000rem;
            }
          }

          .body {
            position: relative;
            z-index: 0;
            padding: 1rem;
            display: flex;
            align-items: center;
            flex-direction: column;
            background-color: #f6f8fa;
          }

          .only-one {
            max-width: calc(100vw - 2rem);
          }
        `}
      </style>
    </div>
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

  await ctx.store.dispatch(ClientActions.GetClient(username));

  client = getClientWithUsername(username)(ctx.store.getState());
  if (!client) {
    UtilService.redirect(ctx, '/', { hiddenQuery: { client_not_found: 1 } });
    return props;
  }

  if (username !== client.username) {
    UtilService.redirect(ctx, `/@${client.username}`);
    return props;
  }

  return {
    ...props,
    clientId: client.id,
  };
};

export default ClientPage;
