/* eslint-disable react/jsx-boolean-value */
/* @flow */
/**
 * @fileoverview  Create Product Dialog Container
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  GetSingleItemsDetailsState,
  ClearStateSingleItemsDetails,
  GetItemsProductsListState,
  GetItemsServicesListState,
} from '@action/Store/Reducers/Invoice/InvoiceState';
import { makeStyles } from '@material-ui/core/styles';
import * as Mui from '@mui/material';
import Input, { AmountFormatCustom } from '@components/Input/Input.jsx';
import AutoCompleteAsync from '@components/AutoComplete/AutoCompleteAsync.jsx';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
// import AppContext from '@root/AppContext.jsx';
import AutoComplete from '@components/AutoComplete/AutoComplete.jsx';
import { validateRequired } from '@services/Validation.jsx';
import * as css from '@core/InvoiceView/CreateInvoiceContainer.scss';

const PRODUCT_TYPE = 'products';
const SERVICE_TYPE = 'services';

// CSV
const UNITS = [
  { payload: 'BAG', text: 'BAGS' },
  { payload: 'BAL', text: 'BALE' },
  { payload: 'BDL', text: 'BUNDLES' },
  { payload: 'BGS', text: 'BAGS' },
  { payload: 'BKL', text: 'BUCKLES' },
  { payload: 'BND', text: 'BUNDLES' },
  { payload: 'BOU', text: 'BILLION OF UNITS' },
  { payload: 'BOX', text: 'BOX' },
  { payload: 'BTL', text: 'BOTTLES' },
  { payload: 'BUN', text: 'BUNCHES' },
  { payload: 'CAN', text: 'CANS' },
  { payload: 'CBM', text: 'CUBIC METERS' },
  { payload: 'CCM', text: 'CUBIC CENTIMETERS' },
  { payload: 'CMS', text: 'CENTIMETERS' },
  { payload: 'CMT', text: 'CUBIC METERS' },
  { payload: 'CTN', text: 'CARTONS' },
  { payload: 'DOZ', text: 'DOZENS' },
  { payload: 'DRM', text: 'DRUMS' },
  { payload: 'DZN', text: 'DOZENS' },
  { payload: 'GGK', text: 'GREAT GROSS' },
  { payload: 'GMS', text: 'GRAMMES' },
  { payload: 'GRS', text: 'GROSS' },
  { payload: 'GYD', text: 'GROSS YARDS' },
  { payload: 'KGS', text: 'KILOGRAMS' },
  { payload: 'KLR', text: 'KILOLITRE' },
  { payload: 'KME', text: 'KILOMETRE' },
  { payload: 'KMS', text: 'KILO METERS' },
  { payload: 'LTR', text: 'LITRES' },
  { payload: 'MLS', text: 'MILLI LITRES' },
  { payload: 'MLT', text: 'MILILITRE' },
  { payload: 'MTR', text: 'METERS' },
  { payload: 'MTS', text: 'METRIC TON' },
  { payload: 'NOS', text: 'NUMBERS' },
  { payload: 'OTH', text: 'OTHERS' },
  { payload: 'PAC', text: 'PACKS' },
  { payload: 'PAR', text: 'PAIRS' },
  { payload: 'PCS', text: 'PIECES' },
  { payload: 'PRS', text: 'PAIRS' },
  { payload: 'QTL', text: 'QUINTAL' },
  { payload: 'QTS', text: 'QUINTALS' },
  { payload: 'ROL', text: 'ROLLS' },
  { payload: 'SET', text: 'SETS' },
  { payload: 'SFT', text: 'SQUARE FEET' },
  { payload: 'SMT', text: 'SQUARE METERS' },
  { payload: 'SNO', text: 'THOUSAND NUMBERS/UNITS' },
  { payload: 'SQF', text: 'SQUARE FEET' },
  { payload: 'SQM', text: 'SQUARE METERS' },
  { payload: 'SQY', text: 'SQUARE YARDS' },
  { payload: 'TBS', text: 'TABLETS' },
  { payload: 'TGM', text: 'TEN GROSS' },
  { payload: 'THD', text: 'THOUSANDS' },
  { payload: 'TON', text: 'TONNES' },
  { payload: 'TUB', text: 'TUBES' },
  { payload: 'UGS', text: 'US GALLONS' },
  { payload: 'UNT', text: 'UNITS' },
  { payload: 'YDS', text: 'YARDS' },
  { payload: 'none', text: 'NONE' },
];

const QuantityCustom = React.forwardRef(function QuantityCustom(props) {
  const { ...other } = props;
  return <AmountFormatCustom {...other} decimalScale={3} />;
});

const PriceCustom = React.forwardRef(function PriceCustom(props) {
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

const ValidationErrMsg = {
  productName: 'Please provide valid name',
  hsnCode: 'Please choose the Code',
  unit: 'Please fill the unit',
  desc: 'Please fill the desription',
  price: 'Please fill the Price',
  quantity: 'Please fill the Quantity',
};

const initialValidationErr = {
  productName: false,
  hsnCode: false,
  unit: false,
  desc: false,
  price: false,
  quantity: false,
};

const useStyles = makeStyles(() => ({
  root: {
    border: '1px solid #A0A4AF !important',
  },
}));

const CreateProductService = ({
  onCancel,
  onSubmit,
  handleBottomSheet,
  drawerName,
  selectedTab,
  updatedItem,
  fromSheet,
}) => {
  // const {  user } = React.useContext(AppContext);
  const [productName, setProductName] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [unit, setUnit] = useState();
  const [inputValue, setInputValue] = React.useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState(1);
  const [formattedPrice, setFormattedPrice] = useState();
  const [quantity, setQuantity] = useState(1);
  const [formattedQuantity, setFormattedQuantity] = useState();
  const [itemType, setItemType] = useState(selectedTab);
  const [productCode, setProductCode] = useState(null);
  const [serviceCode, setServiceCode] = useState(null);
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const theme = Mui.useTheme();
  const desktopView = Mui.useMediaQuery(theme.breakpoints.up('sm'));

  const VALIDATOR = {
    productName: (v) => validateRequired(v),
    hsnCode: () => true,
    unit: () => true,
    desc: (v) => validateRequired(v),
    price: (v) => validateRequired(v),
    quantity: (v) => validateRequired(v),
  };

  const dispatch = useDispatch();
  const { selectedEditItem, HSNSACItemsList } = useSelector(
    (value) => value.Invoice,
  );

  const validateAllFields = () => {
    return {
      productName: !VALIDATOR?.productName?.(productName),
      hsnCode: !VALIDATOR?.hsnCode?.(hsnCode),
      // unit: !VALIDATOR?.unit?.(unit),
      price: !VALIDATOR?.price?.(price),
      quantity: !VALIDATOR?.quantity?.(quantity),
      desc: !VALIDATOR?.desc?.(desc),
    };
  };

  const reValidate = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setValidationErr((s) => ({ ...s, [name]: !VALIDATOR?.[name]?.(value) }));
  };

  const handleProductCodeSelect = (options, value) => {
    setProductCode(value);
    setHsnCode(value?.id ? value?.id : null);
  };

  const handleServiceCodeSelect = (options, value) => {
    setServiceCode(value);
    setHsnCode(value?.id ? value?.id : null);
  };

  const handleUnit = (options, value) => {
    if (value) {
      setUnit(value.text ? value.text : value);
      setInputValue(value.text ? value.text : value);
    } else {
      setUnit('');
    }
  };

  React.useEffect(() => {
    return () => {
      dispatch(ClearStateSingleItemsDetails());
    };
  }, []);

  React.useEffect(() => {
    if (Object?.keys(selectedEditItem || {})?.length > 0) {
      const tempUni = UNITS?.find(
        (val) => val?.text === selectedEditItem?.unit_of_measurement,
      );
      if (tempUni) {
        handleUnit('', tempUni);
      } else {
        handleUnit('', selectedEditItem?.unit_of_measurement);
      }
      setProductName(selectedEditItem?.name);
      setQuantity(selectedEditItem?.default_quantity);
      setFormattedQuantity(selectedEditItem?.default_quantity);
      setPrice(selectedEditItem?.default_rate);
      setFormattedPrice(selectedEditItem?.default_rate);
      setDesc(selectedEditItem?.default_description);
      if (selectedEditItem?.item_type === 'products') {
        setItemType(PRODUCT_TYPE);
        const temp = HSNSACItemsList?.productList?.data?.find(
          (val) => val?.id === selectedEditItem?.hsn_or_sac_code,
        );
        if (temp) {
          handleProductCodeSelect(HSNSACItemsList?.productList?.data, temp);
        }
      }
      if (selectedEditItem?.item_type === 'services') {
        setItemType(SERVICE_TYPE);
        const temp = HSNSACItemsList?.serviceList?.data?.find(
          (val) => val?.id === selectedEditItem?.hsn_or_sac_code,
        );
        if (temp) {
          handleServiceCodeSelect(HSNSACItemsList?.serviceList?.data, temp);
        }
      }
    }

    if (Object.keys(HSNSACItemsList || {})?.length === 0) {
      dispatch(GetItemsProductsListState());
      dispatch(GetItemsServicesListState());
    }
  }, [JSON.stringify(selectedEditItem), JSON.stringify(HSNSACItemsList)]);

  React.useEffect(() => {
    if (updatedItem) {
      dispatch(GetSingleItemsDetailsState({ updateItemId: updatedItem }));
    }
  }, [updatedItem]);

  const onInputChange = (setter, setter2) => (e) => {
    reValidate(e);
    setter(e.target.value);
    if (setter2) setter2(e.target.formattedValue);
    if (e.target.name === 'unit') {
      setter(UNITS.filter((j) => j.text === e.target.value)[0].payload);
    }
  };

  const onCreateProduct = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return false;
    }
    onSubmit({
      item_id: updatedItem || undefined,
      itemType,
      productName,
      hsnCode,
      desc,
      unit,
      price,
      quantity,
      from:
        (fromSheet && fromSheet?.name === 'modify' && fromSheet) || undefined,
    });
    return true;
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
      <div
        className={css.addCustomerContainer}
        style={{ padding: updatedItem ? 0 : '0 25px 25px' }}
      >
        <Grid container spacing={3}>
          {!updatedItem && (
            <Grid item xs={12}>
              <div className={`${css.productSelection} ${css.itemSelection}`}>
                <Button
                  className={
                    itemType === PRODUCT_TYPE ? css.selectedBtn : css.btn
                  }
                  variant="text"
                  onClick={() => {
                    setItemType(PRODUCT_TYPE);
                  }}
                >
                  Product
                </Button>
                <Button
                  className={
                    itemType === SERVICE_TYPE ? css.selectedBtn : css.btn
                  }
                  variant="text"
                  onClick={() => {
                    setItemType(SERVICE_TYPE);
                  }}
                >
                  Service
                </Button>
              </div>
            </Grid>
          )}
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
              value={productName}
              onChange={onInputChange(setProductName)}
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            {itemType === PRODUCT_TYPE && (
              <AutoCompleteAsync
                label="HSN CODE"
                onBlur={reValidate}
                getOptionSelected={(option, value) => option.id === value.id}
                getOptionLabel={(option) =>
                  `${option.hsn_or_sac_code} ${option.description}`
                }
                value={productCode}
                // promiseCall={fetchProductCodes}
                onChange={handleProductCodeSelect}
                error={validationErr.hsnCode}
                helperText={
                  validationErr.hsnCode ? ValidationErrMsg.hsnCode : ''
                }
                rootStyle={{
                  border: '1px solid #A0A4AF',
                }}
                valueList={HSNSACItemsList?.productList?.data || []}
              />
            )}

            {itemType === SERVICE_TYPE && (
              <AutoCompleteAsync
                label="SAC CODE"
                onBlur={reValidate}
                getOptionSelected={(option, value) => option.id === value.id}
                getOptionLabel={(option) =>
                  `${option.hsn_or_sac_code} ${option.description}`
                }
                value={serviceCode}
                // promiseCall={fetchServiceCodes}
                onChange={handleServiceCodeSelect}
                error={validationErr.hsnCode}
                helperText={
                  validationErr.hsnCode ? ValidationErrMsg.hsnCode : ''
                }
                rootStyle={{
                  border: '1px solid #A0A4AF',
                }}
                classes={{
                  root: classes.radioGroupRoot,
                }}
                className={classes.root}
                valueList={HSNSACItemsList?.serviceList?.data || []}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            {unit === undefined && (
              <AutoComplete
                // key={customerId}
                // initialOpen
                label="UNIT OF MEASUREMENT"
                getOptionSelected={(opt, value) => {
                  return opt.text === value;
                }}
                getOptionLabel={(option) =>
                  option.text ? `${option.text}` : `${option}`
                }
                value={unit}
                inputValue={inputValue}
                // value={{ payload: 'BOU', text: 'BILLION OF UNITS' }}
                onChange={handleUnit}
                onInputChange={handleUnit}
                options={UNITS}
                freeSolo
                autoSelect
              />
            )}
            {inputValue && (
              <AutoComplete
                label="UNIT OF MEASUREMENT"
                getOptionSelected={(opt, value) => {
                  console.log('selec', opt, value);
                  return opt.text === value;
                }}
                getOptionLabel={(option) =>
                  option.text ? `${option.text}` : `${option}`
                }
                value={unit}
                inputValue={inputValue}
                onChange={handleUnit}
                onInputChange={handleUnit}
                options={UNITS}
                freeSolo
                autoSelect
              />
            )}
          </Grid>
          <Grid item xs={6}>
            <Input
              name="quantity"
              onBlur={reValidate}
              error={validationErr.quantity}
              helperText={
                validationErr.quantity ? ValidationErrMsg.quantity : ''
              }
              label="Quantity"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              // type="number"
              InputProps={{
                inputComponent: QuantityCustom,
              }}
              onChange={onInputChange(setQuantity, setFormattedQuantity)}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              required
              placeholder="0.000"
              value={Number(quantity) === 0 ? '' : formattedQuantity}
            />
          </Grid>

          <Grid item xs={6}>
            <Input
              name="price"
              onBlur={reValidate}
              error={validationErr.price}
              helperText={validationErr.price ? ValidationErrMsg.price : ''}
              label="Price"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputComponent: PriceCustom,
              }}
              value={Number(price) === 0 ? '' : formattedPrice}
              fullWidth
              onChange={onInputChange(setPrice, setFormattedPrice)}
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              required
              placeholder="0.000"
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              name="desc"
              onBlur={reValidate}
              error={validationErr.desc}
              helperText={validationErr.desc ? ValidationErrMsg.desc : ''}
              label="DESCRIPTION"
              variant="standard"
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={desc}
              onChange={onInputChange(setDesc)}
              theme="light"
              multiline
              rows={5}
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              required
            />
          </Grid>
          <Grid item xs={12} className={css.extraNoteGrid}>
            <p className={css.extraNote}>
              <b>Note:</b> Use &#60;Current_Month&#62; or
              &#60;Previous_Month&#62; to select the month for which you will be
              billing your customer.
            </p>
          </Grid>

          <Grid item xs={12}>
            <div
              className={
                desktopView
                  ? `${css.addCustomerFooter} ${css.addProductFooter}`
                  : `${css.addCustomerFooter}`
              }
            >
              <Button
                variant="outlined"
                className={css.secondary}
                onClick={() => {
                  resetErrors();
                  if (!updatedItem) {
                    handleBottomSheet(drawerName);
                  }
                  if (updatedItem) {
                    handleBottomSheet('editEntireDrawer');
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className={css.primary}
                onClick={() => {
                  const isValid = onCreateProduct();
                  if (isValid && !updatedItem) {
                    handleBottomSheet(drawerName);
                  }
                  if (isValid && updatedItem) {
                    handleBottomSheet('editEntireDrawer');
                  }
                }}
              >
                {itemType === PRODUCT_TYPE
                  ? (!updatedItem && 'Create Product') ||
                    'Update Details and Add'
                  : (!updatedItem && 'Create Service') ||
                    'Update Details and Add'}
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  };

  return bodyContent(onCreateProduct, onCancelDialog);
};

export default CreateProductService;
