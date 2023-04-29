import React from "react";

import "./scss/app.scss";

import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import { Home, Auth, UserProfile, FullHouseProject, Admin, NotFound } from "./pages";

const App: React.FC = () => {

  return (
    <>
      <div className="wrapper">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="house/:id" element={<FullHouseProject />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

    </>
  );
}

export default App;
