/* @flow */
/**
 * @fileoverview  Create Customer Dialog Container
 */

import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DialogContainer from '@components/DialogContainer/DialogContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import Input from '@components/Input/Input.jsx';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Select from '@components/Select/Select.jsx';
import {
  validateGst,
  validatePincode,
  validatePhone,
  validateEmail,
  validateAddress,
  validateRequired,
} from '@services/Validation.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import AppContext from '@root/AppContext.jsx';
import * as theme from '@root/theme.scss';
import * as css from '@core/InvoiceView/CreateInvoiceContainer.scss';

const VALIDATOR = {
  name: (v) => validateRequired(v),
  gstin: (v) => validateGst(v),
  address_line1: (v) => validateAddress(v),
  address_line2: (v) => validateAddress(v),
  pincode: (v) => validatePincode(v),
  city: (v) => validateRequired(v),
  state: (v) => validateRequired(v),
  contacts_name: (v) => validateRequired(v),
  contacts_mobile_number: (v) => validatePhone(v),
  contacts_email: (v) => validateEmail(v),
};
const ValidationErrMsg = {
  name: 'Enter a valid name',
  gstin: 'Enter valid GST',
  address_line1: 'Enter address 1',
  address_line2: 'Enter address 2',
  pincode: 'Enter valid pin',
  city: 'Enter city name',
  state: 'Choose the state',
  contacts_name: 'Enter a valid name',
  contacts_mobile_number: 'Enter valid mobilenumber',
  contacts_email: 'Enter valid email address',
};
const initialValidationErr = {
  name: false,
  gstin: false,
  address_line1: false,
  address_line2: false,
  pincode: false,
  city: false,
  state: false,
  contacts_name: false,
  contacts_mobile_number: false,
  contacts_email: false,
};

const useStyles = makeStyles(() => ({
  checked: {
    color: theme.colorLinks,
  },
}));

const CreateCustomerDialog = ({
  open,
  onCancel,
  onSubmit,
  errorMessage,
  allStates,
}) => {
  const classes = useStyles();

  const { enableLoading, openSnackBar, user } = useContext(AppContext);

  const [customerName, setCustomerName] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [custState, setCustState] = useState('Tamil Nadu');
  const [individualName, setIndividualName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [autoFillOrgAddr, setAutoFillOrgAddr] = useState(true);
  const [validationErr, setValidationErr] = useState(initialValidationErr);

  const reValidate = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setValidationErr((s) => ({ ...s, [name]: !VALIDATOR?.[name]?.(value) }));
  };

  const onInputChange = (setter) => (e) => {
    reValidate(e);
    setter(e.target.value);
  };

  const validateAllFields = () => {
    return {
      name: !VALIDATOR?.name?.(customerName),
      gstin: !VALIDATOR?.gstin?.(gstNo),
      address_line1: !VALIDATOR?.address_line1?.(addr1),
      address_line2: !VALIDATOR?.address_line2?.(addr2),
      pincode: !VALIDATOR?.pincode?.(pincode),
      city: !VALIDATOR?.city?.(city),
      state: !VALIDATOR?.state?.(custState),
      contacts_name: !VALIDATOR?.contacts_name?.(individualName),
      contacts_mobile_number: !VALIDATOR?.contacts_mobile_number?.(mobileNo),
      contacts_email: !VALIDATOR?.contacts_email?.(email),
    };
  };

  const onCreateCustomer = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    onSubmit({
      customerName,
      gstNo,
      addr1,
      addr2,
      pincode,
      city,
      country,
      custState,
      individualName,
      mobileNo,
      email,
    });
  };

  const getGstAddr = (gstVal) => {
    enableLoading(true);
    RestApi('gstins', {
      method: METHOD.POST,
      payload: {
        gstin: gstVal,
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          setAddr1(res.address_line1);
          setAddr2(res.address_line2);
          setCity(res.city);
          setCountry(res.country);
          setCustState(res.state);
          setPincode(res.pincode);
        }
        enableLoading(false);
      })
      .catch(() => {
        enableLoading(false);
        openSnackBar({
          message: `Incorrect GST or unable to retrieve address`,
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const onGstFill = (e) => {
    reValidate(e);
    if (autoFillOrgAddr) {
      getGstAddr(e.target.value);
    }
  };

  const onCheckBoxChange = (e) => {
    if (e.target.checked) {
      getGstAddr(gstNo);
    }
    setAutoFillOrgAddr(e.target.checked);
  };

  useEffect(() => {
    if (!open) {
      setAddr1('');
      setAddr2('');
      setCity('');
      setCountry('');
      setCustState('');
      setPincode('');
    }
  }, [open]);

  const bodyContent = () => {
    return (
      <div className={css.addCustomerContainer}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Input
              name="name"
              onBlur={reValidate}
              error={validationErr.name}
              helperText={validationErr.name ? ValidationErrMsg.name : ''}
              label="NAME"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange(setCustomerName)}
              theme="light"
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              name="gstin"
              onBlur={onGstFill}
              error={validationErr.gstin}
              helperText={validationErr.gstin ? ValidationErrMsg.gstin : ''}
              label="GSTIN"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange(setGstNo)}
              theme="light"
            />
            <div className={css.supplyContainer}>
              <Checkbox
                checked={autoFillOrgAddr}
                onChange={onCheckBoxChange}
                classes={{ checked: classes.checked }}
              />
              <span>Auto Fill Address</span>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Input
              name="address_line1"
              onBlur={reValidate}
              error={validationErr.address_line1}
              value={addr1}
              helperText={
                validationErr.address_line1
                  ? ValidationErrMsg.address_line1
                  : ''
              }
              label="ADDRESS 1"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange(setAddr1)}
              theme="light"
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              name="address_line2"
              onBlur={reValidate}
              value={addr2}
              error={validationErr.address_line2}
              helperText={
                validationErr.address_line2
                  ? ValidationErrMsg.address_line2
                  : ''
              }
              label="ADDRESS 2"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange(setAddr2)}
              theme="light"
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              name="pincode"
              value={pincode}
              onBlur={reValidate}
              error={validationErr.pincode}
              helperText={validationErr.pincode ? ValidationErrMsg.pincode : ''}
              label="PINCODE"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                type: 'tel',
              }}
              fullWidth
              onChange={onInputChange(setPincode)}
              theme="light"
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              name="city"
              value={city}
              onBlur={reValidate}
              error={validationErr.city}
              helperText={validationErr.city ? ValidationErrMsg.city : ''}
              label="TOWN/CITY"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange(setCity)}
              theme="light"
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              label="COUNTRY"
              value={country}
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              defaultValue={country}
              fullWidth
              onChange={onInputChange(setCountry)}
              theme="light"
              disabled={autoFillOrgAddr}
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              name="state"
              onBlur={reValidate}
              error={validationErr.state}
              helperText={validationErr.state ? ValidationErrMsg.state : ''}
              label="STATE"
              options={allStates}
              defaultValue={custState}
              onChange={onInputChange(setCustState)}
              fullWidth
            />
          </Grid>

          <Typography className={css.infoTitle}>INDIVIDUAL USER</Typography>

          <Grid item xs={12}>
            <Input
              name="contacts_name"
              onBlur={reValidate}
              error={validationErr.contacts_name}
              helperText={
                validationErr.contacts_name
                  ? ValidationErrMsg.contacts_name
                  : ''
              }
              label="NAME"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange(setIndividualName)}
              theme="light"
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              name="contacts_mobile_number"
              onBlur={reValidate}
              error={validationErr.contacts_mobile_number}
              helperText={
                validationErr.contacts_mobile_number
                  ? ValidationErrMsg.contacts_mobile_number
                  : ''
              }
              label="MOBILE NO"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                type: 'tel',
              }}
              fullWidth
              onChange={onInputChange(setMobileNo)}
              theme="light"
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              name="contacts_email"
              onBlur={reValidate}
              error={validationErr.contacts_email}
              helperText={
                validationErr.contacts_email
                  ? ValidationErrMsg.contacts_email
                  : ''
              }
              label="EMAIL"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange(setEmail)}
              theme="light"
            />
          </Grid>
          {errorMessage && (
            <div className={css.errorContainer}>
              <InfoOutlinedIcon fontSize="small" />{' '}
              <span className={css.errorText}>{errorMessage}</span>
            </div>
          )}
        </Grid>
      </div>
    );
  };

  const resetErrors = () => {
    setValidationErr(initialValidationErr);
  };

  const onCancelDialog = () => {
    resetErrors();
    onCancel();
  };

  return (
    <DialogContainer
      title="Add customers"
      body={bodyContent()}
      open={open}
      onCancel={onCancelDialog}
      onSubmit={onCreateCustomer}
      maxWidth="lg"
    />
  );
};

export default CreateCustomerDialog;
