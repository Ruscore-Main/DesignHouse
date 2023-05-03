import { RootState } from './../redux/store';
import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { id, login, email, role, phoneNumber, favorites } = useSelector(({ user }: RootState) => user);
  return {
    isAuth: !!login,
    id,
    login,
    email,
    role,
    phoneNumber,
    favorites
  };
};
