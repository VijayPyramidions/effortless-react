import React, { memo } from 'react';
import { Stack, Typography, Button } from '@mui/material';
import bankicon from '../../../../../assets/bankicon.svg';
import * as css from '../bankingmobile.scss';

const BankAccountsEmpty = ({ desc, btnText, AddAccount }) => {
  return (
    <Stack className={css.nodatacontainer}>
      <img src={bankicon} alt="bank logo" className={css.nodatabanklogo} />
      <Typography variant="h3" className={css.nodatatext}>
        {desc}
      </Typography>
      <Button className={css.createbankaccbtn} onClick={AddAccount}>
        {btnText}
      </Button>
    </Stack>
  );
};

export default memo(BankAccountsEmpty);
