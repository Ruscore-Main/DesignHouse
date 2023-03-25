import React, { useState } from 'react';

const UserProfileForm = (props) => {

  const [login, setLogin] = useState(props.login);
  const [email, setEmail] = useState(props.email);
  const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber);

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
      <button className="button button--outline">Сохранить</button>

      <p>*Вы можете предложить свой собственный дизайн - проект дома</p>
      <button className="button">Добавить проект</button>
    </div>
  );
};

export default UserProfileForm;
