import classNames from 'classnames';
import React from 'react';

const Categories = ({categories, activeCategory, setActiveCategory, className}) => {

  return (
    <div className={classNames("categories", className)}>
      <ul>
        <li className={activeCategory === null ? 'active' : ''} onClick={() => setActiveCategory(null)}>
          Все
        </li>
        {categories.map((el, i) => (
          <li
            className={activeCategory === el ? 'active' : ''}
            key={el + i}
            onClick={() => setActiveCategory(el)}>
            {el}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
