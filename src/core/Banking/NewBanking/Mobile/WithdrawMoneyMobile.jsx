import React, { memo, useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, IconButton, Stack, Typography } from '@mui/material';
import { Dialog } from '@material-ui/core';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import RestApi, { METHOD } from '@services/RestApi';
import {
  VerificationCodeInput,
  VCODE_LENGTH,
} from '@core/LoginContainer/VerificationCodeContainer';

import SelectBottomSheet from '../../../../components/SelectBottomSheet/SelectBottomSheet';

import LoadMoneyIcon from '../../../../assets/loadmoneyicon.png';
import AccountListMoney from './Components/AccountListMoney';

import * as css from './bankingmobile.scss';
import * as css_ from '../../../PaymentView/shared/ProceedToPay.scss';

const WithdrawMoneyMobile = () => {
  const Navigate = useNavigate();
  const { organization, openSnackBar, enableLoading, user } =
    useContext(AppContext);

  const inputRef = useRef();

  const [Amount, setAmount] = useState('');
  const [AccountSelect, setAccountSelect] = useState(false);
  const [selectedBank, setselectedBank] = useState('');

  const [showPassword, setShowPassword] = useState(true);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [transactionPasswordInput, setTransactionPasswordInput] = useState('');
  const [collapseFirstModalSection, setCollapseFirstModalSection] =
    useState(false);
  const [apiError] = useState('');
  const [modalError] = useState(false);
  const [errorMessage] = useState('');
  const [otpMobileNumber, setOtpMobileNumber] = useState('');
  const [otpNumber, setOtpNumber] = useState('');

  const onOtpComplete = (val) => setOtpNumber(val);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const amountSubmit = () => {
    if (Number(Amount) === 0 || Amount === '') {
      openSnackBar({
        message: 'Please Enter Valid Amount.',
        type: MESSAGE_TYPE.ERROR,
      });
      return;
    }
    setAccountSelect(true);
  };

  const AccountSelectComplete = (val) => {
    setselectedBank(val);
    setAccountSelect(false);
    setPaymentDialog(true);
  };

  const conformTransactionPassword = async () => {
    enableLoading(true);
    await RestApi(
      `organizations/${organization?.orgId}/withdraw_money/generate_otp`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          amount: Amount,
          transaction_password: transactionPasswordInput,
          bank_account_id: selectedBank,
        },
      }
    )
      .then((res) => {
        if (res && !res.error) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.INFO,
          });
          setCollapseFirstModalSection(true);
          setOtpMobileNumber(res.mobile_number);
        } else {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });

        enableLoading(false);
      });
  };

  const resentOtpWithdrawMoney = async () => {
    await RestApi(
      `organizations/${organization?.orgId}/withdraw_money/resend_otp`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          amount: Amount,
          bank_account_id: selectedBank,
        },
      }
    )
      .then((res) => {
        if (res && !res.error)
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.INFO,
          });

        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });

        enableLoading(false);
      });
  };

  const authenticatePayment = async () => {
    enableLoading(true);
    await RestApi(
      `organizations/${organization?.orgId}/withdraw_money/validate_otp`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          amount: Amount,
          otp: otpNumber,
          bank_account_id: selectedBank,
        },
      }
    )
      .then((res) => {
        if (res && !res.error) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.INFO,
          });
        } else {
          openSnackBar({
            message: res.message || res.error.errors,
            type: MESSAGE_TYPE.ERROR,
          });
        }
        setPaymentDialog(false);
        enableLoading(false);
        Navigate('/banking');
      })
      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        Navigate('/banking');
        enableLoading(false);
      });
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  return (
    <>
      <Stack className={css.moneyContainer}>
        <Avatar
          src={LoadMoneyIcon}
          alt="effortless logo"
          sx={{ margin: '40px 0 12px 0' }}
        />
        <Typography className={css.actiontext}>
          Withdraw Money from Effortless Virtual Account
        </Typography>
        <Stack className={css.amountinputwtp}>
          &#8377;
          <input
            name="amount"
            type="number"
            className={css.amountinput}
            min="0"
            onChange={(e) => setAmount(e.target.value)}
            ref={inputRef}
          />
        </Stack>
        <IconButton className={css.amtsubmitbtn} onClick={amountSubmit}>
          <CheckRoundedIcon className={css.amticon} />
        </IconButton>
      </Stack>

      <SelectBottomSheet
        triggerComponent
        open={AccountSelect}
        name="Load Money"
        onClose={() => setAccountSelect(false)}
        addNewSheet
      >
        <AccountListMoney
          actionTyope="withdraw_money"
          LoadAmount={Amount}
          setPaymentResponse={AccountSelectComplete}
        />
      </SelectBottomSheet>

      <Dialog
        open={paymentDialog}
        name="verifyPassword"
        onClose={() => setPaymentDialog(false)}
        styleDrawerMaxHeight="85vh"
        className={css_.dialog}
      >
        <div className={css_.paymentModal}>
          <div className={css_.firstModalSection}>
            {!collapseFirstModalSection && (
              <>
                <p className={css_.virtualAccountTitle}>
                  Effortless Virtual Account
                </p>
                <p className={css_.modalSectionTitle}>Transaction Password</p>
                <p className={css_.modalSectionSubTitle}>
                  Enter the Transaction Password to Activate the Payment Process
                </p>
                <label
                  className={`${css_.paymentModalLabel} ${
                    apiError ? css_.hasError : ''
                  }`}
                >
                  Enter Password
                  <input
                    id="transaction-password"
                    type={showPassword ? 'password' : 'text'}
                    value={transactionPasswordInput}
                    onChange={(e) =>
                      setTransactionPasswordInput(e.target.value)
                    }
                    autoComplete="new-password"
                  />
                  <IconButton
                    size="small"
                    style={{ color: '#000', position: 'absolute', right: 0 }}
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </label>
                {modalError && (
                  <p className={css_.errorMessageModal}>Password is required</p>
                )}
                {apiError !== '' &&
                  (apiError === 'password' && errorMessage !== '' ? (
                    <p className={css_.errorMessageModal}>{errorMessage}</p>
                  ) : (
                    <p className={css_.errorMessageModal}>Invalid Password</p>
                  ))}
                {/* <div className={css_.forgetwrap}>
                  <Button
                    onClick={() => transacForgetPass()}
                    className={css_.forgetPass}
                  >
                    <p
                      className={css.forgetPass}
                      onClick={() => transacForgetPass()}
                    >
                      Forgot Password
                    </p>
                  </Button>
                </div> */}

                <div className={css_.transactionPassBtnContainer}>
                  <button
                    type="button"
                    className={css_.transactionPassBtn}
                    onClick={conformTransactionPassword}
                  >
                    Confirm Password
                  </button>
                </div>
              </>
            )}
            {collapseFirstModalSection && (
              <div className={css_.collapsedTransaction}>
                <p className={css_.modalSectionTitle}>Transaction Password</p>
                <CheckCircleOutlineIcon
                  style={{ color: '#2F9682', fontSize: '40px' }}
                />
              </div>
            )}
          </div>
          <div className={css_.secondModalSection}>
            {collapseFirstModalSection && (
              <>
                <p className={css_.virtualAccountTitle}>
                  Effortless Virtual Account
                </p>
                <p className={css_.modalSectionTitle}>
                  Enter One-Time Password
                </p>
                <p className={css_.modalSectionSubTitleOtp}>
                  Please enter the One-Time Password sent to
                  <span>{otpMobileNumber}</span>
                </p>
                <div
                // className={classes.otpSection}
                >
                  <VerificationCodeInput
                    paymentPage
                    length={VCODE_LENGTH}
                    onChange={onOtpComplete}
                  />
                </div>
                <p
                  className={css_.resentOtp}
                  onClick={() => resentOtpWithdrawMoney()}
                  role="presentation"
                >
                  Resent OTP
                </p>
              </>
            )}
            {!collapseFirstModalSection && (
              <div className={css_.collapsedOtp}>
                <p className={css_.modalSectionTitle}>
                  Enter One-Time Password
                </p>
              </div>
            )}
            {apiError !== '' && apiError === 'otp' && errorMessage !== '' && (
              <p className={css_.errorMessageModal}>{errorMessage}</p>
            )}
          </div>
          <div className={css_.thirdModalSection}>
            <button
              type="button"
              className={css_.paymentModalButton}
              disabled={
                !collapseFirstModalSection || otpNumber.length !== VCODE_LENGTH
              }
              // onClick={() => setCompletedTransaction(true)}
              onClick={() => authenticatePayment()}
            >
              Complete Transaction
            </button>
          </div>
          {/* {completedTransaction && (
            <div className={css.completedTransaction}>
              <p className={css.modalSectionTitle}>Done</p>
              <p className={css.paymentSuccess}>Payment Successful</p>
              <button
                className={css.transactionPassBtn}
                type="button"
                onClick={() => {
                  changeSubView('dashboard');
                  navigate('/dashboard');
                }}
              >
                Return to Dashboard
              </button>
              <button
                type="button"
                className={css.urlToPaymentDashboard}
                onClick={() => {
                  changeSubView('payment');
                  navigate('/payment');
                }}
              >
                Return to Payment Dashboard
              </button>
            </div>
          )} */}
        </div>
      </Dialog>
    </>
  );
};

export default memo(WithdrawMoneyMobile);
