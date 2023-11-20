/* @flow */
/**
 * @fileoverview  Create Edit Invoice Container
 */

import React, { useState, useContext, useEffect, useRef } from 'react';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import Select from '@components/Select/Select.jsx';
import AutoComplete from '@components/AutoComplete/AutoComplete.jsx';
import GroupSelect from '@components/Select/GroupSelect.jsx';
import Input from '@components/Input/Input.jsx';
import { MuiDatePicker } from '@components/DatePicker/DatePicker.jsx';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Typography from '@material-ui/core/Typography';

import RestApi, { METHOD } from '@services/RestApi.jsx';
import CreateCustomerDialog from '@core/InvoiceView/CreateCustomerDialog';
import CreateProductDialog from '@core/InvoiceView/CreateProductDialog';
import InvoicePreviewDialog from '@core/InvoiceView/InvoicePreviewDialog';
import ConfirmMessageDialog from '@core/InvoiceView/ConfirmMessageDialog';
import CreateCustomerLocationDialog from '@core/InvoiceView/CreateCustomerLocationDialog';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import { DeleteIcon } from '@components/SvgIcons/SvgIcons.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import AppContext from '@root/AppContext.jsx';

import { validateRequired } from '@services/Validation.jsx';
import * as theme from '@root/theme.scss';
import * as css from './CreateInvoiceContainer.scss';

let timer = 0;

const VALIDATOR = {
  organization_location_id: (v) => validateRequired(v),
  document_type: (v) => validateRequired(v),
  billing_party_location_id: (v) => validateRequired(v),
  delivery_party_location_id: (v) => validateRequired(v),
  place_of_supply: (v) => validateRequired(v),
  terms: (v) => validateRequired(v),
};

const ValidationErrMsg = {
  organization_location_id: 'Choose Organization Location',
  document_type: 'Choose Invoice Type',
  billing_party_location_id: 'Choose Billing Address',
  delivery_party_location_id: 'Choose Delivery Address',
  place_of_supply: 'Choose place of supply',
  terms: 'Please fill Terms & Conditions',
};

const initialValidationErr = {
  organization_location_id: false,
  document_type: false,
  billing_party_location_id: false,
  place_of_supply: false,
  terms: false,
};

const ITEM_CATEGORIES = ['products', 'services'];

// backend has to be consistent in properties
const mapLineItemProp = {
  invoices: 'invoice_items',
  customer_agreements: 'agreement_line_items',
  templates: 'template_line_items',
};

export const INVOICE_TYPES = [
  {
    text: 'Tax Invoice',
    payload: 'tax_invoice',
  },
  {
    text: 'Credit Note',
    payload: 'credit_note',
  },
  {
    text: 'Debit Note',
    payload: 'debit_note',
  },
  {
    text: 'Receipt Voucher',
    payload: 'receipt_voucher',
  },
  {
    text: 'Refund Voucher',
    payload: 'refund_voucher',
  },
  {
    text: 'Reimbursement Note',
    payload: 'reimbursement_note',
  },
  {
    text: 'Credit Note without GST',
    payload: 'credit_note_without_gst',
  },
];

const useStyles = makeStyles(() => ({
  checked: {
    color: theme.colorLinks,
  },
}));

const CreateInvoiceContainer = () => {
  const {
    organization,
    enableLoading,
    user,
    setActiveInvoiceId,
    changeSubView,
    openSnackBar,
  } = useContext(AppContext);

  const classes = useStyles();

  const customerElemRef = useRef(null);

  const executeScroll = () =>
    customerElemRef.current.scrollIntoView({
      behavior: 'smooth',
    });

  const [taxType, setTaxType] = useState(INVOICE_TYPES[0].payload);
  const [invoiceDate, setInvoiceDate] = useState(moment().format('YYYY-MM-DD'));
  const [openAddCustomer, setOpenAddCustomer] = useState(false);
  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const [openInvoicePreview, setOpenInvoicePreview] = useState(false);
  const [openConfirmMessage, setOpenConfirmMessage] = useState(false);
  const [openCustomerLocation, setOpenCustomerLocation] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [orgLocationList, setOrgLocationList] = useState([]);
  const [customerLocationList, setCustomerLocationList] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [customerLocationId, setCustomerLocationId] = useState('');
  const [customerDeliveryLocationId, setCustomerDeliveryLocationId] =
    useState('');
  const [isSameAsDelivery, setIsSameAsDelivery] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [placeOfSupply, setPlaceOfSupply] = useState('');
  const [terms, setTerms] = useState('');
  const [orgLocationId, setOrgLocationId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErr, setValidationErr] = useState(initialValidationErr);

  /**
    Recurring invoice states
   */

  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [deliveryDate, setDeliveryDate] = useState('');

  /**
    Template states
   */
  const [templateName, setTemplateName] = useState<string>('');

  const onRecurringDateChange = (setter) => (m) => {
    setter(m.format('YYYY-MM-DD'));
  };

  const reValidate = (e) => {
    const name = e?.target?.name;
    if (!name) return;
    const value = e?.target?.value;
    setValidationErr((s) => ({ ...s, [name]: !VALIDATOR?.[name]?.(value) }));
  };

  const onOpenAddCustomer = () => {
    setOpenAddCustomer(true);
  };

  const onOpenAddCustomerLocation = () => {
    setOpenCustomerLocation(true);
  };

  const onCloseAddCustomer = () => {
    setOpenAddCustomer(false);
    enableLoading(false);
  };

  const onCloseAddCustomerLocation = () => {
    enableLoading(false);
    setOpenCustomerLocation(false);
  };

  const onPreviewOpenPopup = () => {
    setOpenInvoicePreview(true);
  };

  const onPreviewClose = () => {
    setOpenInvoicePreview(false);
  };

  const onOpenCreateProduct = () => {
    setOpenCreateProduct(true);
  };

  const onCloseCreateProduct = () => {
    setOpenCreateProduct(false);
    enableLoading(false);
  };

  const invoiceParams = {
    document_type: taxType,
    customer_id: customerId,
    organization_location_id: orgLocationId,
    organization_id: organization.orgId,
    date: invoiceDate,
    delivery_party_location_id: isSameAsDelivery
      ? customerLocationId
      : customerDeliveryLocationId,
    billing_party_location_id: customerLocationId,
    place_of_supply: placeOfSupply,
    terms,
  };

  const updateInvoice = (obj: *) => {
    enableLoading(true);
    let params = {
      ...obj,
    };

    if (organization.activeInvoiceSubject === 'customer_agreements') {
      params = {
        ...params,
        start_date: startDate,
        end_date: endDate,
        day_of_creation: deliveryDate,
      };
    }

    if (organization.activeInvoiceSubject === 'templates') {
      params = {
        ...params,
        template_name: templateName,
      };
    }

    RestApi(
      `organizations/${organization.orgId}/${organization.activeInvoiceSubject}/${organization.activeInvoiceId}`,
      {
        method: METHOD.PATCH,
        payload: {
          ...params,
        },
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res) {
          enableLoading(false);
          if (res.customer_id) {
            setCustomerLocationId(res.billing_party_location_id);
            setCustomerDeliveryLocationId(res.delivery_party_location_id);
            setPlaceOfSupply(res.place_of_supply);
            setTerms(res.terms);
          }
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const onDateChange = (m) => {
    if (!m) {
      openSnackBar({
        message: `Date field cannot be empty`,
        type: MESSAGE_TYPE.ERROR,
      });
      setInvoiceDate(moment().format('YYYY-MM-DD'));
      return;
    }

    setInvoiceDate(m.format('YYYY-MM-DD'));

    if (m.format('YYYY-MM-DD') !== 'Invalid date') {
      updateInvoice({
        ...invoiceParams,
        date: m.format('YYYY-MM-DD'),
      });
    }
  };

  // Keeping it until no bugs
  // const onInputChange = (setter) => (e) => {
  //   reValidate(e);
  //   setter(e.target.value);
  // };

  const onTermsChange = (e) => {
    // This debounce needs to be made generic
    // Could not find the reason why the geneic method in Utilities isnt debouncing
    // until then using this
    e.persist();
    clearTimeout(timer);
    timer = setTimeout(() => {
      clearTimeout(timer);
      setTerms(e.target.value);
      updateInvoice({
        ...invoiceParams,
        terms: e.target.value,
      });
    }, 1000);
  };

  const onCheckBoxChange = () => {
    setIsSameAsDelivery(!isSameAsDelivery);
  };

  const createInvoiceId = () => {
    RestApi(
      `organizations/${organization.orgId}/${organization.activeInvoiceSubject}`,
      {
        method: METHOD.POST,
        payload: {},
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      if (res && !res.error) {
        setActiveInvoiceId({ activeInvoiceId: res.id });
        setTerms(res.terms);

        setSelectedItems(
          res[mapLineItemProp[organization.activeInvoiceSubject]]
            ? res[mapLineItemProp[organization.activeInvoiceSubject]].map(
                (i) => i.item_id,
              )
            : [],
        );
      }
    });
  };

  const getInvoiceById = () => {
    RestApi(
      `organizations/${organization.orgId}/${organization.activeInvoiceSubject}/${organization.activeInvoiceId}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      if (res && !res.error) {
        setTaxType(res.document_type);
        setCustomerId(res.customer_id);
        setInvoiceDate(
          res.date
            ? moment(new Date(res.date)).format('YYYY-MM-DD')
            : moment().format('YYYY-MM-DD'),
        );
        setCustomerLocationId(res.billing_party_location_id);
        setCustomerDeliveryLocationId(res.delivery_party_location_id);
        setPlaceOfSupply(res.place_of_supply);
        setTerms(res.terms);

        setSelectedItems(
          res[mapLineItemProp[organization.activeInvoiceSubject]]
            ? res[mapLineItemProp[organization.activeInvoiceSubject]].map(
                (i) => i.item_id,
              )
            : [],
        );

        setIsSameAsDelivery(
          res.billing_party_location_id === res.delivery_party_location_id,
        );

        if (organization.activeInvoiceSubject === 'customer_agreements') {
          setStartDate(res.start_date);
          setEndDate(res.end_date);
          setDeliveryDate(res.day_of_creation);
        }

        if (organization.activeInvoiceSubject === 'templates') {
          setTemplateName(res.template_name);
        }
      }
    });
  };

  const fetchCustomer = () => {
    RestApi(`organizations/${organization.orgId}/customers`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error && res.data) {
        setCustomerList(
          res.data.map((c) => ({
            id: c.id,
            name: c.name,
          })),
        );
        setTimeout(() => {
          executeScroll();
        }, 1250);
      }
    });
  };

  const fetchOrgLocation = () => {
    RestApi(`organizations/${organization.orgId}/locations`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error && res.data) {
        setOrgLocationList(
          res.data.map((l) => ({
            payload: l.id,
            text: `${l.city}, ${l.country}`,
          })),
        );

        if (res.data.length > 0) {
          setOrgLocationId(res.data[0].id);
        }
      }
    });
  };

  const fetchCustomerLocation = () => {
    RestApi(
      `organizations/${organization.orgId}/customers/${customerId}/locations`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      if (res && !res.error && res.data) {
        setCustomerLocationList(
          res.data.map((l) => ({
            payload: l.id,
            text: `${l.city}, ${l.state}`,
          })),
        );
      }
    });
  };

  const fetchItems = () => {
    RestApi(`organizations/${organization.orgId}/items`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error) {
        setItemList([...res.data]);
      }
    });
  };

  const fetchLineItems = () => {
    RestApi(
      `organizations/${organization.orgId}/${organization.activeInvoiceSubject}/${organization.activeInvoiceId}/line_items`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      if (res && !res.error && res.data) {
        setLineItems(res.data.map((i) => i));
      }
    });
  };

  const createLineItem = (itemId) => {
    RestApi(
      `organizations/${organization.orgId}/${organization.activeInvoiceSubject}/${organization.activeInvoiceId}/line_items`,
      {
        method: METHOD.POST,
        payload: {
          item_id: itemId,
          description: 'Test',
          quantity: 1,
          rate: 1,
          amount: 1,
        },
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      if (res && !res.error) {
        fetchLineItems();
      }
    });
  };

  const deleteLineItem = (lineItemId) => {
    RestApi(
      `organizations/${organization.orgId}/${organization.activeInvoiceSubject}/${organization.activeInvoiceId}/line_items/${lineItemId}`,
      {
        method: METHOD.DELETE,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      if (res && !res.error) {
        fetchLineItems();
      }
    });
  };

  const onTaxTypeChange = (e) => {
    reValidate(e);
    setTaxType(e.target.value);
    updateInvoice({
      ...invoiceParams,
      taxType: e.target.value,
    });
    fetchLineItems();
  };

  const onProductSelect = (e) => {
    const newlyAddedItem = e.target.value.find(
      (i) => !selectedItems.includes(i),
    );
    const removedItem = selectedItems.find((i) => !e.target.value.includes(i));
    const lineItemToRemove = lineItems.find((l) => l.item_id === removedItem);
    setSelectedItems(e.target.value);
    if (newlyAddedItem) {
      createLineItem(newlyAddedItem);
    }
    if (lineItemToRemove) {
      deleteLineItem(lineItemToRemove.id);
    }
  };

  const onProductUpdate = (lineItemId, key, value) => {
    RestApi(
      `organizations/${organization.orgId}/${organization.activeInvoiceSubject}/${organization.activeInvoiceId}/line_items/${lineItemId}`,
      {
        method: METHOD.PATCH,
        payload: {
          [key]: value,
        },
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      if (res && !res.error) {
        fetchLineItems();
      }
    });
  };

  const fetchAllStates = () => {
    RestApi(`states`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error) {
        setAllStates(
          res.data.map((l) => ({ payload: l.state_name, text: l.state_name })),
        );
      }
    });
  };

  const onCreateCustomer = ({
    customerName,
    addr1,
    addr2,
    city,
    custState,
    gstNo,
    pincode,
    country,
    individualName,
    mobileNo,
    email,
  }) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/customers`, {
      method: METHOD.POST,
      payload: {
        name: customerName,
        location: {
          address_line1: addr1,
          address_line2: addr2,
          city,
          state: custState,
          gstin: gstNo,
          pincode,
          country,
        },
        contacts: [
          {
            name: individualName,
            mobile_number: mobileNo,
            email,
          },
        ],
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error) {
        openSnackBar({
          message: `${customerName} customer created successfully.`,
          type: MESSAGE_TYPE.INFO,
        });
        setErrorMessage('');
        enableLoading(false);
        setOpenAddCustomer(false);
        fetchCustomer();
      } else {
        const errorValues = Object.values(res.errors);
        openSnackBar({
          message: errorValues.join(', '),
          type: MESSAGE_TYPE.ERROR,
        });
      }
    });
  };

  const onCreateCustomerLocation = ({
    addr1,
    addr2,
    city,
    custState,
    pincode,
    country,
  }) => {
    RestApi(
      `organizations/${organization.orgId}/customers/${customerId}/locations`,
      {
        method: METHOD.POST,
        payload: {
          address_line1: addr1,
          address_line2: addr2,
          city,
          state: custState,
          pincode,
          country,
        },
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      if (res && !res.error) {
        setErrorMessage('');
        openSnackBar({
          message: `Billing address created successfully.`,
          type: MESSAGE_TYPE.INFO,
        });
        enableLoading(false);
        setOpenCustomerLocation(false);
        fetchCustomer();
      } else {
        const errorValues = Object.values(res.errors);
        openSnackBar({
          message: errorValues.join(', '),
          type: MESSAGE_TYPE.ERROR,
        });
      }
    });
  };

  const onCreateProduct = ({ productName, itemType, hsnCode, desc, unit }) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/items`, {
      method: METHOD.POST,
      payload: {
        name: productName,
        item_type: itemType,
        hsn_or_sac_code: hsnCode,
        default_description: desc,
        unit_of_measurement: unit,
        service_id: hsnCode,
      },
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          enableLoading(false);
          setOpenCreateProduct(false);
          openSnackBar({
            message: `${productName} - ${itemType} created successfully.`,
            type: MESSAGE_TYPE.INFO,
          });
        }
        if (res.error) {
          const errorMessages = Object.values(res.errors);
          openSnackBar({
            message: errorMessages.join(', '),
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const onGenerateInvoice = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/invoices/${organization.activeInvoiceId}/generates`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      if (
        res &&
        !res.error &&
        (res.message === 'Invoice generated' ||
          res.message === 'Invoice updated')
      ) {
        setOpenInvoicePreview(false);
        setOpenConfirmMessage(true);
      }
      if (res.error) {
        const errorMessages = Object.values(res.errors);

        openSnackBar({
          message: errorMessages.join(', '),
          type: MESSAGE_TYPE.ERROR,
        });
      }
      enableLoading(false);
    });
  };

  useEffect(() => {
    fetchOrgLocation();
    if (organization.activeInvoiceId) {
      getInvoiceById();
    } else {
      createInvoiceId();
    }
    fetchCustomer();
    fetchAllStates();
    fetchItems();
  }, []);

  useEffect(() => {
    if (openCreateProduct === false) {
      fetchItems();
    }
  }, [openCreateProduct]);

  useEffect(() => {
    if (customerId) {
      fetchCustomerLocation();
    }
  }, [customerId, openCustomerLocation]);

  useEffect(() => {
    if (selectedItems && selectedItems.length > 0) {
      fetchLineItems();
    }
  }, [selectedItems]);

  useEffect(() => {
    if (organization.activeInvoiceId && orgLocationId) {
      updateInvoice();
    }
  }, [startDate, endDate, deliveryDate, templateName]);

  return (
    <div className={css.createInvoiceContainer}>
      <div className={css.fieldWrapper}>
        {organization.activeInvoiceSubject === 'invoices' && (
          <>
            <div className={css.fields}>
              <div className={css.fieldRow}>
                <span className={css.fieldLabel}>Organization Location</span>
                <Select
                  name="organization_location_id"
                  onBlur={reValidate}
                  error={validationErr.organization_location_id}
                  helperText={
                    validationErr.organization_location_id
                      ? ValidationErrMsg.organization_location_id
                      : ''
                  }
                  label="Organization Location"
                  options={orgLocationList}
                  defaultValue={orgLocationId}
                  onChange={(e: *) => {
                    setOrgLocationId(e.target.value);
                    updateInvoice({
                      ...invoiceParams,
                      organization_location_id: e.target.value,
                    });
                  }}
                  fullWidth
                />
              </div>
            </div>
            <div className={css.fields}>
              <div className={css.fieldRow}>
                <span className={css.fieldLabel}>Select Type of Invoice</span>
                <Select
                  name="document_type"
                  onBlur={reValidate}
                  error={validationErr.document_type}
                  helperText={
                    validationErr.document_type
                      ? ValidationErrMsg.document_type
                      : ''
                  }
                  label="Invoice Type"
                  options={INVOICE_TYPES}
                  defaultValue={taxType}
                  onChange={onTaxTypeChange}
                  fullWidth
                />
              </div>
            </div>
            <div className={css.fields}>
              <div className={css.fieldRow}>
                <span className={css.fieldLabel}>Select Date</span>
                <MuiDatePicker
                  selectedDate={invoiceDate}
                  label="Invoice Date"
                  onChange={onDateChange}
                />
              </div>
            </div>
          </>
        )}

        {organization.activeInvoiceSubject === 'templates' && (
          <div className={css.fields}>
            <div className={css.fieldRow}>
              <span className={css.fieldLabel}>Template Name</span>
              <Input
                label="Template Name"
                variant="standard"
                value={templateName}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                onChange={(e) => {
                  setTemplateName(e.target.value);
                }}
                theme="light"
              />
            </div>
          </div>
        )}

        {organization.activeInvoiceSubject === 'customer_agreements' && (
          <div className={css.fields}>
            <div className={css.fieldRow}>
              <span className={css.fieldLabel}>Invoice Schedule</span>
              <Grid container spacing={2} className={css.approveInvoiceForm}>
                <Grid item xs={6}>
                  <MuiDatePicker
                    selectedDate={startDate}
                    label="From"
                    onChange={onRecurringDateChange(setStartDate)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <MuiDatePicker
                    selectedDate={endDate}
                    label="Till"
                    onChange={onRecurringDateChange(setEndDate)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    label="Date of Delivery"
                    variant="standard"
                    value={deliveryDate}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      type: 'tel',
                      min: 1,
                      max: 29,
                    }}
                    fullWidth
                    onChange={(e) => {
                      setDeliveryDate(e.target.value);
                    }}
                    theme="light"
                  />
                </Grid>
              </Grid>
            </div>
          </div>
        )}

        {organization.activeInvoiceSubject !== 'templates' && (
          <div className={css.fields}>
            <div className={css.fieldRow} ref={customerElemRef}>
              <span className={css.fieldLabel}>Select Customer</span>
              {customerList && customerList.length > 0 ? (
                <AutoComplete
                  key={customerId}
                  initialOpen
                  label="Select Customer"
                  getOptionSelected={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => `${option.name}`}
                  value={customerList.find((c) => c.id === customerId)}
                  onChange={(options: Array<*>, value: *) => {
                    setCustomerId(value.id);
                    updateInvoice({
                      ...invoiceParams,
                      customer_id: value.id,
                    });
                  }}
                  options={customerList.map((c) => ({
                    id: c.id,
                    name: c.name,
                  }))}
                />
              ) : (
                <span>No customers</span>
              )}

              <Button
                variant="contained"
                className={css.submitButton}
                fullWidth
                onClick={onOpenAddCustomer}
              >
                Add Customer
              </Button>
            </div>
          </div>
        )}

        {customerId && (
          <>
            <div className={css.fields}>
              <div className={css.fieldRow}>
                <span className={css.fieldLabel}>
                  Billing Address
                  <AddCircleIcon
                    className={css.addIcon}
                    onClick={onOpenAddCustomerLocation}
                  />
                </span>
                <Select
                  name="billing_party_location_id"
                  onBlur={reValidate}
                  error={validationErr.billing_party_location_id}
                  helperText={
                    validationErr.billing_party_location_id
                      ? ValidationErrMsg.billing_party_location_id
                      : ''
                  }
                  label="Billing Address"
                  options={customerLocationList}
                  disabled={customerLocationList.length === 0}
                  defaultValue={customerLocationId}
                  onChange={(e: *) => {
                    setCustomerLocationId(e.target.value);
                    updateInvoice({
                      ...invoiceParams,
                      billing_party_location_id: e.target.value,
                      delivery_party_location_id: isSameAsDelivery
                        ? e.target.value
                        : customerDeliveryLocationId,
                    });
                  }}
                  fullWidth
                />
                <div className={css.supplyContainer}>
                  <Checkbox
                    checked={isSameAsDelivery}
                    onChange={onCheckBoxChange}
                    classes={{ checked: classes.checked }}
                  />
                  <span>Same for Delivery Address</span>
                </div>
              </div>
            </div>
            {!isSameAsDelivery && (
              <div className={css.fields}>
                <div className={css.fieldRow}>
                  <span className={css.fieldLabel}>
                    Delivery Address
                    <AddCircleIcon
                      className={css.addIcon}
                      onClick={onOpenAddCustomerLocation}
                    />
                  </span>
                  <Select
                    name="delivery_party_location_id"
                    onBlur={reValidate}
                    error={validationErr.delivery_party_location_id}
                    helperText={
                      validationErr.delivery_party_location_id
                        ? ValidationErrMsg.delivery_party_location_id
                        : ''
                    }
                    label="Delivery Address"
                    disabled={customerLocationList.length === 0}
                    options={customerLocationList}
                    defaultValue={customerDeliveryLocationId}
                    onChange={(e: *) => {
                      setCustomerDeliveryLocationId(e.target.value);
                      updateInvoice({
                        ...invoiceParams,
                        delivery_party_location_id: e.target.value,
                      });
                    }}
                    fullWidth
                  />
                </div>
              </div>
            )}
            <div className={css.fields}>
              <div className={css.fieldRow}>
                <span className={css.fieldLabel}>Place of Supply</span>
                <Select
                  name="place_of_supply"
                  onBlur={reValidate}
                  error={validationErr.place_of_supply}
                  helperText={
                    validationErr.place_of_supply
                      ? ValidationErrMsg.place_of_supply
                      : ''
                  }
                  label="Place of supply"
                  options={allStates}
                  defaultValue={placeOfSupply}
                  onChange={(e: *) => {
                    setCustomerDeliveryLocationId(e.target.value);
                    updateInvoice({
                      ...invoiceParams,
                      place_of_supply: e.target.value,
                    });
                    window.setTimeout(() => {
                      fetchLineItems();
                    }, 1250);
                  }}
                  fullWidth
                />
              </div>
            </div>
          </>
        )}
        <div className={css.fields}>
          <div className={css.fieldRow}>
            <span className={css.fieldLabel}>Invoice Items</span>
            <GroupSelect
              label="Add Product / Service"
              optionCategories={ITEM_CATEGORIES.reduce((acc, val) => {
                const filterByItemType = itemList.filter(
                  (f) => f.item_type === val,
                );
                if (filterByItemType.length > 0) {
                  return {
                    ...acc,
                    [val]: itemList
                      .filter((f) => f.item_type === val)
                      .map((m) => ({ payload: m.id, text: m.name })),
                  };
                }
                return acc;
              }, {})}
              disabled={itemList.length === 0}
              defaultValue={selectedItems}
              onChange={onProductSelect}
              multiple
              fullWidth
            />
            <Button
              variant="contained"
              className={css.submitButton}
              fullWidth
              onClick={onOpenCreateProduct}
            >
              Create Product / Service
            </Button>

            {lineItems.length > 0 && (
              <div className={css.productContainer}>
                {lineItems.map((i) => (
                  <div className={css.productItem} key={i.id}>
                    <span className={css.productTitle}>{i.item_name}</span>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={3}>
                        <Input
                          label="QTY"
                          variant="standard"
                          defaultValue={i.quantity}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          onChange={(e) => {
                            e.persist();
                            clearTimeout(timer);
                            timer = setTimeout(() => {
                              clearTimeout(timer);
                              onProductUpdate(i.id, 'quantity', e.target.value);
                            }, 1000);
                          }}
                          theme="light"
                          rootStyle={{
                            marginBottom: 0,
                            maxWidth: 70,
                          }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <Input
                          label="RATE"
                          variant="standard"
                          defaultValue={i.rate}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          onChange={(e) => {
                            e.persist();

                            clearTimeout(timer);
                            timer = setTimeout(() => {
                              clearTimeout(timer);
                              onProductUpdate(i.id, 'rate', e.target.value);
                            }, 1000);
                          }}
                          rootStyle={{
                            marginBottom: 0,
                            maxWidth: 100,
                          }}
                          theme="light"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Input
                          label="DISCOUNT"
                          variant="standard"
                          defaultValue={i.discount}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          onChange={(e) => {
                            e.persist();

                            clearTimeout(timer);
                            timer = setTimeout(() => {
                              clearTimeout(timer);
                              onProductUpdate(i.id, 'discount', e.target.value);
                            }, 1000);
                          }}
                          rootStyle={{
                            marginBottom: 0,
                            maxWidth: 130,
                          }}
                          theme="light"
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <DeleteIcon
                          className={css.deleteIcon}
                          onClick={() => {
                            setSelectedItems(
                              selectedItems.filter((s) => s !== i.item_id),
                            );
                            deleteLineItem(i.id);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {lineItems.length > 0 && (
          <div className={css.fields}>
            <div className={css.fieldRow}>
              <span className={css.fieldLabel}>Bill Details</span>
              {lineItems.length > 0 &&
                lineItems.map((l) => (
                  <div className={css.billDetailsContainer} key={`${l.id}`}>
                    <span className={css.title}>{l.item_name}</span>
                    {/* Keeping this - just in case design reverted
                    <div className={css.billItems}>
                      <span className={css.label}>Taxable</span>
                      {l.invoice_tax_items && (
                        <span className={css.value}>
                          Rs.{' '}
                          {l.invoice_tax_items.reduce((acc, v) => {
                            return acc + parseInt(v.amount, 10);
                          }, 0)}
                        </span>
                      )}
                      {!l.invoice_tax_items && (
                        <span className={css.value}>Rs. {l.amount}</span>
                      )}
                    </div>
                    */}
                    <div className={css.billItems}>
                      <span className={css.label}>Value</span>
                      <span className={css.value}>
                        {FormattedAmount(Number(l?.rate) * Number(l?.quantity))}
                      </span>
                    </div>
                    <div className={css.billItems}>
                      <span className={css.label}>Discount</span>
                      <span className={css.value}>
                        {FormattedAmount(l?.discount)}
                      </span>
                    </div>
                    {l.invoice_tax_items &&
                      l.invoice_tax_items.map((t) => (
                        <div className={css.billItems} key={`tax${t.id}`}>
                          <span
                            className={css.label}
                            style={{ textTransform: 'uppercase' }}
                          >
                            {t.tax_id}
                          </span>
                          <span className={css.value}>
                            {FormattedAmount(t?.amount)}
                          </span>
                        </div>
                      ))}

                    <div className={`${css.billItems} ${css.totalItems}`}>
                      <span className={css.label}>Total</span>
                      <span className={css.value}>
                        {FormattedAmount(l?.total)}
                      </span>
                    </div>
                  </div>
                ))}
              <div className={css.grandTotal}>
                <span className={css.label}>GRAND TOTAL</span>
                <span className={css.value}>
                  {lineItems.length > 0
                    ? FormattedAmount(
                        lineItems?.reduce(
                          (acc, val) => acc + parseInt(val?.total, 10),
                          0,
                        ),
                      )
                    : '-'}
                </span>
              </div>
            </div>
          </div>
        )}

        {customerId && lineItems.length > 0 && (
          <div className={css.fields}>
            <div className={css.fieldRow}>
              <span className={css.fieldLabel}>Terms &amp; Conditions</span>
              <Input
                name="terms"
                onBlur={reValidate}
                error={validationErr.terms}
                helperText={validationErr.terms ? ValidationErrMsg.terms : ''}
                label="Terms &amp; Conditions"
                variant="standard"
                defaultValue={terms}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                onChange={onTermsChange}
                theme="light"
                multiline
                disabled
                rows={5}
              />
            </div>
          </div>
        )}

        {customerId &&
          customerLocationId &&
          placeOfSupply &&
          lineItems.length > 0 &&
          terms &&
          organization.activeInvoiceSubject === 'invoices' && (
            <Button
              variant="contained"
              className={css.submitButton}
              fullWidth
              onClick={onPreviewOpenPopup}
            >
              Preview
            </Button>
          )}

        {organization.activeInvoiceSubject !== 'invoices' && (
          <Grid container spacing={3}>
            <Grid item xs={12} className={css.bottomSubmitContainer}>
              <Typography variant="subtitle2">
                Your changes has been auto saved.
              </Typography>
              <Button
                variant="contained"
                className={css.submitButton}
                fullWidth
                onClick={() => {
                  changeSubView('');
                }}
              >
                Return to Dashbord
              </Button>
            </Grid>
          </Grid>
        )}

        <div style={{ height: 30, opacity: 0 }}>temp</div>
      </div>
      <CreateCustomerDialog
        open={openAddCustomer}
        onSubmit={onCreateCustomer}
        onCancel={onCloseAddCustomer}
        submitText="Create"
        errorMessage={errorMessage}
        allStates={allStates}
      />
      <CreateProductDialog
        open={openCreateProduct}
        onSubmit={onCreateProduct}
        onCancel={onCloseCreateProduct}
        submitText="Create"
      />
      <InvoicePreviewDialog
        open={openInvoicePreview}
        onSubmit={onGenerateInvoice}
        onCancel={onPreviewClose}
        invoiceId={organization.activeInvoiceId}
        orgId={organization.orgId}
        activeToken={user.activeToken}
        submitText="GENERATE INVOICE"
        invoiceTypes={INVOICE_TYPES}
      />
      <ConfirmMessageDialog
        open={openConfirmMessage}
        onSubmit={() => {
          changeSubView('');
        }}
        onCancel={() => {
          changeSubView('');
        }}
        submitText="Return to Dashboard"
        title="Successfully generated"
        message="Your Invoice has been sent for approval"
        info="Once approved you can deliver it to the customer"
      />
      <CreateCustomerLocationDialog
        open={openCustomerLocation}
        onSubmit={onCreateCustomerLocation}
        onCancel={onCloseAddCustomerLocation}
        errorMessage={errorMessage}
        allStates={allStates}
      />
    </div>
  );
};

export default CreateInvoiceContainer;
