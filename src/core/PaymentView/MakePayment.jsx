/* eslint-disable no-unused-expressions */
/* eslint-disable no-lone-blocks */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */

import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  unSettledVendorBills,
  setVendorBills,
  setVendorBillLoading,
  setSearchVendorBills,
  setUnsettledVendorBillsLoading,
  setSelectedBillIds,
  paymentBankAccounts,
  setVendorDrawer,
  setProceedToPayDrawer,
  PaymentVoucher,
  setPaymentVoucher,
  setPaymentBankDrawer,
  getVoucherItems,
  createVoucherItem,
  updateVoucherItem,
  deleteVoucherItem,
  bulkDeleteVouchers,
  refreshVoucherItem,
} from '@action/Store/Reducers/Payments/MakePaymentState';
import { enableLoading } from '@action/Store/Reducers/Errors/Errors';

import { Dialog, Typography, Skeleton, Stack } from '@mui/material';

import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';

import {
  Tab,
  Tabs,
  InputBase,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AppContext from '@root/AppContext';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
// import Loading from '@components/Loading/Loading';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import SuccessView from '@core/BillBookView/shared/SuccessView';
import BillItem from '@core/PaymentView/shared/Bill';
import PageTitle from '@core/DashboardView/PageTitle';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';
import UploadBankDetails from '@components/UploadBankDetails';

import alertIcon from '@assets/alert-octagon.svg';
import * as cssDash from '@core/DashboardView/DashboardViewContainer.scss';

import { CheckSvg, CheckedSvg } from './shared/Icons';

import PayNow from './shared/PayNow';
import ProceedToPay from './shared/ProceedToPay';
import VendorBill from './shared/VendorBill';
import { FinalPayment } from './FinalPayment';
import PaymentBankReq from './component/PaymentBankReq';
import TransactionForgetPassword from './TransactionVerify/ForgetPassword';

import * as css from './MakePayment.scss';
// import MakePaymentLoading from './MakePaymentLoading';

const useStyles = makeStyles(() => ({
  indicator: {
    backgroundColor: '#F08B32',
  },
  styledCardTextfield: {
    backgroundColor: 'white !important',
    height: '49px !important',
    width: '90vw !important',
    padding: '0 0 0 25px',
    borderRadius: '16px !important',
  },
  styledCardTextfieldDesktop: {
    width: '100% !important',
    height: '40px !important',
    borderRadius: '8px !important',
    backgroundColor: 'rgba(237, 237, 237, 0.15)',
    border: '1px solid rgba(153, 158, 165, 0.39)',
    padding: '5px',
  },
}));

const Accordion = withStyles({
  root: {
    border: 'none',
    boxShadow: 'none',
    marginBottom: '10px',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      // margin: '10px 0',
    },
  },
  expanded: {
    // margin: '0 !important',
  },
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: '#FFEFE0',
    borderBottom: 'none',
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles(() => ({
  root: {
    padding: '8px 0px 0 0px',
    backgroundColor: 'white',
  },
}))(MuiAccordionDetails);

const PaymentDialog = withStyles({
  root: {
    '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    '& .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop': {
      background: '#000000',
      opacity: '0.2 !important',
    },
  },
})(Dialog);

const MakePayment = () => {
  const device = localStorage.getItem('device_detect');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const classes = useStyles();

  const { pageParams, userPermissions } = useContext(AppContext);

  const {
    // dataLoad,
    vendorBills,
    selectedbillids,
    vendorBillLoading,
    unsettledVendorBills,
    searchUnsettledVendorBills,
    UnsettledVendorBillsLoading,
    bankAccounts,
    paymentVoucharId,
    vendorDrawer,
    proceedToPayDrawer,
    paymentBankDrawer,
    refreshVoucherResponse,
    retryPaymentVoucharId,
  } = useSelector((statedata) => statedata.MakePayment);

  const [tabValue, setTabValue] = useState(0);

  const [vendor, setVendor] = useState();

  const [searchTerm, setSearchTerm] = useState();
  const [transaction, setTransaction] = useState('');

  const [multiplePayments, setMultiplePayments] = useState(false);
  const [paymentsResponse, setPaymentsResponse] = useState();

  const [payNow, setPayNow] = useState({
    active: false,
    title: 'Grand Total',
    subTitle: 'No Parties and Bills Selected for Payment',
  });

  const [drawer, setDrawer] = useState({
    verifyPassword: false,
    paymentSuccess: false,
    BankupOpen: false,
  });

  const [ShowTransPass, setShowTransPass] = useState(false);
  const InitialState = {
    bankless_entity: 0,
  };
  const [BankuploadState, setBankuploadState] = useState(InitialState);

  const [userRoles, setUserRoles] = useState({});
  const [havePermission, setHavePermission] = useState({ open: false });

  const tabchange = (event, value) => {
    setTabValue(value);
    dispatch(setVendorDrawer(false));
    dispatch(setProceedToPayDrawer(false));
    dispatch(setPaymentBankDrawer({ value: false }));
    setDrawer({
      verifyPassword: false,
      paymentSuccess: false,
      BankupOpen: false,
    });
  };

  const HandleBankUpload = () => {
    setDrawer({ ...drawer, BankupOpen: false });
  };

  const handleBottomSheetOpen = (open) => {
    dispatch(setVendorDrawer(false));
    setDrawer((prev) => ({ ...prev, [open]: true }));
  };

  const onTriggerDrawer = async (vendorId) => {
    setVendor(vendorId);
    dispatch(enableLoading(true));
    dispatch(unSettledVendorBills({ vendorId }));
  };

  const handlePay = () => {
    if (payNow.active) {
      dispatch(paymentBankAccounts(paymentVoucharId));
    }
  };

  const CreateVoucher = async () => {
    // dispatch(enableLoading(true));
    await dispatch(
      PaymentVoucher({
        transaction_type: transaction,
      }),
    );
  };

  const onInputChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    dispatch(setUnsettledVendorBillsLoading(true));

    const searchResult =
      unsettledVendorBills &&
      unsettledVendorBills.filter(
        (item) =>
          item && item?.name?.toLowerCase().indexOf(value?.toLowerCase()) > -1,
      );
    setTimeout(
      () =>
        dispatch(
          setSearchVendorBills({ action: 'search', data: searchResult }),
        ),
      1000,
    );
  };

  const updateVoucherItems = async (id, amount) => {
    // dispatch(enableLoading(true));
    dispatch(
      updateVoucherItem({ VoucherId: paymentVoucharId, id, body: { amount } }),
    );
  };

  const createVoucherItems = async (data) => {
    const body = {
      vendor_id: state?.payables?.id || vendor,
      amount: data.amount,
      document_reference: '',
      description: data.narration,
      txn_line_id: data.txn_line_id,
    };
    dispatch(enableLoading(true));
    dispatch(createVoucherItem({ VoucherId: paymentVoucharId, body }));
  };

  const handleSelect = async (checked, id) => {
    const bill = vendorBills.find((a) => a.id === id);

    const body = {
      amount: state?.payables?.amount || 0,
      document_reference: '',
      description: state?.payables?.narration || bill?.narration || '',
      txn_line_id: state?.payables?.txn_line_id || bill?.id,
    };

    if (checked === true) {
      await createVoucherItems(body);
      dispatch(setSelectedBillIds([state?.payables?.txn_line_id]));
    } else {
      await dispatch(
        deleteVoucherItem({ VoucherId: paymentVoucharId, id: bill.voucher_id }),
      );

      const newItems = vendorBills.map((item) => {
        if (item.id === id) {
          return { ...item, selected: checked, voucherId: null, paidAmount: 0 };
        }
        return item;
      });

      const temp = selectedbillids?.filter((item) => item !== bill.txn_line_id);

      dispatch(setSelectedBillIds(temp));
      dispatch(setVendorBills(newItems));
    }
  };

  const groupByKey = (data, key) => {
    return data.reduce((acc, item) => {
      (acc[item[key]] = acc[item[key]] || []).push(item);
      return acc;
    }, {});
  };

  const fintotal = (input) => {
    let total = 0;
    input.map((item) => {
      total += Number(item.paidAmount);
      return total;
    });
    return Number.isNaN(total) ? 0 : total;
  };

  const handleAmountChange = (amount, id) => {
    const newItems = vendorBills.map((item) => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          paidAmount: amount,
        };
        return updatedItem;
      }

      return { ...item };
    });

    dispatch(setVendorBills(newItems));
  };

  const GetTransaction = (item) => {
    setTransaction(item);
  };

  const BulkDelete = async (keyValue) => {
    const voucherKeys = groupByKey(
      vendorBills.filter((a) => a.selected),
      'vendor_name',
    )[keyValue].map((listItem) => listItem.voucher_id);

    const queryParam = `${voucherKeys.map(
      (ele) => `voucher_item_ids[]=${ele}`,
    )}`.replaceAll(',', '&');

    dispatch(
      bulkDeleteVouchers({ VoucherId: paymentVoucharId, queryParam, keyValue }),
    );
  };

  const RefreshVouchers = async () => {
    const body = {};
    body.type = state.opt;

    dispatch(enableLoading(true));
    dispatch(refreshVoucherItem(body));
  };

  //  Transaction Forget Password Start

  const ShowForgetPassWord = () => {
    setShowTransPass(true);
  };

  // Transaction Forget Password End

  useEffect(() => {
    if (refreshVoucherResponse) {
      dispatch(
        getVoucherItems(
          state?.payment?.id || state?.voucherId || paymentVoucharId,
        ),
      );
      if (refreshVoucherResponse === 'refSuccess') HandleBankUpload();
    }
  }, [refreshVoucherResponse]);

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

  useEffect(() => {
    if (
      Object.keys(userRoles?.Payment || {})?.length > 0 &&
      !userRoles?.Payment?.create_payment
    ) {
      setHavePermission({
        open: true,
        back: () => {
          navigate('/payment');
          setHavePermission({ open: false });
        },
      });
    }
  }, [userRoles?.Payment]);

  useEffect(() => {
    if (state?.payment || state?.voucherId) {
      dispatch(setPaymentVoucher(state?.payment?.id || state?.voucherId));
      if (state?.payment) {
        if (state?.vendorUnsettled)
          dispatch(
            setSearchVendorBills({
              action: 'vendor',
              data: state?.vendorUnsettled,
            }),
          );
        else dispatch(unSettledVendorBills());
      }

      setTabValue(1);
      dispatch(
        getVoucherItems(
          state?.payment?.id || state?.voucherId || paymentVoucharId,
        ),
      );
      setBankuploadState({
        ...BankuploadState,
        bankless_entities: state?.payment?.bankless_entities,
        bankless_entity_ids: state?.payment?.bankless_entity_ids,
      });

      if (
        state?.payment?.bankless_entities > 0 &&
        (state.opt === 'overdue' || state.opt === 'payables')
      )
        setDrawer({ ...drawer, BankupOpen: true });
    } else if (state?.payables) {
      CreateVoucher();
    } else {
      dispatch(setPaymentVoucher(''));
      dispatch(unSettledVendorBills());
      setTabValue(0);
      CreateVoucher();
    }
    return () => dispatch(setSelectedBillIds([]));
  }, []);

  useEffect(() => {
    if (state?.fromVendorSelection) {
      dispatch(setPaymentVoucher(''));
      setTabValue(0);

      dispatch(unSettledVendorBills());

      CreateVoucher();
      onTriggerDrawer(state?.fromVendorSelection?.id);
    }
  }, [state?.fromVendorSelection]);

  useMemo(async () => {
    if (paymentVoucharId && state?.payables) {
      dispatch(unSettledVendorBills());
      await handleSelect(true, state?.payables?.id);
      setTabValue(1);
    }
  }, [paymentVoucharId]);

  useEffect(() => {
    const vendorObj = {};
    vendorBills?.forEach((el) => {
      vendorObj[el.vendor_id] = null;
    });
    const partyCount = Object.keys(vendorObj).length;

    const billCount = vendorBills.filter((a) => a.selected).length;

    const totalAmount = vendorBills
      .filter((a) => a.selected && Number(a.paidAmount) <= Number(a.amount))
      .map((a) => Number(a.paidAmount) || 0)
      .reduce((a, b) => a + b, 0);
    if (billCount === 0) {
      setPayNow({
        active: false,
        title: 'Grand Total',
        subTitle: 'No Parties and Bills Selected for Payment',
      });
    } else {
      setPayNow({
        active: Number.isNaN(totalAmount) ? 0 : Number(totalAmount) > 0,
        title: FormattedAmount(totalAmount),
        subTitle: `${partyCount} Party and ${billCount} Bills Selected`,
      });
    }
  }, [vendorBills]);

  useEffect(() => {
    if (retryPaymentVoucharId) {
      setDrawer((d) => ({ ...d, paymentSuccess: false }));
      setMultiplePayments(false);
      setTabValue(1);
      dispatch(
        getVoucherItems(
          state?.payment?.id || state?.voucherId || paymentVoucharId,
        ),
      );
    }
  }, [retryPaymentVoucharId]);

  useEffect(() => {
    if (tabValue === 1) {
      dispatch(setVendorBillLoading(true));
      dispatch(setVendorBills([]));

      setTimeout(() => {
        dispatch(
          getVoucherItems(
            state?.payment?.id || state?.voucherId || paymentVoucharId,
          ),
        );
      }, 400);
    } else setTimeout(() => dispatch(unSettledVendorBills()), 2000);
  }, [tabValue]);

  // if (!Object.values(dataLoad)?.some((item) => !!item))
  //   return <MakePaymentLoading />;

  return (
    <>
      <PageTitle
        title="Payments"
        onClick={() => {
          if (state?.fromVendorSelection) {
            navigate(state?.fromVendorSelection?.path, {
              state: state?.fromVendorSelection?.backState,
            });
          } else {
            navigate(-1);
          }
        }}
      />
      <div className={cssDash.makePaymentContainer}>
        <div
          className={
            device === 'desktop'
              ? css.makePaymentContainerDesktop
              : css.makePaymentContainer
          }
        >
          <div
            className={
              device === 'desktop'
                ? css.makePaymentContainerMainDesktop
                : css.makePaymentContainerMainMobile
            }
          >
            <div
              className={
                device === 'desktop'
                  ? css.headerContainerDesktop
                  : css.headerContainer
              }
            >
              <div className={css.headerLabel}>
                {drawer.paymentSuccess ? 'Payment Status' : 'Make a Payment'}
              </div>
              <span className={css.headerUnderline} />
            </div>
            {drawer.paymentSuccess ? (
              <>
                {multiplePayments === true && (
                  <FinalPayment
                    paymentsResponse={paymentsResponse}
                    // setRetryPaymentVoucharId={setRetryPaymentVoucharId}
                    paymentType="voucher_payment"
                  />
                )}
                {multiplePayments === false && (
                  <SuccessView
                    title="Your Payment is Being Processed"
                    description=""
                    btnTitle="Visit Payments"
                    onClick={() => {
                      navigate('/payment');
                    }}
                  />
                )}
              </>
            ) : (
              <div
                className={
                  device === 'desktop'
                    ? css.tabContainerDesktop
                    : css.tabContainer
                }
              >
                <div
                  className={
                    device === 'desktop'
                      ? css.tabsWrapperDesktop
                      : css.tabsWrapper
                  }
                >
                  <Tabs
                    value={tabValue}
                    onChange={tabchange}
                    className={css.tabsStyle}
                    classes={{
                      indicator: classes.indicator,
                    }}
                  >
                    <Tab
                      disableRipple
                      value={0}
                      key="outstanding"
                      label="OUTSTANDING"
                      className={
                        tabValue === 0 ? css.activeTab : css.deactiveTab
                      }
                    />
                    <Tab
                      disableRipple
                      value={1}
                      key="selected"
                      label="SELECTED"
                      className={
                        tabValue === 1 ? css.activeTab : css.deactiveTab
                      }
                    />
                  </Tabs>
                </div>
                {tabValue === 1 && device === 'desktop' && (
                  <div className={css.anime} style={{ marginBottom: 8 }}>
                    <div className={css.infoTextDiv}>
                      <p className={css.infoText}>
                        <img src={alertIcon} alt="Alert" /> Click Outstanding to
                        make Payment to more vendors
                      </p>
                    </div>
                  </div>
                )}
                <Stack justifyContent="space-between" direction="row">
                  <Typography
                    className={css.text}
                    key={tabValue === 0 ? 'anime' : 'animeload'}
                  >
                    Vendor to be selected
                  </Typography>
                  {/* <Button className={css.clearAllbtn}>Clear All</Button> */}
                </Stack>

                {tabValue === 0 ? (
                  <>
                    <div className={css.outstanding}>
                      <InputBase
                        className={
                          device === 'desktop'
                            ? `${classes.styledCardTextfieldDesktop} ${css.anime}`
                            : `${classes.styledCardTextfield} ${css.anim}`
                        }
                        sx={{ ml: 1, flex: 1 }}
                        placeholder={
                          device === 'desktop'
                            ? 'Search for Bills'
                            : 'Search for Bills'
                        }
                        name="search"
                        value={searchTerm}
                        onChange={(e) => onInputChange(e)}
                      />
                      <div
                        className={
                          device === 'desktop' ? css.billsDesktop : css.bills
                        }
                      >
                        {searchUnsettledVendorBills &&
                        searchUnsettledVendorBills.length > 0 ? (
                          <>
                            {searchUnsettledVendorBills.map((bill) => {
                              return (
                                <div
                                  key={`index-${bill.id}`}
                                  className={
                                    device === 'desktop'
                                      ? css.billItemDesktop
                                      : css.biilItem
                                  }
                                  onClick={() => onTriggerDrawer(bill.id)}
                                >
                                  <div className={css.body}>
                                    <p className={css.billName}>
                                      {bill.name?.toLowerCase()}
                                    </p>
                                    <p className={css.totalBill}>
                                      {bill.total_count} Outstanding Bills
                                    </p>
                                  </div>
                                  <p className={css.billAmount}>
                                    {FormattedAmount(bill?.total_net_balance)}
                                  </p>
                                </div>
                              );
                              // }
                            })}
                          </>
                        ) : (
                          <>
                            {UnsettledVendorBillsLoading ? (
                              <>
                                {[...Array(20)].map((bill) => {
                                  return (
                                    <div
                                      key={bill}
                                      className={
                                        device === 'desktop'
                                          ? css.billItemDesktop
                                          : css.biilItem
                                      }
                                    >
                                      <div className={css.body}>
                                        <p className={css.billName}>
                                          <Skeleton
                                            animation="wave"
                                            className={css.skel}
                                            width={130}
                                            height={18}
                                          />
                                        </p>
                                        <p className={css.totalBill}>
                                          <Skeleton
                                            animation="wave"
                                            className={css.skel}
                                            width={130}
                                            height={18}
                                          />
                                        </p>
                                      </div>
                                      <p className={css.billAmount}>
                                        <Skeleton
                                          animation="wave"
                                          width={80}
                                          height={18}
                                        />
                                      </p>
                                    </div>
                                  );
                                })}
                              </>
                            ) : (
                              <Typography align="center">
                                No Data Found
                              </Typography>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      className={
                        device === 'desktop' ? css.payNowDesktop : css.payNow
                      }
                    >
                      <PayNow
                        active={payNow.active}
                        title={payNow.title}
                        subTitle={payNow.subTitle}
                        handlePay={() => {}}
                        hasBalance
                        PayType={(item) => GetTransaction(item)}
                      />
                    </div>
                    <SelectBottomSheet
                      triggerComponent
                      open={vendorDrawer}
                      name="makePayment"
                      onClose={() => dispatch(setVendorDrawer(false))}
                      id="overFlowHidden"
                      fixedWidthSheet="35vw"
                      addNewSheet
                    >
                      <VendorBill
                        vendor_id={vendor}
                        selectedbills={selectedbillids}
                        done={(amount, billCount, selectedVendorBills) => {
                          dispatch(setVendorDrawer(false));
                          setPayNow({
                            active: true,
                            title: `Rs. ${amount}`,
                            subTitle: `1 Party and ${billCount} Bill(s) Selected`,
                          });
                          console.log(selectedVendorBills);
                          // dispatch(setVendorBills(selectedVendorBills));
                          setTabValue(1);
                        }}
                        handleBottomSheetOpen={handleBottomSheetOpen}
                      />
                    </SelectBottomSheet>
                  </>
                ) : (
                  <>
                    <div
                      className={css.selectedParty}
                      key={tabValue === 0 ? 'animedata' : 'animedataload'}
                    >
                      {vendorBills?.length > 0 && !vendorBillLoading ? (
                        <>
                          {Object.keys(
                            groupByKey(
                              vendorBills.filter((a) => a.selected),
                              'vendor_name',
                            ),
                          ).map((objKey) => {
                            return (
                              <Accordion key={objKey}>
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls="panel1a-content"
                                  id="panel1a-header"
                                >
                                  <FormControlLabel
                                    aria-label="Acknowledge"
                                    onClick={(event) => event.stopPropagation()}
                                    onFocus={(event) => event.stopPropagation()}
                                    control={
                                      <Checkbox
                                        icon={<CheckSvg />}
                                        checkedIcon={<CheckedSvg />}
                                        checked={
                                          vendorBills.filter((a) => a?.selected)
                                            ?.length > 0
                                        }
                                        onChange={() => BulkDelete(objKey)}
                                      />
                                    }
                                  />
                                  <div className={css.selectedBill}>
                                    <p className={css.selectedBillName}>
                                      {pageParams === null
                                        ? unsettledVendorBills
                                            .find((a) => a.id === vendor)
                                            ?.name?.toLowerCase()
                                        : objKey}
                                    </p>
                                    <p className={css.selectedTotalAmount}>
                                      {FormattedAmount(
                                        fintotal(
                                          groupByKey(
                                            vendorBills.filter(
                                              (a) => a.selected,
                                            ),
                                            'vendor_name',
                                          )[objKey],
                                        ),
                                      )}
                                    </p>
                                  </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <div style={{ width: '100%' }}>
                                    {groupByKey(
                                      vendorBills.filter((a) => a.selected),
                                      'vendor_name',
                                    )[objKey].map((listitem, index) => {
                                      // setSelect(listitem);
                                      return (
                                        <div
                                          className={
                                            device === 'desktop'
                                              ? css.categoryOptionsDesktop
                                              : css.categoryOptions
                                          }
                                          key={listitem.id}
                                          role="menuitem"
                                        >
                                          <BillItem
                                            key={listitem.id}
                                            index={index}
                                            checked={listitem.selected}
                                            name={listitem.vendor_name}
                                            totalAmount={
                                              listitem.net_balance
                                                ? listitem.net_balance
                                                : listitem.original_amount
                                            }
                                            paidAmount={listitem.paidAmount}
                                            day={listitem.age_description}
                                            descriptionColor={
                                              listitem.age_description_color
                                            }
                                            hasAgeDescription
                                            handleChange={(e) =>
                                              handleSelect(
                                                e.target.checked,
                                                listitem.id,
                                                listitem.vendor_id,
                                              )
                                            }
                                            id={listitem.id}
                                            tabValue={tabValue}
                                            handleAmountChange={(e) => {
                                              handleAmountChange(
                                                e?.target?.value,
                                                listitem?.id,
                                              );
                                            }}
                                            date={listitem.date}
                                            updateAmount={() =>
                                              updateVoucherItems(
                                                listitem.voucher_id,
                                                listitem.paidAmount,
                                              )
                                            }
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </AccordionDetails>
                              </Accordion>
                            );
                          })}
                        </>
                      ) : (
                        <>
                          {vendorBillLoading && (
                            <>
                              {[...Array(10)].map((objKey) => {
                                return (
                                  <Accordion key={objKey}>
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header"
                                      style={{ height: '68px' }}
                                    >
                                      <FormControlLabel
                                        aria-label="Acknowledge"
                                        onClick={(event) =>
                                          event.stopPropagation()
                                        }
                                        onFocus={(event) =>
                                          event.stopPropagation()
                                        }
                                        control={
                                          <Skeleton
                                            animation="wave"
                                            width={27}
                                            height={40}
                                            style={{ marginLeft: '9px' }}
                                          />
                                        }
                                      />
                                      <div className={css.selectedBill}>
                                        <p className={css.selectedBillName}>
                                          <Skeleton animation="wave" />
                                        </p>
                                        <p className={css.selectedTotalAmount}>
                                          <Skeleton
                                            animation="wave"
                                            width={60}
                                            style={{ float: 'right' }}
                                          />
                                        </p>
                                      </div>
                                    </AccordionSummary>
                                  </Accordion>
                                );
                              })}
                            </>
                          )}
                        </>
                      )}
                    </div>

                    <div
                      className={
                        device === 'desktop' ? css.payNowDesk : css.payNow
                      }
                    >
                      <PayNow
                        active={payNow.active}
                        title={payNow.title}
                        subTitle={payNow.subTitle}
                        handlePay={handlePay}
                        hasBalance
                        PayType={(item) => GetTransaction(item)}
                      />
                    </div>
                    <SelectBottomSheet
                      triggerComponent
                      open={proceedToPayDrawer}
                      name="proceedToPay"
                      onClose={() => dispatch(setProceedToPayDrawer(false))}
                      addNewSheet={device === 'mobile'}
                    >
                      <ProceedToPay
                        onClose={(param) => {
                          dispatch(setProceedToPayDrawer(false));
                          if (param === 'success') navigate('/payment-history');
                        }}
                        paymentVoucharId={paymentVoucharId}
                        showVerifyPassword={[drawer, setDrawer]}
                        setMultiplePayments={setMultiplePayments}
                        setPaymentsResponse={setPaymentsResponse}
                        bankAccounts={bankAccounts}
                        paidAmount={vendorBills
                          .filter((a) => a.selected)
                          .map((a) => Number(a.paidAmount) || 0)
                          .reduce((a, b) => a + b, 0)
                          .toFixed(2)}
                        payNow={payNow}
                        ShowTransForgPass={ShowForgetPassWord}
                      />
                    </SelectBottomSheet>

                    <SelectBottomSheet
                      triggerComponent
                      open={ShowTransPass}
                      addNewSheet={device === 'mobile'}
                      name="forgetPassword"
                      hideClose
                      onClose={() => setShowTransPass(false)}
                    >
                      <TransactionForgetPassword
                        onClose={() => setShowTransPass(false)}
                      />
                    </SelectBottomSheet>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <Dialog
          open={paymentBankDrawer && device === 'desktop'}
          onClose={() => dispatch(setPaymentBankDrawer({ value: false }))}
        >
          <PaymentBankReq />
        </Dialog>

        <SelectBottomSheet
          open={paymentBankDrawer && device === 'mobile'}
          onClose={() => dispatch(setPaymentBankDrawer({ value: false }))}
          addNewSheet
          id="overFlowHidden"
          triggerComponent={<></>}
          onTrigger={handleBottomSheetOpen}
        >
          <PaymentBankReq />
        </SelectBottomSheet>

        {/* Vendor Bank Details Upload Start */}

        <PaymentDialog
          open={drawer.BankupOpen && device === 'desktop'}
          onClose={HandleBankUpload}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className={css.bankupload}
        >
          <UploadBankDetails
            data={BankuploadState}
            RefreshVouchers={RefreshVouchers}
            onClose={HandleBankUpload}
          />
        </PaymentDialog>

        {/* Vendor Bank Details Upload End */}
      </div>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default MakePayment;
