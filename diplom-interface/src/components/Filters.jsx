import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../redux/slices/filterSlice';
import Categories from './Categories';
import Search from './Search';
import { setSearchValue } from '../redux/slices/filterSlice';

export const categories = ['Одноэтажные', 'Двухэтажные', 'Более этажей'];

const Filters = () => {
  const dispatch = useDispatch();
  const activeCategory = useSelector(({ filter }) => filter.category);
  const setSearch = (value) => dispatch(setSearchValue(value));
  return (
    <div className="filters">
      <Search setSearchValue={setSearch}/>
      <Categories
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={(category) => dispatch(setCategory(category))}
      />
    </div>
  );
};

export default Filters;
