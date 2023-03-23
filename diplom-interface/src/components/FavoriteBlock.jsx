import React from 'react';

import heartFullImage from './assets/img/heart-full.svg';

const FavoriteBlock = () => {
  return (
    <div className="favorite-block">
      <img src={itemImage} />
      <h4 className="favorite-block__title">Красивый дом с лужайкой</h4>
      <span className="favorite-block__area">250 m2</span>
      <span className="favorite-block__price">от 3.500.000 ₽</span>
      <div className="like-item">
        <img src={heartFullImage} />
      </div>
    </div>
  );
};

export default FavoriteBlock;
