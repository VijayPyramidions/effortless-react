import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import axiosInst from '@action/ApiConfig/AxiosInst';

import {
  openSnackbar,
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import { setPaymentBankDrawer } from '@action/Store/Reducers/Payments/MakePaymentState';

import {
  Button,
  FormControlLabel,
  Grid,
  ListItemText,
  Checkbox,
} from '@mui/material';

import Input from '@components/Input/Input';

import { validateIfsc, validateRequired } from '@services/Validation';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import * as css from '../Payments.scss';
import { organizationDetail } from '../../../components/utils';

const VALIDATION = {
  accNum: {
    errMsg: 'Enter valid Account Number',
    test: validateRequired,
  },
  ifsc: {
    errMsg: 'Enter valid IFSC',
    test: validateIfsc,
  },
  holderName: {
    errMsg: 'Enter Account Holder Name',
    test: validateRequired,
  },
  bankName: {
    errMsg: 'Enter valid Bank Name',
    test: validateRequired,
  },
  bankBranch: {
    errMsg: 'Enter valid Bank Branch Name',
    test: validateRequired,
  },
};

const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
  [k]: false,
}));

const PaymentBankReq = () => {
  const device = localStorage.getItem('device_detect');
  const organization = organizationDetail();

  const dispatch = useDispatch();

  const { clickVendorId } = useSelector((state) => state.MakePayment);

  const [checkId, setCheckId] = useState(false);
  const [mainState, setMainState] = useState({
    bankBranch: '',
    bankName: '',
    holderName: '',
    accNum: '',
    ifsc: '',
  });
  const [validationErr, setValidationErr] = useState(initialValidationErr);

  const handleIfscKeyPress = (event) => {
    const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!(/^[a-zA-Z0-9\b]+$/.test(key))) {
       event.preventDefault();
    }
  };

  const paymentBankReg = async () => {
    dispatch(enableLoading(true));

    await axiosInst
      .post(
        `organizations/${organization.orgId}/vendors/${clickVendorId}/bank_details`,
        {
          bank_name: mainState?.bankName,
          bank_branch_name: mainState?.bankBranch,
          bank_account_number: mainState?.accNum,
          bank_ifsc_code: mainState?.ifsc,
          account_holder_name: mainState?.holderName,
        }
      )
      .then((res) => {
        dispatch(enableLoading(false));
        if (res && !res.data?.error) {
          dispatch(
            openSnackbar({
              message: 'Registered Successfully',
              type: MESSAGE_TYPE.INFO,
            })
          );
          dispatch(setPaymentBankDrawer({ value: false }));
        } else {
          dispatch(
            openSnackbar({
              message: res.data?.message || 'Error Occured',
              type: MESSAGE_TYPE.WARNING,
            })
          );
        }
      })
      .catch(() => {
        dispatch(enableLoading(false));
      });
  };

  const validateBankAccount = () => {
    const payload = {
      ifsc: mainState?.ifsc,
      account_number: mainState?.accNum,
      name: mainState?.holderName,
      // mobile: mainState.contactPhone,
      organization_id: organization.orgId,
    };
    axiosInst
      .post(`bank_details_verifications`, {
        ...payload,
      })
      .then((res) => {
        if (res && !res.data?.error && res.data?.verified) {
          dispatch(
            openSnackbar({
              message: 'Verification Successful',
              type: MESSAGE_TYPE.INFO,
            })
          );
        } else {
          dispatch(
            openSnackbar({
              message: res.message || 'Verification Not Successful',
              type: MESSAGE_TYPE.WARNING,
            })
          );
        }
      })
      .catch((e) =>
        dispatch(
          openSnackbar({
            message: e.message || 'Somthing Wrong...!',
            type: MESSAGE_TYPE.ERROR,
          })
        )
      );
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

  const getBankDetails = (code) => {
    dispatch(enableLoading(true));
    axiosInst
      .get(`ifsc?ifsc=${code}`)
      .then((res) => {
        dispatch(enableLoading(false));
        if (res && !res.data?.error) {
          const { BANK: bankName, BRANCH: bankBranch } = res.data;
          setMainState((s) => ({
            ...s,
            bankName,
            bankBranch,
          }));
        }
      })
      .catch(() => {
        dispatch(enableLoading(false));
      });
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    setMainState((s) => ({
      ...s,
      [name]: value,
    }));
    if (name === 'ifsc' && value?.length === 11) {
      getBankDetails(value);
    }
  };

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(mainState[v]);
      return a;
    }, {});
  };

  const submit = () => {
    const sectionValidation = {};
    Object.keys(VALIDATION).forEach((k) => {
      sectionValidation[k] = VALIDATION[k];
    });
    const g = validateAllFields(sectionValidation);
    const valid = Object.values(g).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...g }));
    } else {
      paymentBankReg();
    }
  };

  const submitForBank = (check) => {
    const sectionValidation = {};
    Object.keys(VALIDATION).forEach((k) => {
      sectionValidation[k] = VALIDATION[k];
    });
    const g = validateAllFields(sectionValidation);
    const valid = Object.values(g).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...g }));
    } else if (check) {
      validateBankAccount();
      setCheckId(check);
    } else {
      setCheckId(check);
    }
  };

  return (
    <div
      className={css.effortlessPayment}
      style={{ padding: device === 'mobile' ? '10px' : '15px 85px' }}
    >
      <div>
        <p className={css.title}>Effortless Payments</p>
      </div>
      <div>
        <p className={css.holdOn}>Hold On!</p>
      </div>

      <div>
        <p className={css.para}>
          Bank Account Details for the Vendor you <br /> have selected are
          missing. Please add <br /> them and proceed to payment.
        </p>
      </div>

      <Grid container spacing={3} mt={1}>
        <Grid item xs={12}>
          <Input
            name="accNum"
            label="Account No"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            onBlur={reValidate}
            error={validationErr.accNum}
            helperText={validationErr.accNum ? VALIDATION?.accNum?.errMsg : ''}
            onChange={onInputChange}
            value={mainState?.accNum}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            name="ifsc"
            label="IFSC Code"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            onBlur={reValidate}
            error={validationErr.ifsc}
            helperText={validationErr.ifsc ? VALIDATION?.ifsc?.errMsg : ''}
            onChange={onInputChange}
            onKeyPress={handleIfscKeyPress}
            value={mainState?.ifsc?.toUpperCase()}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            name="holderName"
            label="Account Holder’s Name"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            onBlur={reValidate}
            error={validationErr.holderName}
            helperText={
              validationErr.holderName ? VALIDATION?.holderName?.errMsg : ''
            }
            onChange={onInputChange}
            value={mainState?.holderName}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            name="bankName"
            label="Bank Name"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            onBlur={reValidate}
            error={validationErr.bankName}
            helperText={
              validationErr.bankName ? VALIDATION?.bankName?.errMsg : ''
            }
            onChange={onInputChange}
            value={mainState?.bankName}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            name="bankBranch"
            label="Bank Branch"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            onBlur={reValidate}
            error={validationErr.bankBranch}
            helperText={
              validationErr.bankBranch ? VALIDATION?.bankBranch?.errMsg : ''
            }
            onChange={onInputChange}
            value={mainState?.bankBranch}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checkId}
                onChange={(e) => {
                  submitForBank(e?.target?.checked);
                }}
              />
            }
            label={
              <ListItemText
                primary={<p className={css.topText}>Validate Bank Account</p>}
                secondary={
                  <p className={css.bottomText}>
                    On checking the box, Rs. 1 will be deducted for validation
                    purposes
                  </p>
                }
              />
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Button className={css.primaryButton} onClick={() => submit()}>
            Save Bank Details
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default PaymentBankReq;
