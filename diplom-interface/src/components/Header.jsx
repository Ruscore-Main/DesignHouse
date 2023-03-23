import React from 'react';
import { Link } from 'react-router-dom';

import accountIcon from '../assets/img/account.svg';
import logoutIcom from '../assets/img/logout.svg';

const Header = () => {
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
          <img className="icon icon--small" src={logoutIcom} alt="logout" />
          <Link to={'/user'}><img className="icon" src={accountIcon} alt="profile" /></Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
