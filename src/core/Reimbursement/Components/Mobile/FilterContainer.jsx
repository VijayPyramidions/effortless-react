import React from 'react';
// import { Button } from '@material-ui/core';
// import filter from '@assets/filterPlain.svg';
import * as css from '../../reimbursement.scss';

const FilterContainer = ({ title }) => {
  return (
    <div className={css.filterContainer}>
      <p>{title}</p>
      {/* <Button className={css.filterBtn} onClick={filterAction}>
        <img className={css.image} src={filter} alt="Icon" />
        <span className={css.btnName}>Filter</span>
      </Button> */}
    </div>
  );
};

export default FilterContainer;
