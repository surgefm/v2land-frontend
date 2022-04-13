import { getTranslation } from '@I18n';

export const getRoleName = (role: string) => {
  const { t } = getTranslation('common');

  switch (role) {
    case 'owner':
      return t('Newsroom_Role_Owner');
    case 'manager':
      return t('Newsroom_Role_Manager');
    case 'editor':
      return t('Newsroom_Role_Editor');
    case 'viewer':
      return t('Newsroom_Role_Observer');
    default:
      return role;
  }
};
