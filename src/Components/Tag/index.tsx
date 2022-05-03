import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tag as TagC, Tooltip, message } from 'antd';
import { NumberOutlined } from '@ant-design/icons';

import { getTag } from '@Selectors';
import { TagActions } from '@Actions';
import { UtilService, getNewsroomSocket } from '@Services';

import { ITag } from './Tag';

export const Tag: React.FunctionComponent<ITag.IProps> = ({
  tagId: _tagId,
  removable = false,
  asLink = false,
  eventId,
  tag: _tag,
}) => {
  const selectorTag = useSelector(getTag(_tagId || 0));
  const tag = _tag || selectorTag;
  const dispatch = useDispatch();
  if (!tag) return <React.Fragment />;
  const tagId = tag.id;

  const redirect = () => {
    if (!asLink) return;
    UtilService.redirect(`/topic/${tag.id}`);
  };

  const handleClose = async () => {
    if (!eventId) return;
    const socket = getNewsroomSocket(eventId);
    if (!socket) return;
    await socket.removeEventFromTag(tagId);
    dispatch(TagActions.RemoveEventFromTag(tagId, eventId));
    message.success('成功移除话题');
  };

  const isLongTag = tag.name.length > 20;
  const tagContent = (
    <TagC
      icon={<NumberOutlined style={{ transform: 'skewX(-10deg)' }} />}
      color="blue"
      className="hashtag-tag"
      onClick={redirect}
      onClose={handleClose}
      closable={removable}
    >
      {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
      <style jsx global>
        {`
          .ant-tag.hashtag-tag > .anticon + span {
            margin-left: 3px;
          }

          .ant-tag.hashtag-tag {
            cursor: pointer;
          }
        `}
      </style>
    </TagC>
  );

  if (!isLongTag) return tagContent;
  return <Tooltip title={tag.name}>{tagContent}</Tooltip>;
};

export * from './TagHeaderCard';
export * from './TagBodySection';
export * from './TimelineSection';
export * from './TimelineCard';
