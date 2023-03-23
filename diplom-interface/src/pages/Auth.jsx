import React from 'react'
import Authorization from '../components/Authorization'
import Registration from '../components/Registration'
import classNames from 'classnames'

const Auth = () => {
    const [isAuth, setIsAuth] = React.useState(true);
    
  return (
    <div className="container">
      <div className="auth">
        <div className="auth__header">
          <span className={classNames({selected: isAuth})} onClick={()=>setIsAuth(true)}>Вход</span>
          <span className={classNames({selected: !isAuth})} onClick={()=>setIsAuth(false)}>Регистрация</span>
        </div>

        {isAuth ? <Authorization /> : <Registration />}
      </div>
    </div>
  )
}

export default Auth