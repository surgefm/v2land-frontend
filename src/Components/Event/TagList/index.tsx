import React from 'react';

import { withTranslation } from '@I18n';
import { Tag } from '@Components/Tag';

import { IEventTagList } from './TagList';
import styles from './TagList.module.scss';

const EventTagListComp: React.FunctionComponent<IEventTagList.IProps> = ({ tagIdList, t }) => {
  if (!tagIdList || tagIdList.length === 0) return <React.Fragment />;
  return (
    <div className={styles.tagList}>
      <span className={styles.label}>{t('Event_TagList_Tag')}</span>
      {tagIdList.map(id => (
        <Tag tagId={id} key={`tag-${id}`} asLink />
      ))}
    </div>
  );
};

export const EventTagList = withTranslation('common')(EventTagListComp);
