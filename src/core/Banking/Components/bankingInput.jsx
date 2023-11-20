/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import * as css from '../Categorization/categorizeDashboard.scss';
// import Input from '@components/Input/Input.jsx';

const BankingInput = () => {
  const variantData = 'date';
  const [dateInput, setDateInput] = useState();
  return (
    <div className={css.mainContainer}>
      {variantData === 'date' && (
        <div className={css.dateContainer}>
          <span>Start Date</span>
          <p>{moment(dateInput).format('YYYY-MM-DD')}</p>
        </div>
      )}
    </div>
  );
};
export default BankingInput;
