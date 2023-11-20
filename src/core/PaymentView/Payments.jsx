/* eslint-disable no-else-return */
/* eslint-disable consistent-return */

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  getPayments,
  getVendorPayments,
  quickPayment,
  setQuickPayment,
  // setDataLoad,
  // getVirtualAccount,
} from '@action/Store/Reducers/Payments/PaymentsState';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import AppContext from '@root/AppContext';

import {
  Stack,
  Grid,
  Typography,
  Card,
  Button,
  Avatar,
  Dialog,
} from '@mui/material';

import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';

import paymentsEmpty from '@assets/paymentsEmpty.svg';
import paymentsEmpty2 from '@assets/paymentsEmpty2.svg';
import paymentsEmpty3 from '@assets/paymentsEmpty3.svg';
import Rupee from '@assets/rupee.svg';
import QRCode from '@assets/qr.svg';
import payment1 from '@assets/payment1.svg';
import payment2 from '@assets/payment2.svg';
import payment from '@assets/payment.svg';
import effortless from '@assets/effortless.svg';
import emptyPayments from '@assets/emptyPayments.svg';

import PaymentBankReq from './component/PaymentBankReq';
import * as css from './Payments.scss';
import PaymentsLoading from './PaymentsLoading';

const Payments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const device = localStorage.getItem('device_detect');

  const { userPermissions } = useContext(AppContext);

  const {
    payments,
    vendorPaymentsSummary,
    paymentResponse,
    virtualAccStatus,
    dataLoad,
  } = useSelector((state) => state.Payments);

  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [PaymentType, setPaymentType] = useState(null);

  const [drawer, setDrawer] = useState({
    paymentBank: false,
  });

  const [clickVendorId, setClickVendorId] = useState('');

  const [userRoles, setUserRoles] = useState({});
  const [havePermission, setHavePermission] = useState({ open: false });

  const handleBottomSheetOpen = (open, id) => {
    setDrawer((prev) => ({ ...prev, [open]: true }));
    if (id !== null) {
      setClickVendorId(id);
    }
  };

  const handleBottomSheetClose = (close) => {
    setDrawer((prev) => ({ ...prev, [close]: false }));
  };

  const makeQuickPayments = async (type, vendorId = null) => {
    setPaymentType(type);
    const body = {};
    if (vendorId === null) {
      body.type = type;
    } else {
      body.vendor_id = vendorId;
    }
    dispatch(enableLoading(true));
    dispatch(quickPayment({ ...body }));
  };

  useEffect(() => {
    if (paymentResponse) {
      if (!paymentResponse?.data?.error) {
        if (
          PaymentType === null &&
          paymentResponse.data.bankless_entities === 1
        ) {
          handleBottomSheetOpen(
            'paymentBank',
            paymentResponse?.payload?.vendorId,
          );
          return;
        } else if (paymentResponse?.message) {
          dispatch(
            openSnackbar({
              message:
                paymentResponse?.data?.message ||
                'Something went Wrong, We will look into it',
              type: MESSAGE_TYPE.ERROR,
            }),
          );
          return;
        }
        navigate('/payment-makepayment', {
          state: {
            payment: paymentResponse?.data,
            vendorUnsettled: vendorPaymentsSummary,
            opt: paymentResponse?.payload?.type,
          },
        });
      }
    }
    return () => dispatch(setQuickPayment(null));
  }, [paymentResponse]);

  useEffect(() => {
    const getData = async () => {
      await dispatch(getPayments());
      await dispatch(getVendorPayments());
      // await dispatch(getVirtualAccount());
    };

    getData();
    setPaymentProcessed(false);
    setPaymentFailed(false);
    // return () => dispatch(setDataLoad());
  }, []);

  useEffect(() => {
    if (Object.keys(userPermissions?.Payments || {})?.length > 0) {
      if (!userPermissions?.Payments?.Payment) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRoles({ ...userPermissions?.Payments });
    }
  }, [userPermissions]);

  if (!Object.values(dataLoad)?.every((item) => !!item))
    return device === 'desktop' ? null : <PaymentsLoading />;

  return (
    <>
      {device === 'desktop' ? (
        <Stack className={css.paymentsContainer}>
          {/* <Stack className={css.paymentsStackMain} direction="row"> */}
          <Grid container>
            <Grid lg={8} md={8}>
              {/* left */}
              <Stack className={css.paymentsStackMain} spacing={2}>
                <Typography className={css.heading}>
                  Payments Made Effortless
                </Typography>
                <Stack direction="row" spacing={2} style={{ width: '100%' }}>
                  <Stack spacing={2} style={{ width: '100%' }}>
                    <Stack style={{ width: '100%' }}>
                      <img
                        src={payment1}
                        alt="payment"
                        style={{ width: '100%' }}
                      />
                      <Stack className={css.payment1Text}>
                        <Typography className={css.payment1Text1}>
                          {virtualAccStatus
                            ? 'Effortless Pay'
                            : 'Add Effortless Account'}
                        </Typography>
                        {virtualAccStatus ? (
                          <Typography className={css.payment1Text2}>
                            Make a payment using <br /> effortless pay
                          </Typography>
                        ) : (
                          <Typography className={css.payment1Text2}>
                            Make payment with <br />
                            effortless account
                          </Typography>
                        )}
                      </Stack>
                      {virtualAccStatus ? (
                        <Grid className={css.avatarStackRemove}> </Grid>
                      ) : (
                        // <Avatar className={css.avatarStack}>
                        //   <ArrowForwardIcon />
                        // </Avatar>
                        <Avatar
                          className={css.avatarStackNoAcc}
                          onClick={() => {
                            navigate('/banking-virtualAccountOnBoarding');
                          }}
                        >
                          <img src={emptyPayments} alt="plus" width=" 40px" />
                        </Avatar>
                      )}
                    </Stack>

                    <Stack
                      direction="row"
                      className={
                        virtualAccStatus
                          ? css.paynowStack
                          : css.paynowStackNoAcc
                      }
                      style={{ width: '100%', cursor: 'pointer' }}
                      onClick={() => {
                        if (!userRoles?.Payment?.create_payment) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        navigate('/payment-advancepayments');
                      }}
                    >
                      <Avatar
                        className={
                          virtualAccStatus
                            ? css.avatarpaynow
                            : css.avatarpaynowNoAcc
                        }
                      >
                        <img src={payment} alt="payment" />
                      </Avatar>
                      <Typography className={css.avatarpaynowText}>
                        Pay an Advance
                      </Typography>
                      {virtualAccStatus && (
                        <Button
                          className={css.avatarpaynowBtn}
                          onClick={() => {
                            if (!userRoles?.Payment?.create_payment) {
                              setHavePermission({
                                open: true,
                                back: () => {
                                  setHavePermission({ open: false });
                                },
                              });
                              return;
                            }
                            navigate('/payment-advancepayments');
                          }}
                        >
                          <Typography className={css.avatarpaynowBtnText}>
                            Pay now
                          </Typography>
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                  {/* right */}
                  <Stack className={css.paymentStack} style={{ width: '100%' }}>
                    <img
                      src={
                        vendorPaymentsSummary.length > 0
                          ? payment2
                          : paymentsEmpty
                      }
                      alt="payment"
                      style={{ width: '180px', height: '140px' }}
                    />
                    {vendorPaymentsSummary.length > 0 && (
                      <Typography className={css.paymentStackText1}>
                        Make a Payment
                      </Typography>
                    )}
                    <Typography className={css.paymentStackText2}>
                      {vendorPaymentsSummary.length > 0
                        ? 'Click to pay instantly'
                        : 'Instant payment will be enabled on adding your account'}
                    </Typography>
                    {vendorPaymentsSummary.length > 0 && (
                      <Button
                        className={css.paymentStackBtn}
                        onClick={() => {
                          if (!userRoles?.Payment?.create_payment) {
                            setHavePermission({
                              open: true,
                              back: () => {
                                setHavePermission({ open: false });
                              },
                            });
                            return;
                          }
                          navigate('/payment-makepayment');
                        }}
                      >
                        <Typography className={css.paymentStackBtnText}>
                          Pay now
                        </Typography>
                      </Button>
                    )}
                  </Stack>
                </Stack>
                <Stack spacing={2} style={{ paddingTop: '4rem' }}>
                  <Typography className={css.heading}>
                    Pay your bills
                  </Typography>
                  <Stack spacing={2} style={{ width: '100%' }}>
                    <Stack direction="row" spacing={2}>
                      {vendorPaymentsSummary.length > 0 ? (
                        <Card className={css.card1} style={{ width: '100%' }}>
                          {payments?.over_due &&
                            payments.over_due.amount > 0 && (
                              <Stack direction="row" alignItems="center">
                                <Stack className={css.card1Stack}>
                                  <Typography className={css.card1text1}>
                                    Overdue Bills
                                  </Typography>
                                  <Typography className={css.card1text2}>
                                    {FormattedAmount(
                                      payments?.over_due?.amount,
                                    )}
                                  </Typography>
                                  <Typography className={css.card1text3}>
                                    {payments.over_due.bill_count} Bills to{' '}
                                    {payments.over_due.vendor_count} Parties are
                                    Overdue by Today.
                                  </Typography>
                                </Stack>
                                <Button
                                  className={css.payBtn}
                                  onClick={() => {
                                    if (!userRoles?.Payment?.create_payment) {
                                      setHavePermission({
                                        open: true,
                                        back: () => {
                                          setHavePermission({ open: false });
                                        },
                                      });
                                      return;
                                    }
                                    makeQuickPayments('overdue');
                                  }}
                                >
                                  <Typography className={css.payBtnText}>
                                    pay now
                                  </Typography>
                                </Button>
                              </Stack>
                            )}
                        </Card>
                      ) : (
                        <Stack
                          className={css.paymentStackNoAcc}
                          style={{ width: '100%' }}
                        >
                          <img
                            src={paymentsEmpty3}
                            alt="payment"
                            style={{ width: '180px', height: '140px' }}
                          />

                          <Typography className={css.paymentStackText2}>
                            There are nothing to display.
                          </Typography>
                        </Stack>
                      )}
                      {vendorPaymentsSummary.length > 0 && (
                        <Card className={css.card2} style={{ width: '100%' }}>
                          {payments?.payables &&
                          payments.payables.amount > 0 ? (
                            <Stack direction="row" alignItems="center">
                              <Stack className={css.card2Stack}>
                                <Typography className={css.card2text1}>
                                  Due This Week
                                </Typography>
                                <Typography className={css.card2text2}>
                                  {FormattedAmount(payments?.payables?.amount)}
                                </Typography>
                                <Typography className={css.card2text3}>
                                  {payments.payables.vendor_count} Bills to{' '}
                                  {payments.payables.bill_count} Parties due
                                  this Week
                                </Typography>
                              </Stack>
                              <Button
                                className={css.payBtn}
                                onClick={() => {
                                  if (!userRoles?.Payment?.create_payment) {
                                    setHavePermission({
                                      open: true,
                                      back: () => {
                                        setHavePermission({ open: false });
                                      },
                                    });
                                    return;
                                  }
                                  makeQuickPayments('payables');
                                }}
                              >
                                <Typography className={css.payBtnText}>
                                  pay now
                                </Typography>
                              </Button>
                            </Stack>
                          ) : (
                            <Stack
                              style={{
                                width: '100%',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography> No Dues</Typography>
                            </Stack>
                          )}
                        </Card>
                      )}
                    </Stack>
                    {/* {vendorPaymentsSummary.length !== [] && (
                      <Stack direction="row" className={css.billPayStack}>
                        <Stack>
                          <Typography className={css.billPayStackText1}>
                            bill pays
                          </Typography>
                          <Typography className={css.billPayStackText2}>
                            You have successfully paid. 50 Bills this Month.
                          </Typography>
                        </Stack>
                        <Button className={css.billPayStackBtn}>
                          <Typography className={css.billPayStackBtnText}>
                            view
                          </Typography>
                        </Button>
                      </Stack>
                    )} */}
                  </Stack>
                </Stack>
              </Stack>
            </Grid>

            {/* right */}
            <Grid lg={4} md={4}>
              <Stack className={css.paymentsStackMain} spacing={2}>
                <Typography className={css.heading}>
                  Settle Vendor Bills
                </Typography>
                {vendorPaymentsSummary.length > 0 ? (
                  <>
                    <Stack className={css.vendorContainerDesktopMain}>
                      <Stack className={css.vendorContainerDesktop}>
                        {vendorPaymentsSummary &&
                          vendorPaymentsSummary.length > 0 &&
                          vendorPaymentsSummary
                            .filter((a) => Number(a.total_net_balance) > 0)
                            .map((item) => {
                              return (
                                <div
                                  className={css.vendorCard}
                                  key={item.vendor_id}
                                  style={{
                                    minWidth:
                                      device === 'desktop' ? '0px' : '72vw',
                                  }}
                                >
                                  <div className={css.vendorCardBody}>
                                    <p>
                                      {item.name} - {item.total_count}{' '}
                                      Outstanding Bills
                                    </p>
                                    <span>
                                      {FormattedAmount(item?.total_net_balance)}
                                    </span>
                                  </div>
                                  <div className={css.vendorCardAction}>
                                    <Button
                                      onClick={() => {
                                        if (
                                          !userRoles?.Payment?.create_payment
                                        ) {
                                          setHavePermission({
                                            open: true,
                                            back: () => {
                                              setHavePermission({
                                                open: false,
                                              });
                                            },
                                          });
                                          return;
                                        }
                                        makeQuickPayments(null, item.id);
                                      }}
                                      size="medium"
                                      className={css.outlineSubmit}
                                    >
                                      Pay Now
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                      </Stack>
                    </Stack>
                  </>
                ) : (
                  <Stack className={css.paymentStack} style={{ width: '100%' }}>
                    <img
                      className={css.paddingTop}
                      src={paymentsEmpty2}
                      alt="payment"
                      style={{ width: '180px', height: '140px' }}
                    />

                    <Typography className={css.paymentStackTextNoacc}>
                      View vendor Bills on adding <br /> your account
                    </Typography>
                  </Stack>
                )}
                <Stack className={css.activityStack} style={{ width: '100%' }}>
                  <Stack
                    className={
                      // vendorPaymentsSummary.length > 0
                      css.activityStack1
                      // : css.activityStack2
                    }
                  >
                    <Typography>Other Activites</Typography>
                    <Stack
                      direction="row"
                      onClick={() => {
                        // if (vendorPaymentsSummary.length > 0) {
                        navigate('/banking');
                        // }
                      }}
                      style={{ alignItems: 'center', marginTop: '1rem' }}
                      spacing={2}
                    >
                      <Avatar className={css.activityAvatar}>
                        <img src={effortless} alt="payments" />
                      </Avatar>
                      <Typography className={css.activityText}>
                        Connected Banking
                      </Typography>
                    </Stack>
                    {vendorPaymentsSummary.length > 0 && (
                      <Stack
                        direction="row"
                        style={{ alignItems: 'center', marginTop: '1rem' }}
                        spacing={2}
                      >
                        <Avatar className={css.activityAvatar}>
                          <img src={QRCode} alt="Rupee" />
                        </Avatar>
                        <Typography
                          className={css.activityText}
                          onClick={() => navigate('/bill-utility')}
                        >
                          Pay Your Bills
                        </Typography>
                      </Stack>
                    )}
                    <Stack
                      direction="row"
                      style={{ alignItems: 'center', marginTop: '1rem' }}
                      spacing={2}
                      onClick={() => {
                        // if (vendorPaymentsSummary.length > 0) {
                        if (
                          !userRoles['Payments History']?.view_payment_history
                        ) {
                          setHavePermission({
                            open: true,
                            back: () => {
                              setHavePermission({ open: false });
                            },
                          });
                          return;
                        }
                        navigate('/payment-history');
                        // }
                      }}
                    >
                      <Avatar className={css.activityAvatar}>
                        <img src={Rupee} alt="payments" />
                      </Avatar>
                      <Typography className={css.activityText}>
                        Payment History
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          {/* end */}
          {/* </Stack> */}
        </Stack>
      ) : (
        <>
          <div className={css.dashboardBodyContainer}>
            <div className={css.advancePaymentContainer}>
              <div>
                {paymentProcessed && (
                  <div className={`${css.paymentProcessed} ${css.paymentInfo}`}>
                    <div className={css.cardBody}>
                      <p className={css.cardTitle}>Payment is Underway</p>
                      <p className={css.cardSubTitle}>
                        Payment to 3 Parties is being processed
                      </p>
                    </div>
                    <div className={css.cardAction}>
                      <Button
                        onClick={() => {
                          navigate('/payment-history');
                        }}
                        size="large"
                        className={css.submitButton}
                      >
                        Track
                      </Button>
                    </div>
                  </div>
                )}
                {paymentFailed && (
                  <div className={`${css.paymentFailed} ${css.paymentInfo}`}>
                    <div className={css.cardBody}>
                      <p className={css.cardTitle}>Attention Required</p>
                      <p className={css.cardSubTitle}>
                        Payment to 3 Parties has failed
                      </p>
                    </div>
                    <div className={css.cardAction}>
                      <Button size="large" className={css.submitButton}>
                        Retry
                      </Button>
                    </div>
                  </div>
                )}
                <div className={css.overdueContainer}>
                  {payments?.over_due && payments.over_due.amount > 0 && (
                    <div className={css.overdueCard}>
                      <div className={css.overdueCardMain}>
                        <div className={css.overdueBody}>
                          <p className={css.overdueTitle}>Overdue Bills</p>
                          <p className={css.overdueContent}>
                            {FormattedAmount(payments?.over_due?.amount)}
                            <br />
                            <span>
                              {payments.over_due.bill_count} Bills to{' '}
                              {payments.over_due.vendor_count} Parties are
                              Overdue Today.
                            </span>
                          </p>
                        </div>
                        <div className={css.overdueAction}>
                          <Button
                            onClick={() => {
                              if (!userRoles?.Payment?.create_payment) {
                                setHavePermission({
                                  open: true,
                                  back: () => {
                                    setHavePermission({ open: false });
                                  },
                                });
                                return;
                              }
                              makeQuickPayments('overdue');
                            }}
                            size="large"
                            className={css.submitButton}
                          >
                            <Typography className={css.submitButtonTxt}>
                              Pay Now
                            </Typography>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {payments?.payables && payments.payables.amount > 0 && (
                    <div className={css.overdueCard}>
                      <div className={css.overdueCardMain}>
                        <div className={css.overdueBody}>
                          <p className={css.overdueTitle}>Due This Week</p>
                          <p className={css.overdueContent}>
                            {FormattedAmount(payments?.payables?.amount)}
                            <br />
                            <span>
                              {payments.payables.vendor_count} Bills to{' '}
                              {payments.payables.bill_count} Parties due this
                              Week
                            </span>
                          </p>
                        </div>
                        <div className={css.overdueAction}>
                          <Button
                            onClick={() => {
                              if (!userRoles?.Payment?.create_payment) {
                                setHavePermission({
                                  open: true,
                                  back: () => {
                                    setHavePermission({ open: false });
                                  },
                                });
                                return;
                              }
                              makeQuickPayments('payables');
                            }}
                            size="large"
                            className={css.submitButton}
                          >
                            <Typography className={css.submitButtonTxt}>
                              Pay Now
                            </Typography>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={css.mainContainer}>
                  <p className={css.title}>Payments Made Effortless</p>
                  <div className={css.contentBody}>
                    <Grid container spacing={2} direction="row">
                      <Grid
                        item
                        xs={4}
                        className={css.item}
                        onClick={() => {
                          if (!userRoles?.Payment?.create_payment) {
                            setHavePermission({
                              open: true,
                              back: () => {
                                setHavePermission({ open: false });
                              },
                            });
                            return;
                          }
                          navigate('/payment-makePayment');
                        }}
                      >
                        <div className={css.icon}>
                          <img src={Rupee} alt="Rupee" />
                        </div>
                        <p>Make a Payment</p>
                      </Grid>
                      <Grid item xs={4} className={css.item}>
                        <div className={css.icon}>
                          <img src={QRCode} alt="Rupee" />
                        </div>
                        <p>Effortless Pay</p>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        className={css.item}
                        onClick={() => {
                          if (!userRoles?.Payment?.create_payment) {
                            setHavePermission({
                              open: true,
                              back: () => {
                                setHavePermission({ open: false });
                              },
                            });
                            return;
                          }
                          navigate('/payment-advancePayments');
                        }}
                      >
                        <div className={css.icon}>
                          <img src={Rupee} alt="Rupee" />
                        </div>
                        <p>Pay an Advance</p>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                {vendorPaymentsSummary && vendorPaymentsSummary.length > 0 && (
                  <p className={css.sectionTitle}>Settle Vendor Bills</p>
                )}
                <div className={css.vendorContainer}>
                  {vendorPaymentsSummary &&
                    vendorPaymentsSummary.length > 0 &&
                    vendorPaymentsSummary
                      .filter((a) => Number(a.total_net_balance) > 0)
                      .map((item) => {
                        return (
                          <div className={css.vendorCard} key={item.vendor_id}>
                            <div className={css.vendorCardBody}>
                              <p>
                                {item.name} - {item.total_count} Outstanding
                                Bills
                              </p>
                              <span>
                                {FormattedAmount(item?.total_net_balance)}
                              </span>
                            </div>
                            <div className={css.vendorCardAction}>
                              <Button
                                onClick={() => {
                                  if (!userRoles?.Payment?.create_payment) {
                                    setHavePermission({
                                      open: true,
                                      back: () => {
                                        setHavePermission({ open: false });
                                      },
                                    });
                                    return;
                                  }
                                  makeQuickPayments(null, item.id);
                                }}
                                size="medium"
                                className={css.outlineSubmit}
                              >
                                Pay Now
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                </div>
                <p className={css.sectionTitle}>Other Activities</p>
                <div className={css.otherActivities}>
                  <div
                    className={css.otherActivity}
                    onClick={
                      () => navigate('/banking')
                      //   {
                      //   if (virtualAccStatus === false) {
                      //     navigate('/banking-M2PForms');
                      //   } else {
                      //     navigate('/banking-banklist');
                      //   }
                      // }
                    }
                  >
                    <p>Connected Banking</p>
                  </div>
                  <div
                    className={css.otherActivity}
                    onClick={() => navigate('/bill-utility')}
                  >
                    <p>
                      Pay Your <br /> Bills
                    </p>
                  </div>
                  <div
                    className={css.otherActivity}
                    onClick={() => {
                      if (
                        !userRoles['Payments History']?.view_payment_history
                      ) {
                        setHavePermission({
                          open: true,
                          back: () => {
                            setHavePermission({ open: false });
                          },
                        });
                        return;
                      }
                      navigate('/payment-history');
                    }}
                  >
                    <p>Payment History</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Dialog
        open={drawer.paymentBank && device === 'desktop'}
        onClose={() => handleBottomSheetClose('paymentBank')}
      >
        <PaymentBankReq
          vendorId={clickVendorId}
          handleBottomSheet={() => handleBottomSheetClose('paymentBank')}
        />
      </Dialog>
      <SelectBottomSheet
        open={drawer.paymentBank && device === 'mobile'}
        onClose={() => handleBottomSheetClose('paymentBank')}
        addNewSheet
        id="overFlowHidden"
        triggerComponent={<></>}
        onTrigger={handleBottomSheetOpen}
      >
        <PaymentBankReq
          vendorId={clickVendorId}
          handleBottomSheet={() => handleBottomSheetClose('paymentBank')}
        />
      </SelectBottomSheet>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};
export default Payments;
