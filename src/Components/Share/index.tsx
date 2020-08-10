import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import getConfig from 'next/config';
import { Space, Button, Popover, Tooltip, message as antMessage } from 'antd';
import Icon, {
  WeiboOutlined,
  TwitterOutlined,
  FacebookFilled,
  WechatOutlined,
} from '@ant-design/icons';
import QRCode from 'qrcode.react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { withTranslation } from '@I18n';
import { getEvent, getStack, getNews, getEventOwner, getTag } from '@Selectors';
import { Event, Stack, News, Tag } from '@Interfaces';
import { TelegramLogo } from '@Components/Basic';

import { IShare } from './Share';

const {
  publicRuntimeConfig: { SITE_URL },
} = getConfig();

const ShareImpl: React.FunctionComponent<IShare.IProps> = ({
  message: m,
  url: u,
  type = 'event',
  event: e,
  eventId,
  stack: s,
  stackId,
  news: n,
  newsId,
  t: tf,
  tag: t,
  tagId,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const selectStack = useSelector(getStack(stackId || 0));

  const stack = (s || selectStack) as Stack;
  const selectEvent = useSelector(getEvent(eventId || (stack ? stack.eventId : 0)));
  const selectNews = useSelector(getNews(newsId || 0));
  const selectTag = useSelector(getTag(tagId || 0));
  const eventOwner = useSelector(getEventOwner(eventId || (stack ? stack.eventId : 0)));

  const event = (e || selectEvent) as Event;
  const news = (n || selectNews) as News;
  const tag = (t || selectTag) as Tag;

  if (!m || !u) {
    if (type === 'event' && !event) return <React.Fragment />;
    if (type === 'stack' && (!stack || !event)) return <React.Fragment />;
    if (type === 'news' && (!news || !stack || !event)) return <React.Fragment />;
    if (type === 'tag' && !tag) return <React.Fragment />;
  }

  const colorful = type === 'event' || type === 'tag';
  const title = type === 'tag' ? tag.name : event.name;

  const sites = ['twitter', 'facebook', 'telegram', 'weibo'];
  const icons: { [index: string]: React.ReactElement } = {
    twitter: <TwitterOutlined className="border-color twitter" />,
    facebook: <FacebookFilled className="border-color facebook" />,
    wechat: <WechatOutlined className="border-color wechat" />,
    weibo: <WeiboOutlined className="border-color weibo" />,
    telegram: <Icon component={TelegramLogo} className="border-color telegram" />,
  };
  const names: { [index: string]: string } = {
    twitter: tf('Share_Site_Twitter'),
    facebook: tf('Share_Site_Facebook'),
    wechat: tf('Share_Site_Wechat'),
    weibo: tf('Share_Site_Weibo'),
    telegram: tf('Share_Site_Telegram'),
  };

  let shareMessage = tf('Share_Slogan');
  if (m) shareMessage = m;
  else if (type === 'event') shareMessage = tf('Share_EventSpecific', { eventName: event.name });
  else if (type === 'stack')
    shareMessage = tf('Share_StackSpecific', {
      eventName: event.name,
      stacktitle: stack.title,
    });
  else if (type === 'news')
    shareMessage = tf('Share_NewsSpecific', {
      eventName: event.name,
      newsTitle: news.title,
    });
  else if (type === 'tag') shareMessage = `Check out the topic #${tag.name} on Surge.`;

  const eventBaseUrl =
    type === 'tag'
      ? ''
      : `${SITE_URL}/@${eventOwner ? eventOwner.username : 'surge'}/${event.id}-${event.pinyin}`;

  let shareUrl = SITE_URL;
  if (u) shareUrl = u;
  else if (type === 'event') shareUrl = eventBaseUrl;
  else if (type === 'stack') shareUrl = `${eventBaseUrl}/${stack.id}`;
  else if (type === 'news') shareUrl = `${eventBaseUrl}/${stack.id}/${news.id}`;
  else if (type === 'tag') shareUrl = `${SITE_URL}/topic/${tag.id}`;

  const shareTo = (site: string) => {
    const url = shareUrl;
    let message = m || tf('Share_Slogan');
    if (type === 'event') {
      if (!event.description) message = event.name;
      else {
        message = `${event.name} - ${event.description.slice(0, 50)}${
          event.description.length > 50 ? '… ' : ' '
        }`;
      }
    } else if (type === 'stack') {
      if (!stack.description) message = `${stack.title} - ${event.name}`;
      else {
        message = `${stack.title} - ${stack.description.slice(0, 50)}${
          stack.description.length > 50 ? '… ' : ' '
        }${event.name} `;
      }
    } else if (type === 'news') {
      if (!news.abstract)
        message = `${news.title} - ${tf('Share_NewsSource', { source: news.source })} `;
      else {
        message = `${news.title} - ${news.abstract.slice(0, 50)}${
          news.abstract.length > 50 ? '… ' : ' '
        }${tf('Share_NewsSource', { source: news.source })} `;
      }
    } else if (type === 'tag') {
      if (!tag.description) message = `#${tag.name}`;
      else {
        message = `#${tag.name} - ${tag.description.slice(0, 50)}${
          tag.description.length > 50 ? '… ' : ' '
        }`;
      }
    }

    switch (site) {
      case 'twitter':
        return encodeURI(
          `https://twitter.com/intent/tweet?text=${message}&url=${url}&hashtags=${title}`
        );
      case 'facebook':
        return encodeURI(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
      case 'telegram':
        return encodeURI(`https://telegram.me/share?url=${url}&text=${shareMessage}`);
      case 'weibo':
        message += `%23${title}%23 %23${tf('Share_Slogan')}%23`;
        return encodeURI(`http://service.weibo.com/share/share.php?url=${url}&title=${message}`);
      default:
        return '';
    }
  };

  const handleClick = (site: string) => (mouseEvent: React.MouseEvent) => {
    mouseEvent.preventDefault();
    window.open(
      shareTo(site),
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'
    );
  };

  const togglePopover = (mouseEvent: React.MouseEvent) => {
    mouseEvent.preventDefault();
    setShowPopover(!showPopover);
  };

  const handleCopyClick = () => antMessage.success(tf('Share_ClipboardSuccess'));

  const popoverContent = (
    <div className="share-popover">
      <QRCode size={128} value={shareUrl} className="qrcode" level="H" renderAs="svg" />
      <p className="qrcode-text">{tf('Share_ScanWechatQrCode')}</p>
      <div className="wechat-copy-url">
        <span>{tf('Share_Or')}</span>
        <CopyToClipboard text={`${shareMessage}：${shareUrl}`}>
          <Button onClick={handleCopyClick} size="small" shape="round">
            {tf('Share_CopyUrl')}
          </Button>
        </CopyToClipboard>
      </div>
    </div>
  );

  return (
    <div className="share">
      <Space size={colorful ? 8 : 20}>
        {sites.map(site => (
          <Tooltip title={`${tf('Share_ShareTo')}${names[site]}`} key={`share-${site}`}>
            <a href={shareTo(site)} onClick={handleClick(site)} className={colorful ? 'event' : ''}>
              {icons[site]}
            </a>
          </Tooltip>
        ))}
        <Popover content={popoverContent} visible={showPopover}>
          <Tooltip
            title={`${tf('Share_ShareTo')}${names.wechat}`}
            overlayStyle={showPopover ? { display: 'none' } : {}}
          >
            <a href={shareUrl} onClick={togglePopover} className={colorful ? 'event' : ''}>
              {icons.wechat}
            </a>
          </Tooltip>
        </Popover>
      </Space>

      <style jsx>
        {`
          .share {
            display: flex;
          }

          .share :global(.border-color) {
            transition: all 0.2s;
            cursor: pointer;
            border: transparent 0.25rem solid;
            border-top: none;
            border-left: none;
            border-right: none;
            height: 2rem;
            font-size: 1.25rem;
            display: flex;
            align-items: center;
          }

          .share a {
            display: block;
          }

          .share .event :global(.border-color) {
            border-radius: 100%;
            font-size: 1.5rem;
            padding: 2px;
            height: 2.5rem;
            width: 2.5rem;
            border: none;
            display: inline-flex;
            justify-content: center;
          }

          .share :global(.weibo) {
            color: #e6162d;
          }

          .share :global(.wechat) {
            color: #7bb32e;
          }

          .share :global(.telegram) {
            color: #2ca5e0;
          }

          .share :global(.facebook) {
            color: #3b5998;
          }

          .share :global(.twitter) {
            color: #1da1f2;
          }

          .share a:notf(.event) :global(.border-color) {
            color: rgb(104, 180, 252);
          }

          .share a:notf(.event) :global(.border-color):hover {
            background-color: transparent;
            border-color: transparent;
          }

          .share :global(.weibo):hover {
            background-color: rgba(230, 22, 46, 0.1);
            border-color: rgba(230, 22, 46, 0.1);
            color: #e6162d !important;
          }

          .share :global(.wechat):hover {
            background-color: rgba(62, 185, 78, 0.1);
            border-color: rgba(62, 185, 78, 0.1);
            color: #7bb32e !important;
          }

          .share :global(.telegram):hover {
            background-color: rgba(44, 165, 224, 0.1);
            border-color: rgba(44, 165, 224, 0.1);
            color: #2ca5e0 !important;
          }

          .share :global(.facebook):hover {
            background-color: rgba(76, 119, 210, 0.1);
            border-color: rgba(76, 119, 210, 0.1);
            color: #3b5998 !important;
          }

          .share :global(.twitter):hover {
            background-color: rgba(29, 161, 242, 0.1);
            border-color: rgba(29, 161, 242, 0.1);
            color: #1da1f2 !important;
          }

          :global(.share-popover) :global(.qrcode) {
            width: 100%;
            height: auto;
            opacity: 1;
          }

          :global(.share-popover) :global(.qrcode-text) {
            text-align: center;
            user-select: none;
            margin-bottom: 0.2rem;
            max-width: 10rem;
          }

          :global(.share-popover) :global(.wechat-copy-url) {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          :global(.share-popover) :global(.wechat-copy-url) > :global(span) {
            margin-right: 0.25rem;
            font-size: 12px;
          }
        `}
      </style>
    </div>
  );
};

export const Share = withTranslation('common')(ShareImpl);
