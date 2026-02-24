// #region Global Imports
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';
import Link from 'next/link';
import { Button, Divider, Space, message } from 'antd';
import { SwapOutlined, SoundTwoTone, TeamOutlined } from '@ant-design/icons';
import QRCode from 'qrcode.react';
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
import {
  getEvent,
  getEventStackIdList,
  getStackListTime,
  isLoading,
  isGeneratingScreenshot,
} from '@Selectors';
import { UtilService } from '@Services';
import styles from '@Static/css/common.module.scss';
// #endregion Local Imports

// #region Interface Imports
import { IEventPage, ReduxNextPageContext } from '@Interfaces';
// #endregion Interface Imports

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SHORT_URL = process.env.NEXT_PUBLIC_SHORT_URL;

const EventPage: NextPage<IEventPage.IProps, IEventPage.InitialProps> = ({ eventId }) => {
  const event = useSelector(getEvent(eventId));
  const stackIdList = useSelector(getEventStackIdList(eventId));
  const stackTimeList = useSelector(getStackListTime(stackIdList));
  const generatingScreenshot = useSelector(isGeneratingScreenshot);
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
      {generatingScreenshot || (
        <div className="bottom">
          <EventContributorList eventId={event.id} />
          <div className="share">
            <Share event={event} />
          </div>
        </div>
      )}
      {event.needContributor && (
        <>
          <Divider />
          <p>
            <SoundTwoTone /> 该时间线正在招募社区贡献者，我们需要志愿者来帮助完善它。
          </p>
          {generatingScreenshot || (
            <Space align="end" style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Link href="/wiki">

                <Button type="link">贡献指南</Button>

              </Link>
              <Link href={applyUrl}>

                <Button type="primary" icon={<TeamOutlined />}>
                  申请成为编辑
                </Button>

              </Link>
            </Space>
          )}
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

          :global(.generating-screenshot) .bottom {
            flex-direction: column;
            align-items: flex-start;
          }

          :global(.generating-screenshot) .share {
            display: flex;
            justify-content: flex-end;
            margin-top: 0.75rem;
            width: 100%;
          }

          :global(.generating-screenshot) .curation-badge {
            padding-top: 0.3rem;
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
          }

          @media (max-width: 600px) {
            .curation-badge {
              padding-top: 0.3rem;
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
              <span suppressHydrationWarning>{timeStr}</span>
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
            <span suppressHydrationWarning>{timeStr}</span>
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

  const QRCodeImpl = QRCode as any;
  const pageUrl = `${SHORT_URL || SITE_URL}/${eventId}`;

  return (
    <Background>
      <EventHead eventId={eventId} />
      <StackSideMenu
        stackIdList={stackIdList}
        title={event ? event.name : ''}
        loading={showShimmer}
      />
      <div className={`timeline ${generatingScreenshot ? 'generating-screenshot' : ''}`}>
        {eventCard}
        {firstIsSection && <div className="with-section reorder" />}
        {stacks}
        {generatingScreenshot && (
          <div className="column">
            <QRCodeImpl size={96} value={pageUrl} className="qrcode" level="H" renderAs="svg" />
            <p>
              <code>{pageUrl}</code>
            </p>
            <div className="row">
              <img src="/images/icon.svg" alt="logo" className="logo" height="32" />
              <img src="/images/logotype.svg" alt="logotype" height="28" />
            </div>
            <span>你的社会事件追踪工具</span>
            {SITE_URL && SITE_URL !== SHORT_URL && <span>Langchao.org</span>}
          </div>
        )}
        {generatingScreenshot || <Footer />}
        <style jsx>
          {`
            .timeline {
              max-width: 46rem;
              padding: 0.5rem;
              width: calc(100% + 1rem);
              display: block;
              position: relative;
            }

            .generating-screenshot {
              max-width: 25rem;
            }

            .column {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 100%;
              margin-top: 1rem;
              margin-bottom: 3rem;
            }

            .column p {
              margin-top: 0.5rem;
              text-align: center;
            }

            .column .row {
              display: flex;
              align-items: center;
            }

            .column .row img:first-child {
              margin-right: 0.5rem;
            }

            .column span {
              margin-top: 0.25rem;
              font-size: 0.8rem;
            }
          `}
        </style>
      </div>
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
