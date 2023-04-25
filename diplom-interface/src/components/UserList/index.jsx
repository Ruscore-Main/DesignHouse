import classNames from "classnames";
import Search from "components/Search";
import Categories from "components/Categories";
import Pagination from "components/Pagination";
import UserTable from "components/UserTable";
import styles from "./UserList.module.scss";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchUsers } from "redux/slices/adminSlice";
import {
  resetFilters,
  setCurrentPage,
  setRole,
  setSearchValue,
} from "redux/slices/filterSlice";
import AddUser from "components/AddUser";
import { useAuth } from "hooks/useAuth";
import { Navigate } from "react-router-dom";
import swal from 'sweetalert'

const UserList = () => {
  const dispatch = useDispatch();
  const { users, status, amountPages } = useSelector(({ admin }) => admin);
  const { searchValue, role, currentPage } = useSelector(
    ({ filter }) => filter
  );
  const { isAuth } = useAuth();

  useEffect(() => {
    updateTable();
  }, [searchValue, role, currentPage]);

  // Очистка фильтров после удаления компонента
  useEffect(() => {
    return () => dispatch(resetFilters());
  }, []);

  if (!isAuth) {
    return <Navigate to={'/login'} />
  }

  const setSearch = (value) => dispatch(setSearchValue(value));

  const updateTable = () => {
    dispatch(
      fetchUsers({
        searchValue,
        role,
        page: currentPage,
      })
    );
  };

  const onClickDelete = async (user) => {
    if (window.confirm("Вы уверены, что хотите удалить пользователя?")) {
      await dispatch(deleteUser(user)).then((res) => {
        swal({
          icon: "success",
          text: "Успешно удалено!",
        });
      });
      await updateTable();
    }
  };

  return (
    <>
      <div className={classNames("filters", styles.filters)}>
        <AddUser updateTable={updateTable} />
        <Search
          className={styles.search}
          setSearchValue={setSearch}
          placeholder="Поиск пользователя.."
        />
        <Categories
          categories={["User", "Admin"]}
          activeCategory={role}
          setActiveCategory={(newRole) => dispatch(setRole(newRole))}
        />
      </div>
      <UserTable items={users} status={status} onDelete={onClickDelete} />
      {amountPages < 2 ? (
        ""
      ) : (
        <Pagination
          currentPage={currentPage}
          amountPages={amountPages}
          setCurrentPage={(page) => dispatch(setCurrentPage(page))}
        />
      )}
    </>
  );
};

export default UserList;
