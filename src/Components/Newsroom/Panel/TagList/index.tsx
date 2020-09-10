import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tag as TagC, AutoComplete, Button, message } from 'antd';
import { PlusOutlined, CloseOutlined, NumberOutlined } from '@ant-design/icons';

import { getEvent } from '@Selectors';
import { TagActions } from '@Actions';
import { RedstoneService, getNewsroomSocket } from '@Services';
import { Tag as T } from '@Interfaces';
import { withTranslation } from '@I18n';

import { Tag } from '@Components/Tag';
import { INewsroomPanelTagList } from './TagList';

const NewsroomPanelTagListImpl: React.FunctionComponent<INewsroomPanelTagList.IProps> = ({
  eventId,
  t,
}) => {
  const dispatch = useDispatch();
  const event = useSelector(getEvent(eventId));
  const tagIdList = event ? event.tagIdList : [];
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [showCreateOption, setShowCreateOption] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  if (!event) return <React.Fragment />;

  const searchTag = async (value: string) => {
    const tags = await RedstoneService.getTagList({
      where: {
        or: [{ name: { contains: value } }, { id: +value }],
      },
    });
    tags.map(tag => dispatch(TagActions.AddTag(tag)));
    setResults(tags.filter(tag => !tagIdList.includes(tag.id)));
    setShowCreateOption(tags.filter(tag => tag.name === value).length === 0);
  };

  const handleChange = (value: string) => {
    setInput(value);
    clearTimeout(timer);
    setShowCreateOption(false);
    if (value && value.trim().length > 0) {
      setTimer(setTimeout(() => searchTag(value.trim()), 200));
    }
  };

  const submit = async (value: string) => {
    const socket = getNewsroomSocket(eventId);
    if (!socket) return;

    setLoading(true);
    try {
      let id = -1;
      for (let i = 0; i < results.length; i += 1) {
        if (results[i].name === value.trim()) {
          id = results[i].id;
          break;
        }
      }
      if (value === '') {
        const { tag } = await RedstoneService.createTag(input);
        dispatch(TagActions.AddTag(tag));
        id = tag.id;
      }

      if (id < 0) return;
      await socket.addEventToTag(id);
      dispatch(TagActions.AddEventToTag(id, eventId));
      message.success(t('Newsroom_TagList_AddSuccess'));
      setInput('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="top">
      {tagIdList.map(id => (
        <Tag tagId={id} key={`tag-${id}`} removable eventId={eventId} />
      ))}
      {isEditing && (
        <div className="input-box">
          <AutoComplete
            size="small"
            className="input"
            value={input}
            onChange={handleChange}
            onSelect={submit}
            disabled={loading}
          >
            {showCreateOption && (
              <AutoComplete.Option value="">
                <span>{t('Newsroom_Create', { tagName: input })}</span>
              </AutoComplete.Option>
            )}
            {results.map(result => (
              <AutoComplete.Option value={result.name} key={`option-${result.name}`}>
                <span>
                  <NumberOutlined style={{ transform: 'skewX(-10deg)', marginRight: '3px' }} />
                  {result.name}
                </span>
              </AutoComplete.Option>
            ))}
          </AutoComplete>
          <Button
            size="small"
            type="link"
            icon={<CloseOutlined />}
            onClick={() => setIsEditing(false)}
          />
        </div>
      )}
      {!isEditing && (
        <TagC className="more" icon={<PlusOutlined />} onClick={() => setIsEditing(true)}>
          {t('Newsroom_ConfirmAdd')}
        </TagC>
      )}
      <style jsx>
        {`
          .top > :global(*) {
            margin: 2px 4px 2px 0;
          }

          .top > .input-box {
            display: inline-block;
          }

          .top > .input-box > :global(.input) {
            width: 150px;
            vertical-align: middle;
          }

          .top > :global(.more) {
            border-style: dashed;
            background-color: #fff;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export const NewsroomPanelTagList = withTranslation('common')(NewsroomPanelTagListImpl);
