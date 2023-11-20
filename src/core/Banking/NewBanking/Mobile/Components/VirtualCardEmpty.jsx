import React, { memo, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Stack, Typography, Button } from '@mui/material';
import { openVirtualAccount } from '@action/Store/Reducers/Banking/BankingState';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';
import AppContext from '@root/AppContext';
import VirtualAccount from '@assets/virtualaccountnotconnect.svg';

import * as css from '../bankingmobile.scss';

const VirtualCardEmpty = () => {
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
    <>
      <Stack className={css.virtual_acc_create}>
        <img src={VirtualAccount} alt="logo" className={css.virtualemptylogo} />
        <Typography variant="h4" className={css.title}>
          Choose Effortless banking
        </Typography>
        <Typography className={css.description}>
          Effortless Banking is the Fastest Way to run your business
          transactions. It is powered by your Effortless Virtual Account.
        </Typography>
        <Typography className={css.description}>
          Registration and Setup are
          <span style={{ fontWeight: 400 }}> FREE.</span>
        </Typography>
        <Button className={css.creataccbtn} onClick={virtualAccountCreate}>
          Create Free Account
        </Button>
      </Stack>

      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default memo(VirtualCardEmpty);
