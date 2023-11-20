// Depricated - Use UploadYourBillContainer component handles recording expense with or without bill upload

/* @flow */
/**
 * @fileoverview  Create Edit Invoice Container
 */

import React, { useState, useContext, useEffect } from 'react';

import Input from '@components/Input/Input.jsx';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import Button from '@material-ui/core/Button';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { DirectUpload } from '@rails/activestorage';
// import DialogContainer from '@components/DialogContainer/DialogContainer.jsx';

import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';

// import Util from '@services/Util.jsx';
import AppContext from '@root/AppContext.jsx';
import { makeStyles } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import {
  validatePrice,
  validateOnlyText,
  validateRequired,
  validateLength,
  validateInvoice,
} from '@services/Validation.jsx';
import { toInr } from '@services/Utils.js';

import moment from 'moment';
import ExpenseCategoryList from './shared/ExpenseCategoryList';
import * as css from './RecordAnExpenseNew.scss';
import AddNewVendor from './shared/AddVendor';
import VendorList from './shared/VendorList';
import SuccessView from './shared/SuccessView';
import { MuiDatePicker } from '../../components/DatePicker/DatePicker';

const useStyles = makeStyles(() => ({
  root: {
    background: themes.colorInputBG,
    // border: '0.7px solid',
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

export const paymentStatusList = [
  { id: 'company_cash', label: 'Paid with Company Cash' },
  { id: 'company_card', label: 'Paid with Company Card' },
  { id: 'personal', label: 'Paid Personally' },
];

const VALIDATION = {
  amount: {
    errMsg: 'Please provide valid amount',
    test: validatePrice,
  },
  invoiceNo: {
    errMsg: 'Please provide valid invoice no',
    test: validateInvoice,
  },
  date: {
    errMsg: 'Please provide valid date',
    test: validateRequired,
  },
  expenseCategory: {
    errMsg: 'Choose expense category',
    test: (v) => validateRequired(v?.name),
  },
  description: {
    errMsg: 'Please provide description',
    test: (v) => validateLength(v, 1, 100),
  },
  location: {
    errMsg: 'Please provide valid location',
    test: (v) => validateOnlyText(v),
  },
  paymentStatus: {
    errMsg: 'Please choose Payment Status',
    test: (v) => validateRequired(v?.label),
  },
  vendor: {
    errMsg: 'Please choose Vendor',
    test: (v) => validateRequired(v?.name),
  },
};

const initialState = {
  amount: '',
  invoiceNo: '',
  date: moment().format('YYYY-MM-DD'),
  expenseCategory: '',
  description: '',
  location: '',
  paymentStatus: '',
  vendor: '',
};

const VIEW = {
  MAIN: 'main',
  VENDOR: 'vendor',
  DONE: 'done',
};

const RecordAnExpense = () => {
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const classes = useStyles();
  const { organization, enableLoading, user, openSnackBar } =
    useContext(AppContext);
  const [expenseCategoryList, setExpenseCategoryList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [orgLocationId, setOrgLocationId] = useState('');
  const [state, setState] = useState(initialState);
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [drawer, setDrawer] = useState({
    expenseCategory: false,
    paymentStatus: false,
    vendor: false,
  });
  const [filename, setFilename] = useState('');
  const [view, setView] = useState(VIEW.MAIN);
  // const [showDrawer, setShowDrawer] = useState(false);

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

  const getExpenseCategory = async () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/expense_categories`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          setExpenseCategoryList(res.data);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const getVendor = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/vendors`, {
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

  const fetchOrgLocation = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/locations`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error && res.data) {
          if (!orgLocationId && res.data.length > 0) {
            setOrgLocationId(res.data[0].id);
          }
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const validateAllFields = () => {
    return Object.keys(VALIDATION).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !VALIDATION?.[v]?.test(state[v]);
      return a;
    }, {});
  };

  const onFileUpload = (e) => {
    const file = e?.target?.files?.[0];
    const url = `${BASE_URL}/direct_uploads`;
    const upload = new DirectUpload(file, url);
    enableLoading(true);
    upload
      .create((error, blob) => {
        enableLoading(false);
        if (error) {
          openSnackBar(Object.values(error).join(','));
        } else {
          const id = blob?.signed_id;
          const name = blob?.filename;
          setFilename(name);
          setState((s) => ({ ...s, file: id }));
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const onAddAnotherBill = () => {
    setState(initialState);
    setView(VIEW.MAIN);
    setFilename('');
  };

  const onRecordBill = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/vendor_bills`, {
      method: METHOD.POST,
      payload: {
        amount: state.amount,
        document_date: state.date,
        document_number: state.invoiceNo,
        description: state.description,
        expense_account_id: state.expenseCategory?.id,
        // "payment_source_id": state.amount,
        // "party_location_id": state.amount,
        payment_mode: state.paymentStatus?.id,
        vendor_id: state.vendor?.id,
        file: state.file,
        status: 'accounted',
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          setView(VIEW.DONE);
        } else {
          const errorValues = Object.values(res.errors);
          openSnackBar({ message: errorValues.join(', '), type: 'error' });
        }
      })
      .catch(() => {
        openSnackBar({ message: 'Unknown error occured' });
      });
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

  const onCloseVendor = (vendor) => {
    setState((s) => ({ ...s, vendor }));
    setDrawer((d) => ({ ...d, vendor: false }));
    setView(VIEW.MAIN);
  };

  useEffect(() => {
    getExpenseCategory();
    getVendor();
    fetchOrgLocation();
  }, []);

  useEffect(() => {
    getExpenseCategory();
  }, [state.expenseCategory]);

  useEffect(() => {
    getVendor();
  }, [state.vendor]);

  return (
    <div className={css.recordAnExpenseContainer}>
      <div className={css.headerContainer}>
        <div className={css.headerLabel}>
          {view === VIEW.MAIN && 'Record an Expense'}
          {view === VIEW.VENDOR && 'Add New Vendor'}
          {view === VIEW.DONE && 'Expense Saved'}
        </div>
        <span className={css.headerUnderline} />
      </div>
      {view === VIEW.MAIN && (
        <div className={css.inputContainer}>
          <Input
            name="amount"
            onBlur={reValidate}
            error={validationErr.amount}
            helperText={validationErr.amount ? VALIDATION?.amount?.errMsg : ''}
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

          <Input
            name="invoiceNo"
            onBlur={reValidate}
            error={validationErr.invoiceNo}
            helperText={
              validationErr.invoiceNo ? VALIDATION?.invoiceNo?.errMsg : ''
            }
            className={`${css.greyBorder} ${classes.root}`}
            label="Invoice No"
            variant="standard"
            value={state.invoiceNo}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            onChange={onInputChange}
            theme="light"
          />

          <MuiDatePicker
            className={`${css.greyBorder} ${classes.root}`}
            selectedDate={state.date}
            label="Date"
            onChange={(m) => {
              const value = m.format('YYYY-MM-DD');
              const name = 'date';
              onInputChange({ target: { name, value } });
            }}
          />

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
            value={state.expenseCategory?.name}
            onTrigger={onTriggerDrawer}
            onClose={handleBottomSheet}
            // maxHeight="45vh"
          >
            <ExpenseCategoryList
              expenseCategoryList={expenseCategoryList}
              onClick={(ps) => handleBottomSheet('expenseCategory', ps)}
              hasTDSCategory={false}
            />
          </SelectBottomSheet>

          <Input
            name="description"
            onBlur={reValidate}
            error={validationErr.description}
            helperText={
              validationErr.description ? VALIDATION?.description?.errMsg : ''
            }
            label="Description"
            placeholder="what's this for"
            variant="standard"
            className={`${css.greyBorder} ${classes.root}`}
            value={state.description}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            onChange={onInputChange}
            theme="light"
            multiline
            rows={4}
          />

          <Input
            name="location"
            onBlur={reValidate}
            error={validationErr.location}
            helperText={
              validationErr.location ? VALIDATION?.location?.errMsg : ''
            }
            label="Location"
            variant="standard"
            className={`${css.greyBorder} ${classes.root}`}
            value={state.location}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            onChange={onInputChange}
            theme="light"
          />

          <SelectBottomSheet
            name="paymentStatus"
            onBlur={reValidate}
            error={validationErr.paymentStatus}
            helperText={
              validationErr.paymentStatus
                ? VALIDATION?.paymentStatus?.errMsg
                : ''
            }
            label="Payment Status"
            open={drawer.paymentStatus}
            value={state.paymentStatus?.label}
            onTrigger={onTriggerDrawer}
            onClose={handleBottomSheet}
          >
            {paymentStatusList.map((ps) => (
              <div
                className={css.categoryOptions}
                onClick={() => handleBottomSheet('paymentStatus', ps)}
                key={ps.id}
                role="menuitem"
              >
                {ps.label}
              </div>
            ))}
          </SelectBottomSheet>

          <SelectBottomSheet
            name="vendor"
            onBlur={reValidate}
            error={validationErr.vendor}
            helperText={validationErr.vendor ? VALIDATION?.vendor?.errMsg : ''}
            label="Vendor"
            open={drawer.vendor}
            value={state.vendor?.name}
            onTrigger={onTriggerDrawer}
            onClose={handleBottomSheet}
          >
            <VendorList
              vendorList={vendorList}
              onClick={(ps) => handleBottomSheet('vendor', ps)}
              addNewVendor={() => setView(VIEW.VENDOR)}
            />
          </SelectBottomSheet>

          <div className={css.uploadContainer}>
            <label htmlFor="upload">
              <input
                id="upload"
                name="avatar"
                type="file"
                accept="image/png, image/jpeg, application/pdf"
                onChange={onFileUpload}
              />
            </label>
            <div className={css.label}>{filename || 'Upload Bill'}</div>
            <CloudUpload className={css.icon} />
          </div>

          <div className={css.actionContainer}>
            <Button
              variant="outlined"
              className={`${css.outlineButton} ${css.fontSize12}`}
              onClick={onRecordBill}
              size="medium"
            >
              Add Another Bill
            </Button>
            <Button
              variant="contained"
              className={css.submitButton}
              onClick={onRecordBill}
              size="medium"
            >
              Record Bill
            </Button>
          </div>
        </div>
      )}
      {view === VIEW.VENDOR && <AddNewVendor onCloseVendor={onCloseVendor} />}
      {view === VIEW.DONE && (
        <SuccessView
          title="Done"
          description={`Your bill of Rs. ${toInr(
            state.amount,
          )} has been recorded`}
          onClick={onAddAnotherBill}
        />
      )}
    </div>
  );
};

export default RecordAnExpense;
