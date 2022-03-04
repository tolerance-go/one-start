import store from 'store2';

export const userIsLogined = () => {
  const token = store.get('one-devops-user-token');
  return !!token;
};

export const logout = () => {
  store.remove('one-devops-user-token');
};
