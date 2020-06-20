import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NextPage } from 'next';

import { TagActions } from '@Actions';
import { TagHeaderCard, TagBodySection, Footer, TagHead } from '@Components';
import { ITagPage, ReduxNextPageContext } from '@Interfaces';
import { RedstoneService, UtilService } from '@Services';
import { getTag } from '@Selectors';

const TagPage: NextPage<ITagPage.IProps, ITagPage.InitialProps> = ({ tagId }) => {
  const tag = useSelector(getTag(tagId));
  const [createTimelineMode, setCreateTimelineMode] = useState<boolean>(false);

  if (tag === null) return <React.Fragment />;

  return (
    <div>
      <TagHead tagId={tagId} />
      <TagHeaderCard
        tagId={tagId}
        onCreateTimeline={() => {
          setCreateTimelineMode(prevState => !prevState);
        }}
        createTimelineMode={createTimelineMode}
      />
      <TagBodySection tagId={tagId} createTimelineMode={createTimelineMode} />
      <Footer />

      <style jsx>
        {`
          div {
            margin-top: 7.5rem;
          }
        `}
      </style>
    </div>
  );
};

TagPage.getInitialProps = async (ctx: ReduxNextPageContext): Promise<ITagPage.InitialProps> => {
  const tagId = +(ctx.query.tagId as string);
  const tag = await RedstoneService.getTag(tagId);

  if (!tag) {
    UtilService.redirect(ctx, '/', { hiddenQuery: { tag_not_found: 1 } });
  }

  ctx.store.dispatch(TagActions.AddTag(tag));

  return { tagId, namespaceRequired: ['common'] };
};

export default TagPage;
