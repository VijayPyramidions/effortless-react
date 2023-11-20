/* eslint-disable no-unused-vars */
/* eslint-disable no-lonely-if */
/* eslint-disable jsx-a11y/media-has-caption */

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import axiosInst from '@action/ApiConfig/AxiosInst';
import { createUpdateAdvPayment } from '@action/Store/Reducers/Payments/AdvancePaymentState';
import {
  openSnackbar,
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import LoadWithDraw from '@components/LoadAndWithdraw/LoadWithDrawSheet';
import TransactionPassword from '@core/PaymentView/TransactionVerify/TransactionPassword';

import SuccessView from '@core/BillBookView/shared/SuccessView';

import {
  Stack,
  Typography,
  IconButton,
  Button,
  // List,
  // ListItem,
  // ListItemText,
  // Checkbox,
} from '@mui/material';

// import ICICITokenVideo from '@assets/BankLogo/ICICIToken.mp4';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';

import { Dialog } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import JSBridge from '@nativeBridge/jsbridge';
// import VerificationView from '@core/PaymentView/EffortlessPay/VerificationView';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import {
  VerificationCodeInput,
  VCODE_LENGTH,
} from '@core/LoginContainer/VerificationCodeContainer';
import * as css from './ProceedToPay.scss';
import PayNow from './PayNow';

const ProceedToPay = ({
  onClose,
  showVerifyPassword,
  bankAccounts,
  paidAmount,
  payNow,
  paymentVoucharId,
  advancePaymentId,
  setMultiplePayments,
  setPaymentsResponse,
  ShowTransForgPass,
  payType,
  BBPSFetchId,
  forgetYes,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const device = localStorage.getItem('device_detect');

  const {
    organization,
    setTransactionType,
    transactionType,
    currentUserInfo,
    setTransactionTypeList,
  } = useContext(AppContext);

  const [otpMobileNumber, setOtpMobileNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [accountId, setAccountId] = useState('');
  const [drawer, setDrawer] = showVerifyPassword;
  const [payUDatas, setPayUData] = useState();
  const [payUSha, setPayUSha] = useState();
  const [showPassword, setShowPassword] = useState(true);
  const [apiError, setApiError] = useState('');
  const [hasBalance, setHasBalance] = useState(
    Number(
      bankAccounts?.connected_banking?.find(
        (a) => a.name === 'Effortless Virtual Account'
      )?.balance -
        Number(paidAmount) >
        0
    )
  );
  const [otpNumber, setOtpNumber] = useState('');
  const [ICICIToken, setICICIToken] = useState('');
  const [modalError, setModalError] = useState(false);
  const [transactionPasswordInput, setTransactionPasswordInput] = useState('');
  const [collapseFirstModalSection, setCollapseFirstModalSection] =
    useState(false);

  const onOtpComplete = (val) => {
    setModalError(false);
    setOtpNumber(val);
  };

  const [completedTransaction, setCompletedTransaction] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [TokenVideoDialog, setTokenVideoDialog] = useState(false);
  const [bankDetail, setBankDetail] = useState({
    data: [],
    open: false,
    id: '',
  });
  const [bankListingDetails, setBankListingDetails] = useState();
  const [congratsDrawer, setCongratsDrawer] = useState(false);
  const [payUlink, setPayUlink] = useState('https://secure.payu.in/_payment');
  const [payUSalt, setPayUSalt] = useState('1m95eGJLk8MgVsrw817fxCkz3YC9JCwu');

  const showError = (message) => {
    dispatch(
      openSnackbar({
        message: message || 'Unknown Error Occured',
        type: 'error',
      })
    );
  };

  function sha512(str) {
    return window.crypto.subtle
      .digest('SHA-512', new TextEncoder('utf-8').encode(str))
      .then((buf) => {
        return Array.prototype.map
          .call(new Uint8Array(buf), (x) => `00${x?.toString(16)}`.slice(-2))
          .join('');
      });
  }

  const createPayment = async (bankId) => {
    await axiosInst
      .post(
        `organizations/${organization.orgId}/effortless_virtual_accounts/create_payment`,
        {
          amount: Number(
            (
              Number(paidAmount) -
              Number(
                bankAccounts.connected_banking?.find(
                  (a) => a.name === 'Effortless Virtual Account'
                )?.balance
              )
            )?.toFixed(2)
          ),
          payment_voucher_id: paymentVoucharId,
          bank_account_id: bankId,
        }
      )
      .then(async (res) => {
        if (res && !res.data?.error) {
          if (localStorage.getItem('device_detect') !== 'desktop') {
            const udf1 = `${window.location.origin}/banking`;
            const payUsha = await sha512(
              `${res.data.key}|${res.data.txn_id}|${res.data.amount}|${res.data.product_info}|${res.data.firstname}|${res.data.email}|${udf1}||||||||||${payUSalt}`
            ).then((x) => x);
            await Object.assign(res.data, { payUsha });
            JSBridge.connectPayU(JSON.stringify(res.data));
          } else {
            const udf1 = `${window.location.origin}/banking`;
            const payUsha = await sha512(
              `${res.data.key}|${res.data.txn_id}|${res.data.amount}|${res.data.product_info}|${res.data.firstname}|${res.data.email}|${udf1}||||||||||${payUSalt}`
            ).then((x) => x);
            setPayUSha(payUsha);
            setPayUData(res.data);
            setTimeout(() => {
              document.getElementById('payUbtn').click();
            }, 2000);
          }
        } else if (res?.data.error) {
          showError(res?.data.message);
        }
      })
      .catch((e) => {
        showError(e);
      });
  };

  const fetchBankDetails = () => {
    dispatch(enableLoading(true));
    axiosInst
      .get(
        `organizations/${organization?.orgId}/yodlee_bank_accounts/bank_listing`
      )
      .then((res) => {
        if (res && !res.data.error) {
          if (res.data.message) {
            dispatch(
              openSnackbar({
                message: res.data.message,
                type: MESSAGE_TYPE.WARNING,
              })
            );
          } else {
            setBankListingDetails(res.data.data);
            setBankDetail((prev) => ({
              ...prev,
              open: true,
              type: 'load',
            }));
          }
        }
        dispatch(enableLoading(false));
      })
      .catch((e) => {
        dispatch(enableLoading(false));
        dispatch(
          openSnackbar({
            message: e.message,
            type: MESSAGE_TYPE.INFO,
          })
        );
      });
  };

  const selectTransactionType = (id) => {
    const BankAccount = bankAccounts?.connected_banking?.find(
      (a) => a.id === id
    );
    if (BankAccount.service_provider === 'fidypay') {
      if (Number(paidAmount) >= 200000) {
        setTransactionTypeList(['NEFT', 'RTGS']);
        setTransactionType('RTGS');
      } else {
        setTransactionTypeList(['NEFT', 'IMPS', 'RTGS']);
        setTransactionType('RTGS');
      }
    } else {
      if (Number(paidAmount) >= 200000) {
        setTransactionTypeList(['RTGS', 'NEFT']);
        setTransactionType('RTGS');
      } else {
        setTransactionTypeList(['NEFT', 'IMPS', 'RTGS']);
        setTransactionType('NEFT');
      }
    }
  };

  const updateAdvancePaymentDetail = async (id) => {
    // dispatch(enableLoading(true));
    const paramsPayload = id
      ? {
          account_id: id,
          paid: true,
          transaction_type: transactionType,
        }
      : {
          transaction_type: transactionType,
        };

    dispatch(
      createUpdateAdvPayment({
        type: 'patch',
        payload: paramsPayload,
        id: advancePaymentId,
      })
    );
  };

  const setAccountToVoucher = async (id) => {
    const paramsPayload = id
      ? {
          account_id: id,
          paid: true,
          transaction_type: transactionType,
        }
      : {
          transaction_type: transactionType,
        };
    await axiosInst
      .patch(
        payType
          ? `organizations/${organization.orgId}/bbps_fetches/${BBPSFetchId}/bbps_payments/${paymentVoucharId}`
          : `organizations/${organization.orgId}/payment_vouchers/${paymentVoucharId}`,
        {
          ...paramsPayload,
        }
      )
      .then((res) => {
        if (res && res.data.error) showError(res.data.message);
      })
      .catch((e) => {
        showError(e);
      });
  };

  const fetchVoucherItemStatus = async () => {
    await axiosInst
      .get(
        `organizations/${organization.orgId}/payment_vouchers/${
          advancePaymentId || paymentVoucharId
        }/items`
      )
      .then((res) => {
        dispatch(enableLoading(false));
        if (res && !res.data.error) {
          if (
            res?.data?.data.find((ele) => ele.payment_status === 'Failed')?.id
          ) {
            setDrawer((d) => ({ ...d, paymentSuccess: true }));
            setMultiplePayments(true);
            setPaymentsResponse(res.data.data);
          } else if (res?.data.data.length === 1) {
            setCompletedTransaction(true);
          } else if (res?.data.data.length > 1) {
            setDrawer((d) => ({ ...d, paymentSuccess: true }));
            setMultiplePayments(false);
          }
        }
      })
      .catch((e) => {
        dispatch(enableLoading(false));
        showError(e);
      });
  };

  const generateOtpForPayment = async () => {
    dispatch(enableLoading(true));
    await axiosInst
      .post(
        `organizations/${organization.orgId}/payment_vouchers/${
          advancePaymentId || paymentVoucharId
        }/generate_otp`,
        {
          transaction_password: transactionPasswordInput,
        }
      )
      .then((res) => {
        dispatch(enableLoading(false));

        if (res?.data?.success) {
          setOtpMobileNumber(res.data.mobile_number);
          dispatch(
            openSnackbar({ message: res.data.message, type: MESSAGE_TYPE.INFO })
          );
          setCollapseFirstModalSection(true);
        } else if (res?.data?.message) {
          setApiError('password');
          showError(res.data.message);
        }
      })
      .catch((e) => {
        showError(e);
        dispatch(enableLoading(false));
      });
  };

  const authenticatePayment = async (otp) => {
    dispatch(enableLoading(true));
    let param = {};
    if (accountId.service_provider === 'icici')
      param = { otp, token: ICICIToken };
    else param = { otp };

    await axiosInst
      .post(
        `organizations/${organization.orgId}/payment_vouchers/${
          advancePaymentId || paymentVoucharId
        }/authenticate_payment`,
        {
          ...param,
        }
      )
      .then((res) => {
        dispatch(enableLoading(false));

        if (res?.data?.success) {
          dispatch(enableLoading(true));
          fetchVoucherItemStatus();
        } else if (res?.data?.error === true) {
          if (res?.data?.errors === 'OTP is invalid') {
            dispatch(enableLoading(false));

            setApiError('otp');
            setErrorMessage('OTP is invalid');
          }
        } else if (res?.data?.message === 'OTP is valid') {
          dispatch(enableLoading(true));
          fetchVoucherItemStatus();
        }
      })
      .catch((e) => {
        showError(
          `${
            e?.errors === 'OTP is invalid'
              ? e.errors
              : 'Sorry Something went wrong'
          }`
        );
        dispatch(enableLoading(false));
      });
  };

  const handlePay = async () => {
    if (accountId.service_provider === 'icici') {
      if (hasBalance) {
        setPaymentDialog(true);
        setCollapseFirstModalSection(false);
      } else {
        await fetchBankDetails();
      }
    } else {
      if (
        !currentUserInfo?.transactionPasswordEnabled ||
        (currentUserInfo?.transactionPasswordEnabled &&
          +new Date(currentUserInfo?.transactionPasswordExpireDate) <=
            +new Date())
      ) {
        setCongratsDrawer(true);
      } else {
        if (accountId === '') {
          return;
        }
        if (hasBalance) {
          setPaymentDialog(true);
          setCollapseFirstModalSection(false);
        } else {
          await fetchBankDetails();
        }
      }
    }
  };

  const confirmPasswordHandler = async () => {
    setApiError('');

    if (
      accountId.service_provider === 'icici'
        ? ICICIToken.length < 4
        : transactionPasswordInput.length < 1
    ) {
      setModalError(true);
      return;
    }
    await generateOtpForPayment();
  };

  const transacForgetPass = () => {
    if (payType) {
      ShowTransForgPass();
      setPaymentDialog(false);
      return;
    }
    setPaymentDialog(false);
    ShowTransForgPass();
    if (!forgetYes) onClose();
  };

  useEffect(() => {
    if (transactionType) {
      if (advancePaymentId) {
        updateAdvancePaymentDetail();
      } else {
        setAccountToVoucher(accountId.id);
      }
    }
  }, [transactionType]);

  useEffect(() => {
    setTransactionPasswordInput('');
    if (accountId !== '') {
      const balance = bankAccounts.connected_banking?.find(
        (a) => a.id === accountId.id
      ).balance;
      setHasBalance(Number(balance) > Number(paidAmount));
      if (advancePaymentId) {
        updateAdvancePaymentDetail(accountId.id);
      } else {
        setAccountToVoucher(accountId.id);
      }
      selectTransactionType(accountId.id);
    }
  }, [accountId?.id]);

  useEffect(() => {
    const live =
      window.location.origin === 'https://app.goeffortless.co' ||
      window.location.origin === 'https://i.goeffortless.ai' ||
      window.location.origin === 'https://d11997a5ngzp0a.cloudfront.net';
    if (live) {
      setPayUlink('https://secure.payu.in/_payment');
      setPayUSalt('1m95eGJLk8MgVsrw817fxCkz3YC9JCwu');
    } else {
      setPayUlink('https://test.payu.in/_payment');
      setPayUSalt('4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW');
    }
  }, []);
  return (
    <>
      <div style={{ display: 'none' }}>
        <form action={payUlink} method="post">
          <input type="hidden" name="key" value={payUDatas?.key} />
          <input type="hidden" name="txnid" value={payUDatas?.txn_id} />
          <input
            type="hidden"
            name="drop_category"
            value={payUDatas?.drop_category}
          />
          <input type="hidden" name="pg" value={payUDatas?.pg} />
          <input
            type="hidden"
            name="productinfo"
            value={payUDatas?.product_info}
          />
          <input type="hidden" name="amount" value={payUDatas?.amount} />
          <input type="hidden" name="email" value={payUDatas?.email} />
          <input type="hidden" name="firstname" value={payUDatas?.firstname} />
          {/* <!-- <input type="hidden" name="lastname" value="Kumar" /> --> */}
          <input type="hidden" name="surl" value={payUDatas?.surl} />
          <input type="hidden" name="furl" value={payUDatas?.furl} />
          <input type="hidden" name="phone" value={payUDatas?.phone} />
          <input type="hidden" name="hash" value={payUSha} />
          <input type="submit" value="submit" id="payUbtn" />{' '}
        </form>
      </div>
      <div className={css.proceedToPay}>
        {device === 'desktop' ? (
          <Stack style={{ alignItems: 'center', marginTop: '1rem' }}>
            <Typography className={css.heading}>Make Payment</Typography>
          </Stack>
        ) : (
          <div className={css.proceedpay_title}>
            <h6>PROCEED TO PAY</h6>
          </div>
        )}
        <div className={`${css.headerContainer} `}>
          <div className={css.headerLabel}>Payment Methods</div>
          <span className={css.headerUnderline} />
        </div>
        <Stack
          className={
            device === 'desktop' ? css.flowStackDesktop : css.flowStack
          }
        >
          <div className={css.connected_heading}>
            <div className={`${css.headerContainer} ${css.drawer}`}>
              <div className={css.headerLabel}>Connected Banking</div>
            </div>
            {bankAccounts?.connected_banking?.length === 0 ? (
              <Typography>No Connected Bank Account is Added</Typography>
            ) : (
              <>
                {bankAccounts?.connected_banking &&
                  bankAccounts?.connected_banking?.length > 0 &&
                  bankAccounts?.connected_banking?.map((item) => {
                    return (
                      <div className={css.connected_row}>
                        <label htmlFor={item.id}>
                          <div className={css.body}>
                            <div className={css.billcontentrowinput}>
                              <div className={css.headerLabel}>{item.name}</div>
                              <input
                                type="radio"
                                name={item.name}
                                id={item.id}
                                value={item.id}
                                className={css.checkedRadio}
                                disabled={
                                  item.name === 'Effortless Virtual Account'
                                    ? false
                                    : Number(item.balance) < Number(paidAmount)
                                }
                                onChange={() => setAccountId(item)}
                                checked={item.id === accountId.id}
                              />
                            </div>
                            <p className={css.totalBill}>
                              Balance: {FormattedAmount(item?.balance)}
                            </p>
                            {item.name === 'Effortless Virtual Account' &&
                              item.balance !== '0.0' &&
                              Number(item.balance) < Number(paidAmount) && (
                                <p className={css.error}>
                                  Use {FormattedAmount(item?.balance)} and add
                                  remaining{' '}
                                  {FormattedAmount(
                                    Number(paidAmount) - Number(item?.balance)
                                  )}{' '}
                                  from other bank account
                                </p>
                              )}
                            {item.name === 'Effortless Virtual Account' &&
                              item.balance === '0.0' && (
                                <p className={css.error}>
                                  Add {FormattedAmount(paidAmount)} From other
                                  Bank Account
                                </p>
                              )}
                          </div>
                        </label>
                      </div>
                    );
                  })}
              </>
            )}
          </div>
          {bankAccounts?.other_bank_accounts &&
            bankAccounts.other_bank_accounts.length > 0 && (
              <div className={css.connected_heading}>
                <div className={`${css.headerContainer} ${css.drawer}`}>
                  <div className={css.headerLabel}>Other Bank Acccounts</div>
                </div>
                {bankAccounts?.other_bank_accounts.length === 0 ? (
                  <Typography>No Other Bank Account is Added</Typography>
                ) : (
                  <>
                    {bankAccounts.other_bank_accounts.map((item) => {
                      return (
                        <div className={css.connected_row}>
                          <div className={css.body}>
                            <div className={css.billcontentrow}>
                              <div className={css.headerLabel}>{item.name}</div>
                              <span className={css.billName}>
                                {item.account_type} Account
                              </span>
                            </div>
                            <p className={css.totalBill}>
                              XX
                              {item?.account_number
                                ?.toString()
                                ?.substr(item?.account_number.length - 4, 4)}
                              : {FormattedAmount(item?.balance)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
        </Stack>

        {/* //   <Stack className={css.paymmentMobile}>
          //     <Typography variant="h3" className={css.title}>
          //       Proceed to Payment
          //     </Typography>
          //     <Typography className={css.desc}>
          //       Select the Invoices which you want to Refund
          //     </Typography>
          //     <Stack className={css.banksLists}>
          //       <Stack>
          //         <Typography className={css.connectbanktitle}>
          //           Connedcted Banking
          //         </Typography>
          //         <List
          //           sx={{
          //             width: '100%',
          //             maxWidth: 480,
          //             bgcolor: 'background.paper',
          //             padding: 0,
          //           }}
          //         >
          //           {bankAccounts?.connected_banking &&
          //             bankAccounts?.connected_banking?.length > 0 &&
          //             bankAccounts?.connected_banking?.map((item) => (
          //               <ListItem
          //                 key={item.id}
          //                 className={css.listItem}
          //                 secondaryAction={
          //                   <Checkbox
          //                     edge="end"

          //                     // onChange={handleToggle(value)}
          //                     // checked={checked.indexOf(value) !== -1}
          //                     // inputProps={{ 'aria-labelledby': labelId }}
          //                   />
          //                 }
          //                 sx={{
          //                   '& .MuiListItemText-multiline': {
          //                     margin: 0,
          //                     position: 'relative',

          //                     '& .MuiListItemText-primary': {
          //                       color: '#283049',
          //                       fontFamily: "'Lexend',sans-serif!important",
          //                       fontSize: '16px !important',
          //                       fontWeight: 400,
          //                       lineHeight: 'normal',
          //                       marginBottom: '8px',
          //                     },
          //                   },
          //                   '& .MuiListItemSecondaryAction-root': {
          //                     width: '24px',
          //                     height: '24px',
          //                     top: '17px',
          //                     right: '-3px',

          //                     '& .MuiCheckbox-root': {
          //                       color: '#283049',
          //                       padding: 0,

          //                       '&.Mui-checked': {
          //                         color: '#F08B32',
          //                       },
          //                     },
          //                   },
          //                 }}
          //               >
          //                 <ListItemText
          //                   primary={item.name}
          //                   secondary={
          //                     <p className={css.balLablel}>
          //                       {item.name === 'Effortless Virtual Account'
          //                         ? 'Balace: '
          //                         : `Acc. No. ${item.account_number}:`}
          //                       <span className={css.accbal}>
          //                         {` Rs. ${item.balance || 0}`}
          //                       </span>
          //                     </p>
          //                   }
          //                 />
          //               </ListItem>
          //             ))}
          //         </List>
          //       </Stack>
          //       <Stack>
          //         <Typography className={css.otherBanktitle}>
          //           Other Bank Accounts
          //         </Typography>

          //         <List
          //           sx={{
          //             width: '100%',
          //             maxWidth: 480,
          //             bgcolor: 'background.paper',
          //             padding: 0,
          //           }}
          //         >
          //           {bankAccounts?.other_bank_accounts &&
          //             bankAccounts?.other_bank_accounts?.length > 0 &&
          //             bankAccounts?.other_bank_accounts?.map((item) => (
          //               <ListItem
          //                 key={item.id}
          //                 className={css.listItem}
          //                 sx={{
          //                   '& .MuiListItemText-multiline': {
          //                     margin: 0,
          //                     position: 'relative',

          //                     '& .MuiListItemText-primary': {
          //                       color: '#283049',
          //                       fontFamily: "'Lexend',sans-serif!important",
          //                       fontSize: '16px !important',
          //                       fontWeight: 400,
          //                       lineHeight: 'normal',
          //                       marginBottom: '8px',
          //                     },
          //                   },
          //                   '& .MuiListItemSecondaryAction-root': {
          //                     width: '24px',
          //                     height: '24px',
          //                     top: '17px',
          //                     right: '-3px',

          //                     '& .MuiCheckbox-root': {
          //                       color: '#283049',
          //                       padding: 0,

          //                       '&.Mui-checked': {
          //                         color: '#F08B32',
          //                       },
          //                     },
          //                   },
          //                 }}
          //               >
          //                 <ListItemText
          //                   primary={item.name}
          //                   secondary={
          //                     <p
          //                       className={`${css.balLablel} ${css.otherLabel}`}
          //                     >
          //                       {`XX${item?.account_number?.slice(-4)}:`}
          //                       <span
          //                         className={`${css.accbal} ${css.otherbal}`}
          //                       >
          //                         {` Rs .${item.balance || 0}`}
          //                       </span>
          //                     </p>
          //                   }
          //                 />
          //               </ListItem>
          //             ))}
          //         </List>
          //       </Stack>
          //     </Stack>
          //   </Stack> */}

        {device === 'desktop' ? (
          <Stack>
            <PayNow
              active={!!accountId.id}
              title={payNow.title}
              subTitle={!payType && payNow.subTitle}
              handlePay={() => handlePay()}
              hasBalance={hasBalance}
              hidden
            />
          </Stack>
        ) : (
          <div className={css.payNow}>
            <PayNow
              active={!!accountId.id}
              title={payNow.title}
              subTitle={!payType && payNow.subTitle}
              handlePay={() => handlePay()}
              // handlePay={() => setPaymentDialog(true)}
              hasBalance={hasBalance}
              hidden
            />
          </div>
        )}
      </div>

      <Dialog
        // open={drawer.verifyPassword}
        open={paymentDialog}
        name="verifyPassword"
        // onClose={() => setDrawer(false)}
        onClose={() => {
          setPaymentDialog(false);
          if (completedTransaction) {
            navigate('/payment-history');
          }
        }}
        styleDrawerMaxHeight="85vh"
        className={css.dialog}
      >
        <div
          className={css.paymentModal}
          style={{ width: device === 'desktop' ? '500px' : 'auto' }}
        >
          <div className={css.firstModalSection}>
            {!collapseFirstModalSection && (
              <>
                <p className={css.virtualAccountTitle}>
                  {/* Effortless Virtual Account */}
                  {accountId.name}
                </p>
                <p className={css.modalSectionTitle}>
                  {accountId.service_provider === 'icici'
                    ? 'Transaction Token Number'
                    : 'Transaction Password'}
                </p>
                <p className={css.modalSectionSubTitle}>
                  Enter the Transaction Password to Activate the Payment Process
                </p>
                {accountId.service_provider === 'icici' ? (
                  <div>
                    <VerificationCodeInput
                      paymentPage
                      length={4}
                      onChange={(val) => {
                        setModalError(false);
                        setICICIToken(val);
                      }}
                      dataCode={ICICIToken}
                    />
                  </div>
                ) : (
                  <label
                    className={`${css.paymentModalLabel} ${
                      apiError ? css.hasError : ''
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
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </label>
                )}

                {modalError && (
                  <p
                    className={css.errorMessageModal}
                    style={
                      accountId.service_provider === 'icici'
                        ? { marginLeft: device === 'mobile' ? 34 : 103 }
                        : {}
                    }
                  >
                    {accountId.service_provider === 'icici'
                      ? 'ICICI Token is required'
                      : 'Password is required'}
                  </p>
                )}
                {apiError !== '' &&
                  (apiError === 'password' && errorMessage !== '' ? (
                    <p className={css.errorMessageModal}>{errorMessage}</p>
                  ) : (
                    <p className={css.errorMessageModal}>Invalid Password</p>
                  ))}

                <div className={css.forgetwrap}>
                  {accountId.service_provider === 'icici' ? (
                    <Stack
                      //  onClick={() => transacForgetPass()}
                      className={css.playbtn}
                      onClick={() => setTokenVideoDialog(true)}
                    >
                      How to find Token ID {/* <IconButton> */}
                      <PlayCircleOutlineRoundedIcon
                        sx={{
                          width: '16px',
                          height: '16px',
                          marginLeft: '4px',
                        }}
                      />
                      {/* </IconButton> */}
                    </Stack>
                  ) : (
                    <Button
                      onClick={() => transacForgetPass()}
                      className={css.forgetPass}
                    >
                      Forgot Password
                    </Button>
                  )}
                </div>

                <div className={css.transactionPassBtnContainer}>
                  <button
                    type="button"
                    className={css.transactionPassBtn}
                    onClick={confirmPasswordHandler}
                  >
                    {accountId.service_provider === 'icici'
                      ? 'Generate OTP'
                      : 'Confirm Password'}
                  </button>
                </div>
              </>
            )}
            {collapseFirstModalSection && (
              <>
                {accountId.service_provider === 'icici' ? (
                  <div className={css.collapsedTokenTransaction}>
                    <p className={css.modalSectionTokenTitle}>
                      Transaction Token Number
                    </p>
                    {/* {ICICIToken} */}
                    <p className={css.iciciToken}>* * * *</p>
                    <IconButton
                      className={css.downarrbtn}
                      onClick={() => setCollapseFirstModalSection(false)}
                    >
                      <KeyboardDoubleArrowDownRoundedIcon
                        className={css.arrowicon}
                      />
                    </IconButton>
                  </div>
                ) : (
                  <div className={css.collapsedTransaction}>
                    <p className={css.modalSectionTitle}>
                      Transaction Password
                    </p>
                    <CheckCircleOutlineIcon
                      style={{ color: '#2F9682', fontSize: '40px' }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          <div className={css.secondModalSection}>
            {collapseFirstModalSection && (
              <>
                <p className={css.virtualAccountTitle}>
                  {/* Effortless Virtual Account */}
                  {accountId.name}
                </p>
                <p className={css.modalSectionTitle}>Enter One-Time Password</p>
                <p className={css.modalSectionSubTitleOtp}>
                  Please enter the One-Time Password sent to{' '}
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
                  className={css.resentOtp}
                  onClick={() => generateOtpForPayment()}
                  role="presentation"
                >
                  Resent OTP
                </p>
              </>
            )}
            {!collapseFirstModalSection && (
              <div className={css.collapsedOtp}>
                <p className={css.modalSectionTitle}>Enter One-Time Password</p>
              </div>
            )}
            {apiError !== '' && apiError === 'otp' && errorMessage !== '' && (
              <p className={css.errorMessageModal}>{errorMessage}</p>
            )}
          </div>
          <div className={css.thirdModalSection}>
            <button
              type="button"
              className={css.paymentModalButton}
              disabled={
                !collapseFirstModalSection || otpNumber.length !== VCODE_LENGTH
              }
              // onClick={() => setCompletedTransaction(true)}
              onClick={() => authenticatePayment(otpNumber)}
            >
              Complete Transaction
            </button>
          </div>
          {completedTransaction && (
            <div className={css.completedTransaction}>
              <SuccessView
                title="Your Payment is Being Processed"
                description=""
                btnTitle="Close"
                onClick={() => {
                  onClose('success');
                }}
                redir
              />
              {/* <p className={css.modalSectionTitle}>Done</p>
              <p className={css.paymentSuccess}>Payment Successful</p>
              <button
                className={css.transactionPassBtn}
                type="button"
                onClick={() => {
                  if (payType) {
                    setCollapseFirstModalSection(false);
                    onClose();
                  } else {
                    changeSubView('dashboard');
                    navigate('/dashboard');
                  }
                }}
              >
                {payType ? 'Close' : 'Return to Dashboard'}
              </button> */}
              {/* {!payType && (
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
              )} */}
            </div>
          )}
        </div>
        {/* <div>Hey</div>
          <div>there</div> */}
        {/* <DialogContent>
            <form>
              <VerificationView
                otpMobileNumber={otpMobileNumber}
                successfullyPayment={handleVerify}
                resendOtp={generateOtpForPayment}
                hasTransactionPassword
                errorMessage={errorMessage}
                oneClickButton={oneClickButton}
              />
            </form>
          </DialogContent> */}
      </Dialog>
      <Dialog
        // open={drawer.verifyPassword}
        open={TokenVideoDialog}
        name="verifyPassword"
        // onClose={() => setDrawer(false)}
        onClose={() => setTokenVideoDialog(false)}
        styleDrawerMaxHeight="85vh"
        className={css.dialog}
      >
        <video
          width="100%"
          height="100%"
          controls
          autoPlay
          className={css.videPlayer}
        >
          <source
            src="http://techslides.com/demos/sample-videos/small.mp4"
            // src={ICICITokenVideo}
            type="video/mp4"
          />
          <source src="movie.ogg" type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </Dialog>

      <Dialog
        open={bankDetail?.open}
        onClose={() => setBankDetail((prev) => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
      >
        <LoadWithDraw
          type={bankDetail?.type}
          // accounts={[...new Set([...bankDetail?.data?.connected_banking, ...bankListingDetails])]}
          accounts={bankAccounts?.connected_banking?.concat(bankListingDetails)}
          handleBottomSheet={async (bankId) => {
            setBankDetail((prev) => ({ ...prev, open: false, id: bankId }));
            if (bankDetail?.type === 'load') {
              await createPayment(bankId);
            }
          }}
        />
      </Dialog>
      <SelectBottomSheet
        name="congratsDrawer"
        triggerComponent={<div style={{ display: 'none' }} />}
        open={congratsDrawer}
        addNewSheet
        maxHeight="45vh"
        onClose={() => setCongratsDrawer(false)}
      >
        <TransactionPassword onClose={() => setCongratsDrawer(false)} />
      </SelectBottomSheet>
    </>
  );
};

export default ProceedToPay;
