import React from 'react';
import itemImage from '../assets/img/item-block-image.png';
import heartImage from '../assets/img/heart.svg';

const ItemBlock = () => {
  return (
    <div className="item-block">
      <img src={itemImage} alt="itemImage"/>
      <h4 className="item-block__title">Красивый дом с лужайкой</h4>
      <span className="item-block__description">
        Красивый дом с лужайкой и окантовкой из красного кирпича, добаляющая ему собственную красоту
      </span>
      <span className="item-block__area">250 m2</span>
      <span className="item-block__price">3.500.000 ₽</span>
      <div className="like-item">
        <img src={heartImage} alt="hearImage"/>
      </div>
    </div>
  );
};

export default ItemBlock;
