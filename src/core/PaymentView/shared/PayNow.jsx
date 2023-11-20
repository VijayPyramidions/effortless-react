import React, { useState, useContext, useEffect, memo } from 'react';

import { Stack, Typography, Button, Popover } from '@mui/material';

import AppContext from '@root/AppContext';

import JSBridge from '@nativeBridge/jsbridge';
import DownArrow from '@assets/downArrow.svg';

import * as css from './PayNow.scss';

const PayNow = ({
  title,
  subTitle,
  active,
  handlePay,
  hasBalance,
  PayType,
  hidden,
}) => {
  const {
    registerEventListeners,
    deRegisterEventListener,
    transactionType,
    setTransactionType,
    transactionTypeList,
  } = useContext(AppContext);

  const device = localStorage.getItem('device_detect');

  const handleToPay = typeof handlePay === 'function' ? handlePay : () => {};

  const [authenticate, setAuthenticate] = useState();
  const [Type, setType] = useState('IMPS');

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    setType(transactionType);
  }, [transactionType]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (authenticate) handleToPay();
  }, [authenticate]);

  const setUserAuthenticationData = (response) => {
    setAuthenticate(JSON.parse(response.detail.value)?.status);
  };

  useEffect(() => {
    registerEventListeners({
      name: 'userAuthorize',
      method: setUserAuthenticationData,
    });
    return () =>
      deRegisterEventListener({
        name: 'userAuthorize',
        method: setUserAuthenticationData,
      });
  }, []);

  const PaymentType = (text) => {
    setType(text);
    setTransactionType(text);
    if (PayType) {
      PayType(text);
    }
    setAnchorEl(null);
  };

  return device === 'desktop' ? (
    <>
      <Stack direction="row" className={css.payStackDesktop}>
        <Stack style={{ margin: '0 10px' }}>
          <Typography style={{ color: 'white' }}>{title}</Typography>
          <Typography style={{ color: 'white' }}>{subTitle}</Typography>
        </Stack>
        <Stack direction="row" className={css.payStackDesktops} spacing={2}>
          {hidden && (
            <Stack className={css.btn1}>
              <Button
                sx={{ color: '#f08b32' }}
                onClick={handleClick}
                disabled={!active}
              >
                <Typography>{Type}</Typography>
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                PaperProps={{
                  sx: { width: '117px !important', borderRadius: 5 },
                }}
              >
                {transactionTypeList &&
                  transactionTypeList?.map((text) => {
                    return (
                      <Typography
                        align="center"
                        sx={{ cursor: 'pointer', p: '5px', color: '#F08B32' }}
                        onClick={() => PaymentType(text)}
                      >
                        {text}
                      </Typography>
                    );
                  })}
              </Popover>
            </Stack>
          )}
          <Button
            disabled={!active}
            className={css.btn}
            onClick={handleToPay}
            disableElevation
            disableTouchRipple
          >
            <Typography>pay now</Typography>
          </Button>
        </Stack>
      </Stack>
    </>
  ) : (
    <>
      {hidden && Type && (
        <div className={css.transactionBtn}>
          <Button
            sx={{ color: '#f08b32' }}
            onClick={handleClick}
            disabled={!active}
          >
            <Typography>{Type}</Typography>
            <img src={DownArrow} alt="Down Arrow" />
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: { width: '100%', borderRadius: 5 },
            }}
          >
            {transactionTypeList &&
              transactionTypeList?.map((text) => {
                return (
                  <Typography
                    align="center"
                    sx={{ cursor: 'pointer', p: '5px', color: '#F08B32' }}
                    onClick={() => PaymentType(text)}
                  >
                    {text}
                  </Typography>
                );
              })}
          </Popover>
        </div>
      )}
      <div
        className={`${css.paynowContainer} ${
          active ? css.active : css.disable
        }`}
      >
        <div className={css.subContainer}>
          <div>
            <p className={css.title}>{title}</p>
            <p className={css.subTitle}>{subTitle}</p>
          </div>
        </div>
        <div
          className={active ? css.paynow : css.paynow}
          onClick={() => {
            if (active && !hasBalance) {
              JSBridge.userAuthenticationforPayments();
            } else if (active) {
              handleToPay();
            }
          }}
        >
          <p>{hasBalance ? 'Pay Now' : 'Add Now'}</p>
        </div>
      </div>
    </>
  );
};

export default memo(PayNow);
