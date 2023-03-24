import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../redux/slices/filterSlice';
import Categories from './Categories';
import Search from './Search';

const Filters = () => {
  const dispatch = useDispatch();
  const activeCategory = useSelector(({ filter }) => filter.category);

  return (
    <div className="filters">
      <Search dispatch={dispatch}/>
      <Categories
        activeCategory={activeCategory}
        setActiveCategory={(category) => dispatch(setCategory(category))}
      />
    </div>
  );
};

export default Filters;
