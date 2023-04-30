import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import FavoriteBlock from '../components/FavoriteBlock';
import LoaderFavoriteBlock from '../components/LoaderFavoriteBlock';
import UserProfileForm from '../components/UserProfileForm';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch } from 'redux/store';
import { User } from 'redux/slices/userSlice';

const UserProfile: React.FC = () => {
  const { isAuth, ...user } = useAuth();
  const dispatch = useAppDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const id = user.id;
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 1000);
  }, []);

  if (id == null) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div className="container--user">
      <UserProfileForm dispatch={dispatch} user={user as User} />

      <div className="favorite">
        <h2>Избранные проекты 💕</h2>

        {isLoaded && user.favorites.length == 0 ? (
          <h4 className="empty">Здесь пока что пусто...</h4>
        ) : (
          <div className="favorite__items">
            {!isLoaded
              ? Array(6).fill(<LoaderFavoriteBlock />)
              : user.favorites.map((el) => (
                  <FavoriteBlock dispatch={dispatch} {...el} userId={id}/>
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
