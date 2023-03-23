import React from 'react';

import './scss/app.scss';
import Header from './components/Header';
import { Route, Routes } from 'react-router-dom';
import {Home, Auth, UserProfile} from './pages';

function App() {
  return (
    <div className="wrapper">
      <Header />

      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/login' element={<Auth />} />
        <Route exact path='/user' element={<UserProfile />} />
      </Routes>

    </div>
  )
}

export default App;
