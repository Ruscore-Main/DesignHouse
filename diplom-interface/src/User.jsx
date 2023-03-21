import React from 'react'

const User = () => {
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

      <div className="container container--user">
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

        <div className="favorite">
          <h2>Избранные проекты 💕</h2>

            <div className="favorite__items">
              <div className="favorite-block">
                <img src={itemImage} />
                <h4 className="favorite-block__title">Красивый дом с лужайкой</h4>
                <span className="favorite-block__area">250 m2</span>
                <span className="favorite-block__price">от 3.500.000 ₽</span>
                <div className="like-item">
                  <img src={heartImage} />
                </div>
              </div>

              <div className="favorite-block">
                <img src={itemImage} />
                <h4 className="favorite-block__title">Красивый дом с лужайкой</h4>
                <span className="favorite-block__area">250 m2</span>
                <span className="favorite-block__price">от 3.500.000 ₽</span>
                <div className="like-item">
                  <img src={heartImage} />
                </div>
              </div>

              <div className="favorite-block">
                <img src={itemImage} />
                <h4 className="favorite-block__title">Красивый дом с лужайкой fasdfasdfa fadf</h4>
                <span className="favorite-block__area">250 m2</span>
                <span className="favorite-block__price">от 3.500.000 ₽</span>
                <div className="like-item">
                  <img src={heartFullImage} />
                </div>
              </div>

              <div className="favorite-block">
                <img src={itemImage} />
                <h4 className="favorite-block__title">Красивый дом с лужайкой</h4>
                <span className="favorite-block__area">250 m2</span>
                <span className="favorite-block__price">от 3.500.000 ₽</span>
                <div className="like-item">
                  <img src={heartImage} />
                </div>
              </div>

              <div className="favorite-block">
                <img src={itemImage} />
                <h4 className="favorite-block__title">Красивый дом с лужайкой</h4>
                <span className="favorite-block__area">250 m2</span>
                <span className="favorite-block__price">от 3.500.000 ₽</span>
                <div className="like-item">
                  <img src={heartImage} />
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default User