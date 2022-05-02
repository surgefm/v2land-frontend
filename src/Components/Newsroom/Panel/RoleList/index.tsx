import React from 'react';
import { useSelector } from 'react-redux';

import {
  getNewsroomRoles,
  getActiveNewsroomId,
  isNewsroomClientInvitationVisible,
} from '@Selectors';

import { NewsroomPanelRoleItem } from '../RoleItem';
import { NewsroomPanelRoleItemCreator } from '../RoleItemCreator';
import { INewsroomPanelRoleList } from './RoleList';

const NewsroomPanelRoleList: React.FunctionComponent<INewsroomPanelRoleList.IProps> = ({
  eventId,
}) => {
  const newsroomId = useSelector(getActiveNewsroomId);
  const id = eventId || newsroomId;
  const showClientRoleCreator = useSelector(isNewsroomClientInvitationVisible);
  const roles = (useSelector(getNewsroomRoles(id)) || {}) as { [index: string]: number[] };
  const roleNames = ['owners', 'managers', 'editors', 'viewers'];

  return (
    <div>
      {showClientRoleCreator ? <NewsroomPanelRoleItemCreator eventId={id} /> : <React.Fragment />}
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
