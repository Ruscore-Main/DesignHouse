import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { id, login, email, role, phoneNumber, requests, favorites } = useSelector(({ user }) => user);
  return {
    isAuth: !!login,
    id,
    login,
    email,
    role,
    phoneNumber,
    requests,
    favorites,
  };
};
