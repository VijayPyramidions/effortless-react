import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Router from 'react-router-dom';

import InfiniteScroll from 'react-infinite-scroll-component';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
// import { MuiDatePicker } from '@components/DatePicker/DatePicker.jsx';
// import Input from '@components/Input/Input.jsx';
// import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
// import Checkbox from '@components/Checkbox/Checkbox.jsx';
// import * as Mui from '@mui/material';
// import SearchIcon from '@material-ui/icons/Search';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';

import {
  GetVendorEntityState,
  ClearSateVendorEntity,
} from '@action/Store/Reducers/General/GeneralState';
import {
  GetVendorBillDetailsState,
  ClearStateGetVendorBillDetails,
  DeleteVendorBillState,
  PatchVendorBillState,
  ClearStateBillAction,
  GetBillsListState,
  ClearStateGetBillsList,
} from '@action/Store/Reducers/Bills/BillsState';

import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';

import {
  Box,
  Button,
  Stack,
  Typography,
  Chip,
  Grid,
  Dialog,
  DialogContent,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import {
  MobileCardLoadingSkeleton,
  InvoiceLoadingSkeleton,
} from '@components/SkeletonLoad/SkeletonLoader';

import viewYourBills from '@assets/viewYourBills.png';
// import editYourBills from '@assets/editYourBills.png';

// import DownloadImg from '@assets/download.svg';
// import { SearchIcon2 } from '@assets/search.svg';
import deleteBin from '@assets/binRed.svg';
import { makeStyles, MenuItem, styled } from '@material-ui/core';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import * as themes from '@root/theme.scss';
import AppContext from '@root/AppContext.jsx';
// import RestApi, { METHOD } from '@services/RestApi.jsx';
import moment from 'moment';
import BillViewDialog from './components/BillViewDialog';

import {
  EntityFilter,
  DateFilter,
} from '../../components/MobileSheetFilters/SheetFilter';

// import {
//   CheckedIcon,
//   UncheckedIcon,
// } from '@core/PaymentView/MultiplePayments/VendorBillSelection';
// import CalendarIcon from '@mui/icons-material/CalendarToday';
// import Calender from '../InvoiceView/Calander';
import * as css from './BillsInQueue.scss';
import * as css2 from './BillsInDraft.scss';

const useStyles = makeStyles(() => ({
  chips: {
    background: '#FFF !important',
    flexDirection: 'row-reverse !important',
    justifyContent: 'space-between ',
    padding: '0 10px !important',
    border: '1.5px solid #E1E1E1 !important',
    borderRadius: '8px !important',
    cursor: 'pointer !important',
  },
  searchInput: {
    margin: '0 20px',
    padding: '5px 10px 0 0',
    '& .MuiTextField-root': {
      paddingLeft: '8px',
      marginBottom: '8px',
      border: '1px solid rgb(180 175 174)',
    },
    '& .MuiInput-root': {
      height: '56px !important',
    },
  },
  checkbox: {
    padding: 0,
    paddingTop: 4,
    '& .MuiSvgIcon-root': {
      fontSize: '2.4rem',
      fill: 'transparent',
    },
  },
  selectedchips: {
    minWidth: '80px',
    background: '#fdf1e6 !important',
    color: `${themes.colorPrimaryButton} !important`,
    borderColor: `${themes.colorPrimaryButton} !important`,
  },
}));

const sortOptions = [
  { id: 1, name: 'Recent payments', click: { order_by: 'date', order: 'asc' } },
  {
    id: 2,
    name: 'Bill amount Low to High',
    click: { order_by: 'amount', order: 'asc' },
  },
  {
    id: 3,
    name: 'Bill amount High to Low',
    click: { order_by: 'amount', order: 'desc' },
  },
  { id: 4, name: 'A-Z', click: { order_by: 'name', order: 'asc' } },
  { id: 5, name: 'Z-A', click: { order_by: 'name', order: 'desc' } },
];

// const downloadOptions = [
//   { id: 1, name: 'Microsoft Excel' },
//   { id: 2, name: 'PDF File' },
//   { id: 3, name: 'CSV File' },
// ];

// const initialState = {
//   vendors: [],
//   sort: '',
//   date: '',
//   order_by: '',
//   order: '',
// };

export const paymentStatusListWithBill = [
  { id: 'company_cash', label: 'Paid with Company Cash' },
  { id: 'paid_as_advance', label: 'Paid as Advance' },
  { id: 'to_pay', label: 'To Pay' },
  { id: 'company_card', label: 'Paid with Company Card' },
  { id: 'personal', label: 'Paid by' },
  { id: 'company_account', label: 'Paid with Company Account' },
];

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

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const BillsInQueue = () => {
  const {
    // organization,
    // enableLoading,
    // user,
    // changeSubView,
    // loading,
    userPermissions,
  } = useContext(AppContext);
  const classes = useStyles();
  const { state } = Router.useLocation();
  const device = localStorage.getItem('device_detect');
  const { vendorEntity } = useSelector((value) => value.General);
  const { billsListData, billsDataLoad, billsAction, VendorBillDetails } =
    useSelector((value) => value.Bills);

  // const [state, setState] = useState(initialState);
  const [vendorQuery, setVendorQuery] = useState();
  const [oneRow, setOneRow] = useState();
  const [assignedBills, setAssignedBills] = useState([]);
  // const [toDate, setToDate] = useState(null);
  // const [fromDate, setFromDate] = useState(null);
  // const [draft, setDraft] = useState(false);
  // const [selectedBill, setSelectedBill] = useState({});
  // const [webValue, setWebValue] = useState({
  //   fromDate: null,
  //   toDate: null,
  //   order_by: '',
  // });
  const [selectVendorList, setSelectVendorList] = React.useState([]);
  // const [query, setQuery] = React.useState();

  // const [drawer, setDrawer] = useState({
  //   date: false,
  //   vendor: false,
  //   sort: false,
  //   download: false,
  //   yourBill: false,
  //   startDate: false,
  //   endDate: false,
  // });

  // const [search, setSearch] = React.useState('');
  // const [filterBillsArray, setFilterBillsArray] = React.useState([]);
  const navigate = Router.useNavigate();
  const dispatch = useDispatch();

  const [userRoles, setUserRoles] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });
  const [hasMoreItems, sethasMoreItems] = React.useState(true);
  // const [page, setPage] = React.useState({});

  const themesMui = useTheme();
  const desktopView = useMediaQuery(themesMui.breakpoints.up('sm'));

  const [BottomSheet, setBottomSheet] = useState(false);
  const [tableDetails, setTableDetails] = useState({});
  const [valueOptionsFilter, setValueOptionsFilter] = useState([]);
  const [dialogDelete, setDialogDelete] = useState(false);
  const [viewBill, setViewBill] = useState(false);
  const [file, setFile] = useState('');
  const [searchVendorList, setSearchVendorList] = useState();
  const [checkedVendorList, setCheckedVendorList] = useState([]);
  const [anchorEl, setAnchorEl] = useState({
    vendor: null,
    date: null,
    sort: null,
  });

  const [sortData, setSortData] = useState({
    fromDate: null,
    toDate: null,
    order_by: '',
    order: '',
  });

  const Puller = styled(Box)(() => ({
    width: '50px',
    height: 6,
    backgroundColor: '#C4C4C4',
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
  }));

  const assignedBillsColumn = [
    {
      field: 'assign_date',
      headerName: 'Assign Date',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) =>
        params.row?.assign_date
          ? moment(params.row?.assign_date).format('DD-MM-YYYY')
          : '-',
      width: 110,
    },
    {
      field: 'vendor',
      headerName: 'Vendor Name',
      valueGetter: (params) => params.row.vendor?.name,
      renderCell: (params) => {
        return (
          <Typography className="MuiDataGrid-cell-vendor">
            {params?.row?.vendor?.name || '-'}
          </Typography>
        );
      },
      sortable: true,
      flex: 1,
      type: 'singleSelect',
      valueOptions: valueOptionsFilter,
    },
    {
      field: 'expense_account',
      headerName: 'Expenses',
      valueGetter: (params) => params.row.expense_account?.name,
      renderCell: (params) => {
        return (
          <Typography className="MuiDataGrid-cell-vendor">
            {params?.row?.expense_account?.name || '-'}
          </Typography>
        );
      },
      sortable: true,
      flex: 1,
    },
    {
      field: 'payment_mode',
      headerName: 'Payment Status',
      renderCell: (params) => {
        return (
          <>
            {params?.row?.payment_mode === 'personal'
              ? `${
                  paymentStatusListWithBill?.find(
                    (v) => v.id === params?.row?.payment_mode,
                  )?.label
                } ${params?.row?.payer_details?.name || ''}` ||
                params?.row?.payment_mode ||
                '-'
              : paymentStatusListWithBill?.find(
                  (v) => v.id === params?.row?.payment_mode,
                )?.label ||
                params?.row?.payment_mode ||
                '-'}
          </>
        );
      },
      sortable: false,
      width: 220,
      type: 'singleSelect',
      valueOptions: paymentStatusListWithBill?.map((val) => ({
        value: val?.id,
        label: val?.label,
      })),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      headerClassName: 'left-align--header',
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      align: 'right',
      width: 160,
    },
  ];

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
    }
  }, [userPermissions]);

  React.useEffect(() => {
    if (Object.keys(userRoles?.['Bill Booking'] || {})?.length > 0) {
      if (!userRoles?.['Bill Booking']?.view_bills) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/bill');
            setHavePermission({ open: false });
          },
        });
      }
    }
  }, [userRoles?.['Bill Booking']]);

  // React.useEffect(() => {
  //   const filterBills = search
  //     ? yourBills?.filter((val) =>
  //         val?.vendor?.name
  //           ?.trim()
  //           ?.toLowerCase()
  //           ?.includes(search.trim().toLowerCase()),
  //       )
  //     : yourBills;
  //   setFilterBillsArray(filterBills);
  // }, [search, yourBills]);

  // const handleStartDate = (val) => {
  //   if (desktopView) {
  //     setWebValue((prev) => ({ ...prev, fromDate: new Date(val) }));
  //   } else {
  //     setFromDate(new Date(val));
  //   }
  //   setDrawer((d) => ({ ...d, startDate: false }));
  // };
  // const handleEndDate = (val) => {
  //   if (desktopView) {
  //     setWebValue((prev) => ({ ...prev, toDate: new Date(val) }));
  //   } else {
  //     setToDate(new Date(val));
  //   }
  //   setDrawer((d) => ({ ...d, endDate: false }));
  // };

  // const onTriggerDrawer = (name) => {
  //   setDrawer((d) => ({ ...d, [name]: true }));
  // };

  // const openRecordAnExpense = (item) => {
  //   if (item.status === 'draft') {
  //     changeSubView('uploadYourBillView-haveBill', item);
  //   } else {
  //     onTriggerDrawer('yourBill');
  //     setSelectedBill(item);
  //   }
  // };

  // const handleBottomSheet = (name, data) => {
  //   // setDrawer((d) => ({ ...d, [name]: false }));
  //   if (data) {
  //     setState((s) => ({ ...s, [name]: data }));
  //   }
  // };

  // const handleValueChange = (v, checked) => {
  //   if (checked) {
  //     setSelectVendorList((prev) => [...prev, v]);
  //   } else {
  //     const checkedList = selectVendorList?.filter((item) => item !== v);
  //     setSelectVendorList(checkedList);
  //   }
  // };

  const getVendors = async (searchVal, entire) => {
    // enableLoading(true);

    // RestApi(
    //   `organizations/${organization.orgId}/entities?type[]=vendor&search=${
    //     searchVal || ''
    //   }`,
    //   {
    //     method: METHOD.GET,
    //     headers: {
    //       Authorization: `Bearer ${user.activeToken}`,
    //     },
    //   },
    // )
    //   .then((res) => {
    //     // enableLoading(false);
    //     if (res && !res.error) {
    //       // setVendorList(res.data);
    //       setState({ ...state, vendors: res.data });
    //       if (entire) {
    //         setSelectVendorList(res?.data?.map((val) => val?.id));
    //       }
    //     }
    //   })
    //   .catch(() => {
    //     // enableLoading(false);
    //   });
    dispatch(
      GetVendorEntityState({
        allParties: false,
        pageNum: 1,
        searchText: searchVal || '',
        location: false,
        entire,
      }),
    );
  };
  // const titles = [
  //   { name: 'Name' },
  //   { name: 'Bill Number' },
  //   { name: 'Status', align: 'center' },
  //   { name: 'Date' },
  //   { name: 'Payment Amount', align: 'right' },
  // ];

  const queryParam = new URLSearchParams(window.location.search).get('id');

  const getAssignedBills = (page_num) => {
    let filter = '';

    if (selectVendorList && selectVendorList.length === 1) {
      filter += `&vendor_id=${selectVendorList}`;
    } else if (selectVendorList && selectVendorList.length > 1) {
      selectVendorList.forEach((v) => {
        filter += `&vendor_ids[]=${v}&`;
      });
    }

    if (sortData?.toDate) {
      const toDataStr = moment(sortData?.toDate, 'YYYY-MM-DD').format(
        'YYYY-MM-DD',
      );
      filter += `&end_date=${toDataStr}`;
    }

    if (sortData?.fromDate) {
      const fromDataStr = moment(sortData?.fromDate, 'YYYY-MM-DD').format(
        'YYYY-MM-DD',
      );
      filter += `&start_date=${fromDataStr}`;
    }

    if (sortData?.order_by && sortData?.order) {
      filter += `&order_by=${sortData?.order_by}&order=${sortData?.order}`;
    }

    // RestApi(
    //   `organizations/${organization.orgId}/vendor_bills?page=${
    //     page_num || 1
    //   }&source_type=in_queue&${filter}`,
    //   {
    //     method: METHOD.GET,
    //     headers: {
    //       Authorization: `Bearer ${user.activeToken}`,
    //     },
    //   },
    // )
    //   .then((res) => {
    //     enableLoading(false);
    //     if (res && !res.error) {
    //       res.data.map((a) => Object.assign(a));
    //       setPage({ currentPage: res?.page, totalPage: res?.pages });
    //       if (res?.page === 1) {
    //         sethasMoreItems(true);
    //         setYourBills(res.data);
    //         const myDiv = document.getElementById('tableContainerBillsInQueue');
    //         // myDiv.innerHTML = variableLongText;
    //         myDiv.scrollTop = 0;
    //       } else {
    //         setYourBills([...yourBills, ...res?.data]);
    //       }
    //     }
    //   })
    //   .catch(() => {
    //     enableLoading(false);
    //   });

    dispatch(
      GetBillsListState({
        pageNum: page_num || 1,
        filter: `&source_type=in_queue${filter}`,
      }),
    );
  };

  // useEffect(() => {
  //   getYourBills();
  // }, [selectVendorList, toDate, fromDate, state?.order_by, state?.order]);

  // const onInputChange = (e) => {
  //   const { value } = e.target;
  //   setVendorQuery(value);
  //   if (value?.length === 0) {
  //     getVendors();
  //   }
  //   if (value?.length > 2) {
  //     getVendors(value);
  //   }
  // };

  const onSortChange = (v) => {
    setSortData((s) => ({
      ...s,
      order_by: v?.click?.order_by,
      order: v?.click?.order,
      orderName: v?.name,
    }));
    setAnchorEl((prev) => ({
      ...prev,
      sort: null,
    }));
  };

  React.useEffect(() => {
    if (selectVendorList?.length === 0) {
      setVendorQuery('');
      getVendors();
    }
  }, [selectVendorList]);

  React.useEffect(() => {
    if (state?.search_text) {
      setVendorQuery(state?.search_text);
      setTimeout(() => {
        getVendors(state?.search_text, true);
      }, 1000);
    }
  }, [state?.search_text]);

  // const [anchorElCalendar, setAnchorElCalendar] = React.useState(null);

  // const [anchorElStartDate, setAnchorElStartDate] = React.useState(null);
  // const [anchorElEndDate, setAnchorElEndDate] = React.useState(null);

  // const [anchorElVendor, setAnchorElVendor] = React.useState(null);
  // const handleClick = (event, component) => {
  //   if (component === 'calendar') {
  //     setAnchorElCalendar(event.currentTarget);
  //   }
  //   //  else if (component === 'startDate') {
  //   //   setAnchorElStartDate(event.currentTarget);
  //   // } else if (component === 'endDate') {
  //   //   setAnchorElEndDate(event.currentTarget);
  //   // }
  //   else {
  //     setAnchorEl(event.currentTarget);
  //   }
  // };
  // const open = Boolean(anchorEl);
  // const openVendor = Boolean(anchorElVendor);
  // const openCalendar = Boolean(anchorElCalendar);
  // const openCalendarStart = Boolean(anchorElStartDate);
  // const openCalendarEnd = Boolean(anchorElEndDate);

  const loadMore = () => {
    if (billsListData?.pages > 1) {
      getAssignedBills(billsListData?.page + 1);
    }
  };

  const deleteBill = (id) => {
    setDialogDelete(false);
    dispatch(DeleteVendorBillState({ bill_id: id }));
  };

  const viewSingleBill = (id) => {
    dispatch(
      GetVendorBillDetailsState({
        bill_id: id,
        action: 'forViewVendorBill',
      }),
    );
  };

  const editbill = (id) => {
    if (!userRoles?.['Bill Booking']?.edit_bills) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    setOneRow(id);
    dispatch(PatchVendorBillState({ bill_id: id }));
  };

  const DeleteUploadBill = () => {
    if (!userRoles?.['Bill Booking']?.delete_bills) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    setDialogDelete(true);
  };

  const handleRowClick = (param) => {
    setBottomSheet(true);
    setTableDetails(param?.row);
  };

  const ViewUploadBill = (url) => {
    setViewBill(true);
    setFile(url);
  };

  const handleValueChange = (v) => {
    const checkedList = selectVendorList?.filter((item) => item !== v);
    setSelectVendorList(checkedList);
    if (selectVendorList?.length === 1) {
      setAssignedBills([]);
    }
  };

  useEffect(() => {
    if (billsAction === 'vendorBillDeleted') {
      setAssignedBills([]);
      setBottomSheet(false);
      dispatch(
        GetBillsListState({
          pageNum: 1,
          filter: `&source_type=in_queue`,
        }),
      );
      dispatch(ClearStateBillAction());
    }
    if (billsAction === 'InQueueUpdated') {
      dispatch(GetVendorBillDetailsState({ bill_id: oneRow }));
    }
  }, [billsAction]);

  useEffect(() => {
    if (Object.keys(VendorBillDetails || {})?.length > 0) {
      if (billsAction === 'vendorBillReterived') {
        dispatch(ClearStateBillAction());
        navigate('/bill-upload', {
          state: {
            selected: VendorBillDetails,
          },
        });
      }
      if (billsAction === 'forViewVendorBill') {
        dispatch(ClearStateBillAction());
        if (VendorBillDetails?.file_url) {
          ViewUploadBill(VendorBillDetails?.file_url);
        } else {
          setBottomSheet(true);
          setTableDetails(VendorBillDetails);
        }
      }
    }
  }, [JSON.stringify(VendorBillDetails), billsAction]);

  // useEffect(() => {
  //   if (page?.currentPage > 1 && page.currentPage <= page.totalPage) {
  //     getAssignedBills(page?.currentPage);
  //   }
  // }, [page?.currentPage]);

  useEffect(() => {
    if (billsListData?.data) {
      if (billsListData?.page === 1) {
        setAssignedBills(billsListData?.data);
      } else {
        setAssignedBills((prev) => [...prev, ...billsListData?.data]);
      }
      if (
        billsListData?.pages > 1 &&
        billsListData?.page < billsListData?.pages &&
        desktopView
      ) {
        getAssignedBills(billsListData?.page + 1);
      }
      if (!desktopView) {
        sethasMoreItems(billsListData?.page !== billsListData?.pages);
      }
    }
  }, [JSON.stringify(billsListData)]);

  useEffect(() => {
    if (
      (state?.search_text && selectVendorList?.length > 0) ||
      state?.search_text === undefined ||
      device === 'desktop'
    ) {
      getAssignedBills();
    }
    return () => {};
  }, [sortData?.order, sortData?.order_by, selectVendorList, dispatch]);

  useEffect(() => {
    if (sortData?.fromDate && sortData?.toDate && device === 'mobile') {
      getAssignedBills();
    }
    if (
      sortData?.fromDate === '' &&
      sortData?.toDate === '' &&
      device === 'mobile'
    ) {
      getAssignedBills();
    }
  }, [sortData?.toDate, sortData?.fromDate]);

  useEffect(() => {
    if (
      device === 'mobile' &&
      selectVendorList !== undefined &&
      state?.search_text?.length > 0 &&
      selectVendorList?.length === 0
    ) {
      setVendorQuery('');
      getAssignedBills();
      navigate('/bill-queue', { replace: true });
    }
  }, [device, selectVendorList]);

  useEffect(() => {
    if (state?.id || queryParam) {
      viewSingleBill(state?.id || queryParam, 'show');
    }
  }, [state?.id]);

  useEffect(() => {
    if (
      device === 'mobile' &&
      selectVendorList !== undefined &&
      state?.search_text?.length > 0 &&
      selectVendorList?.length === 0
    ) {
      navigate('/bill-queue', { replace: true });
    }
  }, [device, selectVendorList]);

  useEffect(() => {
    if (desktopView) {
      const temp = Array.from(
        new Set(assignedBills?.map((ele) => ele?.vendor?.name)),
      )?.map((vendorName) => ({ value: vendorName, label: vendorName }));
      setValueOptionsFilter(temp);
    }
  }, [device, assignedBills]);

  useEffect(() => {
    return () => {
      dispatch(ClearStateGetVendorBillDetails());
      dispatch(ClearStateGetBillsList());
      dispatch(ClearSateVendorEntity());
    };
  }, []);

  useEffect(() => {
    if (vendorEntity?.data) {
      setSearchVendorList(vendorEntity.data);
      if (
        state?.search_text &&
        !desktopView &&
        selectVendorList === undefined
      ) {
        setSelectVendorList(vendorEntity?.data?.map((val) => val?.id));
      }
    }
  }, [JSON.stringify(vendorEntity || {}), state]);

  useEffect(() => {
    if (selectVendorList?.length > 0) {
      const checkedList = searchVendorList.filter(
        (ele) => selectVendorList.indexOf(ele.id) !== -1,
      );
      setCheckedVendorList(checkedList);
    } else if (selectVendorList?.length === 0) {
      setCheckedVendorList(selectVendorList);
    }
  }, [selectVendorList]);

  return (
    // <div className={css.container}>
    //   <div
    //     className={
    //       !desktopView
    //         ? css.billsInQueueContainer
    //         : css.billsInQueueContainer2
    //     }
    //   >
    //     <div className={css.headerMainContainer}>
    //       <div className={css.headerContainer}>
    //         <div className={css.headerLabel}>Bills In Queue</div>
    //         <span className={css.headerUnderline} />
    //       </div>
    //       {/* <div className={css.headerContainer}>
    //         <div className={css.draftHeader} onClick={() => setDraft(true)}>
    //           Drafts
    //         </div>
    //       </div> */}
    //     </div>
    //     {!desktopView ? (
    //       <div className={css.searchContainer}>
    //         <div
    //           className={classes.chips}
    //           onClick={() => onTriggerDrawer('date')}
    //         >
    //           <Chip
    //             label="Date"
    //             icon={<KeyboardArrowDown />}
    //             className={css.chipLabel}
    //           />
    //         </div>
    //         <div
    //           className={classes.chips}
    //           onClick={() => onTriggerDrawer('vendor')}
    //         >
    //           <Chip
    //             label="Vendor"
    //             icon={<KeyboardArrowDown />}
    //             className={css.chipLabel}
    //           />
    //         </div>
    //         <div
    //           className={classes.chips}
    //           onClick={() => onTriggerDrawer('sort')}
    //         >
    //           <Chip
    //             label="Sort"
    //             icon={<KeyboardArrowDown />}
    //             className={css.chipLabel}
    //           />
    //         </div>

    //         {/* <div
    //         onClick={() => onTriggerDrawer('download')}
    //         className={css.downloadImg}
    //       >
    //         <img src={DownloadImg} alt="Well Done" />
    //       </div> */}
    //       </div>
    //     ) : (
    //       <>
    //         <Mui.Grid className={css.transhead}>Transactions</Mui.Grid>
    //         <div className={css.searchContainer}>
    //           <Mui.Stack direction="row">
    //             <div
    //               className={css.searchFilter}
    //               style={{
    //                 display: 'flex',
    //                 alignItems: 'center',
    //                 boxShadow: '0px 0px 40px rgba(48, 73, 191, 0.05)',
    //                 borderRadius: '16px',
    //                 backgroundColor: 'white',
    //                 height: '34px',
    //                 width: '69%',
    //               }}
    //             >
    //               <SearchIcon style={{ color: '#af9d9d' }} />{' '}
    //               <input
    //                 placeholder="Search for"
    //                 value={search}
    //                 onChange={(e) => setSearch(e.target.value)}
    //                 className={css.textFieldFocus}
    //                 style={{
    //                   border: 'none',
    //                   overflow: 'auto',
    //                   fontSize: '12px',
    //                 }}
    //               />
    //             </div>
    //             <div
    //               className={classes.chips}
    //               onClick={(e) => handleClick(e, 'calendar')}
    //             >
    //               <Chip
    //                 label="Date"
    //                 icon={<KeyboardArrowDown />}
    //                 className={css.chipLabel2}
    //               />
    //             </div>
    //             <div
    //               className={classes.chips}
    //               onClick={(event) => setAnchorElVendor(event.currentTarget)}
    //             >
    //               <Chip
    //                 label="Vendor"
    //                 icon={<KeyboardArrowDown />}
    //                 className={css.chipLabel2}
    //               />
    //             </div>
    //           </Mui.Stack>
    //           {(selectVendorList.length > 0 ||
    //             state.sort ||
    //             (toDate && fromDate) ||
    //             draft) && (
    //             <div
    //               className={
    //                 !desktopView
    //                   ? css.selectedOptions
    //                   : css.selectedOptions2
    //               }
    //             >
    //               {state.sort && (
    //                 <Chip
    //                   className={classes.selectedchips}
    //                   label={state.sort.name}
    //                   variant="outlined"
    //                   onDelete={() => {
    //                     setState({
    //                       ...state,
    //                       sort: '',
    //                       order_by: '',
    //                       order: '',
    //                     });
    //                     setWebValue({
    //                       ...webValue,
    //                       order_by: null,
    //                     });
    //                   }}
    //                 />
    //               )}
    //               {toDate && fromDate && (
    //                 <Chip
    //                   className={classes.selectedchips}
    //                   label={`${moment(fromDate, 'YYYY-MM-DD').format(
    //                     'MMM DD',
    //                   )}-${moment(toDate, 'YYYY-MM-DD').format(
    //                     'MMM DD, YYYY',
    //                   )}`}
    //                   variant="outlined"
    //                   onDelete={() => {
    //                     setToDate(null);
    //                     setFromDate(null);
    //                   }}
    //                 />
    //               )}
    //               {draft && (
    //                 <Chip
    //                   className={classes.selectedchips}
    //                   label="Draft"
    //                   variant="outlined"
    //                   onDelete={() => {
    //                     setDraft(false);
    //                   }}
    //                 />
    //               )}
    //               {selectVendorList &&
    //                 selectVendorList.map((a) => {
    //                   return (
    //                     <Chip
    //                       className={classes.selectedchips}
    //                       label={
    //                         state?.vendors?.find((val) => val?.id === a)
    //                           ?.name || '-'
    //                       }
    //                       key={a}
    //                       variant="outlined"
    //                       onDelete={() => {
    //                         handleValueChange(a, false);
    //                       }}
    //                     />
    //                   );
    //                 })}
    //             </div>
    //           )}
    //           <div
    //             className={classes.chips}
    //             onClick={(e) => {
    //               onTriggerDrawer('sort');
    //               handleClick(e);
    //             }}
    //           >
    //             <Chip
    //               label="SortBy   "
    //               icon={<KeyboardArrowDown />}
    //               className={css.chipLabel2}
    //             />
    //           </div>
    //         </div>
    //       </>
    //     )}
    //     {!desktopView &&
    //       (selectVendorList?.length > 0 ||
    //         state.sort ||
    //         (toDate && fromDate) ||
    //         draft) && (
    //         <div
    //           className={
    //             !desktopView
    //               ? css.selectedOptions
    //               : css.selectedOptions2
    //           }
    //         >
    //           {state.sort && (
    //             <Chip
    //               className={classes.selectedchips}
    //               label={state.sort.name}
    //               variant="outlined"
    //               onDelete={() => {
    //                 setState({ ...state, sort: '', order_by: '', order: '' });
    //               }}
    //             />
    //           )}
    //           {toDate && fromDate && (
    //             <Chip
    //               className={classes.selectedchips}
    //               label={`${moment(fromDate, 'YYYY-MM-DD').format(
    //                 'MMM DD',
    //               )}-${moment(toDate, 'YYYY-MM-DD').format('MMM DD, YYYY')}`}
    //               variant="outlined"
    //               onDelete={() => {
    //                 setToDate(null);
    //                 setFromDate(null);
    //               }}
    //             />
    //           )}
    //           {draft && (
    //             <Chip
    //               className={classes.selectedchips}
    //               label="Draft"
    //               variant="outlined"
    //               onDelete={() => {
    //                 setDraft(false);
    //               }}
    //             />
    //           )}
    //           {selectVendorList &&
    //             selectVendorList?.map((a) => {
    //               return (
    //                 <Chip
    //                   className={classes.selectedchips}
    //                   label={
    //                     state?.vendors?.find((val) => val?.id === a)?.name ||
    //                     '-'
    //                   }
    //                   key={a}
    //                   variant="outlined"
    //                   onDelete={() => {
    //                     handleValueChange(a, false);
    //                   }}
    //                 />
    //               );
    //             })}
    //         </div>
    //       )}
    //   </div>
    //   <div className={css.billsInQueueInfoContainer}>
    //     {!desktopView ? (
    //       <>
    //         {!loading && filterBillsArray?.length === 0 && (
    //           <Mui.Typography align="center">
    //             No bills available in Queue
    //           </Mui.Typography>
    //         )}
    //         {loading && (
    //           <Mui.Typography align="center">
    //             Data is being fetched...
    //           </Mui.Typography>
    //         )}
    //         <InfiniteScroll
    //           dataLength={
    //             filterBillsArray.filter((y) =>
    //               draft ? y.status === 'draft' : true,
    //             )?.length
    //           }
    //           next={loadMore}
    //           hasMore={hasMoreItems}
    //           scrollableTarget="tableContainerBillsInQueue"
    //         >
    //           <div
    //             style={{
    //               maxHeight:
    //                 selectVendorList?.length > 0 ||
    //                 (fromDate && toDate) ||
    //                 (state?.order_by && state?.order)
    //                   ? 'calc(100vh - 285px)'
    //                   : 'calc(100vh - 230px)',
    //               overflow: 'auto',
    //             }}
    //             id="tableContainerBillsInQueue"
    //           >
    //             {filterBillsArray?.length > 0 &&
    //               filterBillsArray
    //                 .filter((y) => (draft ? y.status === 'draft' : true))
    //                 .map((item) => {
    //                   return (
    //                     <div
    //                       className={css.main}
    //                       onClick={() => {
    //                         // onTriggerDrawer('yourBill');
    //                         // setSelectedBill(item);
    //                         openRecordAnExpense(item);
    //                       }}
    //                     >
    //                       <div className={css.infoItem}>
    //                         <div className={css.infoTitle}>
    //                           {(item.vendor &&
    //                             item.vendor.name?.toLowerCase()) ||
    //                             '-'}
    //                         </div>
    //                         {item.status === 'draft' && (
    //                           <div className={css.draftLabel}>
    //                             {item.status}
    //                           </div>
    //                         )}
    //                       </div>
    //                       <div className={css.infoItem}>
    //                         <p className={css.key}>Bill Number</p>
    //                         <p className={css.value}>{item.document_number}</p>
    //                       </div>
    //                       <div className={css.infoItem}>
    //                         <p className={css.key}>Payment Amount</p>
    //                         <p className={css.value}>
    //                           {FormattedAmount(item?.amount)}
    //                         </p>
    //                       </div>
    //                     </div>
    //                   );
    //                 })}
    //           </div>
    //         </InfiniteScroll>
    //       </>
    //     ) : (
    //       <>
    //         {filterBillsArray?.length > 0 && (
    //           <InfiniteScroll
    //             dataLength={
    //               filterBillsArray.filter((y) =>
    //                 draft ? y.status === 'draft' : true,
    //               )?.length
    //             }
    //             next={loadMore}
    //             hasMore={hasMoreItems}
    //             scrollableTarget="tableContainerBillsInQueue"
    //           >
    //             <Mui.TableContainer
    //               sx={{
    //                 borderRadius: 5,
    //                 // minHeight: 600,
    //                 maxHeight: '59vh',
    //               }}
    //               id="tableContainerBillsInQueue"
    //             >
    //               <Mui.Table
    //                 stickyHeader
    //                 size="medium"
    //                 style={{ background: '#ffff' }}
    //               >
    //                 <Mui.TableHead
    //                   sx={{
    //                     bgcolor: '#0000',
    //                     fontSize: '13px',
    //                     borderColor: (theme) => theme.palette.grey[100],
    //                   }}
    //                 >
    //                   {/* <Mui.TableCell>
    //                 <Mui.Typography
    //                   noWrap
    //                   variant="body2"
    //                   color="text.secondary"
    //                 >
    //                   {' '}
    //                 </Mui.Typography>
    //               </Mui.TableCell> */}
    //                   {titles?.map((title) => (
    //                     <Mui.TableCell align={title?.align || 'left'}>
    //                       <Mui.Typography noWrap className={css.tableHead}>
    //                         {title?.name}
    //                       </Mui.Typography>
    //                     </Mui.TableCell>
    //                   ))}
    //                 </Mui.TableHead>

    //                 {filterBillsArray.length > 0 &&
    //                   filterBillsArray
    //                     .filter((y) => (draft ? y.status === 'draft' : true))
    //                     .map((item) => {
    //                       return (
    //                         <Mui.TableBody>
    //                           {/* {customerData?.map((value) => ( */}
    //                           <Mui.TableRow
    //                             sx={{
    //                               borderColor: (theme) =>
    //                                 theme.palette.grey[100],
    //                             }}
    //                           >
    //                             <>
    //                               {/* <Mui.TableCell >
    //                         <Mui.Typography noWrap variant="body2">
    //                           <Mui.Avatar>
    //                             s
    //                           </Mui.Avatar>{' '}
    //                         </Mui.Typography>
    //                       </Mui.TableCell> */}
    //                               <Mui.TableCell className={css.tableCell}>
    //                                 <Mui.Typography
    //                                   noWrap
    //                                   variant="body2"
    //                                   className={css.tableFont}
    //                                 >
    //                                   {(item?.vendor &&
    //                                     item?.vendor?.name?.toLowerCase()) ||
    //                                     '-'}
    //                                 </Mui.Typography>
    //                                 {/* <Mui.TableCell> */}
    //                                 <Mui.Typography
    //                                   noWrap
    //                                   variant="body2"
    //                                   className={css.tableFontSm}
    //                                 >
    //                                   {item?.payment_mode === 'personal'
    //                                     ? `${
    //                                         paymentStatusListWithBill?.find(
    //                                           (v) =>
    //                                             v.id === item?.payment_mode,
    //                                         )?.label
    //                                       } ${
    //                                         item?.payer_details?.name || ''
    //                                       }` ||
    //                                       item?.payment_mode ||
    //                                       '-'
    //                                     : paymentStatusListWithBill?.find(
    //                                         (v) => v.id === item?.payment_mode,
    //                                       )?.label ||
    //                                       item?.payment_mode ||
    //                                       '-'}
    //                                 </Mui.Typography>
    //                                 {/* </Mui.TableCell> */}
    //                               </Mui.TableCell>
    //                               {/* <Mui.TableCell>
    //                             <Mui.Typography noWrap variant="body2">
    //                               {item.name}
    //                             </Mui.Typography>
    //                           </Mui.TableCell> */}
    //                               <Mui.TableCell className={css.tableCell}>
    //                                 <Mui.Typography
    //                                   noWrap
    //                                   variant="body2"
    //                                   className={css.tableBillNumber}
    //                                 >
    //                                   {item?.document_number}
    //                                 </Mui.Typography>
    //                               </Mui.TableCell>
    //                               <Mui.TableCell className={css.tableCell}>
    //                                 <Mui.Typography
    //                                   noWrap
    //                                   variant="body2"
    //                                   className={css.tableStatus}
    //                                 >
    //                                   {item?.status}
    //                                 </Mui.Typography>
    //                               </Mui.TableCell>

    //                               <Mui.TableCell className={css.tableCell}>
    //                                 <Mui.Typography
    //                                   noWrap
    //                                   variant="body2"
    //                                   className={css.tableDate}
    //                                 >
    //                                   {item?.assign_date
    //                                     ? moment(item?.assign_date).format(
    //                                         'DD-MM-YYYY',
    //                                       )
    //                                     : '-'}
    //                                 </Mui.Typography>
    //                               </Mui.TableCell>
    //                               <Mui.TableCell className={css.tableCell}>
    //                                 <Mui.Typography
    //                                   noWrap
    //                                   variant="body2"
    //                                   className={css.tableAmount}
    //                                   align="right"
    //                                 >
    //                                   {FormattedAmount(item?.amount)}
    //                                 </Mui.Typography>
    //                               </Mui.TableCell>
    //                             </>
    //                           </Mui.TableRow>
    //                           {/* ))} */}
    //                         </Mui.TableBody>
    //                       );
    //                     })}
    //               </Mui.Table>
    //             </Mui.TableContainer>
    //           </InfiniteScroll>
    //         )}
    //         {!loading && filterBillsArray?.length === 0 && (
    //           <Mui.Typography align="center">
    //             No bills available in Queue
    //           </Mui.Typography>
    //         )}
    //         {loading && (
    //           <Mui.Typography align="center">
    //             Data is being fetched...
    //           </Mui.Typography>
    //         )}
    //       </>
    //     )}
    //   </div>
    //   {!desktopView ? (
    //     <SelectBottomSheet
    //       triggerComponent
    //       open={drawer.date}
    //       name="date"
    //       onClose={handleBottomSheet}
    //       addNewSheet
    //     >
    //       <div style={{ padding: '15px' }}>
    //         <span>Select the start and end date to filter</span>
    //         <hr className={css.DividerFilter} />
    //       </div>
    //       <div className={css.dateWrapper}>
    //         {/* <MuiDatePicker
    //         selectedDate={fromDate}
    //         label="Start Date"
    //         onChange={(m) => setFromDate(m.format('YYYY-MM-DD'))}
    //       /> */}
    //         <div
    //           style={{
    //             border: '1px solid #A0A4AF',
    //             borderRadius: '10px',
    //             width: '90%',
    //             padding: '5px',
    //             margin: '10px',
    //           }}
    //         >
    //           <div
    //             style={{
    //               fontSize: '11px',
    //               fontStyle: 'light',
    //               color: '#283049',
    //             }}
    //           >
    //             Start Date
    //           </div>

    //           <div
    //             style={{
    //               marginLeft: '5px',
    //               marginTop: '5px',
    //               fontSize: '14px',
    //               fontStyle: 'bold',
    //               color: '#283049',
    //               display: 'flex',
    //               justifyContent: 'space-around',
    //               alignItems: 'center',
    //               margin: '5px',
    //             }}
    //           >
    //             <input
    //               type="text"
    //               value={
    //                 fromDate === null
    //                   ? 'dd-mm-yy'
    //                   : moment(fromDate).format('DD-MM-YYYY')
    //               }
    //               style={{
    //                 pointerEvents: 'none',
    //                 width: '70%',
    //                 border: 'none',
    //               }}
    //             />

    //             <SelectBottomSheet
    //               name="startDate"
    //               addNewSheet
    //               triggerComponent={
    //                 <CalendarIcon
    //                   style={{ width: 20, color: '#949494' }}
    //                   onClick={() => {
    //                     onTriggerDrawer('startDate');
    //                   }}
    //                 />
    //               }
    //               open={drawer.startDate}
    //               // value={taxValue}

    //               onTrigger={onTriggerDrawer}
    //               onClose={() => {
    //                 setDrawer((d) => ({ ...d, startDate: false }));
    //               }}

    //               // maxHeight="45vh"
    //             >
    //               <div style={{ padding: '15px' }}>
    //                 <span>Start Date</span>
    //                 <hr className={css.DividerFilter} />
    //               </div>
    //               <Calender
    //                 head="Select Start Date"
    //                 button="Select"
    //                 handleDate={handleStartDate}
    //               />
    //             </SelectBottomSheet>
    //           </div>
    //         </div>
    //       </div>
    //       <div className={css.dateWrapper}>
    //         {/* <MuiDatePicker
    //         selectedDate={toDate}
    //         label="End Date"
    //         onChange={(m) => setToDate(m.format('YYYY-MM-DD'))}
    //       /> */}
    //         <div
    //           style={{
    //             border: '1px solid #A0A4AF',
    //             borderRadius: '10px',
    //             width: '90%',
    //             padding: '5px',
    //             margin: '10px',
    //           }}
    //         >
    //           <div
    //             style={{
    //               fontSize: '11px',
    //               fontStyle: 'light',
    //               color: '#283049',
    //             }}
    //           >
    //             End Date
    //           </div>

    //           <div
    //             style={{
    //               marginLeft: '5px',
    //               marginTop: '5px',
    //               fontSize: '14px',
    //               fontStyle: 'bold',
    //               color: '#283049',
    //               display: 'flex',
    //               justifyContent: 'space-around',
    //               alignItems: 'center',
    //               margin: '5px',
    //             }}
    //           >
    //             <input
    //               type="text"
    //               style={{
    //                 pointerEvents: 'none',
    //                 width: '70%',
    //                 border: 'none',
    //               }}
    //               value={
    //                 toDate === null
    //                   ? 'dd-mm-yy'
    //                   : moment(toDate).format('DD-MM-YYYY')
    //               }
    //             />

    //             <SelectBottomSheet
    //               name="endDate"
    //               addNewSheet
    //               triggerComponent={
    //                 <CalendarIcon
    //                   style={{ width: 20, color: '#949494' }}
    //                   onClick={() => {
    //                     onTriggerDrawer('endDate');
    //                   }}
    //                 />
    //               }
    //               open={drawer.endDate}
    //               // value={taxValue}

    //               onTrigger={onTriggerDrawer}
    //               onClose={() => {
    //                 setDrawer((d) => ({ ...d, endDate: false }));
    //               }}

    //               // maxHeight="45vh"
    //             >
    //               <div style={{ padding: '15px' }}>
    //                 <span>End Date</span>
    //                 <hr className={css.DividerFilter} />
    //               </div>
    //               <Calender
    //                 head="Select End Date"
    //                 button="Select"
    //                 handleDate={handleEndDate}
    //               />
    //             </SelectBottomSheet>
    //           </div>
    //         </div>
    //       </div>
    //     </SelectBottomSheet>
    //   ) : (
    //     <Mui.Menu
    //       id="basic-menu-sort"
    //       anchorEl={anchorElCalendar}
    //       open={openCalendar}
    //       onClose={() => setAnchorElCalendar(null)}
    //       MenuListProps={{
    //         'aria-labelledby': 'basic-button',
    //       }}
    //       PaperProps={{
    //         elevation: 3,
    //         style: {
    //           maxHeight: 260,
    //           width: '40ch',
    //           padding: '5px',
    //           borderRadius: 20,
    //         },
    //       }}
    //     >
    //       <div className={css.dateWrapper}>
    //         {/* <MuiDatePicker
    //         selectedDate={fromDate}
    //         label="Start Date"
    //         onChange={(m) => setFromDate(m.format('YYYY-MM-DD'))}
    //       /> */}
    //         <span>Select the start and end date to filter</span>
    //         <hr className={css.DividerFilter} />
    //         <div
    //           style={{
    //             border: '1px solid #A0A4AF',
    //             borderRadius: '10px',
    //             width: '90%',
    //             padding: '5px',
    //             margin: '10px',
    //           }}
    //         >
    //           <div
    //             style={{
    //               fontSize: '11px',
    //               fontStyle: 'light',
    //               color: '#283049',
    //             }}
    //           >
    //             Start Date
    //           </div>

    //           <div
    //             style={{
    //               marginLeft: '5px',
    //               marginTop: '5px',
    //               fontSize: '14px',
    //               fontStyle: 'bold',
    //               color: '#283049',
    //               display: 'flex',
    //               justifyContent: 'space-around',
    //               alignItems: 'center',
    //               margin: '5px',
    //             }}
    //           >
    //             <input
    //               type="text"
    //               value={
    //                 webValue.fromDate
    //                   ? moment(webValue.fromDate).format('DD-MM-YYYY')
    //                   : 'DD-MM-YYYY'
    //               }
    //               style={{
    //                 pointerEvents: 'none',
    //                 width: '100%',
    //                 border: 'none',
    //                 padding: 5,
    //               }}
    //             />
    //             <OnlyDatePicker
    //               // className={css.avatarForDate}
    //               selectedDate={webValue.fromDate || new Date()}
    //               // label={new Date(invoiceDate).toLocaleDateString()}
    //               onChange={handleStartDate}
    //             />
    //           </div>
    //         </div>
    //       </div>
    //       <div className={css.dateWrapper}>
    //         {/* <MuiDatePicker
    //         selectedDate={toDate}
    //         label="End Date"
    //         onChange={(m) => setToDate(m.format('YYYY-MM-DD'))}
    //       /> */}
    //         <div
    //           style={{
    //             border: '1px solid #A0A4AF',
    //             borderRadius: '10px',
    //             width: '90%',
    //             padding: '5px',
    //             margin: '10px',
    //           }}
    //         >
    //           <div
    //             style={{
    //               fontSize: '11px',
    //               fontStyle: 'light',
    //               color: '#283049',
    //             }}
    //           >
    //             End Date
    //           </div>
    //           <div
    //             style={{
    //               marginLeft: '5px',
    //               marginTop: '5px',
    //               fontSize: '14px',
    //               fontStyle: 'bold',
    //               color: '#283049',
    //               display: 'flex',
    //               justifyContent: 'space-around',
    //               alignItems: 'center',
    //               margin: '5px',
    //             }}
    //           >
    //             <input
    //               type="text"
    //               value={
    //                 webValue.toDate
    //                   ? moment(webValue.toDate).format('DD-MM-YYYY')
    //                   : 'DD-MM-YYYY'
    //               }
    //               style={{
    //                 pointerEvents: 'none',
    //                 width: '100%',
    //                 border: 'none',
    //                 padding: 5,
    //               }}
    //             />

    //             <OnlyDatePicker
    //               // className={css.avatarForDate}
    //               selectedDate={webValue.toDate || new Date()}
    //               // label={new Date(invoiceDate).toLocaleDateString()}
    //               onChange={handleEndDate}
    //             />
    //           </div>
    //         </div>
    //       </div>
    //       <Mui.Button
    //         contained
    //         className={css.ApplyFilterButton}
    //         onClick={() => {
    //           setFromDate(webValue.fromDate);
    //           setToDate(webValue.toDate);
    //           setAnchorElCalendar(null);
    //         }}
    //       >
    //         Apply Filters
    //       </Mui.Button>
    //     </Mui.Menu>
    //   )}
    //   <SelectBottomSheet
    //     triggerComponent
    //     open={drawer.vendor && !desktopView}
    //     name="vendor"
    //     onClose={handleBottomSheet}
    //     id="overFlowHidden"
    //     addNewSheet
    //   >
    //     <div className={classes.searchInput}>
    //       <span>Select Vendor</span>
    //       <hr className={css.DividerFilter} />
    //       <Input
    //         name="search"
    //         placeholder="Search Vendor"
    //         InputLabelProps={{
    //           shrink: true,
    //         }}
    //         InputProps={{
    //           type: 'text',
    //           startAdornment: (
    //             <SearchIcon style={{ color: 'rgb(175, 157, 157)' }} />
    //             // <img
    //             //   src={SearchIcon2}
    //             //   alt="search"
    //             //   className={css.searchVendor}
    //             // />
    //           ),
    //         }}
    //         value={vendorQuery}
    //         fullWidth
    //         onChange={onInputChange}
    //         theme="light"
    //       />
    //       <div style={{ overflow: 'auto', maxHeight: '49vh' }}>
    //         {state &&
    //           state.vendors &&
    //           state.vendors.map((item) => {
    //             return (
    //               <div
    //                 className={css.checkboxList}
    //                 key={item.id}
    //                 role="menuitem"
    //               >
    //                 <Mui.FormControlLabel
    //                   label={
    //                     <div className={css.checkboxLabel}>
    //                       {item.short_name?.toLowerCase()}
    //                     </div>
    //                   }
    //                   control={
    //                     <Checkbox
    //                       className={classes.checkbox}
    //                       checked={selectVendorList?.includes(item?.id)}
    //                       inputProps={{ id: item.name }}
    //                       value={item?.id}
    //                       icon={<UncheckedIcon />}
    //                       checkedIcon={<CheckedIcon />}
    //                       onChange={(e) => {
    //                         handleValueChange(item?.id, e.target.checked);
    //                       }}
    //                     />
    //                   }
    //                 />
    //               </div>
    //             );
    //           })}
    //         {state?.vendors?.length === 0 && (
    //           <Mui.Typography align="center">
    //             {loading ? 'Data is being fetched' : 'No Data!'}
    //           </Mui.Typography>
    //         )}
    //       </div>
    //     </div>
    //   </SelectBottomSheet>
    //   <Mui.Popover
    //     id="basic-menu-sort"
    //     anchorEl={anchorElVendor}
    //     open={openVendor}
    //     onClose={() => setAnchorElVendor(null)}
    //     MenuListProps={{
    //       'aria-labelledby': 'basic-button',
    //     }}
    //     PaperProps={{
    //       elevation: 3,
    //       style: {
    //         maxHeight: 600,
    //         width: '35ch',
    //         padding: '5px 5px 20px 5px',
    //         borderRadius: 20,
    //       },
    //     }}
    //     anchorOrigin={{
    //       vertical: 'bottom',
    //       horizontal: 'left',
    //     }}
    //     transformOrigin={{
    //       vertical: 'top',
    //       horizontal: 'left',
    //     }}
    //   >
    //     <div className={classes.searchInput}>
    //       <span>Select Vendor</span>
    //       <hr className={css.DividerFilter} />
    //       <Input
    //         name="search"
    //         placeholder="Search Vendor"
    //         InputLabelProps={{
    //           shrink: true,
    //         }}
    //         InputProps={{
    //           type: 'text',
    //           startAdornment: (
    //             <SearchIcon style={{ color: 'rgb(175, 157, 157)' }} />
    //             // <img
    //             //   src={SearchIcon2}
    //             //   alt="search"
    //             //   className={css.searchVendor}
    //             // />
    //           ),
    //         }}
    //         value={vendorQuery}
    //         fullWidth
    //         onChange={onInputChange}
    //         theme="light"
    //       />
    //       <div style={{ overflow: 'auto', maxHeight: '22rem' }}>
    //         {state &&
    //           state.vendors &&
    //           state.vendors.map((item) => {
    //             return (
    //               <div
    //                 className={css.checkboxList}
    //                 key={item.id}
    //                 role="menuitem"
    //               >
    //                 <Mui.FormControlLabel
    //                   label={
    //                     <div className={css.checkboxLabel}>
    //                       {item.short_name?.toLowerCase()}
    //                     </div>
    //                   }
    //                   control={
    //                     <Checkbox
    //                       className={classes.checkbox}
    //                       checked={selectVendorList?.includes(item?.id)}
    //                       inputProps={{ id: item.name }}
    //                       value={item?.id}
    //                       icon={<UncheckedIcon />}
    //                       checkedIcon={<CheckedIcon />}
    //                       onChange={(e) => {
    //                         handleValueChange(item?.id, e.target.checked);
    //                       }}
    //                     />
    //                   }
    //                 />
    //               </div>
    //             );
    //           })}
    //         {state?.vendors?.length === 0 && (
    //           <Mui.Typography align="center">
    //             {loading ? 'Data is being fetched' : 'No Data!'}
    //           </Mui.Typography>
    //         )}
    //       </div>
    //     </div>
    //   </Mui.Popover>
    //   {!desktopView ? (
    //     <SelectBottomSheet
    //       triggerComponent
    //       addNewSheet
    //       open={drawer.sort}
    //       name="sort"
    //       onClose={handleBottomSheet}
    //     >
    //       <div className={css.list}>
    //         <div style={{ padding: '15px' }}>
    //           <span>Sort</span>
    //           <hr className={css.DividerFilter} />
    //         </div>
    //         {sortOptions.map((v) => (
    //           <div
    //             className={css.categoryOptions}
    //             onClick={() => onSortChange(v)}
    //             key={v.id}
    //             role="menuitem"
    //           >
    //             {v.name}
    //           </div>
    //         ))}
    //       </div>
    //     </SelectBottomSheet>
    //   ) : (
    //     <Mui.Menu
    //       id="basic-menu-sort"
    //       anchorEl={anchorEl}
    //       open={open}
    //       onClose={() => setAnchorEl(null)}
    //       MenuListProps={{
    //         'aria-labelledby': 'basic-button',
    //       }}
    //       PaperProps={{
    //         elevation: 3,
    //         style: {
    //           maxHeight: 350,
    //           width: '35ch',
    //           padding: '10px',
    //           borderRadius: 20,
    //         },
    //       }}
    //     >
    //       <div className={css.effortlessOptions}>
    //         <div className={css.sortPopoverHeading}>
    //           <span>Sort by</span>
    //           <hr className={css.forline} />
    //         </div>
    //         <ul
    //           className={css.optionsWrapper}
    //           style={{ listStyleType: 'none' }}
    //         >
    //           {sortOptions.map((e) => (
    //             <li className={css.items} aria-hidden="true">
    //               <Mui.RadioGroup
    //                 value={webValue.order_by}
    //                 onChange={(event) => {
    //                   setWebValue({
    //                     ...webValue,
    //                     order_by: event.target.value,
    //                   });
    //                 }}
    //               >
    //                 <Mui.FormControlLabel
    //                   value={e.name}
    //                   control={<Mui.Radio style={{ color: '#F08B32' }} />}
    //                   label={e.name}
    //                 />
    //               </Mui.RadioGroup>
    //             </li>
    //           ))}
    //         </ul>
    //         <Mui.Button
    //           contained
    //           className={css.applyFiltersButton}
    //           onClick={() => {
    //             onSortChange(
    //               sortOptions.find((data) => data.name === webValue?.order_by),
    //             );
    //             setAnchorEl(null);
    //           }}
    //         >
    //           Apply Filters
    //         </Mui.Button>
    //       </div>
    //     </Mui.Menu>
    //   )}
    //   <SelectBottomSheet
    //     triggerComponent
    //     open={drawer.download}
    //     name="download"
    //     onClose={handleBottomSheet}
    //   >
    //     <div className={css.list}>
    //       {downloadOptions.map((v) => (
    //         <div
    //           className={css.categoryOptions}
    //           onClick={() => handleBottomSheet('download', v)}
    //           key={v.id}
    //           role="menuitem"
    //         >
    //           {v.name}
    //         </div>
    //       ))}
    //     </div>
    //   </SelectBottomSheet>
    //   <SelectBottomSheet
    //     triggerComponent
    //     open={drawer.yourBill}
    //     name="yourBill"
    //     onClose={handleBottomSheet}
    //   >
    //     <div className={css.mainContainer}>
    //       {selectedBill.document_number && (
    //         <div className={[css.headerContainer]}>
    //           <div className={css.headerLabel}>
    //             {selectedBill.document_number}
    //           </div>
    //           <span className={css.headerUnderline} />
    //         </div>
    //       )}
    //       <div className={css.parentDrawerContainer}>
    //         <p className={css.label}>Vendor</p>
    //         <p className={css.value}>
    //           {(selectedBill.vendor && selectedBill.vendor.name) || '-'}
    //         </p>
    //       </div>
    //       <div className={css.drawerContainer}>
    //         <p className={css.label}>Amount</p>
    //         <p className={css.value}>{FormattedAmount(selectedBill?.amount)}</p>
    //       </div>
    //       <div className={css.drawerContainer}>
    //         <p className={css.label}>Expense Category</p>
    //         <p className={css.value}>
    //           {(selectedBill.expense_category &&
    //             selectedBill.expense_category.name) ||
    //             ''}
    //         </p>
    //       </div>
    //       <div className={css.drawerContainer}>
    //         <p className={css.label}>Payment Mode</p>
    //         <p className={css.value}>
    //           {(selectedBill.payment_mode === 'to_pay' ? 'To Pay' : '') || ''}
    //         </p>
    //       </div>
    //       <div className={css.drawerContainer}>
    //         <p className={css.label}>Location</p>
    //         <p className={css.value}>{selectedBill.location || '-'}</p>
    //       </div>
    //       <div className={css.drawerContainer}>
    //         <p className={css.label}>Description</p>
    //         <p className={css.value}>{selectedBill.description || '-'}</p>
    //       </div>
    //     </div>
    //   </SelectBottomSheet>
    //   {havePermission.open && (
    //     <PermissionDialog onClose={() => havePermission.back()} />
    //   )}
    // </div>
    <>
      <>
        {desktopView ? (
          <Box className={css.queueBillsDesktop}>
            <Typography className={css.tilecont}>Assigned Bills</Typography>

            <DataGridPremium
              rows={assignedBills}
              columns={assignedBillsColumn}
              density="compact"
              // getRowHeight={() => 'auto'}
              rowHeight={60}
              columnHeaderHeight={80}
              disableChildrenSorting
              disableColumnResize
              disableColumnReorder
              hideFooter
              disableRowSelectionOnClick
              disableColumnPinning
              disableRowGrouping
              disableAggregation
              onRowClick={handleRowClick}
              initialState={{
                filter: {
                  filterModel: {
                    items: [],
                    quickFilterValues: [state?.search_text],
                  },
                },
              }}
              components={{
                Toolbar: CustomToolbar,
                NoRowsOverlay: () => (
                  <Stack
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                  >
                    No Data Found
                  </Stack>
                ),
                LoadingOverlay: InvoiceLoadingSkeleton,
              }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              loading={billsDataLoad === null}
              sx={{
                background: '#fff',
                borderRadius: '16px',
                border: 'none',
                marginTop: '16px',
                // '& .MuiDataGrid-columnHeaders': {
                //   background: '#F5F5F5',
                // },
                '& .MuiDataGrid-virtualScrollerContent': {
                  height: 'calc(100vh - 246px) !important',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  whiteSpace: 'break-spaces',
                  textAlign: 'center',
                  lineHeight: '20px',
                  fontFamily: "'Lexend', sans-serif !important",
                  fontWeight: '500 !important',
                  fontSize: '14px',
                },
                '& .MuiDataGrid-row': {
                  cursor: 'pointer !important',
                  padding: '4px 0px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.10)',
                },
                '& .MuiDataGrid-cell': {
                  fontFamily: "'Lexend', sans-serif !important",
                  fontWeight: '400 !important',
                  fontSize: '13px',
                },
                '.MuiDataGrid-cell-vendor': {
                  fontFamily: "'Lexend', sans-serif !important",
                  fontWeight: '500 !important',
                  fontSize: '13px',
                },
                '& .left-align--header': {
                  '.MuiDataGrid-columnHeaderDraggableContainer': {
                    flexDirection: 'row !important',
                  },
                  '.MuiDataGrid-columnHeaderTitleContainer': {
                    flexDirection: 'row !important',
                  },
                  textAlign: 'left',
                },
                '& .MuiDataGrid-columnSeparator': { display: 'none' },
              }}
            />
          </Box>
        ) : (
          <div className={`${css.assignedBills} ${css.assignedBillsMob}`}>
            <p className={css.draftTitleMob}>Assigned Bills</p>

            <div className={`${css.secondRow} ${css.secondRowMob}`}>
              <div className={`${css.firstSet} ${css.firstSetMob}`}>
                <Chip
                  label="Date"
                  icon={<KeyboardArrowDown />}
                  onClick={(event) => {
                    setAnchorEl((prev) => ({
                      ...prev,
                      date: event.currentTarget,
                    }));
                  }}
                  sx={{
                    '& .MuiChip-label': {
                      paddingLeft: 0,
                    },
                  }}
                  className={classes.chips}
                />
                <Chip
                  label="Vendor"
                  icon={<KeyboardArrowDown />}
                  onClick={(event) => {
                    setAnchorEl((prev) => ({
                      ...prev,
                      vendor: event.currentTarget,
                    }));
                  }}
                  sx={{
                    '& .MuiChip-label': {
                      paddingLeft: 0,
                    },
                  }}
                  className={classes.chips}
                />

                <Chip
                  label="Sort by"
                  icon={<KeyboardArrowDown />}
                  onClick={(event) => {
                    setAnchorEl((prev) => ({
                      ...prev,
                      sort: event.currentTarget,
                    }));
                  }}
                  sx={{
                    '& .MuiChip-label': {
                      paddingLeft: 0,
                    },
                  }}
                  className={classes.chips}
                />
              </div>

              {(selectVendorList?.length > 0 ||
                (sortData?.order && sortData?.order_by) ||
                (sortData?.fromDate && sortData?.toDate)) && (
                <div className={css.selectedOptions3Mob}>
                  {sortData?.order && sortData?.order_by && (
                    <Chip
                      className={classes.selectedchips}
                      label={sortData?.orderName}
                      variant="outlined"
                      onDelete={() => {
                        setSortData((prev) => ({
                          ...prev,
                          order: '',
                          order_by: '',
                          orderName: '',
                        }));
                        setAssignedBills([]);
                      }}
                    />
                  )}

                  {sortData?.fromDate && sortData?.toDate && (
                    <Chip
                      className={classes.selectedchips}
                      label={`${moment(sortData.fromDate, 'YYYY-MM-DD').format(
                        'MMM DD',
                      )} - ${moment(sortData.toDate, 'YYYY-MM-DD').format(
                        'MMM DD, YYYY',
                      )}`}
                      variant="outlined"
                      onDelete={() => {
                        setSortData((prev) => ({
                          ...prev,
                          fromDate: '',
                          toDate: '',
                        }));
                        setAssignedBills([]);
                      }}
                    />
                  )}
                  {checkedVendorList?.length >= 1 &&
                    checkedVendorList?.map((a) => {
                      return (
                        <Chip
                          className={classes.selectedchips}
                          label={a?.name || '-'}
                          key={a?.id}
                          variant="outlined"
                          onDelete={() => {
                            handleValueChange(a?.id, false);
                          }}
                        />
                      );
                    })}
                </div>
              )}
            </div>

            <InfiniteScroll
              dataLength={assignedBills?.length}
              next={() => loadMore()}
              hasMore={hasMoreItems}
              scrollableTarget="tableContainerDraftBills"
            >
              <div
                className={css.assignedMobCard}
                style={{
                  maxHeight:
                    selectVendorList?.length > 0 ||
                    (sortData?.fromDate && sortData?.toDate) ||
                    (sortData?.order_by && sortData?.order)
                      ? 'calc(100vh - 300px)'
                      : 'calc(100vh - 250px)',
                }}
                id="tableContainerDraftBills"
              >
                {assignedBills?.map((item) => (
                  <div className={css.cardDetail} key={item?.id}>
                    <div
                      className={css.firstSet}
                      onClick={() => {
                        setBottomSheet(true);
                        setTableDetails(item);
                      }}
                    >
                      <p className={css.vendorName}>
                        {item?.vendor
                          ? item?.vendor?.name?.toLowerCase()
                          : (item?.new_vendor &&
                              item?.new_vendor?.name?.toLowerCase()) ||
                            '-'}
                      </p>
                      <div className={css.innerFirst}>
                        <p className={css.key}>Assign date</p>
                        <p className={css.value}>
                          {(item?.assign_date &&
                            moment(item?.assign_date).format('DD-MM-YYYY')) ||
                            '-'}
                        </p>
                      </div>
                      <div className={css.innerFirst}>
                        <p className={css.key}>Expenses</p>
                        <p className={css.value}>
                          {item?.expense_account?.name}
                        </p>
                      </div>
                      <div className={css.innerFirst}>
                        <p className={css.key}>Payment Status</p>
                        <p className={css.value}>
                          {item?.payment_mode === 'personal'
                            ? `${
                                paymentStatusListWithBill?.find(
                                  (v) => v.id === item?.payment_mode,
                                )?.label
                              } ${item?.payer_details?.name || ''}` ||
                              item?.payment_mode ||
                              '-'
                            : paymentStatusListWithBill?.find(
                                (v) => v.id === item?.payment_mode,
                              )?.label ||
                              item?.payment_mode ||
                              '-'}
                        </p>
                      </div>
                      <div className={css.innerFirst}>
                        <p className={css.key}>Amount</p>
                        <p className={css.value}>
                          {FormattedAmount(item?.amount)}
                        </p>
                      </div>
                    </div>
                    <div className={css.secondSet}>
                      <div
                        onClick={() => {
                          setTableDetails(item);
                          DeleteUploadBill();
                        }}
                      >
                        <img src={deleteBin} alt="delete" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {!billsDataLoad && <MobileCardLoadingSkeleton NumCard={6} />}
              {billsListData?.data?.length === 0 &&
                billsDataLoad === 'dataLoad' && (
                  <Typography align="center" my="16px">
                    No Bill Found.
                  </Typography>
                )}
            </InfiniteScroll>
          </div>
          // <>Mobile</>
        )}

        <SelectBottomSheet
          open={anchorEl?.vendor}
          onClose={() => setAnchorEl((prev) => ({ ...prev, vendor: null }))}
          triggerComponent={<div style={{ display: 'none' }} />}
          addNewSheet
        >
          <EntityFilter
            EntityType="vendor"
            listSelection={checkedVendorList || []}
            handleSelection={(val) =>
              setSelectVendorList(val?.map((ele) => ele?.id))
            }
            stateSearchText={state?.search_text && vendorQuery}
            setMainSearchQuery={state?.search_text && setVendorQuery}
          />
        </SelectBottomSheet>

        <SelectBottomSheet
          open={anchorEl?.date}
          onClose={() => setAnchorEl((prev) => ({ ...prev, date: null }))}
          triggerComponent={<div style={{ display: 'none' }} />}
          addNewSheet
        >
          <DateFilter
            Title="Select Start & End Date"
            listSelection={{
              startDate: sortData?.fromDate,
              endDate: sortData?.toDate,
            }}
            handleSelection={(val) =>
              setSortData((prev) => ({
                ...prev,
                fromDate: val?.startDate,
                toDate: val?.endDate,
              }))
            }
          />
        </SelectBottomSheet>

        <SelectBottomSheet
          open={Boolean(anchorEl?.sort)}
          addNewSheet
          onClose={() => {
            setAnchorEl((prev) => ({ ...prev, sort: null }));
          }}
          triggerComponent={<div style={{ display: 'none' }} />}
        >
          {device === 'mobile' && <Puller />}
          <Box padding="36px 20px 20px">
            <Typography className={css.headertext}>Sort</Typography>
          </Box>
          {sortOptions.map((data) => (
            <MenuItem
              key={data?.id}
              value={data?.id}
              onClick={() => {
                onSortChange(data);
              }}
              className={classes.menutext}
              style={{
                background: sortData?.orderName === data?.name && '#f08b3250',
              }}
            >
              {data?.name}
            </MenuItem>
          ))}
        </SelectBottomSheet>

        <SelectBottomSheet
          name="draftBills"
          addNewSheet
          triggerComponent={<></>}
          open={BottomSheet}
          onTrigger={() => setBottomSheet(true)}
          onClose={() => {
            setBottomSheet(false);
          }}
        >
          {device === 'mobile' && <Puller />}
          <div className={css.assignedBillsOpenSheet}>
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '10px 0',
                }}
              >
                {/* <p className={css.documentTitle}>{e?.document_number}</p> */}
                <div
                  className={css.fields}
                  style={{
                    padding: device === 'mobile' ? '6px 0' : '12px 0',
                  }}
                >
                  <p className={css.leftFields}>Assign Date</p>
                  <p className={css.rightFields}>
                    {(tableDetails?.assign_date &&
                      moment(tableDetails?.assign_date).format('DD-MM-YYYY')) ||
                      '-'}
                  </p>
                </div>
                {tableDetails?.file_url && device === 'desktop' && (
                  <div
                    onClick={() => {
                      ViewUploadBill(tableDetails?.file_url);
                    }}
                  >
                    <p className={css.viewInvoice}>View Bill</p>
                  </div>
                )}

                {device === 'mobile' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {tableDetails?.file_url && (
                      <Grid
                        onClick={() => {
                          ViewUploadBill(tableDetails?.file_url);
                        }}
                      >
                        <img
                          src={viewYourBills}
                          className={css.editButton}
                          alt="viewYourbills"
                        />{' '}
                      </Grid>
                    )}
                    {/* <Grid
                      onClick={() => {
                        editbill(tableDetails?.id);
                      }}
                    >
                      <img
                        src={editYourBills}
                        className={css.editButton}
                        alt="editYourBills"
                      />{' '}
                    </Grid> */}
                  </div>
                )}
              </div>
              <div>
                {[
                  {
                    name: 'Vendor',
                    value: tableDetails?.vendor
                      ? tableDetails?.vendor?.name?.toLowerCase()
                      : (tableDetails?.new_vendor &&
                          tableDetails?.new_vendor?.name?.toLowerCase()) ||
                        '-',
                  },
                  {
                    name: 'Amount',
                    value: FormattedAmount(tableDetails?.amount),
                  },
                  {
                    name: 'Expense Category',
                    value: tableDetails?.expense_account
                      ? tableDetails?.expense_account?.name
                      : '-',
                  },
                  {
                    name: 'Payment Mode',
                    value:
                      tableDetails?.payment_mode === 'personal'
                        ? `${
                            paymentStatusListWithBill?.find(
                              (v) => v.id === tableDetails?.payment_mode,
                            )?.label
                          } ${tableDetails?.payer_details?.name || ''}` ||
                          tableDetails?.payment_mode ||
                          '-'
                        : paymentStatusListWithBill?.find(
                            (v) => v.id === tableDetails?.payment_mode,
                          )?.label ||
                          tableDetails?.payment_mode ||
                          '-',
                  },
                ]?.map((val) => (
                  <div
                    className={css.fields}
                    style={{
                      padding: device === 'mobile' ? '6px 0' : '12px 0',
                    }}
                  >
                    <p className={css.leftFields}>{val.name}</p>
                    <p className={css.rightFields}>{val.value}</p>
                  </div>
                ))}
              </div>
              {device === 'mobile' && (
                <div
                  className={css.continueMob}
                  onClick={() => {
                    editbill(tableDetails?.id);
                  }}
                >
                  <p>Unassigns</p>
                </div>
              )}
            </div>

            <div className={css.finalButtonDiv}>
              {device === 'desktop' && (
                <div className={css.firstRow}>
                  <div
                    className={css.delete}
                    onClick={() => DeleteUploadBill()}
                  >
                    <p>Delete</p>
                  </div>
                  <div
                    className={css.continue}
                    onClick={() => {
                      editbill(tableDetails?.id);
                    }}
                  >
                    <p>Unassigns</p>
                  </div>
                </div>
              )}
              {/* <div className={css.lastRow}>
              <p>Record This Expense</p>
            </div> */}
            </div>
          </div>
        </SelectBottomSheet>

        <SelectBottomSheet
          open={dialogDelete && device === 'mobile'}
          addNewSheet
          onClose={() => {
            setDialogDelete(false);
          }}
          triggerComponent={<span style={{ display: 'none' }} />}
        >
          {device === 'mobile' && <Puller />}
          <Grid className={css2.deleteMainDiv}>
            <Grid>
              <Typography className={css2.deletetitle}>Heads Up !</Typography>

              <Divider className={css2.deleteDivider} variant="fullWidth" />
            </Grid>
            <Grid className={css2.deleteDescription}>
              {' '}
              Are you sure that you want to delete this Bill?
            </Grid>
            <Stack direction="row" className={css2.buttonWidth}>
              <Button
                className={css2.CancelButton}
                onClick={() => {
                  setDialogDelete(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className={css2.submitButton}
                onClick={() => {
                  deleteBill(tableDetails?.id);
                }}
              >
                Confirm
              </Button>
            </Stack>
          </Grid>
        </SelectBottomSheet>

        <Dialog
          PaperProps={{
            elevation: 3,
            style: {
              width: '86%',
              overflow: 'visible',
              borderRadius: 16,
              cursor: 'pointer',
            },
          }}
          open={dialogDelete && device === 'desktop'}
          onClose={() => setDialogDelete(false)}
        >
          <DialogContent>
            <Grid>
              <Grid>
                <Typography className={css.deletetitle}>Heads Up !</Typography>

                <Divider className={css.deleteDivider} variant="fullWidth" />
              </Grid>
              <Grid className={css.deleteDescriptionDesktop}>
                {' '}
                Are your sure that you want to delete this bill?
              </Grid>
              <Grid className={css.deleteDescriptionDesktop2}>
                {' '}
                Please note that all data associated with this bill will be
                permanently deleted
              </Grid>
              <Stack direction="row" className={css.buttonWidth}>
                <Button
                  className={css.CancelButton}
                  onClick={() => {
                    setDialogDelete(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className={css.submitButton}
                  onClick={() => {
                    deleteBill(tableDetails?.id);
                  }}
                >
                  Confirm
                </Button>
              </Stack>
            </Grid>
          </DialogContent>
        </Dialog>

        {viewBill && (
          <BillViewDialog file_url={file} onClose={() => setViewBill(false)} />
        )}
        {havePermission.open && (
          <PermissionDialog onClose={() => havePermission.back()} />
        )}
      </>
    </>
  );
};

export default BillsInQueue;
