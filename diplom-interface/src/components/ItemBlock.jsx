import React from 'react';
import heartImage from '../assets/img/heart.svg';
import heartFullImage from '../assets/img/heart-full.svg';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { addFavorite, removeFavorite } from '../redux/slices/userSlice';

const ItemBlock = ({ id: houseId, name, description, area, price, images, dispatch }) => {
  const { isAuth, id: userId, favorites } = useAuth();

  let isFavorite = favorites.find((el) => el.id === houseId);

  return (
    <div className="item-block">
      <div className="images">
        <Link to={`house/${houseId}`}>
          <img src={'data:image/jpeg;base64,' + images[images.length-1]} alt="itemImage" />
        </Link>
        {isAuth &&
          (isFavorite ? (
            <img
              className="like-item"
              src={heartFullImage}
              onClick={() => dispatch(removeFavorite({ id:houseId, name, description, area, price, images, userId }))
              }
            />
          ) : (
            <img
              className="like-item"
              src={heartImage}
              alt="hearImage"
              onClick={() => dispatch(addFavorite({ id:houseId, name, description, area, price, images, userId }))
              }
            />
          ))}
      </div>
      <Link to={`house/${houseId}`}>
        <h4 className="item-block__title">{name}</h4>
      </Link>
      <span className="item-block__description">{description}</span>
      <span className="item-block__area">{area} m2</span>
      <span className="item-block__price">{price} ₽</span>
    </div>
  );
};

export default ItemBlock;
