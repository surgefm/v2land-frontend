import React from 'react';
import { useSelector } from 'react-redux';
import { NumberOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Space } from 'antd';

import { EventTitle, EventDescription, Share, ClientAvatar, HeaderCard } from '@Components';
import { getTag, getTagEventIdList } from '@Selectors';
import { useTranslation } from '@I18n';

import { Tag } from '../index';
import { ITagHeaderCard } from './TagHeaderCard';

const TagHeaderCardImpl: React.FunctionComponent<ITagHeaderCard.IProps> = ({ tagId }) => {
  const { t } = useTranslation('common');
  const tag = useSelector(getTag(tagId));
  const timelines = useSelector(getTagEventIdList(tagId));
  const numTimeline = timelines.length;

  return (
    tag && (
      <HeaderCard>
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <EventTitle>
            <NumberOutlined style={{ transform: 'skewX(-10deg)' }} />
            {tag.name}
          </EventTitle>

          <div className="number-of-timeline">
            <p style={{ color: 'rgba(0, 153, 239, 1)' }} id="number-of-timeline-number">
              <strong>{numTimeline}</strong>
            </p>
            <p>
              <strong>{t('Tag_Timeline', { count: numTimeline })}</strong>
            </p>
          </div>

          <EventDescription description={tag.description || '该话题暂无简介'} />
          <div className="bottom">
            {tag.hierarchyPath && tag.hierarchyPath.length > 1 && (
              <Space style={{ marginBottom: '.5rem', width: '100%' }} size={0} wrap>
                <span style={{ whiteSpace: 'nowrap' }}>话题层级：</span>
                {tag.hierarchyPath.map((id, idx) => (
                  <React.Fragment key={id}>
                    <Tag tagId={id} asLink />
                    {idx !== tag.hierarchyPath.length - 1 && (
                      <ArrowRightOutlined
                        style={{ transform: 'translateX(-.125rem)', marginRight: '0.25rem' }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </Space>
            )}
            {tag.children && tag.children.length > 0 && (
              <Space style={{ marginBottom: '.5rem' }} size={0} wrap>
                <span style={{ whiteSpace: 'nowrap' }}>下属话题：</span>
                {tag.children.map(childTag => (
                  <Tag tagId={childTag.id} key={childTag.id} asLink />
                ))}
              </Space>
            )}
            {tag.curatorIdList && tag.curatorIdList.length > 0 && (
              <Space style={{ marginBottom: '.5rem' }} wrap>
                <span style={{ whiteSpace: 'nowrap' }}>话题主持人：</span>
                {tag.curatorIdList.map(clientId => (
                  <ClientAvatar clientId={clientId} key={clientId} asLink />
                ))}
              </Space>
            )}
            <div className="share">
              <Share type="tag" tag={tag} tagId={tag.id} />
            </div>
          </div>

          <style jsx>
            {`
              .event-header-card {
                margin: -4rem 0 2rem;
                padding: 4rem 18% 2rem 18%;
                background-color: white;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
              }

              .button {
                display: flex;
                justify-content: flex-end;
              }

              .cancel-button {
                padding-right: 2.7rem;
                margin-right: 0.6rem;
              }

              .left {
                max-width: 100rem;
              }

              .open-for-edit {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-end;
                min-width: 10rem;
              }

              .open-for-edit p {
                margin-bottom: 0;
              }

              .open-for-edit-circle {
                width: 0.6rem;
                height: 0.6rem;
                border-radius: 50%;
                background-color: rgba(105, 189, 37, 1);
                margin-right: 0.75rem;
              }

              .number-of-timeline {
                display: flex;
                flex-direction: row;
                align-items: center;
              }

              #number-of-timeline-number {
                margin-right: 0.5rem;
              }

              .share {
                width: 18rem;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                position: relative;
                left: -0.5rem;
                margin-top: 0.5rem;
              }

              .bottom {
                padding-top: 3rem;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-top: 0.5rem;
                justify-content: space-between;
              }
            `}
          </style>
        </Space>
      </HeaderCard>
    )
  );
};

export const TagHeaderCard = TagHeaderCardImpl;
