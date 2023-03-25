import classNames from 'classnames';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authUser } from '../redux/slices/userSlice';

const Authorization = ({ dispatch }) => {

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  let [textError, setTextError] = useState('');

  const onClickLogin = () => {
    dispatch(authUser({ login, password })).then((res) => {
      console.log(res);
      if (res.payload?.login !== undefined) {
        navigate('/');
      } else {
        setTextError(res.payload);
      }
    });
  };

  return (
    <>
      <div className="auth__body">
        <input
          placeholder="Логин"
          type="text"
          className="auth__input"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          placeholder="Пароль"
          type="password"
          className="auth__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        className={classNames('button', { disabled: login.length === 0 || password.length === 0 })}
        onClick={onClickLogin}>
        Войти
      </button>
      <p className="not-valid">{textError}</p>
    </>
  );
};

export default Authorization;
