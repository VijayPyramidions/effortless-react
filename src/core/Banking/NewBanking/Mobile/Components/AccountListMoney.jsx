/* eslint-disable  no-nested-ternary */

import React, { useState, useEffect, useContext, memo } from 'react';
import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import {
  Stack,
  Typography,
  List,
  ListItem,
  ListItemButton,
  FormControlLabel,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Radio,
  Button,
} from '@mui/material';

import { styled } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import axiosInst from '@action/ApiConfig/AxiosInst';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import AddVendorManual from '@components/CreateNew/VendorNew/AddVendorManual';

import AppContext from '@root/AppContext';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import Searchicon from '../../../../../assets/search_1.svg';

import * as css from '../bankingmobile.scss';
import * as css_ from '../../bankingnew.scss';

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
    marginBottom: '20px',

    '& :lastchild': {
      marginBottom: 0,
    },

    '& .MuiListItemSecondaryAction-root': {
      right: 0,
    },
  },
  listitemRootPromoter: {
    padding: '0 0 12px 0 !important',
    marginBottom: '8px',
    borderBottom: '.5px solid rgba(0, 0, 0, 0.10)',

    '& :lastchild': {
      marginBottom: 0,
      borderBottom: 'none',
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

const AccountListMoney = ({
  onClose,
  LoadAmount,
  setPaymentResponse,
  actionTyope,
  ippoPaySuccess,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { organization } = useContext(AppContext);

  const [btnutils, setBtnutils] = useState({
    title: 'Choose Account To Load Money',
    desc: `${
      actionTyope === 'load_money' ? 'Load' : 'Withdraw'
    } Money to your Effortless Virtual Account`,
  });

  const [drawer, setDrawer] = useState(false);

  const [Search, setSearch] = useState('');
  const [bankDetail, setBankDetail] = useState([]);
  const [limitedBank, setlimitedBank] = useState([]);
  const [selectedBank, setselectedBank] = useState('');
  const [loading, setLoading] = useState(true);

  const [action, setAction] = useState('account');
  const [actionHandler, setactionHandler] = useState(false);

  const [promoterSearch, setPromoterSearch] = useState('');
  const [promoterLists, setPromoterLists] = useState([]);
  const [limitedPromoterLists, setLimitedPromoterLists] = useState([]);
  const [selectedPromoter, setSelectedPromoter] = useState('');

  const FetchConnectedBank = async () => {
    dispatch(enableLoading(true));
    await axiosInst
      .get(
        `organizations/${organization?.orgId}/yodlee_bank_accounts/bank_listing?payment_gateway=true`
      )
      .then(({ data }) => {
        if (data && !data.error) {
          setBankDetail(data?.data);
          setlimitedBank(data?.data);
          setLoading(false);
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
        setLoading(false);
        dispatch(enableLoading(false));
      });
  };

  const FilterBank = () => {
    const filteredBanks = bankDetail.filter((item) =>
      item?.display_name?.toLowerCase().includes(Search?.toLowerCase())
    );
    setlimitedBank(filteredBanks);
  };

  const GetPromoterLists = (val) => {
    axiosInst
      .get(
        `organizations/${organization.orgId}/entities?type[]=promoter&search=${promoterSearch}`
      )
      .then(({ data }) => {
        if (val === 'maindata') setPromoterLists(data.data);
        setLimitedPromoterLists(data.data);
      })
      .catch((e) => console.log(e));
  };

  const AccountConfirmation = () => {
    onClose();
    navigate('/banking');
    dispatch(
      openSnackbar({
        message: 'Account Confirmation Successfull',
        type: MESSAGE_TYPE.INFO,
      })
    );
  };

  const CapturePayment = async (type, dataRes) => {
    dispatch(enableLoading(true));

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
        navigate('/banking');
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
      setAction('promoter');
      setBtnutils((prev) => ({
        ...prev,
        title: 'Select Promoter',
        desc: 'Select Promoter who is brining in money into Effortless Virtual Account',
      }));
      return;
    }

    let payload;

    if (selectedBank.bank_account_type === 'founder')
      payload = {
        amount: LoadAmount,
        bank_account_id: selectedBank.bank_account_id,
        entity_id: selectedPromoter.id,
      };
    else
      payload = {
        amount: LoadAmount,
        bank_account_id: selectedBank.bank_account_id,
      };

    if (actionTyope === 'load_money')
      await axiosInst
        .post(
          `organizations/${organization?.orgId}/effortless_virtual_accounts/create_payment`,
          {
            ...payload,
          }
        )
        .then(({ data }) => {
          if (data && !data?.error) {
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

                setTimeout(() => {
                  CapturePayment('error', { ...res, orderId: data.order_id });
                  setDrawer(false);
                  navigate('/banking');
                }, 6000);
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
          } else if (data?.error) {
            dispatch(
              openSnackbar({
                message:
                  data?.error || data.message || 'Sorry, Something went wrong',
                type: MESSAGE_TYPE.ERROR,
              })
            );
          }
        })
        .catch((e) => {
          console.log('Error:', e);
          dispatch(enableLoading(false));
        });
    else setPaymentResponse(selectedBank.bank_account_id);
  };

  useEffect(() => {
    FilterBank();
  }, [Search]);
  useEffect(() => {
    GetPromoterLists();
  }, [promoterSearch]);

  useEffect(() => {
    if (ippoPaySuccess === 'paymentSuccess') {
      setactionHandler(true);
      setBtnutils({
        ...btnutils,
        title: 'Account Confirmation',
        desc: 'Did you utilise the following bank account to load money into your Effortless Virtual Account?',
      });
    }
  }, [ippoPaySuccess]);

  useEffect(() => {
    FetchConnectedBank();
    GetPromoterLists('maindata');
  }, []);

  return (
    <>
      <Stack className={css.bottommodalcontainer}>
        <Stack
          className={css.emptyBar}
          sx={{ marginBottom: '20px !important' }}
        />
        <Typography variant="h4" className={css.headertext}>
          {btnutils.title}
        </Typography>
        <Typography className={css.desc} sx={{ maxWidth: 'unset !important' }}>
          {btnutils.desc}
        </Typography>
        {action === 'account' && (
          <>
            {bankDetail?.length > 3 && (
              <Stack className={css.searchwrp}>
                <img src={Searchicon} alt="search" width={16} height={16} />
                <input
                  type="search"
                  value={Search}
                  className={css.searchinput}
                  placeholder="Search a Bank Account"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Stack>
            )}
            <List
              dense
              sx={{
                width: '100%',
                bgcolor: 'background.paper',
                padding: 0,
                marginBottom: '14px',
              }}
            >
              {limitedBank.length > 0 ? (
                <>
                  {limitedBank.slice(0, 3)?.map((val) => (
                    <ListItem
                      key={val.bank_account_id}
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
                      sx={{
                        padding: 0,
                      }}
                      className={classes.listitemRoot}
                      onClick={() => setselectedBank(val)}
                    >
                      <ListItemButton
                        sx={{ padding: '0 0 0 11px', borderRadius: '4px' }}
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

                        {/* <ListItemAvatar
                      sx={{ minWidth: 'initial', marginRight: '6px' }}
                    >
                      <Avatar
                        alt="Avatar"
                        src={icici}
                        sx={{ width: '32px', height: '32px' }}
                      />
                    </ListItemAvatar> */}
                        {/* <span
                      // src={
                      //   row.account_name === 'Effortless Virtual Account'
                      //     ? eflogo
                      //     : IciciLogo
                      // }
                      // alt="Bank Logo"
                      // width="32px"
                      // height="32px"
                      aria-label={val.bank_code}
                      className={css_.banklogo}
                    /> */}

                        <img
                          src={`https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/${
                            val.name === 'Effortless Virtual Account old' ||
                            val.name === 'Effortless Virtual Account'
                              ? 'effortless'
                              : val.bank_code
                          }.svg`}
                          alt="Bank Logo"
                          onError={(e) => {
                            e.target.src =
                              'https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/unknown.svg';
                          }}
                          className={css_.banklogo}
                          width="32px"
                          height="32px"
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
                              ? `xx ${val?.bank_account_number?.substr(-4)}`
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
                  <ListItemText
                    primary={!loading ? 'No bank found.' : 'Loading...'}
                  />
                </ListItem>
              )}
              {/* <ListItem disablePadding>
          <ListItemButton sx={{ padding: '6px 0', borderRadius: '4px' }}>
            <ListItemAvatar sx={{ minWidth: 'initial', marginRight: '6px' }}>
              <Avatar
                alt="Avatar"
                src={addbank}
                sx={{ width: '32px', height: '32px' }}
              />
            </ListItemAvatar>
            <ListItemText
              primary="Add Bank Account"
              className={css.addaccitem}
            />
          </ListItemButton>
        </ListItem> */}
            </List>
          </>
        )}

        {action === 'promoter' && (
          <>
            {promoterLists?.length > 5 && (
              <Stack className={css.searchwrp}>
                <img src={Searchicon} alt="search" />
                <input
                  type="search"
                  // ref={inputRef}
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
                    {limitedPromoterLists.slice(0, 3)?.map((val) => (
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
                <AddRoundedIcon
                  sx={{ width: '18px', height: '18px', marginRight: '4px' }}
                />
                Add New Promoter
              </Button>
              {/* <Button
                className={
                  selectedPromoter === ''
                    ? `${css.submit_btn} ${css.opacitybtn}`
                    : css.submit_btn
                }
                onClick={Proceed}
                disabled={selectedPromoter === ''}
              >
                {btnutils.btntext}
              </Button> */}
            </Stack>
          </>
        )}
        {!actionHandler ? (
          <Button
            className={
              selectedBank === ''
                ? `${css.submit_btn} ${css.opacitybtn}`
                : css.submit_btn
            }
            onClick={Proceed}
            disabled={selectedBank === ''}
          >
            {`${
              actionTyope === 'load_money' ? 'Pay' : 'Withdraw'
            } Rs. ${LoadAmount}`}
          </Button>
        ) : (
          <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button className={css.confno}>No</Button>
            <Button className={css.confyes} onClick={AccountConfirmation}>
              Yes
            </Button>
          </Stack>
        )}
      </Stack>

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
    </>
  );
};

export default memo(AccountListMoney);
