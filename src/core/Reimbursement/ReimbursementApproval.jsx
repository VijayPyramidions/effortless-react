/* eslint-disable no-nested-ternary */
/* eslint-disable no-lonely-if */

import React, { memo, useEffect, useState, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import * as Mui from '@mui/material';
// import { Carousel } from 'react-responsive-carousel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Dialog } from '@material-ui/core';

import {
  getClaims,
  setDrawer,
  getEmployees,
  getOneClaim,
  getVoucher,
  setVoucher,
  postItems,
  postItemsDelete,
  getTrips,
  getTripExpenses,
  setOnClaim,
  setClaims,
  setTrips,
} from '@action/Store/Reducers/Reimbursement/ReimbursementState';

// import { enableLoading } from '@action/Store/Reducers/Errors/Errors';

import {
  advancePaymentVoucher,
  // createUpdateAdvPayment,
} from '@action/Store/Reducers/Payments/AdvancePaymentState';
import { getBankAccounts } from '@action/Store/Reducers/Payments/PaymentsState';

import {
  Box,
  Button,
  Stack,
  ButtonGroup,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
  Tab,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { FinalPayment } from '@core/PaymentView/FinalPayment';
import SuccessView from '@core/BillBookView/shared/SuccessView';
import { ArrowForwardRounded as ArrowForwardRoundedIcon } from '@mui/icons-material';
import searchicon from '@assets/search_1.svg';
import filter from '@assets/filterPlain.svg';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import AppContext from '@root/AppContext';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import ProceedToPay from '../PaymentView/shared/ProceedToPay';
import ForgetPassword from '../PaymentView/TransactionVerify/ForgetPassword';

import { StatusComponents } from './Reimbursement';
import HeaderContainer from './Components/Mobile/HeaderContainer';
import TripCard from './Components/Mobile/TripCard';
import {
  PayTripAdvanceForm,
  RequestTripAdvanceForm,
} from './Components/TripAdvanceForm';

import * as css from './reimbursementapproval.scss';
import * as css2 from './reimbursement.scss';

import { IndianCurrencyNoSymbol } from '../../components/utils';
// import ClaimReview from './Components/ClaimReview';
import ReimbursementClaimReview from './ReimbursementClaimReview';
import ReimbursementTripClaimReview from './ReimbursementTripClaimReview';
import AddTrip from './Components/AddTrip';

const style = {
  border: 'none',
  borderWidth: 'unset !important',
  borderStyle: 'none !important',
  borderColor: 'unset !important',

  '& .MuiDataGrid-columnHeadersInner': {
    background: '#F7F7F7',
    flex: 1,
  },

  '& .MuiDataGrid-columnHeader': {
    height: '40px !important',
  },

  '& .MuiDataGrid-cell': {
    minHeight: '56px !important',
    maxHeight: '56px !important',
  },

  '& .MuiDataGrid-row': {
    minHeight: '56px !important',
    maxHeight: '56px !important',
    borderBottom: '1px solid #E5E5E5',
  },

  '& .MuiDataGrid-columnSeparator': { display: 'none' },

  '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer':
    {
      display: 'none',
    },
};

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
      <GridToolbarQuickFilter sx={{ marginLeft: 'auto' }} />
    </GridToolbarContainer>
  );
}

const ReimbursementApproval = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const themes = useTheme();
  const searchRef = useRef();
  const scrollRef = useRef(null);

  const { userPermissions, currentUserInfo } = useContext(AppContext);

  const [active, setActive] = useState(
    location?.state?.status || 'pending_claims',
  );
  const [search, setSearch] = useState('');
  const [drawerState, setDrawerState] = useState({});
  const [sortValue, setSortValue] = useState('');
  const device = localStorage.getItem('device_detect');
  const [addTripManager, setAddTripManager] = useState(false);

  const [havePermission, setHavePermission] = useState(false);

  const [valueOptionsVendorFilter, setValueOptionsVendorFilter] = useState([]);
  const [valueOptionsEmployeeFilter, setValueOptionsEmployeeFilter] = useState(
    [],
  );

  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));

  const { bankAccounts } = useSelector((value) => value.Payments);
  const {
    claims,
    claimsCount,
    drawer,
    employees,
    voucher,
    allVoucherItems,
    approveResponse,
    tripDetails,
    // tripExpense,
  } = useSelector((state) => state.Reimbursement);

  const pendingClaims = [
    {
      field: 'number',
      headerName: 'ID',
      width: 60,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Typography sx={{ color: '#3049BF', fontSize: '14px' }}>
          {param?.row?.number}
        </Typography>
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Category',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: 'employee_name',
      headerName: 'Employee Name',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Stack className={css.avatarwrapper}>
          <Avatar className={css.avatar}>
            {param?.row?.employee_name?.slice(0, 1)}
          </Avatar>
          <Typography className={css.empname}>
            {param?.row?.employee_name}
          </Typography>
        </Stack>
      ),
      type: 'singleSelect',
      valueOptions: valueOptionsEmployeeFilter,
    },
    {
      field: 'vendor_name',
      headerName: 'Vendor',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) =>
        param.row.vendor_name ? param.row.vendor_name : '-',
      type: 'singleSelect',
      valueOptions: valueOptionsVendorFilter,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      groupable: false,
      sortable: false,
      flex: 1,
      renderCell: (param) => StatusComponents[param.row.status],
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
  ];

  const pendingPayment = [
    {
      field: 'number',
      headerName: 'ID',
      width: 60,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Typography sx={{ color: '#3049BF', fontSize: '14px' }}>
          {param?.row?.number}
        </Typography>
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Category',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: 'employee_name',
      headerName: 'Employee Name',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Stack className={css.avatarwrapper}>
          <Avatar className={css.avatar}>
            {param?.row?.employee_name?.slice(0, 1)}
          </Avatar>
          <Typography className={css.empname}>
            {param?.row?.employee_name}
          </Typography>
        </Stack>
      ),
      type: 'singleSelect',
      valueOptions: valueOptionsEmployeeFilter,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      groupable: false,
      // sortable: false,
      flex: 1,
      renderCell: (param) => StatusComponents[param.row.status],
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
  ];

  const pendingTripClaims = [
    {
      field: 'number',
      headerName: 'ID',
      width: 60,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Typography sx={{ color: '#3049BF', fontSize: '14px' }}>
          {param?.row?.number}
        </Typography>
      ),
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (params) =>
        moment(params.row?.start_date).format('DD MMM YYYY'),
    },
    {
      field: 'end_date',
      headerName: 'End Date',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (params) =>
        moment(params.row?.end_date).format('DD MMM YYYY'),
    },
    {
      field: 'name',
      headerName: 'Trip Name',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: 'trip_completed',
      headerName: 'Trip Status',
      width: 200,
      groupable: false,
      sortable: true,

      flex: 1,
      renderCell: (param) =>
        param.row.trip_completed ? 'Completed' : 'On Going',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      groupable: false,
      // sortable: false,
      flex: 1,
      renderCell: (param) => StatusComponents[param.row.status],
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
  ];

  const advanceRequest = [
    {
      field: 'number',
      headerName: 'ID',
      width: 60,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Typography sx={{ color: '#3049BF', fontSize: '14px' }}>
          {param?.row?.number}
        </Typography>
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Trip Name',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    // {
    //   field: 'description',
    //   headerName: 'Description',
    //   width: 200,
    //   groupable: false,
    //   sortable: false,
    //   flex: 1,
    // },
    {
      field: 'employee_name',
      headerName: 'Employee Name',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Stack className={css.avatarwrapper}>
          <Avatar className={css.avatar}>
            {param?.row?.employee_name?.slice(0, 1)}
          </Avatar>
          <Typography className={css.empname}>
            {param?.row?.employee_name}
          </Typography>
        </Stack>
      ),
      type: 'singleSelect',
      valueOptions: valueOptionsEmployeeFilter,
    },
    {
      field: 'group_status',
      headerName: 'Trip Status',
      width: 200,
      groupable: false,
      // sortable: false,
      flex: 1,
      renderCell: (param) => StatusComponents[param.row.group_status],
    },
    {
      field: 'status',
      headerName: 'Advance Status',
      width: 200,
      groupable: false,
      // sortable: false,
      flex: 1,
      renderCell: (param) => StatusComponents[param.row.status],
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: 'outstanding_amount',
      headerName: 'Outstanding',
      width: 100,
      groupable: false,
      // align: 'right',
      sortable: true,

      flex: 1,
      renderCell: (param) =>
        param.row.outstanding_amount ? param.row.outstanding_amount : '₹ 0',
    },
  ];

  const [table, setTable] = useState({
    column: pendingClaims,
    title: 'Pending Claims',
  });

  const [tripTable, setTripTable] = useState({
    column: pendingTripClaims,
    title: 'Pending Trip Claims',
  });

  const [selectedRow, setSelectedRow] = useState([]);
  const [advanceAction, setAdvanceAction] = useState('new');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [expenseTab, setExpenseTab] = useState('expense');
  const [multiplePayments, setMultiplePayments] = useState(false);
  const [paymentsResponse, setPaymentsResponse] = useState();
  const [transacForgetPass, setTransacForgetPass] = useState(false);

  const createVoucherItemsExpense = async (data) => {
    if (active === 'pending_payment') {
      const set1 = new Set(data);
      const set2 = new Set(selectedIds);

      const haveSameElements =
        set1.size === set2.size &&
        [...set1].every((element) => set2.has(element));

      if (haveSameElements) {
        const selectedRowData = claims?.data?.find(
          (val) => val?.id === data[0],
        );
        const selectedTxnLineId = allVoucherItems?.find(
          (val) => val?.txn_line_id === selectedRowData?.txn_line_id,
        );
        const newArray = selectedIds.filter(
          (element) => element !== selectedRowData?.id,
        );

        setSelectedIds(newArray);
        // dispatch(enableLoading(true));
        if (selectedTxnLineId?.id) {
          dispatch(
            postItemsDelete({
              VoucherId: voucher?.id,
              id: selectedTxnLineId?.id,
            }),
          );
        }
      } else {
        const missingElements = data.filter(
          (element) => !selectedIds?.includes(element),
        );
        const missingElements_delete = selectedIds.filter(
          (element) => !data?.includes(element),
        );
        if (missingElements?.length > 0) {
          if (selectedIds?.length >= 0) {
            let mismatchedElements;
            let selectedRowData;
            if (selectedIds?.length !== 0) {
              mismatchedElements = data.filter(
                (item) => !selectedIds?.includes(item),
              );
              if (expenseTab === 'expense') {
                selectedRowData = claims?.data?.find(
                  (val) => val?.id === mismatchedElements[0],
                );
              } else {
                selectedRowData = tripDetails?.find(
                  (val) => val?.id === mismatchedElements[0],
                );
              }
            } else {
              if (expenseTab === 'expense') {
                selectedRowData = claims?.data?.find(
                  (val) => val?.id === data[0],
                );
              } else {
                selectedRowData = tripDetails?.find(
                  (val) => val?.id === data[0],
                );
              }
            }
            const body = {
              vendor_id: selectedRowData?.employee_id,
              entity_type: 'employee',
              amount: selectedRowData?.amount,
              document_reference: '',
              description: selectedRowData?.narration,
              txn_line_id: selectedRowData?.txn_line_id,
              parent_id: selectedRowData?.id,
            };
            setSelectedIds(data);
            dispatch(postItems({ VoucherId: voucher?.id, body }));
          }
        }
        if (missingElements_delete?.length > 0) {
          let selectedRowData;
          if (expenseTab === 'expense') {
            selectedRowData = claims?.data?.find(
              (val) => val?.id === missingElements_delete[0],
            );
          } else {
            selectedRowData = tripDetails?.find(
              (val) => val?.id === missingElements_delete[0],
            );
          }
          const selectedTxnLineId = allVoucherItems?.find(
            (val) => val?.txn_line_id === selectedRowData?.txn_line_id,
          );
          let newArray;
          if (expenseTab === 'expense') {
            newArray = selectedIds.filter(
              (element) => element !== selectedRowData?.id,
            );
          } else {
            newArray = selectedIds.filter(
              (element) => element !== selectedRowData?.id,
            );
          }

          setSelectedIds(newArray);
          // dispatch(enableLoading(true));
          if (selectedTxnLineId?.id) {
            dispatch(
              postItemsDelete({
                VoucherId: voucher?.id,
                id: selectedTxnLineId?.id,
              }),
            );
          }
        }
      }
    }
  };

  const createVoucherItemsTrip = async (data) => {
    if (active === 'pending_payment') {
      const set1 = new Set(data);
      const set2 = new Set(selectedIds);

      const haveSameElements =
        set1.size === set2.size &&
        [...set1].every((element) => set2.has(element));

      if (haveSameElements) {
        const selectedRowData = tripDetails?.find((val) => val?.id === data[0]);
        const selectedTxnLineId = allVoucherItems?.find(
          (val) => val?.txn_line_id === selectedRowData?.txn_line_id,
        );
        const newArray = selectedIds.filter(
          (element) => element !== selectedRowData?.id,
        );

        setSelectedIds(newArray);
        // dispatch(enableLoading(true));
        if (selectedTxnLineId?.id) {
          dispatch(
            postItemsDelete({
              VoucherId: voucher?.id,
              id: selectedTxnLineId?.id,
            }),
          );
        }
      } else {
        const missingElements = data.filter(
          (element) => !selectedIds?.includes(element),
        );
        const missingElements_delete = selectedIds.filter(
          (element) => !data?.includes(element),
        );
        if (missingElements?.length > 0) {
          if (selectedIds?.length >= 0) {
            let mismatchedElements;
            let selectedRowData;
            if (selectedIds?.length !== 0) {
              mismatchedElements = data.filter(
                (item) => !selectedIds?.includes(item),
              );
              if (expenseTab === 'expense') {
                selectedRowData = claims?.data?.find(
                  (val) => val?.id === mismatchedElements[0],
                );
              } else {
                selectedRowData = tripDetails?.find(
                  (val) => val?.id === mismatchedElements[0],
                );
              }
            } else {
              if (expenseTab === 'expense') {
                selectedRowData = claims?.data?.find(
                  (val) => val?.id === data[0],
                );
              } else {
                selectedRowData = tripDetails?.find(
                  (val) => val?.id === data[0],
                );
              }
            }

            const diffAmount =
              selectedRowData?.amount - selectedRowData.advance_amount || 0;

            const body = {
              vendor_id: selectedRowData?.employee_id,
              entity_type: 'employee',
              amount: diffAmount < 0 ? 0 : diffAmount,
              document_reference: '',
              description: selectedRowData?.narration,
              txn_line_id: selectedRowData?.txn_line_id,
              parent_id: selectedRowData?.id,
            };
            setSelectedIds(data);
            dispatch(postItems({ VoucherId: voucher?.id, body }));
          }
        }
        if (missingElements_delete?.length > 0) {
          let selectedRowData;
          if (expenseTab === 'expense') {
            selectedRowData = tripDetails?.find(
              (val) => val?.id === missingElements_delete[0],
            );
          } else {
            selectedRowData = tripDetails?.find(
              (val) => val?.id === missingElements_delete[0],
            );
          }
          const selectedTxnLineId = allVoucherItems?.find(
            (val) => val?.txn_line_id === selectedRowData?.txn_line_id,
          );
          let newArray;
          if (expenseTab === 'expense') {
            newArray = selectedIds.filter(
              (element) => element !== selectedRowData?.id,
            );
          } else {
            newArray = selectedIds.filter(
              (element) => element !== selectedRowData?.id,
            );
          }

          setSelectedIds(newArray);
          // dispatch(enableLoading(true));
          if (selectedTxnLineId?.id) {
            dispatch(
              postItemsDelete({
                VoucherId: voucher?.id,
                id: selectedTxnLineId?.id,
              }),
            );
          }
        }
      }
    }
  };

  const onHandleTabClick = (val) => {
    setSearch('');
    setSortValue('');
    setActive(val);
    if (val === 'pending_claims') {
      setTable((prev) => ({
        ...prev,
        column: pendingClaims,
        title: 'Pending Claims',
      }));

      setTripTable((prev) => ({
        ...prev,
        // column: pendingTripClaims,
        title: 'Pending Trip Claims',
      }));
      if (device === 'mobile') scrollRef.current.scrollLeft = 0;
    } else if (val === 'pending_payment') {
      if (!voucher?.id) {
        dispatch(getVoucher());
      }
      setTable((prev) => ({
        ...prev,
        column: pendingPayment,
        title: 'Pending Payment',
      }));
      setTripTable((prev) => ({
        ...prev,
        // column: pendingTripPayment,
        title: 'Pending Trip Payment',
      }));
    } else if (val === 'advance_claims') {
      setTable((prev) => ({
        ...prev,
        column: advanceRequest,
        title: 'Advance Request',
      }));
      setExpenseTab('expense');
      if (device === 'mobile') scrollRef.current.scrollLeft += 1000;
    }
  };

  const handleDrawer = (name, action) => {
    if (name === 'claimReview' && action === false)
      dispatch(getTrips({ type: active, status: sortValue }));
    dispatch(setDrawer({ name, value: action }));
  };

  const handleRowClick = (data) => {
    if (expenseTab === 'expense') dispatch(getOneClaim(data?.row?.id));
    else dispatch(getTripExpenses(data?.row?.id));
    if (active === 'advance_claims') {
      handleDrawer('payAdvanceApprove', true);
      dispatch(advancePaymentVoucher({ transaction_type: '' }));

      // dispatch(
      //   createUpdateAdvPayment({
      //     type: 'post',
      //     payload: {
      //       advance_request_id: data?.row?.id,
      //       amount: data?.row?.amount,
      //       vendor_id: data?.row?.employee_id,
      //       entity_type: 'employee',
      //     },
      //   })
      // );
    } else {
      if (expenseTab === 'expense') {
        if (data?.row.status === 'approved')
          createVoucherItemsExpense([data?.row?.id]);
      } else {
        if (data?.row.status === 'approved')
          createVoucherItemsTrip([data?.row?.id]);
      }
      handleDrawer('claimReview', true);
    }
    setSelectedRow(data.row);
  };

  const onClickTrip = () => {
    dispatch(setClaims([]));
    setExpenseTab('trip');
    createVoucherItemsExpense([]);
  };

  const onClickExpense = () => {
    dispatch(setTrips([]));
    setExpenseTab('expense');
    createVoucherItemsTrip([]);
  };
  useEffect(() => {
    if (expenseTab === 'expense')
      dispatch(getClaims({ type: active, status: sortValue }));
    if (active !== 'advance_claims' && expenseTab === 'trip')
      dispatch(getTrips({ type: active, status: sortValue }));
  }, [dispatch, active, expenseTab]);

  useEffect(() => {
    if (approveResponse === 'Reimbursement has been approved successfully') {
      if (!voucher?.id) {
        dispatch(getVoucher());
      }
      setActive('pending_payment');
    }
  }, [approveResponse]);

  useEffect(() => {
    if (drawer?.payAdvance) dispatch(getEmployees());
  }, [drawer?.payAdvance]);

  useEffect(() => {
    if (voucher?.id) dispatch(getBankAccounts(voucher?.id));
  }, [voucher?.id]);

  useEffect(() => {
    if (desktopView) {
      const tempVendor = Array.from(
        new Set(claims?.data?.map((invoice) => invoice?.vendor_name)),
      )?.map((ele) => ({ value: ele, label: ele }));
      const tempEmployee = Array.from(
        new Set(claims?.data?.map((invoice) => invoice?.employee_name)),
      )?.map((ele) => ({ value: ele, label: ele }));
      setValueOptionsVendorFilter(tempVendor);
      setValueOptionsEmployeeFilter(tempEmployee);
      const tempTable = table;
      setTable(tempTable);
    }
  }, [desktopView, claims?.data]);

  useEffect(() => {
    if (allVoucherItems?.length <= 0) {
      setSelectedItems([]);
      setSelectedIds([]);
    } else {
      if (active === 'pending_payment') {
        if (expenseTab === 'trip') {
          const txnLineIds = allVoucherItems.map((item) => item.txn_line_id);

          const Ids = tripDetails
            ?.filter((item) => txnLineIds.includes(item.txn_line_id))
            .map((item) => item.id);
          setSelectedItems(Ids);
          setSelectedIds(Ids);
        } else {
          const txnLineIds = allVoucherItems.map((item) => item.txn_line_id);

          const Ids = claims?.data
            ?.filter((item) => txnLineIds.includes(item.txn_line_id))
            .map((item) => item.id);
          setSelectedItems(Ids);
          setSelectedIds(Ids);
        }
      }
    }
  }, [allVoucherItems]);

  useEffect(() => {
    return () => {
      dispatch(setVoucher(null));
    };
  }, []);

  return (
    <>
      {desktopView ? (
        <Box className={css.reimbursementApprovalClass}>
          <Stack className={css.amountdetails}>
            <Stack className={css.amountdetailcard}>
              <Stack>
                <Stack className={css.titlewrapper}>
                  <Typography className={css.title}>Pending Claims</Typography>
                  <Typography className={css.claimcount}>
                    {claimsCount?.pending_claims_count || 0}
                  </Typography>
                </Stack>

                <Typography className={`${css.amount} ${css.pendingclaims}`}>
                  {`Rs. ${IndianCurrencyNoSymbol.format(
                    claimsCount?.pending_claims || 0,
                  )}`}
                </Typography>
              </Stack>
            </Stack>
            <Stack className={css.amountdetailcard}>
              <Stack>
                <Stack className={css.titlewrapper}>
                  <Typography className={css.title}>Pending Payment</Typography>
                  <Typography className={css.claimcount}>
                    {claimsCount?.pending_payment_count || 0}
                  </Typography>
                </Stack>

                <Typography className={`${css.amount} ${css.pendingpayment}`}>
                  {`Rs. ${IndianCurrencyNoSymbol.format(
                    claimsCount?.pending_payment || 0,
                  )}`}
                </Typography>
              </Stack>
            </Stack>

            <Stack className={css.amountdetailcard}>
              <Stack>
                <Stack className={css.titlewrapper}>
                  <Typography className={css.title}>Advance Request</Typography>
                  <Typography className={css.claimcount}>
                    {claimsCount?.advance_request_count || 0}
                  </Typography>
                </Stack>

                <Typography className={`${css.amount} ${css.advance}`}>
                  {`Rs. ${IndianCurrencyNoSymbol.format(
                    claimsCount?.unsettled_advance_claims || 0,
                  )}`}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack className={css.tabpayconatainer}>
            <Stack className={css.tabwrapper}>
              <ButtonGroup variant="outlined" className={css.tabgroup}>
                <Button
                  className={
                    active === 'pending_claims'
                      ? `${css.tab} ${css.active}`
                      : css.tab
                  }
                  onClick={() => {
                    if (
                      userPermissions?.Reimbursement?.['Reimbursement Claims']
                        ?.view_reimbursement_claim
                    )
                      onHandleTabClick('pending_claims');
                    else setHavePermission(true);
                  }}
                >
                  Pending Claims
                </Button>
                <Button
                  className={
                    active === 'pending_payment'
                      ? `${css.tab} ${css.active}`
                      : css.tab
                  }
                  onClick={() => {
                    if (
                      userPermissions?.Reimbursement?.['Payment Request']
                        ?.view_reimbursement_payment_req
                    )
                      onHandleTabClick('pending_payment');
                    else setHavePermission(true);
                  }}
                >
                  Pending Payment
                </Button>
                <Button
                  className={
                    active === 'advance_claims'
                      ? `${css.tab} ${css.active}`
                      : css.tab
                  }
                  onClick={() => onHandleTabClick('advance_claims')}
                >
                  Advance Request
                </Button>
              </ButtonGroup>
            </Stack>
            <Stack className={css.paywrapper}>
              <Stack className={css.pay}>
                <Typography className={css.paytitle}>
                  Make Advance Payment for a trip
                </Typography>
                {/* <Typography className={css.paysubtitile}>
                  Make Advance Payment for a trip
                </Typography> */}
              </Stack>
              <Stack className={css.paybtnwrapper}>
                <Button
                  className={css.paybtn}
                  onClick={() => {
                    if (
                      userPermissions?.Reimbursement?.['Reimbursement Claims']
                        ?.create_reimbursement_claim &&
                      userPermissions?.Payments?.Payment?.create_payment
                    ) {
                      setAdvanceAction('new');
                      handleDrawer('payAdvance', true);
                    } else setHavePermission(true);
                  }}
                >
                  Pay <ArrowForwardRoundedIcon className={css.arrowicon} />
                </Button>
              </Stack>
            </Stack>
          </Stack>
          <Box className={css.tableContainer}>
            <Stack className={css.header}>
              <Typography variant="h4" className={css.tabtitle}>
                {/* {table?.title} */}

                {expenseTab === 'expense' ? table?.title : tripTable?.title}
                <span className={css.count}>
                  {expenseTab === 'expense'
                    ? ` (${claims?.data?.length || 0})`
                    : ` (${tripDetails?.length || 0})`}
                </span>
              </Typography>
              {active !== 'advance_claims' && (
                <Stack className={css.expensetabwrapper}>
                  <Stack>
                    {selectedIds?.length > 0 &&
                      active === 'pending_payment' && (
                        <Button
                          className={css.headerpaytbn}
                          onClick={() =>
                            setDrawerState((d) => ({
                              ...d,
                              proceedToPay: true,
                            }))
                          }
                        >
                          Pay Bills
                        </Button>
                      )}
                  </Stack>

                  <Stack className={css.tabbtnwrapper}>
                    <Button
                      className={
                        expenseTab === 'expense'
                          ? `${css.tabbtn} ${css.active}`
                          : css.tabbtn
                      }
                      onClick={onClickExpense}
                    >
                      Expense
                    </Button>
                    <Button
                      className={
                        expenseTab === 'trip'
                          ? `${css.tabbtn} ${css.active}`
                          : css.tabbtn
                      }
                      onClick={() => {
                        if (!voucher?.id) {
                          dispatch(getVoucher());
                        }
                        onClickTrip();
                      }}
                    >
                      Trip Expense
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Stack>
            {expenseTab === 'expense' ? (
              <Stack sx={{ height: '83% !important' }}>
                <DataGridPremium
                  sx={style}
                  columns={table?.column}
                  rows={claims?.data || []}
                  onRowClick={(param) => handleRowClick(param)}
                  hideFooter
                  disableRowSelectionOnClick
                  density="compact"
                  // columnHeaderHeight={64}
                  // getRowHeight={() => 'auto'}
                  // rowHeight={58}
                  disableChildrenSorting
                  disableColumnMenu
                  disableColumnReorder
                  disableColumnPinning
                  disableColumnResize
                  disableRowGrouping
                  disableAggregation
                  disableSelectAllCheckbox
                  isRowSelectable={(param) =>
                    param?.row.status !== 'paid' &&
                    param?.row.status !== 'partially_paid'
                  }
                  checkboxSelection={active === 'pending_payment'}
                  onRowSelectionModelChange={(ids) => {
                    if (!voucher?.id) {
                      dispatch(getVoucher());
                    }
                    if (active === 'pending_payment') {
                      createVoucherItemsExpense(ids);
                    }
                  }}
                  rowSelectionModel={selectedIds}
                  components={{
                    Toolbar: CustomToolbar,
                    NoRowsOverlay: () => (
                      <Stack
                        height="100%"
                        alignItems="center"
                        justifyContent="center"
                      >
                        No Claims Found.....
                      </Stack>
                    ),
                  }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                    },
                  }}
                />
              </Stack>
            ) : (
              <Stack sx={{ height: '83% !important' }}>
                <DataGridPremium
                  sx={style}
                  columns={tripTable?.column}
                  rows={tripDetails || []}
                  onRowClick={(param) => handleRowClick(param)}
                  hideFooter
                  disableRowSelectionOnClick
                  density="compact"
                  // columnHeaderHeight={64}
                  // getRowHeight={() => 'auto'}
                  // rowHeight={58}
                  isRowSelectable={(param) =>
                    param?.row.status !== 'paid' &&
                    param?.row.status !== 'partially_paid'
                  }
                  checkboxSelection={active === 'pending_payment'}
                  onRowSelectionModelChange={(ids) => {
                    if (!voucher?.id) {
                      dispatch(getVoucher());
                    }
                    if (active === 'pending_payment') {
                      createVoucherItemsTrip(ids);
                    }
                  }}
                  rowSelectionModel={selectedIds}
                  components={{
                    Toolbar: CustomToolbar,
                    NoRowsOverlay: () => (
                      <Stack
                        height="100%"
                        alignItems="center"
                        justifyContent="center"
                      >
                        No Claims Found
                      </Stack>
                    ),
                  }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                    },
                  }}
                  disableChildrenSorting
                  disableColumnMenu
                  disableColumnReorder
                  disableColumnPinning
                  disableColumnResize
                  disableRowGrouping
                  disableAggregation
                  disableSelectAllCheckbox
                />
              </Stack>
            )}
          </Box>
        </Box>
      ) : (
        <div className={css.reimbursementMainMobile}>
          {/* <Carousel> */}
          <Stack>
            <div className={css.carouselHeader} ref={scrollRef}>
              {/* {!userPermissions?.Reimbursement?.['Reimbursement Claims']
                ?.view_reimbursement_claim && ( */}
              <HeaderContainer
                type="pending_claims"
                title="Pending Claims"
                amount={`Rs. ${IndianCurrencyNoSymbol.format(
                  claimsCount?.pending_claims || 0,
                )}`}
                btnName="View Details"
                btnAction={() => {
                  if (
                    userPermissions?.Reimbursement?.['Reimbursement Claims']
                      ?.view_reimbursement_claim
                  )
                    onHandleTabClick('pending_claims');
                  else setHavePermission(true);
                }}
                count={claimsCount?.advance_request_count || 0}
                disabled={active === 'pending_claims'}
              />
              {/* )} */}
              {/* {!userPermissions?.Reimbursement?.['Payment Request']
                ?.view_reimbursement_payment_req && ( */}
              <HeaderContainer
                type="pending_payment"
                title="Pending Payment"
                amount={`Rs. ${IndianCurrencyNoSymbol.format(
                  claimsCount?.pending_payment || 0,
                )}`}
                btnName="View Details"
                btnAction={() => {
                  if (
                    userPermissions?.Reimbursement?.['Payment Request']
                      ?.view_reimbursement_payment_req
                  )
                    onHandleTabClick('pending_payment');
                  else setHavePermission(true);
                }}
                count={claimsCount?.pending_payment_count || 0}
                disabled={active === 'pending_payment'}
              />
              {/* )} */}
              <HeaderContainer
                type="adv_req"
                title="Advance Request"
                amount={`Rs. ${IndianCurrencyNoSymbol.format(
                  claimsCount?.unsettled_advance_claims || 0,
                )}`}
                btnName="View Details"
                btnAction={() => onHandleTabClick('advance_claims')}
                count={claimsCount?.advance_request_count || 0}
                disabled={active === 'advance_claims'}
              />
            </div>
            <Stack className={css.indicatorContainer}>
              <Stack direction="row" gap="4px">
                <span
                  className={
                    active === 'pending_claims'
                      ? `${css.indicator} ${css.active}`
                      : css.indicator
                  }
                  onClick={() => onHandleTabClick('pending_claims')}
                />
                <span
                  className={
                    active === 'pending_payment'
                      ? `${css.indicator} ${css.active}`
                      : css.indicator
                  }
                  onClick={() => onHandleTabClick('pending_payment')}
                />
                <span
                  className={
                    active === 'advance_claims'
                      ? `${css.indicator} ${css.active}`
                      : css.indicator
                  }
                  onClick={() => onHandleTabClick('advance_claims')}
                />
              </Stack>
            </Stack>
          </Stack>

          {/* </Carousel> */}

          <Stack className={css.paywrapper}>
            <Stack className={css.pay}>
              <Typography className={css.paytitle}>
                Make Advance Payment for a trip
              </Typography>
            </Stack>
            <Stack className={css.paybtnwrapper}>
              <Button
                className={css.paybtn}
                onClick={() => {
                  if (
                    userPermissions?.Reimbursement?.['Reimbursement Claims']
                      ?.create_reimbursement_claim &&
                    userPermissions?.Reimbursement?.['Payment Request']
                      ?.create_reimbursement_payment_req
                  ) {
                    dispatch(advancePaymentVoucher({ transaction_type: '' }));
                    setAdvanceAction('new');
                    handleDrawer('payAdvance', true);
                  } else setHavePermission(true);
                }}
              >
                Pay <ArrowForwardRoundedIcon className={css.arrowicon} />
              </Button>
            </Stack>
          </Stack>
          {active !== 'advance_claims' ? (
            <TabContext value={expenseTab}>
              <Box className={css.tablistcontainer}>
                <TabList
                  onChange={(event, newValue) => {
                    setSearch('');
                    setSortValue('');
                    setExpenseTab(newValue);
                  }}
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: '#F08B32',
                      height: '1px',
                    },
                  }}
                  sx={{
                    '& .MuiTabs-flexContainer': {
                      gap: '32px',
                      justifyContent: 'space-around',
                    },
                  }}
                >
                  <Tab
                    label="Expense"
                    value="expense"
                    className={css.tab}
                    sx={{
                      '&.Mui-selected': {
                        color: '#F08B32 !important',
                      },
                    }}
                  />
                  <Tab
                    label="Trip Expense"
                    value="trip"
                    className={css.tab}
                    sx={{
                      '&.Mui-selected': {
                        color: '#F08B32 !important',
                      },
                    }}
                  />
                </TabList>
              </Box>
              <TabPanel value="expense" className={css.tabpanel}>
                <div className={css2.headertext}>
                  {active === 'pending_claims'
                    ? 'Pending Claims'
                    : active === 'pending_payment'
                    ? 'Pending Payment'
                    : 'Advance Request'}
                </div>

                <div className={css.searchFilterContainer}>
                  <Stack className={css.providersearchwrp}>
                    <img
                      src={searchicon}
                      alt="search icon"
                      className={css.searchicon}
                    />
                    <input
                      type="search"
                      placeholder="Search Employee"
                      className={css.searchinput}
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                      ref={searchRef}
                    />
                  </Stack>
                  {active === 'pending_claims' && (
                    <Button
                      className={css.filterBtn}
                      onClick={() =>
                        setDrawerState((d) => ({
                          ...d,
                          filterDrawer: true,
                        }))
                      }
                    >
                      <img className={css.image} src={filter} alt="Icon" />
                      <span className={css.btnName}>Filter</span>
                    </Button>
                  )}

                  {selectedIds?.length > 0 && active === 'pending_payment' && (
                    <Button
                      className={css.headerpaytbn}
                      onClick={() =>
                        setDrawerState((d) => ({
                          ...d,
                          proceedToPay: true,
                        }))
                      }
                    >
                      Pay Bills
                    </Button>
                  )}
                </div>
                <div className={css.tripDetails}>
                  {claims?.data?.filter((ele) =>
                    ele?.employee_name
                      ?.toLocaleLowerCase()
                      ?.includes(search?.toLocaleLowerCase()),
                  )?.length > 0 ? (
                    claims?.data
                      ?.filter((ele) =>
                        ele?.employee_name
                          ?.toLocaleLowerCase()
                          ?.includes(search?.toLocaleLowerCase()),
                      )
                      ?.map((item) => (
                        <TripCard
                          type="pendingClaims"
                          description={
                            active === 'advance_claims'
                              ? item?.description || '-'
                              : item?.name || '-'
                          }
                          active={active}
                          amountData={`₹ ${IndianCurrencyNoSymbol.format(
                            item?.amount,
                          )}`}
                          date={moment(item?.date).format('YYYY-MM-DD')}
                          status={item?.status}
                          name={item?.employee_name || '-'}
                          id={item?.id}
                          selectedIds={selectedIds}
                          setSelectedItems={setSelectedItems}
                          selectedItems={selectedItems}
                          showCheckbox={
                            active === 'pending_payment' &&
                            item?.status !== 'paid' &&
                            item?.status !== 'partially_paid'
                          }
                          handleCheckbox={async (val) => {
                            if (expenseTab === 'expense')
                              await createVoucherItemsExpense(val);
                            else await createVoucherItemsTrip(val);
                          }}
                          toNavigate={async () => {
                            if (expenseTab === 'expense')
                              await createVoucherItemsExpense([item?.id]);
                            else await createVoucherItemsTrip([item?.id]);
                            if (active === 'advance_claims') {
                              dispatch(getOneClaim(item.id));
                              dispatch(
                                advancePaymentVoucher({ transaction_type: '' }),
                              );
                              // dispatch(
                              //   createUpdateAdvPayment({
                              //     type: 'post',
                              //     payload: {
                              //       advance_request_id: item?.id,
                              //       amount: item?.amount,
                              //       vendor_id: item?.employee_id,
                              //       entity_type: 'employee',
                              //     },
                              //   }),
                              // );
                              navigate('/reimbursement-trip-advance-request', {
                                state: {
                                  action: 'update',
                                  payment: true,
                                  disabled: true,
                                  dataValue: item,
                                },
                              });
                            } else {
                              navigate('/reimbursement-claim-review', {
                                state: {
                                  item,
                                  tab: active,
                                  voucher,
                                  bankAccounts,
                                  allVoucherItems,
                                },
                              });
                            }
                          }}
                        />
                      ))
                  ) : (
                    <Stack
                      justifyContent="center"
                      alignItems="center"
                      sx={{ marginTop: '20px' }}
                    >
                      No Data Found
                    </Stack>
                  )}
                </div>
              </TabPanel>
              <TabPanel value="trip" className={css.tabpanel}>
                <div className={css2.headertext}>
                  {active === 'pending_claims'
                    ? 'Pending Trip Claims'
                    : active === 'pending_payment'
                    ? 'Pending Trip Payment'
                    : 'Advance Request'}
                </div>

                <div className={css.searchFilterContainer}>
                  <Stack className={css.providersearchwrp}>
                    <img
                      src={searchicon}
                      alt="search icon"
                      className={css.searchicon}
                    />
                    <input
                      type="search"
                      placeholder="Search Trip"
                      className={css.searchinput}
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                      ref={searchRef}
                    />
                  </Stack>
                  {active === 'pending_claims' && (
                    <Button
                      className={css.filterBtn}
                      onClick={() =>
                        setDrawerState((d) => ({
                          ...d,
                          filterDrawer: true,
                        }))
                      }
                    >
                      <img className={css.image} src={filter} alt="Icon" />
                      <span className={css.btnName}>Filter</span>
                    </Button>
                  )}
                  {selectedIds?.length > 0 && active === 'pending_payment' && (
                    <Button
                      className={css.headerpaytbn}
                      onClick={() =>
                        setDrawerState((d) => ({
                          ...d,
                          proceedToPay: true,
                        }))
                      }
                    >
                      Pay Bills
                    </Button>
                  )}
                </div>
                <div className={css.tripDetails}>
                  {tripDetails?.filter((ele) =>
                    ele?.name
                      ?.toLocaleLowerCase()
                      ?.includes(search?.toLocaleLowerCase()),
                  )?.length > 0 ? (
                    tripDetails
                      ?.filter((ele) =>
                        ele?.name
                          ?.toLocaleLowerCase()
                          ?.includes(search?.toLocaleLowerCase()),
                      )
                      ?.map((item) => (
                        <TripCard
                          type="outstanding"
                          description={
                            active === 'advance_claims'
                              ? item?.description || '-'
                              : item?.name || '-'
                          }
                          active={active}
                          amountData={item?.amount || 0}
                          date={moment(item?.start_date).format('YYYY-MM-DD')}
                          status={item?.status}
                          name={item?.name || '-'}
                          id={item?.id}
                          selectedIds={selectedIds}
                          setSelectedItems={setSelectedItems}
                          selectedItems={selectedItems}
                          showCheckbox={
                            active === 'pending_payment' &&
                            item?.status !== 'paid' &&
                            item?.status !== 'partially_paid'
                          }
                          handleCheckbox={async (val) => {
                            if (expenseTab === 'expense')
                              await createVoucherItemsExpense(val);
                            else await createVoucherItemsTrip(val);
                          }}
                          handleCardClick={async () => {
                            if (expenseTab === 'expense')
                              await createVoucherItemsExpense([item?.id]);
                            else await createVoucherItemsTrip([item?.id]);
                            navigate('/reimbursement-trip-approval', {
                              state: {
                                action: 'update',
                                payment: true,
                                tab: active,
                                // disabled: true,
                                allVoucherItemsData: allVoucherItems,
                                voucherData: voucher,
                                bankAccountsData: bankAccounts,
                              },
                            });
                            dispatch(getTripExpenses(item?.id));
                          }}
                        />
                      ))
                  ) : (
                    <Stack
                      justifyContent="center"
                      alignItems="center"
                      sx={{ marginTop: '20px' }}
                    >
                      No Data Found
                    </Stack>
                  )}
                </div>
              </TabPanel>
            </TabContext>
          ) : (
            <>
              <div className={css2.headertext}>
                {active === 'pending_claims'
                  ? 'Pending Claims'
                  : active === 'pending_payment'
                  ? 'Pending Payment'
                  : 'Advance Request'}
              </div>

              <div className={css.searchFilterContainer}>
                <Stack className={css.providersearchwrp}>
                  <img
                    src={searchicon}
                    alt="search icon"
                    className={css.searchicon}
                  />
                  <input
                    type="search"
                    placeholder="Search Employee"
                    className={css.searchinput}
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    ref={searchRef}
                  />
                </Stack>
                {/* <Button className={css.filterBtn}>
              <img className={css.image} src={filter} alt="Icon" />
              <span className={css.btnName}>Filter</span>
            </Button> */}
              </div>

              <div className={css.tripDetails}>
                {claims?.data?.filter((ele) =>
                  ele?.employee_name
                    ?.toLocaleLowerCase()
                    ?.includes(search?.toLocaleLowerCase()),
                )?.length > 0 ? (
                  claims?.data
                    ?.filter((ele) =>
                      ele?.employee_name
                        ?.toLocaleLowerCase()
                        ?.includes(search?.toLocaleLowerCase()),
                    )
                    ?.map((item) => (
                      <TripCard
                        type="pendingClaims"
                        description={
                          active === 'advance_claims'
                            ? item?.description || '-'
                            : item?.name || '-'
                        }
                        active={active}
                        amountData={`₹ ${IndianCurrencyNoSymbol.format(
                          item?.amount,
                        )}`}
                        date={moment(item?.date).format('YYYY-MM-DD')}
                        status={item?.status}
                        name={item?.employee_name || '-'}
                        id={item?.id}
                        selectedIds={selectedIds}
                        setSelectedItems={setSelectedItems}
                        selectedItems={selectedItems}
                        showCheckbox={
                          active === 'pending_payment' &&
                          item?.status !== 'paid' &&
                          item?.status !== 'partially_paid'
                        }
                        handleCheckbox={async (val) => {
                          if (expenseTab === 'expense')
                            await createVoucherItemsExpense(val);
                          else await createVoucherItemsTrip(val);
                        }}
                        toNavigate={async () => {
                          if (expenseTab === 'expense')
                            await createVoucherItemsExpense([item?.id]);
                          else await createVoucherItemsTrip([item?.id]);
                          if (active === 'advance_claims') {
                            dispatch(getOneClaim(item.id));
                            dispatch(
                              advancePaymentVoucher({ transaction_type: '' }),
                            );
                            // dispatch(
                            //   createUpdateAdvPayment({
                            //     type: 'post',
                            //     payload: {
                            //       advance_request_id: item?.id,
                            //       amount: item?.amount,
                            //       vendor_id: item?.employee_id,
                            //       entity_type: 'employee',
                            //     },
                            //   }),
                            // );
                            navigate('/reimbursement-trip-advance-request', {
                              state: {
                                action: 'update',
                                payment: true,
                                disabled: true,
                                dataValue: item,
                              },
                            });
                          } else {
                            navigate('/reimbursement-claim-review', {
                              state: {
                                item,
                                tab: active,
                                voucher,
                                bankAccounts,
                                allVoucherItems,
                              },
                            });
                          }
                        }}
                      />
                    ))
                ) : (
                  <Stack justifyContent="center" alignItems="center">
                    No Data Found
                  </Stack>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <SelectBottomSheet
        addNewSheet
        triggerComponent={<></>}
        open={expenseTab === 'expense' && drawer?.claimReview}
        onClose={async () => {
          if (expenseTab === 'expense')
            await createVoucherItemsExpense([selectedRow?.id]);
          else await createVoucherItemsTrip([selectedRow?.id]);
          handleDrawer('claimReview', false);
          dispatch(setOnClaim({}));
        }}
      >
        <ReimbursementClaimReview
          data={selectedRow}
          tab={active}
          voucherValues={voucher}
          bankAccountValues={bankAccounts}
          allVoucherItemsValues={allVoucherItems}
          handleDrawer={handleDrawer}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        addNewSheet
        triggerComponent={<></>}
        open={expenseTab === 'trip' && drawer?.claimReview}
        onClose={async () => {
          if (expenseTab === 'expense')
            await createVoucherItemsExpense([selectedRow?.id]);
          else await createVoucherItemsTrip([selectedRow?.id]);
          handleDrawer('claimReview', false);
        }}
      >
        <ReimbursementTripClaimReview
          data={selectedRow}
          tab={active}
          voucherValues={voucher}
          bankAccountValues={bankAccounts}
          allVoucherItemsValues={allVoucherItems}
          handleDrawer={handleDrawer}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        addNewSheet
        triggerComponent={<></>}
        open={drawer?.payAdvance}
        onClose={() => {
          handleDrawer('payAdvance', false);
          setAddTripManager(false);
        }}
      >
        {addTripManager ? (
          <AddTrip byManager setAddTripManager={setAddTripManager} type="new" />
        ) : (
          <PayTripAdvanceForm
            // tab={value}
            employeeList={employees?.filter(
              (item) => item?.user_id !== currentUserInfo?.id,
            )}
            setAddTripManager={setAddTripManager}
            action={advanceAction}
            onClose={() => handleDrawer('payAdvance', false)}
            // data={selectedRow}
          />
        )}
      </SelectBottomSheet>

      <SelectBottomSheet
        addNewSheet
        triggerComponent={<></>}
        open={drawer?.payAdvanceApprove}
        onClose={() => handleDrawer('payAdvanceApprove', false)}
      >
        <RequestTripAdvanceForm
          payment
          // employeeList={employees}
          active={active}
          disabled
          action="update"
          onClose={() => handleDrawer('payAdvanceApprove', false)}
          dataValue={selectedRow}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent={<></>}
        open={drawerState.proceedToPay}
        name="proceedToPay"
        onClose={() => setDrawerState((d) => ({ ...d, proceedToPay: false }))}
        addNewSheet
      >
        <>
          <ProceedToPay
            onClose={(res) => {
              setDrawerState((d) => ({ ...d, proceedToPay: false }));
              if (res === 'success') navigate('/payment-history');
            }}
            paymentVoucharId={voucher?.id}
            showVerifyPassword={[drawerState, setDrawerState]}
            bankAccounts={bankAccounts}
            paidAmount={
              allVoucherItems
                ?.map((a) => Number(a.amount) || 0)
                ?.reduce((a, b) => a + b, 0)
                ?.toFixed(2) || 0
            }
            payNow={{
              active: true,
              title: FormattedAmount(
                allVoucherItems
                  ?.map((a) => Number(a.amount) || 0)
                  ?.reduce((a, b) => a + b, 0)
                  ?.toFixed(2) || 0,
              ),
              subTitle: '',
            }}
            ShowTransForgPass={() => setTransacForgetPass(true)}
            payType={false}
            setMultiplePayments={setMultiplePayments}
            setPaymentsResponse={setPaymentsResponse}
          />
        </>
      </SelectBottomSheet>
      <SelectBottomSheet
        triggerComponent
        open={transacForgetPass}
        name="forgetPassword"
        hideClose
      >
        <ForgetPassword onClose={() => setTransacForgetPass(false)} />
      </SelectBottomSheet>
      <SelectBottomSheet
        triggerComponent={<></>}
        open={drawerState.filterDrawer}
        name="filterDrawer"
        onClose={() => setDrawerState((d) => ({ ...d, filterDrawer: false }))}
        addNewSheet
      >
        <>
          <div className={css.effortlessOptions}>
            <span className={css.filterHeader}>Filter by</span>
            <ul className={css.optionsWrapper}>
              {['Submitted', 'Declined'].map((e) => (
                <li className={css.items} aria-hidden="true">
                  <RadioGroup
                    value={sortValue}
                    onChange={(event) => {
                      setSortValue(event.target.value);
                    }}
                  >
                    <FormControlLabel
                      value={e}
                      control={<Radio style={{ color: '#F08B32' }} />}
                      label={<p className={css.filterlabel}>{e}</p>}
                    />
                  </RadioGroup>
                </li>
              ))}
            </ul>
            <Mui.Stack
              sx={{
                flexFlow: 'row nowrap',
                alignItems: 'center',
                justifyContent: 'space-around',
                margin: '18px 0px 0px',
              }}
            >
              <Mui.Button
                contained
                style={{
                  backgroundColor: '#F08B32',
                  color: '#fff',
                  // margin: '20px 25%',
                  width: 'auto',
                  borderRadius: 25,
                  padding: '8px 24px',
                }}
                onClick={() => {
                  if (expenseTab === 'expense')
                    dispatch(getClaims({ type: active, status: sortValue }));
                  if (active !== 'advance_claims' && expenseTab === 'trip')
                    dispatch(getTrips({ type: active, status: sortValue }));
                  setDrawerState((d) => ({ ...d, filterDrawer: false }));
                }}
              >
                Apply
              </Mui.Button>
              <Mui.Button
                contained
                style={{
                  backgroundColor: '#F08B32',
                  color: '#fff',
                  // margin: '20px 25%',
                  width: 'auto',
                  borderRadius: 25,
                  padding: '8px 24px',
                }}
                onClick={() => {
                  setSortValue('');
                  if (expenseTab === 'expense')
                    dispatch(getClaims({ type: active, status: '' }));
                  if (active !== 'advance_claims' && expenseTab === 'trip')
                    dispatch(getTrips({ type: active, status: '' }));
                  setDrawerState((d) => ({ ...d, filterDrawer: false }));
                }}
              >
                Clear
              </Mui.Button>
            </Mui.Stack>
          </div>
        </>
      </SelectBottomSheet>

      <Dialog
        open={drawerState?.paymentSuccess}
        // onClose={() => set((prev) => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
      >
        <>
          {multiplePayments === true && (
            <FinalPayment
              paymentsResponse={paymentsResponse}
              // setRetryPaymentVoucharId={setRetryPaymentVoucharId}
              paymentType="voucher_payment"
            />
          )}
          {multiplePayments === false && (
            <SuccessView
              title="Your Payment is Being Processed"
              description=""
              btnTitle="Visit Payments history"
              onClick={() => {
                navigate('/payment-history');
              }}
            />
          )}
        </>
      </Dialog>

      {havePermission && (
        <PermissionDialog onClose={() => setHavePermission(false)} />
      )}
    </>
  );
};

export default memo(ReimbursementApproval);
