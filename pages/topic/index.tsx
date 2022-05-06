/* eslint-disable prettier/prettier */
import React from 'react';
import { NextPage } from 'next';
import { Tag } from 'antd';

import { TagActions } from '@Actions';
import { Background, Footer, Head, Card, EventTitle, TagCard } from '@Components';
import { ITagsPage, Tag as TagInterface, ReduxNextPageContext } from '@Interfaces';
import { RedstoneService } from '@Services';

const TagsPage: NextPage<ITagsPage.IProps, ITagsPage.InitialProps> = ({ tags }) => {
  const alphabet = Object.keys(tags).filter(a => tags[a].length > 0).sort();
  
  return (
    <Background>
      <Head title="话题列表" />
      <Card>
        <EventTitle>话题列表</EventTitle>
        <div className="container">
          {alphabet.map(a => (
            <div className="letter-container" key={a}>
              <div className="tab-item">
                <span>{a.toUpperCase()}</span>
                <Tag color="blue">{tags[a].length > 99 ? '99+' : tags[a].length}</Tag>
              </div>
              <div className="tags">
                {tags[a].map((tag: TagInterface) => (
                  <TagCard tag={tag} key={tag.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Footer />

      <style jsx>
        {`
          .container {
            margin-top: .5rem;
          }

          .letter-container {
            display: flex;
            margin-bottom: .5rem;
            position: relative;
          }

          .tab-item {
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            width: 4rem;
            margin-top: .5rem;
          }

          .tab-item > span {
            width: 1rem;
            display: block;
            margin-right: .25rem;
            text-align: center;
          }

          .tab-item :global(*) {
            border-radius: 10000px;
          }

          .tags {
            display: flex;
            flex-wrap: wrap;
            width: calc(100% - 4rem);
          }
        `}
      </style>
    </Background>
  );
};

TagsPage.getInitialProps = async (ctx: ReduxNextPageContext): Promise<ITagsPage.InitialProps> => {
  const allTags = await RedstoneService.getAllTags();
  const keys = Object.keys(allTags);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const tags: TagInterface[] = (allTags as any)[key];
    for (let j = 0; j < tags.length; j += 1) {
      ctx.store.dispatch(TagActions.AddTag(tags[j]));
    }
  }

  return { tags: allTags, namespaceRequired: ['common'] };
};

export default TagsPage;
