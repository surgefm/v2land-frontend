// #region Global Imports
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Col, Row, Segmented, message } from 'antd';
// #endregion Global Imports
// #region Local Imports
import { useTranslation } from '@I18n';
import { EventActions } from '@Actions';
import { Background, EventCardList, Footer, Head, SectionHeader, Flow } from '@Components';
import { ChatroomCard } from '@Components/Chatroom/Card';
import { isLoggedIn } from '@Selectors';
import { RedstoneService, UtilService } from '@Services';
// #endregion Local Imports
// #region Interface Imports
import { IHomePage, ReduxNextPageContext } from '@Interfaces';
// #endregion Interface Imports

const eventGrid = {
  xs: 24,
  sm: 24,
  md: 18,
};

const tagGrid = {
  xs: 0,
  sm: 0,
  md: 6,
};

const tagMiniGrid = {
  xs: 24,
  sm: 24,
  md: 0,
};

const chatroomOptions = [
  {
    value: 'client-chatrooms',
    label: '我的新闻编辑室',
  },
  {
    value: 'popular-chatrooms',
    label: '活跃新闻编辑室',
  },
];

const Home: NextPage<IHomePage.IProps, IHomePage.InitialProps> = ({
  chatrooms: popularChatrooms,
  clientChatrooms,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [chatrooms, setChatrooms] = useState('client-chatrooms');
  const filteredPopularChatrooms = popularChatrooms.filter(
    c => !clientChatrooms.find(cc => cc.id === c.id)
  );

  useEffect(() => {
    if (router.query.event_not_found) {
      message.error(t('Home_EventNotFound'));
      UtilService.replace('/', { shallow: true });
    }
  }, [router.query.event_not_found]);

  useEffect(() => {
    if (router.query.client_not_found) {
      message.error(t('Home_ClientNotFound'));
      UtilService.replace('/', { shallow: true });
    }
  }, [router.query.client_not_found]);

  return (
    <Background>
      <Head />
      <Row className="grid" justify="space-between" gutter={32} style={{ maxWidth: '60rem' }}>
        <Col {...eventGrid} style={{ maxWidth: '45rem' }}>
          <Col {...tagMiniGrid} style={{ padding: 0 }}>
            {clientChatrooms.length > 0 && popularChatrooms.length === 0 && (
              <>
                <SectionHeader>我的新闻编辑室</SectionHeader>
                <Flow
                  numLine={2}
                  Component={ChatroomCard}
                  elementProps={clientChatrooms.map(c => ({
                    chatroom: c,
                    asCard: true,
                  }))}
                />
              </>
            )}
            {popularChatrooms.length > 0 && clientChatrooms.length === 0 && (
              <>
                <SectionHeader>活跃新闻编辑室</SectionHeader>
                <Flow
                  numLine={2}
                  Component={ChatroomCard}
                  elementProps={popularChatrooms.map(c => ({
                    chatroom: c,
                    asCard: true,
                  }))}
                />
              </>
            )}
            {popularChatrooms.length > 0 && clientChatrooms.length > 0 && (
              <>
                <Segmented
                  options={chatroomOptions}
                  value={chatrooms}
                  onChange={value => setChatrooms(value.toString())}
                  style={{ marginBottom: '.5rem' }}
                />
                <Flow
                  numLine={2}
                  Component={ChatroomCard}
                  elementProps={(chatrooms === 'client-chatrooms'
                    ? clientChatrooms
                    : popularChatrooms
                  ).map(c => ({
                    chatroom: c,
                    asCard: true,
                  }))}
                />
              </>
            )}
          </Col>
          <EventCardList className="left" />
        </Col>

        <Col
          {...tagGrid}
          style={{
            overflowX: 'visible',
            position: 'relative',
          }}
        >
          <div className="right-container">
            <div className="tagList">
              {clientChatrooms.length > 0 && (
                <>
                  <SectionHeader>我的新闻编辑室</SectionHeader>
                  {clientChatrooms.map(chatroom => (
                    <ChatroomCard chatroom={chatroom} key={chatroom.event.id} />
                  ))}
                </>
              )}

              {filteredPopularChatrooms.length > 0 && (
                <>
                  <SectionHeader>活跃新闻编辑室</SectionHeader>
                  {filteredPopularChatrooms.map(chatroom => (
                    <ChatroomCard chatroom={chatroom} key={chatroom.event.id} />
                  ))}
                </>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Footer />
      <style jsx>
        {`
          .grid {
            width: 100%;
            max-width: 58rem;
          }

          .right-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: flex-end;
            padding-bottom: 1.1rem;
          }

          .tagList {
            overflow-x: visible;
            display: flex;
            flex-direction: column;
            position: sticky;
            bottom: 1.5rem;
            min-height: calc(100vh - 7.5rem);
          }

          .tags {
            display: flex;
            flex-direction: column;
            margin-top: -0.25rem;
            flex-grow: 1;
          }
        `}
      </style>
    </Background>
  );
};

Home.getInitialProps = async (ctx: ReduxNextPageContext): Promise<IHomePage.InitialProps> => {
  // eslint-disable-next-line
  let [_, chatrooms, clientChatrooms] = await Promise.all([
    ctx.store.dispatch(EventActions.GetEventList()),
    RedstoneService.getPopularChatrooms(),
    isLoggedIn(ctx.store.getState()) ? RedstoneService.getClientChatrooms() : [],
  ]);
  return {
    tagList: [],
    chatrooms,
    clientChatrooms,
    namespacesRequired: ['common'],
  };
};

export default Home;
