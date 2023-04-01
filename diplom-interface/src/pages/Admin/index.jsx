import React from "react";
import { Link } from "react-router-dom";

import styles from "./Admin.module.scss";
import HouseProjecList from "components/HouseProjectList";

const Admin = () => {
  return (
    <div className="container">
      <div className={styles.links}>
        <span className={styles.active}>Список проектов</span>

        <span>Список запросов</span>

        <span>Список пользователей</span>
      </div>

      <HouseProjecList />
    </div>
  );
};

export default Admin;
