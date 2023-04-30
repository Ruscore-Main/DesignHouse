import classNames from "classnames";
import Search from "../Search";
import Categories from "../Categories";
import Pagination from "../Pagination";
import UserTable from "../UserTable";
import styles from "./UserList.module.scss";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { deleteUser, fetchUsers } from "../../redux/slices/adminSlice";
import {
  resetFilters,
  setCurrentPage,
  setRole,
  setSearchValue,
} from "../../redux/slices/filterSlice";
import AddUser from "../AddUser";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import swal from 'sweetalert'
import { RootState, useAppDispatch } from "redux/store";
import { User } from "redux/slices/userSlice";

const UserList = () => {
  const dispatch = useAppDispatch();
  const { users, status, amountPages } = useSelector(({ admin }: RootState) => admin);
  const { searchValue, role, currentPage } = useSelector(
    ({ filter }: RootState) => filter
  );
  const { isAuth } = useAuth();

  useEffect(() => {
    updateTable();
  }, [searchValue, role, currentPage]);

  // Очистка фильтров после удаления компонента
  useEffect((): ()=>void => {
    return () => dispatch(resetFilters());
  }, []);

  if (!isAuth) {
    return <Navigate to={'/login'} />
  }

  const setSearch = (value: string) => dispatch(setSearchValue(value));

  const updateTable = () => {
    dispatch(
      fetchUsers({
        searchValue,
        role: String(role),
        page: currentPage,
      })
    );
  };

  const onClickDelete = async (user: User) => {
    if (window.confirm("Вы уверены, что хотите удалить пользователя?")) {
      await dispatch(deleteUser(user)).then(() => {
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
          setActiveCategory={(newRole: string|null) => dispatch(setRole(String(newRole)))}
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
