import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import accountIcon from '../assets/img/account.svg';
import logoutIcom from '../assets/img/logout.svg';
import { useAuth } from '../hooks/useAuth';
import { removeUser } from '../redux/slices/userSlice';

const Header = () => {
  const { ...user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()

  const isMounted = useRef(false);

  React.useEffect(() => {
    if (isMounted.current) {
      const json = JSON.stringify(user);
      localStorage.setItem('user', json);
    }
    isMounted.current = true;
  }, [user.isAuth, user.favorites]);

  return (
    <div className="header">
      <div className="container">
        <Link to={'/'}>
          <div className="header__logo">
            <span className="gray">Design</span>
            <span className="orange">House</span>
          </div>
        </Link>
        <div className="header__icons">
          {
            user.isAuth ?
              <>
                <img className="icon icon--small" src={logoutIcom} alt="logout" onClick={() => {
                  dispatch(removeUser());
                  navigate('/login');
                }} />
                <Link to={'/user'}>
                  <img className="icon" src={accountIcon} alt="profile" />
                </Link>
              </> 
              : 
              location.pathname == '/login' || <Link to={'/login'}>
                  <button className='button button--outline'>Войти</button>
                </Link>
          }

        </div>
      </div>
    </div>
  );
};

export default Header;
