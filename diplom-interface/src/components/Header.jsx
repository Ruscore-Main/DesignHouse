import React from 'react'

import accountIcon from '../assets/img/account.svg';
import logoutIcom from '../assets/img/logout.svg';

const Header = () => {
  return (
    <div className="header">
        <div className="container">
          <div className="header__logo">
            <span className="gray">Design</span>
            <span className="orange">House</span>
          </div>
          <div className="header__icons">
            <img className="icon icon--small" src={logoutIcom} alt="logout"/>
            <img className="icon" src={accountIcon} alt="profile" />
          </div>
        </div>
      </div>
  )
}

export default Header