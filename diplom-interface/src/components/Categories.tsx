import classNames from 'classnames';
import React from 'react';

type CategoriesProps = {
  categories: string[],
  activeCategory: string | null,
  setActiveCategory: (category: any)=>void,
  className?: string
}
const Categories: React.FC<CategoriesProps> = ({categories, activeCategory, setActiveCategory, className=""}) => {

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
