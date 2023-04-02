import React from 'react';
import { Link } from 'react-router-dom';

import heartFullImage from '../assets/img/heart-full.svg';
import itemImage from '../assets/img/item-block-image.png';
import { removeFavorite } from '../redux/slices/userSlice';

const FavoriteBlock = ({id, name, area, price, images, dispatch, userId }) => {
  return (
    <div className="favorite-block">
      <Link to={`/house/${id}`}><img src={'data:image/jpeg;base64,' + images[0]} alt="favoriteImg" /></Link>
      <Link to={`/house/${id}`}><h4 className="favorite-block__title">{name}</h4></Link>
      <span className="favorite-block__area">{area} m2</span>
      <span className="favorite-block__price">от {price} ₽</span>
      <div className="like-item">
        <img src={heartFullImage} onClick={() => dispatch(removeFavorite({ id, name, area, price, images, userId }))} alt="heartImg" />
      </div>
    </div>
  );
};

export default FavoriteBlock;
