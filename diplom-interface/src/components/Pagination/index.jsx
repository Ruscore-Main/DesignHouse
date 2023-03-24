
import React from 'react';
import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.scss'

const Pagination = ({amountPages, setCurrentPage}) => {
  return (
    <ReactPaginate
      className={styles.root}
      breakLabel="..."
      nextLabel=">"
      onPageChange={e => setCurrentPage(e.selected+1)}
      pageCount={amountPages}
      pageRangeDisplayed={3}
      previousLabel="<"
      nextClassName="nextBtn"
      previousClassName='prevBtn'
    />
  );
};

export default Pagination;