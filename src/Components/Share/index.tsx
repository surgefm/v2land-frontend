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

import { getEvent, getStack, getNews, getEventOwner } from '@Selectors';
import { Event, Stack, News } from '@Interfaces';
import { TelegramLogo } from '@Components/Basic';

import { IShare } from './Share';

const {
  publicRuntimeConfig: { SITE_URL },
} = getConfig();

const Share: React.FunctionComponent<IShare.IProps> = ({
  message: m,
  url: u,
  type = 'event',
  event: e,
  eventId,
  stack: s,
  stackId,
  news: n,
  newsId,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const selectStack = useSelector(getStack(stackId || 0));

  const stack = (s || selectStack) as Stack;
  const selectEvent = useSelector(getEvent(eventId || (stack ? stack.eventId : 0)));
  const selectNews = useSelector(getNews(newsId || 0));
  const eventOwner = useSelector(getEventOwner(eventId || (stack ? stack.eventId : 0)));

  const event = (e || selectEvent) as Event;
  const news = (n || selectNews) as News;

  if (!m || !u) {
    if (type === 'event' && !event) return <React.Fragment />;
    if (type === 'stack' && (!stack || !event)) return <React.Fragment />;
    if (type === 'news' && (!news || !stack || !event)) return <React.Fragment />;
  }

  const sites = ['twitter', 'facebook', 'telegram', 'weibo'];
  const icons: { [index: string]: React.ReactElement } = {
    twitter: <TwitterOutlined className="border-color twitter" />,
    facebook: <FacebookFilled className="border-color facebook" />,
    wechat: <WechatOutlined className="border-color wechat" />,
    weibo: <WeiboOutlined className="border-color weibo" />,
    telegram: <Icon component={TelegramLogo} className="border-color telegram" />,
  };
  const names: { [index: string]: string } = {
    twitter: ' Twitter',
    facebook: ' Facebook',
    wechat: '微信',
    weibo: '微博',
    telegram: ' Telegram',
  };

  let shareMessage = '追事件，上浪潮';
  if (m) shareMessage = m;
  else if (type === 'event') shareMessage = `上浪潮查看「${event.name}」的最新动态`;
  else if (type === 'stack') shareMessage = `上浪潮查看「${event.name}」的进展「${stack.title}」`;
  else if (type === 'news') shareMessage = `上浪潮查看「${event.name}」的新闻「${news.title}」`;

  const eventBaseUrl = `${SITE_URL}/@${eventOwner ? eventOwner.username : 'newspect'}/${event.id}-${
    event.pinyin
  }`;

  let shareUrl = SITE_URL;
  if (u) shareUrl = u;
  else if (type === 'event') shareUrl = eventBaseUrl;
  else if (type === 'stack') shareUrl = `${eventBaseUrl}/${stack.id}`;
  else if (type === 'news') shareUrl = `${eventBaseUrl}/${stack.id}/${news.id}`;

  const shareTo = (site: string) => {
    const url = shareUrl;
    let message = m || '追事件，上浪潮';
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
      if (!news.abstract) message = `${news.title} - 来源：${news.source} `;
      else {
        message = `${news.title} - ${news.abstract.slice(0, 50)}${
          news.abstract.length > 50 ? '… ' : ' '
        }来源：${news.source} `;
      }
    }

    switch (site) {
      case 'twitter':
        return encodeURI(
          `https://twitter.com/intent/tweet?text=${message}&url=${url}&hashtags=${event.name},浪潮`
        );
      case 'facebook':
        return encodeURI(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
      case 'telegram':
        return encodeURI(`https://telegram.me/share?url=${url}&text=${shareMessage}`);
      case 'weibo':
        message += `%23${event.name}%23 %23浪潮，你的社会事件追踪工具%23`;
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

  const handleCopyClick = () => antMessage.success('链接已复制至剪贴板');

  const popoverContent = (
    <div className="share-popover">
      <QRCode size={128} value={shareUrl} level="H" renderAs="svg" />
      <p className="qrcode-text">微信扫码分享</p>
      <div className="wechat-copy-url">
        <span>或</span>
        <CopyToClipboard text={`${shareMessage}：${shareUrl}`}>
          <Button onClick={handleCopyClick} size="small" shape="round">
            点击复制链接
          </Button>
        </CopyToClipboard>
      </div>
    </div>
  );

  return (
    <div className="share">
      <Space size={type === 'event' ? 8 : 20}>
        {sites.map(site => (
          <Tooltip title={`分享至${names[site]}`} key={`share-${site}`}>
            <a href={shareTo(site)} onClick={handleClick(site)} className={type}>
              {icons[site]}
            </a>
          </Tooltip>
        ))}
        <Popover content={popoverContent} visible={showPopover}>
          <Tooltip title="分享至微信" overlayStyle={showPopover ? { display: 'none' } : {}}>
            <a href={shareUrl} onClick={togglePopover} className={type}>
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
            font-size: 1.5rem;
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

          .share a:not(.event) :global(.border-color) {
            color: rgb(104, 180, 252);
          }

          .share a:not(.event) :global(.border-color):hover {
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

export { Share };
