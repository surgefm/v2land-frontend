/* eslint-disable react/require-default-props */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AutoComplete, Typography } from 'antd';
import { NumberOutlined } from '@ant-design/icons';

import { RedstoneService } from '@Services';
import { TagActions } from '@Actions';
import { getTag } from '@Selectors';

type OptionType = {
  value: string;
  id: number;
  label: React.ReactNode;
};

let timer: number;

export const TagSelector = ({
  onChange = () => {},
  tagId = 0,
  disabled = false,
}: {
  onChange?: (tagId?: number) => any;
  tagId?: number;
  disabled?: boolean;
} = {}) => {
  const dispatch = useDispatch();
  const selectedTag = useSelector(getTag(tagId));
  const [input, setInput] = useState('');
  const [results, setResults] = useState<OptionType[]>([]);

  useEffect(() => {
    if (!selectedTag && tagId) {
      (async () => {
        const t = await RedstoneService.getTag(tagId);
        dispatch(TagActions.AddTag(t));
      })();
      return;
    }
    if (selectedTag) {
      setInput(selectedTag.name);
    }
  }, [selectedTag, tagId]);

  const searchTag = async (value: string) => {
    const tags = await RedstoneService.getTagList({
      where: {
        or: [{ name: { contains: value } }, { id: +value }],
      },
    });
    tags.map(tag => dispatch(TagActions.AddTag(tag)));
    const options = tags.map(tag => ({
      value: tag.name,
      id: tag.id,
      label: (
        <Typography.Text ellipsis>
          <NumberOutlined style={{ transform: 'skewX(-10deg)' }} />
          {tag.name}
        </Typography.Text>
      ),
    }));

    setResults(
      tags.find(tag => tag.name === value.trim())
        ? options
        : [{ value: '', id: 0, label: '创建新话题' }, ...options]
    );
  };

  const handleChange = (value: string) => {
    setInput(value);
    clearTimeout(timer);
    if (value && value.trim().length > 0) {
      timer = setTimeout(() => searchTag(value.trim()), 200);
    } else {
      onChange();
    }
  };

  const handleSelect = async (value: string) => {
    if (value === '') {
      setInput(input);
      const { tag } = await RedstoneService.createTag(input);
      dispatch(TagActions.AddTag(tag));
      onChange(tag.id);
      return;
    }
    const selected = results.find(t => t.value === value);
    if (selected) {
      onChange(selected.id);
    } else {
      onChange();
    }
  };

  return (
    <AutoComplete
      value={input}
      onChange={handleChange}
      onSelect={handleSelect}
      options={results}
      disabled={disabled}
    />
  );
};
