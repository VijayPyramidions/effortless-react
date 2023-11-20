import React, { useState, useContext, useEffect } from 'react';
import AppContext from '@root/AppContext.jsx';
import Input from '@components/Input/Input.jsx';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import {
  validatePrice,
  validateRequired,
  validateGst,
} from '@services/Validation.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { Button, makeStyles } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import VendorList from '@components/Vendor/VendorList';
import * as css from './Rent.scss';
import SuccessView from '../shared/SuccessView';
import VerificationDialog from '../shared/VerificationDialog';

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
  vendor: {
    errMsg: 'Please provide valid amount',
    test: validateRequired,
    page: 1,
  },
  amount: {
    errMsg: 'Please provide valid amount',
    test: validatePrice,
    page: 1,
  },
  recurringPayment: {
    errMsg: 'Please choose payment method',
    test: validateRequired,
    page: 1,
  },
  bankAccount: {
    errMsg: 'Please choose bank account',
    test: validateRequired,
    page: 2,
  },
  gstin: {
    errMsg: 'Please provide valid GSTIN',
    test: validateGst,
    page: 2,
  },
  tds: {
    errMsg: 'Please provide valid TDS',
    test: validateRequired,
    page: 3,
  },
  settlementMode: {
    errMsg: 'Please choose settlement mode',
    test: validateRequired,
    page: 3,
  },
};

const initialState = {
  vendor: '',
  amount: '',
  recurringPayment: '',
  bankAccount: '',
  gstin: '',
  tds: '',
  settlementMode: '',
  uptoLimit: '',
};

export const Rent = () => {
  const classes = useStyles();
  const { organization, enableLoading, user, changeSubView } =
    useContext(AppContext);
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [state, setState] = useState(initialState);
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [vendorList, setVendorList] = useState([]);
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState({
    vendor: false,
    recurringPayment: false,
  });
  const [verificationDialog, setVerificationDialog] = useState(false);

  const getVendor = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/entities?type[]=vendor`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          setVendorList(res.data);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

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
    setPage(4);
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
    if (page === 3) {
      if (state.settlementMode?.id === 'Automatic') {
        setVerificationDialog(true);
        return;
      }
    }
    if (page < 4) setPage((p) => p + 1);
  };

  const onPagePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  useEffect(() => {
    getVendor();
  }, []);

  useEffect(() => {
    getVendor();
  }, [state.vendor]);

  return (
    <div className={css.rentContainer}>
      <div className={css.headerContainer}>
        <div className={css.headerLabel}>
          {/* {view === VIEW.MAIN && 'Record an Expense'}
          {view === VIEW.VENDOR && 'Add New Vendor'}
          {view === VIEW.DONE && 'Expense Saved'} */}
          Setup Your Rent
        </div>
        <span className={css.headerUnderline} />
      </div>
      <div className={css.inputContainer}>
        {page === 1 && (
          <>
            <SelectBottomSheet
              name="vendor"
              onBlur={reValidate}
              error={validationErr.vendor}
              helperText={
                validationErr.vendor ? VALIDATION?.vendor?.errMsg : ''
              }
              label="Vendor"
              open={drawer.vendor}
              value={state.vendor?.name}
              onTrigger={onTriggerDrawer}
              onClose={handleBottomSheet}
            >
              <VendorList
                vendorList={vendorList}
                onClick={(ps) => handleBottomSheet('vendor', ps)}
                disableAdd
              />
            </SelectBottomSheet>
            <Input
              name="amount"
              onBlur={reValidate}
              error={validationErr.amount}
              helperText={
                validationErr.amount ? VALIDATION?.amount?.errMsg : ''
              }
              className={`${css.greyBorder} ${classes.root}`}
              label="Amount"
              variant="standard"
              value={state.amount}
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
              name="gstin"
              onBlur={reValidate}
              error={validationErr.gstin}
              helperText={validationErr.gstin ? VALIDATION?.gstin?.errMsg : ''}
              className={`${css.greyBorder} ${classes.root}`}
              label="GSTIN"
              variant="standard"
              value={state.gstin}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange}
              theme="light"
            />
          </>
        )}
        {page === 3 && (
          <>
            <Input
              name="tds"
              onBlur={reValidate}
              error={validationErr.tds}
              helperText={validationErr.tds ? VALIDATION?.tds?.errMsg : ''}
              className={`${css.greyBorder} ${classes.root}`}
              label="TDS (%)"
              variant="standard"
              value={state.tds}
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
        {page === 4 && (
          <SuccessView
            title="Subscription Created"
            description="Your Rent Bill has been recorded"
            btnTitle="Visit Payment"
            onClick={() => {
              changeSubView('billbookView');
            }}
          />
        )}
      </div>
      {page !== 4 && (
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
            {page === 3 ? 'Add' : 'Next'}
          </Button>
        </div>
      )}
      <VerificationDialog open={verificationDialog} onSave={onProceedDialog} />
    </div>
  );
};
