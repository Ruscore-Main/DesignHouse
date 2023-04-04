import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import FavoriteBlock from "../components/FavoriteBlock";
import LoaderFavoriteBlock from "../components/LoaderFavoriteBlock";
import UserProfileForm from "../components/UserProfileForm";
import { useAuth } from "../hooks/useAuth";

const UserProfile = () => {
  const { isAuth, ...user } = useAuth();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 1000);
  }, []);

  if (!isAuth) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="container--user">
      <UserProfileForm dispatch={dispatch} {...user} />

      <div className="favorite">
        <h2>Избранные проекты 💕</h2>

        <div className="favorite__items">
          {!isLoaded
            ? Array(6).fill(<LoaderFavoriteBlock />)
            : user.favorites.map((el) => (
                <FavoriteBlock dispatch={dispatch} userId={user.id} {...el} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
