import React, { useState, useContext, useEffect } from 'react';
import AppContext from '@root/AppContext.jsx';
import Input from '@components/Input/Input.jsx';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import {
  validatePhone,
  validateWholeNum,
  validateRequired,
  validateName,
} from '@services/Validation.jsx';
import { Button, makeStyles } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import * as css from './Rent.scss';
import SuccessView from '../shared/SuccessView';
import VerificationDialog from '../shared/VerificationDialog';

const PageCount = 3;

const useStyles = makeStyles(() => ({
  root: {
    background: themes.colorInputBG,
    borderColor: themes.colorInputBorder,
    borderRadius: '8px',
    margin: '0px !important',
    '& .MuiInputLabel-root': {
      margin: '0px',
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiInput-root': {
      marginTop: '24px',
    },
    '& .MuiInput-multiline': {
      paddingTop: '10px',
    },
    '& .MuiSelect-icon': {
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiSelect-select': {
      borderColor: themes.colorInputBorder,
    },
  },
}));

export const recurringPayment = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
];

export const settlementMode = [
  { id: 'Automatic', label: 'Automatic' },
  { id: 'Manual', label: 'Manual' },
];

export const bankAccount = [
  { id: '1', label: 'HDFC - XXXXXXXXXXXX0394' },
  { id: '2', label: 'HDFC - XXXXXXXXXXXX8945' },
];

const VALIDATION = {
  companyName: {
    errMsg: 'Please provide valid name',
    test: validateName,
    page: 1,
  },
  phoneNumber: {
    errMsg: 'Please provide valid Phone number.',
    test: validatePhone,
    page: 1,
  },
  recurringPayment: {
    errMsg: 'Please choose payment method',
    test: validateRequired,
    page: 1,
  },
  bankAccount: {
    errMsg: 'Please provide valid bank account',
    test: validateRequired,
    page: 2,
  },
  consumerNo: {
    errMsg: 'Please provide valid Consumer No.',
    test: validateWholeNum,
    page: 2,
  },
  settlementMode: {
    errMsg: 'Please choose settlement mode',
    test: validateRequired,
    page: 2,
  },
};

const initialState = {
  companyName: '',
  phoneNumber: '',
  recurringPayment: '',
  bankAccount: '',
  consumerNo: '',
  settlementMode: '',
  uptoLimit: '',
};

export const Phone = () => {
  const classes = useStyles();
  const { changeSubView } = useContext(AppContext);
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [state, setState] = useState(initialState);
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState({
    vendor: false,
    recurringPayment: false,
    bankAccount: false,
  });
  const [verificationDialog, setVerificationDialog] = useState(false);

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value = ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    setState((s) => ({ ...s, [name]: value }));
  };

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };

  const handleBottomSheet = (name, data) => {
    setDrawer((d) => ({ ...d, [name]: false }));
    if (data) setState((s) => ({ ...s, [name]: data }));
    if (state[name] && !data) return;
    reValidate({ target: { name, value: data } });
  };

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(state[v]);
      return a;
    }, {});
  };

  const onProceedDialog = () => {
    setVerificationDialog(false);
    setPage(PageCount);
  };

  const onPageNext = () => {
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
    if (page === PageCount - 1) {
      if (state.settlementMode?.id === 'Automatic') {
        setVerificationDialog(true);
        return;
      }
    }
    if (page < PageCount) setPage((p) => p + 1);
  };

  const onPagePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  useEffect(() => {
    // TODO: Fetch Bank Details here once API is available
  }, []);

  return (
    <div className={css.rentContainer}>
      <div className={css.headerContainer}>
        <div className={css.headerLabel}>
          {/* {view === VIEW.MAIN && 'Record an Expense'}
          {view === VIEW.VENDOR && 'Add New Vendor'}
          {view === VIEW.DONE && 'Expense Saved'} */}
          Setup Your Phone Bill
        </div>
        <span className={css.headerUnderline} />
      </div>
      <div className={css.inputContainer}>
        {page === 1 && (
          <>
            <Input
              name="companyName"
              onBlur={reValidate}
              error={validationErr.companyName}
              helperText={
                validationErr.companyName ? VALIDATION?.companyName?.errMsg : ''
              }
              className={`${css.greyBorder} ${classes.root}`}
              label="Company Name"
              variant="standard"
              value={state.companyName}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange}
              theme="light"
            />
            <Input
              name="phoneNumber"
              onBlur={reValidate}
              error={validationErr.phoneNumber}
              helperText={
                validationErr.phoneNumber ? VALIDATION?.phoneNumber?.errMsg : ''
              }
              className={`${css.greyBorder} ${classes.root}`}
              label="Phone Number"
              variant="standard"
              value={state.phoneNumber}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                type: 'tel',
              }}
              fullWidth
              onChange={onInputChange}
              theme="light"
            />
            <SelectBottomSheet
              name="recurringPayment"
              onBlur={reValidate}
              error={validationErr.recurringPayment}
              helperText={
                validationErr.recurringPayment
                  ? VALIDATION?.recurringPayment?.errMsg
                  : ''
              }
              label="Recurring Payment"
              open={drawer.recurringPayment}
              value={state.recurringPayment?.label}
              onTrigger={onTriggerDrawer}
              onClose={handleBottomSheet}
            >
              {recurringPayment.map((ps) => (
                <div
                  key={ps.id}
                  className={css.categoryOptions}
                  onClick={() => handleBottomSheet('recurringPayment', ps)}
                  role="menuitem"
                >
                  {ps.label}
                </div>
              ))}
            </SelectBottomSheet>
          </>
        )}
        {page === 2 && (
          <>
            <SelectBottomSheet
              name="bankAccount"
              onBlur={reValidate}
              error={validationErr.bankAccount}
              helperText={
                validationErr.bankAccount ? VALIDATION?.bankAccount?.errMsg : ''
              }
              label="Bank Account"
              open={drawer.bankAccount}
              value={state.bankAccount?.label}
              onTrigger={onTriggerDrawer}
              onClose={handleBottomSheet}
            >
              {bankAccount.map((ps) => (
                <div
                  key={ps.id}
                  className={css.categoryOptions}
                  onClick={() => handleBottomSheet('bankAccount', ps)}
                  role="menuitem"
                >
                  {ps.label}
                </div>
              ))}
            </SelectBottomSheet>
            <Input
              name="consumerNo"
              onBlur={reValidate}
              error={validationErr.consumerNo}
              helperText={
                validationErr.consumerNo ? VALIDATION?.consumerNo?.errMsg : ''
              }
              className={`${css.greyBorder} ${classes.root}`}
              label="Consumer No"
              variant="standard"
              value={state.consumerNo}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                type: 'tel',
              }}
              fullWidth
              onChange={onInputChange}
              theme="light"
            />
            <SelectBottomSheet
              name="settlementMode"
              onBlur={reValidate}
              error={validationErr.settlementMode}
              helperText={
                validationErr.settlementMode
                  ? VALIDATION?.settlementMode?.errMsg
                  : ''
              }
              label="Settlement Mode"
              open={drawer.settlementMode}
              value={state.settlementMode?.label}
              onTrigger={onTriggerDrawer}
              onClose={handleBottomSheet}
            >
              {settlementMode.map((ps) => (
                <div
                  key={ps.id}
                  className={css.categoryOptions}
                  onClick={() => handleBottomSheet('settlementMode', ps)}
                  role="menuitem"
                >
                  {ps.label}
                </div>
              ))}
            </SelectBottomSheet>
            {state.settlementMode.id === 'Automatic' && (
              <Input
                name="uptoLimit"
                onBlur={reValidate}
                error={validationErr.uptoLimit}
                helperText={
                  validationErr.uptoLimit ? VALIDATION?.uptoLimit?.errMsg : ''
                }
                className={`${css.greyBorder} ${classes.root}`}
                label="Upto Limit"
                variant="standard"
                value={state.uptoLimit}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  type: 'tel',
                }}
                fullWidth
                onChange={onInputChange}
                theme="light"
              />
            )}
          </>
        )}
        {page === PageCount && (
          <SuccessView
            title="Subscription Created"
            description="Your Phone Bill has been recorded"
            btnTitle="Visit Payment"
            onClick={() => {
              changeSubView('billbookView');
            }}
          />
        )}
      </div>
      {page !== PageCount && (
        <div className={css.actionContainer}>
          {page === 1 ? (
            <div />
          ) : (
            <Button
              variant="outlined"
              className={css.outlineButton}
              onClick={() => onPagePrev()}
              size="medium"
            >
              Back
            </Button>
          )}
          <Button
            onClick={() => onPageNext()}
            size="medium"
            className={css.submitButton}
          >
            {page === PageCount - 1 ? 'Add' : 'Next'}
          </Button>
        </div>
      )}
      <VerificationDialog open={verificationDialog} onSave={onProceedDialog} />
    </div>
  );
};
