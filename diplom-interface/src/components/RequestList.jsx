import Filters from "./Filters";
import RequestTable from ".//RequestTable";
import React, { useEffect } from "react";
import { Pagination } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteRequest, fetchRequests } from "../redux/slices/adminSlice";
import { resetFilters, setCurrentPage } from "../redux/slices/filterSlice";
import swal from 'sweetalert'

const RequestList = () => {
  const dispatch = useDispatch();
  const { requests, status, amountPages } = useSelector(({ admin }) => admin);
  const { searchValue, category, currentPage } = useSelector(
    ({ filter }) => filter
  );

  useEffect(() => {
    dispatch(
      fetchRequests({
        searchValue,
        category,
        page: currentPage,
      })
    );
  }, [searchValue, category, currentPage]);

  // Очистка фильтров после удаления компонента
  useEffect(() => {
    return () => dispatch(resetFilters())
  }, [])

  const onClickComplete = async (request) => {
    if (window.confirm('Вы уверены, что выполнили запрос пользователя?')) {
        await dispatch(deleteRequest(request)).then((res) => {
          swal({
            icon: "success",
            text: "Успешно!"
          })
        })
        await dispatch(
          fetchRequests({
            searchValue,
            category,
            page: currentPage
          })
        );
      }
  }

  return (
    <>
      <Filters placeholder="Поиск по содержимому.."/>
      <RequestTable items={requests} status={status} onComplete={onClickComplete} />

      {amountPages < 2 ? '' : <Pagination
          currentPage={currentPage}
          amountPages={amountPages}
          setCurrentPage={(page) => dispatch(setCurrentPage(page))}
        />
      }
    </>
  );
};

export default RequestList;
