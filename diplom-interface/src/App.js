import React from 'react';

import './scss/app.scss';
import Header from './components/Header';
import Home from './pages/Home';
import Auth from './pages/Auth';

function App() {
  return (
    <div className="wrapper">
      <Header />

      <Auth />
    </div>
  )
}

export default App;
