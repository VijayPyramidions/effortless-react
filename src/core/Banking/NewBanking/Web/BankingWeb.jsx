import React from 'react';
import { useSelector } from 'react-redux';

import { Box, Stack } from '@mui/material';

import VirtualAccount from './Components/VirtualAccount';
import BusinessAccounts from './Components/BusinessAccounts';
import FounderAccounts from './Components/FounderAccounts';
import Borrowings from './Components/Borrowings';

import CreateAccount from '../CreateAccount';
import AccountsList from './Components/AccountsList';
import BorrowingsLists from './Components/BorrowingsLists';

import * as css from '../bankingnew.scss';

const BankingWeb = () => {
  const { active, dataLoad } = useSelector((state) => state.Banking);

  if (dataLoad === null) return null;
  return (
    <Box className={css.container}>
      <Stack className={css.leftsection}>
        <VirtualAccount />
        <BusinessAccounts />
        <FounderAccounts />
        <Borrowings />
      </Stack>

      <Stack className={css.rightsection}>
        {dataLoad === 'dataNotLoaded' && <CreateAccount />}
        {dataLoad === 'dataLoaded' && (
          <>
            {active.tab !== 'Borrow' ? <AccountsList /> : <BorrowingsLists />}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default BankingWeb;
