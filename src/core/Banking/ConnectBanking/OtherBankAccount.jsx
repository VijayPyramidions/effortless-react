import React from 'react';
import * as Mui from '@mui/material';
import * as css from './OtherBankAccount.scss';
// import BankIcon from '../../../assets/WebAssets/Group 1000005257.svg';
// import CloseIcon from '../../../assets/WebAssets/Mask.svg';
// import SuccessIcon from '../../../assets/WebAssets/success.svg';
import { AddBankAccount } from './AddBankAccount';

export const OtherBankAccount = ({
  connect,
  connection,
  setConnect,
  mobile,
  FetchConnectedBank,
  setCongratsDrawer,
}) => {
  return (
    <Mui.Box className={css.mainBox}>
      {/* Remove mobile check if it is needed for desktop */}
      {connect === false && mobile ? (
        <>
          {/* <Mui.Typography mb={2}>Other Bank Account</Mui.Typography>
          <Mui.Card
            elevation={0}
            className={css.card}
            sx={{ mr: mobile ? '15px' : '', ml: mobile ? '15px' : '' }}
          >
            <Mui.Stack direction="row" alignItems="center">
              <Mui.Box className={css.ImgBox}>
                <Mui.CardMedia
                  className={css.icon}
                  component="img"
                  src={BankIcon}
                  alt="BankIcon"
                />
              </Mui.Box>
              <Mui.Typography className={css.accountTitle}>
                Got a current account with any other bank? Connect in mins
              </Mui.Typography>
            </Mui.Stack>
            <Mui.Divider sx={{ mt: 1, mb: 1 }} />
            <Mui.Stack direction="row" spacing={2} className={css.contentHead}>
              <Mui.CardMedia
                className={css.imgIcon}
                component="img"
                src={SuccessIcon}
              />
              <Mui.Typography className={css.imgTitle}>
                Check Balance
              </Mui.Typography>
            </Mui.Stack>
            <Mui.Stack direction="row" spacing={2} className={css.contentHead}>
              <Mui.CardMedia
                className={css.imgIcon}
                component="img"
                src={SuccessIcon}
              />
              <Mui.Typography className={css.imgTitle}>
                View Statement
              </Mui.Typography>
            </Mui.Stack>
            <Mui.Stack direction="row" spacing={2} className={css.contentHead}>
              <Mui.CardMedia
                className={css.imgIcon}
                component="img"
                src={CloseIcon}
              />
              <Mui.Typography className={css.imgTitle}>
                Initiate Transaction
              </Mui.Typography>
            </Mui.Stack>
            <Mui.Stack direction="row" spacing={2} className={css.contentHead}>
              <Mui.CardMedia
                className={css.imgIcon}
                component="img"
                src={CloseIcon}
              />
              <Mui.Typography className={css.imgTitle}>
                Realtime Date Sync
              </Mui.Typography>
            </Mui.Stack>
            <Mui.Stack direction="row" spacing={2} className={css.contentHead}>
              <Mui.CardMedia
                className={css.imgIcon}
                component="img"
                src={CloseIcon}
              />
              <Mui.Typography className={css.imgTitle}>
                Statement History
              </Mui.Typography>
            </Mui.Stack>
            <Mui.Stack
              direction="row"
              alignItem="center"
              className={css.btnHead}
            >
              <Mui.Button
                className={css.btn}
                onClick={() => {
                  setConnect(true);
                  connection(true);
                }}
              >
                Connect Now
              </Mui.Button>
            </Mui.Stack>
          </Mui.Card> */}
        </>
      ) : (
        <AddBankAccount
          mobile={mobile}
          setConnect={setConnect}
          connection={connection}
          FetchConnectedBank={FetchConnectedBank}
          setCongratsDrawer={setCongratsDrawer}
        />
      )}
    </Mui.Box>
  );
};
