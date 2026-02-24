import React, { useState, useRef, useEffect } from 'react';
import getConfig from 'next/config';
import algoliasearch from 'algoliasearch/lite';
import { AutoComplete, Input, Typography, Empty, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { Tag as TagInterface, Event } from '@Interfaces';
import { ClientActions } from '@Actions';
import { ClientAvatar } from '@Components/Client';
import { Tag } from '@Components/Tag';

type Results = {
  events?: Event[];
  tags?: TagInterface[];
};

const {
  publicRuntimeConfig: { ALGOLIA_ID, ALGOLIA_KEY },
} = getConfig();

const searchClient = ALGOLIA_ID && ALGOLIA_KEY ? algoliasearch(ALGOLIA_ID, ALGOLIA_KEY) : null;

let timeout: number;
export const HeaderSearchBox: React.FC = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const router = useRouter();
  const [results, setResults] = useState<Results | undefined>();
  const [focused, setFocused] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 600) {
        setFocused(false);
      }
    };

    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
    };
  });

  if (!searchClient) return <></>;

  const search = (query: string) => {
    clearTimeout(timeout);

    const queries = ['events', 'tags'].map(index => ({
      indexName: index,
      query,
      params: {
        hitsPerPage: 5,
      },
    }));

    timeout = setTimeout(async () => {
      const { results: rs } = await searchClient.search(queries);
      const eventResults = ((rs[0] as any).hits as any) as Event[];
      const tagResults = ((rs[1] as any).hits as any) as TagInterface[];

      for (let i = 0; i < eventResults.length; i += 1) {
        dispatch(ClientActions.AddClient(eventResults[i].owner));
      }

      setResults({
        events: eventResults,
        tags: tagResults,
      });
    }, 100);
  };

  const onChange = (e = '') => {
    setInput(e);
    if (e.trim().length === 0) {
      setResults(undefined);
    } else {
      search(e);
    }
  };

  const getEventItem = (event: Event) => {
    const url = `/@${event.owner.username}/${event.id}-${event.pinyin}`;

    return {
      value: event.name,
      to: url,
      label: (
        <Link href={url}>
          <a href={url} style={{ display: 'flex', alignItems: 'center', color: '#333' }}>
            <span style={{ marginRight: '.5rem' }}>
              <ClientAvatar clientId={event.ownerId} />
            </span>
            <Typography.Text ellipsis>
              <span style={{ color: 'rgba(0, 0, 0, 0.5)' }}>@{event.owner.username}/</span>
              {event.name}
            </Typography.Text>
          </a>
        </Link>
      ),
    };
  };

  const options: { label: React.ReactNode; options: any[] }[] = [];

  if (results && results.tags && results.tags.length > 0) {
    options.push({
      label: <b>话题</b>,
      options: [
        {
          value: input,
          label: (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {results.tags.map(t => (
                <Tag key={t.id} tag={t} asLink />
              ))}
            </div>
          ),
        },
      ],
    });
  }

  if (results && results.events && results.events.length > 0) {
    options.push({
      label: <b>时间线</b>,
      options: results.events.map(getEventItem),
    });
  }

  return (
    <>
      <Button
        type="text"
        className="mini"
        size="small"
        onClick={() => {
          setFocused(true);
          if (inputRef.current) {
            setTimeout(() => {
              (inputRef.current as any).focus();
            }, 100);
          }
        }}
        style={{
          paddingTop: '.2rem',
          ...(focused ? { display: 'none' } : {}),
        }}
      >
        <SearchOutlined style={{ color: 'rgba(0, 0, 0, .8)', fontSize: '1.1rem' }} />
      </Button>
      <AutoComplete
        value={input}
        onChange={onChange}
        onClear={() => onChange('')}
        onBlur={() => setFocused(false)}
        onSelect={(value: any, e: any) => {
          if (e.to) {
            router.push(e.to);
          }
        }}
        options={options}
        dropdownMatchSelectWidth={300}
        dropdownClassName="header-search-box"
        allowClear
        backfill={false}
        className={`header-search-box-input ${focused ? 'focused-search-box-input' : 'big'}`}
        notFoundContent={results === undefined ? undefined : <Empty description="未找到相关内容" />}
        {...({ listHeight: '100%' } as {})}
      >
        <Input
          placeholder="搜索…"
          ref={inputRef}
          prefix={<SearchOutlined style={{ color: 'rgba(0, 0, 0, .3)' }} />}
          onBlur={() => setFocused(false)}
          style={{
            borderRadius: '10000rem',
            minWidth: '4.6rem',
          }}
        />
      </AutoComplete>
    </>
  );
};
