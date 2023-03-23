import React from 'react';
import Description from '../components/Description';
import Filters from '../components/Filters';
import ItemBlock from '../components/ItemBlock';
import SortPopup from '../components/SortPopup';

const Home = () => {
  const list = React.useRef();

  return (
    <>
      <Description list={list} />

      <div className="container">
        <div className="content__top">
          <Filters />
          <SortPopup />
        </div>

        <div className="content">
          <h2 className="content__title" ref={list}>
            Список проектов
          </h2>
          <div className="content__items">
            <ItemBlock />
            <ItemBlock />
            <ItemBlock />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
