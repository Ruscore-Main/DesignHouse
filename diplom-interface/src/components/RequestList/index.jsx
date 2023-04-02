import Filters from "components/Filters";
import RequestTable from "components/RequestTable";
import React from "react";
import { Pagination } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteRequest, fetchRequests } from "redux/slices/adminSlice";
import { resetFilters, setCurrentPage } from "redux/slices/filterSlice";

const RequestList = () => {
  const dispatch = useDispatch();
  const { requests, status, amountPages } = useSelector(({ admin }) => admin);
  const { searchValue, category, currentPage } = useSelector(
    ({ filter }) => filter
  );

  React.useEffect(() => {
    dispatch(
      fetchRequests({
        searchValue,
        category,
        page: currentPage,
      })
    );
  }, [searchValue, category, currentPage]);

  // Очистка фильтров после удаления компонента
  React.useEffect(() => {
    return () => dispatch(resetFilters())
  }, [])

  const onClickComplete = async (request) => {
    if (window.confirm('Вы уверены, что выполнили запрос?')) {
        await dispatch(deleteRequest(request)).then((res) => {
          alert('Успешно!')
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
      <Filters />
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
