export const getRoleName = (role: string) => {
  switch (role) {
    case 'owner':
      return '所有者';
    case 'manager':
      return '管理者';
    case 'editor':
      return '编辑者';
    case 'viewer':
      return '观察者';
    default:
      return '无关人员';
  }
};
