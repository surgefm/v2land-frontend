/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { NextPage } from 'next';
import { Tag, Tree, Segmented } from 'antd';

import { TagActions } from '@Actions';
import { Background, Footer, Head, Card, EventTitle, TagCard, Tag as T } from '@Components';
import { ITagsPage, Tag as TagInterface, ReduxNextPageContext } from '@Interfaces';
import { RedstoneService } from '@Services';

const TagsPage: NextPage<ITagsPage.IProps, ITagsPage.InitialProps> = ({ tags, graph }) => {
  const alphabet = Object.keys(tags).filter(a => tags[a].length > 0).sort();
  const [mode, setMode] = useState('首字母排序');

  return (
    <Background>
      <Head title="话题列表" />
      <Card>
        <EventTitle>话题列表</EventTitle>

        <Segmented options={['首字母排序', '层级排列']} value={mode} onChange={v => setMode(v.toString())} />

        <div className="container">
          {mode === '首字母排序' && alphabet.map(a => (
            <div className="letter-container" key={a}>
              <div className="tab-item">
                <span>{a.toUpperCase()}</span>
                <Tag color="blue">{tags[a].length > 99 ? '99+' : tags[a].length}</Tag>
              </div>
              <div className="tags">
                {tags[a].sort((i, j) => i.slug < j.slug ? -1 : 1).map((tag: TagInterface) => (
                  <TagCard tag={tag} key={tag.id} />
                ))}
              </div>
            </div>
          ))}
          {mode === '层级排列' && (
            <Tree
              treeData={graph}
              autoExpandParent
              style={{ marginTop: '.75rem' }}
              titleRender={node => node.title === 0
              ? <span>话题</span>
              : <T tagId={node.key} asLink style={{ margin: 0, marginBottom: '.2rem' }} />}
            />
          )}
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

  const graph: ITagsPage.TagGraph = [];
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const tags: TagInterface[] = (allTags as any)[key];
    for (let j = 0; j < tags.length; j += 1) {
      const tag = tags[j];
      ctx.store.dispatch(TagActions.AddTag(tag));
      const { hierarchyPath = [tag.id] } = tag;
      let subgraph = graph;
      for (let k = 0; k < hierarchyPath.length; k += 1) {
        const q = hierarchyPath[k];
        let nextGraph = subgraph.find(g => g.key === q)
        if (!nextGraph) {
          nextGraph = {
            key: q,
            children: [],
          };
          subgraph.push(nextGraph);
        }
        subgraph = nextGraph.children;
      }
    }
  }

  return { tags: allTags, graph, namespaceRequired: ['common'] };
};

export default TagsPage;
