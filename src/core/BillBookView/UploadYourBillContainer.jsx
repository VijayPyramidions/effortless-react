/* eslint-disable no-use-before-define */
/* eslint-disable no-unreachable */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable no-lonely-if */
/* eslint-disable no-multi-assign */

/* @flow */
/**
 * @fileoverview  Create Edit Invoice Container
 */

import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  GetVendorEntityState,
  ClearSateVendorEntity,
} from '@action/Store/Reducers/General/GeneralState';
import {
  getExpenseCategory as getExpenseCategoryRedux,
  getAssetCategory as getAssetCategoryRedux,
  getVendorUnsettled as getVendorUnsettledRedux,
  // getOrgLocation,
  getOrgSetting,
  getAllLocation,
  postEntityDetail,
  getGstDetail,
  clearRecordExpenseState,
} from '@action/Store/Reducers/Bills/BillBookingState';

import {
  enableLoading,
  openSnackbar,
  closeSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import JSBridge from '@nativeBridge/jsbridge';
import { getBankList } from '@action/Store/Reducers/Banking/BankingState';

import Checkbox from '@material-ui/core/Checkbox';
import Input, { AmountFormatCustom } from '@components/Input/Input.jsx';
// import { Document, Page } from 'react-pdf'
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import Button from '@material-ui/core/Button';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { DirectUpload } from '@rails/activestorage';
import {
  Box,
  Stack,
  Typography,
  Radio,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Dialog,
  Grid,
  Table,
  TableHead,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  InputAdornment,
} from '@mui/material';
import alert from '@assets/warning.svg';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import rightArrow from '@assets/chevron-right.svg';
import axiosInst, { BASE_URL } from '@action/ApiConfig/AxiosInst';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';

import CashAccount from '@assets/BankLogo/cashaccount.svg';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import AppContext from '@root/AppContext.jsx';
import { makeStyles, Drawer, styled } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import VendorList from '@components/Vendor/VendorList';
import * as Router from 'react-router-dom';
import Done from '@mui/icons-material/Done';
import {
  validatePrice,
  validateRequired,
  validateInvoice,
  validateNum,
} from '@services/Validation.jsx';
import moment from 'moment';
// import { toInr } from '@services/Utils.js';
import Calender from '@core/InvoiceView/Calander';
import CustomSearch from '@components/SearchSheet/CustomSearch.jsx';
import { InvoiceCustomer } from '@components/Invoice/EditForm.jsx';
import ReceivablesPopOver from '@core/Receivables/Components/ReceivablesPopover';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import PageTitle from '@core/DashboardView/PageTitle';
import CircularProgress from '@mui/material/CircularProgress';
import * as cssDash from '@core/DashboardView/DashboardViewContainer.scss';
import useDebounce from '@components/Debounce/Debounce.jsx';
import AlertDialog from '@core/Banking/Categorization/ConfirmationDialog';
import MultipleBillsRecord, {
  MultipleBillSuccessDialog,
} from './components/MultipleBillsRecord';
import { EmployeeList } from './components/EmployeeList';
import PaymentTerms from '../InvoiceView/PaymentTerms';
import SuperAccUpload from './components/SuperAccUploadBillContainer';
import ExpenseCategoryList from './shared/ExpenseCategoryList';
import * as css from './UploadYourBillContainer.scss';
import AddNewVendor from './shared/AddVendor';
import SuccessView from './shared/SuccessView';
import PreviewContent from './shared/PreviewContent';
import featherupload from '../../assets/featherupload.svg';

function useStateCallback(initialState) {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null); // init mutable ref container for callbacks

  const setStateCallback = useCallback((stateParameter, cb) => {
    cbRef.current = cb; // store current, passed callback in ref
    setState(stateParameter);
  }, []); // keep object reference stable, exactly like `useState`

  useEffect(() => {
    // cb.current is `null` on initial render,
    // so we only invoke callback on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}

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
const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,

  backgroundColor: '#FFFFFF',
  border: '1px solid #F08B32',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  padding: 0,
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: '#FFFFFF',
    border: '1px solid #F08B32',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(57,75,89,.5)'
        : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#F08B32',

  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#F08B32',
  },
});

const BpRadio = (props) => {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
};

// const useStyles = makeStyles(() => ({
//   root: {
//     background: themes.colorInputBG,
//     borderColor: themes.colorInputBorder,
//     borderRadius: '8px',
//     '& .MuiInputLabel-root': {
//       margin: '0px',
//       color: `${themes.colorInputLabel} !important`,
//     },
//     '& .MuiInput-root': {
//       marginTop: '24px',
//     },
//     '& .MuiInput-multiline': {
//       paddingTop: '10px',
//     },
//     '& .MuiSelect-icon': {
//       color: `${themes.colorInputLabel} !important`,
//     },
//     '& .MuiSelect-select': {
//       borderColor: themes.colorInputBorder,
//     },
//   },
//   btnDisabled: {
//     opacity: '0.65',
//   },
// }));

const useStyles = makeStyles(() => ({
  root: {
    background: themes.colorInputBG,
    borderColor: themes.colorInputBorder,
    borderRadius: '8px',
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
  btnDisabled: {
    opacity: '0.65',
  },
  listitemRoot: {
    paddingBottom: '16px !important',
    paddingTop: '16px !important',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    '&:last-child': {
      marginBottom: 0,
      paddingBottom: '0px !important',
      borderBottom: 'none',
    },

    '&:first-child': {
      paddingTop: '0px !important',
    },

    '& .MuiListItemSecondaryAction-root': {
      right: 0,
    },
  },
  AccountText: {
    '& .MuiListItemText-primary': {
      fontWeight: 400,
      fontSize: '13px',
      lineHeight: '16px',
      color: '#2E3A59',
    },
    '& .MuiListItemText-secondary': {
      fontWeight: 300,
      fontSize: '12px',
      lineHeight: '15px',
      color: '#6E6E6E',
    },
  },
}));

export const paymentStatusListWithBill = [
  {
    id: 'company_cash',
    label: 'Paid with Company Cash',
    icon: true,
    onClose: true,
  },
  { id: 'paid_as_advance', label: 'Paid as Advance', onClose: false },
  { id: 'personal', label: 'Paid By', icon: true, onClose: false },
  { id: 'to_pay', label: 'To Pay', onClose: false },
  {
    id: 'company_card',
    label: 'Paid with Company Card',
    icon: true,
    onClose: true,
  },
  {
    id: 'company_account',
    label: 'Paid with Company Account',
    icon: true,
    onClose: true,
  },
];

export const paymentStatusListWithoutBill = [
  {
    id: 'company_cash',
    label: 'Paid with Company Cash',
    icon: true,
    onClose: true,
  },
  {
    id: 'company_card',
    label: 'Paid with Company Card',
    icon: true,
    onClose: true,
  },
  { id: 'personal', label: 'Paid By', icon: true, onClose: false },
  {
    id: 'company_account',
    label: 'Paid with Company Account',
    icon: true,
    onClose: true,
  },
];

const initialState = {
  name: '',
  amount: '',
  invoiceNo: '',
  showReloadBtn: '',
  gst: '',
  date: new Date(),
  // dueDate: new Date(),
  expenseCategory: '',
  description: '',
  location: '',
  paymentStatus: '',
  vendor: '',
  doNotTrack: false,
  igst: '',
  cgst: '',
  taxAmount: '',
  creditPeriod: 0,
  payer_id: {},
  tds_amount: '',
  bank_txn_id: '',
  accountedOn: new Date(),
};

const initialCalCAmt = {
  taxAmount: '',
  cgst: '',
  sgst: '',
  igst: '',
  tds: '',
};

const initialGSTPercentage = {
  cgstPercentage: '',
  igstPercentage: '',
  tdsPercentage: '',
};

const VIEW = {
  MAIN: 'main',
  VENDOR: 'vendor',
  DONE: 'done',
  EDIT: 'edit',
  SUPER: 'superAcc',
};

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiPaper-root': {
    minHeight: '20vh',
    maxHeight: '80vh',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
  },
}));

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const UploadYourBillContainer = ({
  haveBill: withhBill,
  pageParams,
  heading,
  categorizationvendordetails,
  bankAccountDetails,
  ExpenseDone,
  billUploadFrom,
  selectedTransactionUploadBill,
  status,
  CategorizationSelected,
  setTransactionStatus,
  purposeState,
}) => {
  let { state } = Router.useLocation();
  const dispatch = useDispatch();
  const { vendorEntity } = useSelector((value) => value.General);
  const { bankListingDetails } = useSelector((val) => val.Banking);
  const {
    ExpenseCategory,
    AssetCategory,
    VendorUnsettledList,
    orgSettings,
    allLocationAddress,
    gstDetail,
  } = useSelector((val) => val.BillBooking);
  const [paidByCompany, setPaidByCompany] = useState(false);
  const [paidByCompanyCard, setPaidByCompanyCard] = useState(false);
  const [paidByCompanyAccount, setPaidByCompanyAccount] = useState(false);

  if (
    billUploadFrom === 'bankCategorization' &&
    Object?.keys(CategorizationSelected || {})?.length > 0
  ) {
    state = { ...state, selected: { ...CategorizationSelected } };
  }
  const deviceOut = localStorage.getItem('device_detect');
  const VALIDATION =
    deviceOut === 'desktop'
      ? {
          vendor: {
            errMsg: 'Please choose Vendor',
            test: (v) =>
              !localState.doNotTrack
                ? validateRequired(v?.name ? v.name : v)
                : true,
          },

          date: {
            errMsg: 'Please provide valid date',
            test: validateRequired,
          },
          accountedOn: {
            errMsg: 'Please provide valid date',
            test: validateRequired,
          },
          // dueDate: {
          //   errMsg: 'Please provide valid date',
          //   test: () => (haveBill ? validateRequired : true),
          // },
          expenseCategory: {
            errMsg: 'Choose category',
            test: (v) => validateRequired(v?.name),
          },

          amount: {
            errMsg: 'Please provide valid amount',
            test: (v) => {
              let results;
              if (v === 0) {
                results = validateNum(v);
              } else {
                if (v?.toString()?.includes(',')) {
                  if (v?.toString()?.includes('.')) {
                    results = validatePrice(
                      Number(Number(v.replaceAll(',', '')).toFixed(2)),
                    );
                  } else {
                    results = validateNum(Number(v.replaceAll(',', '')));
                  }
                } else {
                  if (v?.toString()?.includes('.')) {
                    results = validatePrice(Number(Number(v).toFixed(2)));
                  } else {
                    results = validateNum(v);
                  }
                }
              }
              return results;
            },
          },
          invoiceNo: {
            errMsg: 'Please provide valid invoice no',
            test: () => (haveBill ? validateInvoice : true),
          },

          taxAmount: {
            errMsg: 'Please provide valid amount',
            test: (v) => {
              let results;
              if (Number(v) === 0) {
                results = false;
              } else {
                if (v.toString()?.includes(',')) {
                  if (v.toString().includes('.')) {
                    results = validatePrice(
                      Number(Number(v.replaceAll(',', '')).toFixed(2)),
                    );
                  } else {
                    results = validateNum(Number(v.replaceAll(',', '')));
                  }
                } else {
                  if (v.toString().includes('.')) {
                    results = validatePrice(Number(Number(v).toFixed(2)));
                  } else {
                    results = validateNum(v);
                  }
                }
              }
              return results;
            },
          },
          cgst: {
            errMsg: 'Please provide valid amount',
            test: (v) => {
              let results;
              if (hasNoGstin) {
                results = true;
              } else {
                if (haveBill && calcAmount?.igst) {
                  results = true;
                } else if (calcAmount?.igst) {
                  results = true;
                } else if (calcAmount?.igst === '') {
                  results = validateNum(0);
                } else {
                  if (v === 0) {
                    results = validateNum(v);
                  } else {
                    if (v?.toString()?.includes(',')) {
                      if (v?.toString()?.includes('.')) {
                        results = validatePrice(
                          Number(Number(v.replaceAll(',', '')).toFixed(2)),
                        );
                      } else {
                        results = validateNum(Number(v.replaceAll(',', '')));
                      }
                    } else {
                      if (v?.toString()?.includes('.')) {
                        results = validatePrice(Number(Number(v).toFixed(2)));
                      } else {
                        results = validateNum(v);
                      }
                    }
                  }
                }
              }

              return results;
            },
          },
          igst: {
            errMsg: 'Please provide valid amount',
            test: (v) => {
              let results;
              if (hasNoGstin) {
                results = true;
              } else {
                if (haveBill && calcAmount?.cgst) {
                  results = true;
                } else if (calcAmount?.cgst) {
                  results = true;
                } else if (calcAmount?.cgst === '') {
                  results = validateNum(0);
                } else {
                  if (v === 0) {
                    results = validateNum(v);
                  } else {
                    if (v?.toString()?.includes(',')) {
                      if (v?.toString()?.includes('.')) {
                        results = validatePrice(
                          Number(Number(v.replaceAll(',', '')).toFixed(2)),
                        );
                      } else {
                        results = validateNum(Number(v.replaceAll(',', '')));
                      }
                    } else {
                      if (v?.toString()?.includes('.')) {
                        results = validatePrice(Number(Number(v).toFixed(2)));
                      } else {
                        results = validateNum(v);
                      }
                    }
                  }
                }
              }

              return results;
            },
          },
          paymentStatus: {
            errMsg: 'Please choose Payment Status',
            test: (v) => validateRequired(v?.label),
          },
          description: {
            errMsg: 'Please provide description',
            test: () => true,
          },

          doNotTrack: {
            errMsg: '',
            test: () => true,
          },
        }
      : {
          expenseCategory: {
            errMsg: 'Choose category',
            test: (v) => validateRequired(v?.name),
          },
          vendor: {
            errMsg: 'Please choose Vendor',
            test: (v) =>
              !localState.doNotTrack
                ? validateRequired(v?.name ? v.name : v)
                : true,
          },

          amount: {
            errMsg: 'Please provide valid amount',
            test: (v) => {
              let results;
              if (v === 0) {
                results = validateNum(v);
              } else {
                if (v?.toString()?.includes(',')) {
                  if (v?.toString()?.includes('.')) {
                    results = validatePrice(
                      Number(Number(v.replaceAll(',', '')).toFixed(2)),
                    );
                  } else {
                    results = validateNum(Number(v.replaceAll(',', '')));
                  }
                } else {
                  if (v?.toString()?.includes('.')) {
                    results = validatePrice(Number(Number(v).toFixed(2)));
                  } else {
                    results = validateNum(v);
                  }
                }
              }
              return results;
            },
          },
          invoiceNo: {
            errMsg: 'Please provide valid invoice no',
            test: () => (haveBill ? validateInvoice : true),
          },
          date: {
            errMsg: 'Please provide valid date',
            test: validateRequired,
          },
          accountedOn: {
            errMsg: 'Please provide valid date',
            test: validateRequired,
          },
          paymentStatus: {
            errMsg: 'Please choose Payment Status',
            test: (v) => validateRequired(v?.label),
          },
          description: {
            errMsg: 'Please provide description',
            test: () => true,
          },

          doNotTrack: {
            errMsg: '',
            test: () => true,
          },
        };

  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const classes = useStyles();
  const {
    organization,
    registerEventListeners,
    deRegisterEventListener,
    userPermissions,
  } = useContext(AppContext);
  const selectedTransaction = selectedTransactionUploadBill;
  const fileref = useRef();
  const dragfropref = useRef();

  const [selectedCashAccount, setSelectedCashAccount] = useState({});
  const [selectedCCCard, setSelectedCCCard] = useState({});
  const [selectedCompanyAccount, setSelectedCompanyAccount] = useState({});

  const [expenseCategoryList, setExpenseCategoryList] = useState([]);
  const [assetCategoryList, setAssetCategoryList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [haveBill, setHaveBill] = useState(withhBill);
  const [vendorsUnsettledList, setVendorsUnsettledList] = useState([]);
  // const [orgLocationId, setOrgLocationId] = useState('');
  const [orgSetting, setOrgSetting] = useState();
  const [localState, setLocalState] = useStateCallback(initialState);
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [advancesData, setAdvancesData] = useState([]);
  const [drawer, setDrawer] = useState({
    expenseCategory: false,
    paymentStatus: false,
    paidAdvance: false,
    date: false,
    // dueDate: false,
    vendor: false,
    amount: false,
    preview: false,
    edit: false,
    accountedOn: false,
  });
  const [filename, setFilename] = useState('');
  const [view, setView] = useState(VIEW.MAIN);
  // eslint-disable-next-line no-unused-vars
  const [base64, setBase64] = useState('');
  const [billId, setBillId] = useState();
  const [selected, setSelected] = useState(false);
  const [unselect, setUnselect] = useState(true);
  const [calcAmount, setCalcAmount] = useState(initialCalCAmt);
  const [formattedCalcAmount, setFormattedCalcAmount] =
    useState(initialCalCAmt);
  const [billValue, setBillValue] = useState(0);
  // const [tds, setTds] = useState(0);
  const [amountPayable, setAmountPayable] = useState(0);
  const [dntCheckbox, setDntCheckbox] = useState();
  const [trigger, setTrigger] = useState('list');
  const [pdfUrl, setPdfUrl] = useState();
  const navigate = Router.useNavigate();
  const [isVendorAvailable, setIsVendorAvailable] = useState(false);
  const [typeImage, setTypeImage] = React.useState();
  const [fetchDetails, setFetchDetails] = useState();
  const [response, setResponse] = React.useState();
  const device = localStorage.getItem('device_detect');
  const [editConfirm, setEditConfirm] = React.useState({
    open: false,
    name: '',
    data: '',
    once: true,
  });
  const [editValue, setEditValue] = useState({});
  const [newLoader, setNewLoader] = React.useState({
    loader: false,
    val: 0,
    fileId: '',
    continueFlow: false,
    superAccount: false,
    superAccountSec: false,
    superAccountThrid: false,
    assigned: false,
  });
  const [hasNoGstin, setHasNoGstin] = React.useState(false);
  const debouncedForAmt = useDebounce(calcAmount?.taxAmount);
  const debouncedForCgst = useDebounce(calcAmount?.cgst);
  const debouncedForIgst = useDebounce(calcAmount?.igst);
  const debouncedForTds = useDebounce(calcAmount?.tds);
  const debouncedForDescription = useDebounce(localState?.description, 2000);
  const debouncedForInvoiceNo = useDebounce(localState?.invoiceNo);
  const [toShowBtn, setToShowBtn] = React.useState(false);
  const [donePage, setDonePage] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    totalPage: 1,
    currentPage: 1,
  });
  const [partLoad, setPartLoad] = React.useState(false);
  const [showTextData, setShowTextData] = React.useState(false);
  const [Employee, setEmployee] = React.useState({ open: false });

  const [userRoles, setUserRoles] = React.useState({});
  const [userRolesPeople, setUserRolesPeople] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });
  const [toggleModal, setToggleModal] = useState(false);
  const [expenseAccountDetails, setExpenseAccountDetails] = useState({});

  const [GSTPercentage, setGSTPercentage] = useState(initialGSTPercentage);

  // Muiltiple Bills

  const [multipleBills, setMultipleBills] = useState({
    isShow: state?.multipleBills?.length > 0,
    bills: state?.multipleBills,
    selectedBill: state?.multipleBills?.[0],
    selectedBillState: state?.selected,
  });
  const [multipleBillDoneDialog, setMultipleBillDoneDialog] = useState(false);

  const handleCloseModal = (event) => {
    const canDeductTds = event.answer === 'Yes';
    setToggleModal(false);
    updateDeductTds(canDeductTds);
  };

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Expense || {})?.length > 0) {
      if (!userPermissions?.Expense?.Expense) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRoles({ ...userPermissions?.Expense });
      setUserRolesPeople({ ...userPermissions?.People });
    }
  }, [userPermissions]);

  React.useEffect(() => {
    if (Object.keys(userRoles?.['Bill Booking'] || {})?.length > 0) {
      if (!userRoles?.['Bill Booking']?.create_bills && !state?.selected) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/bill');
            setHavePermission({ open: false });
          },
        });
      }
    }
  }, [userRoles]);

  useEffect(() => {
    dragfropref?.current?.addEventListener('dragover', HandleFileDrag);
    dragfropref?.current?.addEventListener('drop', HandleFileDrop);
    return () => {
      dragfropref?.current?.removeEventListener('dragover', HandleFileDrag);
      dragfropref?.current?.removeEventListener('drop', HandleFileDrop);
    };
  }, [dragfropref?.current]);

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value = ps?.target?.value;
    return [name, value];
  };

  const validateAllFields = (stateParam) => {
    const stateData = stateParam || localState;
    if (device === 'desktop') {
      Object.assign(stateData, { taxAmount: stateData?.amount });
    }
    // console.log('STATE', state);
    return Object.keys(VALIDATION).reduce((a, v) => {
      a[v] = !VALIDATION?.[v]?.test(stateData[v]);
      return a;
    }, {});
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };

  const handleDate = (id, val) => {
    handleBottomSheet(id, val);
  };

  const handleChange = () => {
    if (haveBill) {
      setHasNoGstin(false);
      setSelected(true);
      setUnselect(true);
      setHaveBill(false);
      if (state?.people) {
        setTimeout(() => {
          const vendorData = {
            id: state?.people?.id,
            name: state?.people?.name,
            can_deduct_tds: state?.people?.can_deduct_tds,
          };
          fetchAllAddress(vendorData?.id);
          setLocalState((s) => ({ ...s, vendor: vendorData }));
          setIsVendorAvailable(true);
        }, 1000);
      }
    } else if (!haveBill) {
      setSelected(false);
      setUnselect(true);
      setHaveBill(true);
    }
  };
  const hangleChecked = (data) => {
    if (advancesData.indexOf(data) < 0) {
      setAdvancesData((previous) => [...previous, data]);
    } else {
      setAdvancesData((previous) => [
        ...previous.filter((val) => val !== data),
      ]);
    }
  };
  const onInputChange = async (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    setLocalState((s) => ({ ...s, [name]: value }));
  };

  const getExpenseCategory = async () => {
    dispatch(getExpenseCategoryRedux());
  };

  const updateDeductTds = (canDeductTds) => {
    dispatch(enableLoading(true));
    axiosInst
      .patch(
        `organizations/${organization.orgId}/entities/${localState.vendor.id}?can_deduct_tds=${canDeductTds}&type=vendor&tds_alert_confirmed=true`,
      )
      .then((res) => {
        if (res && !res.data.error) {
          saveBills();
        }

        // if (res.data.error)
        //   dispatch(
        //     openSnackbar({
        //       message: res.data.message || 'Something went wrong',
        //       type: 'error',
        //     }),
        //   );

        dispatch(enableLoading(false));
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: e.message || 'Something went wrong',
            type: 'error',
          }),
        );
        dispatch(enableLoading(false));
      });
  };

  const getAssetCategory = async () => {
    dispatch(getAssetCategoryRedux());
  };

  const getVendorUnsettled = async () => {
    dispatch(getVendorUnsettledRedux(localState.vendor?.id));
  };

  const getVendor = async (allParties, searchVal, pageNum) => {
    dispatch(
      GetVendorEntityState({
        allParties,
        pageNum: pageNum || 1,
        searchText: searchVal || '',
        location: false,
        // entire,
      }),
    );
  };

  // const fetchOrgLocation = () => {
  //   dispatch(getOrgLocation());
  // };

  const fetchOrgSetting = () => {
    dispatch(getOrgSetting());
  };

  const fetchAllAddress = (id) => {
    dispatch(getAllLocation(id));
  };

  const handleDoNotTrackVendor = async (data) => {
    setHasNoGstin(data);
    const stateName = 'doNotTrack';
    const validationName = 'vendor';
    setValidationErr((v) => ({
      ...v,
      [validationName]: false,
    }));
    setLocalState((s) => ({ ...s, [stateName]: data }));
    setDntCheckbox(data);
    handleBottomSheet('vendor', data ? 'Do not track' : '');
    if (data) {
      await saveBills(true, {
        vendor_id: null,
        id: billId,
      });
    }
  };

  const fillOcrData = async (res) => {
    // console.log('LOOPCHECK fillOcrData');
    const {
      id,
      name,
      // document_details: docDetails,
      payment_mode: paymentId,
      vendor_id: vendorId,
      location,
      description,
      amount,
      document_number: invoiceNo,
      document_date: date,
      cgst_amount: cgst,
      sgst_amount: sgst,
      igst_amount: igst,
      expense_account: expenseAccount,
      accounted_on: accountedOn,
      tds_amount: tds,
    } = res;
    if (vendorId) await fetchAllAddress(vendorId);
    const vendor = localState?.vendor?.id
      ? localState?.vendor
      : (vendorId && res?.vendor) || res?.new_vendor;
    // const newVendor = localState?.vendor?.id ? localState?.vendor : res?.new_vendor;
    const gstNo = localState?.vendor?.id ? '' : res?.new_vendor?.gstin;
    const paymentStatus = localState?.paymentStatus?.id
      ? localState?.paymentStatus
      : paymentStatusListWithBill.find((v) => v.id === paymentId);
    // console.time('setLocalState');
    setBillId(id);
    setLocalState(
      (s) => ({
        ...s,
        name: name || '',
        amount: amount || '',
        invoiceNo: invoiceNo || '',
        date: (Number(moment(date).format('YYYY')) > 1970 && date) || '',
        description: description || '',
        location: location || '',
        paymentStatus: paymentStatus || '',
        vendor: vendor?.name ? vendor : '',
        gst: gstNo || '',
        showReloadBtn: res.vendor_id || false,
        expenseCategory: localState?.expenseCategory?.id
          ? localState?.expenseCategory
          : expenseAccount || '',
        cgst,
        sgst,
        igst,
        taxAmount: amount,
        accountedOn,
      }),
      (e) => {
        const v = validateAllFields(e);
        const valid = Object.values(v).every((val) => !val);

        if (!valid) {
          setValidationErr((s) => ({ ...s, ...v }));
        }
      },
    );
    setCalcAmount((s) => ({
      ...s,
      taxAmount: amount,
      cgst,
      sgst,
      igst,
      tds,
    }));
    setFormattedCalcAmount((s) => ({
      ...s,
      taxAmount: amount,
      cgst,
      sgst,
      igst,
    }));
    const cgstPercentageTemp = (parseFloat(cgst) / parseFloat(amount)) * 100;
    const igstPercentageTemp = (parseFloat(igst) / parseFloat(amount)) * 100;
    const tdsPercentageTemp = (parseFloat(tds) / parseFloat(amount)) * 100;
    setGSTPercentage({
      cgstPercentage: Number(`${Math.round(`${cgstPercentageTemp}e2`)}e-2`),
      igstPercentage: Number(`${Math.round(`${igstPercentageTemp}e2`)}e-2`),
      tdsPercentage: Number(`${Math.round(`${tdsPercentageTemp}e2`)}e-2`),
    });

    if (vendorId || localState?.vendor?.id) {
      setIsVendorAvailable(true);
    } else {
      setIsVendorAvailable(false);
    }
    if (
      categorizationvendordetails?.id === '' &&
      categorizationvendordetails?.name === 'Do Not Track Vendor'
    ) {
      // if (!state?.selected?.new_vendor && !state?.selected?.vendor_id) {
      handleDoNotTrackVendor(true);
      setLocalState((s) => ({
        ...s,
        paymentStatus: { id: 'company_account', label: 'Paid' },
        date: selectedTransactionUploadBill?.date,
      }));
      setIsVendorAvailable(
        categorizationvendordetails?.id !== null ||
          categorizationvendordetails?.id !== undefined,
      );
    } else if (categorizationvendordetails?.id) {
      // handleDoNotTrackVendor(false);
      setLocalState((s) => ({ ...s, vendor: categorizationvendordetails }));
      setLocalState((s) => ({
        ...s,
        paymentStatus: { id: 'company_account', label: 'Paid' },
        date: selectedTransactionUploadBill?.date,
      }));
      setIsVendorAvailable(
        categorizationvendordetails?.id !== null ||
          categorizationvendordetails?.id !== undefined,
      );
    }
    await saveBills(true, {
      name,
      document_date: date,
      document_number: invoiceNo,
      description,
      igst_amount: igst,
      sgst_amount: sgst,
      cgst_amount: cgst,
      amount,
      payment_mode: paymentStatus?.id,
      vendor_id: vendor?.id,
      id,
      accounted_on: accountedOn,
    });
    setPartLoad(false);
  };

  const fetchOcrDetails = (id) => {
    if (!newLoader?.continueFlow || device === 'mobile') {
      setPartLoad(true);
      // enableLoading(true, 'Please wait until we are getting the data');
    }
    if (newLoader?.continueFlow && device === 'desktop') {
      setNewLoader((prev) => ({ ...prev, loader: true }));
    }
    axiosInst
      .get(`organizations/${organization.orgId}/vendor_bills/${id}`)
      .then((ele) => {
        const res = ele.data;
        // console.log('LOOPCHECK getOcrData .then func');
        if (res && !res.error) {
          setPdfUrl(res?.file_url);
          if (res?.ocr_processing) {
            setTimeout(() => {
              setNewLoader((prev) => ({
                ...prev,
                val: prev.val + 1,
                fileId: res?.id,
              }));
              // fetchOcrDetails(res.id);
            }, 5000);
          } else {
            setFetchDetails(res);
            fillOcrData(res);
            // setPdfUrl(res.file_url);
            // if (device === 'mobile') {
            dispatch(enableLoading(false));
            // }
            setNewLoader((prev) => ({ ...prev, loader: false }));
          }
        } else {
          // if (device === 'mobile') {
          dispatch(enableLoading(false));
          // }
          setNewLoader((prev) => ({ ...prev, loader: false }));
          // const errorValues = res?.errors
          //   ? Object.values(res.errors).join(', ')
          //   : 'Something went wrong';
          // dispatch(
          //   openSnackbar({
          //     message: errorValues,
          //     type: 'error',
          //   }),
          // );
        }
      })
      .catch((e) => {
        console.log('fetchOcrDetailsError', e);
        dispatch(
          openSnackbar({
            message: 'Unknown error occured',
            type: 'error',
          }),
        );
        // if (device === 'mobile') {
        dispatch(enableLoading(false));
        // }
        setNewLoader((prev) => ({ ...prev, loader: false }));
      });
  };

  React.useEffect(() => {
    if (newLoader?.continueFlow && !newLoader?.assigned) {
      fetchOcrDetails(newLoader?.fileId);
    }
    if (
      newLoader?.val >= 1 &&
      newLoader?.val <= 3 &&
      !newLoader?.continueFlow &&
      newLoader?.fileId &&
      !newLoader?.assigned
    ) {
      fetchOcrDetails(newLoader?.fileId);
    } else if (
      newLoader?.val === 4 &&
      !newLoader?.continueFlow &&
      !newLoader?.superAccountSec &&
      !newLoader?.assigned
    ) {
      // if (device === 'mobile') {
      dispatch(enableLoading(false));
      // }
      setNewLoader((prev) => ({ ...prev, superAccount: true }));
    } else if (newLoader?.assigned) {
      dispatch(enableLoading(false));
    }
  }, [newLoader?.val, newLoader?.continueFlow, newLoader?.assigned]);

  const OcrDataFectchApi = (Param) => {
    if (billId) {
      return axiosInst.patch(
        `organizations/${organization.orgId}/vendor_bills/${billId}?ocr=true`,
        Param,
      );
    }
    return axiosInst.post(
      `organizations/${organization.orgId}/vendor_bills?ocr=true`,
      Param,
    );
  };

  const getOcrData = (id) => {
    // console.log('LOOPCHECK getOcrData');
    const Param = billId ? { id: billId, file: id } : { file: id };
    dispatch(enableLoading(true));
    OcrDataFectchApi(Param)
      .then((ele) => {
        const res = ele.data;
        // console.log('LOOPCHECK getOcrData .then func');
        if (res && !res.error) {
          setBillId(res?.id);
          if (res.ocr_processing) {
            setPdfUrl(res?.file_url);
            dispatch(enableLoading(false));
            setPartLoad(true);
            // enableLoading(true, 'Please wait until we are getting the data');
            setTimeout(() => {
              dispatch(enableLoading(false));
              fetchOcrDetails(res?.id);
            }, 5000);
          } else {
            setFetchDetails(res);
            fillOcrData(res);
            setPdfUrl(res.file_url);
            dispatch(enableLoading(false));
          }
        } else {
          dispatch(enableLoading(false));
          // const errorValues = res?.errors
          //   ? Object.values(res.errors).join(', ')
          //   : 'Something went wrong';
          // dispatch(
          //   openSnackbar({
          //     message: errorValues,
          //     type: 'error',
          //   }),
          // );
          setFilename('');
        }
      })
      .catch((e) => {
        console.log('getOcrDataError', e);
        dispatch(
          openSnackbar({
            message: 'Unknown error occured',
            type: 'error',
          }),
        );
        setFilename('');
        dispatch(enableLoading(false));
      });
  };

  const onFileUpload = (e, directFile) => {
    setNewLoader({
      loader: false,
      val: 0,
      fileId: '',
      continueFlow: false,
      superAccount: false,
      superAccountSec: false,
      superAccountThrid: false,
    });
    // console.log('LOOPCHECK if onFileUpload e, directFile', e, directFile);
    const file = directFile ? e : e?.target?.files?.[0];
    const url = `${BASE_URL}/direct_uploads`;
    const upload = new DirectUpload(file, url);
    dispatch(enableLoading(true));
    upload.create((error, blob) => {
      // console.log('LOOPCHECK upload.create', blob);
      dispatch(enableLoading(false));
      if (error) {
        dispatch(
          openSnackbar({
            message: 'Unknown error occured',
            type: 'error',
          }),
        );
      } else {
        const id = blob?.signed_id;
        const name = blob?.filename;
        const type = blob?.content_type;
        setFilename(name);
        setLocalState((s) => ({ ...s, file: id }));
        setTypeImage(type);
        getOcrData(id);
      }
    });
  };

  const HandleFileDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const HandleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    onFileUpload(file, true);
  };

  const fillOcrByFirebaseML = async (res) => {
    const resp = JSON.parse(res.detail.value);
    // console.log('LOOPCHECK fillOcrByFirebaseML');
    const {
      // name,
      // amount,
      // invoiceNo,
      // date,
      // description,
      // location,
      // paymentStatus,
      // vendor,
      // isOnline,
      base64: base64Arg,
      filename: filenameArg,
      idDocType: fileType,
    } = resp;

    setFilename(filenameArg);
    setBase64(base64Arg);

    // if (!isOnline) {
    //   setLocalState((s) => {
    //     const newState = {
    //       ...s,
    //       name,
    //       amount,
    //       invoiceNo,
    //       date,
    //       description,
    //       location,
    //       paymentStatus,
    //       vendor,
    //     };
    //     return newState;
    //   });
    //   return;
    // }

    // Call ML API OCR Data while getting base64 from native

    if (base64Arg) {
      const base64Str = `data:${fileType};base64,${base64Arg}`;
      const fetchRes = await fetch(base64Str);
      const blob = await fetchRes.blob();
      // eslint-disable-next-line no-undef
      const file = new File([blob], filenameArg, { type: fileType });
      // console.log(
      //   '🚀 ~ file: UploadYourBillContainer.jsx ~ line 433 ~ saveBills ~ file',
      //   file,
      // );
      // console.log('LOOPCHECK if base64Arg');
      onFileUpload(file, true);
      // fileSignedId = await fileUploadOnSave(file);
    }
  };

  const ocrByScan = () => {
    JSBridge.ocrByScan('ocrDetails');
  };

  const ocrByBrowse = () => {
    JSBridge.ocrByBrowse('ocrDetails');
  };

  const onAddAnotherBill = () => {
    setPartLoad(false);
    setFetchDetails();
    setBillId('');
    setLocalState(initialState);
    setCalcAmount(initialCalCAmt);
    setGSTPercentage(initialGSTPercentage);
    setFormattedCalcAmount(initialCalCAmt);
    setValidationErr(initialValidationErr);
    setHasNoGstin(false);
    setBillValue(0);
    setAmountPayable(0);
    setExpenseAccountDetails({});
    setView(VIEW.MAIN);
    setFilename('');
    setSelected(false);
    setHaveBill(true);
    setPdfUrl();
    setFilename('');
    setResponse();
    // navigate('/bill-upload');
    setNewLoader({
      loader: false,
      val: 0,
      fileId: '',
      continueFlow: false,
      superAccount: false,
      superAccountSec: false,
      superAccountThrid: false,
    });
    setDntCheckbox(false);
    setDonePage(false);
  };

  const updateChangedEntity = () => {
    dispatch(
      postEntityDetail({
        id: categorizationvendordetails?.id,
        payload: {
          entity_type: purposeState?.etype?.toLowerCase(),
        },
      }),
    );
  };

  const multipleBillsSubmitFun = (res) => {
    const tempBills = multipleBills?.bills?.filter(
      (val) => val !== multipleBills?.selectedBill,
    );
    if (tempBills?.length > 0) {
      setMultipleBillDoneDialog({
        open: true,
        previousState: multipleBills?.bills,
        prevSelectedId: multipleBills?.selectedBill,
      });
      setMultipleBills({
        ...multipleBills,
        bills: tempBills,
        selectedBill: tempBills?.[0],
        selectedBillState: {},
      });
    } else if (tempBills?.length === 0) {
      setMultipleBills({
        isShow: false,
        bills: [],
        selectedBill: [],
        selectedBillState: {},
      });
      setResponse(res);
      setView(VIEW.DONE);
    }
  };

  const BillSaveApi = (params) => {
    if (params?.id) {
      return axiosInst.patch(
        `organizations/${organization.orgId}/vendor_bills/${params?.id}`,
        params,
      );
    }
    return axiosInst.post(
      `organizations/${organization.orgId}/vendor_bills`,
      params,
    );
  };

  const saveBills = async (draftStatus, obj) => {
    let params =
      categorizationvendordetails?.id ||
      (categorizationvendordetails?.id === '' &&
        categorizationvendordetails?.name === 'Do Not Track Vendor')
        ? {
            id: billId || undefined,
            name: localState.name,
            document_date: moment(localState.date).format('YYYY-MM-DD'),
            // due_date:
            //   device === 'mobile' || !haveBill
            //     ? undefined
            //     : moment(localState.dueDate).format('YYYY-MM-DD'),
            document_number: !haveBill ? undefined : localState.invoiceNo,
            description: localState.description,
            expense_account_id: localState.expenseCategory?.id,
            payment_mode: localState.paymentStatus?.id || undefined,
            vendor_id: dntCheckbox ? null : localState.vendor?.id,
            file: state?.selected?.file_url ? undefined : localState.file,
            status: draftStatus ? undefined : 'accounted',
            advances: advancesData,
            igst_amount: hasNoGstin
              ? 0
              : calcAmount?.igst === ''
              ? 0
              : calcAmount?.igst,
            sgst_amount: hasNoGstin
              ? 0
              : calcAmount?.cgst === ''
              ? 0
              : calcAmount?.cgst,
            cgst_amount: hasNoGstin
              ? 0
              : calcAmount?.cgst === ''
              ? 0
              : calcAmount?.cgst,
            amount: calcAmount.taxAmount,
            // file_url: !haveBill ? '' : undefined
            bank_txn_id: draftStatus ? undefined : selectedTransaction?.id,
            credit_period: localState?.creditPeriod || 0,
            payer_id:
              localState.paymentStatus?.id === 'personal'
                ? localState?.payer_id?.id
                : undefined,
            payer_account_id:
              localState.paymentStatus?.id === 'company_cash'
                ? selectedCashAccount.bank_account_id
                : localState.paymentStatus?.id === 'company_card'
                ? selectedCCCard?.bank_account_id
                : localState.paymentStatus?.id === 'company_account'
                ? selectedCompanyAccount?.bank_account_id
                : bankAccountDetails?.bankDetails?.bankId,
            accounted_on: moment(localState?.accountedOn).format('YYYY-MM-DD'),
          }
        : {
            id: billId || undefined,
            name: localState.name,
            document_date: moment(localState.date).format('YYYY-MM-DD'),
            // due_date:
            //   device === 'mobile' || !haveBill
            //     ? undefined
            //     : moment(localState.dueDate).format('YYYY-MM-DD'),
            document_number: !haveBill ? undefined : localState.invoiceNo,
            description: localState.description,
            expense_account_id: localState.expenseCategory?.id,
            payment_mode: localState.paymentStatus?.id || undefined,
            vendor_id: dntCheckbox ? null : localState.vendor?.id,
            file: state?.selected?.file_url ? undefined : localState.file,
            status: draftStatus ? undefined : 'accounted',
            advances: advancesData,
            igst_amount: hasNoGstin
              ? 0
              : calcAmount?.igst === ''
              ? 0
              : calcAmount?.igst,
            sgst_amount: hasNoGstin
              ? 0
              : calcAmount?.cgst === ''
              ? 0
              : calcAmount?.cgst,
            cgst_amount: hasNoGstin
              ? 0
              : calcAmount?.cgst === ''
              ? 0
              : calcAmount?.cgst,
            amount: calcAmount.taxAmount,
            credit_period: localState?.creditPeriod || 0,
            payer_id:
              localState.paymentStatus?.id === 'personal'
                ? localState?.payer_id?.id
                : undefined,
            payer_account_id:
              localState.paymentStatus?.id === 'company_cash'
                ? selectedCashAccount.bank_account_id
                : localState.paymentStatus?.id === 'company_card'
                ? selectedCCCard?.bank_account_id
                : localState.paymentStatus?.id === 'company_account'
                ? selectedCompanyAccount?.bank_account_id
                : bankAccountDetails?.bankDetails?.bankId,
            accounted_on: moment(localState?.accountedOn).format('YYYY-MM-DD'),
          };

    params = { ...params, ...obj };

    setDrawer((s) => ({ ...s, preview: false }));
    // enableLoading(true);

    BillSaveApi(params)
      .then((ele) => {
        const res = ele?.data;
        // console.log(localState.vendor?.id);

        if (res && !res.error) {
          deRegisterEventListener({
            name: 'ocrDetails',
            method: fillOcrByFirebaseML,
          });
          setBillId(res?.id);
          if (draftStatus) {
            setBillValue(res?.bill_amount || 0);
            setCalcAmount((s) => ({
              ...s,
              tds: res?.tds_amount || '',
            }));
            const tdsPercentageTemp =
              (parseFloat(res?.tds_amount) / parseFloat(res?.bill_amount)) *
              100;
            setGSTPercentage((prev) => ({
              ...prev,
              tdsPercentage: Number(
                `${Math.round(`${tdsPercentageTemp}e2`)}e-2`,
              ),
            }));
            setAmountPayable(res?.total_amount || 0);
            setExpenseAccountDetails(res?.expense_account);
          } else if (!draftStatus) {
            if (billUploadFrom === 'bankCategorization') {
              if (
                categorizationvendordetails?.type?.toLowerCase() !==
                purposeState?.etype?.toLowerCase()
              ) {
                updateChangedEntity();
              }
              ExpenseDone({ response: res, params });
            } else if (multipleBills?.isShow) {
              multipleBillsSubmitFun(res);
            } else {
              setResponse(res);
              // navigate('/bill-upload-done');
              setView(VIEW.DONE);
              setNewLoader((prev) => ({
                ...prev,
                superAccount: false,
                continueFlow: false,
                assigned: true,
              }));
            }
          }
        }
        // else {
        //   // const errorValues = Object.values(res.errors);
        //   dispatch(
        //     openSnackbar({
        //       message:
        //         res?.message || res?.errors
        //           ? Object.values(res?.errors).join(',')
        //           : 'Something went wrong.',
        //       type: 'error',
        //     }),
        //   );
        // }
        dispatch(enableLoading(false));
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: e?.message || 'Unknown error occured',
            type: 'error',
          }),
        );
        dispatch(enableLoading(false));
      });
  };

  //   const callback = () => {
  //     setOpen(false);
  // };

  const onRecordBill = async () => {
    let loopBreak = false;
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      const err = Object.keys(v);
      if (err.length) {
        err.forEach((key) => {
          let input;
          if (v[key] && !loopBreak) {
            if (key === 'vendor') {
              input = document.querySelector(`#recordBillVendor`);
            } else if (key === 'expenseCategory') {
              input = document.querySelector(`.expenseCategoryClass`);
            } else if (key === 'paymentStatus') {
              input = document.querySelector(`.PaymentStatusClass`);
            } else {
              input = document.querySelector(`input[name=${key}]`);
            }
            input.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'start',
            });
            loopBreak = true;
            return;
          }
        });
      }
      return;
    }
    if (haveBill && !filename) {
      dispatch(
        openSnackbar({
          message: 'Please upload your bill',
          type: 'error',
        }),
      );
      setTimeout(() => {
        dispatch(closeSnackbar());
      }, 3000);
      return;
    }
    if (
      haveBill &&
      !isVendorAvailable &&
      localState?.vendor !== 'Do not track'
    ) {
      const input = document.querySelector(`#recordBillVendor`);
      input.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
      setValidationErr((s) => ({ ...s, vendor: true }));
      return;
    }

    if (valid) {
      if (
        localState?.vendor?.tds_alert_confirmed ||
        localState?.vendor === 'Do not track' ||
        localState.amount >
          localState.expenseCategory?.tds_rates?.aggregate_threshold
      ) {
        await saveBills();
      } else {
        setToggleModal(true);
        return;
      }
    }
  };

  const fetchGSTDetails = async (Gst_No) => {
    dispatch(enableLoading(true));
    const pattern =
      /^([0][1-9]|[1-2][0-9]|[3][0-5])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;

    if (!pattern.test(Gst_No)) {
      dispatch(
        openSnackbar({
          message: 'GST Number is not valid. Please add manually Vendor Name.',
          type: 'error',
        }),
      );
      dispatch(enableLoading(false));
      return;
    }

    await dispatch(
      getGstDetail({
        gstin: Gst_No.toUpperCase(),
        organization_id: organization.orgId,
      }),
    );
  };
  const onTriggerDrawer = (name) => {
    setTimeout(() => {
      let sheetName = name;
      if (!userRolesPeople?.Vendors?.create_vendors && name === 'addManually') {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
          },
        });
        return;
      }
      if (name === 'vendor') {
        getVendor();
      }

      if (name === 'reload') {
        fetchGSTDetails(localState.gst);
      }

      if (name === 'addManually' || name === 'list') {
        setTrigger(name);
        sheetName = 'vendor';
      } else if (
        localState?.vendor?.id &&
        (name === 'addManually' || name === 'list')
      ) {
        setTrigger('list');
        sheetName = 'vendor';
      }
      setDrawer((d) => ({ ...d, [sheetName]: true }));
    }, 300);
  };

  const handleBottomSheet = async (name, data, from) => {
    if (!data?.onClose) setDrawer((d) => ({ ...d, [name]: false }));
    if (
      state?.selected &&
      data?.id &&
      data?.id !== state?.selected?.vendor_id &&
      !from &&
      editConfirm?.once &&
      name === 'vendor' &&
      haveBill
    ) {
      setEditConfirm({ open: true, name, data, once: false });
      return;
    }
    if (name === 'expenseCategory') {
      reValidate({
        target: { name: 'amount', value: amountPayable || localState?.amount },
      });
      await saveBills(true, { expense_account_id: data?.id });
    }
    if (name === 'creditPeriod') {
      const date = new Date();
      const tempDate = date?.getTime() + Number(data) * 24 * 60 * 60 * 1000;
      await saveBills(true, {
        credit_period: data,
        due_date: moment(tempDate)?.format('YYYY-MM-DD'),
      });

      // setLocalState((s) => ({ ...s, dueDate: new Date(tempDate) }));
    }
    if (name === 'paymentStatus') {
      if (data?.id === 'personal') {
        setEmployee({ open: true });
        return;
      }
      if (data?.id === 'company_cash') {
        setPaidByCompany((prev) => !prev);
        setPaidByCompanyCard(false);
        setPaidByCompanyAccount(false);
        // setLocalState((prev) => ({ ...prev, paymentStatus: data }));
        return;
      }
      if (data?.id === 'company_card') {
        setPaidByCompanyCard((prev) => !prev);
        setPaidByCompany(false);
        setPaidByCompanyAccount(false);
        // setLocalState((prev) => ({ ...prev, paymentStatus: data }));
        return;
      }
      if (data?.id === 'company_account') {
        setPaidByCompanyAccount((prev) => !prev);
        setPaidByCompany(false);
        setPaidByCompanyCard(false);
        // setLocalState((prev) => ({ ...prev, paymentStatus: data }));
        return;
      }
      await saveBills(true, { payment_mode: data?.id });
    }
    if (name === 'payer_id') {
      setEmployee({ open: false });
      await saveBills(true, {
        payment_mode: data?.payment_mode?.id,
        payer_id: data?.payer_id?.id,
      });
      setLocalState((s) => ({
        ...s,
        paymentStatus: data?.payment_mode,
        payer_id: data?.payer_id,
      }));
      return;
    }
    if (name === 'vendor' && (data || Object?.keys(data || {})?.length > 0)) {
      reValidate({ target: { name, value: data } });
      reValidate({
        target: { name: 'amount', value: amountPayable || localState?.amount },
      });

      if (data?.id) {
        fetchAllAddress(data?.id);
      }
      if (data === 'Do not track') {
        if (
          categorizationvendordetails?.id === '' &&
          categorizationvendordetails?.name === 'Do Not Track Vendor'
        ) {
          setLocalState((s) => ({ ...s, [name]: data }));
          await saveBills(true, { vendor_id: data?.id });
        } else {
          setLocalState((s) => ({ ...s, paymentStatus: '', [name]: data }));
          await saveBills(true, { vendor_id: data?.id, payment_mode: '' });
        }
      } else {
        if (
          !data &&
          Object.keys(fetchDetails?.new_vendor || {}).length > 0 &&
          fetchDetails?.new_vendor?.name
        ) {
          setLocalState((s) => ({ ...s, [name]: fetchDetails?.new_vendor }));
          setIsVendorAvailable(data?.id ? true : false);
          return;
        }
        setLocalState((s) => ({ ...s, [name]: data }));
        await saveBills(true, { vendor_id: data?.id });
      }
      setIsVendorAvailable(data?.id ? true : false);

      return;
    }
    if (name === 'date') {
      await saveBills(true, {
        document_date: moment(data).format('YYYY-MM-DD'),
      });
    }
    // if (name === 'dueDate') {
    //   await saveBills(true, { due_date: moment(data).format('YYYY-MM-DD') });
    // }
    if (name === 'accountedOn') {
      await saveBills(true, {
        accounted_on: moment(data).format('YYYY-MM-DD'),
      });
    }
    if (name === 'paidAdvance') {
      await saveBills(true, { payment_mode: 'paid_as_advance' });
    }
    if (data) setLocalState((s) => ({ ...s, [name]: data }));

    if (data && data.id && name === 'vendor') {
      setLocalState((s) => ({ ...s, [name]: data }));
      setIsVendorAvailable(true);
      reValidate({ target: { name, value: data } });
    }
    if (data === '' && name === 'vendor') {
      setLocalState((s) => ({ ...s, [name]: data }));
      reValidate({ target: { name, value: data } });
    }
    if (localState[name] && !data) return;
    reValidate({ target: { name, value: data } });
  };
  const handleNextBottomSheet = (name, next, data) => {
    setPaidByCompany(false);
    setPaidByCompanyCard(false);
    setPaidByCompanyAccount(false);
    setSelectedCashAccount({});
    setSelectedCCCard({});
    setSelectedCompanyAccount({});
    if (data) setLocalState((s) => ({ ...s, [name]: data }));
    if (localState[name] && !data) return;
    reValidate({ target: { name, value: data } });
    setDrawer((d) => ({ ...d, [name]: false }));
    setDrawer((d) => ({ ...d, [next]: true }));
  };
  const onCloseVendor = (vendor) => {
    setLocalState((s) => ({ ...s, vendor }));
    setDrawer((d) => ({ ...d, vendor: false }));
    setView(VIEW.MAIN);
  };

  const preparePreviewData = () => {
    const data = [
      { label: 'Vendor', value: localState.vendor?.name },
      { label: 'Amount', value: `Rs. ${localState.amount}` },
      { label: 'Expense Category', value: localState.expenseCategory?.name },
      { label: 'Payment Mode', value: localState.paymentStatus?.label },
      { label: 'Description', value: localState.description },
    ];
    return data;
  };

  useEffect(() => {
    if (pageParams?.id) {
      const {
        name,
        amount,
        document_number: invoiceNo,
        document_date: date,
        expense_category: expenseCategory,
        payment_mode: paymentMode,
        vendor,
        description,
        id,
      } = pageParams;
      const paymentStatus = paymentStatusListWithBill.find(
        (ps) => ps.id === paymentMode,
      );
      setLocalState({
        name,
        amount,
        invoiceNo,
        date: moment(date).format('YYYY-MM-DD'),
        expenseCategory,
        description,
        paymentStatus,
        vendor,
        doNotTrack: false,
      });
      setBillId(id);
      setFilename(id);
    }
  }, [pageParams]);

  const pathName = window.location.pathname;

  React.useEffect(() => {
    if (!haveBill) {
      if (
        categorizationvendordetails?.id === '' &&
        categorizationvendordetails?.name === 'Do Not Track Vendor'
      ) {
        // if (!state?.selected?.new_vendor && !state?.selected?.vendor_id) {
        handleDoNotTrackVendor(true);
        setLocalState((s) => ({
          ...s,
          paymentStatus: { id: 'company_account', label: 'Paid' },
          date: selectedTransactionUploadBill?.date,
          taxAmount: Math.abs(Number(selectedTransactionUploadBill?.amount)),
          cgst: 0,
          sgst: 0,
          igst: 0,
        }));
        setCalcAmount((s) => ({
          ...s,
          taxAmount: Math.abs(Number(selectedTransactionUploadBill?.amount)),
          cgst: 0,
          sgst: 0,
          igst: 0,
        }));
        setFormattedCalcAmount((s) => ({
          ...s,
          taxAmount: Math.abs(Number(selectedTransactionUploadBill?.amount)),
          cgst: 0,
          sgst: 0,
          igst: 0,
        }));
        setIsVendorAvailable(
          categorizationvendordetails?.id !== null ||
            categorizationvendordetails?.id !== undefined,
        );
      } else if (categorizationvendordetails?.id) {
        // handleDoNotTrackVendor(false);
        setLocalState((s) => ({ ...s, vendor: categorizationvendordetails }));
        setLocalState((s) => ({
          ...s,
          paymentStatus: { id: 'company_account', label: 'Paid' },
          date: selectedTransactionUploadBill?.date,
          taxAmount: Math.abs(Number(selectedTransactionUploadBill?.amount)),
          cgst: 0,
          sgst: 0,
          igst: 0,
        }));
        setCalcAmount((s) => ({
          ...s,
          taxAmount: Math.abs(Number(selectedTransactionUploadBill?.amount)),
          cgst: 0,
          sgst: 0,
          igst: 0,
        }));
        setFormattedCalcAmount((s) => ({
          ...s,
          taxAmount: Math.abs(Number(selectedTransactionUploadBill?.amount)),
          cgst: 0,
          sgst: 0,
          igst: 0,
        }));
        setIsVendorAvailable(
          categorizationvendordetails?.id !== null ||
            categorizationvendordetails?.id !== undefined,
        );
      }
    }
  }, [haveBill]);

  useEffect(() => {
    if (pathName === '/bill-upload-done' && view === VIEW.MAIN) {
      navigate('/bill-upload');
    }
  }, [pathName]);

  useEffect(() => {
    if (hasNoGstin && billId) {
      setLocalState((s) => ({
        ...s,
        igst: 0,
        cgst: 0,
      }));
      setCalcAmount((s) => ({
        ...s,
        sgst: 0,
        igst: 0,
        cgst: 0,
      }));
      setFormattedCalcAmount((s) => ({
        ...s,
        sgst: 0,
        igst: 0,
        cgst: 0,
      }));
      saveBills(true, {
        igst_amount: 0,
        sgst_amount: 0,
        cgst_amount: 0,
        tds_amount: 0,
      });
    }
  }, [hasNoGstin]);

  const stateSetCall = (valueState) => {
    // editbill(valueState?.id);
    setView(VIEW.MAIN);

    // setHaveBill(valueState?.vendor_id !== null);

    setBillId(valueState?.id);

    setPdfUrl(valueState?.file_url);

    if (
      valueState?.new_vendor &&
      Object.keys(valueState?.new_vendor).length > 0
    )
      setFetchDetails(valueState);

    const temp = valueState?.file_url?.split('.');
    setHaveBill(!!valueState?.file_url);

    if (temp?.length > 0) {
      setTypeImage(
        temp &&
          (temp[temp?.length - 1] === 'jpeg' ||
            temp[temp?.length - 1] === 'jpg' ||
            temp[temp?.length - 1] === 'png')
          ? 'image/jpeg'
          : 'image/pdf',
      );
    }
    // if (
    //   (valueState?.vendor_id !== null && temp) ||
    //   (valueState?.isSuperAccountant && temp)
    // ) {
    //   setHaveBill(true);

    //   setTypeImage(
    //     temp &&
    //       (temp[temp?.length - 1] === 'jpeg' ||
    //         temp[temp?.length - 1] === 'jpg' ||
    //         temp[temp?.length - 1] === 'png')
    //       ? 'image/jpeg'
    //       : 'image/pdf',
    //   );
    // } else {
    //   setHaveBill(false);
    // }
    if (valueState?.vendor_id) {
      setIsVendorAvailable(true);
    } else {
      setIsVendorAvailable(false);
    }
    if (valueState?.advances?.length > 0) {
      valueState?.advances?.forEach((ele) => hangleChecked(ele.txn_id));
    }
    setFilename(valueState?.uploadFlieName || ' ');
    if (valueState?.vendor_id) fetchAllAddress(valueState?.vendor_id);
    // handleChange();
    setLocalState({
      ...initialState,
      name: valueState?.name,
      vendor:
        valueState?.vendor_id !== null
          ? valueState?.vendor
          : valueState?.new_vendor,
      invoiceNo: valueState?.document_number,
      date: valueState?.document_date
        ? new Date(valueState?.document_date)
        : new Date(),
      // dueDate: valueState?.due_date || undefined,
      expenseCategory: valueState?.expense_account,
      paymentStatus: {
        label: paymentStatusListWithBill?.find(
          (v) => v.id === valueState?.payment_mode,
        )?.label,
        id: valueState?.payment_mode,
      },
      payer_id: valueState?.payer_details,
      description: valueState?.description,
      igst: valueState?.igst_amount,
      cgst: valueState?.cgst_amount,
      taxAmount: valueState?.amount,
      creditPeriod: valueState?.credit_period,
      tds: valueState?.tds_amount,
      accountedOn: valueState?.accounted_on
        ? new Date(valueState?.accounted_on)
        : new Date(),
    });
    setCalcAmount({
      sgst: valueState?.sgst_amount,
      igst: valueState?.igst_amount,
      cgst: valueState?.cgst_amount,
      taxAmount: valueState?.amount,
      tds: valueState?.tds_amount,
    });
    setFormattedCalcAmount({
      sgst: valueState?.sgst_amount,
      igst: valueState?.igst_amount,
      cgst: valueState?.cgst_amount,
      taxAmount: valueState?.amount,
      tds: valueState?.tds_amount,
    });
    const cgstPercentageTemp =
      (parseFloat(valueState?.cgst_amount) / parseFloat(valueState?.amount)) *
      100;
    const igstPercentageTemp =
      (parseFloat(valueState?.igst_amount) / parseFloat(valueState?.amount)) *
      100;
    const tdsPercentageTemp =
      (parseFloat(valueState?.tds_amount) / parseFloat(valueState?.amount)) *
      100;
    setGSTPercentage({
      cgstPercentage: Number(`${Math.round(`${cgstPercentageTemp}e2`)}e-2`),
      igstPercentage: Number(`${Math.round(`${igstPercentageTemp}e2`)}e-2`),
      tdsPercentage: Number(`${Math.round(`${tdsPercentageTemp}e2`)}e-2`),
    });
    setExpenseAccountDetails(valueState?.expense_account);
    if (!valueState?.new_vendor && !valueState?.vendor_id) {
      setDntCheckbox(true);
      setLocalState((s) => ({ ...s, vendor: 'Do not track' }));
    } else setDntCheckbox(false);
    if (valueState?.payment_mode === 'company_cash')
      setSelectedCashAccount((s) => ({
        ...s,
        bank_account_id: valueState?.payer_account_id,
      }));
    else if (valueState?.payment_mode === 'company_card')
      setSelectedCCCard((s) => ({
        ...s,
        bank_account_id: valueState?.payer_account_id,
      }));
    else if (valueState?.payment_mode === 'company_account')
      setSelectedCompanyAccount((s) => ({
        ...s,
        bank_account_id: valueState?.payer_account_id,
      }));
    setLocalState((s) => ({
      ...s,
      file: valueState?.uploadId || undefined,
      bank_txn_id: valueState?.bank_txn_id || undefined,
    }));
    // setTypeImage(valueState?.typeOfImage);
    // setPdfUrl(valueState?.file_url);
    // setFilename(valueState?.uploadFlieName);

    if (valueState?.isSuperAccountant) {
      setNewLoader((prev) => ({
        ...prev,
        superAccount: false,
        superAccountSec: true,
        continueFlow: false,
      }));
      if (device === 'mobile') setView(VIEW.SUPER);
    } else {
      saveBills(true, {
        name: valueState?.name,
        document_date: valueState?.document_date,
        // due_date: valueState?.due_date,
        document_number: valueState?.document_number,
        description: valueState?.description,
        igst_amount: valueState?.igst_amount,
        sgst_amount: valueState?.sgst_amount,
        cgst_amount: valueState?.cgst_amount,
        amount: valueState?.amount,
        payment_mode: valueState?.payment_mode,
        vendor_id: valueState?.vendor_id || undefined,
        expense_account_id: valueState?.expense_account_id,
        id: valueState?.id,
        payer_id: valueState?.payer_details?.id,
        bank_txn_id: valueState?.bank_txn_id,
        payer_account_id: valueState?.payer_account_id,
        // status:
        //   selectedTransactionUploadBill?.categorized && status === 'Edit'
        //     ? 'accounted'
        //     : undefined,
        tds_amount: valueState?.tds_amount,
        accounted_on: valueState?.accounted_on,
      });
    }
  };

  useEffect(() => {
    getExpenseCategory();
    getAssetCategory();
    getVendor();
    // fetchOrgLocation();
    fetchOrgSetting();

    setHaveBill(true);
    dispatch(getBankList());

    if (state?.selected && Object.keys(state?.selected).length !== 0) {
      stateSetCall(state?.selected);
    }

    registerEventListeners({ name: 'ocrDetails', method: fillOcrByFirebaseML });
    return () => {
      deRegisterEventListener({
        name: 'ocrDetails',
        method: fillOcrByFirebaseML,
      });
      dispatch(ClearSateVendorEntity());
      dispatch(clearRecordExpenseState());
    };
  }, []);

  useEffect(() => {
    if (
      multipleBills?.isShow &&
      Object?.keys(multipleBills?.selectedBillState || {})?.length > 0
    ) {
      state = {
        ...state,
        multipleBills: multipleBills?.bills,
        selected: { ...multipleBills?.selectedBillState },
      };
      stateSetCall(multipleBills?.selectedBillState);
    }
  }, [JSON.stringify(multipleBills?.selectedBillState)]);

  useEffect(() => {
    if (state?.continueFlow?.name === 'billBoxScan') {
      setFilename(state?.continueFlow?.billState?.billName);
      setLocalState((s) => ({
        ...s,
        file: state?.continueFlow?.billState?.billId,
      }));
      setTypeImage(state?.continueFlow?.billState?.billType);
      setBillId(state?.continueFlow?.selected?.id);
      setPdfUrl(state?.continueFlow?.selected?.file_url);
      // setPartLoad(true);
      setTimeout(() => {
        fetchOcrDetails(state?.continueFlow?.selected?.id);
      }, 2000);
    }
  }, [state?.continueFlow]);

  useEffect(() => {
    if (localState.expenseCategory) {
      getExpenseCategory();
      getAssetCategory();
    }
  }, [localState.expenseCategory]);

  React.useMemo(async () => {
    if (billId || Object?.keys(categorizationvendordetails || {})?.length > 0) {
      await saveBills(true, {
        amount: calcAmount?.taxAmount?.toString()?.includes(',')
          ? Number(calcAmount?.taxAmount?.replaceAll(',', ''))
          : calcAmount?.taxAmount,
        sgst_amount: hasNoGstin ? 0 : calcAmount?.cgst,
        cgst_amount: hasNoGstin ? 0 : calcAmount?.cgst,
        igst_amount: hasNoGstin ? 0 : calcAmount?.igst,
        description: localState?.description,
        document_number: localState?.invoiceNo,
        tds_amount: calcAmount?.tds,
      });
    }
  }, [
    debouncedForAmt,
    debouncedForCgst,
    debouncedForIgst,
    debouncedForDescription,
    debouncedForInvoiceNo,
    debouncedForTds,
  ]);

  const resetValue = () => {
    setGSTPercentage((prev) => ({
      ...prev,
      cgstPercentage: '',
      igstPercentage: '',
      tdsPercentage: '',
    }));
    setCalcAmount((prev) => ({ ...prev, cgst: '', igst: '', tds: '' }));
    setLocalState((prev) => ({ ...prev, cgst: '', igst: '', tds: '' }));
    setFormattedCalcAmount((prev) => ({
      ...prev,
      cgst: '',
      igst: '',
      tds: '',
    }));
  };

  const handleAmountChange = (e) => {
    reValidate(e);
    const name = e?.target?.name;
    const value = e?.target?.value;
    const formattedValue = e?.target?.formattedValue;
    if (e && e.target) setCalcAmount((prev) => ({ ...prev, [name]: value }));
    if (e && e.target) setLocalState((prev) => ({ ...prev, [name]: value }));
    if (e && e.target)
      setFormattedCalcAmount((prev) => ({ ...prev, [name]: formattedValue }));
    if (name === 'cgst' || name === 'igst' || name === 'tds') {
      if (value > calcAmount?.taxAmount) {
        resetValue();
        return;
      }
      const percentage =
        (parseFloat(value) / parseFloat(calcAmount?.taxAmount)) * 100;
      setGSTPercentage((prev) => ({
        ...prev,
        [`${name}Percentage`]: Number(`${Math.round(`${percentage}e2`)}e-2`),
      }));
    }
    if (name === 'taxAmount') {
      const cgstAmtTemp = (GSTPercentage?.cgstPercentage / 100) * value;
      const igstAmtTemp = (GSTPercentage?.igstPercentage / 100) * value;
      setCalcAmount((prev) => ({
        ...prev,
        cgst: Number(`${Math.round(`${cgstAmtTemp}e2`)}e-2`),
        igst: Number(`${Math.round(`${igstAmtTemp}e2`)}e-2`),
      }));
    }
  };

  const handleGSTPercentageChange = (e) => {
    const name = e?.target?.name;
    const nameGST = e?.target?.name?.replace('Percentage', '');
    const value = Number(`${Math.round(`${e?.target?.value}e2`)}e-2`);
    if (value > 100) {
      return;
    }
    setGSTPercentage((prev) => ({ ...prev, [name]: value }));
    const amount = (value / 100) * calcAmount?.taxAmount;
    if (e && e.target)
      setCalcAmount((prev) => ({ ...prev, [nameGST]: amount }));
    if (e && e.target)
      setLocalState((prev) => ({ ...prev, [nameGST]: amount }));
  };

  useEffect(() => {
    setLocalState((s) => ({ ...s, amount: amountPayable }));
  }, [amountPayable]);

  React.useEffect(() => {
    if (
      localState?.paymentStatus?.id === 'paid_as_advance' &&
      localState.vendor?.id
    ) {
      getVendorUnsettled();
    }
  }, [localState.vendor?.id, localState?.paymentStatus?.id]);

  const handleWithLocation = (element, locationId) => {
    console.log(locationId);
    handleBottomSheet('vendor', element);
  };
  const onTriggerDrawerForEdit = (name, element) => {
    setEditValue(element);
    setDrawer((d) => ({ ...d, vendor: false }));
    if (device === 'desktop') {
      setDrawer((d) => ({ ...d, [name]: true }));
    }
    if (device === 'mobile') {
      setView(VIEW.EDIT);
    }
  };

  const handlePaymentStatus = async (data, stateValue, ps) => {
    stateValue(data);
    setLocalState((prev) => ({ ...prev, paymentStatus: ps }));
    setDrawer((d) => ({
      ...d,
      paymentStatus: false,
    }));
    await saveBills(true, {
      payment_mode: ps?.id,
      payer_account_id: data?.bank_account_id,
    });
    if (stateValue === setSelectedCashAccount) {
      setSelectedCCCard({});
      setSelectedCompanyAccount({});
    } else if (stateValue === setSelectedCCCard) {
      setSelectedCashAccount({});
      setSelectedCompanyAccount({});
      navigate('/banking-statement', {
        state: {
          bankListingDetails,
          accDetails: data,
          filedDisable: 'true',
          billId,
          paymentStats: ps,
          uploadPDF: pdfUrl,
          typeOfImage: typeImage,
          uploadFlieName: filename,
          uploadId: localState?.file || '',
          isSuperAccountant: false,
        },
      });
    } else if (stateValue === setSelectedCompanyAccount) {
      setSelectedCashAccount({});
      setSelectedCCCard({});
      navigate('/banking-statement', {
        state: {
          bankListingDetails,
          accDetails: data,
          filedDisable: 'true',
          billId,
          paymentStats: ps,
          uploadPDF: pdfUrl,
          typeOfImage: typeImage,
          uploadFlieName: filename,
          uploadId: localState?.file || '',
          isSuperAccountant: false,
        },
      });
    }
  };

  React.useMemo(() => {
    if (dntCheckbox) {
      setToShowBtn(true);
    } else {
      setToShowBtn(isVendorAvailable);
    }
  }, [isVendorAvailable, dntCheckbox]);

  React.useMemo(() => {
    if (!isVendorAvailable && (localState.vendor?.name || localState.vendor)) {
      setShowTextData(true);
    } else {
      setShowTextData(false);
    }
  }, [isVendorAvailable, localState?.vendor?.name, localState?.vendor]);

  useEffect(() => {
    if (Object.keys(ExpenseCategory || {})?.length > 0)
      setExpenseCategoryList(ExpenseCategory?.data);
  }, [JSON.stringify(ExpenseCategory)]);

  useEffect(() => {
    if (Object.keys(AssetCategory || {})?.length > 0)
      setAssetCategoryList(AssetCategory?.data);
  }, [JSON.stringify(AssetCategory)]);

  useEffect(() => {
    if (Object.keys(VendorUnsettledList || {})?.length > 0)
      setVendorsUnsettledList(VendorUnsettledList?.data);
  }, [JSON.stringify(VendorUnsettledList)]);

  useEffect(() => {
    if (Object.keys(orgSettings || {})?.length > 0) setOrgSetting(orgSettings);
  }, [JSON.stringify(orgSettings)]);

  useEffect(() => {
    if (Object.keys(allLocationAddress || {})?.length > 0) {
      const tempAddr = allLocationAddress?.data?.filter((val) => val?.active);
      const responseForGst = tempAddr?.filter((v) => v?.gstin?.length > 0);
      if (responseForGst?.length > 0) {
        setHasNoGstin(false);
      } else if (responseForGst?.length === 0) {
        setHasNoGstin(true);
      }
    }
  }, [JSON.stringify(allLocationAddress)]);

  useEffect(() => {
    if (vendorEntity?.data) {
      setPagination({
        totalPage: vendorEntity?.pages,
        currentPage: vendorEntity?.page,
      });
      if (vendorEntity?.page === 1) {
        setVendorList(vendorEntity?.data);
      } else {
        setVendorList((prev) => [...prev, ...vendorEntity?.data]);
      }
    }
  }, [JSON.stringify(vendorEntity || {})]);

  useEffect(() => {
    if (Object.keys(gstDetail || {})?.length > 0) {
      const details__ = { new_vendor: { ...gstDetail } };
      setFetchDetails(details__);
      setLocalState((s) => ({
        ...s,
        vendor: gstDetail?.name || '',
      }));
    }
  }, [JSON.stringify(gstDetail)]);

  return (
    <>
      {heading && heading === 'no' ? (
        ''
      ) : (
        <PageTitle
          title="Bill Booking"
          onClick={() => {
            if (device === 'desktop') {
              if (state?.people) {
                navigate('/people', { state: { choose: state?.people?.from } });
              } else if (state?.billBox) {
                navigate('/bill-box', { state: state?.stateForBack });
              } else if (state?.emailBillBox) {
                navigate('/bill-box-email', { state: state?.stateForBack });
              } else {
                navigate(-1);
              }
            }
            if (device === 'mobile') {
              deRegisterEventListener({
                name: 'ocrDetails',
                method: fillOcrByFirebaseML,
              });
              if (state?.people) {
                navigate('/people', { state: { choose: state?.people?.from } });
              } else if (view === VIEW.EDIT) {
                setView(VIEW.MAIN);
              } else if (view === VIEW.SUPER) {
                if (newLoader?.fileId) {
                  setNewLoader((prev) => ({
                    ...prev,
                    continueFlow: true,
                    superAccountSec: false,
                  }));
                }
                setView(VIEW.MAIN);
              } else if (state?.billBox) {
                navigate('/bill-box', { state: state?.stateForBack });
              } else if (state?.emailBillBox) {
                navigate('/bill-box-email', { state: state?.stateForBack });
              } else if (view === VIEW.DONE) {
                setView(VIEW.MAIN);
                onAddAnotherBill();
              } else {
                navigate('/bill');
              }
            }
          }}
        />
      )}
      {toggleModal ? (
        <AlertDialog
          initopen={true}
          handleClick={handleCloseModal}
          name={
            <Box>
              <div className={css.bodyText} style={{ marginBottom: 18 }}>
                In order to assess the correct TDS Liability with this vendor,
                please confirm if the value of transaction with the{' '}
                <b>{localState.vendor.name}</b> is going to be more than{' '}
                <b>
                  {Number(
                    expenseAccountDetails?.tds_rates?.aggregate_threshold,
                  ) !== 0
                    ? FormattedAmount(
                        expenseAccountDetails?.tds_rates?.aggregate_threshold,
                      )
                    : FormattedAmount(30000)}
                </b>{' '}
                during this Financial year?
              </div>
            </Box>
          }
          message="TDS"
          buttontext1="Yes"
          buttontext2="No"
          ptype={device}
        />
      ) : (
        ''
      )}
      <div
        className={
          device === 'mobile'
            ? cssDash.dashboardBodyContainerhideNavBar
            : cssDash.dashboardBodyContainerDesktop
        }
        style={{
          height: billUploadFrom === 'bankCategorization' && '100%',
          margin: billUploadFrom === 'bankCategorization' && '0',
          background:
            billUploadFrom === 'bankCategorization' &&
            device === 'mobile' &&
            '#fff',
        }}
      >
        {device === 'desktop' ? (
          <Stack
            flexDirection={{ xs: 'column', md: 'row' }}
            overflow="auto"
            width="100%"
            justifyContent="space-around"
            height={{ xs: 'auto', md: '98%' }}
          >
            {view === VIEW.MAIN && (
              <>
                <Stack
                  className={
                    pdfUrl &&
                    filename !== '' &&
                    !newLoader?.continueFlow &&
                    partLoad
                      ? `${css.recordAnExpenseContainerDesktop} ${css.newBackDrop}`
                      : `${css.recordAnExpenseContainerDesktop}`
                  }
                  margin={{ xs: '0 0 5% 0', md: '0 5% 0 0' }}
                  width={{
                    xs: '100%',
                    md: filename === '' && haveBill ? '100%' : '50%',
                  }}
                  height="calc(100% - 8px)"
                  sx={{
                    margin: billUploadFrom === 'bankCategorization' && '0',
                  }}
                >
                  {(billUploadFrom === 'bankCategorization' && <></>) || (
                    <div className={css.loaderWithHead}>
                      <Typography
                        className={
                          categorizationvendordetails &&
                          categorizationvendordetails.name
                            ? css.recordAnExpenseHeadingexternal
                            : css.recordAnExpenseHeading
                        }
                      >
                        Record a Bill
                      </Typography>
                      {newLoader.loader && <div className={css.loader07} />}
                    </div>
                  )}
                  {multipleBills?.isShow && (
                    <MultipleBillsRecord
                      multipleBills={multipleBills}
                      setMultipleBills={setMultipleBills}
                      stateFromUpload={state}
                    />
                  )}
                  {haveBill ? (
                    <>
                      {!pdfUrl && filename === '' && (
                        <Stack
                          className={css.uploadStackMain}
                          sx={{
                            padding:
                              billUploadFrom === 'bankCategorization' &&
                              '0 8px !important',
                          }}
                        >
                          <input
                            type="file"
                            ref={fileref}
                            name="file"
                            id="file"
                            className="inputfile"
                            accept="image/png, image/jpeg, application/pdf"
                            onChange={onFileUpload}
                            hidden
                          />

                          <label htmlFor="file" style={{ height: '100%' }}>
                            <Stack
                              className={
                                categorizationvendordetails &&
                                categorizationvendordetails.name
                                  ? css.uploadStackexternal
                                  : css.uploadStack
                              }
                              ref={dragfropref}
                              sx={{
                                height:
                                  billUploadFrom === 'bankCategorization' &&
                                  'calc(100% - 6px) !important',
                              }}
                            >
                              <Stack className={css.centerStack}>
                                <img
                                  src={featherupload}
                                  alt="upload"
                                  style={{ width: '120px' }}
                                />
                                <Typography className={css.text1}>
                                  upload your bills here
                                </Typography>
                                <Typography className={css.text2}>
                                  JPG, PNG or PDF
                                </Typography>

                                <Stack
                                  direction="row"
                                  gap="16px"
                                  alignItems="center"
                                  style={{ margin: '20px 0' }}
                                >
                                  <Button
                                    className={`${css.choose_bill_box_desktop}`}
                                    onClick={() => {
                                      navigate('/bill-box', {
                                        state: { from: 'recordExpense' },
                                      });
                                    }}
                                    disabled={state?.selected}
                                  >
                                    Choose from BillBox
                                  </Button>
                                  <Stack className={css.button}>
                                    <Typography className={css.buttontxt}>
                                      Browse
                                    </Typography>
                                  </Stack>
                                </Stack>

                                <Stack
                                  direction="row"
                                  onClick={() => {
                                    handleChange();
                                    setDntCheckbox(false);
                                  }}
                                >
                                  <Checkbox
                                    checked={selected}
                                    style={{ color: '#A0A4AF' }}
                                    onClick={() => {
                                      handleChange();
                                      setDntCheckbox(false);
                                    }}
                                    value="withoutBill"
                                  />
                                  <Typography className={css.text3}>
                                    Record Expense Without Bill{' '}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Stack>
                          </label>
                        </Stack>
                      )}
                      {pdfUrl && filename !== '' && (
                        <Stack className={css.mainView}>
                          {!newLoader?.continueFlow && partLoad && (
                            <div className={css.circularProgress}>
                              <CircularProgress style={{ color: '#F08B32' }} />
                              <p className={css.loaderP}>
                                Please wait until we are getting the data
                              </p>
                            </div>
                          )}
                          <Stack
                            className={css.imageView}
                            style={{
                              height: multipleBills?.isShow
                                ? 'calc(100vh - 280px)'
                                : 'calc(100vh - 240px)',
                            }}
                          >
                            {typeImage === 'image/jpeg' ||
                            typeImage === 'image/png' ? (
                              <TransformWrapper>
                                <TransformComponent>
                                  <img
                                    src={pdfUrl}
                                    alt="upload"
                                    style={{ width: '100%' }}
                                  />
                                </TransformComponent>
                              </TransformWrapper>
                            ) : (
                              <iframe
                                src={pdfUrl}
                                title="pdf"
                                frameBorder="0"
                                scrolling="no"
                                seamless="seamless"
                                className={css.scrolling}
                                // alt='uploadImg'
                              />
                            )}
                          </Stack>
                        </Stack>
                      )}
                    </>
                  ) : (
                    <div className={css.uploadContainerForDesktop}>
                      <div
                        style={{
                          height: 136,
                          width: 141,
                        }}
                      >
                        <img
                          src={alert}
                          alt="alert"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div
                        style={{
                          color: '#6E6E6E',
                          fontSize: '20px',
                          lineHeight: '20px',
                          marginBottom: '5px',
                          textAlign: 'center',
                        }}
                      >
                        It is recommended to always upload a bill especially for
                        any transction above Rs. 2000 for Tax Purposes
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          pointerEvents: state?.selected ? 'none' : '',
                        }}
                        onClick={handleChange}
                      >
                        <Checkbox
                          checked={unselect}
                          style={{ color: '#A0A4AF', cursor: 'pointer' }}
                          onClick={handleChange}
                          value="withBill"
                        />
                        <div
                          style={{
                            color: '#6E6E6E',
                            fontSize: '16px',
                            lineHeight: '15px',
                            cursor: 'pointer',
                            // fontWeight: 'bold',
                          }}
                        >
                          Record Expense Without Bill{' '}
                        </div>
                      </div>
                    </div>
                  )}
                </Stack>

                {(!haveBill || filename !== '') && (
                  <Stack
                    className={css.recordAnExpenseContainerDesktop}
                    width={{
                      xs: '100%',
                      md: '45%',
                    }}
                    height="calc(100% - 8px)"
                  >
                    <Stack className={css.mainView}>
                      <Stack className={css.RecordExp}>
                        <Typography className={css.RecordExpTitle}>
                          Record an Expense
                        </Typography>
                        {!(
                          (categorizationvendordetails?.id === '' &&
                            categorizationvendordetails?.name ===
                              'Do Not Track Vendor') ||
                          categorizationvendordetails?.id
                        ) && (
                          <Button
                            onClick={() => {
                              setLocalState(initialState);
                              setCalcAmount(initialCalCAmt);
                              setGSTPercentage(initialGSTPercentage);
                              setFormattedCalcAmount(initialCalCAmt);
                              setBillValue(0);
                              setExpenseAccountDetails({});
                              setAmountPayable(0);
                              setValidationErr(initialValidationErr);
                              setDntCheckbox(false);
                              setPaidByCompany({});
                              setPaidByCompanyAccount({});
                              setPaidByCompanyCard({});
                            }}
                          >
                            Clear all
                          </Button>
                        )}
                      </Stack>
                      <div className={css.inputContainerDesktop}>
                        <div
                          style={{
                            pointerEvents:
                              selectedTransactionUploadBill?.categorized &&
                              status === 'Edit' &&
                              'none',
                          }}
                          className={css.inputContainerDesktoppointer}
                        >
                          <Typography className={css.infotitle}>
                            Basic Info
                          </Typography>
                          <>
                            <>
                              <SelectBottomSheet
                                id="recordBillVendor"
                                name="vendor"
                                onBlur={(e) => {
                                  if (!dntCheckbox) reValidate(e);
                                }}
                                error={validationErr.vendor}
                                helperText={
                                  validationErr.vendor
                                    ? (!isVendorAvailable &&
                                        (localState.vendor?.name ||
                                          localState.vendor) &&
                                        'Add This vendor to the list') ||
                                      VALIDATION?.vendor?.errMsg
                                    : ''
                                }
                                Vendor_id={localState?.showReloadBtn}
                                showAddText={
                                  showTextData
                                    ? 'Add This Vendor'
                                    : 'Add Vendor'
                                }
                                label="Vendor"
                                open={drawer.vendor}
                                value={
                                  localState.vendor?.name
                                    ? localState.vendor?.name
                                    : localState.vendor
                                }
                                toShow={toShowBtn}
                                onTrigger={onTriggerDrawer}
                                onClose={() => {
                                  if (dntCheckbox) {
                                    handleBottomSheet('vendor', 'Do not track');
                                  } else {
                                    handleBottomSheet('vendor');
                                  }
                                  setPagination({
                                    totalPage: 1,
                                    currentPage: 1,
                                  });
                                }}
                                required={!dntCheckbox}
                                disabled={
                                  categorizationvendordetails?.id ||
                                  categorizationvendordetails?.name ===
                                    'Do Not Track Vendor'
                                }
                                classNames="vendorSelection"
                              >
                                {trigger === 'addManually' && (
                                  <VendorList
                                    trigger={trigger}
                                    vendorList={vendorList}
                                    setIsVendorAvailable={setIsVendorAvailable}
                                    valOfSelection={handleBottomSheet}
                                    onClick={(ps) => {
                                      handleBottomSheet('vendor', ps);
                                    }}
                                    onDoNotTrackVendor={(ps) =>
                                      handleDoNotTrackVendor(ps)
                                    }
                                    dntCheckbox={dntCheckbox}
                                    // setDntCheckbox={setDntCheckbox}
                                    continueFlow={() =>
                                      setDrawer((d) => ({
                                        ...d,
                                        vendor: false,
                                      }))
                                    }
                                    updateVendorList={getVendor}
                                    details={fetchDetails}
                                    closeAddVendor={() =>
                                      setDrawer((d) => ({
                                        ...d,
                                        vendor: false,
                                      }))
                                    }
                                    panEnable
                                  />
                                )}
                                {trigger === 'list' && (
                                  <CustomSearch
                                    showType="Vendor"
                                    customerList={vendorList}
                                    callFunction={getVendor}
                                    handleLocationParties={handleWithLocation}
                                    handleAllParties={(ps) =>
                                      handleBottomSheet('vendor', ps)
                                    }
                                    addNewOne={() => setTrigger('addManually')}
                                    openDrawer={onTriggerDrawerForEdit}
                                    dntCheckbox={dntCheckbox}
                                    onDoNotTrackVendor={(ps) =>
                                      handleDoNotTrackVendor(ps)
                                    }
                                    details={fetchDetails}
                                    from="billBooking"
                                    hideLocation
                                    pagination={pagination}
                                    setPagination={setPagination}
                                  />
                                )}
                              </SelectBottomSheet>

                              <SelectBottomSheet
                                name="edit"
                                triggerComponent={
                                  <div style={{ display: 'none' }} />
                                }
                                open={drawer.edit}
                                onTrigger={onTriggerDrawer}
                                onClose={handleBottomSheet}
                                maxHeight="45vh"
                              >
                                <div style={{ padding: '15px' }}>
                                  {device === 'mobile' && <Puller />}
                                  <div
                                    style={{ padding: '5px 0' }}
                                    className={css.headerContainer}
                                  >
                                    <p className={css.headerLabel}>
                                      {editValue?.name}
                                    </p>
                                    <span className={css.headerUnderline} />
                                  </div>
                                  <InvoiceCustomer
                                    showValue={editValue}
                                    handleBottomSheet={handleBottomSheet}
                                    type="vendors"
                                    openFrom="billBooking"
                                  />
                                </div>
                              </SelectBottomSheet>
                              {haveBill && (
                                <Input
                                  required
                                  name="invoiceNo"
                                  error={validationErr.invoiceNo}
                                  helperText={
                                    validationErr.invoiceNo
                                      ? VALIDATION?.invoiceNo?.errMsg
                                      : ''
                                  }
                                  onBlur={reValidate}
                                  className={`${css.greyBorder} ${classes.root}`}
                                  label="Bill Number"
                                  variant="standard"
                                  value={localState.invoiceNo}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  InputProps={{
                                    type: 'text',
                                    // endAdornment: vendorAvailable ? <CheckCircle /> : null,
                                  }}
                                  fullWidth
                                  onChange={onInputChange}
                                  theme="light"
                                />
                              )}
                            </>
                            <div className={css.dateContainer}>
                              {/* <SelectBottomSheet
                                name="date"
                                id="dateForDesktop"
                                onBlur={reValidate}
                                error={validationErr.date}
                                helperText={
                                  validationErr.date
                                    ? VALIDATION?.date?.errMsg
                                    : ''
                                }
                                label="Document Date"
                                value={
                                  localState.date === ''
                                    ? ''
                                    : moment(localState.date).format(
                                        'DD-MM-YYYY',
                                      )
                                }
                                required
                                dateChange={handleBottomSheet}
                                selectedDate={localState.date}
                                disabled={
                                  categorizationvendordetails?.id ||
                                  categorizationvendordetails?.name ===
                                    'Do Not Track Vendor'
                                }
                              /> */}

                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  name="date"
                                  id="dateForDesktop"
                                  inputFormat="DD-MM-YYYY"
                                  InputProps={{ disableUnderline: true }}
                                  value={localState?.date || ''}
                                  onChange={(e) => {
                                    if (moment(e?.$d, 'DD-MM-YYYY').isValid()) {
                                      saveBills(true, {
                                        document_date: moment(e.$d).format(
                                          'YYYY-MM-DD',
                                        ),
                                      });
                                      setValidationErr((prev) => ({
                                        ...prev,
                                        date: false,
                                      }));
                                    } else
                                      setValidationErr((prev) => ({
                                        ...prev,
                                        date: true,
                                      }));

                                    setLocalState((prev) => ({
                                      ...prev,
                                      date: e?.$d,
                                    }));
                                  }}
                                  views={['year', 'month', 'day']}
                                  renderInput={(params) => (
                                    <Input
                                      {...params}
                                      required
                                      label="Document Date"
                                      variant="standard"
                                      name="date"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      fullWidth
                                      theme="light"
                                      rootStyle={{
                                        border:
                                          '1px solid rgba(153, 158, 165, 0.39)',
                                        background: '#ededed26',
                                      }}
                                      error={validationErr?.date}
                                      helperText={
                                        validationErr?.date
                                          ? 'Enter Valid Document Date'
                                          : ''
                                      }
                                      disabled={
                                        categorizationvendordetails?.id ||
                                        categorizationvendordetails?.name ===
                                          'Do Not Track Vendor'
                                      }
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                              {/* <SelectBottomSheet
                                name="accountedOn"
                                id="accountedDateForDesktop"
                                onBlur={reValidate}
                                error={validationErr.accountedOn}
                                helperText={
                                  validationErr.accountedOn
                                    ? VALIDATION?.accountedOn?.errMsg
                                    : ''
                                }
                                label="Accounting Date"
                                value={
                                  localState.accountedOn === ''
                                    ? ''
                                    : moment(localState.accountedOn).format(
                                        'DD-MM-YYYY',
                                      )
                                }
                                required
                                dateChange={handleBottomSheet}
                                selectedDate={localState.accountedOn}
                                disabled={
                                  categorizationvendordetails?.id ||
                                  categorizationvendordetails?.name ===
                                    'Do Not Track Vendor'
                                }
                              /> */}
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  name="accountedOn"
                                  id="accountedDateForDesktop"
                                  inputFormat="DD-MM-YYYY"
                                  InputProps={{ disableUnderline: true }}
                                  value={localState?.accountedOn}
                                  onChange={(e) => {
                                    if (moment(e?.$d, 'DD-MM-YYYY').isValid()) {
                                      saveBills(true, {
                                        accounted_on: moment(e.$d).format(
                                          'YYYY-MM-DD',
                                        ),
                                      });
                                      setValidationErr((prev) => ({
                                        ...prev,
                                        accountedOn: false,
                                      }));
                                    } else
                                      setValidationErr((prev) => ({
                                        ...prev,
                                        accountedOn: true,
                                      }));

                                    setLocalState((prev) => ({
                                      ...prev,
                                      accountedOn: e?.$d,
                                    }));
                                  }}
                                  views={['year', 'month', 'day']}
                                  renderInput={(params) => (
                                    <Input
                                      {...params}
                                      required
                                      label="Accounting Date"
                                      variant="standard"
                                      name="accountedOn"
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      fullWidth
                                      theme="light"
                                      rootStyle={{
                                        border:
                                          '1px solid rgba(153, 158, 165, 0.39)',
                                        background: '#ededed26',
                                      }}
                                      error={validationErr?.accountedOn}
                                      helperText={
                                        validationErr?.accountedOn
                                          ? 'Enter Valid Accounted Date'
                                          : ''
                                      }
                                      disabled={
                                        categorizationvendordetails?.id ||
                                        categorizationvendordetails?.name ===
                                          'Do Not Track Vendor'
                                      }
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            </div>
                          </>

                          <Divider
                            style={{ backgroundColor: '#DCDCDC' }}
                            className={css.dividerHR}
                            width="100%"
                          />

                          <Typography className={css.infotitle}>
                            Accounting
                          </Typography>
                          <>
                            <SelectBottomSheet
                              name="expenseCategory"
                              onBlur={reValidate}
                              error={validationErr.expenseCategory}
                              helperText={
                                validationErr.expenseCategory
                                  ? VALIDATION?.expenseCategory?.errMsg
                                  : ''
                              }
                              label="Select Category"
                              open={drawer.expenseCategory}
                              value={localState.expenseCategory?.name}
                              onTrigger={onTriggerDrawer}
                              onClose={handleBottomSheet}
                              required
                              id="overFlowHidden"
                              classNames="expenseCategoryClass"
                            >
                              <ExpenseCategoryList
                                expenseCategoryList={expenseCategoryList}
                                assetCategoryList={assetCategoryList}
                                onClick={(ps) =>
                                  handleBottomSheet('expenseCategory', ps)
                                }
                                hasTDSCategory={false}
                                categoryListOpen={drawer.expenseCategory}
                                getExpenseCategory={getExpenseCategory}
                                getAssetCategory={getAssetCategory}
                              />
                            </SelectBottomSheet>

                            <Input
                              required
                              name="taxAmount"
                              // disabled={localState.noGst}
                              onBlur={reValidate}
                              error={validationErr.taxAmount}
                              helperText={
                                validationErr.taxAmount
                                  ? VALIDATION?.taxAmount?.errMsg
                                  : ''
                              }
                              className={`${css.greyBorder} ${classes.root}`}
                              label="Taxable Value"
                              variant="standard"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{
                                inputComponent: PriceCustom,
                                // endAdornment: vendorAvailable ? <CheckCircle /> : null,
                              }}
                              fullWidth
                              value={calcAmount?.taxAmount}
                              onChange={(event) => handleAmountChange(event)}
                              theme="light"
                              type="number"
                              placeholder="0"
                            />
                            {!hasNoGstin && (
                              <Stack className={css.gstStack}>
                                <Input
                                  name="cgstPercentage"
                                  className={`${css.greyBorder} ${css.percentageField} ${classes.root}`}
                                  label="CGST Percentage"
                                  variant="standard"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment
                                        position="start"
                                        style={{ margin: '0 4px 0 0' }}
                                      >
                                        %
                                      </InputAdornment>
                                    ),
                                  }}
                                  fullWidth
                                  value={GSTPercentage?.cgstPercentage}
                                  onChange={(event) =>
                                    handleGSTPercentageChange(event)
                                  }
                                  theme="light"
                                  disabled={calcAmount?.igst > 0}
                                  type="number"
                                  placeholder="0"
                                  step="0.01"
                                />

                                <Input
                                  required
                                  name="cgst"
                                  onBlur={reValidate}
                                  error={
                                    validationErr.igst
                                      ? false
                                      : validationErr.cgst
                                  }
                                  helperText={
                                    !validationErr.igst
                                      ? ''
                                      : validationErr.cgst
                                      ? VALIDATION?.cgst?.errMsg
                                      : ''
                                  }
                                  className={`${css.greyBorder} ${css.gstField} ${classes.root}`}
                                  label="CGST credit"
                                  variant="standard"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  InputProps={{
                                    inputComponent: PriceCustom,
                                    startAdornment: (
                                      <InputAdornment
                                        position="start"
                                        style={{ margin: '0 4px 0 0' }}
                                      >
                                        ₹
                                      </InputAdornment>
                                    ),
                                  }}
                                  fullWidth
                                  value={calcAmount?.cgst}
                                  onChange={(event) =>
                                    handleAmountChange(event)
                                  }
                                  theme="light"
                                  disabled={calcAmount?.igst > 0}
                                  type="number"
                                  placeholder="0"
                                />
                              </Stack>
                            )}
                            {!hasNoGstin && (
                              <Stack className={css.gstStack}>
                                <Input
                                  name="cgstPercentage"
                                  className={`${css.greyBorder} ${css.percentageField} ${classes.root}`}
                                  label="SGST Percentage"
                                  variant="standard"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment
                                        position="start"
                                        style={{ margin: '0 4px 0 0' }}
                                      >
                                        %
                                      </InputAdornment>
                                    ),
                                  }}
                                  fullWidth
                                  value={GSTPercentage?.cgstPercentage}
                                  onChange={(event) =>
                                    handleGSTPercentageChange(event)
                                  }
                                  theme="light"
                                  disabled={calcAmount?.igst > 0}
                                  type="number"
                                  placeholder="0"
                                />
                                <Input
                                  required
                                  name="cgst"
                                  onBlur={reValidate}
                                  error={
                                    validationErr.igst
                                      ? false
                                      : validationErr.cgst
                                  }
                                  helperText={
                                    !validationErr.igst
                                      ? ''
                                      : validationErr.cgst
                                      ? VALIDATION?.cgst?.errMsg
                                      : ''
                                  }
                                  className={`${css.greyBorder} ${css.gstField} ${classes.root}`}
                                  label="SGST credit"
                                  variant="standard"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  InputProps={{
                                    inputComponent: PriceCustom,
                                    startAdornment: (
                                      <InputAdornment
                                        position="start"
                                        style={{ margin: '0 4px 0 0' }}
                                      >
                                        ₹
                                      </InputAdornment>
                                    ),
                                  }}
                                  fullWidth
                                  value={calcAmount?.cgst}
                                  onChange={(event) =>
                                    handleAmountChange(event)
                                  }
                                  theme="light"
                                  disabled={calcAmount?.igst > 0}
                                  type="number"
                                  placeholder="0"
                                />
                              </Stack>
                            )}
                            {!hasNoGstin && (
                              <Stack className={css.gstStack}>
                                <Input
                                  name="igstPercentage"
                                  className={`${css.greyBorder} ${css.percentageField} ${classes.root}`}
                                  label="IGST Percentage"
                                  variant="standard"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment
                                        position="start"
                                        style={{ margin: '0 4px 0 0' }}
                                      >
                                        %
                                      </InputAdornment>
                                    ),
                                  }}
                                  fullWidth
                                  value={GSTPercentage?.igstPercentage}
                                  onChange={(event) =>
                                    handleGSTPercentageChange(event)
                                  }
                                  theme="light"
                                  disabled={calcAmount?.cgst > 0}
                                  type="number"
                                  placeholder="0"
                                />
                                <Input
                                  name="igst"
                                  required
                                  onBlur={reValidate}
                                  error={
                                    validationErr.cgst
                                      ? false
                                      : validationErr.igst
                                  }
                                  helperText={
                                    !validationErr.cgst
                                      ? ''
                                      : validationErr.igst
                                      ? VALIDATION?.igst?.errMsg
                                      : ''
                                  }
                                  className={`${css.greyBorder} ${css.gstField} ${classes.root}`}
                                  label="IGST credit"
                                  variant="standard"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  InputProps={{
                                    inputComponent: PriceCustom,
                                    startAdornment: (
                                      <InputAdornment
                                        position="start"
                                        style={{ margin: '0 4px 0 0' }}
                                      >
                                        ₹
                                      </InputAdornment>
                                    ),
                                  }}
                                  fullWidth
                                  value={calcAmount?.igst}
                                  onChange={(event) =>
                                    handleAmountChange(event)
                                  }
                                  theme="light"
                                  disabled={calcAmount?.cgst > 0}
                                  type="number"
                                  placeholder="0"
                                />
                              </Stack>
                            )}

                            <Input
                              name="billValue"
                              className={`${css.yBorder} ${classes.root}`}
                              label="Bill Value"
                              variant="standard"
                              value={billValue}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{
                                inputComponent: PriceCustom,
                                // endAdornment: vendorAvailable ? <CheckCircle /> : null,
                              }}
                              fullWidth
                              // onChange={onInputChange}
                              theme="light"
                              style={{
                                background: '#EDEDED',
                                PointerEvent: 'none',
                              }}
                              disabled
                            />

                            <Stack className={css.gstStack}>
                              <Input
                                name="tdsPercentage"
                                className={`${css.greyBorder} ${css.percentageField} ${classes.root}`}
                                label="TDS Percentage"
                                variant="standard"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment
                                      position="start"
                                      style={{ margin: '0 4px 0 0' }}
                                    >
                                      %
                                    </InputAdornment>
                                  ),
                                }}
                                fullWidth
                                value={GSTPercentage?.tdsPercentage}
                                onChange={(event) =>
                                  handleGSTPercentageChange(event)
                                }
                                theme="light"
                                type="number"
                                placeholder="0"
                                style={{
                                  background: orgSetting?.can_deduct_tds
                                    ? '#EDEDED'
                                    : '',
                                  PointerEvent: orgSetting?.can_deduct_tds
                                    ? 'none'
                                    : '',
                                }}
                                disabled={orgSetting?.can_deduct_tds}
                              />
                              <Input
                                name="tds"
                                className={`${css.greyBorder} ${css.gstField} ${classes.root}`}
                                label="TDS"
                                variant="standard"
                                value={billValue > 0 ? calcAmount.tds : ''}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                InputProps={{
                                  inputComponent: PriceCustom,
                                  startAdornment: (
                                    <InputAdornment
                                      position="start"
                                      style={{ margin: '0 4px 0 0' }}
                                    >
                                      ₹
                                    </InputAdornment>
                                  ),
                                }}
                                fullWidth
                                theme="light"
                                style={{
                                  background: orgSetting?.can_deduct_tds
                                    ? '#EDEDED'
                                    : '',
                                  PointerEvent: orgSetting?.can_deduct_tds
                                    ? 'none'
                                    : '',
                                }}
                                onChange={(event) => handleAmountChange(event)}
                                disabled={orgSetting?.can_deduct_tds}
                                type="number"
                                placeholder="0"
                              />
                            </Stack>

                            <Input
                              required
                              name="amount"
                              className={`${css.greyBorder} ${classes.root}`}
                              label="Amount Payable"
                              variant="standard"
                              value={billValue > 0 ? amountPayable : 0}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{
                                inputComponent: PriceCustom,
                                // endAdornment: vendorAvailable ? <CheckCircle /> : null,
                              }}
                              fullWidth
                              // onChange={onInputChange}
                              theme="light"
                              style={{
                                background: '#EDEDED',
                                PointerEvent: 'none',
                              }}
                              disabled
                            />
                            {
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
                                value={
                                  localState.paymentStatus?.id === 'personal'
                                    ? `${localState.paymentStatus?.label} - ${localState?.payer_id?.name}`
                                    : localState.paymentStatus?.label
                                }
                                onTrigger={onTriggerDrawer}
                                onClose={() =>
                                  setDrawer((d) => ({
                                    ...d,
                                    paymentStatus: false,
                                  }))
                                }
                                required
                                disabled={
                                  categorizationvendordetails?.id ||
                                  categorizationvendordetails?.name ===
                                    'Do Not Track Vendor'
                                }
                                classNames="PaymentStatusClass"
                              >
                                {!dntCheckbox
                                  ? paymentStatusListWithBill.map((ps) => (
                                      <div
                                        className={css.categoryOptions}
                                        key={ps?.id}
                                        role="menuitem"
                                      >
                                        {ps?.id === 'paid_as_advance' ? (
                                          <div
                                            style={{
                                              display: 'flex',
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                            }}
                                            onClick={() => {
                                              handleNextBottomSheet(
                                                'paymentStatus',
                                                'paidAdvance',
                                                ps,
                                              );
                                              // getVendorUnsettled();
                                            }}
                                          >
                                            <div>{ps.label}</div>
                                            <div
                                              style={{
                                                height: '18px',
                                                width: '10px',
                                                marginLeft: '13.42px',
                                                display: 'flex',
                                                alignItems: 'center',
                                              }}
                                            >
                                              <img
                                                src={rightArrow}
                                                alt="right-arrow"
                                                style={{
                                                  height: '100%',
                                                  width: '100%',
                                                  objectFit: 'contain',
                                                }}
                                              />
                                              {localState?.paymentStatus?.id ===
                                                ps?.id && (
                                                <Done
                                                  style={{ color: '#f08b32' }}
                                                />
                                              )}
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            <div
                                              onClick={() =>
                                                handleBottomSheet(
                                                  'paymentStatus',
                                                  ps,
                                                )
                                              }
                                              style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                              }}
                                            >
                                              {ps.label}
                                              {ps?.icon && (
                                                <img
                                                  src={rightArrow}
                                                  alt="right-arrow"
                                                  style={{ margin: '0 10px' }}
                                                />
                                              )}
                                              {localState?.paymentStatus?.id ===
                                                ps?.id && (
                                                <Done
                                                  style={{ color: '#f08b32' }}
                                                />
                                              )}
                                            </div>
                                            {ps?.id === 'company_cash' &&
                                              paidByCompany && (
                                                <>
                                                  <List
                                                    dense
                                                    sx={{
                                                      width: 'auto',
                                                      bgcolor:
                                                        'background.paper',
                                                      padding: 0,

                                                      margin: '12px 0 0 20px',
                                                    }}
                                                  >
                                                    {bankListingDetails.filter(
                                                      (item) =>
                                                        item.sub_account_group ===
                                                        'Cash Accounts',
                                                    )?.length > 0 ? (
                                                      <>
                                                        {bankListingDetails
                                                          .filter(
                                                            (item) =>
                                                              item.sub_account_group ===
                                                              'Cash Accounts',
                                                          )
                                                          ?.sort((a, b) =>
                                                            a.display_name.localeCompare(
                                                              b.display_name,
                                                            ),
                                                          )
                                                          ?.map((row) => (
                                                            <ListItem
                                                              sx={{
                                                                padding: 0,
                                                              }}
                                                              className={
                                                                classes.listitemRoot
                                                              }
                                                              key={
                                                                row.bank_account_id
                                                              }
                                                              onClick={() => {
                                                                handlePaymentStatus(
                                                                  row,
                                                                  setSelectedCashAccount,
                                                                  ps,
                                                                );
                                                              }}
                                                            >
                                                              <ListItemButton
                                                                sx={{
                                                                  padding:
                                                                    '0 0 0 11px',
                                                                }}
                                                                className={
                                                                  css.listitembtn
                                                                }
                                                              >
                                                                <FormControlLabel
                                                                  value="bank_account"
                                                                  sx={{
                                                                    marginRight:
                                                                      '4px',
                                                                  }}
                                                                  control={
                                                                    <BpRadio
                                                                      name="selectedCashAccount"
                                                                      checked={
                                                                        selectedCashAccount.bank_account_id ===
                                                                        row.bank_account_id
                                                                      }
                                                                      onChange={() => {
                                                                        handlePaymentStatus(
                                                                          row,
                                                                          setSelectedCashAccount,
                                                                          ps,
                                                                        );
                                                                      }}
                                                                    />
                                                                  }
                                                                />

                                                                <ListItemAvatar
                                                                  sx={{
                                                                    minWidth:
                                                                      '40px',
                                                                  }}
                                                                >
                                                                  <Avatar
                                                                    sx={{
                                                                      width:
                                                                        '32px',
                                                                      height:
                                                                        '32px',
                                                                    }}
                                                                    alt="Avatar"
                                                                    src={
                                                                      CashAccount
                                                                    }
                                                                  />
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                  primary={
                                                                    row.display_name ||
                                                                    ''
                                                                  }
                                                                  className={
                                                                    classes.AccountText
                                                                  }
                                                                />
                                                              </ListItemButton>
                                                            </ListItem>
                                                          ))}
                                                      </>
                                                    ) : (
                                                      <ListItem>
                                                        <ListItemText primary="No bank found." />
                                                      </ListItem>
                                                    )}
                                                  </List>
                                                </>
                                              )}
                                            {ps?.id === 'company_card' &&
                                              paidByCompanyCard && (
                                                <>
                                                  <List
                                                    dense
                                                    sx={{
                                                      width: 'auto',
                                                      bgcolor:
                                                        'background.paper',
                                                      padding: 0,

                                                      margin: '12px 0 0 20px',
                                                    }}
                                                  >
                                                    {bankListingDetails.filter(
                                                      (item) =>
                                                        item.bank_account_type ===
                                                          'company' &&
                                                        item?.account_type ===
                                                          'CREDIT CARD',
                                                    )?.length > 0 ? (
                                                      <>
                                                        {bankListingDetails
                                                          .filter(
                                                            (item) =>
                                                              item.bank_account_type ===
                                                                'company' &&
                                                              item?.account_type ===
                                                                'CREDIT CARD',
                                                          )
                                                          ?.sort((a, b) =>
                                                            a.display_name.localeCompare(
                                                              b.display_name,
                                                            ),
                                                          )
                                                          ?.map((row) => (
                                                            <ListItem
                                                              sx={{
                                                                padding: 0,
                                                              }}
                                                              className={
                                                                classes.listitemRoot
                                                              }
                                                              key={
                                                                row.bank_account_id
                                                              }
                                                              onClick={() => {
                                                                handlePaymentStatus(
                                                                  row,
                                                                  setSelectedCCCard,
                                                                  ps,
                                                                );
                                                              }}
                                                            >
                                                              <ListItemButton
                                                                sx={{
                                                                  padding:
                                                                    '0 0 0 11px',
                                                                }}
                                                                className={
                                                                  css.listitembtn
                                                                }
                                                              >
                                                                <FormControlLabel
                                                                  value="bank_account"
                                                                  sx={{
                                                                    marginRight:
                                                                      '4px',
                                                                  }}
                                                                  control={
                                                                    <BpRadio
                                                                      name="selectedaCCAccount"
                                                                      checked={
                                                                        selectedCCCard.bank_account_id ===
                                                                        row.bank_account_id
                                                                      }
                                                                      onChange={() => {
                                                                        handlePaymentStatus(
                                                                          row,
                                                                          setSelectedCCCard,
                                                                          ps,
                                                                        );
                                                                      }}
                                                                    />
                                                                  }
                                                                />

                                                                <ListItemAvatar
                                                                  sx={{
                                                                    minWidth:
                                                                      '40px',
                                                                  }}
                                                                >
                                                                  <Avatar
                                                                    sx={{
                                                                      width:
                                                                        '32px',
                                                                      height:
                                                                        '32px',
                                                                    }}
                                                                    alt="Avatar"
                                                                    src={
                                                                      CashAccount
                                                                    }
                                                                  />
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                  primary={
                                                                    row.display_name ||
                                                                    ''
                                                                  }
                                                                  className={
                                                                    classes.AccountText
                                                                  }
                                                                />
                                                              </ListItemButton>
                                                            </ListItem>
                                                          ))}
                                                      </>
                                                    ) : (
                                                      <ListItem>
                                                        <ListItemText primary="No Credit Card found." />
                                                      </ListItem>
                                                    )}
                                                  </List>
                                                </>
                                              )}
                                            {ps?.id === 'company_account' &&
                                              paidByCompanyAccount && (
                                                <>
                                                  <List
                                                    dense
                                                    sx={{
                                                      width: 'auto',
                                                      bgcolor:
                                                        'background.paper',
                                                      padding: 0,

                                                      margin: '12px 0 0 20px',
                                                    }}
                                                  >
                                                    {bankListingDetails.filter(
                                                      (item) =>
                                                        item.bank_account_type ===
                                                          'company' &&
                                                        (item?.account_type ===
                                                          'CURRENT' ||
                                                          item?.account_type ===
                                                            'SAVINGS') &&
                                                        item?.service_provider !==
                                                          'paysharp' &&
                                                        item?.service_provider !==
                                                          'fidypay',
                                                    )?.length > 0 ? (
                                                      <>
                                                        {bankListingDetails
                                                          .filter(
                                                            (item) =>
                                                              item.bank_account_type ===
                                                                'company' &&
                                                              (item?.account_type ===
                                                                'CURRENT' ||
                                                                item?.account_type ===
                                                                  'SAVINGS') &&
                                                              item?.service_provider !==
                                                                'paysharp' &&
                                                              item?.service_provider !==
                                                                'fidypay',
                                                          )
                                                          ?.sort((a, b) =>
                                                            a.display_name.localeCompare(
                                                              b.display_name,
                                                            ),
                                                          )
                                                          ?.map((row) => (
                                                            <ListItem
                                                              sx={{
                                                                padding: 0,
                                                              }}
                                                              className={
                                                                classes.listitemRoot
                                                              }
                                                              key={
                                                                row.bank_account_id
                                                              }
                                                              onClick={() => {
                                                                handlePaymentStatus(
                                                                  row,
                                                                  setSelectedCompanyAccount,
                                                                  ps,
                                                                );
                                                              }}
                                                            >
                                                              <ListItemButton
                                                                sx={{
                                                                  padding:
                                                                    '0 0 0 11px',
                                                                }}
                                                                className={
                                                                  css.listitembtn
                                                                }
                                                              >
                                                                <FormControlLabel
                                                                  value="bank_account"
                                                                  sx={{
                                                                    marginRight:
                                                                      '4px',
                                                                  }}
                                                                  control={
                                                                    <BpRadio
                                                                      name="selectedaCCAccount"
                                                                      checked={
                                                                        selectedCompanyAccount.bank_account_id ===
                                                                        row.bank_account_id
                                                                      }
                                                                      onChange={() => {
                                                                        handlePaymentStatus(
                                                                          row,
                                                                          setSelectedCompanyAccount,
                                                                          ps,
                                                                        );
                                                                      }}
                                                                    />
                                                                  }
                                                                />

                                                                <ListItemAvatar
                                                                  sx={{
                                                                    minWidth:
                                                                      '40px',
                                                                  }}
                                                                >
                                                                  <Avatar
                                                                    sx={{
                                                                      width:
                                                                        '32px',
                                                                      height:
                                                                        '32px',
                                                                    }}
                                                                    alt="Avatar"
                                                                    src={
                                                                      CashAccount
                                                                    }
                                                                  />
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                  primary={
                                                                    row.display_name ||
                                                                    ''
                                                                  }
                                                                  className={
                                                                    classes.AccountText
                                                                  }
                                                                />
                                                              </ListItemButton>
                                                            </ListItem>
                                                          ))}
                                                      </>
                                                    ) : (
                                                      <ListItem>
                                                        <ListItemText primary="No Account found." />
                                                      </ListItem>
                                                    )}
                                                  </List>
                                                </>
                                              )}
                                          </>
                                        )}
                                      </div>
                                    ))
                                  : paymentStatusListWithoutBill.map((ps) => (
                                      <div
                                        className={css.categoryOptions}
                                        key={ps?.id}
                                        role="menuitem"
                                      >
                                        <div
                                          onClick={() =>
                                            handleBottomSheet(
                                              'paymentStatus',
                                              ps,
                                            )
                                          }
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                          }}
                                        >
                                          {ps.label}
                                          {ps?.icon && (
                                            <img
                                              src={rightArrow}
                                              alt="right-arrow"
                                              style={{ margin: '0 10px' }}
                                            />
                                          )}
                                          {localState?.paymentStatus?.id ===
                                            ps?.id && (
                                            <Done
                                              style={{ color: '#f08b32' }}
                                            />
                                          )}
                                        </div>
                                        {ps?.id === 'company_cash' &&
                                          paidByCompany && (
                                            <>
                                              <List
                                                dense
                                                sx={{
                                                  width: 'auto',
                                                  bgcolor: 'background.paper',
                                                  padding: 0,

                                                  margin: '12px 0 0 20px',
                                                }}
                                              >
                                                {bankListingDetails.filter(
                                                  (item) =>
                                                    item.sub_account_group ===
                                                    'Cash Accounts',
                                                )?.length > 0 ? (
                                                  <>
                                                    {bankListingDetails
                                                      .filter(
                                                        (item) =>
                                                          item.sub_account_group ===
                                                          'Cash Accounts',
                                                      )
                                                      ?.sort((a, b) =>
                                                        a.display_name.localeCompare(
                                                          b.display_name,
                                                        ),
                                                      )
                                                      ?.map((row) => (
                                                        <ListItem
                                                          sx={{
                                                            padding: 0,
                                                          }}
                                                          className={
                                                            classes.listitemRoot
                                                          }
                                                          key={
                                                            row.bank_account_id
                                                          }
                                                          onClick={() => {
                                                            handlePaymentStatus(
                                                              row,
                                                              setSelectedCashAccount,
                                                              ps,
                                                            );
                                                          }}
                                                        >
                                                          <ListItemButton
                                                            sx={{
                                                              padding:
                                                                '0 0 0 11px',
                                                            }}
                                                            className={
                                                              css.listitembtn
                                                            }
                                                          >
                                                            <FormControlLabel
                                                              value="bank_account"
                                                              sx={{
                                                                marginRight:
                                                                  '4px',
                                                              }}
                                                              control={
                                                                <BpRadio
                                                                  name="selectedCashAccount"
                                                                  checked={
                                                                    selectedCashAccount.bank_account_id ===
                                                                    row.bank_account_id
                                                                  }
                                                                  onChange={() => {
                                                                    handlePaymentStatus(
                                                                      row,
                                                                      setSelectedCashAccount,
                                                                      ps,
                                                                    );
                                                                  }}
                                                                />
                                                              }
                                                            />

                                                            <ListItemAvatar
                                                              sx={{
                                                                minWidth:
                                                                  '40px',
                                                              }}
                                                            >
                                                              <Avatar
                                                                sx={{
                                                                  width: '32px',
                                                                  height:
                                                                    '32px',
                                                                }}
                                                                alt="Avatar"
                                                                src={
                                                                  CashAccount
                                                                }
                                                              />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                              primary={
                                                                row.display_name ||
                                                                ''
                                                              }
                                                              className={
                                                                classes.AccountText
                                                              }
                                                            />
                                                          </ListItemButton>
                                                        </ListItem>
                                                      ))}
                                                  </>
                                                ) : (
                                                  <ListItem>
                                                    <ListItemText primary="No cash account found." />
                                                  </ListItem>
                                                )}
                                              </List>
                                            </>
                                          )}
                                        {ps?.id === 'company_card' &&
                                          paidByCompanyCard && (
                                            <>
                                              <List
                                                dense
                                                sx={{
                                                  width: 'auto',
                                                  bgcolor: 'background.paper',
                                                  padding: 0,

                                                  margin: '12px 0 0 20px',
                                                }}
                                              >
                                                {bankListingDetails.filter(
                                                  (item) =>
                                                    item.bank_account_type ===
                                                      'company' &&
                                                    item?.account_type ===
                                                      'CREDIT CARD',
                                                )?.length > 0 ? (
                                                  <>
                                                    {bankListingDetails
                                                      .filter(
                                                        (item) =>
                                                          item.bank_account_type ===
                                                            'company' &&
                                                          item?.account_type ===
                                                            'CREDIT CARD',
                                                      )
                                                      ?.sort((a, b) =>
                                                        a.display_name.localeCompare(
                                                          b.display_name,
                                                        ),
                                                      )
                                                      ?.map((row) => (
                                                        <ListItem
                                                          sx={{
                                                            padding: 0,
                                                          }}
                                                          className={
                                                            classes.listitemRoot
                                                          }
                                                          key={
                                                            row.bank_account_id
                                                          }
                                                          // onClick={handleAccountClick(
                                                          //   row,
                                                          //   'CompanyCard',
                                                          //   billId,
                                                          // )}
                                                          onClick={() => {
                                                            handlePaymentStatus(
                                                              row,
                                                              setSelectedCCCard,
                                                              ps,
                                                            );
                                                          }}
                                                        >
                                                          <ListItemButton
                                                            sx={{
                                                              padding:
                                                                '0 0 0 11px',
                                                            }}
                                                            className={
                                                              css.listitembtn
                                                            }
                                                          >
                                                            <FormControlLabel
                                                              value="bank_account"
                                                              sx={{
                                                                marginRight:
                                                                  '4px',
                                                              }}
                                                              control={
                                                                <BpRadio
                                                                  name="selectedCashAccount"
                                                                  checked={
                                                                    selectedCCCard.bank_account_id ===
                                                                    row.bank_account_id
                                                                  }
                                                                  onChange={() => {
                                                                    handlePaymentStatus(
                                                                      row,
                                                                      setSelectedCCCard,
                                                                      ps,
                                                                    );
                                                                  }}
                                                                />
                                                              }
                                                            />

                                                            <ListItemAvatar
                                                              sx={{
                                                                minWidth:
                                                                  '40px',
                                                              }}
                                                            >
                                                              <Avatar
                                                                sx={{
                                                                  width: '32px',
                                                                  height:
                                                                    '32px',
                                                                }}
                                                                alt="Avatar"
                                                                src={
                                                                  CashAccount
                                                                }
                                                              />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                              primary={
                                                                row.display_name ||
                                                                ''
                                                              }
                                                              className={
                                                                classes.AccountText
                                                              }
                                                            />
                                                          </ListItemButton>
                                                        </ListItem>
                                                      ))}
                                                  </>
                                                ) : (
                                                  <ListItem>
                                                    <ListItemText primary="No Credit Card found." />
                                                  </ListItem>
                                                )}
                                              </List>
                                            </>
                                          )}
                                        {ps?.id === 'company_account' &&
                                          paidByCompanyAccount && (
                                            <>
                                              <List
                                                dense
                                                sx={{
                                                  width: 'auto',
                                                  bgcolor: 'background.paper',
                                                  padding: 0,

                                                  margin: '12px 0 0 20px',
                                                }}
                                              >
                                                {bankListingDetails.filter(
                                                  (item) =>
                                                    item.bank_account_type ===
                                                      'company' &&
                                                    (item?.account_type ===
                                                      'CURRENT' ||
                                                      item?.account_type ===
                                                        'SAVINGS') &&
                                                    item?.service_provider !==
                                                      'paysharp' &&
                                                    item?.service_provider !==
                                                      'fidypay',
                                                )?.length > 0 ? (
                                                  <>
                                                    {bankListingDetails
                                                      .filter(
                                                        (item) =>
                                                          item.bank_account_type ===
                                                            'company' &&
                                                          (item?.account_type ===
                                                            'CURRENT' ||
                                                            item?.account_type ===
                                                              'SAVINGS') &&
                                                          item?.service_provider !==
                                                            'paysharp' &&
                                                          item?.service_provider !==
                                                            'fidypay',
                                                      )
                                                      ?.sort((a, b) =>
                                                        a.display_name.localeCompare(
                                                          b.display_name,
                                                        ),
                                                      )
                                                      ?.map((row) => (
                                                        <ListItem
                                                          sx={{
                                                            padding: 0,
                                                          }}
                                                          className={
                                                            classes.listitemRoot
                                                          }
                                                          key={
                                                            row.bank_account_id
                                                          }
                                                          onClick={() => {
                                                            handlePaymentStatus(
                                                              row,
                                                              setSelectedCompanyAccount,
                                                              ps,
                                                            );
                                                          }}
                                                        >
                                                          <ListItemButton
                                                            sx={{
                                                              padding:
                                                                '0 0 0 11px',
                                                            }}
                                                            className={
                                                              css.listitembtn
                                                            }
                                                          >
                                                            <FormControlLabel
                                                              value="bank_account"
                                                              sx={{
                                                                marginRight:
                                                                  '4px',
                                                              }}
                                                              control={
                                                                <BpRadio
                                                                  name="selectedaCCAccount"
                                                                  checked={
                                                                    selectedCompanyAccount.bank_account_id ===
                                                                    row.bank_account_id
                                                                  }
                                                                  onChange={() => {
                                                                    handlePaymentStatus(
                                                                      row,
                                                                      setSelectedCompanyAccount,
                                                                      ps,
                                                                    );
                                                                  }}
                                                                />
                                                              }
                                                            />

                                                            <ListItemAvatar
                                                              sx={{
                                                                minWidth:
                                                                  '40px',
                                                              }}
                                                            >
                                                              <Avatar
                                                                sx={{
                                                                  width: '32px',
                                                                  height:
                                                                    '32px',
                                                                }}
                                                                alt="Avatar"
                                                                src={
                                                                  CashAccount
                                                                }
                                                              />
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                              primary={
                                                                row.display_name ||
                                                                ''
                                                              }
                                                              className={
                                                                classes.AccountText
                                                              }
                                                            />
                                                          </ListItemButton>
                                                        </ListItem>
                                                      ))}
                                                  </>
                                                ) : (
                                                  <ListItem>
                                                    <ListItemText primary="No Account found." />
                                                  </ListItem>
                                                )}
                                              </List>
                                            </>
                                          )}
                                      </div>
                                    ))}
                              </SelectBottomSheet>
                            }
                          </>

                          {localState?.paymentStatus?.id ===
                            'paid_as_advance' && (
                            <>
                              <Divider
                                style={{ backgroundColor: '#DCDCDC' }}
                                className={css.dividerHR}
                                width="100%"
                              />
                              <Typography>Advances To Adjust</Typography>
                              <TableContainer
                                style={{
                                  borderRadius: 30,
                                  // maxHeight: '59vh',
                                  height: 'max-content',
                                }}
                                className={css.tableDiv}
                              >
                                <Table
                                  stickyHeader
                                  size="medium"
                                  style={{ background: '#ffff' }}
                                >
                                  <TableHead
                                    sx={{
                                      bgcolor: '#0000',
                                      fontSize: '13px',
                                      borderColor: (theme) =>
                                        theme.palette.grey[100],
                                    }}
                                  >
                                    {['Date', 'Area', 'Money'].map((title) => (
                                      <TableCell>
                                        <Typography className={css.tableHead}>
                                          {title}
                                        </Typography>
                                      </TableCell>
                                    ))}
                                  </TableHead>

                                  <TableBody>
                                    {/* {customerData?.map((value) => ( */}
                                    {vendorsUnsettledList &&
                                    vendorsUnsettledList.length > 0 ? (
                                      vendorsUnsettledList.map((item) => (
                                        <TableRow
                                          sx={{
                                            borderColor: (theme) =>
                                              theme.palette.grey[100],
                                          }}
                                        >
                                          <>
                                            <TableCell
                                              className={css.tableCell}
                                            >
                                              <Typography
                                                nowrap
                                                variant="body2"
                                                className={css.tableBillNumber}
                                                noWrap
                                              >
                                                <Checkbox
                                                  onClick={() =>
                                                    hangleChecked(item?.id)
                                                  }
                                                  inputProps={{
                                                    'aria-label': 'controlled',
                                                  }}
                                                  checked={advancesData?.includes(
                                                    item?.id,
                                                  )}
                                                  value={item}
                                                />
                                                {moment(item?.date).format(
                                                  'DD-MM-YYYY',
                                                )}
                                              </Typography>
                                            </TableCell>
                                            <TableCell
                                              className={css.tableCell}
                                            >
                                              <Typography
                                                variant="body2"
                                                className={css.tableFont}
                                              >
                                                {item?.document_number}
                                              </Typography>
                                              {/* <TableCell> */}
                                              <Typography
                                                variant="body2"
                                                className={css.tableFontSm}
                                              >
                                                {item?.narration}
                                              </Typography>
                                              {/* </TableCell> */}
                                            </TableCell>
                                            <TableCell
                                              className={css.tableCell}
                                            >
                                              <Typography
                                                nowrap
                                                variant="body2"
                                                className={css.tableBillNumber2}
                                                noWrap
                                              >
                                                {FormattedAmount(
                                                  item?.net_balance,
                                                )}
                                              </Typography>
                                            </TableCell>
                                          </>
                                        </TableRow>
                                      ))
                                    ) : (
                                      <TableRow
                                        sx={{
                                          borderColor: (theme) =>
                                            theme.palette.grey[100],
                                        }}
                                      >
                                        <TableCell
                                          className={css.tableCell}
                                          colSpan={3}
                                        >
                                          <Typography
                                            nowrap
                                            variant="body2"
                                            className={css.tableNoBill}
                                            align="center"
                                          >
                                            No Advance Bill
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </>
                          )}
                          {localState?.paymentStatus?.id === 'to_pay' && (
                            <PaymentTerms
                              fromBill={true}
                              callFunction={(val) =>
                                handleBottomSheet(
                                  'creditPeriod',
                                  val?.credit_period,
                                )
                              }
                              selectCustomer={{
                                credit_period: localState?.creditPeriod || '',
                              }}
                            />
                          )}

                          <Divider
                            style={{ backgroundColor: '#DCDCDC' }}
                            className={css.dividerHR}
                            width="100%"
                          />

                          <Typography className={css.infotitle}>
                            Internal Notes
                          </Typography>
                          <>
                            <Input
                              name="description"
                              onBlur={reValidate}
                              error={validationErr.description}
                              helperText={
                                validationErr.description
                                  ? VALIDATION?.description?.errMsg
                                  : ''
                              }
                              label="Note"
                              placeholder="what's this for"
                              variant="standard"
                              className={`${css.greyBorder} ${classes.root}`}
                              value={localState.description}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              fullWidth
                              onChange={(event) => onInputChange(event)}
                              theme="light"
                              multiline
                              rows={4}
                            />
                          </>
                        </div>

                        {(selectedTransactionUploadBill?.categorized &&
                          status === 'Edit' && (
                            <Stack
                              direction="row"
                              className={
                                css.actionContainerexternalmobilewitheditdesktop
                              }
                            >
                              <div className={css.buttonwithcategorizedeachdiv}>
                                <input
                                  type="button"
                                  className={css.buttonwithcategorized}
                                  value="Categorized"
                                />
                              </div>
                              <div className={css.buttonwithcategorizedeachdiv}>
                                <input
                                  type="button"
                                  className={css.buttonwithedit}
                                  value="Edit"
                                  onClick={() => {
                                    setTransactionStatus('Add');
                                  }}
                                />
                              </div>
                            </Stack>
                          )) || (
                          <Stack className={css.buttons}>
                            <Grid
                              item
                              xs={12}
                              display="flex"
                              justifyContent="center"
                            >
                              <input
                                type="button"
                                className={css.button0}
                                onClick={() => {
                                  onRecordBill();
                                }}
                                value={
                                  billUploadFrom === 'bankCategorization'
                                    ? 'Categorize Now'
                                    : 'Record and Proceed to next bill'
                                }
                              />
                            </Grid>
                            {haveBill && (
                              <Grid
                                item
                                xs={12}
                                display="flex"
                                justifyContent="center"
                                mb="15px"
                              >
                                <Button
                                  variant="contained"
                                  style={{
                                    boxShadow: 'none',
                                    textTransform: 'initial',
                                    backgroundColor: '#fff',
                                    color: '#f08b32',
                                    border: '1px solid #f08b32',
                                    borderRadius: '18px',
                                    fontSize: '13px',
                                    width: '90%',
                                  }}
                                  onClick={() => {
                                    setNewLoader((prev) => ({
                                      ...prev,
                                      superAccount: true,
                                    }));
                                  }}
                                >
                                  Assign to SuperAccountant
                                </Button>
                              </Grid>
                            )}
                          </Stack>
                        )}
                      </div>
                      {/* </div> */}
                    </Stack>
                  </Stack>
                )}
              </>
            )}
            {view === VIEW.DONE && (
              <SuccessView
                title="Done"
                description={
                  response.assigned_to_super_accountant &&
                  response.status === 'draft'
                    ? `The SuperAccountant is reviewing your new expense category, ${response?.expense_account?.name}. It’s currently in ‘Assinged Bills’ and will shift to Accounted Bills’ once approved.`
                    : `${response?.expense_account?.name} ${response?.status} ${
                        response?.vendor?.name
                          ? `to ${response?.vendor?.name}`
                          : ''
                      } for Rs. ${response?.amount} has been recorded`
                }
                onClick={onAddAnotherBill}
                typePage={
                  state?.emailBillBox
                    ? { name: 'emailBill', stateForBack: state?.stateForBack }
                    : false
                }
              />
            )}
          </Stack>
        ) : (
          <>
            <div
              className={css.recordAnExpenseContainer}
              style={{
                padding:
                  view === VIEW.EDIT
                    ? '20px 10px'
                    : (view === VIEW.SUPER && '5%') || '20px',
                overflow: view === VIEW.SUPER ? 'unset' : 'auto',
                width: view === VIEW.SUPER && '90%',
                background: billUploadFrom === 'bankCategorization' && '#FFF',
              }}
            >
              {billUploadFrom !== 'bankCategorization' && (
                <div className={css.headerContainer}>
                  <div className={css.headerLabel}>
                    {view === VIEW.MAIN && 'Record an Expense'}
                    {view === VIEW.VENDOR && 'Add New Vendor'}
                    {view === VIEW.DONE && 'Bill Status'}
                    {view === VIEW.EDIT && editValue?.name}
                    {view === VIEW.SUPER && 'Assign to SuperAccountant'}
                  </div>
                  <span className={css.headerUnderline} />
                </div>
              )}
              {multipleBills?.isShow && (
                <MultipleBillsRecord
                  multipleBills={multipleBills}
                  setMultipleBills={setMultipleBills}
                  stateFromUpload={state}
                />
              )}
              {view === VIEW.MAIN && (
                <>
                  <div
                    className={css.inputContainer}
                    style={{
                      margin:
                        billUploadFrom === 'bankCategorization' && '0 0 25px 0',
                      pointerEvents:
                        selectedTransactionUploadBill?.categorized &&
                        status === 'Edit' &&
                        'none',
                    }}
                  >
                    {haveBill ? (
                      <div
                        className={
                          pdfUrl && filename !== '' && partLoad
                            ? `${css.uploadContainer} ${css.newBackDropMob}`
                            : `${css.uploadContainer}`
                        }
                      >
                        {pdfUrl && filename !== '' && partLoad && (
                          <div className={css.circularProgress}>
                            <CircularProgress style={{ color: '#F08B32' }} />
                            <p className={css.loaderP}>
                              Please wait until we are getting the data
                            </p>
                          </div>
                        )}
                        {filename !== '' && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '0',
                              left: '0',
                              right: '0',
                              bottom: '0',
                              width: '100%',
                              height: '100%',
                              background: '#000000',
                              opacity: '.3',
                            }}
                          />
                        )}
                        {!partLoad && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 5,
                              width: '90%',
                            }}
                          >
                            <input
                              id="upload"
                              name="avatar"
                              type="file"
                              accept="image/png, image/jpeg, application/pdf"
                              onChange={onFileUpload}
                            />
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                              }}
                            >
                              <CloudUpload className={css.icon} />
                              <div className={css.title}>
                                {filename || 'Upload your bills here'}
                              </div>
                            </div>
                            <Stack alignItems="center">
                              <div className={css.uploadActionContainer}>
                                {window.isDevice() === true ? (
                                  <Button
                                    className={`${css.submitButton}`}
                                    onClick={() => {
                                      ocrByScan();
                                    }}
                                  >
                                    Scan
                                  </Button>
                                ) : (
                                  <label
                                    className={`${css.submitButton}`}
                                    htmlFor="upload"
                                    style={{
                                      pointerEvents: state?.selected
                                        ? 'none'
                                        : '',
                                    }}
                                  >
                                    Scan
                                  </label>
                                )}

                                {window.isDevice() === true ? (
                                  <Button
                                    className={`${css.submitButton}`}
                                    onClick={() => {
                                      ocrByBrowse();
                                    }}
                                  >
                                    Browse
                                  </Button>
                                ) : (
                                  <label
                                    className={`${css.submitButton}`}
                                    htmlFor="upload"
                                    style={{
                                      pointerEvents: state?.selected
                                        ? 'none'
                                        : '',
                                    }}
                                  >
                                    Browse
                                  </label>
                                )}
                              </div>
                              <Button
                                className={`${css.choose_bill_box}`}
                                onClick={() => {
                                  navigate('/bill-box', {
                                    state: { from: 'recordExpense' },
                                  });
                                }}
                                disabled={state?.selected}
                              >
                                Choose from BillBox
                              </Button>
                            </Stack>
                            <div
                              style={{
                                height: '3px',
                                width: '100%',
                                backgroundColor: '#000000',
                              }}
                            />
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                pointerEvents: state?.selected ? 'none' : '',
                              }}
                              onClick={handleChange}
                            >
                              <Checkbox
                                checked={selected}
                                style={{ color: '#A0A4AF' }}
                                onClick={handleChange}
                                value="withoutBill"
                              />
                              <div>Record Expense Without Bill </div>
                            </div>
                          </div>
                        )}

                        {filename !== '' && (
                          <iframe
                            src={pdfUrl}
                            title="pdf"
                            frameBorder="0"
                            scrolling="no"
                            seamless="seamless"
                            className={css.scrolling}
                          />
                        )}
                      </div>
                    ) : (
                      <div className={css.uploadContainer}>
                        <div
                          style={{
                            height: '80px',
                            width: '89px',
                            marginBottom: '23px',
                            paddingTop: '5px',
                          }}
                        >
                          <img
                            src={alert}
                            alt="alert"
                            style={{ height: '100%', width: '100%' }}
                          />
                        </div>
                        <div
                          style={{
                            color: '#6E6E6E',
                            fontSize: '12px',
                            lineHeight: '15px',
                            marginBottom: '5px',
                            textAlign: 'center',
                          }}
                        >
                          It is recommended to always upload a bill especially
                          for any transction above Rs. 2000 for Tax Purposes
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: state?.selected ? 'none' : '',
                          }}
                          onClick={handleChange}
                        >
                          <Checkbox
                            checked={unselect}
                            style={{ color: '#A0A4AF' }}
                            onClick={handleChange}
                            value="withBill"
                          />
                          <div
                            style={{
                              color: '#6E6E6E',
                              fontSize: '16px',
                              lineHeight: '15px',
                              // fontWeight: 'bold',
                            }}
                          >
                            Record Expense Without Bill{' '}
                          </div>
                        </div>
                      </div>
                    )}
                    <SelectBottomSheet
                      name="expenseCategory"
                      onBlur={reValidate}
                      error={validationErr.expenseCategory}
                      helperText={
                        validationErr.expenseCategory
                          ? VALIDATION?.expenseCategory?.errMsg
                          : ''
                      }
                      label="Select Category"
                      open={drawer.expenseCategory}
                      value={localState.expenseCategory?.name}
                      onTrigger={onTriggerDrawer}
                      onClose={handleBottomSheet}
                      required
                      id="overFlowHidden"
                      classNames="expenseCategoryClass"
                    >
                      <ExpenseCategoryList
                        expenseCategoryList={expenseCategoryList}
                        assetCategoryList={assetCategoryList}
                        onClick={(ps) =>
                          handleBottomSheet('expenseCategory', ps)
                        }
                        hasTDSCategory={false}
                        categoryListOpen={drawer.expenseCategory}
                        getExpenseCategory={getExpenseCategory}
                        getAssetCategory={getAssetCategory}
                      />
                    </SelectBottomSheet>
                    <SelectBottomSheet
                      id="recordBillVendor"
                      name="vendor"
                      onBlur={(e) => {
                        if (!dntCheckbox) reValidate(e);
                      }}
                      error={validationErr.vendor}
                      helperText={
                        validationErr.vendor
                          ? (!isVendorAvailable &&
                              (localState.vendor?.name || localState.vendor) &&
                              'Add This vendor to the list') ||
                            VALIDATION?.vendor?.errMsg
                          : ''
                      }
                      Vendor_id={localState?.showReloadBtn}
                      label="Vendor"
                      open={drawer.vendor}
                      value={
                        localState.vendor?.name
                          ? localState.vendor?.name
                          : localState.vendor
                      }
                      toShow={toShowBtn}
                      onTrigger={onTriggerDrawer}
                      onClose={() => {
                        if (dntCheckbox) {
                          handleBottomSheet('vendor', 'Do not track');
                        } else {
                          handleBottomSheet('vendor');
                        }
                        setPagination({
                          totalPage: 1,
                          currentPage: 1,
                        });
                      }}
                      required={!dntCheckbox}
                      addNewSheet={!(trigger === 'list')}
                      showAddText={
                        showTextData ? 'Add This Vendor' : 'Add Vendor'
                      }
                      disabled={
                        categorizationvendordetails?.id ||
                        categorizationvendordetails?.name ===
                          'Do Not Track Vendor'
                      }
                      classNames="vendorSelection"
                    >
                      {trigger === 'addManually' && (
                        <VendorList
                          trigger={trigger}
                          vendorList={vendorList}
                          valOfSelection={handleBottomSheet}
                          onClick={(ps) => handleBottomSheet('vendor', ps)}
                          onDoNotTrackVendor={(ps) =>
                            handleDoNotTrackVendor(ps)
                          }
                          dntCheckbox={dntCheckbox}
                          // setDntCheckbox={setDntCheckbox}
                          continueFlow={() =>
                            setDrawer((d) => ({ ...d, vendor: false }))
                          }
                          updateVendorList={getVendor}
                          details={fetchDetails}
                          panEnable
                        />
                      )}
                      {trigger === 'list' && (
                        <CustomSearch
                          showType="Vendor"
                          customerList={vendorList}
                          callFunction={getVendor}
                          handleLocationParties={handleWithLocation}
                          handleAllParties={(ps) =>
                            handleBottomSheet('vendor', ps)
                          }
                          addNewOne={() => setTrigger('addManually')}
                          openDrawer={onTriggerDrawerForEdit}
                          dntCheckbox={dntCheckbox}
                          onDoNotTrackVendor={(ps) =>
                            handleDoNotTrackVendor(ps)
                          }
                          details={fetchDetails}
                          from="billBooking"
                          pagination={pagination}
                          setPagination={setPagination}
                        />
                      )}
                    </SelectBottomSheet>
                    {/* )} */}
                    <SelectBottomSheet
                      name="amount"
                      onBlur={reValidate}
                      error={validationErr.amount}
                      helperText={
                        validationErr.amount ? VALIDATION?.amount?.errMsg : ''
                      }
                      className={`${css.greyBorder} ${classes.root}`}
                      label="Amount Payable"
                      open={drawer.amount}
                      value={billValue > 0 ? FormattedAmount(amountPayable) : 0}
                      onTrigger={onTriggerDrawer}
                      onClose={handleBottomSheet}
                      required
                      addNewSheet
                    >
                      <div className={css.amountPayable}>
                        <div className={css.header}>
                          <div className={css.valueHeader}>
                            Amount Payable Details
                          </div>
                          <div className={css.headerUnderline} />
                        </div>
                        <div className={css.row}>
                          <div className={css.lable}> Taxable Amount </div>
                          <div className={css.inputFieldWrapper}>
                            <AmountFormatCustom
                              align="right"
                              className={css.inputField}
                              name="taxAmount"
                              value={formattedCalcAmount?.taxAmount}
                              onChange={(event) => handleAmountChange(event)}
                              id="taxAmount"
                              onFocus={(e) => {
                                setTimeout(function () {
                                  e.target.selectionStart =
                                    e.target.selectionEnd =
                                      e?.target?.value?.length;
                                }, 0);
                              }}
                              placeholder="0"
                            />
                          </div>
                        </div>
                        {!hasNoGstin && (
                          <div className={css.row}>
                            <div className={css.lable}> CGST </div>
                            <div
                              className={
                                calcAmount?.igst > 0
                                  ? css.inputHidden
                                  : css.inputFieldWrapper
                              }
                            >
                              <AmountFormatCustom
                                align="right"
                                className={css.inputField}
                                name="cgst"
                                value={formattedCalcAmount?.cgst}
                                onChange={(event) => handleAmountChange(event)}
                                id="cgst"
                                onFocus={(e) => {
                                  setTimeout(function () {
                                    e.target.selectionStart =
                                      e.target.selectionEnd =
                                        e?.target?.value?.length;
                                  }, 0);
                                }}
                                placeholder="0"
                              />
                            </div>
                          </div>
                        )}
                        {!hasNoGstin && (
                          <div className={css.row}>
                            <div className={css.lable}> SGST</div>
                            <div
                              className={
                                calcAmount?.igst > 0
                                  ? css.inputHidden
                                  : css.inputFieldWrapper
                              }
                            >
                              <AmountFormatCustom
                                align="right"
                                className={css.inputField}
                                name="cgst"
                                value={formattedCalcAmount?.cgst}
                                onChange={(event) => handleAmountChange(event)}
                                id="sgst"
                                onFocus={(e) => {
                                  setTimeout(function () {
                                    e.target.selectionStart =
                                      e.target.selectionEnd =
                                        e?.target?.value?.length;
                                  }, 0);
                                }}
                                placeholder="0"
                              />
                            </div>
                          </div>
                        )}

                        {!hasNoGstin && (
                          <div className={css.row}>
                            <div className={css.lable}> IGST </div>
                            <div
                              className={
                                calcAmount?.cgst > 0
                                  ? css.inputHidden
                                  : css.inputFieldWrapper
                              }
                            >
                              <AmountFormatCustom
                                align="right"
                                className={css.inputField}
                                name="igst"
                                value={formattedCalcAmount?.igst}
                                onChange={(event) => handleAmountChange(event)}
                                id="igst"
                                onFocus={(e) => {
                                  setTimeout(function () {
                                    e.target.selectionStart =
                                      e.target.selectionEnd =
                                        e?.target?.value?.length;
                                  }, 0);
                                }}
                                placeholder="0"
                              />
                            </div>
                          </div>
                        )}

                        <div className={css.row}>
                          <div className={css.lable}>Bill Value </div>
                          <input
                            className={css.autoFillDetails}
                            // type="number"
                            value={FormattedAmount(billValue)}
                          />
                        </div>

                        {orgSetting?.can_deduct_tds ? (
                          <div className={css.row}>
                            <div className={css.lable}>TDS</div>
                            <input
                              className={css.autoFillDetails}
                              value={billValue > 0 ? calcAmount.tds : 0}
                              placeholder="0"
                            />
                          </div>
                        ) : (
                          <div className={css.row}>
                            <div className={css.lable}> TDS</div>
                            <div
                              className={
                                orgSetting?.can_deduct_tds
                                  ? css.inputHidden
                                  : css.inputFieldWrapper
                              }
                            >
                              <AmountFormatCustom
                                align="right"
                                className={css.inputField}
                                name="tds"
                                value={billValue > 0 ? calcAmount.tds : ''}
                                onChange={(event) => handleAmountChange(event)}
                                id="tds"
                                onFocus={(e) => {
                                  setTimeout(function () {
                                    e.target.selectionStart =
                                      e.target.selectionEnd =
                                        e?.target?.value?.length;
                                  }, 0);
                                }}
                                placeholder="0"
                              />
                            </div>
                          </div>
                        )}

                        <div className={css.row}>
                          <div className={css.lable}>Amount Payable</div>
                          <input
                            className={css.autoFillDetails}
                            // type="number"
                            value={
                              billValue > 0 ? FormattedAmount(amountPayable) : 0
                            }
                          />
                        </div>
                        <div className={css.buttonContainer}>
                          <Button
                            className={css.submitButton}
                            onClick={() => {
                              handleBottomSheet('amount', amountPayable);
                            }}
                          >
                            Save Details
                          </Button>
                        </div>
                      </div>
                    </SelectBottomSheet>
                    {haveBill && (
                      <Input
                        name="invoiceNo"
                        onBlur={reValidate}
                        error={validationErr.invoiceNo}
                        helperText={
                          validationErr.invoiceNo
                            ? VALIDATION?.invoiceNo?.errMsg
                            : ''
                        }
                        className={`${css.greyBorder} ${classes.root}`}
                        label="Bill No"
                        variant="standard"
                        value={localState.invoiceNo}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        onChange={onInputChange}
                        theme="light"
                        required={haveBill}
                      />
                    )}
                    <SelectBottomSheet
                      name="date"
                      onBlur={reValidate}
                      error={validationErr.date}
                      helperText={
                        validationErr.date ? VALIDATION?.date?.errMsg : ''
                      }
                      label="Document Date"
                      open={drawer.date}
                      value={
                        localState.date === ''
                          ? 'dd-mm-yyyy'
                          : moment(localState.date).format('DD-MM-YYYY')
                      }
                      onTrigger={onTriggerDrawer}
                      onClose={handleBottomSheet}
                      required
                      addNewSheet
                      disabled={
                        categorizationvendordetails?.id ||
                        categorizationvendordetails?.name ===
                          'Do Not Track Vendor'
                      }
                    >
                      <Calender
                        head="Choose Date"
                        button="Select"
                        handleDate={(val) => handleDate('date', val)}
                      />
                    </SelectBottomSheet>
                    <SelectBottomSheet
                      name="accountedOn"
                      onBlur={reValidate}
                      error={validationErr.accountedOn}
                      helperText={
                        validationErr.accountedOn
                          ? VALIDATION?.accountedOn?.errMsg
                          : ''
                      }
                      label="Accounting Date"
                      open={drawer.accountedOn}
                      value={
                        localState.date === ''
                          ? 'dd-mm-yyyy'
                          : moment(localState.accountedOn).format('DD-MM-YYYY')
                      }
                      onTrigger={onTriggerDrawer}
                      onClose={handleBottomSheet}
                      required
                      addNewSheet
                      disabled={
                        categorizationvendordetails?.id ||
                        categorizationvendordetails?.name ===
                          'Do Not Track Vendor'
                      }
                    >
                      <Calender
                        head="Choose Date"
                        button="Select"
                        handleDate={(val) => handleDate('accountedOn', val)}
                      />
                    </SelectBottomSheet>
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
                      value={
                        localState.paymentStatus?.id === 'personal'
                          ? `${localState.paymentStatus?.label} - ${localState?.payer_id?.name}`
                          : localState.paymentStatus?.label
                      }
                      onTrigger={onTriggerDrawer}
                      onClose={() =>
                        setDrawer((d) => ({
                          ...d,
                          paymentStatus: false,
                        }))
                      }
                      required
                      addNewSheet
                      disabled={
                        categorizationvendordetails?.id ||
                        categorizationvendordetails?.name ===
                          'Do Not Track Vendor'
                      }
                      classNames="PaymentStatusClass"
                    >
                      {!dntCheckbox
                        ? paymentStatusListWithBill.map((ps) => (
                            <div
                              className={css.categoryOptions}
                              key={ps?.id}
                              role="menuitem"
                            >
                              {ps?.id === 'paid_as_advance' ? (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}
                                  onClick={() => {
                                    handleNextBottomSheet(
                                      'paymentStatus',
                                      'paidAdvance',
                                      ps,
                                    );
                                    // getVendorUnsettled();
                                  }}
                                >
                                  <div>{ps.label}</div>
                                  <div
                                    style={{
                                      height: '18px',
                                      width: '10px',
                                      marginLeft: '13.42px',
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <img
                                      src={rightArrow}
                                      alt="right-arrow"
                                      style={{
                                        height: '100%',
                                        width: '100%',
                                        objectFit: 'contain',
                                      }}
                                    />
                                    {localState?.paymentStatus?.id ===
                                      ps?.id && (
                                      <Done style={{ color: '#f08b32' }} />
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div
                                    onClick={() =>
                                      handleBottomSheet('paymentStatus', ps)
                                    }
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    {ps.label}
                                    {ps?.icon && (
                                      <img
                                        src={rightArrow}
                                        alt="right-arrow"
                                        style={{ margin: '0 10px' }}
                                      />
                                    )}
                                    {localState?.paymentStatus?.id ===
                                      ps?.id && (
                                      <Done style={{ color: '#f08b32' }} />
                                    )}
                                  </div>
                                  {ps?.id === 'company_cash' &&
                                    paidByCompany && (
                                      <>
                                        <List
                                          dense
                                          sx={{
                                            width: 'auto',
                                            bgcolor: 'background.paper',
                                            padding: 0,

                                            margin: '12px 0 0 20px',
                                          }}
                                        >
                                          {bankListingDetails.filter(
                                            (item) =>
                                              item.sub_account_group ===
                                              'Cash Accounts',
                                          )?.length > 0 ? (
                                            <>
                                              {bankListingDetails
                                                .filter(
                                                  (item) =>
                                                    item.sub_account_group ===
                                                    'Cash Accounts',
                                                )
                                                ?.sort((a, b) =>
                                                  a.display_name.localeCompare(
                                                    b.display_name,
                                                  ),
                                                )
                                                ?.map((row) => (
                                                  <ListItem
                                                    sx={{
                                                      padding: 0,
                                                    }}
                                                    className={
                                                      classes.listitemRoot
                                                    }
                                                    key={row.bank_account_id}
                                                    onClick={() => {
                                                      handlePaymentStatus(
                                                        row,
                                                        setSelectedCashAccount,
                                                        ps,
                                                      );
                                                    }}
                                                  >
                                                    <ListItemButton
                                                      sx={{
                                                        padding: '0 0 0 11px',
                                                      }}
                                                      className={
                                                        css.listitembtn
                                                      }
                                                    >
                                                      <FormControlLabel
                                                        value="bank_account"
                                                        sx={{
                                                          marginRight: '4px',
                                                        }}
                                                        control={
                                                          <BpRadio
                                                            name="selectedCashAccount"
                                                            checked={
                                                              selectedCashAccount.bank_account_id ===
                                                              row.bank_account_id
                                                            }
                                                            onChange={() => {
                                                              handlePaymentStatus(
                                                                row,
                                                                setSelectedCashAccount,
                                                                ps,
                                                              );
                                                            }}
                                                          />
                                                        }
                                                      />

                                                      <ListItemAvatar
                                                        sx={{
                                                          minWidth: '40px',
                                                        }}
                                                      >
                                                        <Avatar
                                                          sx={{
                                                            width: '32px',
                                                            height: '32px',
                                                          }}
                                                          alt="Avatar"
                                                          src={CashAccount}
                                                        />
                                                      </ListItemAvatar>
                                                      <ListItemText
                                                        primary={
                                                          row.display_name || ''
                                                        }
                                                        className={
                                                          classes.AccountText
                                                        }
                                                      />
                                                    </ListItemButton>
                                                  </ListItem>
                                                ))}
                                            </>
                                          ) : (
                                            <ListItem>
                                              <ListItemText primary="No bank found." />
                                            </ListItem>
                                          )}
                                        </List>
                                      </>
                                    )}
                                  {ps?.id === 'company_card' &&
                                    paidByCompanyCard && (
                                      <>
                                        <List
                                          dense
                                          sx={{
                                            width: 'auto',
                                            bgcolor: 'background.paper',
                                            padding: 0,

                                            margin: '12px 0 0 20px',
                                          }}
                                        >
                                          {bankListingDetails.filter(
                                            (item) =>
                                              item.bank_account_type ===
                                                'company' &&
                                              item?.account_type ===
                                                'CREDIT CARD',
                                          )?.length > 0 ? (
                                            <>
                                              {bankListingDetails
                                                .filter(
                                                  (item) =>
                                                    item.bank_account_type ===
                                                      'company' &&
                                                    item?.account_type ===
                                                      'CREDIT CARD',
                                                )
                                                ?.sort((a, b) =>
                                                  a.display_name.localeCompare(
                                                    b.display_name,
                                                  ),
                                                )
                                                ?.map((row) => (
                                                  <ListItem
                                                    sx={{
                                                      padding: 0,
                                                    }}
                                                    className={
                                                      classes.listitemRoot
                                                    }
                                                    key={row.bank_account_id}
                                                    onClick={() => {
                                                      handlePaymentStatus(
                                                        row,
                                                        setSelectedCCCard,
                                                        ps,
                                                      );
                                                    }}
                                                  >
                                                    <ListItemButton
                                                      sx={{
                                                        padding: '0 0 0 11px',
                                                      }}
                                                      className={
                                                        css.listitembtn
                                                      }
                                                    >
                                                      <FormControlLabel
                                                        value="bank_account"
                                                        sx={{
                                                          marginRight: '4px',
                                                        }}
                                                        control={
                                                          <BpRadio
                                                            name="selectedCashAccount"
                                                            checked={
                                                              selectedCCCard.bank_account_id ===
                                                              row.bank_account_id
                                                            }
                                                            onChange={() => {
                                                              handlePaymentStatus(
                                                                row,
                                                                setSelectedCCCard,
                                                                ps,
                                                              );
                                                            }}
                                                          />
                                                        }
                                                      />

                                                      <ListItemAvatar
                                                        sx={{
                                                          minWidth: '40px',
                                                        }}
                                                      >
                                                        <Avatar
                                                          sx={{
                                                            width: '32px',
                                                            height: '32px',
                                                          }}
                                                          alt="Avatar"
                                                          src={CashAccount}
                                                        />
                                                      </ListItemAvatar>
                                                      <ListItemText
                                                        primary={
                                                          row.display_name || ''
                                                        }
                                                        className={
                                                          classes.AccountText
                                                        }
                                                      />
                                                    </ListItemButton>
                                                  </ListItem>
                                                ))}
                                            </>
                                          ) : (
                                            <ListItem>
                                              <ListItemText primary="No bank found." />
                                            </ListItem>
                                          )}
                                        </List>
                                      </>
                                    )}
                                  {ps?.id === 'company_account' &&
                                    paidByCompanyAccount && (
                                      <>
                                        <List
                                          dense
                                          sx={{
                                            width: 'auto',
                                            bgcolor: 'background.paper',
                                            padding: 0,

                                            margin: '12px 0 0 20px',
                                          }}
                                        >
                                          {bankListingDetails.filter(
                                            (item) =>
                                              item.bank_account_type ===
                                                'company' &&
                                              (item?.account_type ===
                                                'CURRENT' ||
                                                item?.account_type ===
                                                  'SAVINGS') &&
                                              item?.service_provider !==
                                                'paysharp' &&
                                              item?.service_provider !==
                                                'fidypay',
                                          )?.length > 0 ? (
                                            <>
                                              {bankListingDetails
                                                .filter(
                                                  (item) =>
                                                    item.bank_account_type ===
                                                      'company' &&
                                                    (item?.account_type ===
                                                      'CURRENT' ||
                                                      item?.account_type ===
                                                        'SAVINGS') &&
                                                    item?.service_provider !==
                                                      'paysharp' &&
                                                    item?.service_provider !==
                                                      'fidypay',
                                                )
                                                ?.sort((a, b) =>
                                                  a.display_name.localeCompare(
                                                    b.display_name,
                                                  ),
                                                )
                                                ?.map((row) => (
                                                  <ListItem
                                                    sx={{
                                                      padding: 0,
                                                    }}
                                                    className={
                                                      classes.listitemRoot
                                                    }
                                                    key={row.bank_account_id}
                                                    onClick={() => {
                                                      handlePaymentStatus(
                                                        row,
                                                        setSelectedCompanyAccount,
                                                        ps,
                                                      );
                                                    }}
                                                  >
                                                    <ListItemButton
                                                      sx={{
                                                        padding: '0 0 0 11px',
                                                      }}
                                                      className={
                                                        css.listitembtn
                                                      }
                                                    >
                                                      <FormControlLabel
                                                        value="bank_account"
                                                        sx={{
                                                          marginRight: '4px',
                                                        }}
                                                        control={
                                                          <BpRadio
                                                            name="selectedaCCAccount"
                                                            checked={
                                                              selectedCompanyAccount.bank_account_id ===
                                                              row.bank_account_id
                                                            }
                                                            onChange={() => {
                                                              handlePaymentStatus(
                                                                row,
                                                                setSelectedCompanyAccount,
                                                                ps,
                                                              );
                                                            }}
                                                          />
                                                        }
                                                      />

                                                      <ListItemAvatar
                                                        sx={{
                                                          minWidth: '40px',
                                                        }}
                                                      >
                                                        <Avatar
                                                          sx={{
                                                            width: '32px',
                                                            height: '32px',
                                                          }}
                                                          alt="Avatar"
                                                          src={CashAccount}
                                                        />
                                                      </ListItemAvatar>
                                                      <ListItemText
                                                        primary={
                                                          row.display_name || ''
                                                        }
                                                        className={
                                                          classes.AccountText
                                                        }
                                                      />
                                                    </ListItemButton>
                                                  </ListItem>
                                                ))}
                                            </>
                                          ) : (
                                            <ListItem>
                                              <ListItemText primary="No Account found." />
                                            </ListItem>
                                          )}
                                        </List>
                                      </>
                                    )}
                                </>
                              )}
                            </div>
                          ))
                        : paymentStatusListWithoutBill.map((ps) => (
                            <div
                              className={css.categoryOptions}
                              key={ps?.id}
                              role="menuitem"
                            >
                              <div
                                onClick={() =>
                                  handleBottomSheet('paymentStatus', ps)
                                }
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                {ps?.label}
                                {localState?.paymentStatus?.id === ps?.id && (
                                  <Done style={{ color: '#f08b32' }} />
                                )}
                              </div>
                              {ps?.id === 'company_cash' && paidByCompany && (
                                <>
                                  <List
                                    dense
                                    sx={{
                                      width: 'auto',
                                      bgcolor: 'background.paper',
                                      padding: 0,

                                      margin: '12px 0 0 20px',
                                    }}
                                  >
                                    {bankListingDetails.filter(
                                      (item) =>
                                        item.sub_account_group ===
                                        'Cash Accounts',
                                    )?.length > 0 ? (
                                      <>
                                        {bankListingDetails
                                          .filter(
                                            (item) =>
                                              item.sub_account_group ===
                                              'Cash Accounts',
                                          )
                                          ?.sort((a, b) =>
                                            a.display_name.localeCompare(
                                              b.display_name,
                                            ),
                                          )
                                          ?.map((row) => (
                                            <ListItem
                                              sx={{
                                                padding: 0,
                                              }}
                                              className={classes.listitemRoot}
                                              key={row.bank_account_id}
                                              onClick={() => {
                                                handlePaymentStatus(
                                                  row,
                                                  setSelectedCashAccount,
                                                  ps,
                                                );
                                              }}
                                            >
                                              <ListItemButton
                                                sx={{
                                                  padding: '0 0 0 11px',
                                                }}
                                                className={css.listitembtn}
                                              >
                                                <FormControlLabel
                                                  value="bank_account"
                                                  sx={{
                                                    marginRight: '4px',
                                                  }}
                                                  control={
                                                    <BpRadio
                                                      name="selectedCashAccount"
                                                      checked={
                                                        selectedCashAccount.bank_account_id ===
                                                        row.bank_account_id
                                                      }
                                                      onChange={() => {
                                                        handlePaymentStatus(
                                                          row,
                                                          setSelectedCashAccount,
                                                          ps,
                                                        );
                                                      }}
                                                    />
                                                  }
                                                />

                                                <ListItemAvatar
                                                  sx={{
                                                    minWidth: '40px',
                                                  }}
                                                >
                                                  <Avatar
                                                    sx={{
                                                      width: '32px',
                                                      height: '32px',
                                                    }}
                                                    alt="Avatar"
                                                    src={CashAccount}
                                                  />
                                                </ListItemAvatar>
                                                <ListItemText
                                                  primary={
                                                    row.display_name || ''
                                                  }
                                                  className={
                                                    classes.AccountText
                                                  }
                                                />
                                              </ListItemButton>
                                            </ListItem>
                                          ))}
                                      </>
                                    ) : (
                                      <ListItem>
                                        <ListItemText primary="No cash account found." />
                                      </ListItem>
                                    )}
                                  </List>
                                </>
                              )}
                              {ps?.id === 'company_card' &&
                                paidByCompanyCard && (
                                  <>
                                    <List
                                      dense
                                      sx={{
                                        width: 'auto',
                                        bgcolor: 'background.paper',
                                        padding: 0,

                                        margin: '12px 0 0 20px',
                                      }}
                                    >
                                      {bankListingDetails.filter(
                                        (item) =>
                                          item.bank_account_type ===
                                            'company' &&
                                          item?.account_type === 'CREDIT CARD',
                                      )?.length > 0 ? (
                                        <>
                                          {bankListingDetails
                                            .filter(
                                              (item) =>
                                                item.bank_account_type ===
                                                  'company' &&
                                                item?.account_type ===
                                                  'CREDIT CARD',
                                            )
                                            ?.sort((a, b) =>
                                              a.display_name.localeCompare(
                                                b.display_name,
                                              ),
                                            )
                                            ?.map((row) => (
                                              <ListItem
                                                sx={{
                                                  padding: 0,
                                                }}
                                                className={classes.listitemRoot}
                                                key={row.bank_account_id}
                                                onClick={() => {
                                                  handlePaymentStatus(
                                                    row,
                                                    setSelectedCCCard,
                                                    ps,
                                                  );
                                                }}
                                              >
                                                <ListItemButton
                                                  sx={{
                                                    padding: '0 0 0 11px',
                                                  }}
                                                  className={css.listitembtn}
                                                >
                                                  <FormControlLabel
                                                    value="bank_account"
                                                    sx={{
                                                      marginRight: '4px',
                                                    }}
                                                    control={
                                                      <BpRadio
                                                        name="selectedCashAccount"
                                                        checked={
                                                          selectedCCCard.bank_account_id ===
                                                          row.bank_account_id
                                                        }
                                                        onChange={() => {
                                                          handlePaymentStatus(
                                                            row,
                                                            setSelectedCCCard,
                                                            ps,
                                                          );
                                                        }}
                                                      />
                                                    }
                                                  />

                                                  <ListItemAvatar
                                                    sx={{
                                                      minWidth: '40px',
                                                    }}
                                                  >
                                                    <Avatar
                                                      sx={{
                                                        width: '32px',
                                                        height: '32px',
                                                      }}
                                                      alt="Avatar"
                                                      src={CashAccount}
                                                    />
                                                  </ListItemAvatar>
                                                  <ListItemText
                                                    primary={
                                                      row.display_name || ''
                                                    }
                                                    className={
                                                      classes.AccountText
                                                    }
                                                  />
                                                </ListItemButton>
                                              </ListItem>
                                            ))}
                                        </>
                                      ) : (
                                        <ListItem>
                                          <ListItemText primary="No Credit Card found." />
                                        </ListItem>
                                      )}
                                    </List>
                                  </>
                                )}
                              {ps?.id === 'company_account' &&
                                paidByCompanyAccount && (
                                  <>
                                    <List
                                      dense
                                      sx={{
                                        width: 'auto',
                                        bgcolor: 'background.paper',
                                        padding: 0,

                                        margin: '12px 0 0 20px',
                                      }}
                                    >
                                      {bankListingDetails.filter(
                                        (item) =>
                                          item.bank_account_type ===
                                            'company' &&
                                          (item?.account_type === 'CURRENT' ||
                                            item?.account_type === 'SAVINGS') &&
                                          item?.service_provider !==
                                            'paysharp' &&
                                          item?.service_provider !== 'fidypay',
                                      )?.length > 0 ? (
                                        <>
                                          {bankListingDetails
                                            .filter(
                                              (item) =>
                                                item.bank_account_type ===
                                                  'company' &&
                                                (item?.account_type ===
                                                  'CURRENT' ||
                                                  item?.account_type ===
                                                    'SAVINGS') &&
                                                item?.service_provider !==
                                                  'paysharp' &&
                                                item?.service_provider !==
                                                  'fidypay',
                                            )
                                            ?.sort((a, b) =>
                                              a.display_name.localeCompare(
                                                b.display_name,
                                              ),
                                            )
                                            ?.map((row) => (
                                              <ListItem
                                                sx={{
                                                  padding: 0,
                                                }}
                                                className={classes.listitemRoot}
                                                key={row.bank_account_id}
                                                onClick={() => {
                                                  handlePaymentStatus(
                                                    row,
                                                    setSelectedCompanyAccount,
                                                    ps,
                                                  );
                                                }}
                                              >
                                                <ListItemButton
                                                  sx={{
                                                    padding: '0 0 0 11px',
                                                  }}
                                                  className={css.listitembtn}
                                                >
                                                  <FormControlLabel
                                                    value="bank_account"
                                                    sx={{
                                                      marginRight: '4px',
                                                    }}
                                                    control={
                                                      <BpRadio
                                                        name="selectedaCCAccount"
                                                        checked={
                                                          selectedCompanyAccount.bank_account_id ===
                                                          row.bank_account_id
                                                        }
                                                        onChange={() => {
                                                          handlePaymentStatus(
                                                            row,
                                                            setSelectedCompanyAccount,
                                                            ps,
                                                          );
                                                        }}
                                                      />
                                                    }
                                                  />

                                                  <ListItemAvatar
                                                    sx={{
                                                      minWidth: '40px',
                                                    }}
                                                  >
                                                    <Avatar
                                                      sx={{
                                                        width: '32px',
                                                        height: '32px',
                                                      }}
                                                      alt="Avatar"
                                                      src={CashAccount}
                                                    />
                                                  </ListItemAvatar>
                                                  <ListItemText
                                                    primary={
                                                      row.display_name || ''
                                                    }
                                                    className={
                                                      classes.AccountText
                                                    }
                                                  />
                                                </ListItemButton>
                                              </ListItem>
                                            ))}
                                        </>
                                      ) : (
                                        <ListItem>
                                          <ListItemText primary="No Account found." />
                                        </ListItem>
                                      )}
                                    </List>
                                  </>
                                )}
                            </div>
                          ))}
                    </SelectBottomSheet>

                    {localState?.paymentStatus?.id === 'to_pay' && (
                      <PaymentTerms
                        fromBill={true}
                        callFunction={(val) =>
                          handleBottomSheet('creditPeriod', val?.credit_period)
                        }
                        selectCustomer={{
                          credit_period: localState?.creditPeriod || '',
                        }}
                      />
                    )}

                    <Input
                      name="description"
                      onBlur={reValidate}
                      error={validationErr.description}
                      helperText={
                        validationErr.description
                          ? VALIDATION?.description?.errMsg
                          : ''
                      }
                      label="Note"
                      placeholder="what's this for"
                      variant="standard"
                      className={`${css.greyBorder} ${classes.root}`}
                      value={localState.description}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      onChange={(event) => onInputChange(event)}
                      theme="light"
                      multiline
                      rows={4}
                    />
                  </div>
                  {(selectedTransactionUploadBill?.categorized &&
                    status === 'Edit' && (
                      <div
                        className={css.actionContainerexternalmobilewithedit}
                      >
                        <div className={css.buttonwithcategorizedeachdiv}>
                          <Button
                            variant="contained"
                            className={`${css.buttonwithcategorized}`}
                            // onClick={() => {}}
                            size="medium"
                          >
                            Categorized
                          </Button>
                        </div>
                        <div className={css.buttonwithcategorizedeachdiv}>
                          <Button
                            variant="contained"
                            style={{
                              textTransform: 'initial',
                              backgroundColor: '#fff',
                              color: '#f08b32',
                              border: '1px solid #f08b32',
                              borderRadius: '18px',
                            }}
                            className={`${css.outlineButton}`}
                            onClick={() => {
                              setTransactionStatus('Add');
                            }}
                          >
                            Edit Categorized
                          </Button>
                        </div>
                      </div>
                    )) || (
                    <div
                      className={
                        (billUploadFrom === 'bankCategorization' &&
                          `${css.actionContainerexternalmobilewithoutedit}`) ||
                        css.actionContainer
                      }
                    >
                      <SelectBottomSheet
                        name="preview"
                        triggerComponent={
                          <Button
                            variant="contained"
                            className={`${css.submitButton}`}
                            onClick={() => {
                              onRecordBill();
                            }}
                            size="medium"
                          >
                            {billUploadFrom === 'bankCategorization'
                              ? 'Categorize Now'
                              : 'Record Bills'}
                          </Button>
                        }
                        open={drawer.preview}
                        onClose={handleBottomSheet}
                      >
                        <PreviewContent
                          title={localState.name}
                          data={preparePreviewData()}
                          onProceed={saveBills}
                        />
                      </SelectBottomSheet>

                      {haveBill && (
                        <Button
                          variant="contained"
                          style={{
                            // padding: '15px 35px',
                            textTransform: 'initial',
                            backgroundColor: '#fff',
                            color: '#f08b32',
                            border: '1px solid #f08b32',
                            borderRadius: '18px',
                          }}
                          className={`${css.outlineButton}`}
                          onClick={() => {
                            setNewLoader((prev) => ({
                              ...prev,
                              superAccount: true,
                            }));
                          }}
                        >
                          Assign to SuperAccountant
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
              {/* <NameDialog
        open={nameDialog}
        onCancel={onCancelDialog}
        onSave={onSaveDialog}
      /> */}
              {view === VIEW.VENDOR && (
                <AddNewVendor onCloseVendor={onCloseVendor} />
              )}
              {view === VIEW.EDIT && (
                <InvoiceCustomer
                  showValue={editValue}
                  handleBottomSheet={() => setView(VIEW.MAIN)}
                  type="vendors"
                  openFrom="billBooking"
                />
              )}
              {view === VIEW.DONE && (
                <SuccessView
                  title="Done"
                  description={
                    response.assigned_to_super_accountant &&
                    response.status === 'draft'
                      ? `The SuperAccountant is reviewing your new expense category, ${response?.expense_account?.name}. It’s currently in ‘Assinged Bills’ and will shift to Accounted Bills’ once approved.`
                      : `${response?.expense_account?.name} ${
                          response?.status
                        } ${
                          response?.vendor?.name
                            ? `to ${response?.vendor?.name}`
                            : ''
                        } for Rs. ${response?.amount} has been recorded`
                  }
                  onClick={onAddAnotherBill}
                  typePage={state?.emailBillBox ? 'emailBill' : false}
                />
              )}

              {view === VIEW.SUPER && (
                <SuperAccUpload
                  typeOfImage={typeImage}
                  // haveBillSuper={haveBill}
                  uploadPDF={pdfUrl}
                  uploadFlieName={filename}
                  uploadId={localState?.file || ''}
                  successView={(val) => setView(val)}
                  setSuperEditValue={setEditValue}
                  vendorSuper={
                    () => {
                      if (categorizationvendordetails?.id) {
                        return categorizationvendordetails;
                      } else {
                        return localState?.vendor;
                      }
                    }
                    // localState?.vendor?.id ? localState?.vendor : false
                  }
                  paymentStatusSuper={
                    localState?.paymentStatus
                      ? localState?.paymentStatus
                      : false
                  }
                  payerDetails={
                    localState?.payer_id?.id ? localState?.payer_id : ''
                  }
                  categorySuper={
                    localState?.expenseCategory
                      ? localState?.expenseCategory
                      : false
                  }
                  doNotTrackCheck={dntCheckbox}
                  categorizationvendordetails={categorizationvendordetails}
                  selectedTransaction={selectedTransaction}
                  isVendorPresent={isVendorAvailable}
                  venFetchDetails={fetchDetails}
                  billUploadFrom={billUploadFrom}
                  ExpenseDone={ExpenseDone}
                  bankAccountDetails={bankAccountDetails}
                  billId={billId}
                  bankTxnId={localState?.bank_txn_id || undefined}
                  multipleBills={multipleBills}
                  multipleBillsSubmitFun={multipleBillsSubmitFun}
                />
              )}

              <StyledDrawer
                anchor="bottom"
                variant="temporary"
                open={drawer.paidAdvance}
                onClose={() => {
                  handleBottomSheet('paidAdvance', 'test');
                }}
              >
                <div className={css.advancePaid}>
                  <div className={css.handle} />
                  <div className={css.header}>
                    <div className={css.valueHeader}>
                      Select Advances to Adjust
                    </div>
                    <div className={css.headerUnderline} />
                  </div>
                  <div className={css.childContainer}>
                    {vendorsUnsettledList && vendorsUnsettledList.length > 0
                      ? vendorsUnsettledList.map((item, index) => {
                          return (
                            <div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Checkbox
                                  onClick={() => hangleChecked(item?.id)}
                                  checked={advancesData?.includes(item?.id)}
                                  inputProps={{ 'aria-label': 'controlled' }}
                                  value={item}
                                />
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      color: '#283049',
                                      fontSize: '16px',
                                      lineHeight: '20px',
                                      marginBottom: '7px',
                                    }}
                                  >
                                    {item.document_number}
                                  </div>
                                  <div
                                    style={{
                                      color: '#283049',
                                      fontSize: '14px',
                                      lineHeight: '17.5px',
                                    }}
                                  >
                                    {`paid on ${moment(item.date).format(
                                      'DD MMM YYYY',
                                    )}`}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    color: '#283049',
                                    fontSize: '16px',
                                    lineHeight: '20px',
                                  }}
                                >
                                  {FormattedAmount(item?.net_balance)}
                                </div>
                              </div>
                              {index + 1 !== vendorsUnsettledList.length && (
                                <div
                                  style={{
                                    height: '1px',
                                    backgroundColor: '#999999',
                                    marginTop: '9px',
                                    marginBottom: '9px',
                                  }}
                                />
                              )}
                            </div>
                          );
                        })
                      : 'No Advance bill'}
                  </div>
                  <div
                    onClick={() => handleBottomSheet('paidAdvance')}
                    style={{
                      backgroundColor: '#00A676',
                      padding: '13px',
                      borderRadius: '10px',
                      marginLeft: '10px',
                      marginRight: '10px',
                      marginBottom: '30px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        lineHeight: '17.5px',
                        color: '#FFFFFF',
                        textAlign: 'center',
                      }}
                    >
                      Confirm Adjustment
                    </div>
                  </div>
                </div>
              </StyledDrawer>
            </div>
          </>
        )}
        <ReceivablesPopOver
          open={editConfirm.open}
          handleClose={() =>
            setEditConfirm((prev) => ({ ...prev, open: false, once: true }))
          }
          position="center"
        >
          <div className={css.effortlessOptionsPop}>
            <h3>Heads Up!</h3>
            <p>Are you sure you want to Change The Vendor</p>

            {/* </ul> */}
            <div
              className={css.addCustomerFooter}
              style={{ marginBottom: '10px' }}
            >
              <Button
                disableElevation
                disableFocusRipple
                disableTouchRipple
                variant="contained"
                className={css.secondary}
                style={{
                  // padding: '15px 35px',
                  textTransform: 'initial',
                  backgroundColor: '#fff',
                }}
                onClick={() =>
                  setEditConfirm((prev) => ({
                    ...prev,
                    open: false,
                    once: true,
                  }))
                }
              >
                Cancel
              </Button>
              <Button
                disableElevation
                disableFocusRipple
                disableTouchRipple
                variant="contained"
                className={`${css.primary}`}
                style={{
                  // padding: '15px 35px',
                  textTransform: 'initial',
                  width: 'auto',
                  backgroundColor: '#f08b32',
                }}
                onClick={() => {
                  handleBottomSheet(
                    editConfirm.name,
                    editConfirm.data,
                    'fromState',
                  );
                  setEditConfirm({
                    open: false,
                    name: '',
                    data: '',
                    once: false,
                  });
                }}
              >
                &nbsp; Confirm &nbsp;
              </Button>
            </div>
          </div>
        </ReceivablesPopOver>

        <SelectBottomSheet
          open={newLoader.superAccount && deviceOut === 'mobile'}
          triggerComponent={<></>}
          onClose={() => {
            if (newLoader?.fileId === '') {
              setNewLoader((prev) => ({ ...prev, superAccount: false }));
            } else if (newLoader?.fileId) {
              setNewLoader((prev) => ({
                ...prev,
                superAccount: false,
                continueFlow: true,
              }));
            }
          }}
          addNewSheet
        >
          <SuperAccountantFirst
            setNewLoader={setNewLoader}
            newLoader={newLoader}
            setView={setView}
            categorizationvendordetails={categorizationvendordetails}
            setLocalState={setLocalState}
            selectedTransactionUploadBill={selectedTransactionUploadBill}
          />
        </SelectBottomSheet>

        <Dialog
          open={newLoader.superAccount && deviceOut === 'desktop'}
          onClose={() => {
            if (newLoader?.fileId === '') {
              setNewLoader((prev) => ({ ...prev, superAccount: false }));
            } else if (newLoader?.fileId) {
              setNewLoader((prev) => ({
                ...prev,
                superAccount: false,
                continueFlow: true,
              }));
            }
          }}
        >
          <SuperAccountantFirst
            setNewLoader={setNewLoader}
            newLoader={newLoader}
            categorizationvendordetails={categorizationvendordetails}
            setLocalState={setLocalState}
            selectedTransactionUploadBill={selectedTransactionUploadBill}
          />
        </Dialog>

        <Dialog
          open={newLoader.superAccountSec && deviceOut === 'desktop'}
          onClose={() => {
            if (donePage) {
              setNewLoader((prev) => ({
                ...prev,
                loader: false,
                superAccountSec: false,
                // continueFlow: true,
              }));
              onAddAnotherBill();
            } else if (!donePage) {
              if (newLoader?.fileId === '') {
                setNewLoader((prev) => ({ ...prev, superAccountSec: false }));
              } else if (newLoader?.fileId) {
                setNewLoader((prev) => ({
                  ...prev,
                  superAccountSec: false,
                  continueFlow: true,
                }));
              }
            }
          }}
        >
          <div>
            <SuperAccUpload
              typeOfImage={typeImage}
              uploadPDF={pdfUrl}
              // haveBillSuper={haveBill}
              uploadFlieName={filename}
              uploadId={localState?.file || ''}
              handleBottomSheetForSuper={() => {
                if (newLoader?.fileId === '') {
                  setNewLoader((prev) => ({ ...prev, superAccountSec: false }));
                } else if (newLoader?.fileId) {
                  setNewLoader((prev) => ({
                    ...prev,
                    superAccountSec: false,
                    continueFlow: true,
                  }));
                }
              }}
              handleBottomSheetForSuperDone={async () => {
                setNewLoader((prev) => ({
                  ...prev,
                  loader: false,
                  superAccountSec: false,
                  // continueFlow: true,
                }));
                await onAddAnotherBill();
              }}
              // onAddAnotherBill={onAddAnotherBill}
              vendorSuper={() => {
                if (categorizationvendordetails?.id) {
                  return categorizationvendordetails;
                } else {
                  return localState?.vendor;
                }
              }}
              paymentStatusSuper={
                localState?.paymentStatus ? localState?.paymentStatus : false
              }
              payerDetails={
                localState?.payer_id?.id ? localState?.payer_id : ''
              }
              categorySuper={
                localState?.expenseCategory
                  ? localState?.expenseCategory
                  : false
              }
              setDonePageBill={setDonePage}
              doNotTrackCheck={dntCheckbox}
              categorizationvendordetails={categorizationvendordetails}
              selectedTransaction={selectedTransaction}
              isVendorPresent={isVendorAvailable}
              venFetchDetails={fetchDetails}
              billUploadFrom={billUploadFrom}
              ExpenseDone={ExpenseDone}
              bankAccountDetails={bankAccountDetails}
              billId={billId}
              bankTxnId={localState?.bank_txn_id || undefined}
              multipleBills={multipleBills}
              multipleBillsSubmitFun={multipleBillsSubmitFun}
            />
          </div>
        </Dialog>
      </div>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
      <SelectBottomSheet
        open={Employee?.open}
        onClose={() => setEmployee((prev) => ({ ...prev, open: false }))}
        triggerComponent={<></>}
        addNewSheet
      >
        <EmployeeList
          handleClick={(val) => {
            handleBottomSheet('payer_id', {
              payment_mode: { id: 'personal', label: 'Paid By' },
              payer_id: val,
            });
          }}
        />
      </SelectBottomSheet>
      {multipleBillDoneDialog?.open && (
        <MultipleBillSuccessDialog
          setState={setMultipleBillDoneDialog}
          multipleBills={{
            data: multipleBills,
            state: state?.multipleBills,
            previousId: multipleBillDoneDialog?.prevSelectedId,
            previousState: multipleBillDoneDialog?.previousState,
          }}
        />
      )}
    </>
  );
};

export default UploadYourBillContainer;

const SuperAccountantFirst = ({
  newLoader,
  setNewLoader,
  setView,
  categorizationvendordetails,
  setLocalState,
  selectedTransactionUploadBill,
}) => {
  const device = localStorage.getItem('device_detect');

  return (
    <div className={css.effortlessOptionsPop}>
      <div
        style={{ padding: '5px 0', margin: '1rem 0' }}
        className={css.headerContainer}
      >
        <p className={`${css.headerLabel} ${css.headerLabelForClose}`}>
          Your SuperAccountant is there for you{' '}
          {device === 'desktop' && (
            <span
              className={css.closeDialog}
              onClick={() => {
                if (newLoader?.fileId === '') {
                  setNewLoader((prev) => ({ ...prev, superAccount: false }));
                } else if (newLoader?.fileId) {
                  setNewLoader((prev) => ({
                    ...prev,
                    superAccount: false,
                    continueFlow: true,
                  }));
                }
              }}
            >
              X
            </span>
          )}
        </p>
        <span className={css.headerUnderline} />
        <p className={css.headerSubLabel}>
          Would you like to assign recording this expense to your
          SuperAccountant?
        </p>
      </div>

      {/* </ul> */}
      <div className={css.addCustomerFooter} style={{ marginBottom: '10px' }}>
        <Button
          disableElevation
          disableFocusRipple
          disableTouchRipple
          variant="contained"
          className={css.secondary}
          style={{
            // padding: '15px 35px',
            textTransform: 'initial',
            backgroundColor: '#fff',
          }}
          onClick={() => {
            if (newLoader?.fileId === '') {
              setNewLoader((prev) => ({ ...prev, superAccount: false }));
            } else if (newLoader?.fileId) {
              setNewLoader((prev) => ({
                ...prev,
                superAccount: false,
                continueFlow: true,
              }));
            }
          }}
        >
          No
        </Button>
        <Button
          disableElevation
          disableFocusRipple
          disableTouchRipple
          variant="contained"
          className={`${css.primary}`}
          style={{
            // padding: '15px 35px',
            textTransform: 'initial',
            backgroundColor: '#f08b32',
          }}
          onClick={() => {
            setNewLoader((prev) => ({
              ...prev,
              superAccount: false,
              superAccountSec: true,
              continueFlow: false,
            }));
            if (device === 'mobile') setView(VIEW.SUPER);
            if (categorizationvendordetails?.id) {
              setLocalState((s) => ({
                ...s,
                vendor: categorizationvendordetails,
              }));
              setLocalState((s) => ({
                ...s,
                paymentStatus: { id: 'company_account', label: 'Paid' },
                date: selectedTransactionUploadBill?.date,
              }));
            } else if (
              categorizationvendordetails?.id === '' &&
              categorizationvendordetails?.name === 'Do Not Track Vendor'
            ) {
              // setDntCheckbox(true);
              setLocalState((s) => ({ ...s, vendor: 'Do not track' }));
              setLocalState((s) => ({
                ...s,
                paymentStatus: { id: 'company_account', label: 'Paid' },
                date: selectedTransactionUploadBill?.date,
              }));
            }
          }}
        >
          &nbsp; Yes &nbsp;
        </Button>
      </div>
    </div>
  );
};
