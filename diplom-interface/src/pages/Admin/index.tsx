import React, { useState } from "react";
import classNames from "classnames";
import { Navigate } from "react-router-dom";

import AdminAnalysis from "../../components/AdminAnalysis";
import HouseProjecList from "../../components/HouseProjectList";
import RequestList from "../../components/RequestList";
import UserList from "../../components/UserList";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Admin.module.scss";

const Admin = () => {
  const [activeList, setActiveList] = useState("projects");

  const { role } = useAuth();

  if (role !== "Admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <div className={styles.links}>
        <span
          onClick={() => setActiveList("projects")}
          className={classNames({ [styles.active]: activeList === "projects" }, "pointer")}
        >
          Список проектов
        </span>

        <span
          onClick={() => setActiveList("requests")}
          className={classNames({ [styles.active]: activeList === "requests" }, "pointer")}
        >
          Список запросов
        </span>

        <span
          onClick={() => setActiveList("users")}
          className={classNames({ [styles.active]: activeList === "users" }, "pointer")}
        >
          Список пользователей
        </span>

        <span
          onClick={() => setActiveList("analysis")}
          className={classNames({ [styles.active]: activeList === "analysis" }, "pointer")}
        >
          Аналитика
        </span>
      </div>

      {activeList === "projects" && <HouseProjecList />}
      {activeList === "requests" && <RequestList />}
      {activeList === "users" && <UserList />}
      {activeList === "analysis" && <AdminAnalysis />}
    </div>
  );
};

export default Admin;
