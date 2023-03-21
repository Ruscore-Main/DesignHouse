import React from 'react'

const AUTH_LOGIN = () => {
  return (
    <div className="wrapper">
    <div className="header">
      <div className="container">
        <div className="header__logo">
          <span className="gray">Design</span>
          <span className="orange">House</span>
        </div>
        <div className="header__icons">
          <img className="icon--small" src={logoutIcom} />
          <img className="icon" src={accountIcon} />
        </div>
      </div>
    </div>

    <div className="container">
      <div className="auth">
        <div className="auth__header">
          <span className="selected">Вход</span>
          <span>Регистрация</span>
        </div>

        <div className="auth__body">
          <input placeholder="Логин" type="text" className="auth__input" />
          <input placeholder="Пароль" type="password" className="auth__input" />
        </div>

        <button className="button">Войти</button>
        <p className="not-valid">Пользователь не найден!</p>
      </div>
    </div>

    <div className="container">
      <div className="auth">
        <div className="auth__header">
          <span>Вход</span>
          <span className="selected">Регистрация</span>
        </div>

        <div className="auth__body">
          <input placeholder="Логин" type="text" className="auth__input" />
          <input placeholder="Email" type="text" className="auth__input" />
          <input placeholder="Пароль" type="password" className="auth__input" />
          <input placeholder="+7 (YYY) XXX XX XX" type="tel" className="auth__input" />
          <input placeholder="Подтвердите пароль" type="password" className="auth__input" />
        </div>

        <button className="button">Зарегистрироваться</button>
        <p className="not-valid">Пользователь с таким логином уже существует</p>
      </div>
    </div>
  </div>
  )
}

export default AUTH_LOGIN