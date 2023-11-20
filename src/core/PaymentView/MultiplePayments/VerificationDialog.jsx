import React, { useState } from 'react';
import { Button, Dialog, Slide } from '@material-ui/core';
import {
  VerificationCodeInput,
  VCODE_LENGTH,
} from '@core/LoginContainer/VerificationCodeContainer.jsx';
import * as css from './VerificationDialog.scss';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VerificationDialog(props) {
  const { open, handleClose, verifyOtp, resendOtp, otpMobileNumber } = props;
  const [OTP, setOTP] = useState();
  const onOtpComplete = (otp) => {
    setOTP(otp);
  };
  const onDone = () => {
    verifyOtp(OTP);
  };
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <div className={css.container}>
        <div className={css.topSection}>
          <div className={css.title}>Verification Code</div>
          <div className={css.description}>
            Please enter the verification code sent to{' '}
            <span className={css.highlight}>+91 {otpMobileNumber}</span>
          </div>
        </div>
        <VerificationCodeInput
          paymentPage
          length={VCODE_LENGTH}
          onChange={onOtpComplete}
        />
        <div className={css.bottomSection}>
          <div className={css.question}>Didn’t receive OTP?</div>
          <div className={css.resendLink} onClick={resendOtp}>
            Resend OTP
          </div>
        </div>
        <div className={css.actionContainer}>
          <Button onClick={onDone} size="medium" className={css.submitButton}>
            Done
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
