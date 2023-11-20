import React, { useState, useContext, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Typography, Stack, Button, Dialog } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

import { openVirtualAccount } from '@action/Store/Reducers/Banking/BankingState';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import { IndianCurrency } from '@components/utils';
import AppContext from '@root/AppContext';

import brand_logo from '@assets/effcardbrand.svg';

import WithdrawLoadMoney from '../../WithdrawLoadMoney';

import * as css from '../../bankingnew.scss';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded': {
      borderRadius: '18px',
      maxWidth: 500,
    },
  },
}));

const VirtualAccount = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { currentUserInfo, userPermissions } = useContext(AppContext);
  const [havePermission, setHavePermission] = useState({ open: false });
  const effortlessAccounts = useSelector(
    (state) => state.Banking.effortlessAccount
  );

  const [moneyDrawer, setMoneyDrawer] = useState({ open: false, action: '' });

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
      <Stack className={css.efcard_container}>
        {Object.keys(effortlessAccounts || {})?.length === 0 ? (
          <>
            <Typography variant="h3" className={css.banktitle}>
              Banking that’s Designed for Business
            </Typography>
            <Typography className={css.regtext}>
              Registration and Setup are{' '}
              <span style={{ fontWeight: 'bold' }}>FREE.</span>
            </Typography>
            <Button className={css.accopenbtn} onClick={virtualAccountCreate}>
              Create Free Account
            </Button>
          </>
        ) : (
          <>
            <Stack className={css.brandtxtwrp}>
              <img
                src={brand_logo}
                alt="Card Logo"
                className={css.brandlogo}
                loading="lazy"
              />
              <Typography className={css.acctext}>Virtual Account</Typography>
            </Stack>
            <Stack className={css.accinfowrp}>
              <Typography className={css.accname}>
                {effortlessAccounts?.display_name ||
                  effortlessAccounts?.account_holder_name ||
                  currentUserInfo?.name}
              </Typography>
              <Typography className={css.accbal}>
                {IndianCurrency.format(effortlessAccounts?.available_balance)}
              </Typography>
            </Stack>
            <Stack className={css.loadwidthdrawbtnwrp}>
              <Button
                className={css.widthrawbtn}
                onClick={() => {
                  setMoneyDrawer((prev) => ({
                    ...prev,
                    open: true,
                    action: 'withdraw_money',
                  }));
                }}
              >
                Withdraw Money
              </Button>
              <Button
                className={css.loadmoneybtn}
                onClick={() => {
                  setMoneyDrawer((prev) => ({
                    ...prev,
                    open: true,
                    action: 'load_money',
                  }));
                }}
              >
                Load Money
              </Button>
            </Stack>
          </>
        )}
      </Stack>

      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}

      <Dialog
        fullWidth
        maxWidth="sm"
        open={moneyDrawer.open}
        className={classes.root}
      >
        <WithdrawLoadMoney
          onClose={() => setMoneyDrawer((prev) => ({ ...prev, open: false }))}
          actionType={moneyDrawer.action}
        />
      </Dialog>
    </>
  );
};

export default memo(VirtualAccount);
