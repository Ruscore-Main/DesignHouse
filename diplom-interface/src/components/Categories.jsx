import React from 'react';

export const categories = ['Одноэтажные', 'Двухэтажные', 'Более этажей'];

const Categories = ({activeCategory, setActiveCategory}) => {

  return (
    <div className="categories">
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
