/* @flow */
/**
 * @fileoverview  Create Customer Dialog Container
 */

import React, { useState, useEffect } from 'react';

import DialogContainer from '@components/DialogContainer/DialogContainer.jsx';
import Input from '@components/Input/Input.jsx';
import Grid from '@material-ui/core/Grid';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Select from '@components/Select/Select.jsx';
import {
  validatePincode,
  validateAddress,
  validateRequired,
  validateOnlyText,
} from '@services/Validation.jsx';
import * as css from '@core/InvoiceView/CreateInvoiceContainer.scss';

const VALIDATOR = {
  address_line1: (v) => validateAddress(v),
  address_line2: (v) => validateAddress(v),
  pincode: (v) => validatePincode(v),
  city: (v) => validateOnlyText(v),
  state: (v) => validateRequired(v),
};

const ValidationErrMsg = {
  address_line1: 'Please enter valid Address',
  address_line2: 'Please enter valid Address',
  city: 'Please enter valid City',
  pincode: 'Please enter valid Pincode',
  state: 'Please enter valid State',
};

const initialValidationErr = {
  address_line1: false,
  address_line2: false,
  city: false,
  pincode: false,
  state: false,
};

const CreateCustomerLocationDialog = ({
  open,
  onCancel,
  onSubmit,
  errorMessage,
  allStates,
}: {
  open: boolean,
  onCancel: () => {},
  onSubmit: () => {},
  errorMessage: string,
  allStates: Array<{
    payload: string,
    text: string,
  }>,
}) => {
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [custState, setCustState] = useState('');
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

  useEffect(() => {
    setAddr1('');
    setAddr2('');
    setPincode('');
    setCity('');
    setCustState('');
  }, []);

  const validateAllFields = () => {
    return {
      address_line1: !VALIDATOR?.address_line1?.(addr1),
      address_line2: !VALIDATOR?.address_line2?.(addr2),
      pincode: !VALIDATOR?.pincode?.(pincode),
      city: !VALIDATOR?.city?.(city),
      state: !VALIDATOR?.state?.(custState),
    };
  };

  const onCreateCustomerLocation = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    onSubmit({
      addr1,
      addr2,
      pincode,
      city,
      country,
      custState,
    });
  };

  const resetErrors = () => {
    setValidationErr(initialValidationErr);
  };

  const onCancelDialog = () => {
    resetErrors();
    onCancel();
  };

  const bodyContent = () => {
    return (
      <div className={css.addCustomerContainer}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Input
              name="address_line1"
              onBlur={reValidate}
              error={validationErr.address_line1}
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
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              defaultValue={country}
              fullWidth
              onChange={onInputChange(setCountry)}
              theme="light"
              disabled
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

  return (
    <DialogContainer
      title="Add billing address"
      body={bodyContent()}
      open={open}
      onCancel={onCancelDialog}
      onSubmit={onCreateCustomerLocation}
      maxWidth="lg"
    />
  );
};

export default CreateCustomerLocationDialog;
