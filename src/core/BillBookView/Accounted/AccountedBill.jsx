import React, { useState } from 'react';

import { Stack, useTheme, useMediaQuery } from '@mui/material';

import AccountedBillCategoryContainer from './AccountedBillCategoryContainer';
import AccountedBillCategoryDetails from './AcoountedBillCategoryDetails';

import * as css from './accounted.scss';

const AccountedBill = () => {
  const themes = useTheme();
  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));
  const [selectedMaterial, setSelectedMaterial] = useState({});
  const [dateFilter, setDateFilter] = useState({});

  return (
    <Stack
      direction="row"
      gap="28px"
      className={
        desktopView ? css.accountedbill_desktop : css.accountedbill_mobile
      }
    >
      <AccountedBillCategoryContainer
        selectedMaterial={selectedMaterial}
        setSelectedMaterial={setSelectedMaterial}
        setDateFilter={setDateFilter}
        dateFilter={dateFilter}
      />
      {desktopView && (
        <AccountedBillCategoryDetails
          selectedMaterial={selectedMaterial}
          dateFilter={dateFilter}
        />
      )}
    </Stack>
  );
};

export default AccountedBill;
