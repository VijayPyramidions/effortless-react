/* eslint-disable react/jsx-boolean-value */

import React, { useState, useEffect } from 'react';
import AppContext from '@root/AppContext.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import CreateProductService from '@core/InvoiceView/CreateProductService';
import * as Mui from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Drawer, styled } from '@material-ui/core';
import Input, { AmountFormatCustom } from '@components/Input/Input.jsx';
import { customCurrency } from '@components/formattedValue/FormattedValue';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { validatePrice, validateRequired } from '@services/Validation.jsx';
import InputAdornment from '@material-ui/core/InputAdornment';
import ReceivablesPopOver from '../Receivables/Components/ReceivablesPopover';
import * as css from './CreateInvoiceContainer.scss';
import SearchProductService from './Shared/SearchProductService';
import { step2 } from './InvoiceImages.js';

const StyledDrawer = styled(Drawer)((props) => ({
  '& .MuiPaper-root': {
    minHeight: props.minHeight,
    maxHeight: '80vh',
    borderRadius: props.borderRadius,
    width: props.width,
    overflow: props.overflow,
  },
}));

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

const VALIDATOR = {
  quantity: (v) => validateRequired(v),
  price: (v) => validateRequired(v) && validatePrice(v),
  percentDiscount: () => true,
  rateDiscount: (v) => validatePrice(v),
  description: (v) => validateRequired(v),
};
const ValidationErrMsg = {
  quantity: 'Entered Value is not valid',
  price: 'Entered Value is not valid',
  percentDiscount: 'Entered Value is not valid',
  rateDiscount: 'Entered Value is not valid',
  description: 'Please enter description',
};
const initialValidationErr = {
  quantity: false,
  price: false,
  percentDiscount: false,
  rateDiscount: false,
  description: false,
};

const SelectProductService = (props) => {
  const {
    ITEM_CATEGORIES,
    itemList,
    setSelectedItems,
    onProductSelect,
    onProductUpdate,
    deleteLineItem,
    lineItems,
    selectedItems,
    onCreateProduct,
    newlyAddedItem,
    taxType,
    noteTypeWithShow,
    currencyType,
    gstAvailable,
  } = props;
  const {
    openSnackBar,
    // loading,
  } = React.useContext(AppContext);
  const [selectedElement, setSelectedElement] = useState();
  const [itemVal, setItem] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [price, setPrice] = useState();
  const [formattedPrice, setFormattedPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [formattedQuantity, setFormattedQuantity] = useState();
  const [percentDiscount, setPercentDiscount] = useState(0);
  const [rateDiscount, setRateDiscount] = useState(0);
  const [formattedRateDiscount, setFormattedRateDiscount] = useState(0);
  const [oldPercentDiscount, setOldPercentDiscount] = useState(0);
  const [oldRateDiscount, setOldRateDiscount] = useState(0);
  const [totalValue, setTotalValue] = useState();
  const [products, setProducts] = useState();
  const [service, setService] = useState(false);
  const [drawer, setDrawer] = useState({
    search: false,
    addProductDrawer: false,
    modifyProductDrawer: false,
    addProductService: false,
    deletePopup: false,
    editEntireDrawer: false,
    fromDrawer: '',
  });
  const [intialProduct, setIntialProduct] = useState();
  const [intialService, setIntialService] = useState();
  const [productsData, setProductData] = useState();
  const [addProduct, setAddProduct] = useState(false);
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [totalButton, setTotalButton] = useState(false);
  const [unitMeasure, setUnitMeasure] = useState();
  const [proSer, setProSer] = useState('products');
  const themes = Mui.useTheme();
  const desktopView = Mui.useMediaQuery(themes.breakpoints.up('sm'));
  let quantityHasChanges;
  // const [quantityHasChanges, setQuantityHasChanges] = useState();

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

  const validateAllFields = () => {
    return {
      percentDiscount: !VALIDATOR?.percentDiscount?.(percentDiscount),
      rateDiscount: !VALIDATOR?.rateDiscount?.(rateDiscount),
      price: !VALIDATOR?.price?.(price),
      description: !VALIDATOR?.description?.(description),
      quantity: !VALIDATOR?.quantity?.(quantity),
    };
  };

  const reValidate = (e) => {
    const reValidateName = e?.target?.name;
    const value = e?.target?.value;
    setValidationErr((s) => ({
      ...s,
      [reValidateName]: !VALIDATOR?.[reValidateName]?.(value),
    }));
  };

  const onInputChange = (setter1, setter2) => (e) => {
    reValidate(e);
    if (setter1 === setPercentDiscount) {
      if (Number(e.target.value) > 100) {
        setter1(100);
      } else {
        setter1(e.target.value);
        if (setter2) setter2(e.target.formattedValue);
      }
    } else {
      setter1(e.target.value);
      if (setter2) setter2(e.target.formattedValue);
    }
  };

  useEffect(() => {
    if (totalValue >= 0) {
      setTotalButton(false);
    } else {
      setTotalButton(true);
    }
  }, [totalValue, quantity, price, percentDiscount, rateDiscount]);

  const quantityPriceFunction = () => {
    if (quantity && price) {
      setTotalValue(
        Number(quantity) * Number(price?.replaceAll(',', '')) -
          Number(rateDiscount),
      );
    }
    if (!formattedQuantity) setFormattedQuantity(quantity);
    if (!formattedPrice) setFormattedPrice(price);
  };

  useEffect(() => {
    setOldRateDiscount(0);
    setPercentDiscount(0);
    setOldPercentDiscount(0);
    setRateDiscount(0);
    quantityPriceFunction();
    setValidationErr(initialValidationErr);
  }, []);

  useEffect(() => {
    const productsDataTemp = ITEM_CATEGORIES?.reduce((acc, val) => {
      const filterByItemType = itemList.filter((f) => f.item_type === val);
      if (filterByItemType.length > 0) {
        return {
          ...acc,
          [val]: itemList
            ?.filter((f) => f.item_type === val)
            ?.map((m) => ({ payload: m.id, text: m.name, initial: m.initial })),
        };
      }
      return acc;
    }, {});
    setProductData(
      productsDataTemp && productsDataTemp.products && productsDataTemp.services
        ? productsDataTemp.products.concat(productsDataTemp.services)
        : [],
    );
    setProducts(productsDataTemp.products);
    setService(productsDataTemp.services);
    setIntialProduct(productsDataTemp.products);
    setIntialService(productsDataTemp.services);
  }, [itemList]);

  const rateDiscountFunction = () => {
    if (
      Number(rateDiscount) !== 0 &&
      Number(oldRateDiscount).toFixed(2) !== Number(rateDiscount).toFixed(2)
    ) {
      setTotalValue(Number(quantity) * Number(price) - Number(rateDiscount));
      setPercentDiscount(
        (100 * Number(rateDiscount)) / (Number(quantity) * Number(price)),
      );
      setOldPercentDiscount(
        (100 * Number(rateDiscount)) / (Number(quantity) * Number(price)),
      );
      setOldRateDiscount(Number(rateDiscount));
    } else if (Number(rateDiscount) === 0) {
      setTotalValue(Number(quantity) * Number(price) - Number(rateDiscount));
      setPercentDiscount(0);
      setOldPercentDiscount(0);
      setOldRateDiscount(0);
    } else if (quantityHasChanges) {
      if (quantity && price) {
        setTotalValue(Number(quantity) * Number(price) - Number(rateDiscount));
        setPercentDiscount(
          (100 * Number(rateDiscount)) / (Number(quantity) * Number(price)),
        );
        setOldPercentDiscount(
          (100 * Number(rateDiscount)) / (Number(quantity) * Number(price)),
        );
      }
    }
    if (rateDiscount) {
      setFormattedRateDiscount(Number(rateDiscount));
      quantityHasChanges = false;
    }
    quantityPriceFunction();
  };

  const percentDiscountFunction = () => {
    if (
      Number(percentDiscount) !== 0 &&
      oldPercentDiscount !== Number(percentDiscount)
    ) {
      setRateDiscount(
        Number(
          (
            (Number(percentDiscount) / 100) *
            (Number(quantity || 0) * Number(price || 0))
          ).toFixed(2),
        ),
      );
      setOldRateDiscount(
        Number(
          (
            (Number(percentDiscount) / 100) *
            (Number(quantity || 0) * Number(price || 0))
          ).toFixed(2),
        ),
      );
      setTotalValue(
        Number(quantity || 0) * Number(price || 0) -
          (Number(percentDiscount) / 100) *
            (Number(quantity || 0) * Number(price || 0)),
      );
      setOldPercentDiscount(Number(percentDiscount));
    } else if (Number(percentDiscount) > 100) {
      setRateDiscount(0);
      setOldRateDiscount(0);
      setTotalValue(Number(quantity || 0) * Number(price || 0) - 0);
      setOldPercentDiscount(Number(percentDiscount));
    } else if (Number(percentDiscount) === 0) {
      setRateDiscount(0);
      setOldRateDiscount(0);
      setTotalValue(Number(quantity || 0) * Number(price || 0) - 0);
      setOldPercentDiscount(Number(percentDiscount));
    } else if (quantityHasChanges) {
      if (quantity && price) {
        setRateDiscount(
          Number(
            (
              (Number(percentDiscount) / 100) *
              (Number(quantity || 0) * Number(price || 0))
            ).toFixed(2),
          ),
        );
        setOldRateDiscount(
          Number(
            (
              (Number(percentDiscount) / 100) *
              (Number(quantity || 0) * Number(price || 0))
            ).toFixed(2),
          ),
        );
        setTotalValue(
          Number(quantity || 0) * Number(price || 0) -
            (Number(percentDiscount) / 100) *
              (Number(quantity || 0) * Number(price || 0)),
        );
      }
      quantityHasChanges = false;
    }
    quantityPriceFunction();
  };

  useEffect(() => {
    quantityHasChanges = true;
    percentDiscountFunction();
    rateDiscountFunction();
  }, [quantity, price]);

  useEffect(() => {
    rateDiscountFunction();
    // quantityPriceFunction();
  }, [rateDiscount, quantity, price]);

  useEffect(() => {
    percentDiscountFunction();
    // quantityPriceFunction();
  }, [percentDiscount]);

  const onTriggerDrawer = (drawerName) => {
    setDrawer((d) => ({ ...d, [drawerName]: true }));
    if (drawerName === 'addProductDrawer') {
      setOldRateDiscount(0);
      setPercentDiscount(0);
      setOldPercentDiscount(0);
      setRateDiscount(0);
    }
  };

  const handleBottomSheet = (drawerName) => {
    console.log(intialProduct, intialService, addProduct, selectedElement);
    setFormattedPrice();
    setFormattedQuantity();
    setFormattedRateDiscount();
    setDrawer((d) => ({ ...d, [drawerName]: false }));
  };

  const handleSelected = (element, type, discount, unit) => {
    if (type === 'modify') {
      setUnitMeasure(unit);
      setRateDiscount(discount);
      onTriggerDrawer('modifyProductDrawer');
    } else {
      onTriggerDrawer('addProductDrawer');
    }
    setSelectedItems([]);
    setSelectedElement(element);
    setTimeout(() => {
      setSelectedItems([element]);
    }, 100);
    handleBottomSheet('search');
  };

  useEffect(() => {
    if (newlyAddedItem) {
      if (newlyAddedItem?.fromModify?.name === 'modify') {
        const modifyElement = lineItems?.find(
          (val) => val?.item_id === newlyAddedItem?.id,
        );
        handleSelected(
          modifyElement,
          'modify',
          modifyElement?.discount,
          modifyElement?.unit_of_measurement,
        );
      } else {
        handleSelected(newlyAddedItem);
      }
    }
  }, [newlyAddedItem]);

  useEffect(() => {
    setValidationErr(initialValidationErr);
    if (selectedElement && selectedItems) {
      let element;
      if (selectedElement.payload) {
        element = selectedElement.payload;
        const itemData = itemList.filter((item) => item.id === element)[0];
        setItem(selectedElement.id ? selectedElement.id : element);
        setName(itemData.name);
        setDescription(itemData.default_description);
        setQuantity(Number(itemData.default_quantity));
        setPrice(Number(itemData.default_rate).toFixed(2));
        setTotalValue(
          Number(itemData.default_quantity) * Number(itemData.default_rate),
        );
        setUnitMeasure(
          UNITS.find((ele) => ele.text === itemData.unit_of_measurement)
            ?.payload,
        );

        if (!formattedQuantity)
          setFormattedQuantity(Number(itemData.default_quantity));
        if (!formattedPrice)
          setFormattedPrice(Number(itemData.default_rate).toFixed(2));
      } else if (selectedElement.item_id) {
        element = selectedElement.item_id;
        setItem(selectedElement.id ? selectedElement.id : element);
        setName(selectedElement.item_name);
        setDescription(selectedElement.description);
        setQuantity(Number(selectedElement.quantity));
        setPrice(Number(selectedElement.rate).toFixed(2));
        setRateDiscount(Number(selectedElement.discount).toFixed(2));
        setTotalValue(
          Number(selectedElement.quantity) * Number(selectedElement.rate) -
            Number(rateDiscount),
        );
        setUnitMeasure(
          UNITS.find((ele) => ele.text === selectedElement.unit_of_measurement)
            ?.payload,
        );
        if (!formattedQuantity)
          setFormattedQuantity(Number(selectedElement.quantity));
        if (!formattedPrice)
          setFormattedPrice(Number(selectedElement.rate).toFixed(2));
        setFormattedRateDiscount(Number(selectedElement.discount).toFixed(2));
      } else {
        element = selectedElement.id;
        setItem(selectedElement.id ? selectedElement.id : element);
        setName(selectedElement.name);
        setDescription(selectedElement.default_description);
        setQuantity(Number(selectedElement.default_quantity));
        setPrice(Number(selectedElement.default_rate).toFixed(2));
        setTotalValue(
          Number(selectedElement.default_quantity) *
            Number(selectedElement.default_rate),
        );
        setUnitMeasure(
          UNITS.find((ele) => ele.text === selectedElement.unit_of_measurement)
            ?.payload,
        );

        if (!formattedQuantity)
          setFormattedQuantity(Number(selectedElement.default_quantity));
        if (!formattedPrice)
          setFormattedPrice(Number(selectedElement.default_rate).toFixed(2));
      }
    }
  }, [selectedItems]);

  const createLineItem = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return false;
    }
    const updatedItem = {
      name,
      description,
      quantity,
      price,
      totalValue: totalValue.toFixed(2),
      rateDiscount,
    };
    onProductSelect([itemVal], itemList, updatedItem);
    handleBottomSheet('addProductDrawer');
    return true;
  };

  const handleModify = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return false;
    }
    const valueObject = {
      description,
      quantity,
      rate: price,
      discount: rateDiscount,
    };
    if (totalValue <= price * quantity) {
      if (totalValue >= 0) {
        if (itemVal) {
          handleBottomSheet('modifyProductDrawer');
          onProductUpdate(itemVal, valueObject);
        }
      }
    } else if (totalValue >= 0) {
      if (itemVal) {
        handleBottomSheet('modifyProductDrawer');
        onProductUpdate(itemVal, valueObject);
      }
    }
    return true;
  };

  const handleUpdate = (val, id) => {
    const v = validateAllFields();
    const valid = Object.values(v).every((valData) => !valData);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return false;
    }
    const valueObject = {
      quantity: val,
    };
    if (totalValue <= price * quantity) {
      if (totalValue >= 0) {
        if (id) {
          onProductUpdate(id, valueObject);
        }
      }
    } else if (totalValue >= 0) {
      if (id) {
        onProductUpdate(id, valueObject);
      }
    }
    return true;
  };

  const device = localStorage.getItem('device_detect');

  const AddProduct = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Input
            name="name"
            label="Name"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              type: 'text',
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
              background: 'rgba(153, 158, 165, 0.39)',
            }}
            value={name}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            name="description"
            label="Description"
            variant="standard"
            error={validationErr.description}
            helperText={
              validationErr.description ? ValidationErrMsg.description : ''
            }
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              type: 'text',
            }}
            fullWidth
            onChange={onInputChange(setDescription)}
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            value={description}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            name="quantity"
            error={validationErr.quantity}
            helperText={validationErr.quantity ? ValidationErrMsg.quantity : ''}
            label="Quantity"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">{unitMeasure}</InputAdornment>
              ),
              inputComponent: QuantityCustom,
            }}
            fullWidth
            onChange={onInputChange(setQuantity, setFormattedQuantity)}
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
            fullWidth
            onChange={onInputChange(setPrice, setFormattedPrice)}
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            required
            placeholder="0.000"
            value={Number(price) === 0 ? '' : formattedPrice}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            name="percentDiscount"
            error={validationErr.percentDiscount}
            helperText={
              validationErr.percentDiscount
                ? ValidationErrMsg.percentDiscount
                : ''
            }
            label="Discount in %"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              type: 'number',
            }}
            fullWidth
            onChange={onInputChange(setPercentDiscount)}
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            placeholder="0"
            value={Number(percentDiscount) === 0 ? '' : Number(percentDiscount)}
          />
        </Grid>
        <Grid item xs={6}>
          <Input
            name="rateDiscount"
            error={validationErr.rateDiscount}
            helperText={
              validationErr.rateDiscount ? ValidationErrMsg.rateDiscount : ''
            }
            label="Discount in rate"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputComponent: PriceCustom,
            }}
            type="num"
            fullWidth
            onChange={onInputChange(setRateDiscount, setFormattedRateDiscount)}
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
            }}
            placeholder="0"
            value={Number(rateDiscount) === 0 ? '' : formattedRateDiscount}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            name="totalValue"
            error={totalButton}
            helperText={totalButton ? 'Total value is not Negative' : ''}
            label="TOTAL VALUE"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputComponent: PriceCustom,
            }}
            fullWidth
            onChange={onInputChange(setTotalValue)}
            theme="light"
            rootStyle={{
              border: '1px solid #A0A4AF',
              background: 'rgba(153, 158, 165, 0.39)',
            }}
            disabled
            value={totalValue}
          />
        </Grid>

        <div className={css.addCustomerFooter}>
          <Button
            variant="outlined"
            className={css.secondary}
            onClick={() => {
              handleBottomSheet('addProductDrawer');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className={css.primary}
            onClick={() => {
              const selectedItemId = lineItems.find(
                (ele) => ele.item_id === itemVal,
              );
              if (selectedItemId) {
                if (
                  selectedItemId.rate === price &&
                  Number(selectedItemId.discount) === rateDiscount
                ) {
                  handleUpdate(
                    Number(selectedItemId.quantity) + Number(quantity),
                    selectedItemId.id,
                  );
                  handleBottomSheet('addProductDrawer');
                } else {
                  createLineItem();
                }
              } else {
                createLineItem();
              }
            }}
            disabled={totalButton}
          >
            Add {proSer}
          </Button>
        </div>
      </Grid>
    );
  };

  const ModifyProduct = () => {
    return (
      <>
        {' '}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Input
              name="name"
              label="Name"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                type: 'text',
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
                background: 'rgba(153, 158, 165, 0.39)',
              }}
              value={name}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              name="description"
              label="Description"
              variant="standard"
              error={validationErr.description}
              helperText={
                validationErr.description ? ValidationErrMsg.description : ''
              }
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                type: 'text',
              }}
              fullWidth
              onChange={onInputChange(setDescription)}
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              value={description}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              name="quantity"
              error={validationErr.quantity}
              helperText={
                validationErr.quantity ? ValidationErrMsg.quantity : ''
              }
              label="Quantity"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    {unitMeasure}
                  </InputAdornment>
                ),
                inputComponent: QuantityCustom,
              }}
              fullWidth
              onChange={onInputChange(setQuantity, setFormattedQuantity)}
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
              fullWidth
              onChange={onInputChange(setPrice, setFormattedPrice)}
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              required
              placeholder="0.00"
              value={Number(price) === 0 ? '' : formattedPrice}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              name="percentDiscount"
              error={validationErr.percentDiscount}
              helperText={
                validationErr.percentDiscount
                  ? ValidationErrMsg.percentDiscount
                  : ''
              }
              label="Discount in %"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                type: 'number',
              }}
              fullWidth
              onChange={onInputChange(setPercentDiscount)}
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              placeholder="0"
              value={
                Number(percentDiscount) === 0 ? '' : Number(percentDiscount)
              }
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              name="rateDiscount"
              error={validationErr.rateDiscount}
              helperText={
                validationErr.rateDiscount ? ValidationErrMsg.rateDiscount : ''
              }
              label="Discount in rate"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                type: 'number',
              }}
              fullWidth
              onChange={onInputChange(
                setRateDiscount,
                setFormattedRateDiscount,
              )}
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              placeholder="0"
              value={Number(rateDiscount) === 0 ? '' : formattedRateDiscount}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              name="totalValue"
              error={totalButton}
              helperText={totalButton ? 'Total value is not Negative' : ''}
              label="TOTAL VALUE"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputComponent: PriceCustom,
              }}
              fullWidth
              onChange={onInputChange(setTotalValue)}
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
                background: 'rgba(153, 158, 165, 0.39)',
              }}
              disabled
              value={totalValue}
            />
          </Grid>

          <div className={css.addCustomerFooter}>
            <Button
              variant="outlined"
              className={css.secondary}
              onClick={() => {
                onTriggerDrawer('deletePopup');
              }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              className={css.primary}
              onClick={() => {
                // setTimeout(() => {
                //   handleBottomSheet('modifyProductDrawer');
                // }, 1000);
                handleModify();
              }}
              disabled={totalButton}
            >
              Modify
            </Button>
          </div>
        </Grid>
        <ReceivablesPopOver
          open={drawer.deletePopup}
          handleClose={() => handleBottomSheet('deletePopup')}
          position="center"
          drawer={device === 'mobile'}
        >
          {device === 'desktop' ? (
            <div className={css.effortlessOptions}>
              <h3>Delete</h3>
              <p>Are you sure you want to delete this Item from your Bill?</p>

              {/* </ul> */}
              <div
                className={css.addCustomerFooter}
                style={{ marginBottom: '10px' }}
              >
                <Button
                  variant="contained"
                  className={css.secondary}
                  style={{
                    padding: '15px 35px',
                    textTransform: 'initial',
                  }}
                  onClick={() => {
                    handleBottomSheet('deletePopup');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  className={`${css.primary}`}
                  style={{
                    padding: '15px 35px',
                    textTransform: 'initial',
                    width: 'auto',
                  }}
                  onClick={() => {
                    deleteLineItem(itemVal);
                    handleBottomSheet('deletePopup');
                    handleBottomSheet('modifyProductDrawer');
                  }}
                >
                  &nbsp; Delete &nbsp;
                </Button>
              </div>
            </div>
          ) : (
            <div className={css.effortlessOptions}>
              <div className={css.valueHeader}>Heads Up</div>
              <p className={css.deleteHeader}>
                Are you sure that you want to delete {name} from
                <br /> your Invoice?
              </p>
              <div className={css.addCustomerFooter}>
                <Button
                  variant="contained"
                  className={css.secondary}
                  style={{
                    padding: '15px 35px',
                    textTransform: 'initial',
                    width: 'auto',
                  }}
                  onClick={() => {
                    handleBottomSheet('deletePopup');
                  }}
                >
                  No
                </Button>
                <Button
                  variant="contained"
                  className={`${css.primary}`}
                  style={{
                    padding: '15px 35px',
                    textTransform: 'initial',
                    width: 'auto',
                  }}
                  onClick={() => {
                    deleteLineItem(itemVal);
                    handleBottomSheet('deletePopup');
                    handleBottomSheet('modifyProductDrawer');
                  }}
                >
                  Yes
                </Button>
              </div>
            </div>
          )}
        </ReceivablesPopOver>
      </>
    );
  };

  return (
    <section className={css.step2Section}>
      <div className={css.card}>
        <div className={css.row1}>
          <div className={css.step}>
            Step{' '}
            {taxType === 'credit_note' || taxType === 'debit_note'
              ? '03'
              : '02'}
            :<span className={css.stepLable}>Enter Bill Details</span>
          </div>
        </div>
        {device === 'mobile' && lineItems.length > 0 && (
          <div className={css.row1}>
            <div className={css.title}>Bill Details</div>
            {lineItems &&
              lineItems
                ?.sort((a, b) => (a.position > b.position ? 1 : -1))
                .map((item) => {
                  return (
                    <div
                      key={item.id}
                      className={css.billSplitUp}
                      onClick={() =>
                        handleSelected(
                          item,
                          'modify',
                          item.discount,
                          item.unit_of_measurement,
                        )
                      }
                    >
                      <div className={css.billSplitUpLeft}>
                        <div
                          className={css.serviceName}
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            margin: '1px',
                          }}
                        >
                          {item.item_name}
                        </div>
                        <div
                          className={css.serviceDescription}
                          style={{ margin: '1px' }}
                        >
                          {item.description}
                        </div>
                        <div
                          className={css.serviceQuantity}
                          style={{ margin: '1px' }}
                        >
                          [{item?.quantity} X
                          {customCurrency(currencyType, 'en-IN').format(
                            item?.rate,
                          )}
                          ]
                        </div>
                      </div>
                      <div className={css.billSplitUpRight}>
                        <div
                          className={css.serviceCost}
                          style={{
                            fontSize: '13px',
                            fontWeight: 500,
                            margin: '1px',
                          }}
                        >
                          {customCurrency(currencyType, 'en-IN').format(
                            item?.total,
                          )}
                        </div>
                        {gstAvailable && (
                          <div
                            className={css.gstCost}
                            style={{ margin: '1px' }}
                          >
                            (Incld. GST{' '}
                            {customCurrency(currencyType, 'en-IN').format(
                              item?.invoice_tax_items?.reduce(
                                (previousValue, currentValue) =>
                                  Number(previousValue) +
                                  Number(currentValue?.amount),
                                0,
                              ),
                            )}
                            )
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
          </div>
        )}
        <div className={css.row2}>
          <SelectBottomSheet
            id="overFlowHidden"
            name="search"
            triggerComponent={
              <Mui.Tooltip
                title="Search Product/Service"
                placement="bottom-end"
              >
                <div
                  className={css.searchInput}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    onTriggerDrawer('search');
                    setProSer(
                      products && products.length > 0 ? 'products' : 'services',
                    );
                  }}
                >
                  <img
                    className={css.searchIcon}
                    src={step2.search}
                    alt="search"
                  />
                </div>
              </Mui.Tooltip>
            }
            open={drawer.search}
            onTrigger={onTriggerDrawer}
            onClose={() => {
              handleBottomSheet('search');
              setProSer('products');
            }}
            // maxHeight="45vh"
            addNewSheet
          >
            <div>
              <SearchProductService
                productData={products}
                serviceData={service}
                setAddProduct={setAddProduct}
                handleSelected={handleSelected}
                handleClick={onTriggerDrawer}
                setProSer={setProSer}
                proSer={proSer}
                wholeData={productsData}
                taxType={taxType}
                noteTypeWithShow={noteTypeWithShow}
              />
            </div>
          </SelectBottomSheet>

          <StyledDrawer
            anchor={device === 'mobile' ? 'bottom' : 'right'}
            variant="temporary"
            name="addProductDrawer"
            open={drawer.addProductDrawer}
            onClose={() => handleBottomSheet('addProductDrawer')}
            minHeight={device === 'mobile' ? '25vh' : '100%'}
            width={device === 'desktop' ? '30vw' : '100%'}
            borderRadius={device === 'mobile' ? '20px 20px 0 0' : '0'}
            overflow={device === 'mobile' ? 'auto' : 'visible !important'}
          >
            <div
              className={css.step2CustomDialog}
              style={{ position: 'relative' }}
            >
              {device === 'desktop' && (
                <div
                  onClick={() => {
                    handleBottomSheet('addProductDrawer');
                  }}
                  style={{
                    background: '#36E3C0',
                    width: 20,
                    height: 20,
                    position: 'absolute',
                    top: 10,
                    left: -15,
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  X
                </div>
              )}
              <Mui.Stack className={css.mainStack}>
                <div className={css.valueHeader}>Add Item to your Bill</div>
                {!drawer.editEntireDrawer && (
                  <Mui.Tooltip title="Edit" placement="bottom-end">
                    <Mui.IconButton
                      className={css.editIcon}
                      onClick={() => {
                        // setProSer(
                        //   products && products.length > 0
                        //     ? 'products'
                        //     : 'services',
                        // );
                        setDrawer((prev) => ({ ...prev, fromDrawer: 'add' }));
                        handleBottomSheet('addProductDrawer');
                        onTriggerDrawer('editEntireDrawer');
                      }}
                    >
                      {' '}
                      <BorderColorIcon />{' '}
                    </Mui.IconButton>
                  </Mui.Tooltip>
                )}{' '}
              </Mui.Stack>
              {AddProduct()}
            </div>
          </StyledDrawer>

          <SelectBottomSheet
            name="editEntireDrawer"
            open={drawer.editEntireDrawer}
            onClose={() => {
              handleBottomSheet('editEntireDrawer');
              setDrawer((prev) => ({ ...prev, fromDrawer: '' }));
            }}
            triggerComponent={<></>}
            onTrigger={onTriggerDrawer}
            addNewSheet
          >
            <div
              className={css.step2CustomDialog}
              style={{ position: 'relative' }}
            >
              {device === 'desktop' && (
                <div
                  onClick={() => {
                    handleBottomSheet('editEntireDrawer');
                    setDrawer((prev) => ({ ...prev, fromDrawer: '' }));
                  }}
                  style={{
                    background: '#36E3C0',
                    width: 20,
                    height: 20,
                    position: 'absolute',
                    top: 10,
                    left: -15,
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  X
                </div>
              )}
              <Mui.Stack className={css.mainStack}>
                <div className={css.valueHeader}>Edit Details for {name}</div>
              </Mui.Stack>
              <div>
                {/* <p style={{ margin: 0 }}>Update Details related to {name}.</p> */}
                <p>
                  <strong>Please Note:</strong> Changes made here will be used
                  as Default Values for this {name} going forward.
                </p>
              </div>
              <CreateProductService
                handleBottomSheet={handleBottomSheet}
                onSubmit={onCreateProduct}
                drawerName="editEntireDrawer"
                // selectedTab={proSer}
                updatedItem={
                  drawer?.fromDrawer === 'modify'
                    ? selectedElement?.item_id
                    : itemVal
                }
                fromSheet={
                  (drawer?.fromDrawer === 'modify' && {
                    name: 'modify',
                    ids: itemVal,
                  }) ||
                  undefined
                }
              />
            </div>
          </SelectBottomSheet>

          <StyledDrawer
            anchor={device === 'mobile' ? 'bottom' : 'right'}
            variant="temporary"
            name="modifyProductDrawer"
            open={drawer.modifyProductDrawer}
            onClose={() => handleBottomSheet('modifyProductDrawer')}
            minHeight={device === 'mobile' ? '25vh' : '100%'}
            width={device === 'desktop' ? '30vw' : '100%'}
            borderRadius={device === 'mobile' ? '20px 20px 0 0' : '0'}
            overflow={device === 'mobile' ? 'auto' : 'visible !important'}
          >
            <div className={css.step2CustomDialog}>
              {device === 'desktop' && (
                <div
                  onClick={() => {
                    handleBottomSheet('modifyProductDrawer');
                  }}
                  style={{
                    background: '#36E3C0',
                    width: 20,
                    height: 20,
                    position: 'absolute',
                    top: 10,
                    left: -15,
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  X
                </div>
              )}
              <Mui.Stack className={css.mainStack}>
                <div className={css.valueHeader}>Modify your Bill</div>
                {!drawer.editEntireDrawer && (
                  <Mui.Tooltip title="Edit" placement="bottom-end">
                    <Mui.IconButton
                      className={css.editIcon}
                      onClick={() => {
                        // setProSer(
                        //   products && products.length > 0
                        //     ? 'products'
                        //     : 'services',
                        // );
                        setDrawer((prev) => ({
                          ...prev,
                          fromDrawer: 'modify',
                        }));
                        handleBottomSheet('modifyProductDrawer');
                        onTriggerDrawer('editEntireDrawer');
                      }}
                    >
                      {' '}
                      <BorderColorIcon />{' '}
                    </Mui.IconButton>
                  </Mui.Tooltip>
                )}{' '}
              </Mui.Stack>
              {ModifyProduct()}
            </div>
          </StyledDrawer>

          <SelectBottomSheet
            name="addProductService"
            triggerComponent={
              <Mui.Tooltip title="Add Product/Service" placement="bottom-end">
                <div
                  onClick={() => {
                    if (taxType === 'credit_note') {
                      openSnackBar({
                        message: 'Not allowed to perform this action!',
                        type: MESSAGE_TYPE.ERROR,
                      });
                    } else {
                      onTriggerDrawer('addProductService');
                    }
                  }}
                >
                  <img
                    src={step2.selectBillDetails}
                    alt="selectCustomer"
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </Mui.Tooltip>
            }
            open={drawer.addProductService}
            onTrigger={onTriggerDrawer}
            onClose={handleBottomSheet}
            // maxHeight="45vh"
            addNewSheet
          >
            {desktopView ? (
              <>
                <div className={css.valueHeader}>
                  Create New Product or Service
                </div>
                <div className={css.valueHeaderSub}>
                  Please Fill in the below details to add a new customer to your
                  Invoice
                </div>
              </>
            ) : (
              <div className={css.valueHeader}>
                Create New Product or Service
              </div>
            )}

            <CreateProductService
              handleBottomSheet={handleBottomSheet}
              onSubmit={onCreateProduct}
              drawerName="addProductService"
              selectedTab={proSer}
            />
          </SelectBottomSheet>
        </div>

        {device === 'desktop' && lineItems.length > 0 && (
          <div className={css.row1} style={{ marginBottom: 20 }}>
            <div className={css.title}>Bill Details</div>
            {lineItems &&
              lineItems?.map((item) => {
                return (
                  <div
                    key={item.id}
                    className={css.billSplitUp}
                    onClick={() =>
                      handleSelected(
                        item,
                        'modify',
                        item.discount,
                        item.unit_of_measurement,
                      )
                    }
                  >
                    <div className={css.billSplitUpLeft}>
                      <div
                        className={css.serviceName}
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          margin: '1px',
                        }}
                      >
                        {item.item_name}
                      </div>
                      <div
                        className={css.serviceDescription}
                        style={{ margin: '1px' }}
                      >
                        {item.description}
                      </div>
                      <div
                        className={css.serviceQuantity}
                        style={{ margin: '1px' }}
                      >
                        [{item?.quantity} X
                        {customCurrency(currencyType, 'en-IN').format(
                          item?.rate,
                        )}
                        ]{/* [{customCurrency('USD').format(item?.rate)}] */}
                      </div>
                    </div>
                    <div className={css.billSplitUpRight}>
                      <div
                        className={css.serviceCost}
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          margin: '1px',
                        }}
                      >
                        {customCurrency(currencyType, 'en-IN').format(
                          item?.total,
                        )}
                      </div>
                      {gstAvailable && (
                        <div className={css.gstCost} style={{ margin: '1px' }}>
                          (Incld. GST{' '}
                          {customCurrency(currencyType, 'en-IN').format(
                            item?.invoice_tax_items?.reduce(
                              (previousValue, currentValue) =>
                                Number(previousValue) +
                                Number(currentValue?.amount),
                              0,
                            ),
                          )}
                          )
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {taxType !== 'credit_note' && (
          <div className={css.row2Bottom}>
            <div className={css.title}>Recently Billed Items</div>
            {itemList.filter((val) => val.recent === true).length > 0 && (
              <div className={css.recentlyBilledItems}>
                {itemList &&
                  itemList
                    ?.filter((val) => val.recent === true)
                    ?.map((item) => {
                      return (
                        <div
                          key={item.id}
                          className={desktopView ? css.itemB : css.item}
                          onClick={() => handleSelected(item)}
                        >
                          <div className={css.lable}>{item.name}</div>
                        </div>
                      );
                    })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SelectProductService;
