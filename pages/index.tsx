// #region Global Imports
import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Col, message, Row } from 'antd';
// #endregion Global Imports
// #region Local Imports
import { useTranslation } from '@I18n';
import { EventActions, TagActions } from '@Actions';
import { Background, EventCardList, Footer, Head, SectionHeader, TagCard } from '@Components';
import { ChatroomCard } from '@Components/Chatroom/Card';
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

const Home: NextPage<IHomePage.IProps, IHomePage.InitialProps> = ({ tagList, chatrooms }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
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
          <EventCardList className="left" />
        </Col>

        <Col {...tagGrid}>
          <div className="tagList">
            <SectionHeader>活跃新闻编辑室</SectionHeader>
            {chatrooms.map(chatroom => (
              <ChatroomCard chatroom={chatroom} key={chatroom.id} />
            ))}
            <SectionHeader>{t('Home_Topics_TrendingTopics')}</SectionHeader>
            <div className="tags">
              {tagList.map(tag => (
                <TagCard tag={tag} key={tag.id} />
              ))}
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

          .tagList {
            position: sticky;
            top: 5rem;
            height: calc(100vh - 10rem);
            overflow-x: visible;
            display: flex;
            flex-direction: column;
          }

          .tags {
            display: flex;
            flex-direction: column;
            margin-top: -0.25rem;
            flex-grow: 1;
            overflow-y: scroll;
          }
        `}
      </style>
    </Background>
  );
};

Home.getInitialProps = async (ctx: ReduxNextPageContext): Promise<IHomePage.InitialProps> => {
  // eslint-disable-next-line
  let [_, chatrooms, tagList] = await Promise.all([
    ctx.store.dispatch(EventActions.GetEventList()),
    RedstoneService.getPopularChatrooms(),
    RedstoneService.getTagList(),
  ]);
  for (let i = 0; i < tagList.length; i += 1) {
    ctx.store.dispatch(TagActions.AddTag(tagList[i]));
  }
  tagList = tagList.filter(tag => tag.eventIdList.length > 0);
  return {
    tagList,
    chatrooms,
    namespacesRequired: ['common'],
  };
};

export default Home;
