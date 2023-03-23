import React from 'react';
import Categories from './Categories';
import Search from './Search';

const Filters = () => {
  return (
    <div className="filters">
      <Search />
      <Categories />
    </div>
  );
};

export default Filters;
