/* eslint-disable no-undef */
/* eslint-disable no-alert */
import React, { useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import Input from '@components/Input/Input.jsx';
import {
  VerificationCodeInput,
  VCODE_LENGTH,
} from '@core/LoginContainer/VerificationCodeContainer.jsx';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import * as css from './VerificationView.scss';

const useStyles = makeStyles(() => ({
  submitButton: {
    borderRadius: '18px',
    margin: '15px 0',
    color: 'var(--colorWhite)',
    minWidth: '90px',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: 'var(--colorPrimaryButton)',
    },
  },
  active: {
    backgroundColor: 'var(--colorPrimaryButton)',
  },
  disabled: {
    backgroundColor: 'rgba(240, 139, 50, 0.56)',
  },
  otpSection: {
    margin: '30px 0',
    '& .MuiInputBase-root': {
      backgroundColor: '#fddfc5 !important',
    },
  },
}));
const VerificationView = (props) => {
  const classes = useStyles();
  const {
    otpMobileNumber,
    hasTransactionPassword,
    successfullyPayment,
    errorMessage,
    oneClickButton,
    resendOtp,
  } = props;
  // By Ganesh - adding below eslint-disable for now as I'm getting lint errors after doing rebase with master. Request file's author to address it.
  // eslint-disable-next-line no-unused-vars
  const [otp, setOtp] = useState('');
  const [transactionPassword, setTransactionPassword] = useState('');
  const [validationErr, setValidationErr] = useState({
    transactionPassword: false,
  });

  const onOtpComplete = (val) => setOtp(val);

  const submitOtp = () => {
    if (otp && otp.length === 6) {
      if (hasTransactionPassword === true) {
        if (transactionPassword !== '') {
          successfullyPayment(otp, transactionPassword);
        } else {
          setValidationErr({ transactionPassword: true });
        }
      } else {
        successfullyPayment(otp);
      }
    }
  };

  const reValidate = () => {
    if (transactionPassword === '') {
      setValidationErr({ transactionPassword: true });
    } else {
      setValidationErr({ transactionPassword: false });
    }
  };
  const handlechange = (e) => {
    setTransactionPassword(e.target.value);
  };
  return (
    <div className={css.verificationViewContainer}>
      <div className={css.content}>
        <div className={css.title}>Verification Code</div>
        {hasTransactionPassword && (
          <div>
            <Input
              name="transactionPassword"
              onBlur={reValidate}
              helperText={
                validationErr.transactionPassword
                  ? 'Please provide Transaction Password'
                  : ''
              }
              className={`${css.greyBorder}`}
              label="Transaction Password"
              variant="standard"
              value={transactionPassword}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                type: 'password',
              }}
              fullWidth
              disabled={false}
              onChange={handlechange}
              theme="light"
              autofocus
            />
          </div>
        )}
        <div className={css.subtitle}>
          Please enter the verification code <br /> sent to{' '}
          <span className={css.mobileNumber}>+91 {otpMobileNumber}</span>
        </div>
        <div className={classes.otpSection}>
          <VerificationCodeInput
            paymentPage
            length={VCODE_LENGTH}
            onChange={onOtpComplete}
          />
        </div>
        {errorMessage && errorMessage !== '' && (
          <div className={css.errorContainer}>
            <InfoOutlinedIcon fontSize="small" />{' '}
            <span className={css.errorText}>{errorMessage}</span>
          </div>
        )}
        <p className={css.didnotReceive}>Did not receive OTP?</p>
        <div onClick={() => resendOtp()}>
          <p className={css.resent}>Resent OTP</p>
        </div>
        <div className={css.button}>
          <Button
            variant="outlined"
            className={`${classes.submitButton} ${
              oneClickButton ? css.disabled : css.active
            }`}
            onClick={submitOtp}
            size="medium"
            disabled={oneClickButton}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationView;
