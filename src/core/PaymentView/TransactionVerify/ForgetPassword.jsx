import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';

import axiosInst from '@action/ApiConfig/AxiosInst';

import { Stack, Typography } from '@mui/material';

import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import SecurityQuestion from './SecurityQuestion';
import VerificationCode from './VerificationCode';
import SetNewPassword from './SetNewPassword';

import * as css from './TransactionForgetPassword.scss';

const TransactionForgetPassword = ({ onClose }) => {
  const dispatch = useDispatch();

  const InitialState = {
    MobileNo: '',
    ShowComp: 'Security',
    btnDisable: false,
  };

  const [TranState, setTranState] = useState(InitialState);

  const onSubmit = async (data, type) => {
    setTranState({
      ...TranState,
      btnDisable: true,
    });
    if (type === 'security') {
      await axiosInst
        .post(`users/transaction_passwords/validate_security_question`, {
          security_answer: data,
        })
        .then((res) => {
          if (res && !res?.data?.error) {
            dispatch(
              openSnackbar({
                message: res?.data?.message,
                type: MESSAGE_TYPE.INFO,
              })
            );
            setTranState({
              ...TranState,
              MobileNo: res?.data?.mobile_number,
              ShowComp: 'VerifyCode',
              btnDisable: false,
            });
          }
        })
        .catch((e) => {
          setTranState({
            ...TranState,
            btnDisable: false,
          });
          dispatch(
            openSnackbar({
              message: e?.response?.data?.message,
              type: MESSAGE_TYPE.ERROR,
            })
          );
        });
    } else if (type === 'verifycode') {
      await axiosInst
        .post(`users/transaction_passwords/verify_otp`, {
          transaction_otp: data,
        })
        .then((res) => {
          if (res && res.data.message === 'OTP verified') {
            dispatch(
              openSnackbar({
                message: res?.data?.message,
                type: MESSAGE_TYPE.INFO,
              })
            );
            setTranState({
              ...TranState,
              MobileNo: res?.data?.mobile_number,
              ShowComp: 'SetPassword',
              btnDisable: false,
            });
          }
        })
        .catch((e) => {
          setTranState({
            ...TranState,
            btnDisable: false,
          });
          dispatch(
            openSnackbar({
              message: e?.response?.data?.message,
              type: MESSAGE_TYPE.ERROR,
            })
          );
        });
    } else if (type === 'setpassword') {
      await axiosInst
        .patch(`users/transaction_passwords`, {
          transaction_password: data.pass,
          confirm_transaction_password: data.confpass,
          type: 'forgot_password',
        })
        .then((res) => {
          if (res && res.data.error) {
            dispatch(
              openSnackbar({
                message: res?.data?.message,
                type: MESSAGE_TYPE.ERROR,
              })
            );
            setTranState({
              ...TranState,
              btnDisable: false,
            });
          } else {
            dispatch(
              openSnackbar({
                message: res?.data?.message,
                type: MESSAGE_TYPE.INFO,
              })
            );
            onClose();
          }
        })
        .catch(() => {
          setTranState({
            ...TranState,
            btnDisable: false,
          });
        });
    }
  };

  return (
    <Stack className={css.container}>
      <Typography className={css.title}>Forgot Transaction Password</Typography>
      {TranState.ShowComp === 'Security' && (
        <SecurityQuestion
          onSubmit={onSubmit}
          btnDisable={TranState.btnDisable}
        />
      )}
      {TranState.ShowComp === 'VerifyCode' && (
        <VerificationCode
          onSubmit={onSubmit}
          Mobile={TranState.MobileNo}
          btnDisable={TranState.btnDisable}
        />
      )}
      {TranState.ShowComp === 'SetPassword' && (
        <SetNewPassword onSubmit={onSubmit} btnDisable={TranState.btnDisable} />
      )}
    </Stack>
  );
};

export default memo(TransactionForgetPassword);
