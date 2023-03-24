import React from 'react';
import itemImage from '../assets/img/item-block-image.png';
import heartImage from '../assets/img/heart.svg';
import { Link } from 'react-router-dom';

const ItemBlock = ({id, name, description, area, price, images}) => {
  return (
    <div className="item-block">
      <div className='images'>
        <Link to={`house/${id}`}>
          <img src={'data:image/jpeg;base64,'+images[2]} alt="itemImage"/>
        </Link>
        <img className='like-item' src={heartImage} alt="hearImage"/>
      </div>
      <Link to={`house/${id}`}><h4 className="item-block__title">{name}</h4></Link>
      <span className="item-block__description">
        {description}
      </span>
      <span className="item-block__area">{area} m2</span>
      <span className="item-block__price">{price} ₽</span>
      
    </div>
  );
};

export default ItemBlock;
