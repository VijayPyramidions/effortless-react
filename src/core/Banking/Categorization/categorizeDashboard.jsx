/* eslint-disable no-unused-vars */

import React, { useEffect } from 'react';
import moment from 'moment';
import * as css from './categorizeDashboard.scss';
import BankingInput from '../Components/bankingInput';

// import Input from '@components/Input/Input.jsx';

const CategorizeDashboard = () => {
  // const variant = 'date';
  // const [dateInput, setDateInput] = useEffect(moment().format('YYYY-MM-DD'));
  return (
    <div className={css.dashboardMainContainer}>
      <BankingInput />
    </div>
  );
};
export default CategorizeDashboard;
