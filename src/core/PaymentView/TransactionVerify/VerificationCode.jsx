import React, { useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import OTPInput from 'react-otp-input';

import axiosInst from '@action/ApiConfig/AxiosInst';
import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';

import { Stack, Typography, Button } from '@mui/material';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import * as css from './TransactionForgetPassword.scss';

const VerificationCode = ({ onSubmit, Mobile, btnDisable }) => {
  const dispatch = useDispatch();

  const [OTP, setOTP] = useState();

  const HandleOTPChange = (value) => {
    setOTP(value);
  };

  const resendOTP = async () => {
    await axiosInst
      .get(`users/transaction_passwords/otp`)
      .then((res) => {
        if (res)
          dispatch(
            openSnackbar({
              message: res?.data?.message,
              type: MESSAGE_TYPE.INFO,
            })
          );
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  return (
    <Stack>
      <Typography className={`${css.subtitle} ${css.verifyotp}`}>
        Verification Code
      </Typography>
      <Stack>
        <Stack className={css.verifymobilenumber}>
          <Typography>Please enter the verification code sent to</Typography>
          <Typography>{`+91 ${Mobile.substring(0, 5)} ${Mobile.substring(
            5,
            10
          )}`}</Typography>
        </Stack>
        <Stack sx={{ marginBottom: 5 }}>
          <OTPInput
            onChange={HandleOTPChange}
            value={OTP}
            inputStyle={css.inputStyle}
            numInputs={6}
            separator={<span />}
            isInputNum
            shouldAutoFocus
          />
        </Stack>
        <Button
          onClick={resendOTP}
          className={`${css.contactsupport} ${css.otpresend}`}
        >
          Resend OTP
        </Button>
        <Stack className={css.proceedbtnwrap}>
          <Button
            className={css.proceedbtn}
            onClick={() => onSubmit(OTP, 'verifycode')}
            disabled={btnDisable}
          >
            Done
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(VerificationCode);
