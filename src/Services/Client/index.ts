export const getRoleName = (role: string) => {
  switch (role) {
    case 'owner':
      return 'Owner';
    case 'manager':
      return 'Manager';
    case 'editor':
      return 'Editor';
    case 'viewer':
      return 'Observer';
    default:
      return role;
  }
};
