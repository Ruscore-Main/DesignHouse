import React from 'react';

const Authorization = () => {
  return (
    <>
      <div className="auth__body">
        <input placeholder="Логин" type="text" className="auth__input" />
        <input placeholder="Пароль" type="password" className="auth__input" />
      </div>

      <button className="button">Войти</button>
      <p className="not-valid">Пользователь не найден!</p>
    </>
  );
};

export default Authorization;
