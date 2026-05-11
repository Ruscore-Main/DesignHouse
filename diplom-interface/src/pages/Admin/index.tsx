import React, { useState } from "react";

import styles from "./Admin.module.scss";
import HouseProjecList from "../../components/HouseProjectList";
import classNames from "classnames";
import RequestList from "../../components/RequestList";
import UserList from "../../components/UserList";
import AdminAnalysis from "../../components/AdminAnalysis";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const [activeList, setActiveList] = useState("projects");

  const {role} = useAuth();

  if (role !== 'Admin') {
    return <Navigate to={'/'} />
  }

  return (
    <div className={classNames("container", styles.root)}>
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
          Анализ
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
