import React from "react";

import HouseProjectsTable from "../HouseProjectTable";
import AddAdminProject from "../AddAdminProject";
import styles from "./HouseProjectList.module.scss";
import Search from "../Search";
import Categories from "../Categories";
import { useSelector } from "react-redux";
import {
  setAdminCurrentPage,
  setAdminSearchValue,
  setIsPublished,
} from "../../redux/slices/adminFilterSlice";
import Pagination from "../Pagination";
import { fetchAdminProjects } from "../../redux/slices/adminSlice";
import classNames from "classnames";
import { HouseProject, deleteProject } from "../../redux/slices/houseProjectSlice";
import swal from 'sweetalert'
import { RootState, useAppDispatch } from "redux/store";

const categories = ["Опубликованные", "Предложенные"];



const HouseProjecList = () => {
  const dispatch = useAppDispatch();
  const { projects, status, amountPages } = useSelector(({ admin }: RootState) => admin);
  const { searchValue, currentPage, isPublished } = useSelector(
    ({ adminFilter }: RootState) => adminFilter
  );
  const setPublished = (value: string) => dispatch(setIsPublished(value));
  const setSearch = (value: string) => dispatch(setAdminSearchValue(value));

  const updateTable = () => {
    dispatch(
      fetchAdminProjects({
        searchValue,
        currentPage,
        isPublished
      })
    );
  }    

  React.useEffect(() => {
    updateTable();
  }, [searchValue, currentPage, isPublished]);

  const onClickDelete = async (project: HouseProject) => {
    if (window.confirm('Вы уверены, что хотите удалить проект?')) {
      await dispatch(deleteProject(project)).then(() => {
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
          setCurrentPage={(page: number) => dispatch(setAdminCurrentPage(page))}
        />
      }
    </>
  );
};

export default HouseProjecList;
