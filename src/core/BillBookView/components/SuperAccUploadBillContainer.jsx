/* eslint-disable no-nested-ternary */

import React,{useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  GetVendorEntityState,
  ClearSateVendorEntity,
} from '@action/Store/Reducers/General/GeneralState';
import {
  getExpenseCategory as getExpenseCategoryRedux,
  getAssetCategory as getAssetCategoryRedux,
  getVendorUnsettled as getVendorUnsettledRedux,

  clearRecordExpenseState
} from '@action/Store/Reducers/Bills/BillBookingState';


import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import axiosInst, { BASE_URL } from '@action/ApiConfig/AxiosInst';

import * as Mui from '@mui/material';
import {
  Radio,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import * as MuiIcon from '@mui/icons-material';
import { makeStyles,styled } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import AppContext from '@root/AppContext.jsx';
import JSBridge from '@nativeBridge/jsbridge';
import { getBankList } from '@action/Store/Reducers/Banking/BankingState';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { DirectUpload } from '@rails/activestorage';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import * as Router from 'react-router-dom';
// import alert from '@assets/warning.svg';
import VendorList from '@components/Vendor/VendorList';
import moment from 'moment';
import rightArrow from '@assets/chevron-right.svg';
import CashAccount from '@assets/BankLogo/cashaccount.svg';
import { InvoiceCustomer } from '@components/Invoice/EditForm.jsx';
import { validateRequired } from '@services/Validation.jsx';
import CustomSearch from '@components/SearchSheet/CustomSearch.jsx';
import { EmployeeList } from './EmployeeList';
import SuccessView from '../shared/SuccessView';
import ExpenseCategoryList from '../shared/ExpenseCategoryList';
import PreviewContent from '../shared/PreviewContent';
import * as css from '../UploadYourBillContainer.scss';

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


function useStateCallback(initialState) {
  const [state, setState] = React.useState(initialState);
  const cbRef = React.useRef(null); // init mutable ref container for callbacks

  const setStateCallback = React.useCallback((stateParameter, cb) => {
    cbRef.current = cb; // store current, passed callback in ref
    setState(stateParameter);
  }, []); // keep object reference stable, exactly like `useState`

  React.useEffect(() => {
    // cb.current is `null` on initial render,
    // so we only invoke callback on state *updates*
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null; // reset callback after execution
    }
  }, [state]);

  return [state, setStateCallback];
}

const initialState = {
  name: '',

  expenseCategory: '',

  paymentStatus: '',
  vendor: '',
  doNotTrack: false,
  payer_id: {},
  payer_account_id:''
};

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

const SuperAccUpload = ({
  typeOfImage,
  uploadPDF,
  uploadFlieName,
  uploadId,
  handleBottomSheetForSuper,
  handleBottomSheetForSuperDone,
  successView,
  setSuperEditValue,
  vendorSuper,
  paymentStatusSuper,
  categorySuper,
  // haveBillSuper,
  setDonePageBill,
  doNotTrackCheck,
  categorizationvendordetails,
  selectedTransaction,
  isVendorPresent,
  venFetchDetails,
  payerDetails,
  billUploadFrom,
  ExpenseDone,
  bankAccountDetails,
  billId,
  bankTxnId,
  multipleBills,
  multipleBillsSubmitFun,
}) => {
  const {
    organization,
    // enableLoading,
    // user,
    // openSnackBar,
    userPermissions,
    // registerEventListeners,
    // deRegisterEventListener,
  } = React.useContext(AppContext);
  const classes = useStyles();
  const navigate = Router.useNavigate();

  const dispatch = useDispatch();
  const { vendorEntity } = useSelector((value) => value.General);
  const { bankListingDetails } = useSelector((val) => val.Banking);
  const { ExpenseCategory, AssetCategory, VendorUnsettledList } = useSelector((val) => val.BillBooking);

  const device = localStorage.getItem('device_detect');
  const [filename, setFilename] = React.useState('');
  const [typeImage, setTypeImage] = React.useState();
  const [localState, setLocalState] = useStateCallback(initialState);
  const [selectedCashAccount, setSelectedCashAccount] = useState({});
  const [selectedCCCard, setSelectedCCCard] = useState({});
  const [selectedCompanyAccount, setSelectedCompanyAccount] = useState({});
  // const [haveBill, setHaveBill] = React.useState(haveBillSuper);
  // const [selected, setSelected] = React.useState(!haveBillSuper);
  // const [unselect, setUnselect] = React.useState(!haveBillSuper);
  const [trigger, setTrigger] = React.useState('list');
  const [pdfUrl, setPdfUrl] = React.useState();
  const [drawer, setDrawer] = React.useState({
    expenseCategory: false,
    paymentStatus: false,
    vendor: false,
    edit: false,
  });
  const [Employee, setEmployee] = React.useState({ open: false });
  const [isVendorAvailable, setIsVendorAvailable] =
    React.useState(isVendorPresent);
  const initialValidationErr = '';
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);
  const [dntCheckbox, setDntCheckbox] = React.useState(doNotTrackCheck);
  const [vendorList, setVendorList] = React.useState([]);
  const [expenseCategoryList, setExpenseCategoryList] = React.useState([]);
  const [assetCategoryList, setAssetCategoryList] = React.useState([]);
  // const [fetchDetails, setFetchDetails] = React.useState();
  const [editValue, setEditValue] = React.useState({});
  const [vendorsUnsettledList, setVendorsUnsettledList] = React.useState([]);
  const [advancesData, setAdvancesData] = React.useState([]);
  const [donePage, setDonePage] = React.useState(false);
  const [paidByCompany, setPaidByCompany] = useState(false);
  const [paidByCompanyCard, setPaidByCompanyCard] = useState(false);
  const [paidByCompanyAccount, setPaidByCompanyAccount] = useState(false);

  const [userRoles, setUserRoles] = React.useState({});
  const [userRolesPeople, setUserRolesPeople] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

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
      if (!userRoles?.['Bill Booking']?.create_bills) {
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

  const VALIDATION = {
    expenseCategory: {
      errMsg: 'Choose category',
      test: (v) => validateRequired(v?.name),
    },
    paymentStatus: {
      errMsg: 'Please choose Payment Status',
      test: (v) => validateRequired(v?.label),
    },
    vendor: {
      errMsg: 'Please choose Vendor',
      test: (v) =>
        !localState.doNotTrack ? validateRequired(v?.name ? v.name : v) : true,
    },
  };

  React.useEffect(() => {
    setFilename(uploadFlieName || '');
    setTypeImage(typeImage || '');
    setPdfUrl(uploadPDF || '');
    if (categorizationvendordetails?.id) {
      setLocalState((prev) => ({
        ...prev,
        file: uploadId,
        vendor: categorizationvendordetails.name,
        paymentStatus: paymentStatusSuper,
        expenseCategory: categorySuper,
      }));
    } else {
      setLocalState((prev) => ({
        ...prev,
        file: uploadId,
        vendor: vendorSuper(),
        paymentStatus: paymentStatusSuper,
        expenseCategory: categorySuper,
        payer_id: payerDetails,
      }));
    }
  }, [
    uploadPDF,
    typeOfImage,
    uploadFlieName,
    uploadId,
    // vendorSuper,
    paymentStatusSuper,
    categorySuper,
    categorizationvendordetails,
    payerDetails,
  ]);

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

  const getExpenseCategory = async () => {
    dispatch(getExpenseCategoryRedux());
  };

  const getAssetCategory = async () => {
    dispatch(getAssetCategoryRedux());
  };

  const getVendorUnsettled = async () => {
    dispatch(getVendorUnsettledRedux(localState.vendor?.id));
  };

  React.useEffect(() => {
    if (
      localState?.paymentStatus?.id === 'paid_as_advance' &&
      localState.vendor?.id
    ) {
      getVendorUnsettled();
    }
  }, [localState.vendor?.id, localState?.paymentStatus?.id]);

  const getOcrData = (id) => {
    enableLoading(true);
      axiosInst.post(`organizations/${organization.orgId}/vendor_bills`, { file: id }).then((ele) => {
        const res = ele.data;
        if (res && !res.error) {
          // setFetchDetails(res);
          setPdfUrl(res.file_url);
          enableLoading(false);
        } else {
          enableLoading(false);
          const errorValues = Object.values(res.errors);
          dispatch(
            openSnackbar({
              message: errorValues.join(', ') || 'Unknown error occured',
              type: 'error',
            }),
          );
          setFilename('');
        }
      })
      .catch((e) => {
        console.log('getOcrData', e);
        dispatch(
          openSnackbar({
            message: e?.message || 'Unknown error occured',
            type: 'error',
          }),
        );
        setFilename('');
        enableLoading(false);
      });
  };

  const saveBills = () => {
    enableLoading(true);
    const params = categorizationvendordetails?.id
      ? {
          // id: billId || undefined,
          name: localState.name,
          expense_account_id: localState.expenseCategory?.id,
          payment_mode: localState.paymentStatus?.id,
          vendor_id: localState.vendor?.id,
          // file: !haveBill ? undefined :
          file: localState.file || undefined,
          in_queue: true,
          bank_txn_id: selectedTransaction?.id || bankTxnId,
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
        }
      : {
          // id: billId || undefined,
          name: localState.name,
          bank_txn_id: bankTxnId,
          expense_account_id: localState.expenseCategory?.id,
          payment_mode: localState.paymentStatus?.id,
          vendor_id: localState.vendor?.id,
          // file: !haveBill ? undefined : localState.file,
          file: localState.file || undefined,
          in_queue: true,
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
      };
    
      axiosInst.post(`organizations/${organization.orgId}/vendor_bills`, params).then((ele) => {
        const res = ele.data;
        enableLoading(false);
        if (res && !res.error) {
          if (billUploadFrom === 'bankCategorization') {
            ExpenseDone({ response: { ...res, status: 'accounted' }, params });
            return;
          }
          if (multipleBills?.isShow) {
            if (device === 'mobile') {
              successView('main');
            } else {
              handleBottomSheetForSuper();
            }
            multipleBillsSubmitFun(res);
            return;
          }
          if (device === 'mobile') {
            successView('done');
          }
          if (device === 'desktop') {
            setDonePageBill(true);
            setDonePage(true);
          }
        } else if (res?.error) {
          if (res?.message) {
            dispatch(
              openSnackbar({
                message: res?.message || 'Unknown error occured',
                type: 'error',
              }),
            );
          } else {
            const errorValues = Object.values(res.errors);
            dispatch(
              openSnackbar({
                message: errorValues.join(', ') || 'Unknown error occured',
                type: 'error',
              }),
            );
          }
        }
      })
      .catch((e) => {
        enableLoading(false);
        dispatch(
          openSnackbar({
            message: e?.message || 'Unknown error occured',
            type: 'error',
          }),
        );
      });
  };

  React.useEffect(() => {
    getVendor();
    getExpenseCategory();
    getAssetCategory();
    dispatch(getBankList());
    return () => {
      dispatch(ClearSateVendorEntity());
      dispatch(clearRecordExpenseState());
    };
  }, []);

  // const handleChange = () => {
  //   if (haveBill) {
  //     setSelected(true);
  //     setUnselect(true);
  //     setHaveBill(false);
  //     // setFilename('');
  //     // setLocalState((s) => ({ ...s, file: '' }));
  //   } else if (!haveBill) {
  //     setSelected(false);
  //     setUnselect(true);
  //     setHaveBill(true);
  //   }
  // };

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
    // if (ps.target.name === 'amount') {
    //   reValidate({ target: { name: 'expenseCategory' } });
    // }
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
      if (name === 'addManually' || name === 'list') {
        setTrigger(name);
        sheetName = 'vendor';
        getVendor();
      } else if (
        localState?.vendor?.id &&
        (name === 'addManually' || name === 'list')
      ) {
        setTrigger('list');
        getVendor();
        sheetName = 'vendor';
      }
      setDrawer((d) => ({ ...d, [sheetName]: true }));
    }, 300);
  };

  const handleBottomSheet = (name, data) => {
    if (!data?.onClose) setDrawer((d) => ({ ...d, [name]: false }));
    if (data && name) setLocalState((s) => ({ ...s, [name]: data }));
    if (data === 'Do not track' && name === 'vendor') {
      return;
    }
    if (data && data.id && name === 'vendor') {
      setLocalState((s) => ({ ...s, [name]: data }));
      setIsVendorAvailable(true);
      reValidate({ target: { name, value: data } });
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
      //  saveBills(true, { payment_mode: data?.id });
    }
    if (name === 'payer_id') {
      setEmployee({ open: false });
      // saveBills(true, {
      //   payment_mode: data?.payment_mode?.id,
      //   payer_id: data?.payer_id?.id,
      // });
      setLocalState((s) => ({
        ...s,
        paymentStatus: data?.payment_mode,
        payer_id: data?.payer_id,
      }));
      return;
    }
    if (data === '' && name === 'vendor') {
      setLocalState((s) => ({ ...s, [name]: data }));
      reValidate({ target: { name, value: data } });
    }
    if (localState[name] && !data) return;
    reValidate({ target: { name, value: data } });
  };
  const handleDoNotTrackVendor = (data) => {
    const stateName = 'doNotTrack';
    const validationName = 'vendor';
    setIsVendorAvailable(data);
    setValidationErr((v) => ({
      ...v,
      [validationName]: false,
    }));
    setLocalState((s) => ({ ...s, [stateName]: data }));
    setDntCheckbox(data);
    handleBottomSheet('vendor', data ? 'Do not track' : '');
  };

  React.useEffect(() => {
    if (doNotTrackCheck) handleDoNotTrackVendor(doNotTrackCheck);
  }, [doNotTrackCheck]);

  const onFileUpload = (e, directFile) => {
    // console.log('LOOPCHECK if onFileUpload e, directFile', e, directFile);
    const file = directFile ? e : e?.target?.files?.[0];
    const url = `${BASE_URL}/direct_uploads`;
    const upload = new DirectUpload(file, url);
    enableLoading(true);
    upload.create((error, blob) => {
      // console.log('LOOPCHECK upload.create', blob);
      enableLoading(false);
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

  const handleWithLocation = (element) => {
    handleBottomSheet('vendor', element);
  };

  const onTriggerDrawerForEdit = (name, element) => {
    setEditValue(element);
    setSuperEditValue(element);
    setDrawer((d) => ({ ...d, vendor: false }));
    if (device === 'desktop') {
      setDrawer((d) => ({ ...d, [name]: true }));
    }
    if (device === 'mobile') {
      successView('edit');
    }
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

  const hangleChecked = (data) => {
    if (advancesData.indexOf(data) < 0) {
      setAdvancesData((previous) => [...previous, data]);
    } else {
      setAdvancesData((previous) => [
        ...previous.filter((val) => val !== data),
      ]);
    }
  };

  const validateAllFields = () => {
    const stateData = localState;
    // console.log('STATE', state);
    return Object.keys(VALIDATION).reduce((a, v) => {
      a[v] = !VALIDATION?.[v]?.test(stateData[v]);
      return a;
    }, {});
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    if (!filename) {
      dispatch(
        openSnackbar({
          message: 'Please upload your bill',
          type: 'error',
        }),
      );
      return;
    }
    if (!isVendorAvailable && !localState?.doNotTrack) {
      setValidationErr((s) => ({ ...s, vendor: true }));
      return;
    }

    saveBills();
  };

  const ocrByScan = () => {
    JSBridge.ocrByScan('ocrDetails');
  };

  const ocrByBrowse = () => {
    JSBridge.ocrByBrowse('ocrDetails');
  };

  const handlePaymentStatus = async (data, stateValue, ps) => {
    stateValue(data);
    setLocalState((prev) => ({ ...prev, paymentStatus: ps, payer_account_id: data?.bank_account_id}));
    setDrawer((d) => ({
      ...d,
      paymentStatus: false,
    }));
    // await saveBills(true, {
    //   payment_mode: ps?.id,
    //   payer_account_id: data?.bank_account_id,
    // });
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
          isSuperAccountant: true,
          paymentStats: ps,
          uploadPDF,
          typeOfImage,
          uploadFlieName,
          uploadId,
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
          isSuperAccountant: true,
          paymentStats: ps,
          uploadPDF,
          typeOfImage,
          uploadFlieName,
          uploadId,
        },
      });
    }
  };

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
     if (vendorEntity?.data) {
      // setPagination({ totalPage: vendorEntity?.pages, currentPage: vendorEntity?.page });
      if (vendorEntity?.page === 1) {
        setVendorList(vendorEntity?.data);
      } else {
        setVendorList((prev) => [...prev, ...vendorEntity?.data]);
      }
     }
   }, [JSON.stringify(vendorEntity || {})]);

  return !donePage ? (
    <>
      <div
        style={{
          margin: device === 'desktop' ? '1rem' : '5%',
          width: device === 'desktop' ? '30rem' : '90%',
        }}
        className={css.headerContainer}
      >
        {device === 'desktop' && (
          <p className={`${css.headerLabel} ${css.headerLabelForClose}`}>
            Assign to SuperAccountant
            <span
              className={css.closeDialog}
              onClick={() => {
                handleBottomSheetForSuper();
              }}
            >
              X
            </span>
          </p>
        )}
        {device === 'desktop' && <span className={css.headerUnderline} />}
        {billUploadFrom !== 'bankCategorization' && (
          <p className={css.headerSubLabel}>
            Please share data related to the fields presented below so that we
            can record your expense efficiently
          </p>
        )}
      </div>
      <div
        className={
          device === 'desktop'
            ? css.recordAnExpenseContainerForSuper
            : css.recordAnExpenseContainerForSuperMobile
        }
        style={{
          background: billUploadFrom === 'bankCategorization' && '#fff',
        }}
      >
        <div className={`${css.inputContainer} ${css.inputContainerForSuper}`}>
          {/* {haveBill ? ( */}
          <div className={css.uploadContainer}>
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
            <div
              style={{
                position: 'absolute',
                width: '90%',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
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
              <div
                className={
                  device === 'mobile'
                    ? css.uploadActionContainer
                    : css.uploadActionContainerSingle
                }
              >
                {device === 'mobile' &&
                  (window.isDevice() === true ? (
                    <Mui.Button
                      className={`${css.submitButton}`}
                      onClick={() => {
                        ocrByScan();
                      }}
                    >
                      Scan
                    </Mui.Button>
                  ) : (
                    <label className={`${css.submitButton}`} htmlFor="upload">
                      Scan
                    </label>
                  ))}

                {window.isDevice() === true ? (
                  <Mui.Button
                    className={`${css.submitButton}`}
                    onClick={() => {
                      ocrByBrowse();
                    }}
                  >
                    Browse
                  </Mui.Button>
                ) : (
                  <label className={`${css.submitButton}`} htmlFor="upload">
                    Browse
                  </label>
                )}
              </div>
              <div
                style={{
                  height: '3px',
                  width: '100%',
                  backgroundColor: '#000000',
                }}
              />
              {/* <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={handleChange}
                >
                  <Mui.Checkbox
                    checked={selected}
                    style={{ color: '#A0A4AF' }}
                    onClick={handleChange}
                    value="withoutBill"
                  />
                  <div>Record Expense Without Bill </div>
                </div> */}
            </div>

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
            {/* {!filename && (
                <div className={css.description}>
                  Browse bills or scan your document
                </div>
              )} */}
          </div>
          {/* ) : (
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
                It is recommended to always upload a bill especially for any
                transction above Rs. 2000 for Tax Purposes
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={handleChange}
              >
                <Mui.Checkbox
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
          )} */}

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
          >
            <ExpenseCategoryList
              expenseCategoryList={expenseCategoryList}
              assetCategoryList={assetCategoryList}
              onClick={(ps) => handleBottomSheet('expenseCategory', ps)}
              hasTDSCategory={false}
              categoryListOpen={drawer.expenseCategory}
              getExpenseCategory={getExpenseCategory}
              getAssetCategory={getAssetCategory}
            />
          </SelectBottomSheet>
          {/* {haveBill && ( */}
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
            label="Vendor"
            open={drawer.vendor}
            value={
              localState.vendor?.name
                ? localState.vendor?.name
                : localState.vendor
            }
            toShow={isVendorAvailable}
            showAddText={
              !isVendorAvailable &&
              (localState.vendor?.name || localState.vendor)
                ? 'Add This Vendor'
                : 'Add Vendor'
            }
            onTrigger={onTriggerDrawer}
            onClose={handleBottomSheet}
            required={!dntCheckbox}
            addNewSheet={!(trigger === 'list')}
            disabled={categorizationvendordetails?.id}
            // triggerComponent={
            //   <div
            //     className={css.iconField}
            //   >
            //     <p>Vendor</p>
            //   </div>
            // }
          >
            {trigger === 'addManually' && (
              <VendorList
                trigger={trigger}
                vendorList={vendorList}
                valOfSelection={handleBottomSheet}
                onClick={(ps) => handleBottomSheet('vendor', ps)}
                onDoNotTrackVendor={(ps) => handleDoNotTrackVendor(ps)}
                dntCheckbox={dntCheckbox}
                // setDntCheckbox={setDntCheckbox}
                continueFlow={() => setDrawer((d) => ({ ...d, vendor: false }))}
                updateVendorList={getVendor}
                details={venFetchDetails}
                setIsVendorAvailable={setIsVendorAvailable}
                panEnable
              />
            )}
            {trigger === 'list' && (
              <CustomSearch
                showType="Vendor"
                customerList={vendorList}
                callFunction={getVendor}
                handleLocationParties={handleWithLocation}
                handleAllParties={(ps) => handleBottomSheet('vendor', ps)}
                addNewOne={() => setTrigger('addManually')}
                openDrawer={onTriggerDrawerForEdit}
                dntCheckbox={dntCheckbox}
                onDoNotTrackVendor={(ps) => handleDoNotTrackVendor(ps)}
                // details={fetchDetails}
                from="billBooking"
              />
            )}
          </SelectBottomSheet>
          {/* )} */}

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
            onClose={handleBottomSheet}
            required
            addNewSheet
            disabled={categorizationvendordetails?.id}
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
                                                <MuiIcon.Done
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
                                                <MuiIcon.Done
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
                                            <MuiIcon.Done
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

          <SelectBottomSheet
            name="preview"
            triggerComponent={
              <Mui.Button
                className={
                  billUploadFrom === 'bankCategorization' && device === 'mobile'
                    ? `${css.superSubmitButton} ${css.superSubmitButtonWithBankCategorization}`
                    : `${css.superSubmitButton}`
                }
                onClick={(e) => {
                  onSubmit(e);
                }}
                size="medium"
              >
                Assign Now
              </Mui.Button>
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

          <SelectBottomSheet
            open={drawer.paidAdvance}
            onClose={() => {
              handleBottomSheet('paidAdvance', 'test');
            }}
            triggerComponent={<></>}
          >
            <div className={css.advancePaid}>
              <div className={css.handle} />
              <div className={css.header}>
                <div className={css.valueHeader}>Select Advances to Adjust</div>
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
                            <Mui.Checkbox
                              onClick={() => hangleChecked(item.id)}
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
                                  'DD MMM YYYY'
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
          </SelectBottomSheet>
          <SelectBottomSheet
            name="edit"
            triggerComponent={<div style={{ display: 'none' }} />}
            open={drawer.edit}
            onTrigger={onTriggerDrawer}
            onClose={handleBottomSheet}
            maxHeight="45vh"
          >
            <div style={{ padding: '15px' }}>
              <div style={{ padding: '5px 0' }} className={css.headerContainer}>
                <p className={css.headerLabel}>{editValue?.name}</p>
                <span className={css.headerUnderline} />
              </div>
              <InvoiceCustomer
                showValue={editValue}
                handleBottomSheet={handleBottomSheet}
                type="vendors"
              />
            </div>
          </SelectBottomSheet>
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
        </div>
      </div>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  ) : (
    <div style={{ width: '30rem' }}>
      <SuccessView
        title="Done"
        // description={`${response?.expense_category?.name} ${
        //   response?.status
        // } to ${response?.vendor?.name} for Rs. ${toInr(
        //   response?.amount,
        // )} has been recorded`}
        description="Your Bill has been sent to your SuperAccountant. Please expect a speedy Bill Booking experience."
        onClick={handleBottomSheetForSuperDone}
      />
    </div>
  );
};

export default SuperAccUpload;
