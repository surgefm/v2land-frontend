import React from 'react';
import { useSelector } from 'react-redux';
import { getNewsroomRoles, getActiveNewsroomId } from '@Selectors';

import { NewsroomPanelRoleItem } from '../RoleItem';
import { INewsroomPanelRoleList } from './RoleList';

const NewsroomPanelRoleList: React.FunctionComponent<INewsroomPanelRoleList.IProps> = ({
  eventId,
}) => {
  const newsroomId = useSelector(getActiveNewsroomId);
  const id = eventId || newsroomId;
  const roles = (useSelector(getNewsroomRoles(id)) || {}) as { [index: string]: number[] };
  const roleNames = ['owners', 'managers', 'editors', 'viewers'];

  return (
    <div>
      {roleNames.map(name =>
        (roles[name] || []).map(clientId => (
          <NewsroomPanelRoleItem clientId={clientId} eventId={id} key={`client-${clientId}`} />
        ))
      )}
      <style jsx>
        {`
          div {
            padding: 0 0.5rem 0.5rem;
          }
        `}
      </style>
    </div>
  );
};

export { NewsroomPanelRoleList };
