import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import Description from '../components/Description';
import Filters from '../components/Filters';
import ItemBlock from '../components/ItemBlock';
import LoaderItemBlock from '../components/LoaderItemBlock';
import Pagination from '../components/Pagination';
import SortPopup from '../components/SortPopup';
import { useAuth } from '../hooks/useAuth';
import { resetFilters, setCurrentPage } from '../redux/slices/filterSlice';
import { fetchProjects } from '../redux/slices/houseProjectSlice';
import { RootState, useAppDispatch } from 'redux/store';

const Home: React.FC = () => {
  const {isAuth, role} = useAuth();

  const listHeader = React.useRef(document.createElement("div"));

  const dispatch = useAppDispatch();

  const {items, status, amountPages} = useSelector(({ houseProjects }: RootState) => houseProjects);

  const { category, sortType, searchValue, currentPage } = useSelector(
    ({ filter }: RootState) => filter
  );

  React.useEffect((): ()=>void => {

    return () => dispatch(resetFilters());
  }, [])

  React.useEffect(() => {

    dispatch(
      fetchProjects({
        currentPage,
        sortType,
        category,
        searchValue,
        isPublished: 'Опубликованные'
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
          ? items.map((el) => <ItemBlock key={el.id} dispatch={dispatch} {...el} />)
          : Array(6)
              .fill(null)
              .map((_, i) => <LoaderItemBlock key={i} />)}
          </div>
          {(status === 'success' && items.length == 0) ? <h2 className='nothing-found'>Ничего не найдено 😕</h2> : ''}

          { amountPages < 2 ? '' : <Pagination currentPage={currentPage} amountPages={amountPages} setCurrentPage={(page: number) => dispatch(setCurrentPage(page))}/>}
        </div>
      </div>

      {role === "Admin" && <div className="admin--link"><Link to='/admin'>Admin</Link></div>}
    </>
  );
};

export default Home;
