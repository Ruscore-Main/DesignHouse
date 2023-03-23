import React from 'react';

const UserProfileForm = () => {
  return (
    <div className="user">
      <h2>Данные о пользователе:</h2>
      <div className="user__data">
        <span>Логин: </span>
        <input type="text" placeholder="Логин" className="input" />
      </div>
      <div className="user__data">
        <span>Email: </span>
        <input type="text" placeholder="Email" className="input" />
      </div>
      <button className="button button--outline">Сохранить</button>

      <p>*Вы можете предложить свой собственный дизайн - проект дома</p>
      <button className="button">Добавить проект</button>
    </div>
  );
};

export default UserProfileForm;
