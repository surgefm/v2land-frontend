import React from 'react';
import H from 'next/head';
import { useSelector } from 'react-redux';

import { getTag } from '@Selectors';
import { withTranslation } from '@I18n';

import { Head } from '../Head';
import { ITagHead } from './TagHead';

const TagHeadImpl: React.FunctionComponent<ITagHead.IProps> = ({
  title: t = '',
  tagId,
  t: i18n,
}) => {
  const tag = useSelector(getTag(tagId));
  if (!tag) return <Head />;

  let title = `#${tag.name}`;
  if (t.length > 0) title = `${title} - ${t}`;
  title += i18n('Head_Suffix');

  const list = [
    <meta key="twitter:title" name="twitter:title" content={title} />,
    <meta key="og:title" property="og:title" content={title} />,
  ];

  if (tag.description) {
    const description = tag.description.split('\n').join('');
    list.push(<meta key="description" name="description" content={description} />);
    list.push(<meta key="twitter:description" name="twitter:description" content={description} />);
    list.push(<meta key="og:description" property="og:description" content={description} />);
  }

  return (
    <H>
      <title>{title}</title>
      {list}
    </H>
  );
};

export const TagHead = withTranslation('common')(TagHeadImpl);
