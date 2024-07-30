// #region Global Imports
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { Button, Divider, Space, message } from 'antd';
import { SwapOutlined, SoundTwoTone, TeamOutlined } from '@ant-design/icons';
// #endregion Global Imports

// #region Local Imports
import {
  Background,
  EventHead,
  Footer,
  Card,
  EventTitle,
  EventStar,
  EventStats,
  EventSubscribe,
  EventTagList,
  EventDescription,
  EventContributorList,
  EventCardShimmer,
  Stack,
  StackShimmer,
  StackSideMenu,
  Share,
  SectionHeader,
  TagCurationBadge,
} from '@Components';
import { getEvent, getEventStackIdList, getStackListTime, isLoading } from '@Selectors';
import { UtilService } from '@Services';
import styles from '@Static/css/common.module.scss';
// #endregion Local Imports

// #region Interface Imports
import { IEventPage, ReduxNextPageContext } from '@Interfaces';
// #endregion Interface Imports

const EventPage: NextPage<IEventPage.IProps, IEventPage.InitialProps> = ({ eventId }) => {
  const event = useSelector(getEvent(eventId));
  const stackIdList = useSelector(getEventStackIdList(eventId));
  const stackTimeList = useSelector(getStackListTime(stackIdList));
  const [latestFirst, setLatestFirst] = useState(true);
  const router = useRouter();

  let username = (router.query.username as string) || '';
  if (username.startsWith('@')) {
    username = username.slice(1);
  }

  const identifier = `event-${eventId}-${username}-0`;
  const isEventLoading = useSelector(isLoading(identifier));

  useEffect(() => {
    if (router.query.launch_newsroom) {
      message.info('正在启动新闻编辑室');
      UtilService.redirect(`/${router.query.username}/${router.query.eventName}/newsroom`);
    }
  }, []);

  useEffect(() => {
    if (router.query.client_not_authorized) {
      message.error('你没有进入该事件新闻编辑室的权限');
      const index = router.asPath.indexOf('?');
      if (index >= 0) {
        UtilService.replace(router.asPath.slice(0, index), { shallow: true });
      } else {
        UtilService.replace(router.asPath, { shallow: true });
      }
    }
  }, [router.query.client_not_authorized]);

  const applyUrl = `/@${username}/${eventId}-${event ? event.pinyin : ''}/newsroom?apply=1`;

  const eventCard = event ? (
    <Card>
      <EventSubscribe eventId={event.id} />
      <EventStar eventId={event.id} />
      <div className="curation-badge">
        <TagCurationBadge curations={event.curations || []} />
      </div>
      <EventTitle>{event.name} </EventTitle>
      <EventStats newsCount={event.newsCount} stackCount={event.stackCount} />
      <EventDescription description={event.description || ''} />
      <EventTagList tagIdList={event.tagIdList} />
      <div className="bottom">
        <EventContributorList eventId={event.id} />
        <div className="share">
          <Share event={event} />
        </div>
      </div>
      {event.needContributor && (
        <>
          <Divider />
          <p>
            <SoundTwoTone /> 该时间线正在招募社区贡献者，我们需要志愿者来帮助完善它。
          </p>
          <Space align="end" style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Link href="/wiki">
              <a href="/wiki">
                <Button type="link">贡献指南</Button>
              </a>
            </Link>
            <Link href={applyUrl}>
              <a href={applyUrl}>
                <Button type="primary" icon={<TeamOutlined />}>
                  申请成为编辑
                </Button>
              </a>
            </Link>
          </Space>
        </>
      )}
      <style jsx>
        {`
          .bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0.5rem;
          }

          p {
            margin-bottom: 0.5rem;
          }

          .curation-badge {
            float: right;
            padding-top: 0.75rem;
          }

          @media (max-width: 550px) {
            .bottom {
              flex-direction: column;
              align-items: flex-start;
            }

            .share {
              display: flex;
              justify-content: flex-end;
              margin-top: 0.75rem;
              width: 100%;
            }

            .curation-badge {
              padding-top: 0rem;
            }
          }
        `}
      </style>
    </Card>
  ) : (
    <EventCardShimmer />
  );

  const toggleOrder = () => {
    setLatestFirst(!latestFirst);
  };

  const toggleButton = (
    <Button type="link" onClick={toggleOrder}>
      <SwapOutlined rotate={90} style={{ fontSize: '1rem' }} />
    </Button>
  );

  const stacks: React.ReactElement[] = [];
  let lastTimeStr = '';
  let lastTime = new Date();
  const firstIsSection = false;
  for (let j = 0; j < stackIdList.length; j += 1) {
    const i = latestFirst ? j : stackIdList.length - 1 - j;
    const time = stackTimeList[i];
    const timeStr = UtilService.getTimeString(time, { showMonthOnly: true, forceShowYear: true });
    if (time && timeStr && (!lastTimeStr || timeStr !== lastTimeStr)) {
      lastTimeStr = timeStr;
      stacks.push(
        <SectionHeader key={`section-${timeStr}`} className={styles['stack-section-header']}>
          {j === 0 ? (
            <div className="space-between">
              <span>{timeStr}</span>
              {toggleButton}
              <style jsx>
                {`
                  .space-between {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                  }
                `}
              </style>
            </div>
          ) : (
            timeStr
          )}
        </SectionHeader>
      );
    } else if (j === 0) {
      stacks.push(
        <SectionHeader key="toggle-button" className={styles['stack-section-header']}>
          <div className="end">
            {toggleButton}
            <style jsx>
              {`
                .end {
                  display: flex;
                  align-items: flex-end;
                  justify-content: flex-end;
                }
              `}
            </style>
          </div>
        </SectionHeader>
      );
    }
    if (time && time.getTime() < lastTime.getTime()) {
      lastTime = time;
    }
    const stackId = stackIdList[i];
    stacks.push(<Stack stackId={stackId} isLatestStack={i === 0} key={`stack-${stackId}`} />);
  }

  const showShimmer = (isEventLoading || !event) && stackIdList.length === 0;
  if (showShimmer) {
    for (let i = 0; i < 4; i += 1) {
      stacks.push(<StackShimmer key={`shimmer-${i}`} />);
    }
  }

  return (
    <Background>
      <EventHead eventId={eventId} />
      <StackSideMenu
        stackIdList={stackIdList}
        title={event ? event.name : ''}
        loading={showShimmer}
      />
      {eventCard}
      {firstIsSection && <div className="with-section reorder" />}
      {stacks}
      <Footer />
    </Background>
  );
};

EventPage.getInitialProps = async (ctx: ReduxNextPageContext): Promise<IEventPage.InitialProps> => {
  const eventId = (await UtilService.getEventIdMiddleware(ctx, '', { lazyLoad: true })) || 0;

  return {
    namespacesRequired: ['common'],
    eventId,
  };
};

export default EventPage;
