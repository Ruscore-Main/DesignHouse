import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Description from '../components/Description';
import Filters from '../components/Filters';
import ItemBlock from '../components/ItemBlock';
import LoaderItemBlock from '../components/LoaderItemBlock';
import Pagination from '../components/Pagination';
import SortPopup from '../components/SortPopup';
import { useAuth } from '../hooks/useAuth';
import { setCurrentPage } from '../redux/slices/filterSlice';
import { fetchProjects } from '../redux/slices/houseProjectSlice';

const Home = () => {
  const {isAuth} = useAuth();

  const listHeader = React.useRef();

  const dispatch = useDispatch();

  const {items, status, amountPages} = useSelector(({ houseProjects }) => houseProjects);

  const { category, sortType, searchValue, currentPage } = useSelector(
    ({ filter }) => filter
  );

  React.useEffect(() => {

    dispatch(
      fetchProjects({
        currentPage,
        sortType,
        category,
        searchValue,
      })
    );

  }, [category, sortType, searchValue, currentPage]);

  if (!isAuth) {
    return <Navigate to={'/login'} />
  }
  return (
    <>
      <Description list={listHeader} />

      <div className="container">
        <div className="content__top">
          <Filters />
          <SortPopup />
        </div>

        <div className="content">
          <h2 className="content__title" ref={listHeader}>
            Список проектов
          </h2>
          <div className="content__items">
          {status === 'success'
          ? items.map((el) => <ItemBlock key={el.id} {...el} />)
          : Array(6)
              .fill(null)
              .map((_, i) => <LoaderItemBlock key={i} />)}
          </div>

          { amountPages < 2 ? '' : <Pagination amountPages={amountPages} setCurrentPage={(page) => dispatch(setCurrentPage(page))}/>}
        </div>
      </div>
    </>
  );
};

export default Home;
