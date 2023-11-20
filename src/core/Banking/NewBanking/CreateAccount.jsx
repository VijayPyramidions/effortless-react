import React, { memo, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';

import { Box, Stack, Button, Typography } from '@mui/material';

import { openVirtualAccount } from '@action/Store/Reducers/Banking/BankingState';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';
import AppContext from '@root/AppContext';

import VirtualAccount from '../../../assets/virtualaccountnotconnect.svg';
import * as css from './bankingnew.scss';

const CreateAccount = () => {
  const dispatch = useDispatch();

  const { userPermissions } = useContext(AppContext);
  const [havePermission, setHavePermission] = useState({ open: false });

  const virtualAccountCreate = () => {
    if (
      userPermissions.Banking?.['Effortless Virtual Account']
        ?.create_virtual_account
    )
      dispatch(openVirtualAccount());
    else
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
  };

  return (
    <Box className={css.vacontainer}>
      <Typography variant="h4" className={css.headertitle}>
        Effortless Bank Account
      </Typography>
      <Stack className={css.createaccwrp}>
        <Stack className={css.imgwrp}>
          <img
            src={VirtualAccount}
            alt="Not Connected"
            width="206px"
            height="261px"
          />
        </Stack>

        <Typography className={css.subtitle}>
          Banking that’s Designed for Business
        </Typography>
        <Typography className={css.description}>
          Effortless Banking is the fastest way to execute and implement your
          Business Transactions.
        </Typography>
        <Typography className={css.description}>
          Run all your Payment-related activites using your very own{' '}
          <span style={{ fontWeight: 'bold' }}>
            Effortless Virtual Account.
          </span>
        </Typography>
        <Typography className={css.description}>
          Registration and Setup are{' '}
          <span style={{ fontWeight: 'bold' }}>FREE.</span>
        </Typography>
        <Button className={css.creataccbtn} onClick={virtualAccountCreate}>
          Create Free Account
        </Button>
      </Stack>

      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </Box>
  );
};

export default memo(CreateAccount);
