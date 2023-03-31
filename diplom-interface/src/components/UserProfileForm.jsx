import classNames from 'classnames';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../redux/slices/userSlice';
import AddUserProject from './AddUserProject';

const isValidUpdate = (login, email, phoneNumber) => {
  const isEmail = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i;
  const isPhoneNumber = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
  if (login.length < 6) return 'Логин должен содержать больше 5 символов!';
  if (!isEmail.test(email)) return 'Email введен неверно!';
  if (!isPhoneNumber.test(phoneNumber)) return 'Номер телефна введен неверно!';
  return 'Успешно!';
};

const UserProfileForm = ({dispatch, ...user}) => {

  const [login, setLogin] = useState(user.login);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [textError, setTextError] = useState('');
  const navigate = useNavigate();

  const onSaveClick = () => {
    dispatch(updateUser({...user, login, email, phoneNumber})).then((res) => {
      if (res.payload?.login !== undefined) {
        alert("Успешно обновлено!")
        setTextError('');
      } else {
        setTextError(res.payload);
      }
    });
  }

  let isValid = isValidUpdate(login, email, phoneNumber);


  return (
    <div className="user">
      <h2>Данные о пользователе:</h2>
      <div className="user__data">
        <span>Логин: </span>
        <input type="text" placeholder="Логин" className="input" value={login} onChange={(e) => setLogin(e.target.value)} />
      </div>
      <div className="user__data">
        <span>Email: </span>
        <input type="text" placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="user__data">
        <span>Номер телефона: </span>
        <input type="text" placeholder="Номер телефона" className="input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </div>
      <p className='not-valid'>{textError} {isValid !== "Успешно!" ? isValid : ''}</p>
      <button className={classNames('button button--outline', { disabled: isValid !== "Успешно!" })} onClick={onSaveClick}>Сохранить</button>

      <AddUserProject />
    </div>
  );
};

export default UserProfileForm;
