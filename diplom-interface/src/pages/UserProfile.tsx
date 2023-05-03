import React from 'react';
import { Navigate } from 'react-router-dom';
import FavoriteBlock from '../components/FavoriteBlock';
import LoaderFavoriteBlock from '../components/LoaderFavoriteBlock';
import UserProfileForm from '../components/UserProfileForm';
import { useAuth } from '../hooks/useAuth';
import { RootState, useAppDispatch } from 'redux/store';
import { User } from 'redux/slices/userSlice';
import { Status } from 'redux/slices/houseProjectSlice';
import { useSelector } from 'react-redux';
import { fetchFavorites } from 'redux/slices/favoriteSlice';

const UserProfile: React.FC = () => {
  const { isAuth, ...user } = useAuth();

  const dispatch = useAppDispatch();
  const id = user.id;
  const {items, status} = useSelector(({ favorites }: RootState) => favorites);

  React.useEffect(()=>{
    if (id != null) {
      dispatch(
        fetchFavorites(id)
      );
    }
    
  }, []);

  if (id == null) {
    return <Navigate to={'/login'} />;
  }



  return (
    <div className="container--user">
      <UserProfileForm dispatch={dispatch} user={user as User} />

      <div className="favorite">
        <h2>Избранные проекты 💕</h2>

        {user.favorites.length === 0 ? ( 
          <h4 className="empty">Здесь пока что пусто...</h4>
        ) : (
          <div className="favorite__items">
            {status == Status.loading
              ? Array(6).fill(null).map((_, idx) => <LoaderFavoriteBlock key={idx} />)
              : items.map((el) => (
                  user.favorites?.includes(el.id) && <FavoriteBlock key={el.id} dispatch={dispatch} {...el} userId={id}/>  
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
