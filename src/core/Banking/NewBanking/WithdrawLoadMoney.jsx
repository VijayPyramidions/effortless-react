/* eslint-disable  no-nested-ternary */
import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  memo,
  useRef,
} from 'react';
import { useDispatch } from 'react-redux';

import axiosInst from '@action/ApiConfig/AxiosInst';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  Radio,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import { Dialog } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';

import {
  VerificationCodeInput,
  VCODE_LENGTH,
} from '@core/LoginContainer/VerificationCodeContainer';
import { useNavigate } from 'react-router-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import effLogo from '@assets/BankLogo/ef.svg';
import IppoPay from './Ippopay';
import { InputText } from '../../../components/Input/Input';
import Searchicon from '../../../assets/search_1.svg';
// import icici from '../../../assets/BankLogo/icicilogo.svg';
import * as css from './bankingnew.scss';
import * as css_ from '../../PaymentView/shared/ProceedToPay.scss';
import AddVendorManual from '../../../components/CreateNew/VendorNew/AddVendorManual';

const TextfieldStyle = (props) => {
  return (
    <InputText
      {...props}
      variant="standard"
      InputLabelProps={{
        shrink: true,
        className: css.amountlabel,
      }}
      theme="light"
      className={css.textfieldStyle}
    />
  );
};

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,

  backgroundColor: '#FFFFFF',
  border: '1px solid #F08B32',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  padding: 0,
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: '#FFFFFF',
    border: '1px solid #F08B32',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(57,75,89,.5)'
        : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#F08B32',

  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#F08B32',
  },
});

const BpRadio = (props) => {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
};

const useStyles = makeStyles(() => ({
  root: {
    '&:hover': {
      backgroundColor: 'transparant',
    },
    '& .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded': {
      borderRadius: '18px',
      maxWidth: 500,
    },
  },
  RadioRoot: {
    padding: 0,
    marginRight: '20px !important',

    '& .MuiRadio-root': {
      padding: 0,
    },
  },
  RadioRootPromoter: {
    padding: 0,
    marginRight: '20px !important',
    marginLeft: '0px !important',

    '& .MuiRadio-root': {
      padding: '6px',
    },
  },
  listitemRoot: {
    padding: '0px !important',
    marginBottom: '30px',

    '& :lastchild': {
      marginBottom: 0,
    },

    '& .MuiListItemSecondaryAction-root': {
      right: 0,
    },
  },
  listitemRootPromoter: {
    padding: '0px !important',
    marginBottom: '26px',

    '& :lastchild': {
      marginBottom: 0,
    },

    '& .MuiListItemSecondaryAction-root': {
      right: 0,
    },
  },
  AccountText: {
    '& .MuiListItemText-primary': {
      fontWeight: 400,
      fontSize: '13px',
      lineHeight: '16px',
      color: '#2E3A59',
    },
    '& .MuiListItemText-secondary': {
      fontWeight: 300,
      fontSize: '12px',
      lineHeight: '15px',
      color: '#6E6E6E',
    },
  },
}));

const WithdrawLoadMoney = ({ onClose, actionType, skip, allocatedAmount }) => {
  const dispatch = useDispatch();
  const { organization } = useContext(AppContext);

  const inputRef = useRef();
  const [Amount, setAmount] = useState('');

  const [btnutils, setbtnutils] = useState({
    title: '',
    desc: '',
    btntext: '',
  });

  const [bankDetail, setBankDetail] = useState([]);
  const [limitedBank, setlimitedBank] = useState([]);
  const [selectedBank, setselectedBank] = useState('');
  const [error, setErrors] = useState({ error: false, msg: '' });
  const [action, setaction] = useState('amount');

  const [Search, setSearch] = useState('');

  const [actionHandler, setactionHandler] = useState(false);

  const [drawer, setDrawer] = useState(false);
  const [promoterSearch, setPromoterSearch] = useState('');
  const [promoterLists, setPromoterLists] = useState([]);
  const [limitedPromoterLists, setLimitedPromoterLists] = useState([]);
  const [selectedPromoter, setSelectedPromoter] = useState('');

  const classes = useStyles();

  // Ippo Pay //

  const [paymentResponse] = useState();
  const [ippoPayModal, setIppopayModal] = useState(false);

  // Ippo Pay //

  // Transaction PassWord //
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [collapseFirstModalSection, setCollapseFirstModalSection] =
    useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [transactionPasswordInput, setTransactionPasswordInput] = useState('');
  const [apiError] = useState('');
  const [modalError] = useState(false);
  const [errorMessage] = useState('');
  const [otpMobileNumber, setOtpMobileNumber] = useState('');
  const [otpNumber, setOtpNumber] = useState('');
  // const [options, setOptions] = useState();
  const navigate = useNavigate();
  // Transaction PassWord //

  const onOtpComplete = (val) => setOtpNumber(val);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const OnInputChange = (e) => {
    if (e.target.value === '')
      setErrors({
        ...error,
        error: true,
        msg: 'Please enter the valid amout',
      });
    else setErrors({ ...error, error: false, msg: '' });
    setAmount(e.target.value);
  };

  const verifyAmount = async () => {
    // setaction('account');
    // setbtnutils({
    //   ...btnutils,
    //   title: 'Choose Account To Withdraw Money',
    //   desc: 'Withdraw Money to your Effortless Virtual Account',
    //   btntext: `Withdraw Rs. ${Amount}`,
    // });
    dispatch(enableLoading(true));
    await axiosInst(
      `organizations/${organization?.orgId}/withdraw_money/withdraw_request`,
      {
        amount: Number(Amount),
      }
    )
      .then(({ data }) => {
        dispatch(enableLoading(false));

        if (data && !data.error && data.message === 'Select Bank Account') {
          setaction('account');
          setbtnutils({
            ...btnutils,
            title: 'Choose Account To Withdraw Money',
            desc: 'Withdraw Money to your Effortless Virtual Account',
            btntext: `Withdraw Rs. ${Amount}`,
          });
        } else {
          dispatch(
            openSnackbar({
              message:
                data.message || data.error || 'Sorry, Something went wrong',
              type: MESSAGE_TYPE.ERROR,
            })
          );
        }
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: e.message || e.error || 'Sorry, Something went wrong',
            type: MESSAGE_TYPE.ERROR,
          })
        );
        dispatch(enableLoading(false));
      });
  };

  const amountSubmit = () => {
    if (Number(Amount) === 0 || Amount === '') {
      setErrors({
        ...error,
        error: true,
        msg: 'Please enter the valid amout',
      });
      return;
    }
    // if (Number(Amount) < 51) {
    //   setErrors({
    //     ...error,
    //     error: true,
    //     msg: 'Minumum Net Banking Amount Rs. 51',
    //   });
    //   return;
    // }
    if (actionType === 'load_money') {
      setaction('account');
      setbtnutils({
        ...btnutils,
        title: 'Choose Account To Load Money',
        desc: 'Load Money to your Effortless Virtual Account',
        btntext: `Load Rs. ${Amount}`,
      });
    } else verifyAmount();
  };

  const CapturePayment = async (type, dataRes) => {
    dispatch(enableLoading(true));
    // setOptions();

    const payload =
      type === 'error'
        ? {
            ...dataRes,
            razorpay_order_id: dataRes?.orderId,
          }
        : type === 'succes'
        ? {
            ...dataRes,
          }
        : { ...dataRes, order_id: dataRes.merchantTransactionIdentifier };

    await axiosInst
      .patch(
        `organizations/${organization?.orgId}/effortless_virtual_accounts/capture_payment`,
        {
          ...payload,
        }
      )
      .then(({ data }) => {
        dispatch(enableLoading(false));
        navigate('/banking');
        onClose();

        if (data?.error) {
          setTimeout(() => {
            dispatch(
              openSnackbar({
                message: data.message || 'Sorry, Something went wrong',
                type: MESSAGE_TYPE.ERROR,
              })
            );
          }, 700);
        } else {
          setTimeout(() => {
            dispatch(
              openSnackbar({
                message: data.message || 'Sorry, Something went wrong',
                type: MESSAGE_TYPE.INFO,
              })
            );
          }, 700);
        }
        navigate('/payment-history', { state: { paymentType: 'virtual' } });
        console.log('capture payment', data);
      })
      .catch((e) => {
        dispatch(enableLoading(false));
        console.log('capture payment err', e);
        onClose();
      });
  };

  const payNimoResponse = (data) => {
    if (
      typeof data !== 'undefined' &&
      typeof data.paymentMethod !== 'undefined' &&
      typeof data.paymentMethod.paymentTransaction !== 'undefined' &&
      typeof data.paymentMethod.paymentTransaction.statusCode !== 'undefined' &&
      data.paymentMethod.paymentTransaction.statusCode === '0300'
    ) {
      // success block
      CapturePayment('allResponse', data);
    } else if (
      typeof data !== 'undefined' &&
      typeof data.paymentMethod !== 'undefined' &&
      typeof data.paymentMethod.paymentTransaction !== 'undefined' &&
      typeof data.paymentMethod.paymentTransaction.statusCode !== 'undefined' &&
      data.paymentMethod.paymentTransaction.statusCode === '0398'
    ) {
      // initiated block
      CapturePayment('allResponse', data);
    } else {
      // error block
      CapturePayment('allResponse', data);
      onClose();
    }
  };

  const triggerPayNimo = (data) => {
    const reqJson = {
      features: {
        enableAbortResponse: true,
        enableExpressPay: true,
        enableInstrumentDeRegistration: true,
        enableMerTxnDetails: true,
        enableNewWindowFlow: true, // for hybrid applications please disable this by passing false
      },
      consumerData: {
        deviceId: 'WEBSH2', // possible values "WEBSH1" or "WEBSH2"
        token: data?.token,
        responseHandler: payNimoResponse,
        paymentMode: data?.paymentMode,
        paymentModeOrder: data?.payment_mode_order,
        merchantLogoUrl:
          'https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/effortless.svg', // provided merchant logo will be displayed
        merchantId: data?.merchant_id,
        currency: 'INR',
        consumerId: data?.consumer_id,
        consumerMobileNo: data?.mobile_no,
        consumerEmailId: data?.email_id,
        txnId: data?.txn_id,
        items: [
          {
            itemId: data?.payment_item_id,
            amount: data?.amount,
            comAmt: data?.commission_amount,
          },
        ],
        customStyle: {
          PRIMARY_COLOR_CODE: '#F08B32', // merchant primary color code #45beaa
          SECONDARY_COLOR_CODE: '#FFFFFF', // provide merchant's suitable color code #2d8c8c
          BUTTON_COLOR_CODE_1: '#e67b1e', // merchant's button background color code
          BUTTON_COLOR_CODE_2: '#FFFFFF', // provide merchant's suitable color code for button text
        },
      },
    };

    window.$.pnCheckout(reqJson);
    // if (reqJson.features.enableNewWindowFlow) {
    //   window.pnCheckoutShared.openNewWindow();
    // }
  };

  const Proceed = async () => {
    if (
      selectedBank.bank_account_type === 'founder' &&
      selectedPromoter === ''
    ) {
      setaction('promoter');
      setbtnutils((prev) => ({
        ...prev,
        title: 'Select Promoter',
        desc: 'Select Promoter who is brining in money into Effortless Virtual Account',
      }));
      return;
    }
    let payload;

    if (selectedBank.bank_account_type === 'founder')
      payload = {
        amount: Amount,
        bank_account_id: selectedBank.bank_account_id,
        entity_id: selectedPromoter.id,
      };
    else
      payload = {
        amount: Amount,
        bank_account_id: selectedBank.bank_account_id,
      };

    if (actionType === 'load_money')
      await axiosInst
        .post(
          `organizations/${organization?.orgId}/effortless_virtual_accounts/create_payment`,
          {
            ...payload,
          }
        )
        .then(({ data }) => {
          if (data && !data?.error) {
            // if (data?.collection_service_provider === 'ippopay') {
            //   setPaymentResponse(data);
            //   return;
            // }

            // if (localStorage.getItem('device_detect') !== 'desktop' && data?.collection_service_provider === 'payU') {
            //   const udf1 = `${window.location.origin}/banking`;
            //   const payUsha = await sha512(
            //     `${data.key}|${data.txn_id}|${data.amount}|${data.product_info}|${data.firstname}|${data.email}|${udf1}||||||||||${payUSalt}`,
            //   ).then((x) => x);

            //   if (authenticate)
            //     JSBridge.connectPayU(JSON.stringify(data, payUsha));
            // } else  if (data?.collection_service_provider === 'payU'){
            //   const udf1 = `${window.location.origin}/banking`;
            //   const payUsha = await sha512(
            //     `${data.key}|${data.txn_id}|${data.amount}|${data.product_info}|${data.firstname}|${data.email}|${udf1}||||||||||${payUSalt}`,
            //   ).then((x) => x);
            //   setPayUSha(payUsha);
            //   setPayUData(data);
            //   setTimeout(() => {
            //     document.getElementById('payUbtn').click();
            //     enableLoading(false);
            //   }, 2000);
            // }

            setaction('ippopay');

            if (data?.collection_service_provider === 'paynimo') {
              onClose();
              triggerPayNimo(data);
            } else {
              const option = {
                key: data?.key,
                order_id: data?.order_id,
                amount: data?.amount,
                currency: 'INR',
                prefill: {
                  name: data?.name,
                  email: data?.email,
                  mobile_number: data?.mobile_number,
                },
                config: {
                  display: {
                    utib: {
                      instruments: data?.allowed_options?.map((val) => {
                        return { method: val };
                      }),
                    },
                    hide: data?.blocked_options?.map((val) => {
                      return { method: val };
                    }),

                    preferences: {
                      show_default_blocks: true,
                    },
                  },
                },
                theme: {
                  color: '#3399cc',
                },

                handler: (res) => {
                  if (res.razorpay_order_id) CapturePayment('succes', res);
                  else console.log('success', res);
                },

                modal: {
                  backdropclose: false,
                  escape: false,
                  handleback: true,
                  confirm_close: true,
                  ondismiss: () => onClose(),
                },
                retry: {
                  enabled: false,
                },
              };

              // setOptions(option);

              const rzp1 = new window.Razorpay(option);

              rzp1.on('payment.failed', (res) => {
                console.table('payment.failed', res);
                setTimeout(
                  () =>
                    CapturePayment('error', { ...res, orderId: data.order_id }),
                  6000
                );
              });

              rzp1.on('payment.cancelled', (res) => {
                // Handle payment cancellation

                console.log('Payment Cancelled:', res);
                setTimeout(
                  () =>
                    CapturePayment('error', { ...res, orderId: data.order_id }),
                  6000
                );
              });

              rzp1.on('issuer_technical_error', (res) => {
                // Handle payment cancellation
                console.log('issuer_technical_error:', res);
                setTimeout(
                  () =>
                    CapturePayment('error', { ...res, orderId: data.order_id }),
                  6000
                );
              });

              rzp1.on('payment.captured', (res) => {
                // Handle payment cancellation
                console.log('Payment captured:', res);
                setTimeout(
                  () =>
                    CapturePayment('error', { ...res, orderId: data.order_id }),
                  6000
                );
              });

              rzp1.on('external_error', (res) => {
                // Handle external error
                console.log('External Error:', res);
                setTimeout(
                  () =>
                    CapturePayment('error', { ...res, orderId: data.order_id }),
                  6000
                );
              });

              rzp1.open();
            }
          } else if (data?.error)
            dispatch(
              openSnackbar({
                message:
                  data.error || data.message || 'Sorry, Something went wrong',
                type: MESSAGE_TYPE.ERROR,
              })
            );
        })
        .catch((e) => {
          console.log('Error :', e);
          dispatch(enableLoading(false));
        });
    else {
      setPaymentDialog(true);
      setaction('ippopay');
    }
  };

  const AccountConfirmation = () => {
    onClose();
  };

  //   const debounce = (func) => {
  //     let timer;
  //     return function (...args) {
  //       const context = this;
  //       if (timer) clearTimeout(timer);
  //       timer = setTimeout(() => {
  //         timer = null;
  //         func.apply(context, args);
  //       }, 500);
  //     };
  //   };

  const FilterBank = () => {
    const filteredBanks = bankDetail.filter((item) =>
      item?.display_name?.toLowerCase().includes(Search?.toLowerCase())
    );
    setlimitedBank(filteredBanks);
  };

  const FilterPromoter = () => {
    axiosInst
      .get(
        `organizations/${organization.orgId}/entities?type[]=promoter&search=${promoterSearch}`
      )
      .then(({ data }) => {
        setLimitedPromoterLists(data.data);
      })
      .catch((e) => console.log(e));
  };

  const FetchConnectedBank = async () => {
    dispatch(enableLoading(true));
    await axiosInst
      .get(
        `organizations/${organization?.orgId}/yodlee_bank_accounts/bank_listing?payment_gateway=true`
      )
      .then(({ data }) => {
        if (data && !data?.error) {
          console.log(data, 'connected');
          setBankDetail(data?.data);
          setlimitedBank(data?.data);
        }
        dispatch(enableLoading(false));
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: Object.values(e.errors).join(),
            type: MESSAGE_TYPE.ERROR,
          })
        );

        dispatch(enableLoading(false));
      });
  };

  const conformTransactionPassword = async () => {
    dispatch(enableLoading(true));
    await axiosInst
      .post(
        `organizations/${organization?.orgId}/withdraw_money/generate_otp`,
        {
          amount: Amount,
          transaction_password: transactionPasswordInput,
          bank_account_id: selectedBank.bank_account_id,
        }
      )
      .then(({ data }) => {
        if (data && !data.error) {
          dispatch(
            openSnackbar({
              message: data.message,
              type: MESSAGE_TYPE.INFO,
            })
          );
          setCollapseFirstModalSection(true);
          setOtpMobileNumber(data.mobile_number);
        } else {
          dispatch(
            openSnackbar({
              message: data.message,
              type: MESSAGE_TYPE.ERROR,
            })
          );
        }
        dispatch(enableLoading(false));
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: Object.values(e.errors).join(),
            type: MESSAGE_TYPE.ERROR,
          })
        );

        dispatch(enableLoading(false));
      });
  };

  const resentOtpWithdrawMoney = async () => {
    await axiosInst
      .post(`organizations/${organization?.orgId}/withdraw_money/resend_otp`, {
        amount: Amount,
        bank_account_id: selectedBank.bank_account_id,
      })
      .then(({ data }) => {
        if (data && !data.error)
          dispatch(
            openSnackbar({
              message: data.message,
              type: MESSAGE_TYPE.INFO,
            })
          );

        dispatch(enableLoading(false));
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: Object.values(e.errors).join(),
            type: MESSAGE_TYPE.ERROR,
          })
        );

        dispatch(enableLoading(false));
      });
  };

  const authenticatePayment = async () => {
    dispatch(enableLoading(true));
    await axiosInst
      .post(
        `organizations/${organization?.orgId}/withdraw_money/validate_otp`,
        {
          amount: Amount,
          otp: otpNumber,
          bank_account_id: selectedBank.bank_account_id,
        }
      )
      .then(({ data }) => {
        if (data && !data.error) {
          dispatch(
            openSnackbar({
              message: data.message,
              type: MESSAGE_TYPE.INFO,
            })
          );
        } else {
          dispatch(
            openSnackbar({
              message: data.message || data.error.errors,
              type: MESSAGE_TYPE.ERROR,
            })
          );
        }
        setPaymentDialog(false);
        dispatch(enableLoading(false));
        onClose();
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: Object.values(e.errors).join(),
            type: MESSAGE_TYPE.ERROR,
          })
        );

        dispatch(enableLoading(false));
      });
  };

  // Ippo Pay Succes & Error Handler //

  const ippopayHandler = (e) => {
    if (e.data.status === 'success') {
      setaction('account');
      setbtnutils({
        ...btnutils,
        title: 'Account confirmation',
        desc: 'Choose the Account',
        btntext: 'Confirm Account',
      });
      setactionHandler(true);
    }
    if (e.data.status === 'failure') {
      console.log('failure', e.data);
    }
    if (e.data.status === 'closed') {
      console.log('closed', e.data);
      onClose();
    }
    setIppopayModal(false);
  };

  // Ippo Pay Succes & Error Handler //

  //   const optimizedFn = useCallback(debounce(FilterBank), []);

  const GetPromoterLists = () => {
    axiosInst
      .get(
        `organizations/${organization.orgId}/entities?type[]=promoter&search=${promoterSearch}`
      )
      .then(({ data }) => {
        setPromoterLists(data.data);
      })
      .catch((e) => console.log(e));
  };

  useMemo(() => {
    if (paymentResponse?.collection_service_provider === 'ippopay') {
      setIppopayModal(true);
      setaction('ippopay');
    } else {
      setIppopayModal(false);
    }
  }, [paymentResponse]);

  useEffect(() => {
    FetchConnectedBank();
    GetPromoterLists();

    if (actionType === 'load_money')
      setbtnutils({
        ...btnutils,
        title: 'Load Money',
        desc: 'Select an amount to add your Effortless Virtual Account',
      });
    else
      setbtnutils({
        ...btnutils,
        title: 'Withdraw Money',
        desc: 'Select an amount to withdraw from your Effortless Virtual Account',
      });
  }, []);

  useEffect(() => {
    FilterBank();
  }, [Search]);

  useEffect(() => {
    const Timer = setTimeout(() => {
      FilterPromoter();
    }, 300);

    return () => clearTimeout(Timer);
  }, [promoterSearch]);

  useEffect(() => {
    if (skip) {
      setAmount(allocatedAmount);
      if (actionType === 'load_money') {
        setaction('account');
        setbtnutils({
          ...btnutils,
          title: 'Choose Account To Load Money',
          desc: 'Load Money to your Effortless Virtual Account',
          btntext: `Load Rs. ${allocatedAmount}`,
        });
      }
    }
  }, [skip]);

  return (
    <>
      {action !== 'ippopay' && (
        <Box className={css.wlcontainer}>
          <Stack className={css.headerwrp}>
            <Typography className={css.headertext}>{btnutils.title}</Typography>
            <IconButton sx={{ padding: 0 }} onClick={onClose}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <Stack>
            <Typography className={css.typedesc}>{btnutils.desc}</Typography>
            {action === 'amount' && (
              <>
                <TextfieldStyle
                  name="amount"
                  label="Amount"
                  type="number"
                  className={css.amtinput}
                  error={error.error}
                  helperText={error.msg}
                  value={Amount}
                  onChange={OnInputChange}
                />
                <Stack className={css.amtbtnwrp}>
                  <Button
                    className={css.amountbtn}
                    onClick={() => {
                      setAmount((prev) => Number(prev) + 2000);
                      setErrors({ ...error, error: false, msg: '' });
                    }}
                  >
                    &#8377;&nbsp;&nbsp;2,000
                  </Button>
                  <Button
                    className={css.amountbtn}
                    onClick={() => {
                      setAmount((prev) => Number(prev) + 5000);
                      setErrors({ ...error, error: false, msg: '' });
                    }}
                  >
                    &#8377;&nbsp;&nbsp;5,000
                  </Button>
                  <Button
                    className={css.amountbtn}
                    onClick={() => {
                      setAmount((prev) => Number(prev) + 10000);
                      setErrors({ ...error, error: false, msg: '' });
                    }}
                  >
                    &#8377;&nbsp;&nbsp;10,000
                  </Button>
                </Stack>
                <Button className={css.submit_btn} onClick={amountSubmit}>
                  Select Bank Account
                </Button>
              </>
            )}
            {action === 'account' && (
              <>
                {bankDetail?.length > 5 && (
                  <Stack className={css.searchwrp}>
                    <img src={Searchicon} alt="search" />
                    <input
                      type="search"
                      ref={inputRef}
                      className={css.searchinput}
                      placeholder="Search a Bank Account"
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                    />
                  </Stack>
                )}
                <Stack>
                  <List
                    dense
                    sx={{
                      width: '100%',
                      bgcolor: 'background.paper',
                      padding: 0,
                    }}
                  >
                    {limitedBank.length > 0 ? (
                      <>
                        {limitedBank.slice(0, 5)?.map((val) => (
                          <ListItem
                            secondaryAction={
                              <Typography
                                className={
                                  val.bank_account_type === 'company'
                                    ? css.bankaccbusiness
                                    : css.bankaccpersonal
                                }
                              >
                                {val.bank_account_type === 'company'
                                  ? 'Business'
                                  : 'Personal'}
                              </Typography>
                            }
                            className={classes.listitemRoot}
                            key={val.bank_account_id}
                            onClick={() => setselectedBank(val)}
                          >
                            <ListItemButton
                              sx={{ padding: '0 0 0 11px' }}
                              className={css.listitembtn}
                            >
                              <FormControlLabel
                                value="bank_account"
                                className={classes.RadioRoot}
                                control={
                                  <BpRadio
                                    name="selectedBank"
                                    checked={
                                      selectedBank.bank_account_id ===
                                      val.bank_account_id
                                    }
                                    onChange={() => setselectedBank(val)}
                                  />
                                }
                              />

                              <img
                                src={`https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/${
                                  val.account_name ===
                                  'Effortless Virtual Account'
                                    ? 'unkown'
                                    : val.bank_code
                                }.svg`}
                                alt="Bank Logo"
                                onError={(e) => {
                                  e.target.src = effLogo;
                                }}
                                width="32px"
                                height="32px"
                                className={css.banklogo}
                                loading="lazy"
                              />
                              <ListItemText
                                primary={
                                  val?.display_name?.length > 20
                                    ? `${val?.display_name?.slice(0, 20)}...`
                                    : val?.display_name || ''
                                }
                                secondary={
                                  val?.bank_account_number
                                    ? `xx ${val?.bank_account_number?.substr(
                                        -4
                                      )}`
                                    : ''
                                }
                                className={classes.AccountText}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </>
                    ) : (
                      <ListItem>
                        <ListItemText primary="No bank found." />
                      </ListItem>
                    )}
                  </List>
                  <Button
                    className={
                      selectedBank === ''
                        ? `${css.submit_btn} ${css.opacitybtn}`
                        : css.submit_btn
                    }
                    sx={selectedBank === '' && { opacity: 0.5 }}
                    onClick={actionHandler ? AccountConfirmation : Proceed}
                    disabled={selectedBank === ''}
                  >
                    {btnutils.btntext}
                  </Button>
                </Stack>
              </>
            )}
            {action === 'promoter' && (
              <>
                {promoterLists?.length > 5 && (
                  <Stack className={css.searchwrp}>
                    <img src={Searchicon} alt="search" />
                    <input
                      type="search"
                      ref={inputRef}
                      className={css.searchinput}
                      placeholder="Search a Promoter"
                      onChange={(e) => {
                        setPromoterSearch(e.target.value);
                      }}
                    />
                  </Stack>
                )}
                <Stack>
                  <List
                    dense
                    sx={{
                      width: '100%',
                      bgcolor: 'background.paper',
                      padding: 0,
                    }}
                  >
                    {limitedPromoterLists.length > 0 ? (
                      <>
                        {limitedPromoterLists.slice(0, 5)?.map((val) => (
                          <ListItem
                            className={classes.listitemRootPromoter}
                            key={val.bank_account_id}
                            onClick={() => setSelectedPromoter(val)}
                          >
                            <ListItemButton
                              sx={{ padding: '4px' }}
                              className={css.listitembtn}
                            >
                              <FormControlLabel
                                value="bank_account"
                                className={classes.RadioRootPromoter}
                                control={
                                  <BpRadio
                                    name="selectedBank"
                                    checked={selectedPromoter.id === val.id}
                                    onChange={() => setSelectedPromoter(val)}
                                  />
                                }
                              />

                              <ListItemAvatar>
                                <Avatar>
                                  {val?.name?.slice(0, 1)?.toUpperCase()}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  val?.name?.length > 20
                                    ? `${val?.name?.slice(0, 20)}...`
                                    : val?.name || ''
                                }
                                className={classes.AccountText}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </>
                    ) : (
                      <ListItem sx={{ marginBottom: '20px' }}>
                        <ListItemText primary="No promoter found." />
                      </ListItem>
                    )}
                  </List>
                  <Button
                    className={css.addpromoter_btn}
                    onClick={() => setDrawer(true)}
                  >
                    <AddRoundedIcon /> Add New Promoter
                  </Button>
                  <Button
                    className={
                      selectedPromoter === ''
                        ? `${css.submit_btn} ${css.opacitybtn}`
                        : css.submit_btn
                    }
                    onClick={Proceed}
                    disabled={selectedPromoter === ''}
                  >
                    {btnutils.btntext}
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </Box>
      )}

      {ippoPayModal && (
        <IppoPay
          orderId={paymentResponse?.order_id}
          publicKey={paymentResponse?.public_key}
          ippopayHandler={ippopayHandler}
        />
      )}

      <SelectBottomSheet
        name="Promoter"
        triggerComponent={<></>}
        open={drawer}
        onClose={() => setDrawer(false)}
        addNewSheet
      >
        <AddVendorManual
          type="promoter"
          addVendorComplete={(st) => {
            if (st === 'success') {
              setDrawer(false);
              GetPromoterLists();
            }
          }}
        />
      </SelectBottomSheet>

      <Dialog
        open={paymentDialog}
        name="verifyPassword"
        onClose={() => setPaymentDialog(false)}
        styleDrawerMaxHeight="85vh"
        className={css_.dialog}
      >
        <div className={css_.paymentModal} style={{ width: '500px' }}>
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

export default memo(WithdrawLoadMoney);
