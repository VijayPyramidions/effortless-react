/* eslint-disable react/jsx-boolean-value */
/* eslint-disable  no-extra-boolean-cast */

import React, { useState, useContext, useEffect, forwardRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import axiosInst from '@action/ApiConfig/AxiosInst';

import {
  advancePaymentVoucher,
  setAdvancePayment,
  setStateValue,
  setFormattedStateValue,
  createUpdateAdvPayment,
  setAdvancePaymentVoucher,
  getExpenceCategory,
  getAssetCategory,
  getVendorList,
  setVendorList,
  setDataLoad,
  getVoucherItems,
} from '@action/Store/Reducers/Payments/AdvancePaymentState';

import {
  GetIndividualEntityState,
  // ClearSateIndividualEntity,
} from '@action/Store/Reducers/General/GeneralState';
import {
  enableLoading,
  // openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import { getBankAccounts } from '@action/Store/Reducers/Payments/PaymentsState';

import { validateRequired, validateDecimalNum } from '@services/Validation';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';
import useDebounce from '@components/Debounce/Debounce';
import { organizationDetail } from '@components/utils';

import AppContext from '@root/AppContext';

import { Stack, Dialog, Box, Skeleton } from '@mui/material';
import { Button, makeStyles, Chip, styled } from '@material-ui/core';

import * as themes from '@root/theme.scss';
import * as cssDash from '@core/DashboardView/DashboardViewContainer.scss';

import CustomSearch from '@components/SearchSheet/CustomSearch';
import { InvoiceCustomer } from '@components/Invoice/EditForm';
import Input, { AmountFormatCustom } from '@components/Input/Input';
import VendorList from '@components/Vendor/VendorList';
import SuccessView from '@core/BillBookView/shared/SuccessView';

// import AddNewVendor from '@core/BillBookView/shared/AddVendor';

import PageTitle from '@core/DashboardView/PageTitle';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';

import ExpenseCategoryList from '../BillBookView/shared/ExpenseCategoryList';
import TransactionForgetPassword from './TransactionVerify/ForgetPassword';

import PayNow from './shared/PayNow';
import { FinalPayment } from './FinalPayment';
import ProceedToPay from './shared/ProceedToPay';
import PaymentBankReq from './component/PaymentBankReq';

import * as css from './AdvancePayment.scss';

const useStyles = makeStyles(() => ({
  chips: {
    // minWidth: '80px',
    margin: '5px 5px',
    minWidth: '20%',
    maxWidth: '95% !important',
    minHeight: '38px',
    paddingTop: '17px',
    paddingBottom: '17px',
  },
  active: {
    background: '#f2d4cd',
    color: themes.colorPrimaryButton,
    borderColor: themes.colorPrimaryButton,
    fontWeight: 'bold',
  },
  root: {
    '& .MuiInputLabel-root': {
      fontWeight: 400,
      color: '#6E6E6E',
    },
  },
  label: {
    width: '100%',
  },
}));

const PriceCustom = forwardRef(function PriceCustom(props) {
  const { ...other } = props;
  return (
    <AmountFormatCustom
      {...other}
      decimalScale={2}
      type="text"
      valueIsNumericString={true}
    />
  );
});

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const VALIDATION = {
  vendor: {
    errMsg: 'Please select the vendor',
    test: validateRequired,
    page: 1,
  },
  amount: {
    errMsg: 'Please provide valid amount',
    test: validateRequired,
    page: 2,
  },
  tds: {
    errMsg: 'Please provide valid TDS',
    test: (v) => validateDecimalNum(v, 2),
    page: 2,
  },
  expenseCategory: {
    errMsg: 'Choose expense category',
    test: (v) => validateRequired(v?.name),
    page: 2,
  },
};

const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
  [k]: false,
}));

const SubAdvancePayment = ({ selectVendor, stateOut }) => {
  const device = localStorage.getItem('device_detect');
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    paymentVoucharId,
    expenseCategoryList,
    assetCategoryList,
    advPaymentDetails,
    advPaymentId,
    stateValue,
    formattedStateValue,
    vendorList,
    vendorListMap,
    dataLoad,
  } = useSelector((state) => state.AdvancePayment);

  const { bankAccounts } = useSelector((state) => state.Payments);

  const organization = organizationDetail();

  const { userPermissions } = useContext(AppContext);

  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [ShowTransPass, setShowTransPass] = useState(false);

  const [page, setPage] = useState(1);
  const [noTransition, setNoTransition] = useState('');
  const [vendorView, setVendorView] = useState(false);
  const [multiplePayments, setMultiplePayments] = useState(false);
  const [paymentsResponse, setPaymentsResponse] = useState();
  const [retryPaymentVoucharId, setRetryPaymentVoucharId] = useState();

  const [transaction, setTransaction] = useState('');
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState({
    vendor: false,
    bankAccount: false,
    proceedToPay: false,
    paymentSuccess: false,
    payU: false,
    edit: false,
    paymentBank: false,
  });
  const [clickVendorId, setClickVendorId] = useState('');
  const [trigger, setTrigger] = useState('list');
  const [editValue, setEditValue] = useState({});
  const debouncedForAmt = useDebounce(stateValue?.amount);

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

  const ShowForgetPassWord = () => {
    setShowTransPass(true);
  };

  const getVendors = async (allParties, searchVal) => {
    // if (!!searchVal) dispatch(enableLoading(true));
    dispatch(getVendorList({ allParties, searchVal }));
  };

  const getBankAccountsDetail = async () => {
    dispatch(enableLoading(true));
    dispatch(getBankAccounts(paymentVoucharId));
  };

  const onAddVendor = () => {
    setVendorView(true);
    setPage(-1);
  };

  const createAdvancePayment = async (vendorId) => {
    await axiosInst
      .post(`organizations/${organization.orgId}/advance_payments`, {
        vendor_id: vendorId,
      })
      .then((res) => {
        if (res && !res.data?.error) {
          dispatch(setAdvancePayment(res.data));
          setNoTransition('no');
        }
      })
      .catch((e) => {
        if (e?.response.data.error) {
          setNoTransition('yes');
          if (
            e?.response.data.message === 'No vendor bank details is present'
          ) {
            handleBottomSheetOpen('paymentBank', vendorId);
          }
        }
      });
  };

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value = ps?.target?.value;
    const formattedValue = ps?.target?.formattedValue;
    return [name, value, formattedValue];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };

  const handleBottomSheet = (name, data) => {
    setDrawer((d) => ({ ...d, [name]: false }));
    setTrigger('list');
    if (data) dispatch(setStateValue({ ...stateValue, [name]: data }));
    if (data)
      dispatch(
        setFormattedStateValue({ ...formattedStateValue, [name]: data }),
      );

    if (
      typeof data !== 'object' &&
      data?.primary_relationship !== 'vendor' &&
      page === 1
    )
      dispatch(
        GetIndividualEntityState({
          entityId: data?.id,
          entityType: data?.primary_relationship,
          createRelation: 'vendor',
        }),
      );

    if (stateValue[name] && !data) return;
    reValidate({ target: { name, value: data } });
  };

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
    getVendors();
  };

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(stateValue[v]);
      return a;
    }, {});
  };

  const onPageNext = async () => {
    const sectionValidation = {};
    Object.keys(VALIDATION).forEach((k) => {
      if (VALIDATION[k]?.page === page) {
        sectionValidation[k] = VALIDATION[k];
      }
    });
    const v = validateAllFields(sectionValidation);
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    if (page === 1) {
      await createAdvancePayment(stateValue.vendor.id);
      await dispatch(getExpenceCategory());
      await dispatch(getAssetCategory());
    }
    if (page === 2) {
      if (Number(stateValue.tds) >= Number(stateValue.amount)) {
        setValidationErr((i) => ({
          ...i,
          tds: true,
        }));
        return;
      }
      if (
        advPaymentDetails.amount !== stateValue.amount ||
        advPaymentDetails.tds_amount !== stateValue.tds ||
        advPaymentDetails.expense_account_id !== stateValue.expenseCategory.id
      ) {
        const newData = {
          vendor_id: advPaymentDetails.vendor_id,
          amount: stateValue.amount,
          tds_amount: stateValue.tds,
          transaction_type: transaction,
          // transaction_type:'Bank transaction',
          vendor_bank_detail_id: advPaymentDetails.vendor_bank_detail_id,
          account_id: advPaymentDetails.account_id,
          expense_account_id: stateValue.expenseCategory?.id,
        };
        await dispatch(
          createUpdateAdvPayment({
            type: 'patch',
            id: advPaymentDetails.id,
            payload: {
              ...newData,
            },
          }),
        );
      }
      await getBankAccountsDetail();
      setDrawer((d) => ({ ...d, proceedToPay: true }));
    }
  };

  const handlePay = async () => {
    await onPageNext();
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value, formattedValue] = getEventNameValue(ps);
    if (name === 'tds') {
      dispatch(
        setStateValue({
          ...stateValue,
          [name]: Number(Number(value)?.toFixed(2)),
        }),
      );

      dispatch(
        setFormattedStateValue({
          ...formattedStateValue,
          [name]: formattedValue?.toFixed(2),
        }),
      );
    } else {
      dispatch(setStateValue({ ...stateValue, [name]: value }));

      dispatch(
        setFormattedStateValue({
          ...formattedStateValue,
          [name]: formattedValue,
        }),
      );
    }
  };

  const vendorClick = (v) => {
    handleBottomSheet('vendor', v);
    const newVendors = vendorList.map((item) => {
      if (item.id === v.id) {
        const updatedItem = {
          ...item,
        };

        return updatedItem;
      }

      return { ...item };
    });
    dispatch(setVendorList(newVendors));
  };

  const GetTransaction = (item) => {
    setTransaction(item);
  };

  const handleWithLocation = (element) => {
    handleBottomSheet('vendor', element);
  };

  const onTriggerDrawerForEdit = (name, element) => {
    setEditValue(element);
    setDrawer((d) => ({ ...d, vendor: false }));

    if (device === 'desktop') {
      setDrawer((d) => ({ ...d, [name]: true }));
    }
    if (device === 'mobile') {
      setPage(3);
    }
  };

  useEffect(() => {
    if (retryPaymentVoucharId) {
      setDrawer((d) => ({ ...d, paymentSuccess: false, proceedToPay: false }));
      setMultiplePayments(false);
      dispatch(setAdvancePaymentVoucher(retryPaymentVoucharId));
    }
  }, [retryPaymentVoucharId]);

  useEffect(() => {
    if (noTransition === 'yes') {
      if (page > 1) setPage((p) => p - 1);
    } else if (noTransition === 'no') setPage((p) => p + 1);
  }, [noTransition]);

  useEffect(() => {
    dispatch(advancePaymentVoucher({ transaction_type: transaction }));
    getVendors();
    return () => {
      dispatch(setDataLoad());
      dispatch(
        setStateValue({
          vendor: '',
          amount: '',
          tds: '',
          expenseCategory: '',
        }),
      );
    };
  }, []);

  useEffect(() => {
    if (stateValue.expenseCategory || debouncedForAmt) {
      const newData = {
        vendor_id: advPaymentDetails?.vendor_id,
        amount: debouncedForAmt,
        expense_account_id: stateValue.expenseCategory?.id,
      };
      dispatch(
        createUpdateAdvPayment({
          type: 'patch',
          id: advPaymentDetails.payment_voucher || advPaymentDetails?.id,
          payload: {
            ...newData,
          },
        }),
      );
    }
  }, [stateValue.expenseCategory, debouncedForAmt]);

  useEffect(() => {
    if (stateOut?.voucherId) {
      dispatch(getExpenceCategory());
      dispatch(getAssetCategory());
      setRetryPaymentVoucharId(stateOut?.voucherId);
      dispatch(getVoucherItems(stateOut?.voucherId));
      setPage(2);
    }
  }, [stateOut?.voucherId]);

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
    if (selectVendor) {
      handleBottomSheet('vendor', selectVendor);
    }
  }, [selectVendor]);

  useEffect(() => {
    if (advPaymentDetails?.expense_account_id && stateOut?.voucherId) {
      if (expenseCategoryList?.length > 0) {
        const selectedExpense = expenseCategoryList?.filter(
          (ele) => ele.id === advPaymentDetails?.expense_account_id,
        );
        handleBottomSheet('expenseCategory', selectedExpense[0]);
        return;
      }
      if (assetCategoryList?.length > 0) {
        const selectedExpense = assetCategoryList?.filter(
          (ele) => ele.id === advPaymentDetails?.expense_account_id,
        );
        handleBottomSheet('expenseCategory', selectedExpense[0]);
      }
    }
  }, [advPaymentDetails?.expense_account_id]);

  return (
    <>
      <PageTitle
        title="Payments"
        onClick={() => {
          if (stateOut?.fromVendorSelection) {
            navigate(stateOut?.fromVendorSelection?.path, {
              state: stateOut?.fromVendorSelection?.backState,
            });
            return;
          }
          if (device === 'desktop') {
            navigate(-1);
          }
          if (device === 'mobile') {
            if (page === 3) {
              setPage(1);
            } else {
              navigate(-1);
            }
          }
        }}
      />
      <div
        className={
          device === 'mobile'
            ? // ? css.dashboardBodyContainer
              cssDash.dashboardBodyContainerhideNavBar
            : cssDash.dashboardBodyContainerDesktop
        }
      >
        {page === 3 ? (
          <div style={{ marginBottom: '70px', overflow: 'auto' }}>
            <div className={css.headerContainer} style={{ margin: '1rem' }}>
              <div className={css.headerLabel}>{editValue?.name}</div>
              <span className={css.headerUnderline} />
            </div>
            <InvoiceCustomer
              showValue={editValue}
              handleBottomSheet={() => setPage(1)}
              type="vendors"
            />
          </div>
        ) : (
          <div
            className={
              device === 'desktop'
                ? css.advancePaymentContainerDesktop
                : css.advancePaymentContainer
            }
          >
            <Stack
              style={
                device === 'desktop'
                  ? { height: 'auto', width: '95%' }
                  : { height: 'auto', width: '100%' }
              }
            >
              <div className={css.headerContainer}>
                <div
                  className={
                    device === 'desktop'
                      ? css.headerLabelDesktop
                      : css.headerLabel
                  }
                >
                  Pay an Advance
                </div>
                <span
                  className={
                    device === 'desktop'
                      ? css.headerUnderlineDesktop
                      : css.headerUnderline
                  }
                />
              </div>
              {drawer.paymentSuccess ? (
                <>
                  {multiplePayments === true && (
                    <FinalPayment
                      paymentsResponse={paymentsResponse}
                      setRetryPaymentVoucharId={setRetryPaymentVoucharId}
                      paymentType="advance_payment"
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
                  className={`${css.inputContainer} ${
                    vendorView ? css.noMargin : ''
                  }`}
                  key={page === 1 ? 'vendor' : 'amount'}
                >
                  {page === 1 && (
                    <>
                      <div className={css.label}>Enter Vendor Name</div>
                      <SelectBottomSheet
                        name="vendor"
                        onBlur={reValidate}
                        error={validationErr.vendor}
                        helperText={
                          validationErr.vendor ? VALIDATION?.vendor?.errMsg : ''
                        }
                        label="Vendor"
                        open={drawer.vendor}
                        value={stateValue.vendor?.name}
                        onTrigger={onTriggerDrawer}
                        onClose={handleBottomSheet}
                        addNewSheet={
                          !(trigger === 'list' && device === 'desktop')
                        }
                      >
                        {trigger === 'addManually' && (
                          <VendorList
                            trigger={trigger}
                            vendorList={vendorList}
                            onClick={(ps) => handleBottomSheet('vendor', ps)}
                            addNewVendor={() => onAddVendor()}
                            continueFlow={() => handleBottomSheet('vendor')}
                            updateVendorList={getVendors}
                            // disableAdd
                            hideDoNotTrack
                          />
                        )}
                        {trigger === 'list' && (
                          <CustomSearch
                            showType="Vendor"
                            customerList={vendorList}
                            callFunction={getVendors}
                            handleLocationParties={handleWithLocation}
                            handleAllParties={(ps) =>
                              handleBottomSheet('vendor', ps)
                            }
                            addNewOne={() => setTrigger('addManually')}
                            openDrawer={onTriggerDrawerForEdit}
                            hideLocation
                          />
                        )}
                      </SelectBottomSheet>
                      <SelectBottomSheet
                        name="edit"
                        triggerComponent={<div style={{ display: 'none' }} />}
                        open={drawer.edit}
                        onTrigger={onTriggerDrawer}
                        onClose={handleBottomSheet}
                        maxHeight="45vh"
                      >
                        <div style={{ padding: '15px' }}>
                          {device === 'mobile' && <Puller />}
                          <div
                            style={{ padding: '5px 0' }}
                            className={css.headerContainer}
                          >
                            <p className={css.headerLabel}>{editValue?.name}</p>
                            <span className={css.headerUnderline} />
                          </div>
                          <InvoiceCustomer
                            showValue={editValue}
                            handleBottomSheet={handleBottomSheet}
                            type="vendors"
                          />
                        </div>
                      </SelectBottomSheet>
                      <div
                        key={
                          Object.values(dataLoad)?.every((item) => !!item)
                            ? 'payHisNotLoaded'
                            : 'payHisLoaded'
                        }
                      >
                        {vendorListMap.length > 0 &&
                        Object.values(dataLoad)?.every((item) => !!item) ? (
                          <>
                            {vendorListMap.slice(0, 5).map((v) => {
                              return (
                                <Chip
                                  className={`${classes.chips} ${
                                    stateValue.vendor?.name === v.name
                                      ? classes.active
                                      : ''
                                  }`}
                                  key={v.id}
                                  label={
                                    <span className={css.wrapLabel}>
                                      {v.name}
                                    </span>
                                  }
                                  variant="outlined"
                                  onClick={() => {
                                    vendorClick({ ...v });
                                  }}
                                />
                              );
                            })}
                          </>
                        ) : (
                          <>
                            {[...Array(5)].map((item) => (
                              <Chip
                                className={classes.chips}
                                key={`row${item}`}
                                classes={{
                                  label: classes.label,
                                }}
                                label={
                                  <Skeleton animation="wave" height={20} />
                                }
                                variant="outlined"
                              />
                            ))}
                          </>
                        )}
                      </div>
                    </>
                  )}
                  {page === 2 && (
                    <>
                      <SelectBottomSheet
                        name="expenseCategory"
                        onBlur={reValidate}
                        error={validationErr.expenseCategory}
                        helperText={
                          validationErr.expenseCategory
                            ? VALIDATION?.expenseCategory?.errMsg
                            : ''
                        }
                        label="Expense Category"
                        open={drawer.expenseCategory}
                        value={stateValue.expenseCategory?.name}
                        onTrigger={onTriggerDrawer}
                        onClose={handleBottomSheet}
                      >
                        <ExpenseCategoryList
                          expenseCategoryList={expenseCategoryList}
                          assetCategoryList={assetCategoryList}
                          onClick={(ps) =>
                            handleBottomSheet('expenseCategory', ps)
                          }
                          categoryListOpen={drawer.expenseCategory}
                          getExpenseCategory={() =>
                            dispatch(getExpenceCategory())
                          }
                          getAssetCategory={() => dispatch(getAssetCategory())}
                        />
                      </SelectBottomSheet>
                      <Input
                        name="amount"
                        onBlur={reValidate}
                        helperText={
                          validationErr.amount ? VALIDATION?.amount?.errMsg : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="Advance Amount"
                        variant="standard"
                        value={formattedStateValue.amount || ''}
                        placeholder={0}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          inputComponent: PriceCustom,
                        }}
                        fullWidth
                        onChange={onInputChange}
                        theme="light"
                      />
                      <Input
                        name="tds"
                        // onBlur={reValidate}
                        helperText={
                          validationErr.tds ? VALIDATION?.tds?.errMsg : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="TDS"
                        variant="standard"
                        value={stateValue.tds}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        // inputProps={{
                        //   type: 'Number',
                        // }}
                        InputProps={{
                          readOnly: true,
                          inputComponent: PriceCustom,
                        }}
                        fullWidth
                        onChange={onInputChange}
                        theme="light"
                      />
                    </>
                  )}
                </div>
              )}
              {page !== 4 && !vendorView && page === 1 && (
                <div className={css.actionContainer}>
                  {page === 1 ? <div /> : null}
                  <Button
                    onClick={() => onPageNext()}
                    size="large"
                    className={css.submitButton}
                  >
                    {page === 1 ? 'Next' : 'Proceed to Pay'}
                  </Button>
                </div>
              )}
              {page !== 1 && !drawer.paymentSuccess && (
                <div className={css.PayNow}>
                  <PayNow
                    active={
                      Number(stateValue.amount) - Number(stateValue.tds) > 0
                    }
                    title={FormattedAmount(
                      Number(stateValue?.amount) - Number(stateValue?.tds),
                    )}
                    subTitle=""
                    hasBalance
                    handlePay={handlePay}
                    PayType={(item) => GetTransaction(item)}
                  />
                  <SelectBottomSheet
                    triggerComponent
                    open={drawer.proceedToPay}
                    name="proceedToPay"
                    onClose={handleBottomSheet}
                    addNewSheet
                  >
                    <ProceedToPay
                      onClose={(res) => {
                        setDrawer((d) => ({ ...d, proceedToPay: false }));
                        if (res === 'success') navigate('/payment-history');
                      }}
                      paymentVoucharId={paymentVoucharId}
                      advancePaymentId={advPaymentId}
                      setMultiplePayments={setMultiplePayments}
                      setPaymentsResponse={setPaymentsResponse}
                      showVerifyPassword={[drawer, setDrawer]}
                      bankAccounts={bankAccounts}
                      paidAmount={Number(
                        Number(stateValue.amount) - Number(stateValue.tds),
                      )?.toFixed(2)}
                      payNow={{
                        active: true,
                        title: FormattedAmount(
                          Number(stateValue?.amount) - Number(stateValue?.tds),
                        ),
                        subTitle: '1 Party and 1 Bill Selected',
                      }}
                      ShowTransForgPass={ShowForgetPassWord}
                      payType
                    />
                  </SelectBottomSheet>
                </div>
              )}
              {/* {vendorView && <AddNewVendor onCloseVendor={onCloseVendor} />} */}
            </Stack>
          </div>
        )}
      </div>
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
        triggerComponent
        open={ShowTransPass}
        name="forgetPassword"
        hideClose
        onClose={() => setShowTransPass(false)}
      >
        <TransactionForgetPassword onClose={() => setShowTransPass(false)} />
      </SelectBottomSheet>

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

const AdvancePayment = () => {
  const { state } = useLocation();
  const [vendor, setVendor] = useState(false);

  useEffect(() => {
    if (state?.fromVendorSelection) {
      setVendor(state?.fromVendorSelection?.id);
    }
  }, [state]);
  return <SubAdvancePayment selectVendor={vendor} stateOut={state} />;
};

export default AdvancePayment;
