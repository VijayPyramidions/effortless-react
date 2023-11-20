import React from "react";
import { Box } from '@mui/material';
import * as css from './CategorizationHeader.scss';

const BankDetailsHeader = ({data}) => {
  return <>
    <div className={css.bankDetailsHeader}>
      <Box
        component="div"
      // className={}
      >
        <div className={css.bankTitle}>
          {data?.bankName}
        </div>
        <div className={css.bankAccount}>
          {data?.bankAccountNumber}
        </div>
      </Box>
    </div>
  </>;
};

export default BankDetailsHeader;