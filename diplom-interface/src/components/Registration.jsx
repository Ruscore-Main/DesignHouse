import React from 'react';

const Registration = () => {
  return (
    <>
      <div className="auth__body">
        <input placeholder="Логин" type="text" className="auth__input" />
        <input placeholder="Email" type="text" className="auth__input" />
        <input placeholder="Пароль" type="password" className="auth__input" />
        <input placeholder="+7 (YYY) XXX XX XX" type="tel" className="auth__input" />
        <input placeholder="Подтвердите пароль" type="password" className="auth__input" />
      </div>

      <button className="button">Зарегистрироваться</button>
      <p className="not-valid">Пользователь с таким логином уже существует</p>
    </>
  );
};

export default Registration;
