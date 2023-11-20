/* @flow */
/**
 * @fileoverview  Create Edit Invoice Container
 */
/* eslint-disable no-lonely-if */

import React, { useState, useContext, useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import {
  GetInvoiceDashboardState,
  GetInvoiceOrgLocationState,
  GetInvoiceCustomerLocationState,
  ClearStateInvoiceCustomerLocation,
  GetInvoiceItemsState,
  PostCreateInvoiceItemsState,
  PatchUpdateInvoiceItemsState,
  ClearStateModifyInvoiceItems,
  GetInvoiceCurrencyState,
  GetInvoiceBankDataState,
  GetInvoiceSalesPersonState,
  PostInvoiceCreateNewState,
  ClearStateInvoiceCreateNew,
  PatchInvoiceUpdateState,
  GetInvoiceByIdState,
  // PostCustomerLocationState,
  ClearStateCustomerLocation,
  PostGenerateNewInvoiceState,
  ClearStateGenerateNewInvoice,
  PatchUpdateRecurringInvoiceState,
  ClearUpdateRecurringInvoiceState,
  DeleteRecurringInvoiceState,
  GetFetchLineItemsState,
  PostCreateLineItemsState,
  ClearStateFetchLineItems,
  PatchUpdateLineItemsState,
  DeleteLineItemsState,
  ClearStateInvoiceUnsettledPayments,
  ClearStateRasiedInvoiceList,
  GetInvoiceCustomFieldsState,
  ClearStateInvoiceCustomFields,
} from '@action/Store/Reducers/Invoice/InvoiceState';
import {
  GetEInvoiceState,
  ClearStateGetEInvoice,
} from '@action/Store/Reducers/Settings/EInvoiceSettingsState';
import {
  GetCustomerEntityState,
  // GetPincodeDetailsState,
  ClearSatePincodeDetails,
} from '@action/Store/Reducers/General/GeneralState';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
import Input from '@components/Input/Input.jsx';
// import { pincodeKeyPress } from '@components/utils';
import { capitalizeFirstLetter } from '@components/utils';
import Button from '@material-ui/core/Button';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import SelectCustomer from '@core/InvoiceView/SelectCustomer';
import SelectProductService from '@core/InvoiceView/SelectProductService';
import Checkbox from '@material-ui/core/Checkbox';
import {
  makeStyles,
  // InputAdornment,
  Typography,
} from '@material-ui/core';
import {
  InvoiceIcon,
  LocationIcon,
  ClipboardIcon,
  TransportIcon,
  MapIcon,
  BikeIcon,
  RupeeInvoiceIcon,
  BankInvoiceIcon,
  SalesPersonInvoiceIcon,
} from '@components/SvgIcons/SvgIcons.jsx';
import SearchIcon from '@material-ui/icons/Search';

import { BASE_URL } from '@action/ApiConfig/AxiosInst';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import AppContext from '@root/AppContext.jsx';

import {
  validatePincode,
  validateAddress,
  validateRequired,
  validateOnlyText,
} from '@services/Validation.jsx';
import Grid from '@material-ui/core/Grid';
import * as Mui from '@mui/material';
import * as MuiIcon from '@mui/icons-material';
import InvoiceSuccess from '@assets/InvoiceSuccess.svg';
// import Select from '@components/Select/Select.jsx';
import * as theme from '@root/theme.scss';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import * as Router from 'react-router-dom';
import { InvoiceCustomer } from '@components/Invoice/EditForm.jsx';
import PageTitle from '@core/DashboardView/PageTitle';
import * as cssDash from '@core/DashboardView/DashboardViewContainer.scss';
import { customCurrency } from '@components/formattedValue/FormattedValue';
import { InvoicePdfLoad } from '../../components/SkeletonLoad/SkeletonLoader';
import SelectBankAccount from './Components/SelectBankAccount';
import SalesPersonList from './Components/SalesPersonList';
import PaymentTerms from './PaymentTerms';
import CustomField from './CustomField';
import EInvoiceBill from './EInvoiceBill';
import ReceivablesPopOver from '../Receivables/Components/ReceivablesPopover';
import Calender from './Calander';
// import * as mainCss from '../../App.scss';
import InvoiceAndReason from './InvoiceAndReason';
import * as css from './CreateInvoiceContainer.scss';
import RecurringSheet from './RecurringSheet';
import SelectRightSheet from '../../components/SelectBottomSheet/SelectRightSheet';
import GenerateInvoicePdf from './GenerateInvoicePdf';

// let timer = 0;

const ValidationErrMsg = {
  organization_location_id: 'Choose Organization Location',
  document_type: 'Choose Invoice Type',
  billing_party_location_id: 'Choose Billing Address',
  delivery_party_location_id: 'Choose Delivery Address',
  place_of_supply: 'Choose place of supply',
  terms: 'Please fill Terms & Conditions',
  address_line1: 'Please enter valid Address',
  address_line2: 'Please enter valid Address',
  addr_city: 'Please enter valid City',
  addr_pincode: 'Please enter valid Pincode',
  addr_state: 'Please enter valid State',
};

const initialValidationErr = {
  organization_location_id: false,
  document_type: false,
  billing_party_location_id: false,
  place_of_supply: false,
  terms: false,
  address_line1: false,
  address_line2: false,
  addr_city: false,
  addr_pincode: false,
  addr_state: false,
};

const ITEM_CATEGORIES = ['products', 'services'];

// backend has to be consistent in properties
const mapLineItemProp = {
  invoices: 'invoice_items',
  customer_agreements: 'agreement_line_items',
  templates: 'template_line_items',
};

const useStyles = makeStyles(() => ({
  checked: {
    color: theme.colorLinks,
  },
}));

const CreateInvoiceContainerBeta = () => {
  const {
    organization,
    user,
    setActiveInvoiceId,
    changeSubView,
    changeView,
    openSnackBar,
    pageParams,
    setDates,
    userPermissions,
    currentUserInfo,
    estimateName,
  } = useContext(AppContext);
  const initialState = {
    invoiceType: '',
    orgLocation: '',
    termsCondition: '',
    billBreakup: '',
  };
  const dispatch = useDispatch();
  const {
    createInvoiceState,
    recurringUpdateState,
    lineItemsState,
    modifyItemsState,
  } = useSelector((value) => value.Invoice);

  const { EInvoiceState } = useSelector((val) => val.EInvoiceSettings);

  const { stateGeneral, customerEntity, pincodeDetailsState } = useSelector(
    (value) => value.General,
  );

  const INVOICE_TYPES = [
    {
      text: 'Tax Invoice',
      payload: 'tax_invoice',
    },
    {
      text: `${capitalizeFirstLetter(estimateName)}`,
      payload: 'estimate',
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
      text: 'Test Invoice',
      payload: 'test_invoice',
    },
  ];

  const [taxType, setTaxType] = useState();
  const [taxValue, setTaxValue] = useState();
  const [html, sethtml] = useState();
  const [invoiceDate, setInvoiceDate] = useState('');
  const [customerList, setCustomerList] = useState([]);
  const [orgLocationList, setOrgLocationList] = useState([]);
  // const [customerLocationList, setCustomerLocationList] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [customerLocationId, setCustomerLocationId] = useState('');
  const [customerDeliveryLocationId, setCustomerDeliveryLocationId] =
    useState('');
  const [isSameAsDelivery, setIsSameAsDelivery] = useState(true);
  const [itemList, setItemList] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [placeOfSupply, setPlaceOfSupply] = useState();
  const [terms, setTerms] = useState('');
  const [orgLocationId, setOrgLocationId] = useState('');
  const [orgLocationValue, setOrgLocationValue] = useState('');
  const [initstate, setState] = useState(initialState);
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [gstData, setGstData] = useState('');
  const [onLoadInvoiceView, setInvoiceView] = useState(true);
  const [pdfView, setPdfView] = useState(false);
  const [successView, setSuccessView] = useState(false);
  const [editCustomer, setEditCustomer] = useState({
    open: false,
    editValue: {},
  });
  // const [custAddr1, setCustAddr1] = useState('');
  // const [custAddr2, setCustAddr2] = useState('');
  // const [addrPincode, setAddrPincode] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrCustState, setAddrCustState] = useState('');
  const classes = useStyles();
  // const [custAddrDeliver1, setCustAddrDeliver1] = useState('');
  // const [custAddrDeliver2, setCustAddrDeliver2] = useState('');
  // const [addrDeliverPincode, setAddrDeliverPincode] = useState('');
  const [addrDeliverCity, setAddrDeliverCity] = useState('');
  const [addrDeliverCustState, setAddrDeliverCustState] = useState('');
  const [estimatePDF, setEstimatePDF] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState(null);
  const navigate = Router.useNavigate();
  const { state } = Router.useLocation();
  const themes = Mui.useTheme();
  const desktopView = Mui.useMediaQuery(themes.breakpoints.up('sm'));
  const device = localStorage.getItem('device_detect');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [remainder, setRemainder] = useState('');
  const [deliveryDate, setDeliveryDate] = useState();
  const [searchPlace, setSearchPlace] = useState('');
  const [tempTerms, setTempTerms] = useState(terms);
  const [newItem, setNewItem] = useState('');
  const [currencyType, setCurrencyType] = useState('INR');
  const [CURRENCY_TYPE, setCURRENCY_TYPE] = useState([]);
  const [searchQuery, setSearchQuery] = useState({ currencySearch: '' });
  const [updatedDetails, setUpdatedDetails] = useState({
    customerDetails: {},
    lineItems: {},
  });

  const [eInvoice, setEInvoice] = useState({
    generate_e_invoice: false,
    generate_e_way_bill: false,
  });

  const [pagination, setPagination] = useState({
    totalPage: 1,
    currentPage: 1,
  });
  const [thresholdLimit, setThresholdLimit] = useState(false);
  const [customFieldPermission, setCustomFieldPermission] = useState(false);
  const [thresholdLimitPopup, setThresholdLimitPopup] = useState({
    open: false,
  });
  /**
      Template states
     */
  const [templateName, setTemplateName] = useState<string>('');
  const pathName = window.location.pathname;
  const [userRoles, setUserRoles] = useState({});
  const [userRolesPeople, setUserRolesPeople] = useState({});
  const [havePermission, setHavePermission] = useState({ open: false });
  const [noteTypeWithShow, setNoteTypeWithShow] = useState({
    show: false,
    note: '',
    customer: '',
    invoice: '',
  });
  const [drawer, setDrawer] = useState({
    date: false,
    invoiceType: false,
    orgLocation: false,
    termsCondition: false,
    billBreakup: false,
    shippingAdderss: false,
    billingAddress: false,
    placeOfSupplyDrawer: false,
    deletePopup: false,
    currencyType: false,
    BankList: false,
    SalesPerson: false,
  });
  const [BankList, setBankList] = useState([]);
  const [SelectedBank, setSelectedBank] = useState({
    id: '',
    details: {},
  });
  const [salesPersonList, setSalesPersonList] = useState([]);
  const [SalesPerson, setSalesPerson] = useState({
    toShow: false,
    id: '',
    selected: {},
  });
  const [mockInvoice, setMockInvoice] = useState(false);
  const [gstAvailable, setGstAvailable] = useState(false);
  const [warningAvailable, setWarningAvailable] = useState(false);
  const [warningMsg, setWarningMsg] = useState([]);
  const [invoiceMinimumDate, setInvoiceMinimumDate] = useState(false);

  const VALIDATOR = {
    organization_location_id: (v) => validateRequired(v),
    document_type: (v) => validateRequired(v),
    billing_party_location_id: (v) => validateRequired(v),
    delivery_party_location_id: (v) => validateRequired(v),
    place_of_supply: (v) => (gstAvailable ? validateRequired(v) : true),
    terms: (v) => validateRequired(v),
    address_line1: (v) => validateAddress(v),
    address_line2: (v) => validateAddress(v),
    addr_pincode: (v) => validatePincode(v),
    addr_city: (v) => validateOnlyText(v),
    addr_state: (v) => validateRequired(v),
  };

  useEffect(() => {
    if (Object.keys(userPermissions?.Invoicing || {})?.length > 0) {
      if (!userPermissions?.Invoicing?.Invoicing) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRoles({ ...userPermissions?.Invoicing });
      setCustomFieldPermission({
        ...userPermissions?.Invoicing['Custom Fields'],
      });
    }
    setUserRolesPeople({ ...userPermissions?.People });
  }, [userPermissions]);

  useEffect(() => {
    if (pageParams === 'estimate') {
      setEstimatePDF(true);
    } else {
      setEstimatePDF(false);
    }
  }, [pageParams]);

  useEffect(() => {
    if (taxType === 'estimate') {
      changeSubView('estimateView', 'estimate');

      setTaxValue(
        INVOICE_TYPES.filter((ele) => ele.payload === 'estimate')[0].text,
      );
    } else if (
      taxType === 'tax_invoice' ||
      taxType === 'credit_note' ||
      taxType === 'debit_note'
    ) {
      if (
        state?.recuuringParam &&
        state?.recuuringParam?.type !== 'recurring'
      ) {
        changeSubView('invoiceCreateViewBeta', '');
        // navigate('/invoice-new');
      }
      setTaxValue(
        INVOICE_TYPES.filter((ele) => ele.payload === taxType)[0].text,
      );
    }

    return () => {
      changeSubView('', '');
    };
  }, [taxType]);

  useEffect(() => {
    dispatch(GetInvoiceOrgLocationState());
    dispatch(GetInvoiceItemsState());
    dispatch(GetInvoiceCurrencyState());
    dispatch(GetInvoiceBankDataState());
    dispatch(GetInvoiceSalesPersonState());
    dispatch(GetInvoiceCustomFieldsState());
    dispatch(GetEInvoiceState());
  }, [dispatch]);

  useEffect(() => {
    setOrgLocationList(
      createInvoiceState?.orgLocationList?.data.map((l) => ({
        payload: l.id,
        text: `${l.address_line1},${l.address_line2},${l.city},${l.state},${l.pincode},${l.country}`,
      })),
    );
    if (createInvoiceState?.orgLocationList?.data.length > 0) {
      setOrgLocationId(
        createInvoiceState?.orgLocationList?.data?.find((val) => val?.default)
          ?.id || null,
      );
      setOrgLocationValue(
        `${
          createInvoiceState?.orgLocationList?.data.filter((e) => e.default)[0]
            ?.city
        }, ${
          createInvoiceState?.orgLocationList?.data.filter((e) => e.default)[0]
            ?.country
        },`,
      );
    }
  }, [createInvoiceState?.orgLocationList]);

  useEffect(() => {
    setCURRENCY_TYPE(createInvoiceState?.currencyList?.data);
  }, [createInvoiceState?.currencyList]);

  useEffect(() => {
    setBankList(createInvoiceState?.bankDataList?.data);
  }, [createInvoiceState?.bankDataList]);

  useEffect(() => {
    setSalesPersonList(createInvoiceState?.salesPersonList?.data);
  }, [createInvoiceState?.salesPersonList]);

  // useEffect(() => {
  //   setCustomerLocationList(
  //     createInvoiceState?.customerLocationList?.data?.filter(
  //       (ele) => ele?.id === customerDeliveryLocationId,
  //     ),
  //   );
  // }, [createInvoiceState?.customerLocationList]);

  useEffect(() => {
    if (Object.keys(createInvoiceState?.itemsList || {})?.length > 0)
      setItemList([...createInvoiceState?.itemsList?.data]);
  }, [createInvoiceState?.itemsList]);

  useEffect(() => {
    if (Object.keys(createInvoiceState?.newInvoice || {})?.length > 0) {
      setUpdatedDetails((prev) => ({
        ...prev,
        customerDetails: createInvoiceState?.newInvoice,
      }));
      // setActiveInvoiceId({ activeInvoiceId: createInvoiceState?.newInvoice?.id });
      setTerms(createInvoiceState?.newInvoice?.terms);
      setTaxType(createInvoiceState?.newInvoice.document_type);
      setEInvoice({
        generate_e_invoice: createInvoiceState?.newInvoice?.generate_e_invoice,
        generate_e_way_bill:
          createInvoiceState?.newInvoice?.generate_e_way_bill,
      });
      setTaxValue(
        INVOICE_TYPES.filter(
          (ele) =>
            ele.payload === createInvoiceState?.newInvoice?.document_type,
        )[0]?.text,
      );
      setMockInvoice(createInvoiceState?.newInvoice?.mock_invoice);
      setSelectedItems(
        createInvoiceState?.newInvoice[
          mapLineItemProp[organization.activeInvoiceSubject]
        ]
          ? createInvoiceState?.newInvoice[
              mapLineItemProp[organization.activeInvoiceSubject]
            ].map((i) => i.item_id)
          : [],
      );
      setCurrencyType(createInvoiceState?.newInvoice?.currency_id);
      setSelectedBank((prev) => ({
        ...prev,
        id: createInvoiceState?.newInvoice?.bank_account_id,
      }));
      setSalesPerson((prev) => ({
        ...prev,
        id: createInvoiceState?.newInvoice?.sales_person_id,
        toShow: createInvoiceState?.newInvoice?.sales_person,
      }));
      setThresholdLimit(
        createInvoiceState?.newInvoice?.threshold_limit_crossed,
      );

      setOrgLocationId(
        createInvoiceState?.newInvoice?.organization_location_id,
      );
      if (createInvoiceState?.newInvoice?.customer_id) {
        setCustomerLocationId(
          createInvoiceState?.newInvoice?.billing_party_location_id,
        );
        setCustomerDeliveryLocationId(
          createInvoiceState?.newInvoice?.delivery_party_location_id,
        );
        setAddrCity(
          createInvoiceState?.newInvoice?.billing_party_location_json?.city,
        );
        setAddrCustState(
          createInvoiceState?.newInvoice?.billing_party_location_json?.state,
        );
        setAddrDeliverCity(
          createInvoiceState?.newInvoice?.delivery_party_location_json?.city,
        );
        setAddrDeliverCustState(
          createInvoiceState?.newInvoice?.delivery_party_location_json?.state,
        );
        setPlaceOfSupply(createInvoiceState?.newInvoice?.place_of_supply);
        setGstData(
          createInvoiceState?.newInvoice?.billing_party_location_json?.gstin ||
            '',
        );
      }

      if (createInvoiceState?.newInvoice?.gstin) {
        if (new Date().getDate() >= 12) {
          if (
            moment(createInvoiceState?.newInvoice?.date).format('MM') ===
            moment().format('MM')
          ) {
            setInvoiceDate(
              moment(new Date(createInvoiceState?.newInvoice?.date)).format(
                'DD MMM YYYY',
              ),
            );
          } else {
            setInvoiceDate(moment().format('DD MMM YYYY'));
          }
        }
      } else {
        setInvoiceDate(
          createInvoiceState?.newInvoice?.date
            ? moment(new Date(createInvoiceState?.newInvoice?.date)).format(
                'DD MMM YYYY',
              )
            : moment().format('DD MMM YYYY'),
        );
      }

      setIsSameAsDelivery(
        createInvoiceState?.newInvoice?.billing_party_location_id ===
          createInvoiceState?.newInvoice?.delivery_party_location_id,
      );
      setCustomerId(createInvoiceState?.newInvoice?.customer_id);
      setGstAvailable(Boolean(createInvoiceState?.newInvoice?.gstin));
      setWarningMsg(createInvoiceState?.newInvoice?.warning_messages);
      setWarningAvailable(createInvoiceState?.newInvoice?.warning);

      if (organization.activeInvoiceSubject === 'customer_agreements') {
        setStartDate(createInvoiceState?.newInvoice?.start_date);
        setEndDate(createInvoiceState?.newInvoice?.end_date);
        setRemainder(createInvoiceState?.newInvoice?.remainder_dates);
        setDeliveryDate(createInvoiceState?.newInvoice?.day_of_creation);
      }

      if (organization.activeInvoiceSubject === 'templates') {
        setTemplateName(createInvoiceState?.newInvoice?.template_name);
      }
    }
  }, [JSON.stringify(createInvoiceState?.newInvoice)]);

  useEffect(() => {
    if (stateGeneral?.data?.length > 0)
      setAllStates(
        stateGeneral?.data?.map((val) => ({
          payload: val?.state_name,
          text: val?.state_name,
        })),
      );
  }, [stateGeneral?.data]);

  useEffect(() => {
    setPagination({
      totalPage: customerEntity?.pages,
      currentPage: customerEntity?.page,
    });
    if (customerEntity?.data) {
      if (customerEntity?.page === 1) {
        setCustomerList(customerEntity?.data);
      } else {
        setCustomerList((prev) => [...prev, ...customerEntity?.data]);
      }
    }
  }, [JSON.stringify(customerEntity || {})]);

  useEffect(() => {
    if (Object.keys(recurringUpdateState || {})?.length > 0) {
      navigate('/invoice-recurring');
    }
    return () => {
      dispatch(ClearUpdateRecurringInvoiceState());
    };
  }, [JSON.stringify(recurringUpdateState)]);

  useEffect(() => {
    if (Object.keys(lineItemsState || {})?.length > 0) {
      setLineItems(lineItemsState?.data.map((i) => i));
      setUpdatedDetails((prev) => ({
        ...prev,
        lineItems: lineItemsState?.data.map((i) => i),
      }));
    }
  }, [lineItemsState]);

  useEffect(() => {
    if (Object.keys(pincodeDetailsState || {})?.length > 0) {
      const { city, state: stateRes } = pincodeDetailsState;

      setAddrCity(city);
      setAddrDeliverCity(city);
      setAddrCustState(stateRes);
      setAddrDeliverCustState(stateRes);

      dispatch(ClearSatePincodeDetails());
    }
  }, [pincodeDetailsState]);

  useEffect(() => {
    if (
      organization &&
      organization.orgId &&
      updatedDetails?.customerDetails?.id &&
      desktopView
    ) {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', user.activeToken);
      myHeaders.append(
        'Cookie',
        'ahoy_visit=81beb4a2-ae4e-4414-8e0c-6eddff401f95; ahoy_visitor=8aba61b6-caf3-4ef5-a0f8-4e9afc7d8d0f',
      );
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(
        `${BASE_URL}/organizations/${organization.orgId}/${
          organization.activeInvoiceSubject || 'invoices'
        }/${updatedDetails?.customerDetails?.id}.html`,
        requestOptions,
      )
        .then((response) => response.text())
        .then((result) => {
          sethtml(result);
        })
        .catch((error) => console.log('error', error));
      // };
    }
  }, [lineItems, JSON.stringify(updatedDetails?.customerDetails)]);

  useEffect(() => {
    if (
      taxType === 'credit_note' &&
      updatedDetails?.customerDetails?.customer_id &&
      updatedDetails?.customerDetails?.original_invoice_reference_number
    ) {
      setNoteTypeWithShow({
        show: false,
        note: taxType,
        customer: updatedDetails?.customerDetails?.customer_id,
        invoice:
          updatedDetails?.customerDetails?.original_invoice_reference_number,
      });
    } else if (
      taxType === 'credit_note' &&
      updatedDetails?.customerDetails?.customer_id
    ) {
      setNoteTypeWithShow((prev) => ({
        ...prev,
        show: true,
        note: taxType,
        customer: updatedDetails?.customerDetails?.customer_id,
      }));
    } else if (taxType === 'credit_note') {
      setNoteTypeWithShow((prev) => ({ ...prev, show: true, note: taxType }));
    } else {
      setNoteTypeWithShow({ show: false, note: '', customer: '', invoice: '' });
    }
  }, [
    taxType,
    updatedDetails?.customerDetails?.customer_id,
    updatedDetails?.customerDetails?.original_invoice_reference_number,
  ]);

  /**
      Recurring invoice states
     */

  const reValidate = (e) => {
    const name = e?.target?.name;
    if (!name) return;
    const value = e?.target?.value;
    setValidationErr((s) => ({ ...s, [name]: !VALIDATOR?.[name]?.(value) }));
  };

  // const onInputChange = (setter, e) => {
  //   reValidate(e);
  //   setter(e.target.value);
  // };

  // const validateAddressFields = () => {
  //   return {
  //     address_line1: !VALIDATOR?.address_line1?.(custAddrDeliver1),
  //     address_line2: !VALIDATOR?.address_line2?.(custAddrDeliver2),
  //     addr_pincode: !VALIDATOR?.addr_pincode?.(addrDeliverPincode),
  //     addr_city: !VALIDATOR?.addr_city?.(addrDeliverCity),
  //     addr_state: !VALIDATOR?.addr_state?.(addrDeliverCustState),
  //   };
  // };

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
    place_of_supply: gstAvailable ? placeOfSupply : null,
    terms,
    generate_e_invoice: !!eInvoice.generate_e_invoice,
    generate_e_way_bill: !!eInvoice.generate_e_way_bill,
  };

  const updateInvoice = (obj) => {
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
    dispatch(
      PatchInvoiceUpdateState({
        activeInvoiceSubject: organization?.activeInvoiceSubject,
        invoiceId: createInvoiceState?.newInvoice?.id,
        updateInvoiceParam: { ...params },
      }),
    );
  };

  const onDateChange = (m) => {
    if (!m) {
      openSnackBar({
        message: `Date field cannot be empty`,
        type: MESSAGE_TYPE.ERROR,
      });
      setInvoiceDate(moment().format('DD MMM yyyy'));
      return;
    }
    setInvoiceDate(m.format('DD MMM yyyy'));
    if (m.format('DD MMM yyyy') !== 'Invalid date') {
      updateInvoice({
        ...invoiceParams,
        date: m.format('yyyy-MMM-DD'),
      });
    }
  };

  const onTermsChange = (e) => {
    e.persist();
    setTempTerms(e.target.value);
  };

  const onCheckBoxChange = () => {
    setIsSameAsDelivery(!isSameAsDelivery);
  };

  const createInvoiceId = (value) => {
    if (value === 'estimate') {
      if (!userRoles?.Estimate?.create_estimate) {
        setHavePermission({ open: true, back: () => navigate('/invoice') });
        return;
      }
    } else if (value === 'tax_invoice') {
      if (!userRoles?.['Tax Invoice']?.create_invoices) {
        setHavePermission({ open: true, back: () => navigate('/invoice') });
        return;
      }
    }
    dispatch(
      PostInvoiceCreateNewState({
        activeInvoiceSubject: organization?.activeInvoiceSubject,
        createNewPayload: { document_type: value },
      }),
    );
    dispatch(
      GetInvoiceDashboardState({
        durationDate: moment().format('YYYY-MM-DD'),
      }),
    );
    setCustomerId('');
  };

  const updateRecurringInvoice = () => {
    dispatch(
      PatchUpdateRecurringInvoiceState({
        activeInvoiceSubject: 'customer_agreements',
        invoiceId: state?.recuuringParam?.id,
        updateInvoiceParam: {
          approved_invoice_id: organization.activeInvoiceId,
          start_date: startDate,
          end_date: endDate,
          day_of_creation: deliveryDate,
          schedule_type: 'monthly',
          remainder_dates: remainder,
          document_type: taxType,
        },
      }),
    );
  };

  const deleteRecurringInvoice = () => {
    dispatch(
      DeleteRecurringInvoiceState({
        activeInvoiceSubject: 'customer_agreements',
        invoiceId: state?.recuuringParam?.id,
      }),
    );
  };

  const getInvoiceById = () => {
    dispatch(
      GetInvoiceByIdState({
        activeInvoiceSubject: organization?.activeInvoiceSubject,
        invoiceId: organization?.activeInvoiceId,
      }),
    );
    dispatch(
      GetInvoiceDashboardState({
        durationDate: moment().format('YYYY-MM-DD'),
      }),
    );
  };

  const fetchCustomer = async (allParties, searchVal, pageNum) => {
    dispatch(
      GetCustomerEntityState({
        allParties: allParties || false,
        searchText: searchVal,
        pageNum: pageNum || 1,
        location: !allParties,
      }),
    );
  };

  const fetchLineItems = () => {
    dispatch(
      GetFetchLineItemsState({
        activeInvoiceSubject: organization?.activeInvoiceSubject,
        invoiceId: createInvoiceState?.newInvoice?.id,
      }),
    );
  };

  const updatePaymentTerms = (val, from) => {
    updateInvoice({
      ...invoiceParams,
      ...val,
    });
    if (from?.name === 'invoiceReason') {
      dispatch(
        GetInvoiceItemsState({ customerId, invoiceId: from?.invoice_id }),
      );
    }
  };

  const createLineItem = (itemId, updatedLineItem) => {
    let itemData;
    if (itemId.payload) {
      itemData = itemId.payload;
    } else if (itemId.item_id) {
      itemData = itemId.item_id;
    } else {
      itemData = itemId.id;
    }
    dispatch(
      PostCreateLineItemsState({
        activeInvoiceSubject: organization?.activeInvoiceSubject,
        invoiceId: createInvoiceState?.newInvoice?.id,
        lineItemCreateParam: {
          item_id: itemData,
          description: updatedLineItem.description,
          quantity: updatedLineItem.quantity,
          rate: updatedLineItem.price,
          amount: updatedLineItem.totalValue,
          discount: updatedLineItem.rateDiscount,
        },
      }),
    );
  };

  const deleteLineItem = (lineItemId) => {
    dispatch(
      DeleteLineItemsState({
        activeInvoiceSubject: organization?.activeInvoiceSubject,
        invoiceId: createInvoiceState?.newInvoice?.id,
        lineItemId,
      }),
    );
  };

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
    setSearchQuery((prev) => ({ ...prev, currencySearch: '' }));
  };

  const handleBottomSheet = (name, data) => {
    setDrawer((d) => ({ ...d, [name]: false }));
    if (data) setState((s) => ({ ...s, [name]: data }));
    if (initstate[name] && !data) return;
    reValidate({ target: { name, value: data } });
  };

  const termsCondition = async () => {
    if (tempTerms?.length > 0) {
      await updateInvoice({
        ...invoiceParams,
        terms: tempTerms,
      });
      setTimeout(() => setTerms(tempTerms), [1000]);
      handleBottomSheet('termsCondition');
    }
  };

  const onTaxTypeChange = async (e, element) => {
    await updateInvoice({
      ...invoiceParams,
      taxType: e.target.value || element.payload,
      document_type: e.target.value || element.payload,
    });
    if (element.payload === 'estimate') {
      navigate('/invoice-estimate');
    } else if (
      element.payload === 'tax_invoice' ||
      element.payload === 'credit_note' ||
      element.payload === 'debit_note'
    ) {
      changeSubView('invoiceCreateViewBeta', '');
      navigate('/invoice-new');
    }
    reValidate(e);
    fetchLineItems();
    handleBottomSheet('invoiceType');
  };

  const onCurrencyTypeChange = (ele) => {
    setCurrencyType(ele?.iso_code);
    updateInvoice({
      ...invoiceParams,
      currency_id: ele?.iso_code,
    });
    handleBottomSheet('currencyType');
  };

  useEffect(() => {
    if (SelectedBank?.id) {
      const temp = BankList?.find((val) => val?.id === SelectedBank?.id);
      setSelectedBank((prev) => ({ ...prev, details: temp }));
    }
  }, [SelectedBank?.id, BankList]);

  useEffect(() => {
    if (SalesPerson?.id) {
      const temp = salesPersonList?.find((val) => val?.id === SalesPerson?.id);
      setSalesPerson((prev) => ({ ...prev, selected: temp }));
    }
  }, [SalesPerson?.id, salesPersonList]);

  const onPlaceOfSupplyChange = (element) => {
    setCustomerDeliveryLocationId(element.payload);
    updateInvoice({
      ...invoiceParams,
      place_of_supply: element.payload,
    });
    window.setTimeout(() => {
      fetchLineItems();
    }, 1250);
    handleBottomSheet('placeOfSupplyDrawer');
  };

  const onProductSelect = async (e, itemListData, updatedItem) => {
    const value = e.target ? e.target.value : e;
    const toCheck = selectedItems[0].payload
      ? selectedItems.every((x) => value.includes(x.payload))
      : selectedItems.every((x) => value.includes(x.id));
    if (toCheck) {
      const newlyAddedItem = selectedItems[0].payload
        ? selectedItems.find((i) => value.includes(i.payload))
        : selectedItems.find((i) => value.includes(i.id));
      if (newlyAddedItem) {
        createLineItem(newlyAddedItem, updatedItem);
      }
    } else {
      const removedItem = value.find((i) => !selectedItems.includes(i));
      const lineItemToRemove = lineItems.find((l) => l.item_id === removedItem);
      if (lineItemToRemove) {
        deleteLineItem(lineItemToRemove.id);
      }
    }
  };

  const onProductUpdate = (lineItemId, valueObject) => {
    dispatch(
      PatchUpdateLineItemsState({
        activeInvoiceSubject: organization?.activeInvoiceSubject,
        invoiceId: createInvoiceState?.newInvoice?.id,
        lineItemId,
        lineItemUpdateParam: {
          description: valueObject.description,
          discount: valueObject.discount,
          quantity: valueObject.quantity,
          rate: valueObject.rate,
        },
      }),
    );
  };

  // const onCreateCustomerLocation = (
  //   address1,
  //   address2,
  //   pincodeAddress,
  //   cityAddress,
  //   countryAddress,
  //   custStateAddress,
  // ) => {
  //   dispatch(
  //     PostCustomerLocationState({
  //       customerId,
  //       customerLocationCreateParam: {
  //         address_line1: address1,
  //         address_line2: address2,
  //         city: cityAddress,
  //         state: custStateAddress,
  //         pincode: pincodeAddress,
  //         country: countryAddress,
  //       },
  //     }),
  //   );
  // };

  const EInvoiceBillShow = () => {
    if (
      Object.keys(createInvoiceState?.newInvoice || {})?.length > 0 &&
      createInvoiceState?.newInvoice?.customer_id
    ) {
      if (createInvoiceState?.newInvoice?.export) {
        return true;
      }
      if (
        Object.keys(
          createInvoiceState?.newInvoice?.billing_party_location_json || {},
        )?.length === 0
      ) {
        return false;
      }
      if (
        Object.keys(
          createInvoiceState?.newInvoice?.billing_party_location_json || {},
        )?.length > 0
      ) {
        if (
          !createInvoiceState?.newInvoice?.billing_party_location_json?.gstin
        ) {
          return false;
        }
        const tempLocation = createInvoiceState?.orgLocationList?.data?.find(
          (val) => val?.id === orgLocationId,
        )?.gstin?.gstin;
        if (!tempLocation) {
          return false;
        }
      }
    }
    return true;
  };

  useEffect(() => {
    if (
      Object.keys(createInvoiceState?.createCustomerLocation || {})?.length > 0
    )
      fetchCustomer();
    handleBottomSheet('shippingAdderss');
  }, [createInvoiceState?.createCustomerLocation]);

  // const onValidateCustomerLocation = (drawerName) => {
  //   const v = validateAddressFields();
  //   const valid = Object.values(v).every((val) => !val);

  //   if (!valid) {
  //     setValidationErr((s) => ({ ...s, ...v }));
  //     return;
  //   }
  //   onCreateCustomerLocation(
  //     custAddr1,
  //     custAddr2,
  //     addrPincode,
  //     addrCity,
  //     'India',
  //     addrCustState,
  //     drawerName,
  //   );
  // };

  // const fetchPincodeDetails = (code) => {
  //   dispatch(GetPincodeDetailsState({ pincode: code }));
  // };

  const onCreateProduct = ({
    productName,
    itemType,
    hsnCode,
    desc,
    unit,
    price,
    quantity,
    item_id,
    from,
  }) => {
    if (item_id) {
      dispatch(
        PatchUpdateInvoiceItemsState({
          itemId: item_id,
          from,
          customerId,
          invoiceItemUpdateParam: {
            name: productName,
            item_type: itemType,
            hsn_or_sac_code: hsnCode,
            default_description: desc,
            unit_of_measurement: unit,
            service_id: hsnCode,
            default_rate: price,
            default_quantity: quantity,
          },
        }),
      );
    } else {
      dispatch(
        PostCreateInvoiceItemsState({
          from,
          customerId,
          invoiceItemCreateParam: {
            name: productName,
            item_type: itemType,
            hsn_or_sac_code: hsnCode,
            default_description: desc,
            unit_of_measurement: unit,
            service_id: hsnCode,
            default_rate: price,
            default_quantity: quantity,
          },
        }),
      );
    }
  };

  useEffect(() => {
    if (EInvoiceState)
      setEInvoice((prev) => ({
        ...prev,
        generate_e_invoice: EInvoiceState.is_automated,
        generate_e_way_bill: false,
      }));
  }, [EInvoiceState]);

  useEffect(() => {
    if (Object.keys(modifyItemsState || {})?.length > 0) {
      if (modifyItemsState?.from?.name === 'modify') {
        fetchLineItems();
        setTimeout(
          () =>
            setNewItem({
              ...modifyItemsState?.res,
              fromModify: modifyItemsState?.from,
            }),
          1000,
        );
      } else {
        setNewItem(modifyItemsState?.res);
      }
    }
  }, [modifyItemsState]);

  const onGenerateInvoice = () => {
    if (SalesPerson?.toShow && !SalesPerson?.id) {
      openSnackBar({
        message: 'Please select any Sales person and then generate invoice!',
        type: MESSAGE_TYPE.ERROR,
      });
      return;
    }
    dispatch(
      PostGenerateNewInvoiceState({
        invoiceId: createInvoiceState?.newInvoice?.id,
      }),
    );
  };

  useEffect(() => {
    if (Object.keys(createInvoiceState?.generateNewInvoice || {})?.length > 0) {
      setPdfView(true);
      setActiveInvoiceId({
        activeInvoiceId: createInvoiceState?.newInvoice?.id,
      });
      if (estimatePDF) {
        navigate(
          `/invoice-estimate-pdf?id=${createInvoiceState?.newInvoice?.id}`,
          {
            state: {
              type: 'estimate',
              name: selectedCustomerName,
              status: createInvoiceState?.generateNewInvoice?.status,
            },
          },
        );
      } else if (state?.type === 'draft') {
        navigate(
          `/invoice-draft-pdf?id=${createInvoiceState?.newInvoice?.id}`,
          {
            state: {
              type: 'draft',
              name: selectedCustomerName,
              status: createInvoiceState?.generateNewInvoice?.status,
              documentType:
                INVOICE_TYPES.filter((ele) => ele.text === taxValue)?.[0]
                  ?.payload || taxValue,
            },
          },
        );
      } else {
        if (state?.people || pathName.includes('people')) {
          navigate(
            `/people-invoice-new-pdf?id=${createInvoiceState?.newInvoice?.id}`,
            {
              state: {
                type: 'create',
                name: selectedCustomerName,
                status: createInvoiceState?.generateNewInvoice?.status,
                documentType:
                  INVOICE_TYPES.filter((ele) => ele.text === taxValue)?.[0]
                    ?.payload || taxValue,
              },
            },
          );
        } else {
          navigate(
            `/invoice-new-pdf?id=${createInvoiceState?.newInvoice?.id}`,
            {
              state: {
                type: 'create',
                name: selectedCustomerName,
                status: createInvoiceState?.generateNewInvoice?.status,
                documentType:
                  INVOICE_TYPES.filter((ele) => ele.text === taxValue)?.[0]
                    ?.payload || taxValue,
              },
            },
          );
        }
      }
    }
  }, [createInvoiceState?.generateNewInvoice]);

  useEffect(() => {
    if (pathName.includes('/invoice-new')) {
      setLineItems([]);
      dispatch(ClearStateFetchLineItems());
    } else if (pathName.includes('/invoice-estimate')) {
      setLineItems([]);
      dispatch(ClearStateFetchLineItems());
    } else if (pathName.includes('/invoice-recurring-edit')) {
      if (
        state?.recuuringParam &&
        state?.recuuringParam?.type === 'recurring' &&
        organization?.activeInvoiceId
      ) {
        console.log('Recuuring');
      } else {
        navigate('/invoice-recurring');
        dispatch(ClearStateFetchLineItems());
      }
    }
    setInvoiceView(true);
    setPdfView(true);
    setSuccessView(false);
    if (!organization.activeInvoiceId) {
      if (
        Object.keys(userRoles?.Estimate || {})?.length > 0 &&
        Object.keys(userRoles?.['Tax Invoice'] || {})?.length > 0
      ) {
        createInvoiceId(
          pathName.includes('/invoice-estimate')
            ? 'estimate'
            : INVOICE_TYPES.find((ele) => ele.payload === state?.typeOfInvoice)
                ?.payload,
        );
      }
    }
    // setCustAddr1('');
    // setCustAddr2('');
    // setAddrPincode('');
    setAddrCity('');
    setAddrCustState('');
  }, [pathName, userRoles?.Estimate, userRoles?.['Tax Invoice'], state]);

  useEffect(() => {
    if (
      organization.activeInvoiceId &&
      state?.from !== 'pdf' &&
      (state?.from === 'editInvoice' ||
        state?.type === 'draft' ||
        state?.recuuringParam?.type === 'recurring')
    ) {
      getInvoiceById();
    }
    return () => {
      dispatch(ClearStateInvoiceCreateNew());
      dispatch(ClearStateCustomerLocation());
      dispatch(ClearStateFetchLineItems());
      dispatch(ClearStateModifyInvoiceItems());
      dispatch(ClearStateInvoiceUnsettledPayments());
      dispatch(ClearStateRasiedInvoiceList());
      dispatch(ClearStateGenerateNewInvoice());
      dispatch(ClearStateInvoiceCustomFields());
      setActiveInvoiceId({
        activeInvoiceId: '',
      });
      dispatch(
        GetInvoiceDashboardState({
          durationDate: moment().format('YYYY-MM-DD'),
        }),
      );
      dispatch(ClearStateGetEInvoice());
    };
  }, [state]);

  useEffect(() => {
    let params = {};
    if (customerLocationId && createInvoiceState?.newInvoice?.id) {
      params = {
        delivery_party_location_id: isSameAsDelivery
          ? customerLocationId
          : customerDeliveryLocationId,
        billing_party_location_id: customerLocationId,
      };
    }
    if (
      customerId &&
      state?.recuuringParam?.type !== 'recurring' &&
      createInvoiceState?.newInvoice?.id
    ) {
      updateInvoice({
        ...invoiceParams,
        customer_id: customerId,
        ...params,
      });
      user.customerId = customerId;
      dispatch(GetInvoiceItemsState({ customerId }));
    }
  }, [customerId, customerLocationId]);

  useEffect(() => {
    if (
      selectedItems &&
      selectedItems.length > 0 &&
      createInvoiceState?.newInvoice?.id
    ) {
      fetchLineItems();
    }
  }, [selectedItems]);

  useEffect(() => {
    if (customerDeliveryLocationId && customerId) {
      dispatch(GetInvoiceCustomerLocationState({ customerId }));
    }
    return () => {
      dispatch(ClearStateInvoiceCustomerLocation());
    };
  }, [customerDeliveryLocationId, customerId, dispatch]);

  // useEffect(() => {
  // if (customerLocationList && customerLocationList.length > 0) {
  // setCustAddr1(customerLocationList?.[0]?.address_line1 || '');
  // setCustAddr2(customerLocationList?.[0]?.address_line2 || '');
  // setAddrPincode(customerLocationList?.[0]?.pincode || '');
  // setAddrCity(customerLocationList?.[0]?.city || '');
  // setAddrCustState(customerLocationList?.[0]?.state || '');
  // }
  // }, [customerLocationList]);

  useEffect(() => {
    if (
      // Object.keys(
      //   createInvoiceState?.newInvoice?.billing_party_location_json || {},
      // )?.length > 0 &&
      customerId &&
      EInvoiceState?.enable_e_invoicing &&
      EInvoiceState?.is_automated &&
      taxType !== 'estimate'
    ) {
      // const tempLocation = createInvoiceState?.orgLocationList?.data?.find(
      //   (val) => val?.id === orgLocationId
      // )?.gstin?.gstin;
      setEInvoice({
        // generate_e_invoice: !!(
        //   createInvoiceState?.newInvoice?.billing_party_location_json?.gstin &&
        //   tempLocation &&
        //   EInvoiceState?.is_automated
        // ),
        generate_e_invoice: EInvoiceBillShow(),
        generate_e_way_bill:
          createInvoiceState?.newInvoice?.generate_e_way_bill,
      });
      updateInvoice({
        ...invoiceParams,
        generate_e_invoice: EInvoiceBillShow(),
        // generate_e_invoice: !!(
        //   createInvoiceState?.newInvoice?.billing_party_location_json?.gstin &&
        //   tempLocation &&
        //   EInvoiceState?.is_automated
        // ),
      });
    }
  }, [
    createInvoiceState?.newInvoice?.billing_party_location_json?.gstin,
    orgLocationId,
    customerId,
    placeOfSupply,
  ]);

  useEffect(() => {
    if (
      organization.activeInvoiceId &&
      orgLocationId &&
      startDate &&
      endDate &&
      deliveryDate &&
      createInvoiceState?.newInvoice?.id
    ) {
      updateInvoice({ ...invoiceParams });
    }
  }, [startDate, endDate, deliveryDate, templateName]);

  const empty = () => {
    // setCustAddr1('');
    // setCustAddr2('');
    // setAddrPincode('');
    setAddrCity('');
    setAddrCustState('');
    // setCustAddrDeliver1('');
    // setCustAddrDeliver2('');
    // setAddrDeliverPincode('');
    setAddrDeliverCity('');
    setAddrDeliverCustState('');
    setIsSameAsDelivery(true);
  };

  const handleBottomSheetForDelivery = () => {
    setDrawer((d) => ({ ...d, shippingAdderss: false }));
  };

  useEffect(() => {
    setDates({ status: false });
  }, []);
  useEffect(() => {
    if (state?.from === 'pdf') {
      setActiveInvoiceId({
        activeInvoiceId: '',
      });
      if (!organization?.activeInvoiceId) {
        createInvoiceId(
          pathName.includes('/invoice-estimate')
            ? 'estimate'
            : INVOICE_TYPES.find((ele) => ele.payload === state?.typeOfInvoice)
                ?.payload,
        );
      }
    }
    if (state?.people) {
      setTimeout(() => {
        setCustomerId(state?.people?.id);
      }, 2000);
    }
  }, [state]);

  const handleChangeDate = (val) => {
    setInvoiceDate(
      `${val.toLocaleString('en-IN', { day: 'numeric' })}  ${val.toLocaleString(
        'en-IN',
        { month: 'short', year: 'numeric' },
      )}`,
    );
    setDrawer((d) => ({ ...d, date: false }));

    updateInvoice({
      ...invoiceParams,
      date: moment(val).format('YYYY-MM-DD'),
    });
  };

  const CalendarSheet = () => {
    return (
      <>
        <OnlyDatePicker
          className={css.avatarForDate}
          selectedDate={invoiceDate || new Date()}
          onChange={onDateChange}
          color="#fefbf8d4"
          maxDate="none"
          minDate={
            // eslint-disable-next-line no-nested-ternary
            invoiceMinimumDate
              ? new Date().getDate() >= 12
                ? 2
                : 1
              : undefined
          }
          invoice={invoiceMinimumDate}
        />
      </>
    );
  };
  const TaxInvoiceSheet = () => {
    return (
      <SelectRightSheet
        name="invoiceType"
        onBlur={reValidate}
        error={validationErr.document_type}
        helperText={
          validationErr.document_type ? ValidationErrMsg.document_type : ''
        }
        label=" "
        open={drawer.invoiceType}
        onTrigger={onTriggerDrawer}
        onClose={handleBottomSheet}
      >
        {INVOICE_TYPES &&
          INVOICE_TYPES.map(
            (element) =>
              element?.payload !== 'test_invoice' && (
                <div
                  className={css.valueWrapper}
                  onClick={(e) => onTaxTypeChange(e, element)}
                >
                  <span
                    className={css.iconLabel}
                    style={{
                      fontWeight: taxValue === element.text ? 900 : 400,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {element.text}
                    {taxValue === element.text && (
                      <MuiIcon.Done style={{ color: '#ffbb00d1' }} />
                    )}
                  </span>
                  <hr />
                </div>
              ),
          )}
      </SelectRightSheet>
    );
  };

  const PlacesSheet = () => {
    return (
      <SelectRightSheet
        name="orgLocation"
        onBlur={reValidate}
        error={validationErr.organization_location_id}
        helperText={
          validationErr.organization_location_id
            ? ValidationErrMsg.organization_location_id
            : ''
        }
        open={drawer.orgLocation}
        onTrigger={onTriggerDrawer}
        onClose={handleBottomSheet}
      >
        <div className={css.valueHeader}>Organization Location</div>
        <div className={css.valueContainer}>
          {orgLocationList &&
            orgLocationList.map((element) => (
              <div
                className={css.valueWrapperOrg}
                onClick={async () => {
                  await updateInvoice({
                    ...invoiceParams,
                    organization_location_id: element.payload,
                  });
                  setOrgLocationValue(
                    `${
                      element.text.split(',')[
                        element.text.split(',').length - 4
                      ]
                    },${
                      element.text.split(',')[
                        element.text.split(',').length - 3
                      ]
                    }`,
                  );
                  handleBottomSheet('orgLocation');
                }}
                style={{
                  background:
                    orgLocationId === element?.payload
                      ? '#95929226'
                      : '#ededed26',
                  fontWeight: orgLocationId === element?.payload ? 600 : 400,
                }}
              >
                <span className={css.value}>{element.text}</span>
                {/* <hr /> */}
              </div>
            ))}
        </div>
      </SelectRightSheet>
    );
  };

  const TermsSheet = () => {
    return (
      <SelectRightSheet
        name="termsCondition"
        onBlur={reValidate}
        error={validationErr.organization_location_id}
        helperText={
          validationErr.organization_location_id
            ? ValidationErrMsg.organization_location_id
            : ''
        }
        open={drawer.termsCondition}
        onTrigger={onTriggerDrawer}
        onClose={handleBottomSheet}
      >
        <div className={css.valueHeader}>Terms &amp; Conditions</div>
        <div className={css.valueWrapper}>
          <div className={css.fieldRow}>
            <Input
              name="terms"
              onBlur={reValidate}
              error={validationErr.terms}
              helperText={validationErr.terms ? ValidationErrMsg.terms : ''}
              variant="standard"
              defaultValue={terms}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={onTermsChange}
              theme="light"
              multiline
              rows={8}
            />

            <Mui.Stack
              display="row"
              alignItems="flex-end"
              width="100%"
              margin="2% 0"
            >
              <Mui.Button
                disableFocusRipple
                disableElevation
                disableRipple
                disableTouchRipple
                className={css.GenerateBtnForTerms}
                disabled={tempTerms === ''}
                onClick={() => termsCondition()}
              >
                <Mui.Typography className={css.GenerateBtnText}>
                  Save
                </Mui.Typography>
              </Mui.Button>
            </Mui.Stack>
          </div>
        </div>
      </SelectRightSheet>
    );
  };

  const BillingAddress = () => {
    return (
      <SelectRightSheet
        name="billingAddress"
        open={drawer.billingAddress}
        onTrigger={onTriggerDrawer}
        onClose={handleBottomSheet}
        maxHeight="100%"
      >
        <LocationListShow
          head="Shipping"
          orgLocationList={createInvoiceState?.customerLocationList?.data}
          selectId={customerLocationId}
          handleClick={async (element) => {
            await updateInvoice({
              ...invoiceParams,
              billing_party_location_id: element?.id,
              delivery_party_location_id: isSameAsDelivery
                ? element?.id
                : customerDeliveryLocationId,
            });
            if (isSameAsDelivery) {
              setCustomerDeliveryLocationId(element?.id);
              setAddrDeliverCity(element?.city);
              setAddrDeliverCustState(element?.state);
            }
            setCustomerLocationId(element?.id);
            setAddrCity(element?.city);
            setAddrCustState(element?.state);
            handleBottomSheet('billingAddress');
          }}
        />
        <div className={css.gstCheckBox}>
          <Checkbox
            checked={isSameAsDelivery}
            onChange={onCheckBoxChange}
            classes={{ checked: classes.checked }}
          />
          <span>Use the same location for Delivery Address</span>
        </div>
        {/* <div className={css.valueHeader}>Shipping Location</div>
        <div className={css.valueWrapper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Input
                name="addr_pincode"
                label="Pincode"
                variant="standard"
                value={addrPincode}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid #A0A4AF',
                }}
                inputProps={{
                  type: 'tel',
                }}
                disabled
                onKeyPress={pincodeKeyPress}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                name="address_line1"
                value={custAddr1}
                label="Address 01"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ maxLength: 45 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" className={mainCss.endInput}>
                      {`${custAddr1?.length || 0}/45`}
                    </InputAdornment>
                  ),
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid #A0A4AF',
                }}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                name="address_line2"
                value={custAddr2}
                label="Address 02"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ maxLength: 45 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" className={mainCss.endInput}>
                      {`${custAddr2?.length || 0}/45`}
                    </InputAdornment>
                  ),
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid #A0A4AF',
                }}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                name="addr_city"
                label="Town/City"
                variant="standard"
                value={addrCity}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid #A0A4AF',
                }}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                name="addr_state"
                label="STATE"
                options={allStates}
                defaultValue={addrCustState}
                fullWidth
                disabled
              />
            </Grid>

            <div className={css.gstCheckBox}>
              <Checkbox
                checked={isSameAsDelivery}
                onChange={onCheckBoxChange}
                classes={{ checked: classes.checked }}
              />
              <span>Use the same location for Delivery Address</span>
            </div>
          </Grid>
        </div> */}
      </SelectRightSheet>
    );
  };
  const Pdfj = () => {
    const htmlFile = html;
    return (
      <iframe
        srcDoc={htmlFile?.replace(
          'div.nobreak{page-break-inside:avoid}',
          'div.nobreak{page-break-inside:avoid} ::-webkit-scrollbar {width:0px}',
        )}
        title="html"
        frameBorder="0"
        className={css.scrolling}
      />
    );
  };

  const InvoiceOnLoad = () => {
    const setTitle = () => {
      if (state?.from === 'editInvoice') {
        if (taxType === 'credit_note') {
          return 'Edit Credit note';
        }
        if (taxType === 'debit_note') {
          return 'Edit Debit note';
        }
        if (taxType === 'tax_invoice') {
          return 'Edit Invoice';
        }
        if (taxType === 'estimate') {
          return `Edit ${capitalizeFirstLetter(estimateName)}`;
        }
      }
      if (taxType === 'credit_note') {
        return 'Create Credit note';
      }
      if (taxType === 'debit_note') {
        return 'Create Debit note';
      }
      if (taxType === 'tax_invoice') {
        return 'Create Invoice';
      }
      if (taxType === 'test_invoice') {
        return 'Create Test Invoice';
      }
      if (taxType === 'estimate') {
        return `Create ${capitalizeFirstLetter(estimateName)}`;
      }

      return 'Create Invoice';
    };

    useEffect(() => {
      if (warningAvailable && warningMsg?.length > 0) {
        openSnackBar({
          message: warningMsg.join('\n'),
          type: MESSAGE_TYPE.WARNING,
        });
        fetchLineItems();
      }
    }, [warningAvailable, warningMsg]);

    useEffect(() => {
      const tempOrgLocation = createInvoiceState?.orgLocationList?.data?.find(
        (val) => val?.id === orgLocationId,
      );
      if (tempOrgLocation?.gstin?.gstin) {
        setInvoiceMinimumDate(true);
      } else {
        setInvoiceMinimumDate(false);
      }

      setOrgLocationValue(
        `${tempOrgLocation?.city}, ${tempOrgLocation?.country},`,
      );
    }, [orgLocationId]);

    return (
      <>
        {/* here */}
        {desktopView ? (
          <Mui.Stack
            direction="row"
            justifyContent="space-between"
            style={{ margin: '1rem' }}
          >
            <Mui.Stack className={css.createContainer}>
              {pdfView ? (
                <>
                  <Mui.Stack
                    style={{
                      backgroundColor: 'white',
                      margin: '1rem',
                      height: '100%',
                      borderRadius: '15px',
                    }}
                  >
                    {!html && InvoicePdfLoad()}
                    {html && Pdfj()}
                  </Mui.Stack>
                </>
              ) : (
                <GenerateInvoicePdf />
              )}
            </Mui.Stack>
            <Mui.Stack className={css.createContainer1}>
              <Mui.Stack className={css.createMarginContainer}>
                <Mui.Stack>
                  {/* title */}
                  <Mui.Stack>
                    <Mui.Typography>{setTitle()}</Mui.Typography>
                    <Mui.Divider className={css.titleDivider} />
                  </Mui.Stack>
                  {/* iconrow */}
                  <Mui.Stack
                    direction="row"
                    justifyContent="space-between"
                    mt={2}
                    className={css.iconStackRow}
                  >
                    <Mui.Stack
                      className={
                        // state?.from === 'editInvoice'
                        //   ? css.iconStackForEdit
                        (state?.recuuringParam?.type === 'recurring' &&
                          css.iconStackForHide) ||
                        css.iconStack
                      }
                    >
                      <CalendarSheet />
                      <span className={css.iconLabel}>
                        {invoiceDate
                          ? moment(invoiceDate).format('DD MMM YYYY')
                          : moment().format('DD MMM YYYY')}
                      </span>
                    </Mui.Stack>

                    {/* tax invoice */}
                    {!mockInvoice && (
                      <Mui.Stack>
                        <Mui.Stack
                          className={
                            state?.from === 'editInvoice' ||
                            state?.recuuringParam?.type === 'recurring'
                              ? css.iconStackForEdit
                              : css.iconStack
                          }
                        >
                          <Mui.Avatar
                            className={css.avatarForTop}
                            onClick={() => {
                              onTriggerDrawer('invoiceType');
                            }}
                          >
                            <InvoiceIcon />
                          </Mui.Avatar>
                          <TaxInvoiceSheet />

                          <span
                            className={css.iconLabel}
                            style={{ width: '40px' }}
                          >
                            {taxValue}
                          </span>
                        </Mui.Stack>
                      </Mui.Stack>
                    )}

                    <SelectBottomSheet
                      name="currencyType"
                      onBlur={reValidate}
                      triggerComponent={
                        <Mui.Stack>
                          <Mui.Stack className={css.iconStack}>
                            <Mui.Avatar
                              className={css.avatarForTop}
                              onClick={() => {
                                onTriggerDrawer('currencyType');
                              }}
                            >
                              <RupeeInvoiceIcon />
                            </Mui.Avatar>
                            <span className={css.iconLabel}>
                              {
                                CURRENCY_TYPE?.find(
                                  (val) => val?.iso_code === currencyType,
                                )?.name
                              }
                            </span>
                          </Mui.Stack>
                        </Mui.Stack>
                      }
                      label=" "
                      open={drawer.currencyType}
                      onTrigger={onTriggerDrawer}
                      onClose={handleBottomSheet}
                      id="overFlowHidden"
                    >
                      <div style={{ height: '100%' }}>
                        <div
                          className={css.searchFilterFull}
                          // style={{ height: '10%' }}
                        >
                          <SearchIcon className={css.searchFilterIcon} />
                          <input
                            placeholder="Search Currency"
                            onChange={(event) => {
                              event.persist();
                              setSearchQuery((prev) => ({
                                ...prev,
                                currencySearch: event?.target?.value,
                              }));
                            }}
                            value={searchQuery?.currencySearch}
                            className={css.searchFilterInputBig}
                          />
                        </div>
                        <div style={{ height: '85%', overflow: 'auto' }}>
                          {CURRENCY_TYPE &&
                            CURRENCY_TYPE?.filter(
                              (val) =>
                                val?.name
                                  ?.toLocaleLowerCase()
                                  ?.includes(
                                    searchQuery?.currencySearch?.toLocaleLowerCase(),
                                  ) ||
                                val?.iso_code
                                  ?.toLocaleLowerCase()
                                  ?.includes(
                                    searchQuery?.currencySearch?.toLocaleLowerCase(),
                                  ),
                            )?.map((element) => (
                              <div
                                className={css.valueWrapper}
                                onClick={() => onCurrencyTypeChange(element)}
                              >
                                <span
                                  className={css.iconLabel}
                                  style={{
                                    fontWeight:
                                      currencyType === element?.iso_code
                                        ? 900
                                        : 400,
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {element?.name} ({element?.iso_code})
                                  {currencyType === element?.iso_code && (
                                    <MuiIcon.Done
                                      style={{ color: '#ffbb00d1' }}
                                    />
                                  )}
                                </span>
                                <hr />
                              </div>
                            ))}
                          {CURRENCY_TYPE?.filter(
                            (val) =>
                              val?.name
                                ?.toLocaleLowerCase()
                                ?.includes(
                                  searchQuery?.currencySearch?.toLocaleLowerCase(),
                                ) ||
                              val?.iso_code
                                ?.toLocaleLowerCase()
                                ?.includes(
                                  searchQuery?.currencySearch?.toLocaleLowerCase(),
                                ),
                          )?.length === 0 && (
                            <p className={css.noData}>No Data Found</p>
                          )}
                        </div>
                      </div>
                    </SelectBottomSheet>

                    <SelectBottomSheet
                      name="BankList"
                      onBlur={reValidate}
                      triggerComponent={
                        <Mui.Stack>
                          <Mui.Stack className={css.iconStack}>
                            <Mui.Avatar
                              className={css.avatarForTop}
                              onClick={() => {
                                onTriggerDrawer('BankList');
                              }}
                            >
                              <BankInvoiceIcon />
                            </Mui.Avatar>
                            <span
                              className={css.iconLabel}
                              style={{ width: '40px' }}
                            >
                              {SelectedBank?.id
                                ? SelectedBank?.details?.bank_account_name
                                : 'Bank Info'}
                            </span>
                          </Mui.Stack>
                        </Mui.Stack>
                      }
                      label=" "
                      open={drawer.BankList}
                      onTrigger={onTriggerDrawer}
                      onClose={handleBottomSheet}
                      id="overFlowHidden"
                    >
                      <SelectBankAccount
                        ParamBankList={BankList}
                        listFunction={(val) =>
                          dispatch(GetInvoiceBankDataState({ searchText: val }))
                        }
                        onclose={() => handleBottomSheet('BankList')}
                        callFunction={updatePaymentTerms}
                        ParamSelectedBank={SelectedBank?.id}
                      />
                    </SelectBottomSheet>
                    {SalesPerson?.toShow && (
                      <SelectBottomSheet
                        name="SalesPerson"
                        onBlur={reValidate}
                        triggerComponent={
                          <Mui.Stack>
                            <Mui.Stack className={css.iconStack}>
                              <Mui.Avatar
                                className={css.avatarForTop}
                                onClick={() => {
                                  onTriggerDrawer('SalesPerson');
                                }}
                              >
                                <SalesPersonInvoiceIcon
                                  ParamSalesPersonList={BankList}
                                  // listFunction={(val) => FetchSalesPerson(val)}
                                  onclose={() =>
                                    handleBottomSheet('SalesPerson')
                                  }
                                  callFunction={updatePaymentTerms}
                                  ParamSelectedSalesPerson="{}"
                                />
                              </Mui.Avatar>
                              <span
                                className={css.iconLabel}
                                style={{ width: '40px' }}
                              >
                                {SalesPerson?.id === '' ||
                                SalesPerson?.id === null ||
                                SalesPerson?.id === undefined
                                  ? 'Sales Person'
                                  : (currentUserInfo?.id === SalesPerson?.id &&
                                      'Me') ||
                                    SalesPerson?.selected?.name}
                              </span>
                            </Mui.Stack>
                          </Mui.Stack>
                        }
                        label=" "
                        open={drawer.SalesPerson}
                        onTrigger={onTriggerDrawer}
                        onClose={handleBottomSheet}
                        id="overFlowHidden"
                      >
                        <SalesPersonList
                          ParamSalesPersonList={salesPersonList}
                          listFunction={(val) =>
                            dispatch(
                              GetInvoiceSalesPersonState({ searchText: val }),
                            )
                          }
                          onclose={() => handleBottomSheet('SalesPerson')}
                          callFunction={updatePaymentTerms}
                          ParamSelectedSalesPerson={SalesPerson?.id}
                        />
                      </SelectBottomSheet>
                    )}
                    <Mui.Stack
                      className={
                        state?.from === 'editInvoice' ||
                        state?.recuuringParam?.type === 'recurring'
                          ? css.iconStackForEdit
                          : css.iconStack
                      }
                    >
                      <Mui.Avatar
                        className={css.avatarForTop}
                        onClick={() => {
                          onTriggerDrawer('orgLocation');
                        }}
                      >
                        <LocationIcon />
                      </Mui.Avatar>
                      <PlacesSheet />
                      <span className={css.iconLabel}>{orgLocationValue}</span>
                    </Mui.Stack>
                    <Mui.Stack className={css.iconStack}>
                      <Mui.Avatar
                        className={css.avatarForTop}
                        onClick={() => {
                          onTriggerDrawer('termsCondition');
                        }}
                      >
                        <ClipboardIcon />
                      </Mui.Avatar>
                      {TermsSheet()}
                      <span className={css.iconLabel}>Terms & Conditions</span>
                    </Mui.Stack>

                    {customerId && gstAvailable && (
                      <Mui.Stack className={css.iconStack}>
                        <div className={css.iconWrapper}>
                          <SelectBottomSheet
                            name="placeOfSupplyDrawer"
                            label=" "
                            triggerComponent={
                              <Mui.Avatar
                                className={css.avatarForTop}
                                onClick={() => {
                                  setSearchPlace('');
                                  onTriggerDrawer('placeOfSupplyDrawer');
                                }}
                              >
                                <TransportIcon />
                              </Mui.Avatar>
                            }
                            open={drawer.placeOfSupplyDrawer}
                            onTrigger={onTriggerDrawer}
                            onClose={handleBottomSheet}
                          >
                            <div>
                              <div
                                className={css.searchFilter}
                                style={{ padding: '5px' }}
                              >
                                <input
                                  placeholder="Search Places"
                                  onChange={(event) =>
                                    setSearchPlace(event.target.value)
                                  }
                                  style={{ padding: '13px', width: '100%' }}
                                />
                              </div>

                              <div style={{ overflow: 'auto', height: '85vh' }}>
                                {allStates &&
                                  allStates
                                    .filter((val) =>
                                      val.text
                                        .toLocaleLowerCase()
                                        .includes(
                                          searchPlace.toLocaleLowerCase(),
                                        ),
                                    )
                                    .map((element) => (
                                      <div
                                        className={css.valueWrapper}
                                        onClick={() =>
                                          onPlaceOfSupplyChange(element)
                                        }
                                      >
                                        <span
                                          className={css.value}
                                          style={{
                                            fontWeight:
                                              placeOfSupply === element.text
                                                ? 900
                                                : 400,
                                            display: 'flex',
                                            alignItems: 'center',
                                          }}
                                        >
                                          {element.text}{' '}
                                          {placeOfSupply === element.text && (
                                            <MuiIcon.Done
                                              style={{ color: '#ffbb00d1' }}
                                            />
                                          )}
                                        </span>
                                        <hr />
                                      </div>
                                    ))}
                                {allStates.filter((val) =>
                                  val.text
                                    .toLocaleLowerCase()
                                    .includes(searchPlace.toLocaleLowerCase()),
                                )?.length === 0 && (
                                  <p className={css.noData}>No Data Found</p>
                                )}
                              </div>
                            </div>
                          </SelectBottomSheet>
                        </div>
                        <span className={css.iconLabel}>
                          {placeOfSupply || 'Place Of Supply'}
                        </span>
                      </Mui.Stack>
                    )}
                    {customerId && (
                      <Mui.Stack className={css.iconStack}>
                        <Mui.Avatar
                          className={css.avatarForTop}
                          onClick={() => {
                            onTriggerDrawer('billingAddress');
                          }}
                        >
                          <MapIcon />
                        </Mui.Avatar>
                        {BillingAddress()}
                        {addrCity === '' && addrCustState === '' ? (
                          <span className={css.iconLabel}>
                            {' '}
                            Shipping Location{' '}
                          </span>
                        ) : (
                          <span className={css.iconLabel}>
                            {addrCity}, {addrCustState}{' '}
                          </span>
                        )}
                      </Mui.Stack>
                    )}

                    {!isSameAsDelivery && (
                      <Mui.Stack className={css.iconStack}>
                        <div className={css.iconWrapper}>
                          <SelectBottomSheet
                            name="shippingAdderss"
                            triggerComponent={
                              <Mui.Avatar
                                className={css.avatarForTop}
                                onClick={() => {
                                  onTriggerDrawer('shippingAdderss');
                                }}
                              >
                                <BikeIcon />
                              </Mui.Avatar>
                            }
                            open={drawer.shippingAdderss}
                            value={orgLocationValue}
                            onTrigger={onTriggerDrawer}
                            onClose={handleBottomSheetForDelivery}
                            maxHeight="100%"
                          >
                            <LocationListShow
                              head="Delivery"
                              orgLocationList={
                                createInvoiceState?.customerLocationList?.data
                              }
                              selectId={customerDeliveryLocationId}
                              handleClick={async (element) => {
                                await updateInvoice({
                                  ...invoiceParams,
                                  delivery_party_location_id: element.id,
                                });
                                setCustomerDeliveryLocationId(element?.id);
                                setAddrDeliverCity(element?.city);
                                setAddrDeliverCustState(element?.state);
                                handleBottomSheet('shippingAdderss');
                              }}
                            />
                            {/* <div className={css.valueHeader}>
                              Delivery Location
                            </div>
                            <div className={css.valueWrapper}>
                              <Grid container spacing={3}>
                                <Grid item xs={12}>
                                  <Input
                                    name="addr_pincode"
                                    onBlur={reValidate}
                                    error={validationErr.addr_pincode}
                                    helperText={
                                      validationErr.addr_pincode
                                        ? ValidationErrMsg.addr_pincode
                                        : ''
                                    }
                                    label="Pincode"
                                    variant="standard"
                                    defaultValue={addrDeliverPincode}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    fullWidth
                                    theme="light"
                                    rootStyle={{
                                      border: '1px solid #A0A4AF',
                                    }}
                                    inputProps={{
                                      type: 'tel',
                                    }}
                                    required
                                    onChange={(e) => {
                                      onInputChange(setAddrPincode, e);
                                      setAddrDeliverPincode(e.target.value);
                                      if (e.target?.value?.length === 6) {
                                        fetchPincodeDetails(e.target.value);
                                      }
                                    }}
                                    onKeyPress={pincodeKeyPress}
                                  />
                                </Grid>
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
                                    defaultValue={custAddrDeliver1}
                                    onChange={(e) => {
                                      onInputChange(setCustAddr1, e);
                                      setCustAddrDeliver1(e.target.value);
                                    }}
                                    label="Address 01"
                                    variant="standard"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    inputProps={{ maxLength: 45 }}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment
                                          position="end"
                                          className={mainCss.endInput}
                                        >
                                          {`${
                                            custAddrDeliver1?.length || 0
                                          }/45`}
                                        </InputAdornment>
                                      ),
                                    }}
                                    fullWidth
                                    theme="light"
                                    rootStyle={{
                                      border: '1px solid #A0A4AF',
                                    }}
                                    required
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
                                    defaultValue={custAddrDeliver2}
                                    onChange={(e) => {
                                      onInputChange(setCustAddr2, e);
                                      setCustAddrDeliver2(e.target.value);
                                    }}
                                    label="Address 02"
                                    variant="standard"
                                    // defaultValue=""
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    inputProps={{ maxLength: 45 }}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment
                                          position="end"
                                          className={mainCss.endInput}
                                        >
                                          {`${
                                            custAddrDeliver2?.length || 0
                                          }/45`}
                                        </InputAdornment>
                                      ),
                                    }}
                                    fullWidth
                                    theme="light"
                                    rootStyle={{
                                      border: '1px solid #A0A4AF',
                                    }}
                                    required
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <Input
                                    name="addr_city"
                                    onBlur={reValidate}
                                    error={validationErr.addr_city}
                                    helperText={
                                      validationErr.addr_city
                                        ? ValidationErrMsg.addr_city
                                        : ''
                                    }
                                    value={addrDeliverCity}
                                    onChange={(e) => {
                                      onInputChange(setAddrCity, e);
                                      setAddrDeliverCity(e.target.value);
                                    }}
                                    label="Town/City"
                                    variant="standard"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    fullWidth
                                    theme="light"
                                    rootStyle={{
                                      border: '1px solid #A0A4AF',
                                    }}
                                    required
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <Select
                                    name="addr_state"
                                    onBlur={reValidate}
                                    error={validationErr.addr_state}
                                    helperText={
                                      validationErr.addr_state
                                        ? ValidationErrMsg.addr_state
                                        : ''
                                    }
                                    label="STATE"
                                    options={allStates}
                                    defaultValue={addrDeliverCustState}
                                    onChange={(e) => {
                                      onInputChange(setAddrCustState, e);
                                      setAddrDeliverCustState(e.target.value);
                                    }}
                                    fullWidth
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <div className={css.addCustomerFooter}>
                                    <Button
                                      variant="contained"
                                      className={css.secondary}
                                      style={{
                                        padding: '15px 35px',
                                        textTransform: 'initial',
                                      }}
                                      onClick={() => {
                                        emptyForDeliver();
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="contained"
                                      className={`${css.primary}`}
                                      style={{
                                        padding: '15px',
                                        textTransform: 'initial',
                                      }}
                                      onClick={() => {
                                        onValidateCustomerLocation(
                                          'shippingAdderss',
                                        );
                                      }}
                                    >
                                      Set Delivery Address
                                    </Button>
                                  </div>
                                </Grid>
                              </Grid>
                            </div> */}
                          </SelectBottomSheet>
                        </div>
                        {addrDeliverCity === '' &&
                        addrDeliverCustState === '' ? (
                          <span className={css.iconLabel}>
                            {' '}
                            Delivery Location{' '}
                          </span>
                        ) : (
                          <span className={css.iconLabel}>
                            {addrDeliverCity}, {addrDeliverCustState}{' '}
                          </span>
                        )}
                      </Mui.Stack>
                    )}
                  </Mui.Stack>
                  <Mui.Stack className={css.fieldsB}>
                    <Mui.Stack className={css.fieldRowB}>
                      <SelectCustomer
                        customerListValue={customerList}
                        onCreateCustomer={async (cus_id) => {
                          await fetchCustomer();
                          setCustomerId(cus_id);
                        }}
                        setCustomerId={setCustomerId}
                        gstData={gstData}
                        HideExpandMoreIcon
                        customerId={customerId}
                        empty={empty}
                        setItemList={setItemList}
                        setCustName={setSelectedCustomerName}
                        desktop
                        hideChange={
                          state?.from === 'editInvoice' ||
                          state?.recuuringParam?.type === 'recurring'
                        }
                        callFunction={fetchCustomer}
                        setCustomerLocationId={setCustomerLocationId}
                        pagination={pagination}
                        setPagination={setPagination}
                        customerCreation={
                          userRolesPeople?.Customers?.create_customers
                        }
                      />
                    </Mui.Stack>
                  </Mui.Stack>

                  {(taxType === 'credit_note' || taxType === 'debit_note') && (
                    <div className={css.fieldsB}>
                      <div className={css.fieldRowB} style={{ width: '100%' }}>
                        <InvoiceAndReason
                          selectCustomer={updatedDetails?.customerDetails}
                          callFunction={updatePaymentTerms}
                          taxType={taxType}
                        />
                      </div>
                    </div>
                  )}

                  <div className={css.fieldsB}>
                    <div className={css.fieldRowB}>
                      <SelectProductService
                        ITEM_CATEGORIES={ITEM_CATEGORIES}
                        itemList={itemList}
                        customerId={customerId}
                        setSelectedItems={setSelectedItems}
                        onProductSelect={onProductSelect}
                        onProductUpdate={onProductUpdate}
                        deleteLineItem={deleteLineItem}
                        fetchLineItems={fetchLineItems}
                        lineItems={lineItems}
                        selectedItems={selectedItems}
                        onCreateProduct={onCreateProduct}
                        newlyAddedItem={newItem}
                        HideExpandMoreIcon
                        taxType={taxType}
                        noteTypeWithShow={noteTypeWithShow}
                        currencyType={currencyType}
                        gstAvailable={gstAvailable}
                      />
                    </div>
                    <Mui.Stack
                      className={css.fieldRowGrandTotalB}
                      direction="row"
                    >
                      <Mui.Stack className={css.grandTotalTextB}>
                        <Mui.Typography className={css.text}>
                          GRAND TOTAL
                        </Mui.Typography>
                      </Mui.Stack>
                      <Mui.Stack className={css.grandTotalAmtB}>
                        {lineItems.length > 0
                          ? customCurrency(
                              currencyType || 'INR',
                              'en-IN',
                            ).format(
                              lineItems?.reduce(
                                (acc, val) => acc + parseInt(val?.total, 10),
                                0,
                              ),
                            )
                          : customCurrency(
                              currencyType || 'INR',
                              'en-IN',
                            ).format(0)}
                      </Mui.Stack>
                    </Mui.Stack>
                    {/* </div> */}
                  </div>

                  {taxType !== 'credit_note' && (
                    <div className={css.fieldsB} style={{ marginTop: 25 }}>
                      <div className={css.fieldRowB} style={{ width: '100%' }}>
                        <PaymentTerms
                          selectCustomer={updatedDetails?.customerDetails}
                          callFunction={updatePaymentTerms}
                          lineItems={updatedDetails?.lineItems}
                        />
                      </div>
                    </div>
                  )}

                  <div className={css.fieldsB} style={{ marginTop: 25 }}>
                    <div className={css.fieldRowB} style={{ width: '100%' }}>
                      <CustomField
                        selectCustomer={updatedDetails?.customerDetails}
                        callFunction={updatePaymentTerms}
                        customFieldPermission={customFieldPermission}
                      />
                    </div>
                  </div>
                  {EInvoiceState?.enable_e_invoicing &&
                    taxType !== 'estimate' &&
                    EInvoiceBillShow() && (
                      <div className={css.fieldsB} style={{ marginTop: 25 }}>
                        <div
                          className={css.fieldRowB}
                          style={{ width: '100%' }}
                        >
                          <EInvoiceBill
                            data={eInvoice}
                            OnChange={(e) => {
                              setEInvoice((prev) => ({
                                ...prev,
                                [e?.target?.name]: e?.target?.checked,
                              }));

                              updateInvoice({
                                ...invoiceParams,
                                [e?.target?.name]: e?.target?.checked,
                              });
                            }}
                          />
                        </div>
                      </div>
                    )}
                  {state?.recuuringParam &&
                  state?.recuuringParam?.type === 'recurring' &&
                  remainder !== '' &&
                  state?.from === 'edit' ? (
                    <div style={{ marginTop: '2rem' }}>
                      {' '}
                      <RecurringSheet
                        id="chats"
                        startDateData={startDate}
                        endDateData={endDate}
                        remainderData={remainder}
                        day={deliveryDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        setRemainder={setRemainder}
                        setSendDate={setDeliveryDate}
                        custName={state?.name}
                      />{' '}
                      <div>
                        <Button
                          variant="contained"
                          className={
                            desktopView
                              ? css.submitEdit
                              : `${css.submitButton} ${css.borderRadius}`
                          }
                          fullWidth
                          onClick={() => {
                            updateRecurringInvoice();
                          }}
                          disabled={!(lineItems && lineItems.length > 0)}
                        >
                          Update Recurring Invoice
                        </Button>
                      </div>
                      <div>
                        <Button
                          variant="contained"
                          className={`${css.secondarySubmitBtn} ${css.borderRadius}`}
                          fullWidth
                          onClick={() => {
                            setDrawer((prev) => ({
                              ...prev,
                              deletePopup: true,
                            }));
                          }}
                          disabled={!(lineItems && lineItems.length > 0)}
                        >
                          Cancel Recurring Invoice
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Mui.Stack
                      style={{
                        marginTop: '20px',
                        width: '100%',
                        alignItems: 'center',
                      }}
                    >
                      <Mui.Button
                        variant="contained"
                        className={css.GenerateBtn}
                        fullWidth
                        onClick={() => {
                          if (thresholdLimit) {
                            setThresholdLimitPopup((prev) => ({
                              ...prev,
                              open: true,
                            }));
                          } else {
                            onGenerateInvoice();
                          }
                        }}
                        disabled={!(lineItems && lineItems.length > 0)}
                        style={{
                          cursor: 'pointer',
                          width: eInvoice.generate_e_invoice && '200px',
                        }}
                      >
                        <Mui.Typography className={css.GenerateBtnText}>
                          {eInvoice.generate_e_invoice
                            ? 'Generate E-Invoice'
                            : 'Generate'}
                        </Mui.Typography>
                      </Mui.Button>
                    </Mui.Stack>
                  )}
                </Mui.Stack>
              </Mui.Stack>
            </Mui.Stack>
          </Mui.Stack>
        ) : (
          //  here
          <div
            className={css.createInvoiceContainer}
            style={{ backgroundColor: '#F2F2F0' }}
          >
            <div className={css.fieldWrapper}>
              <div className={css.iconRow}>
                <div
                  className={
                    (state?.recuuringParam?.type === 'recurring' &&
                      css.iconStackForHide) ||
                    css.iconContainer
                  }
                >
                  <div
                    className={
                      // state?.from === 'editInvoice' ||
                      state?.recuuringParam?.type === 'recurring'
                        ? css.iconWrapperForEdit
                        : css.iconWrapper
                    }
                  >
                    <SelectBottomSheet
                      name="date"
                      triggerComponent={
                        <CalendarIcon
                          className={css.iconField}
                          onClick={() => {
                            onTriggerDrawer('date');
                          }}
                        />
                      }
                      open={drawer.date}
                      onTrigger={onTriggerDrawer}
                      onClose={handleBottomSheet}
                      addNewSheet
                    >
                      <Calender
                        head="Select Date"
                        button="Select"
                        handleDate={handleChangeDate}
                        max={invoiceMinimumDate}
                      />
                    </SelectBottomSheet>
                  </div>
                  <span className={css.iconLabel}>
                    {invoiceDate
                      ? moment(invoiceDate).format('DD MMM YYYY')
                      : moment().format('DD MMM YYYY')}
                  </span>
                </div>
                {!mockInvoice && (
                  <div className={css.iconContainer}>
                    <div
                      className={
                        state?.from === 'editInvoice' ||
                        state?.recuuringParam?.type === 'recurring'
                          ? css.iconWrapperForEdit
                          : css.iconWrapper
                      }
                    >
                      <SelectBottomSheet
                        name="invoiceType"
                        onBlur={reValidate}
                        error={validationErr.document_type}
                        helperText={
                          validationErr.document_type
                            ? ValidationErrMsg.document_type
                            : ''
                        }
                        label=" "
                        addNewSheet
                        triggerComponent={
                          <InvoiceIcon
                            className={css.iconField}
                            onClick={() => {
                              onTriggerDrawer('invoiceType');
                            }}
                          />
                        }
                        open={drawer.invoiceType}
                        value={taxValue}
                        onTrigger={onTriggerDrawer}
                        onClose={handleBottomSheet}
                      >
                        {INVOICE_TYPES &&
                          INVOICE_TYPES.map(
                            (element) =>
                              element?.payload !== 'test_invoice' && (
                                <div
                                  className={css.valueWrapper}
                                  onClick={(e) => onTaxTypeChange(e, element)}
                                >
                                  <span
                                    className={css.value}
                                    style={{
                                      fontWeight:
                                        taxType === element?.payload
                                          ? 900
                                          : 400,
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    {element.text}
                                    {taxType === element?.payload && (
                                      <MuiIcon.Done
                                        style={{ color: '#ffbb00d1' }}
                                      />
                                    )}
                                  </span>
                                  <hr />
                                </div>
                              ),
                          )}
                      </SelectBottomSheet>
                    </div>
                    <span className={css.iconLabel}>{taxValue}</span>
                  </div>
                )}
                <div className={css.iconContainer}>
                  <div className={css.iconWrapper}>
                    <SelectBottomSheet
                      name="currencyType"
                      onBlur={reValidate}
                      label=" "
                      addNewSheet
                      triggerComponent={
                        <RupeeInvoiceIcon
                          className={css.iconField}
                          onClick={() => {
                            onTriggerDrawer('currencyType');
                          }}
                        />
                      }
                      open={drawer.currencyType}
                      value={currencyType}
                      onTrigger={onTriggerDrawer}
                      onClose={handleBottomSheet}
                      id="overFlowHidden"
                    >
                      <div style={{ height: 'auto' }}>
                        <div
                          className={css.searchFilterFull}
                          // style={{ height: '10%' }}
                        >
                          <SearchIcon className={css.searchFilterIcon} />
                          <input
                            placeholder="Search Currency"
                            onChange={(event) => {
                              event.persist();
                              setSearchQuery((prev) => ({
                                ...prev,
                                currencySearch: event?.target?.value,
                              }));
                            }}
                            value={searchQuery?.currencySearch}
                            className={css.searchFilterInputBig}
                          />
                        </div>
                        <div style={{ height: '85%', overflow: 'auto' }}>
                          {CURRENCY_TYPE &&
                            CURRENCY_TYPE?.filter(
                              (val) =>
                                val?.name
                                  ?.toLocaleLowerCase()
                                  ?.includes(
                                    searchQuery?.currencySearch?.toLocaleLowerCase(),
                                  ) ||
                                val?.iso_code
                                  ?.toLocaleLowerCase()
                                  ?.includes(
                                    searchQuery?.currencySearch?.toLocaleLowerCase(),
                                  ),
                            )?.map((element) => (
                              <div
                                className={css.valueWrapper}
                                onClick={() => onCurrencyTypeChange(element)}
                              >
                                <span
                                  className={css.iconLabel}
                                  style={{
                                    fontWeight:
                                      currencyType === element?.iso_code
                                        ? 900
                                        : 400,
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  {element?.name} ({element?.iso_code})
                                  {currencyType === element?.iso_code && (
                                    <MuiIcon.Done
                                      style={{ color: '#ffbb00d1' }}
                                    />
                                  )}
                                </span>
                                <hr />
                              </div>
                            ))}
                          {CURRENCY_TYPE?.filter(
                            (val) =>
                              val?.name
                                ?.toLocaleLowerCase()
                                ?.includes(
                                  searchQuery?.currencySearch?.toLocaleLowerCase(),
                                ) ||
                              val?.iso_code
                                ?.toLocaleLowerCase()
                                ?.includes(
                                  searchQuery?.currencySearch?.toLocaleLowerCase(),
                                ),
                          )?.length === 0 && (
                            <p className={css.noData}>No Data Found</p>
                          )}
                        </div>
                      </div>
                    </SelectBottomSheet>
                  </div>
                  <span className={css.iconLabel}>
                    {
                      CURRENCY_TYPE?.find(
                        (val) => val?.iso_code === currencyType,
                      )?.name
                    }
                  </span>
                </div>

                <div className={css.iconContainer}>
                  <div className={css.iconWrapper}>
                    <SelectBottomSheet
                      name="BankList"
                      onBlur={reValidate}
                      label=" "
                      triggerComponent={
                        <BankInvoiceIcon
                          className={css.iconField}
                          onClick={() => {
                            onTriggerDrawer('BankList');
                          }}
                        />
                      }
                      open={drawer.BankList}
                      // value={BankList}
                      onTrigger={onTriggerDrawer}
                      onClose={handleBottomSheet}
                      id="overFlowHidden"
                    >
                      <SelectBankAccount
                        ParamBankList={BankList}
                        listFunction={(val) =>
                          dispatch(GetInvoiceBankDataState({ searchText: val }))
                        }
                        onclose={() => handleBottomSheet('BankList')}
                        callFunction={updatePaymentTerms}
                        ParamSelectedBank={SelectedBank?.id}
                      />
                    </SelectBottomSheet>
                  </div>
                  <span className={css.iconLabel}>
                    {SelectedBank?.id && SelectedBank.details
                      ? SelectedBank?.details?.bank_account_name
                      : 'Bank Info'}
                  </span>
                </div>

                {SalesPerson?.toShow && (
                  <div className={css.iconContainer}>
                    <div className={css.iconWrapper}>
                      <SelectBottomSheet
                        name="SalesPerson"
                        onBlur={reValidate}
                        triggerComponent={
                          <SalesPersonInvoiceIcon
                            className={css.iconField}
                            onClick={() => {
                              onTriggerDrawer('SalesPerson');
                            }}
                          />
                        }
                        label=" "
                        open={drawer.SalesPerson}
                        onTrigger={onTriggerDrawer}
                        onClose={handleBottomSheet}
                        id="overFlowHidden"
                      >
                        <SalesPersonList
                          ParamSalesPersonList={salesPersonList}
                          listFunction={(val) =>
                            dispatch(
                              GetInvoiceSalesPersonState({ searchText: val }),
                            )
                          }
                          onclose={() => handleBottomSheet('SalesPerson')}
                          callFunction={updatePaymentTerms}
                          ParamSelectedSalesPerson={SalesPerson?.id}
                        />
                      </SelectBottomSheet>
                    </div>
                    <span className={css.iconLabel}>
                      {SalesPerson?.id === '' ||
                      SalesPerson?.id === null ||
                      SalesPerson?.id === undefined
                        ? 'Sales Person'
                        : (currentUserInfo?.id === SalesPerson?.id && 'Me') ||
                          SalesPerson?.selected?.name}
                    </span>
                  </div>
                )}
                <div className={css.iconContainer}>
                  <div
                    className={
                      state?.from === 'editInvoice' ||
                      state?.recuuringParam?.type === 'recurring'
                        ? css.iconWrapperForEdit
                        : css.iconWrapper
                    }
                  >
                    <SelectBottomSheet
                      name="orgLocation"
                      onBlur={reValidate}
                      error={validationErr.organization_location_id}
                      helperText={
                        validationErr.organization_location_id
                          ? ValidationErrMsg.organization_location_id
                          : ''
                      }
                      label="Organization Location"
                      triggerComponent={
                        <LocationIcon
                          className={css.iconField}
                          onClick={() => {
                            onTriggerDrawer('orgLocation');
                          }}
                        />
                      }
                      open={drawer.orgLocation}
                      value={orgLocationValue}
                      onTrigger={onTriggerDrawer}
                      onClose={handleBottomSheet}
                    >
                      <div className={css.valueHeader}>
                        Organization Location
                      </div>
                      <div className={css.valueContainer}>
                        {orgLocationList &&
                          orgLocationList.map((element) => (
                            <div
                              className={css.valueWrapperOrg}
                              onClick={async () => {
                                await updateInvoice({
                                  ...invoiceParams,
                                  organization_location_id: element.payload,
                                });
                                setOrgLocationId(element.payload);
                                setOrgLocationValue(
                                  `${
                                    element.text.split(',')[
                                      element.text.split(',').length - 4
                                    ]
                                  },${
                                    element.text.split(',')[
                                      element.text.split(',').length - 3
                                    ]
                                  }`,
                                );
                                handleBottomSheet('orgLocation');
                              }}
                              style={{
                                background:
                                  orgLocationId === element?.payload
                                    ? '#95929226'
                                    : '#ededed26',
                                fontWeight:
                                  orgLocationId === element?.payload
                                    ? 600
                                    : 400,
                              }}
                            >
                              <span className={css.value}>{element.text}</span>
                              {/* <hr /> */}
                            </div>
                          ))}
                      </div>
                    </SelectBottomSheet>
                  </div>
                  <Mui.Typography
                    align="center"
                    variant="body2"
                    className={css.iconLabel}
                  >
                    {orgLocationValue?.split(',').join('\n')}
                  </Mui.Typography>
                </div>

                <div className={css.iconContainer}>
                  <div className={css.iconWrapper}>
                    <SelectBottomSheet
                      name="termsCondition"
                      onBlur={reValidate}
                      error={validationErr.organization_location_id}
                      helperText={
                        validationErr.organization_location_id
                          ? ValidationErrMsg.organization_location_id
                          : ''
                      }
                      triggerComponent={
                        <ClipboardIcon
                          className={css.iconField}
                          onClick={() => {
                            onTriggerDrawer('termsCondition');
                          }}
                        />
                      }
                      open={drawer.termsCondition}
                      onTrigger={onTriggerDrawer}
                      onClose={handleBottomSheet}
                    >
                      <div className={css.valueHeader}>
                        Terms &amp; Conditions
                      </div>
                      <div className={css.valueWrapper}>
                        <div className={css.fieldRow}>
                          <Input
                            name="terms"
                            onBlur={reValidate}
                            error={validationErr.terms}
                            helperText={
                              validationErr.terms ? ValidationErrMsg.terms : ''
                            }
                            variant="standard"
                            defaultValue={terms}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            onChange={onTermsChange}
                            theme="light"
                            multiline
                            rows={8}
                          />
                          <Mui.Stack
                            display="row"
                            alignItems="flex-end"
                            width="100%"
                            margin="2% 0"
                          >
                            <Mui.Button
                              disableFocusRipple
                              disableElevation
                              disableRipple
                              disableTouchRipple
                              className={css.GenerateBtnForTerms}
                              disabled={tempTerms === ''}
                              onClick={() => termsCondition()}
                            >
                              <Mui.Typography className={css.GenerateBtnText}>
                                Save
                              </Mui.Typography>
                            </Mui.Button>
                          </Mui.Stack>
                        </div>
                      </div>
                    </SelectBottomSheet>
                  </div>
                  <span className={css.iconLabel}>Terms & Conditions</span>
                </div>

                {customerId && (
                  <div className={css.iconContainer}>
                    <div className={css.iconWrapper}>
                      <SelectBottomSheet
                        name="placeOfSupplyDrawer"
                        label=" "
                        triggerComponent={
                          <TransportIcon
                            className={css.iconField}
                            onClick={() => {
                              setSearchPlace('');
                              onTriggerDrawer('placeOfSupplyDrawer');
                            }}
                          />
                        }
                        open={drawer.placeOfSupplyDrawer}
                        onTrigger={onTriggerDrawer}
                        onClose={handleBottomSheet}
                        id="overflowhidden"
                        addNewSheet
                      >
                        <div style={{ height: 'auto' }}>
                          <div
                            className={css.searchFilter}
                            style={{
                              padding: '5px',
                              // height: '10%'
                            }}
                          >
                            <input
                              placeholder="Search Places"
                              onChange={(event) =>
                                setSearchPlace(event.target.value)
                              }
                              style={{ padding: '12px', width: '100%' }}
                            />
                          </div>

                          <div style={{ overflow: 'auto', height: '85%' }}>
                            {allStates &&
                              allStates
                                .filter((val) =>
                                  val.text
                                    .toLocaleLowerCase()
                                    .includes(searchPlace.toLocaleLowerCase()),
                                )
                                .map((element) => (
                                  <div
                                    className={css.valueWrapper}
                                    onClick={() =>
                                      onPlaceOfSupplyChange(element)
                                    }
                                  >
                                    <span
                                      className={css.value}
                                      style={{
                                        fontWeight:
                                          placeOfSupply === element.text
                                            ? 900
                                            : 400,
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      {element.text}
                                      {placeOfSupply === element.text && (
                                        <MuiIcon.Done
                                          style={{ color: '#ffbb00d1' }}
                                        />
                                      )}
                                    </span>
                                    <hr />
                                  </div>
                                ))}
                            {allStates.filter((val) =>
                              val.text
                                .toLocaleLowerCase()
                                .includes(searchPlace.toLocaleLowerCase()),
                            )?.length === 0 && (
                              <p className={css.noData}>No Data Found</p>
                            )}
                          </div>
                        </div>
                      </SelectBottomSheet>
                    </div>
                    <span className={css.iconLabel}>
                      {placeOfSupply || 'Place Of Supply'}
                    </span>
                  </div>
                )}

                {customerId && (
                  <div className={css.iconContainer}>
                    <div className={css.iconWrapper}>
                      <SelectBottomSheet
                        name="billingAddress"
                        triggerComponent={
                          <MapIcon
                            className={css.iconField}
                            onClick={() => {
                              onTriggerDrawer('billingAddress');
                            }}
                          />
                        }
                        open={drawer.billingAddress}
                        onTrigger={onTriggerDrawer}
                        onClose={handleBottomSheet}
                        maxHeight="100%"
                      >
                        <LocationListShow
                          head="Shipping"
                          orgLocationList={
                            createInvoiceState?.customerLocationList?.data
                          }
                          selectId={customerLocationId}
                          handleClick={async (element) => {
                            await updateInvoice({
                              ...invoiceParams,
                              billing_party_location_id: element?.id,
                              delivery_party_location_id: isSameAsDelivery
                                ? element?.id
                                : customerDeliveryLocationId,
                            });
                            if (isSameAsDelivery) {
                              setCustomerDeliveryLocationId(element?.id);
                              setAddrDeliverCity(element?.city);
                              setAddrDeliverCustState(element?.state);
                            }
                            setCustomerLocationId(element?.id);
                            setAddrCity(element?.city);
                            setAddrCustState(element?.state);
                            handleBottomSheet('billingAddress');
                          }}
                        />
                        <div className={css.gstCheckBox}>
                          <Checkbox
                            checked={isSameAsDelivery}
                            onChange={onCheckBoxChange}
                            classes={{ checked: classes.checked }}
                          />
                          <span>
                            Use the same location for Delivery Address
                          </span>
                        </div>
                        {/* <div className={css.valueHeader}>Shipping Location</div>
                        <div className={css.valueWrapper}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Input
                                name="addr_pincode"
                                label="Pincode"
                                variant="standard"
                                value={addrPincode}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                fullWidth
                                theme="light"
                                rootStyle={{
                                  border: '1px solid #A0A4AF',
                                }}
                                inputProps={{
                                  type: 'tel',
                                }}
                                disabled
                                onKeyPress={pincodeKeyPress}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Input
                                name="address_line1"
                                value={custAddr1}
                                label="Address 01"
                                variant="standard"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                inputProps={{ maxLength: 45 }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment
                                      position="end"
                                      className={mainCss.endInput}
                                    >
                                      {`${custAddr1?.length || 0}/45`}
                                    </InputAdornment>
                                  ),
                                }}
                                fullWidth
                                theme="light"
                                rootStyle={{
                                  border: '1px solid #A0A4AF',
                                }}
                                disabled
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Input
                                name="address_line2"
                                value={custAddr2}
                                label="Address 02"
                                variant="standard"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                inputProps={{ maxLength: 45 }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment
                                      position="end"
                                      className={mainCss.endInput}
                                    >
                                      {`${custAddr2?.length || 0}/45`}
                                    </InputAdornment>
                                  ),
                                }}
                                fullWidth
                                theme="light"
                                rootStyle={{
                                  border: '1px solid #A0A4AF',
                                }}
                                disabled
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Input
                                name="addr_city"
                                label="Town/City"
                                variant="standard"
                                value={addrCity}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                fullWidth
                                theme="light"
                                rootStyle={{
                                  border: '1px solid #A0A4AF',
                                }}
                                disabled
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Select
                                name="addr_state"
                                label="STATE"
                                options={allStates}
                                defaultValue={addrCustState}
                                fullWidth
                                disabled
                              />
                            </Grid>

                            <div className={css.gstCheckBox}>
                              <Checkbox
                                checked={isSameAsDelivery}
                                onChange={onCheckBoxChange}
                                classes={{ checked: classes.checked }}
                              />
                              <span>
                                Use the same location for Delivery Address
                              </span>
                            </div>
                          </Grid>
                        </div> */}
                      </SelectBottomSheet>
                    </div>
                    {addrCity === '' && addrCustState === '' ? (
                      <span className={css.iconLabel}> Shipping Location </span>
                    ) : (
                      <span className={css.iconLabel}>
                        {addrCity}, {addrCustState}{' '}
                      </span>
                    )}
                  </div>
                )}

                {!isSameAsDelivery && (
                  <div className={css.iconContainer}>
                    <div className={css.iconWrapper}>
                      <SelectBottomSheet
                        name="shippingAdderss"
                        triggerComponent={
                          <BikeIcon
                            className={css.iconField}
                            onClick={() => {
                              onTriggerDrawer('shippingAdderss');
                            }}
                          />
                        }
                        open={drawer.shippingAdderss}
                        value={orgLocationValue}
                        onTrigger={onTriggerDrawer}
                        onClose={handleBottomSheetForDelivery}
                        maxHeight="100%"
                        addNewSheet
                      >
                        <LocationListShow
                          head="Delivery"
                          orgLocationList={
                            createInvoiceState?.customerLocationList?.data
                          }
                          selectId={customerDeliveryLocationId}
                          handleClick={async (element) => {
                            await updateInvoice({
                              ...invoiceParams,
                              delivery_party_location_id: element.id,
                            });
                            setCustomerDeliveryLocationId(element?.id);
                            setAddrDeliverCity(element?.city);
                            setAddrDeliverCustState(element?.state);
                            handleBottomSheet('shippingAdderss');
                          }}
                        />
                        {/* <div className={css.valueHeader}>Delivery Location</div>
                        <div className={css.valueWrapper}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Input
                                name="addr_pincode"
                                onBlur={reValidate}
                                error={validationErr.addr_pincode}
                                helperText={
                                  validationErr.addr_pincode
                                    ? ValidationErrMsg.addr_pincode
                                    : ''
                                }
                                label="Pincode"
                                variant="standard"
                                defaultValue={addrDeliverPincode}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                fullWidth
                                theme="light"
                                rootStyle={{
                                  border: '1px solid #A0A4AF',
                                }}
                                inputProps={{
                                  type: 'tel',
                                }}
                                required
                                onChange={(e) => {
                                  onInputChange(setAddrPincode, e);
                                  setAddrDeliverPincode(e.target.value);
                                  if (e.target?.value?.length === 6) {
                                    fetchPincodeDetails(e.target.value);
                                  }
                                }}
                                onKeyPress={pincodeKeyPress}
                              />
                            </Grid>
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
                                defaultValue={custAddrDeliver1}
                                onChange={(e) => {
                                  onInputChange(setCustAddr1, e);
                                  setCustAddrDeliver1(e.target.value);
                                }}
                                label="Address 01"
                                variant="standard"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                inputProps={{ maxLength: 45 }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment
                                      position="end"
                                      className={mainCss.endInput}
                                    >
                                      {`${custAddrDeliver1?.length || 0}/45`}
                                    </InputAdornment>
                                  ),
                                }}
                                fullWidth
                                theme="light"
                                rootStyle={{
                                  border: '1px solid #A0A4AF',
                                }}
                                required
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
                                defaultValue={custAddrDeliver2}
                                onChange={(e) => {
                                  onInputChange(setCustAddr2, e);
                                  // setCustAddr2(e.target.value);
                                  setCustAddrDeliver2(e.target.value);
                                }}
                                label="Address 02"
                                variant="standard"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                inputProps={{ maxLength: 45 }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment
                                      position="end"
                                      className={mainCss.endInput}
                                    >
                                      {`${custAddrDeliver2?.length || 0}/45`}
                                    </InputAdornment>
                                  ),
                                }}
                                fullWidth
                                theme="light"
                                rootStyle={{
                                  border: '1px solid #A0A4AF',
                                }}
                                required
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Input
                                name="addr_city"
                                onBlur={reValidate}
                                error={validationErr.addr_city}
                                helperText={
                                  validationErr.addr_city
                                    ? ValidationErrMsg.addr_city
                                    : ''
                                }
                                value={addrDeliverCity}
                                onChange={(e) => {
                                  onInputChange(setAddrCity, e);
                                  setAddrDeliverCity(e.target.value);
                                }}
                                label="Town/City"
                                variant="standard"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                fullWidth
                                theme="light"
                                rootStyle={{
                                  border: '1px solid #A0A4AF',
                                }}
                                required
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Select
                                name="addr_state"
                                onBlur={reValidate}
                                error={validationErr.addr_state}
                                helperText={
                                  validationErr.addr_state
                                    ? ValidationErrMsg.addr_state
                                    : ''
                                }
                                label="STATE"
                                options={allStates}
                                defaultValue={addrDeliverCustState}
                                onChange={(e) => {
                                  onInputChange(setAddrCustState, e);
                                  setAddrDeliverCustState(e.target.value);
                                }}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <div className={css.addCustomerFooter}>
                                <Button
                                  variant="contained"
                                  className={css.secondary}
                                  style={{
                                    padding: '15px 35px',
                                    textTransform: 'initial',
                                  }}
                                  onClick={() => {
                                    emptyForDeliver();
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  className={`${css.primary}`}
                                  style={{
                                    padding: '15px',
                                    textTransform: 'initial',
                                  }}
                                  onClick={() => {
                                    onValidateCustomerLocation(
                                      'shippingAdderss',
                                    );
                                  }}
                                >
                                  Set Delivery Address
                                </Button>
                              </div>
                            </Grid>
                          </Grid>
                        </div> */}
                      </SelectBottomSheet>
                    </div>
                    {addrDeliverCity === '' && addrDeliverCustState === '' ? (
                      <span className={css.iconLabel}> Delivery Location </span>
                    ) : (
                      <span className={css.iconLabel}>
                        {addrDeliverCity}, {addrDeliverCustState}{' '}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div
                style={{
                  padding: '10px 15px 90px',
                  backgroundColor: '#F2F2F0',
                }}
              >
                <div className={css.fields}>
                  <div className={css.fieldRow}>
                    <SelectCustomer
                      customerListValue={customerList}
                      onCreateCustomer={async (cus_id) => {
                        await fetchCustomer();
                        setCustomerId(cus_id);
                      }}
                      setCustomerId={setCustomerId}
                      gstData={gstData}
                      HideExpandMoreIcon
                      customerId={customerId}
                      empty={empty}
                      setItemList={setItemList}
                      setCustName={setSelectedCustomerName}
                      hideChange={
                        state?.from === 'editInvoice' ||
                        state?.recuuringParam?.type === 'recurring'
                      }
                      callFunction={fetchCustomer}
                      setCustomerLocationId={setCustomerLocationId}
                      setEditCustomer={setEditCustomer}
                      setInvoiceView={setInvoiceView}
                      customerCreation={
                        userRolesPeople?.Customers?.create_customers
                      }
                    />
                  </div>
                </div>

                {(taxType === 'credit_note' || taxType === 'debit_note') && (
                  <div className={css.fields}>
                    <div style={{ width: '100%' }}>
                      <InvoiceAndReason
                        selectCustomer={updatedDetails?.customerDetails}
                        callFunction={updatePaymentTerms}
                        taxType={taxType}
                      />
                    </div>
                  </div>
                )}

                <div
                  className={css.fields}
                  style={{
                    paddingBottom:
                      !state?.recuuringParam &&
                      state?.recuuringParam?.type !== 'recurring' &&
                      selectedItems.length > 0 &&
                      customerId
                        ? '30px'
                        : '0px',
                  }}
                >
                  <div className={css.fieldRow}>
                    <SelectProductService
                      ITEM_CATEGORIES={ITEM_CATEGORIES}
                      itemList={itemList}
                      customerId={customerId}
                      setSelectedItems={setSelectedItems}
                      onProductSelect={onProductSelect}
                      onProductUpdate={onProductUpdate}
                      deleteLineItem={deleteLineItem}
                      fetchLineItems={fetchLineItems}
                      lineItems={lineItems}
                      selectedItems={selectedItems}
                      onCreateProduct={onCreateProduct}
                      newlyAddedItem={newItem}
                      HideExpandMoreIcon
                      taxType={taxType}
                      noteTypeWithShow={noteTypeWithShow}
                      currencyType={currencyType}
                      gstAvailable={gstAvailable}
                    />
                  </div>
                  {state?.recuuringParam &&
                  state?.recuuringParam?.type === 'recurring' &&
                  remainder !== '' ? (
                    <div className={css.fieldRowGrandTotal}>
                      <div className={css.grandTotalText}>
                        <span className={css.text} style={{ margin: 10 }}>
                          GRAND TOTAL
                        </span>
                      </div>
                      <div className={css.grandTotalAmt}>
                        {lineItems.length > 0
                          ? customCurrency(
                              currencyType || 'INR',
                              'en-IN',
                            ).format(
                              lineItems?.reduce(
                                (acc, val) => acc + parseInt(val?.total, 10),
                                0,
                              ),
                            )
                          : customCurrency(
                              currencyType || 'INR',
                              'en-IN',
                            ).format(0)}
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>

                {taxType !== 'credit_note' && (
                  <div className={css.fields} style={{ marginTop: 25 }}>
                    <div style={{ width: '100%' }}>
                      <PaymentTerms
                        selectCustomer={updatedDetails?.customerDetails}
                        callFunction={updatePaymentTerms}
                        lineItems={updatedDetails?.lineItems}
                      />
                    </div>
                  </div>
                )}

                <div className={css.fields} style={{ marginTop: 25 }}>
                  <div style={{ width: '100%' }}>
                    <CustomField
                      selectCustomer={updatedDetails?.customerDetails}
                      callFunction={updatePaymentTerms}
                      customFieldPermission={customFieldPermission}
                    />
                  </div>
                </div>
                {EInvoiceState?.enable_e_invoicing &&
                  taxType !== 'estimate' &&
                  EInvoiceBillShow() && (
                    <div className={css.fields} style={{ marginTop: 25 }}>
                      <div style={{ width: '100%' }}>
                        <EInvoiceBill
                          data={eInvoice}
                          OnChange={(e) => {
                            setEInvoice((prev) => ({
                              ...prev,
                              [e?.target?.name]: e?.target?.checked,
                            }));

                            updateInvoice({
                              ...invoiceParams,
                              [e?.target?.name]: e?.target?.checked,
                            });
                          }}
                        />
                      </div>
                    </div>
                  )}
                {state?.recuuringParam &&
                state?.recuuringParam?.type === 'recurring' &&
                remainder !== '' ? (
                  <div style={{ marginTop: '2rem' }}>
                    <RecurringSheet
                      id="chats"
                      startDateData={startDate}
                      endDateData={endDate}
                      remainderData={remainder}
                      day={deliveryDate}
                      setStartDate={setStartDate}
                      setEndDate={setEndDate}
                      setRemainder={setRemainder}
                      setSendDate={setDeliveryDate}
                      custName={state?.name}
                    />{' '}
                    <div>
                      <Button
                        variant="contained"
                        className={`${css.submitButton} ${css.borderRadius}`}
                        fullWidth
                        onClick={() => {
                          updateRecurringInvoice();
                        }}
                        disabled={!(lineItems && lineItems.length > 0)}
                      >
                        Update Recurring Invoice
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        className={`${css.secondarySubmitBtn} ${css.borderRadius}`}
                        fullWidth
                        onClick={() => {
                          setDrawer((prev) => ({ ...prev, deletePopup: true }));
                        }}
                        disabled={!(lineItems && lineItems.length > 0)}
                      >
                        Cancel Recurring Invoice
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{ position: 'fixed', bottom: '15px', width: '93%' }}
                  >
                    <div className={css.fieldRowGrandTotal}>
                      <div className={css.grandTotalText}>
                        <span className={css.text}>
                          {lineItems.length > 0
                            ? customCurrency(
                                currencyType || 'INR',
                                'en-IN',
                              ).format(
                                lineItems?.reduce(
                                  (acc, val) => acc + parseInt(val?.total, 10),
                                  0,
                                ),
                              )
                            : customCurrency(
                                currencyType || 'INR',
                                'en-IN',
                              ).format(0)}
                        </span>
                        <span
                          className={`${css.text} ${css.updatedText}`}
                          style={{ marginTop: '5px' }}
                        >
                          Grand Total
                        </span>
                      </div>
                      <Button
                        className={css.grandTotalAmt}
                        onClick={() => {
                          if (thresholdLimit) {
                            setThresholdLimitPopup((prev) => ({
                              ...prev,
                              open: true,
                            }));
                          } else {
                            onGenerateInvoice();
                          }
                        }}
                        disabled={!(lineItems && lineItems.length > 0)}
                        style={{
                          fontSize: eInvoice.generate_e_invoice && '13px',
                        }}
                      >
                        <span>
                          {eInvoice.generate_e_invoice
                            ? 'GENERATE E-Invoice'
                            : 'GENERATE'}
                        </span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <ReceivablesPopOver
          open={drawer.deletePopup}
          handleClose={() =>
            setDrawer((prev) => ({ ...prev, deletePopup: false }))
          }
          position="center"
        >
          {/* deleteInvoice(activeItem.id) */}
          <div className={css.effortlessOptions}>
            <h3>Cancel this Invoice</h3>
            <p>Are you sure you want to Cancel this Invoice?</p>

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
                onClick={() =>
                  setDrawer((prev) => ({ ...prev, deletePopup: false }))
                }
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
                  deleteRecurringInvoice();
                }}
              >
                &nbsp; OK &nbsp;
              </Button>
            </div>
          </div>
        </ReceivablesPopOver>
        <Mui.Dialog
          open={thresholdLimitPopup?.open}
          onClose={() =>
            setThresholdLimitPopup((prev) => ({ ...prev, open: false }))
          }
          maxWidth="sm"
          fullWidth
          PaperProps={{
            elevation: 3,
            style: {
              overflow: 'visible',
              borderRadius: 16,
            },
          }}
        >
          <div className={css.thresholdContainer}>
            <div className={css.header}>
              <p>GST Registration</p>
            </div>
            <div className={css.body}>
              <p>
                Dear Customer, <br /> <br />
                Your turnover is about to cross the GST registration limit of
                20/40 lakhs. <br /> <br />
                Do you want to opt for a voluntary registration?
              </p>
            </div>
            <div className={css.footer}>
              <Button
                variant="contained"
                className={css.secondary}
                style={{
                  padding: '15px 35px',
                  textTransform: 'initial',
                }}
                onClick={() => {
                  setThresholdLimitPopup((prev) => ({ ...prev, open: false }));
                  onGenerateInvoice();
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
                  setThresholdLimitPopup((prev) => ({ ...prev, open: false }));
                  onGenerateInvoice();
                }}
              >
                &nbsp; Yes &nbsp;
              </Button>
            </div>
          </div>
        </Mui.Dialog>
        {havePermission.open && (
          <PermissionDialog onClose={() => havePermission.back()} />
        )}
      </>
    );
  };

  const SuccessPage = () => {
    return (
      <div
        className={css.createInvoiceContainer}
        style={{ display: successView ? 'flex' : 'none' }}
      >
        <div className={css.fieldWrapper}>
          <div className={css.fields}>
            <div className={css.fieldRow}>
              <Grid container spacing={2} className={css.successPage}>
                <Grid item xs={12}>
                  <Typography
                    variant="h4"
                    align="center"
                    className={css.successTitle}
                  >
                    Congratulations !
                  </Typography>
                </Grid>
                <Grid item xs={12} className={css.successPageCenterd}>
                  <img src={InvoiceSuccess} alt="Well Done" />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" align="center">
                    Your Invoice has been approved.
                  </Typography>
                  <br />
                  <Typography variant="body2" align="center">
                    This Invoice can now be delivered to your Customer.
                  </Typography>
                </Grid>
                <Grid item xs={12} className={css.successPageCenterd}>
                  {/* <input type="button" value="Return to your Dashboard" className={css.primary} onClick={() => { }} /> */}
                  <Button
                    variant="contained"
                    className={css.primary}
                    onClick={() => {
                      changeView('dashboard');
                      changeSubView('');
                    }}
                  >
                    Return to your Dashboard
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const setHeading = () => {
    if (taxType === 'credit_note') {
      return 'New Credit note';
    }
    if (taxType === 'debit_note') {
      return 'New Debit note';
    }
    if (taxType === 'tax_invoice') {
      return 'New Invoice';
    }
    if (taxType === 'test_invoice') {
      return 'New Test Invoice';
    }
    if (taxType === 'estimate') {
      return `New ${capitalizeFirstLetter(estimateName)}`;
    }
    return 'New Invoice';
  };

  const heading = [
    { title: setHeading(), path: '/invoice-new', back: '/invoice' },
    {
      title: 'Draft Invoice',
      path: '/invoice-draft-new',
      back: '/invoice-draft',
    },
    {
      title: 'Recurring Invoice',
      path: '/invoice-recurring-edit',
      back: '/invoice-recurring',
    },
    {
      title: `${capitalizeFirstLetter(estimateName)}`,
      path: '/invoice-estimate',
      back: '/invoice',
    },
    { title: 'New Invoice', path: '/people-invoice-new', back: '/people' },
  ];

  return (
    <>
      <PageTitle
        title={heading?.find((val) => val?.path === pathName)?.title}
        onClick={() => {
          setActiveInvoiceId({
            activeInvoiceId: '',
          });
          dispatch(
            GetInvoiceDashboardState({
              durationDate: moment().format('YYYY-MM-DD'),
            }),
          );
          if (device === 'desktop') {
            navigate(heading?.find((val) => val?.path === pathName)?.back);
          }
          if (device === 'mobile') {
            if (editCustomer?.open) {
              setEditCustomer({ open: false, editValue: {} });
              setInvoiceView(true);
            } else {
              navigate(heading?.find((val) => val?.path === pathName)?.back);
            }
          }
        }}
      />
      <div
        className={
          device === 'mobile'
            ? cssDash.dashboardBodyContainerhideNavBar
            : cssDash.dashboardBodyContainerDesktop
        }
      >
        <div className={css.createInvoiceContainerBetaCss}>
          {successView && SuccessPage()}
          {onLoadInvoiceView && InvoiceOnLoad()}
          {editCustomer.open && (
            <>
              <div className={css.headerContainer} style={{ margin: '1rem' }}>
                <div className={css.headerLabel}>
                  {editCustomer?.editValue?.name}
                </div>
                <span className={css.headerUnderline} />
              </div>
              <InvoiceCustomer
                showValue={editCustomer.editValue}
                handleBottomSheet={() => {
                  setEditCustomer({ open: false, editValue: {} });
                  setInvoiceView(true);
                }}
                type="customers"
                openFrom="invoiceContainer"
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateInvoiceContainerBeta;

const LocationListShow = ({ head, orgLocationList, selectId, handleClick }) => {
  const device = localStorage.getItem('device_detect');
  return (
    <>
      <div className={css.valueHeader}>{head} Location</div>
      <div
        className={css.valueContainer}
        style={{ height: device === 'desktop' ? '75vh' : '60vh' }}
      >
        {orgLocationList &&
          orgLocationList
            ?.filter((val) => val?.active)
            ?.map((element) => (
              <div
                className={css.valueWrapperOrg}
                onClick={() => {
                  handleClick(element);
                }}
                style={{
                  background:
                    selectId === element?.id ? '#95929226' : '#ededed26',
                  fontWeight: selectId === element?.id ? 600 : 400,
                }}
              >
                <span className={css.value}>
                  {element?.address_line1}, {element?.address_line2 || ''},{' '}
                  {element?.city}, {element?.state}, {element?.pincode},{' '}
                  {element?.country}
                </span>
                {/* <hr /> */}
              </div>
            ))}
        {orgLocationList?.filter((val) => val?.active)?.length === 0 && (
          <div className={css.valueWrapperOrg}>
            <span className={css.value}>No Data.</span>
            {/* <hr /> */}
          </div>
        )}
      </div>
    </>
  );
};
