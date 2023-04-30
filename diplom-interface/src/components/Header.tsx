import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import accountIcon from '../assets/img/account.svg';
import logoutIcom from '../assets/img/logout.svg';
import { useAuth } from '../hooks/useAuth';
import { removeUser } from '../redux/slices/userSlice';

const Header = () => {
  const { isAuth } = useAuth();
  const dispatch = useDispatch();

  return (
    <div className="header">
      <div className="container">
        <Link to={'/'}>
          <div className="header__logo">
            <span className="gray">Design</span>
            <span className="orange">House</span>
          </div>
        </Link>
        {isAuth && (
          <div className="header__icons">
            <img className="icon icon--small" src={logoutIcom} alt="logout" onClick={() => dispatch(removeUser())} />
            <Link to={'/user'}>
              <img className="icon" src={accountIcon} alt="profile" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
