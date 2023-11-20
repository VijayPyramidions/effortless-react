/* @flow */
/**
 * @fileoverview  Create Product Dialog Container
 */

import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import DialogContainer from '@components/DialogContainer/DialogContainer.jsx';
import Input from '@components/Input/Input.jsx';
import AutoCompleteAsync from '@components/AutoComplete/AutoCompleteAsync.jsx';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import Select from '@components/Select/Select.jsx';
import { validateName, validateRequired } from '@services/Validation.jsx';

import * as css from '@core/InvoiceView/CreateInvoiceContainer.scss';

const PRODUCT_TYPE = 'products';
const SERVICE_TYPE = 'services';

const UNITS = [
  {
    payload: 'rupees',
    text: 'Rupees',
  },
  {
    payload: 'usd',
    text: 'USD',
  },
];

const VALIDATOR = {
  productName: (v) => validateName(v),
  hsnCode: (v) => validateRequired(v),
  unit: (v) => validateRequired(v),
  desc: (v) => validateRequired(v),
};

const ValidationErrMsg = {
  productName: 'Please provide valid name',
  hsnCode: 'Please choose the Code',
  unit: 'Please fill the unit',
  desc: 'Please fill the desription',
};

const initialValidationErr = {
  productName: false,
  hsnCode: false,
  unit: false,
  desc: false,
};

const useStyles = makeStyles(() => ({
  radioGroupRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
}));

const CreateProductDialog = ({
  open,
  onCancel,
  onSubmit,
}: {
  open: boolean,
  onCancel: () => {},
  onSubmit: () => {},
}) => {
  const { user } = useContext(AppContext);
  const [productName, setProductName] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [unit, setUnit] = useState(UNITS[0].payload);
  const [desc, setDesc] = useState('');
  const [itemType, setItemType] = useState(PRODUCT_TYPE);

  const [productCode, setProductCode] = useState(null);
  const [serviceCode, setServiceCode] = useState(null);
  const [validationErr, setValidationErr] = useState(initialValidationErr);

  const validateAllFields = () => {
    return {
      productName: !VALIDATOR?.productName?.(productName),
      hsnCode: !VALIDATOR?.hsnCode?.(hsnCode),
      unit: !VALIDATOR?.unit?.(unit),
    };
  };

  const reValidate = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setValidationErr((s) => ({ ...s, [name]: !VALIDATOR?.[name]?.(value) }));
  };

  const fetchProductCodes = () => {
    return RestApi(`products`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    });
  };

  const handleProductCodeSelect = (options: Array<*>, value: *) => {
    setProductCode(value);
    setHsnCode(value.id);
  };

  const fetchServiceCodes = () => {
    return RestApi(`services`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    });
  };

  const handleServiceCodeSelect = (options: Array<*>, value: *) => {
    setServiceCode(value);
    setHsnCode(value.id);
  };

  const onItemTypeChange = (e) => {
    setItemType(e.target.value);
    setHsnCode('');
  };

  const onInputChange = (setter) => (e) => {
    reValidate(e);
    setter(e.target.value);
  };

  const onCreateProduct = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    onSubmit({
      itemType,
      productName,
      hsnCode,
      desc,
      unit,
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
    const classes = useStyles();
    return (
      <div className={css.addCustomerContainer}>
        <Grid container spacing={3}>
          <Typography className={css.infoTitle}>TYPE</Typography>
          <Grid item xs={12}>
            <RadioGroup
              aria-label="itemType"
              name="itemType"
              value={itemType}
              onChange={onItemTypeChange}
              className={css.itemTypeContainer}
              classes={{
                root: classes.radioGroupRoot,
              }}
            >
              <FormControlLabel
                value={PRODUCT_TYPE}
                control={<Radio />}
                label="Product"
              />
              <FormControlLabel
                value={SERVICE_TYPE}
                control={<Radio />}
                label="Service"
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            <Input
              name="productName"
              onBlur={reValidate}
              error={validationErr.productName}
              helperText={
                validationErr.productName ? ValidationErrMsg.productName : ''
              }
              label="NAME"
              variant="standard"
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange(setProductName)}
              theme="light"
            />
          </Grid>
          <Grid item xs={12}>
            {itemType === PRODUCT_TYPE && (
              <AutoCompleteAsync
                label="HSN CODE"
                getOptionSelected={(option, value) => option.id === value.id}
                getOptionLabel={(option) =>
                  `${option.id} ${option.description}`
                }
                value={productCode}
                promiseCall={fetchProductCodes}
                onChange={handleProductCodeSelect}
                error={validationErr.hsnCode}
                helperText={
                  validationErr.hsnCode ? ValidationErrMsg.hsnCode : ''
                }
              />
            )}

            {itemType === SERVICE_TYPE && (
              <AutoCompleteAsync
                label="SAC CODE"
                getOptionSelected={(option, value) => option.id === value.id}
                getOptionLabel={(option) =>
                  `${option.id} ${option.description}`
                }
                value={serviceCode}
                promiseCall={fetchServiceCodes}
                onChange={handleServiceCodeSelect}
                error={validationErr.hsnCode}
                helperText={
                  validationErr.hsnCode ? ValidationErrMsg.hsnCode : ''
                }
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <Select
              name="unit"
              onBlur={reValidate}
              error={validationErr.unit}
              helperText={validationErr.unit ? ValidationErrMsg.unit : ''}
              label="UNIT OF MEASUREMENT"
              options={UNITS}
              defaultValue={unit}
              onChange={onInputChange(setUnit)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              name="desc"
              label="DESCRIPTION"
              variant="standard"
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onInputChange(setDesc)}
              theme="light"
              multiline
              rows={5}
            />
          </Grid>
        </Grid>
      </div>
    );
  };

  return (
    <DialogContainer
      title="Create Product"
      body={bodyContent()}
      open={open}
      onCancel={onCancelDialog}
      onSubmit={onCreateProduct}
      maxWidth="lg"
    />
  );
};

export default CreateProductDialog;
