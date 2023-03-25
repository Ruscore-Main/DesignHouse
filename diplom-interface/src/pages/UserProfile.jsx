import React from 'react'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import FavoriteBlock from '../components/FavoriteBlock'
import LoaderFavoriteBlock from '../components/LoaderFavoriteBlock'
import UserProfileForm from '../components/UserProfileForm'
import { useAuth } from '../hooks/useAuth'

const UserProfile = () => {

  const {isAuth, id, login, email, phoneNumber, favorites} = useAuth();
  const dispatch = useDispatch();

  if (!isAuth) {
    return <Navigate to={'/login'} />
  }

  return (
    <div className="container container--user">
        <UserProfileForm id={id} login={login} email={email} phoneNumber={phoneNumber}/>

        <div className="favorite">
          <h2>Избранные проекты 💕</h2>

            <div className="favorite__items">
              {favorites.map(el => <FavoriteBlock dispatch={dispatch} userId={id} {...el} />)}
              <LoaderFavoriteBlock />
              <LoaderFavoriteBlock />
              <LoaderFavoriteBlock />
            </div>
        </div>
      </div>
  )
}

export default UserProfile