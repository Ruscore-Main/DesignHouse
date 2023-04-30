import Filters from "./Filters";
import RequestTable from "./RequestTable";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { deleteRequest, fetchRequests } from "../redux/slices/adminSlice";
import { resetFilters, setCurrentPage } from "../redux/slices/filterSlice";
import swal from 'sweetalert'
import { RootState, useAppDispatch } from "redux/store";
import Pagination from "./Pagination";
import { Request } from "redux/slices/userSlice";

const RequestList = () => {
  const dispatch = useAppDispatch();
  const { requests, status, amountPages } = useSelector(({ admin }: RootState) => admin);
  const { searchValue, category, currentPage } = useSelector(
    ({ filter }: RootState) => filter
  );

  useEffect(() => {
    dispatch(
      fetchRequests({
        searchValue,
        category: String(category),
        page: currentPage,
      })
    );
  }, [searchValue, category, currentPage]);

  // Очистка фильтров после удаления компонента
  useEffect((): ()=>void => {
    return () => dispatch(resetFilters())
  }, [])

  const onClickComplete = async (request: Request) => {
    if (window.confirm('Вы уверены, что выполнили запрос пользователя?')) {
        await dispatch(deleteRequest(request)).then(() => {
          swal({
            icon: "success",
            text: "Успешно!"
          })
        })
        await dispatch(
          fetchRequests({
            searchValue,
            category: String(category),
            page: currentPage
          })
        );
      }
  }

  return (
    <>
      <Filters placeholder="Поиск по содержимому.."/>
      {/* @ts-ignore */}
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
