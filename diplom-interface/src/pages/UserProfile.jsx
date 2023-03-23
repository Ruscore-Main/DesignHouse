import React from 'react'
import FavoriteBlock from '../components/FavoriteBlock'
import UserProfileForm from '../components/UserProfileForm'

const UserProfile = () => {
  return (
    <div className="container container--user">
        <UserProfileForm />

        <div className="favorite">
          <h2>Избранные проекты 💕</h2>

            <div className="favorite__items">
              <FavoriteBlock />
              <FavoriteBlock />
              <FavoriteBlock />
              <FavoriteBlock />
              <FavoriteBlock />
            </div>
        </div>
      </div>
  )
}

export default UserProfile