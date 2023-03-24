import classNames from 'classnames';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { regUser } from '../redux/slices/userSlice';

const isValidRegistration = (login, email, phoneNumber, pas, pasr) => {
  const isEmail = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i;
  const isPhoneNumber = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
  if (login.length === 0 && pas.length === 0) return '';
  if (login.length < 6) return 'Логин должен содержать больше 5 символов!';
  if (!isEmail.test(email)) return 'Email введен неверно!';
  if (!isPhoneNumber.test(phoneNumber)) return 'Номер телефна введен неверно!';
  if (pas.length <= 5) return 'Пароль должен содержать больше 5 символов!';
  if (pas != pasr) return 'Пароли должны совпадать!';
  return 'Успешно!';
};

const Registration = ({dispatch}) => {
  const navigate = useNavigate();
  
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordR, setPasswordR] = useState('');
  const [textError, setTextError] = useState('');

  let isValid = isValidRegistration(login, email, phoneNumber, password, passwordR);

  const onClickRegister = () => {

    dispatch(regUser({ login, password, email, phoneNumber })).then(res => {
      if (res.payload?.login !== undefined) {
        navigate('/');
      }
      else {
        setTextError(res.payload);
      }
    })
  };

  return (
    <>
      <div className="auth__body">
        <input placeholder="Логин" type="text" className="auth__input" value={login} onChange={(e) => setLogin(e.target.value)} />
        <input placeholder="Email" type="text" className="auth__input" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="+7 (YYY) XXX XX XX" type="tel" className="auth__input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <input placeholder="Пароль" type="password" className="auth__input" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input placeholder="Подтвердите пароль" type="password" className="auth__input" value={passwordR} onChange={(e) => setPasswordR(e.target.value)} />
      </div>

      <button className={classNames('button', { disabled: isValid !== "Успешно!" })}
        onClick={onClickRegister}>Зарегистрироваться</button>
      <p className="not-valid">{textError} {isValid !== "Успешно!" ? isValid : ''}</p>
    </>
  );
};

export default Registration;
