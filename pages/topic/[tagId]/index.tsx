import React from 'react';
import { TagActions } from '@Actions';
import { TagHeaderCard, TagBodySection } from '@Components';
import { NextPage } from 'next';
import { ITagPage, ReduxNextPageContext } from '@Interfaces';
import { RedstoneService } from '@Services';
import { useSelector } from 'react-redux';
import { getTag } from '@Selectors';

const TagPage: NextPage<ITagPage.IProps, ITagPage.InitialProps> = ({ tagId }) => {
  const tag = useSelector(getTag(tagId));

  if (tag === null) {
    return <React.Fragment />;
  }

  return (
    <div>
      <TagHeaderCard tagId={tagId} />
      <TagBodySection tagId={tagId} createTimelineMode={false} />

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
  ctx.store.dispatch(TagActions.AddTag(tag));

  return { tagId, namespaceRequired: ['common'] };
};

export default TagPage;
