import React from "react";

import HouseProjectsTable from "components/HouseProjectTable";
import AddAdminProject from "components/AddAdminProject";
import styles from "./HouseProjectList.module.scss";
import Search from "components";
import Categories from "components/Categories";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdminCurrentPage,
  setAdminSearchValue,
  setIsPublished,
} from "redux/slices/adminFilterSlice";
import Pagination from "components/Pagination";
import { fetchAdminProjects } from "redux/slices/adminSlice";
import classNames from "classnames";
import { deleteProject } from "redux/slices/houseProjectSlice";
import swal from 'sweetalert'

const categories = ["Опубликованные", "Предложенные"];



const HouseProjecList = () => {
  const dispatch = useDispatch();
  const { projects, status, amountPages } = useSelector(({ admin }) => admin);
  const { searchValue, currentPage, isPublished } = useSelector(
    ({ adminFilter }) => adminFilter
  );
  const setPublished = (value) => dispatch(setIsPublished(value));
  const setSearch = (value) => dispatch(setAdminSearchValue(value));

  const updateTable = () => {
    dispatch(
      fetchAdminProjects({
        searchValue,
        currentPage,
        isPublished,
      })
    );
  }    

  React.useEffect(() => {
    updateTable();
  }, [searchValue, currentPage, isPublished]);

  const onClickDelete = async (project) => {
    if (window.confirm('Вы уверены, что хотите удалить проект?')) {
      await dispatch(deleteProject(project)).then((res) => {
        swal({
          icon: "success",
          text: "Успешно удалено!",
        });
      })
      await updateTable();
    }
  }

  return (
    <>
      <div className={classNames("filters", styles.filters)}>
        <AddAdminProject updateTable={updateTable}  />
        <Search setSearchValue={setSearch} className={styles.search} placeholder="Поиск проекта.." />
        <Categories
          categories={categories}
          activeCategory={isPublished}
          setActiveCategory={setPublished}
          className={styles.categories}
        />
      </div>

      <HouseProjectsTable items={projects} status={status} onDelete={onClickDelete} updateTable={updateTable} />

      {amountPages < 2 ? '' : <Pagination
          currentPage={currentPage}
          amountPages={amountPages}
          setCurrentPage={(page) => dispatch(setAdminCurrentPage(page))}
        />
      }
    </>
  );
};

export default HouseProjecList;
