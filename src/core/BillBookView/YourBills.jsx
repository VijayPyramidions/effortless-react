import React, { useState, useContext, useEffect } from 'react';
import JSBridge from '@nativeBridge/jsbridge';

import InfiniteScroll from 'react-infinite-scroll-component';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { Document, Page } from 'react-pdf'
import * as Router from 'react-router-dom';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import Input from '@components/Input/Input.jsx';
import Checkbox from '@components/Checkbox/Checkbox.jsx';
import * as Mui from '@mui/material';
import * as MuiIcon from '@mui/icons-material';
import SearchIcon from '@material-ui/icons/Search';
import deleteBin from '@assets/binRed.svg';
import SearchIcon2 from '@assets/search.svg';
import PageTitle from '@core/DashboardView/PageTitle';
import * as css3 from '@core/DashboardView/DashboardViewContainer.scss';
import download from '@assets/WebAssets/download.svg';
import viewYourBills from '@assets/viewYourBills.png';
import editYourBills from '@assets/editYourBills.png';
import { makeStyles, Chip } from '@material-ui/core';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import * as themes from '@root/theme.scss';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import moment from 'moment';
import {
  CheckedIcon,
  UncheckedIcon,
} from '@core/PaymentView/MultiplePayments/VendorBillSelection';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import Calender from '../InvoiceView/Calander';
import * as css from './YourBills.scss';
import * as css2 from './BillsInQueue.scss';

const useStyles = makeStyles(() => ({
  chips: {
    marginRight: '5px',
    '& .MuiChip-root': {
      background: 'white',
      border: '1px solid #f0f0f0',
      flexDirection: 'row-reverse !important',
      cursor: 'pointer',
    },
    '& .MuiChip-icon': {
      marginRight: '5px',
      marginLeft: '-10px',
    },
  },
  searchInput: {
    margin: '10px 20px',
    padding: '5px 10px 0 0',
    height: '100%',
    '& .MuiTextField-root': {
      paddingLeft: '8px',
      marginBottom: '8px',
      border: '1px solid rgb(180 175 174)',
      height: '7% !important',
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
    margin: '0 6px 0 0',
    background: '#fdf1e6',
    color: themes.colorPrimaryButton,
    borderColor: themes.colorPrimaryButton,
  },
}));

const sortOptions = [
  // { id: 1, name: 'Recent payments', click: { order_by: 'date', order: 'asc' } },
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
  { id: 6, name: 'Cancelled' },
];

const downloadOptions = [
  { id: 1, name: 'Microsoft Excel' },
  { id: 2, name: 'PDF File' },
  { id: 3, name: 'CSV File' },
];

const initialState = {
  vendors: [],
  sort: null,
  date: null,
};

export const paymentStatusListWithBill = [
  { id: 'company_cash', label: 'Paid with Company Cash' },
  { id: 'paid_as_advance', label: 'Paid as Advance' },
  { id: 'to_pay', label: 'To Pay' },
  { id: 'company_card', label: 'Paid with Company Card' },
  { id: 'personal', label: 'Paid By' },
  { id: 'company_account', label: 'Paid with Company Account' },
];

const YourBillIn = ({ stateOut }) => {
  const navigate = Router.useNavigate();
  const {
    organization,
    enableLoading,
    user,
    changeSubView,
    openSnackBar,
    loading,
    userPermissions,
  } = useContext(AppContext);
  const classes = useStyles();

  const [state, setState] = useState(initialState);
  const [checkedVendorList, setCheckedVendorList] = useState([]);
  const [vendorList, setVendorList] = useState(
    stateOut?.people?.id ? [stateOut?.people?.id] : undefined,
  );
  // const [selectedVendor, setSelectedVendor] = useState([]);
  const [yourBills, setYourBills] = useState([]);
  const [sortState, setSortState] = useState('');
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [draft, setDraft] = useState(false);
  const [selectedBill, setSelectedBill] = useState({});
  const [anchorElCalendar, setAnchorElCalendar] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [anchorElForList, setAnchorElForList] = React.useState(null);
  const [webValue, setWebValue] = React.useState({
    fromDate: null,
    toDate: null,
    customerID: null,
    orderBy: null,
  });
  const deviceDetect = localStorage.getItem('device_detect');
  const [sortByType, setSortByType] = React.useState({
    order_by: '',
    order: '',
    sort: '',
  });

  const [drawer, setDrawer] = useState({
    date: false,
    vendor: false,
    sort: false,
    download: false,
    yourBill: false,
    startDate: false,
    endDate: false,
  });
  const titles = [
    'Name',
    'Bill Number',
    'Status',
    'Accounted Date',
    'Taxable Value',
    '  ',
  ];
  const [dialogDelete, setDialogDelete] = useState(false);
  const [viewBill, setViewBill] = useState(false);
  const [file, setFile] = useState('');

  const [userRoles, setUserRoles] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });
  const [hasMoreItems, sethasMoreItems] = useState(true);
  const [page, setPage] = useState({});

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

  const handleStartDate = (val) => {
    if (deviceDetect === 'mobile') {
      setFromDate(val);
      setDrawer((d) => ({ ...d, startDate: false }));
    } else {
      setWebValue((prev) => ({
        ...prev,
        fromDate: val,
      }));
    }
  };

  const handleEndDate = (val) => {
    if (deviceDetect === 'mobile') {
      setToDate(val);
      setDrawer((d) => ({ ...d, endDate: false }));
    } else {
      setWebValue((prev) => ({
        ...prev,
        toDate: val,
      }));
    }
  };

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };

  const openRecordAnExpense = (item) => {
    if (item.status === 'draft') {
      changeSubView('uploadYourBillView-haveBill', item);
    } else {
      onTriggerDrawer('yourBill');
      setSelectedBill(item);
    }
  };

  const handleBottomSheet = (name, data) => {
    setDrawer((d) => ({ ...d, [name]: false }));
    if (data) {
      setState((s) => ({ ...s, [name]: data }));
    }
    // setSearchQuery('');
  };

  const getVendors = async (searchVal, entire) => {
    // enableLoading(true);

    RestApi(
      `organizations/${organization.orgId}/entities?type[]=vendor&search=${
        searchVal || ''
      }`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        // enableLoading(false);
        if (res && !res.error) {
          res.data.map((a) => Object.assign(a, { check: false }));
          // setVendorList(res.data);
          setState({ ...state, vendors: res.data });
          if (entire) {
            setState({ ...state, vendors: res.data });
            setVendorList(res?.data?.map((val) => val?.id));
          }
        }
      })
      .catch(() => {
        // enableLoading(false);
      });
  };

  const queryParam = new URLSearchParams(window.location.search).get('id');

  const getYourBills = async (page_num) => {
    enableLoading(true);
    let filter = '';

    if (vendorList?.length > 0) {
      vendorList.forEach((v) => {
        filter += `vendor_ids[]=${v}&`;
      });
    }

    if (toDate) {
      const toDataStr = moment(toDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
      filter +=
        filter === '' ? `end_date=${toDataStr}` : `&end_date=${toDataStr}`;
    }

    if (fromDate) {
      const fromDataStr = moment(fromDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
      filter +=
        filter === ''
          ? `start_date=${fromDataStr}`
          : `&start_date=${fromDataStr}`;
    }

    if (sortState === 'cancelled') {
      filter += filter === '' ? `status=cancelled` : `&status=cancelled`;
    }
    // }

    if (sortByType?.order_by && sortByType?.order) {
      filter +=
        filter === ''
          ? `order_by=${sortByType?.order_by}&order=${sortByType?.order}`
          : `&order_by=${sortByType?.order_by}&order=${sortByType?.order}`;
    }

    await RestApi(
      `organizations/${organization.orgId}/vendor_bills?page=${
        page_num || 1
      }&${filter}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          const accounted = res.data.filter(
            (ele) => ele.status === 'accounted',
          );
          const cancelled = res.data.filter(
            (ele) => ele.status === 'cancelled',
          );
          const sorted = accounted.concat(cancelled);
          setPage({ currentPage: res?.page, totalPage: res?.pages });
          if (res?.page === 1) {
            sethasMoreItems(true);
            setYourBills(Object.assign(res?.data));
            const myDiv = document.getElementById('tableContainerYourBills');
            // myDiv.innerHTML = variableLongText;
            myDiv.scrollTop = 0;
          } else {
            setYourBills([...yourBills, ...sorted]);
          }
        }
        enableLoading(false);
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const handleValueChange = (v, checked) => {
    if (checked) {
      if (vendorList === undefined || vendorList?.length === 0) {
        setVendorList([v]);
      } else {
        setVendorList((prev) => [...prev, v]);
      }
    } else {
      const checkedList = vendorList?.filter((item) => item !== v);
      setVendorList(checkedList);
    }
  };

  useEffect(() => {
    if (vendorList?.length > 0 && state?.vendors) {
      const checkedList = state?.vendors.filter(
        (ele) => vendorList.indexOf(ele.id) !== -1,
      );
      setCheckedVendorList(checkedList);
    } else if (vendorList?.length === 0) {
      setCheckedVendorList(vendorList);
    }
    if (state?.vendors?.length === 0) getVendors();
  }, [vendorList, state?.vendors]);

  useEffect(() => {
    if (
      (stateOut?.search_text && vendorList?.length > 0) ||
      stateOut?.search_text === undefined
    ) {
      getYourBills();
    }

    // }
    if (fromDate && toDate) {
      setAnchorElCalendar(null);
    }
  }, [
    vendorList,
    toDate,
    fromDate,
    sortState,
    // stateOut,
    sortByType?.order_by,
    sortByType?.order,
  ]);

  useEffect(() => {
    if (state.sort === '') {
      getYourBills();
      if (fromDate && toDate) {
        setAnchorElCalendar(null);
      }
    }
  }, [state.sort]);

  const onInputChange = (e) => {
    setSearchQuery(e?.target?.value);
    if (e?.target?.value?.length > 2) {
      getVendors(e.target.value);
    }
    if (e?.target?.value?.length === 0) {
      getVendors();
    }
  };

  const onSortChange = (v) => {
    handleBottomSheet('sort', v);
    if (v.id <= 5) {
      setSortState('');
      setSortByType((s) => ({
        ...s,
        sort: v?.name,
        order_by: v?.click?.order_by,
        order: v?.click?.order,
      }));
    } else if (v.id === 6) {
      setSortState('cancelled');
      setSortByType({
        sort: '',
        order: '',
        order_by: '',
      });
    }
  };

  const [search, setSearch] = React.useState('');
  const [filterBillsArray, setFilterBillsArray] = React.useState([]);

  React.useEffect(() => {
    const filterBills = search
      ? yourBills?.filter((val) =>
          val?.vendor?.name
            ?.trim()
            ?.toLowerCase()
            ?.includes(search.trim().toLowerCase()),
        )
      : yourBills;
    setFilterBillsArray(filterBills);
  }, [search, yourBills]);
  // web

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event, component) => {
    if (component === 'calendar') {
      setAnchorElCalendar(event.currentTarget);
    } else if (component === 'list') {
      setAnchorElForList(event.currentTarget);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  const open = Boolean(anchorEl);
  const openCalendar = Boolean(anchorElCalendar);

  const [BottomSheet, setBottomSheet] = React.useState(false);
  const [tableDetails, setTableDetails] = React.useState([]);

  const openTrigger = () => {
    setBottomSheet(true);
  };
  const closeTrigger = () => {
    setBottomSheet(false);
    // setTableDetails([]);
  };
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = (numPages) => {
    setPageNumber(numPages?.numPages);
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
    enableLoading(true);

    RestApi(`organizations/${organization.orgId}/vendor_bills/${id}/versions`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (
          res?.error ||
          res?.message ===
            'This vendor bill cannot be revised since payment has been made'
        ) {
          openSnackBar({
            message: res?.message || 'Unknown error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        } else {
          navigate('/bill-upload', {
            state: { selected: res },
          });
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };
  const deleteBill = (id) => {
    setDialogDelete(false);
    enableLoading(true);

    RestApi(`organizations/${organization.orgId}/vendor_bills/${id}`, {
      method: METHOD.DELETE,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res?.error || res?.message) {
          openSnackBar({
            message: res?.message || 'Unknown error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        } else {
          getYourBills();
          closeTrigger();
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const ViewUploadBill = (url) => {
    setViewBill(true);
    setFile(url);
  };
  const viewSingleBill = (id) => {
    enableLoading(true);

    RestApi(`organizations/${organization.orgId}/vendor_bills/${id}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res?.error || res?.message === 'Vendor Bill not found') {
          openSnackBar({
            message: res?.message || 'Unknown error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        } else {
          // eslint-disable-next-line no-lonely-if
          if (res?.file_url) {
            ViewUploadBill(res?.file_url);
          } else {
            // eslint-disable-next-line no-lonely-if
            if (deviceDetect === 'desktop') {
              setBottomSheet(true);
              setTableDetails([res]);
            } else if (deviceDetect === 'mobile') {
              onTriggerDrawer('yourBill');
              setSelectedBill(res);
            }
          }
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  React.useEffect(() => {
    if (stateOut?.id || queryParam) {
      viewSingleBill(stateOut?.id || queryParam, 'show');
    }
  }, [stateOut?.id]);

  React.useEffect(() => {
    if (
      vendorList !== undefined &&
      stateOut?.search_text?.length > 0 &&
      vendorList?.length === 0
    ) {
      setSearchQuery('');
      getVendors();
      getYourBills();
      navigate('/bill-yourbills', { replace: true });
    }
    if (vendorList?.length === 0) {
      setSearchQuery('');
      getVendors();
    }
  }, [vendorList]);

  React.useEffect(() => {
    if (stateOut?.search_text) {
      setSearchQuery(stateOut?.search_text);
      getVendors(stateOut?.search_text, true);
    } else if (!vendorList) {
      getVendors();
    }
  }, [stateOut?.search_text]);

  // React.useEffect(() => {
  //   if (stateOut?.id && yourBills?.length > 0) {
  //     const temp = yourBills?.find((val) => val?.id === stateOut?.id);
  //     if (temp?.file_url) {
  //       ViewUploadBill(temp?.file_url);
  //     } else {
  //       setBottomSheet(true);
  //       setTableDetails([temp]);
  //     }
  //   }
  // }, [stateOut?.id, yourBills]);

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

  const handleDownloadClick = async () => {
    if (deviceDetect === 'desktop') {
      const image = await fetch(file);
      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);

      const link = document.createElement('a');
      link.href = imageURL;
      link.download = 'your-bill';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      JSBridge.downloadLink(file);
    }
  };

  const loadMore = () => {
    // if (page.totalPage !== undefined) {
    if (page.currentPage >= page.totalPage) {
      sethasMoreItems(false);
    } else {
      setPage((prev) => ({ ...prev, currentPage: prev?.currentPage + 1 }));
    }
    // }
  };

  React.useEffect(() => {
    if (page?.currentPage > 1 && page.currentPage <= page.totalPage) {
      getYourBills(page?.currentPage);
    }
  }, [page?.currentPage]);

  return (
    <div className={css.container}>
      <div
        className={
          deviceDetect !== 'desktop'
            ? css.yourBillsContainer
            : css2.billsInQueueContainer2
        }
      >
        <div className={css.headerMainContainer}>
          <div className={css.headerContainer}>
            <div className={css.headerLabel}>Your Bills</div>
            <span className={css.headerUnderline} />
          </div>
        </div>
        {deviceDetect !== 'desktop' ? (
          <div className={css.searchContainer}>
            <div
              className={classes.chips}
              onClick={() => onTriggerDrawer('date')}
            >
              <Chip
                label="Date"
                icon={<KeyboardArrowDown />}
                className={css.chipLabel}
              />
            </div>
            <div
              className={classes.chips}
              onClick={() => onTriggerDrawer('vendor')}
            >
              <Chip
                label="Vendor"
                icon={<KeyboardArrowDown />}
                className={css.chipLabel}
              />
            </div>
            <div
              className={classes.chips}
              onClick={() => onTriggerDrawer('sort')}
            >
              <Chip
                label="Sort"
                icon={<KeyboardArrowDown />}
                className={css.chipLabel}
              />
            </div>
          </div>
        ) : (
          <>
            <div className={css2.searchContainer}>
              <Mui.Stack direction="row">
                <div
                  className={css.searchFilter}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0px 0px 40px rgba(48, 73, 191, 0.05)',
                    borderRadius: '16px',
                    backgroundColor: 'white',
                    height: '34px',
                    width: '69%',
                  }}
                >
                  <SearchIcon
                    style={{ color: '#af9d9d' }}
                    className={css.searchFilterIcon}
                  />{' '}
                  <input
                    placeholder="Search for"
                    //  onChange={(event) => setQuery(event.target.value)}
                    className={css.searchFilterInput}
                    style={{
                      border: 'none',
                      overflow: 'auto',
                      fontSize: '12px',
                    }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div
                  className={classes.chips}
                  onClick={(e) => handleClick(e, 'calendar')}

                  // onClick={() => onTriggerDrawer('date')}
                >
                  <Chip
                    label="Date"
                    icon={<KeyboardArrowDown />}
                    className={css.chipLabel2}
                  />
                </div>
                <div
                  className={classes.chips}
                  onClick={(event) => handleClick(event, 'list')}
                >
                  <Chip
                    label="Vendor"
                    icon={<KeyboardArrowDown />}
                    className={css.chipLabel2}
                  />
                </div>
                {((deviceDetect === 'desktop' &&
                  state.vendors &&
                  vendorList?.length >= 1) ||
                  state.sort ||
                  toDate ||
                  fromDate ||
                  draft) && (
                  <div className={css.selectedOptions3}>
                    {sortState !== '' && state.sort && (
                      <Chip
                        className={classes.selectedchips}
                        label={state.sort.name}
                        variant="outlined"
                        onDelete={() => {
                          if (sortState !== '') {
                            setSortState('');
                            setWebValue({ ...webValue, orderBy: null });
                          } else {
                            setState({ ...state, sort: '' });
                            setWebValue({ ...webValue, orderBy: null });
                          }
                        }}
                      />
                    )}
                    {sortByType.sort && (
                      <Chip
                        className={classes.selectedchips}
                        label={sortByType.sort}
                        variant="outlined"
                        onDelete={() => {
                          setSortByType((p) => ({
                            ...p,
                            sort: '',
                            order_by: '',
                            order: '',
                          }));
                          setWebValue({ ...webValue, orderBy: null });
                        }}
                      />
                    )}
                    {toDate && fromDate && (
                      <Chip
                        className={classes.selectedchips}
                        label={`${moment(fromDate, 'YYYY-MM-DD').format(
                          'MMM DD',
                        )} - ${moment(toDate, 'YYYY-MM-DD').format(
                          'MMM DD, YYYY',
                        )}`}
                        variant="outlined"
                        onDelete={() => {
                          setToDate(null);
                          setFromDate(null);
                          setWebValue({
                            ...webValue,
                            fromDate: null,
                            toDate: null,
                          });
                        }}
                      />
                    )}
                    {draft && (
                      <Chip
                        className={classes.selectedchips}
                        label="Draft"
                        variant="outlined"
                        onDelete={() => {
                          setDraft(false);
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
              </Mui.Stack>
              <div
                className={classes.chips}
                onClick={(e) => {
                  onTriggerDrawer('sort');
                  handleClick(e);
                }}
                style={{ marginTop: '-15px' }}
              >
                <Chip
                  label="Sort"
                  icon={<KeyboardArrowDown />}
                  className={css.chipLabel2}
                />
              </div>
            </div>
          </>
        )}
        {((deviceDetect === 'mobile' &&
          state.vendors &&
          vendorList?.length >= 1) ||
          state.sort ||
          toDate ||
          fromDate ||
          draft) && (
          <div
            className={
              deviceDetect !== 'desktop'
                ? css.selectedOptions
                : css.selectedOptions2
            }
          >
            {sortState !== '' && state.sort && (
              <Chip
                className={classes.selectedchips}
                label={state.sort.name}
                variant="outlined"
                onDelete={() => {
                  if (sortState !== '') {
                    setSortState('');
                  } else {
                    setState({ ...state, sort: '' });
                  }
                }}
              />
            )}
            {sortByType.sort && (
              <Chip
                className={classes.selectedchips}
                label={sortByType.sort}
                variant="outlined"
                onDelete={() => {
                  setSortByType({
                    ...sortByType,
                    sort: '',
                    order_by: '',
                    order: '',
                  });
                }}
              />
            )}
            {toDate && fromDate && (
              <Chip
                className={classes.selectedchips}
                label={`${moment(fromDate, 'YYYY-MM-DD').format(
                  'MMM DD',
                )} - ${moment(toDate, 'YYYY-MM-DD').format('MMM DD, YYYY')}`}
                variant="outlined"
                onDelete={() => {
                  setToDate(null);
                  setFromDate(null);
                }}
              />
            )}
            {draft && (
              <Chip
                className={classes.selectedchips}
                label="Draft"
                variant="outlined"
                onDelete={() => {
                  setDraft(false);
                }}
              />
            )}
            {vendorList?.length >= 1 &&
              vendorList?.map((a) => {
                return (
                  state?.vendors?.length > 0 && (
                    <Chip
                      className={classes.selectedchips}
                      label={state?.vendors?.find((val) => val?.id === a)?.name}
                      key={a}
                      variant="outlined"
                      onDelete={() => {
                        handleValueChange(a, false);
                      }}
                    />
                  )
                );
              })}
          </div>
        )}
      </div>
      <div className={css.yourBillInfoContainer}>
        {deviceDetect !== 'desktop' ? (
          <>
            {!loading && yourBills?.length === 0 && (
              <Mui.Typography align="center">No Data Found</Mui.Typography>
            )}
            {loading && (
              <Mui.Typography align="center">
                Data is being fetched...
              </Mui.Typography>
            )}

            <InfiniteScroll
              dataLength={
                yourBills.filter((y) => (draft ? y.status === 'draft' : true))
                  ?.length
              }
              next={loadMore}
              hasMore={hasMoreItems}
              scrollableTarget="tableContainerYourBills"
            >
              <div
                style={{
                  maxHeight:
                    vendorList?.length > 0 ||
                    (fromDate && toDate) ||
                    (sortByType?.order_by && sortByType?.order)
                      ? 'calc(100vh - 265px)'
                      : 'calc(100vh - 230px)',
                  overflow: 'auto',
                }}
                id="tableContainerYourBills"
              >
                {yourBills?.length > 0 &&
                  yourBills
                    .filter((y) => (draft ? y.status === 'draft' : true))
                    .map((item) => {
                      return (
                        <Mui.Grid className={css.newMaindiv}>
                          {/* <Mui.Grid></Mui.Grid> */}
                          <div
                            key={item.id}
                            className={css.main}
                            onClick={() => {
                              // onTriggerDrawer('yourBill');
                              // setSelectedBill(item);
                              openRecordAnExpense(item);
                            }}
                          >
                            <div className={css.infoItem}>
                              <div className={css.infoTitle}>
                                {item.vendor && item.vendor.name?.toLowerCase()}
                              </div>
                              {item.status === 'draft' && (
                                <div className={css.draftLabel}>Draft</div>
                              )}
                            </div>
                            <div className={css.infoItem}>
                              <p className={css.key}>Bill Number</p>
                              <p className={css.value}>
                                {item.document_number || '-'}
                              </p>
                            </div>
                            <div className={css.infoItem}>
                              <p className={css.key}>Taxable Value</p>
                              <p className={css.value}>
                                {FormattedAmount(item?.amount)}
                              </p>
                            </div>
                          </div>
                          <div
                            onClick={() => {
                              setSelectedBill(item);
                              DeleteUploadBill();
                            }}
                            className={css.keyDelete}
                          >
                            <img src={deleteBin} alt="delete" />{' '}
                          </div>
                        </Mui.Grid>
                      );
                    })}
              </div>
            </InfiniteScroll>
            <SelectBottomSheet
              open={dialogDelete}
              addNewSheet
              onClose={() => {
                setDialogDelete(false);
              }}
              triggerComponent={<span style={{ display: 'none' }} />}
            >
              <Mui.Grid className={css.deleteMainDiv}>
                <Mui.Grid>
                  <Mui.Typography className={css.deletetitle}>
                    Heads Up !
                  </Mui.Typography>

                  <Mui.Divider
                    className={css.deleteDivider}
                    variant="fullWidth"
                  />
                </Mui.Grid>
                <Mui.Grid className={css.deleteDescription}>
                  {' '}
                  Are you sure that you want to delete this Bill?
                </Mui.Grid>
                <Mui.Stack direction="row" className={css.buttonWidth}>
                  <Mui.Button
                    className={css.CancelButton}
                    onClick={() => {
                      setDialogDelete(false);
                    }}
                  >
                    Cancel
                  </Mui.Button>
                  <Mui.Button
                    className={css.submitButton}
                    onClick={() => {
                      deleteBill(selectedBill?.id);
                    }}
                  >
                    Confirm
                  </Mui.Button>
                </Mui.Stack>
              </Mui.Grid>
            </SelectBottomSheet>
          </>
        ) : (
          <>
            {filterBillsArray.length > 0 && (
              <InfiniteScroll
                dataLength={
                  yourBills.filter((y) => (draft ? y.status === 'draft' : true))
                    ?.length
                }
                next={loadMore}
                hasMore={hasMoreItems}
                scrollableTarget="tableContainerYourBills"
              >
                <Mui.TableContainer
                  sx={{
                    borderRadius: 5,
                    // minHeight: 600,
                    maxHeight: '59vh',
                    maxWidth: '100%',
                  }}
                  id="tableContainerYourBills"
                >
                  <Mui.Table
                    stickyHeader
                    size="medium"
                    style={{ background: '#ffff' }}
                  >
                    <Mui.TableHead
                      sx={{
                        bgcolor: '#0000',
                        fontSize: '13px',
                        borderColor: (theme) => theme.palette.grey[100],
                      }}
                    >
                      {titles?.map((title) => (
                        <Mui.TableCell>
                          <Mui.Typography
                            noWrap
                            variant="body2"
                            className={css.tableHead}
                          >
                            {title}
                          </Mui.Typography>
                        </Mui.TableCell>
                      ))}
                    </Mui.TableHead>

                    <SelectBottomSheet
                      name="yourBills"
                      triggerComponent={filterBillsArray
                        .filter((y) => (draft ? y.status === 'draft' : true))
                        .map((item) => (
                          <Mui.TableBody>
                            <Mui.TableRow
                              onClick={() => {
                                setBottomSheet(true);
                                setTableDetails([item]);
                              }}
                              sx={{
                                borderColor: (theme) => theme.palette.grey[100],
                                cursor: 'pointer',
                              }}
                            >
                              <>
                                <Mui.TableCell className={css.tableCell}>
                                  <Mui.Typography
                                    noWrap
                                    variant="body2"
                                    className={css.tableFont}
                                  >
                                    {(item?.vendor &&
                                      item?.vendor.name?.toLowerCase()) ||
                                      '-'}
                                  </Mui.Typography>
                                  <Mui.Typography
                                    noWrap
                                    variant="body2"
                                    className={css.tableFontSm}
                                  >
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
                                    {/* {item?.payment_mode || '-'} */}
                                  </Mui.Typography>
                                </Mui.TableCell>
                                <Mui.TableCell className={css.tableCell}>
                                  <Mui.Typography
                                    noWrap
                                    variant="body2"
                                    className={css.tableBillNumber}
                                  >
                                    {item?.document_number || '-'}
                                  </Mui.Typography>
                                </Mui.TableCell>
                                <Mui.TableCell className={css.tableCell}>
                                  <Mui.Typography
                                    noWrap
                                    variant="body2"
                                    className={css.tableStatus}
                                  >
                                    {item?.status || '-'}
                                  </Mui.Typography>
                                </Mui.TableCell>

                                <Mui.TableCell className={css.tableCell}>
                                  <Mui.Typography
                                    noWrap
                                    variant="body2"
                                    className={css.tableDate}
                                  >
                                    {moment(item?.accounted_on).format(
                                      'DD-MM-YYYY',
                                    )}
                                  </Mui.Typography>
                                </Mui.TableCell>
                                <Mui.TableCell
                                  className={css.tableCell}
                                  style={{
                                    width: '20px',
                                  }}
                                  align="right"
                                >
                                  <Mui.Typography
                                    noWrap
                                    variant="body2"
                                    className={css.tableAmount}
                                  >
                                    {FormattedAmount(item?.amount)}
                                  </Mui.Typography>
                                </Mui.TableCell>
                                <Mui.TableCell className={css.tableCell}>
                                  <Mui.Typography noWrap variant="body2">
                                    <MuiIcon.MoreVert />
                                  </Mui.Typography>
                                </Mui.TableCell>
                              </>
                            </Mui.TableRow>
                            {/* ))} */}
                          </Mui.TableBody>
                        ))}
                      open={BottomSheet}
                      onTrigger={openTrigger}
                      onClose={closeTrigger}
                      maxHeight="45vh"
                    >
                      <Mui.Stack className={css.padLeft}>
                        {tableDetails?.map((e) => (
                          <>
                            <Mui.Grid className={css.yourBillsViewEditIcon}>
                              {/* <Mui.Grid
                              style={{
                                paddingBottom: '32px',
                              }}
                              className={css.BottomSheetContentTitle}
                            >
                              {e?.document_number || '-'}
                            </Mui.Grid> */}
                              <Mui.Stack className={css.padBottom}>
                                <Mui.Grid className={css.bottomSheetTitle}>
                                  Bill Number
                                </Mui.Grid>
                                <Mui.Grid className={css.BottomSheetContent}>
                                  {e?.document_number || '-'}
                                </Mui.Grid>
                              </Mui.Stack>
                              {e?.file_url && (
                                <div
                                  onClick={() => {
                                    ViewUploadBill(e?.file_url);
                                  }}
                                >
                                  <p className={css.viewInvoice}>View Bill</p>
                                </div>
                              )}
                            </Mui.Grid>
                            <Mui.Stack className={css.padBottom}>
                              <Mui.Grid className={css.bottomSheetTitle}>
                                Document Date
                              </Mui.Grid>
                              <Mui.Grid className={css.BottomSheetContent}>
                                {moment(e?.document_date).format('DD-MM-YYYY')}
                              </Mui.Grid>
                            </Mui.Stack>
                            <Mui.Stack className={css.padBottom}>
                              <Mui.Grid className={css.bottomSheetTitle}>
                                Accounted Date
                              </Mui.Grid>
                              <Mui.Grid className={css.BottomSheetContent}>
                                {moment(e?.accounted_on).format('DD-MM-YYYY')}
                              </Mui.Grid>
                            </Mui.Stack>
                            <Mui.Stack className={css.padBottom}>
                              <Mui.Grid className={css.bottomSheetTitle}>
                                Vendor
                              </Mui.Grid>
                              <Mui.Grid className={css.BottomSheetContent}>
                                {(e?.vendor && e?.vendor.name) || '-'}
                              </Mui.Grid>
                            </Mui.Stack>
                            <Mui.Stack className={css.padBottom}>
                              <Mui.Grid className={css.bottomSheetTitle}>
                                Taxable Value
                              </Mui.Grid>
                              <Mui.Grid className={css.BottomSheetContent}>
                                {FormattedAmount(e?.amount)}
                              </Mui.Grid>
                            </Mui.Stack>
                            <Mui.Stack className={css.padBottom}>
                              <Mui.Grid className={css.bottomSheetTitle}>
                                TDS
                              </Mui.Grid>
                              <Mui.Grid className={css.BottomSheetContent}>
                                {FormattedAmount(e?.tds_amount)}
                              </Mui.Grid>
                            </Mui.Stack>
                            <Mui.Stack className={css.padBottom}>
                              <Mui.Grid className={css.bottomSheetTitle}>
                                Expense Category
                              </Mui.Grid>
                              <Mui.Grid className={css.BottomSheetContent}>
                                {e?.expense_account?.name || '-'}
                              </Mui.Grid>
                            </Mui.Stack>
                            <Mui.Stack className={css.padBottom}>
                              <Mui.Grid className={css.bottomSheetTitle}>
                                Payment Mode
                              </Mui.Grid>
                              <Mui.Grid className={css.BottomSheetContent}>
                                {e?.payment_mode === 'personal'
                                  ? `${
                                      paymentStatusListWithBill?.find(
                                        (v) => v.id === e?.payment_mode,
                                      )?.label
                                    } ${e?.payer_details?.name || ''}` ||
                                    e?.payment_mode ||
                                    '-'
                                  : paymentStatusListWithBill?.find(
                                      (v) => v.id === e?.payment_mode,
                                    )?.label ||
                                    e?.payment_mode ||
                                    '-'}
                              </Mui.Grid>
                            </Mui.Stack>
                            <Mui.Stack className={css.padBottom}>
                              <Mui.Grid className={css.bottomSheetTitle}>
                                Description
                              </Mui.Grid>
                              <Mui.Grid className={css.BottomSheetContent}>
                                {e?.description || '-'}
                              </Mui.Grid>
                            </Mui.Stack>
                            <div className={css.finalButtonDiv}>
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
                                    editbill(tableDetails?.[0]?.id);
                                  }}
                                >
                                  <p>Edit bill</p>
                                </div>
                              </div>
                            </div>
                            <Mui.Dialog
                              PaperProps={{
                                elevation: 3,
                                style: {
                                  width: '86%',
                                  // position: 'absolute',

                                  overflow: 'visible',
                                  borderRadius: 16,
                                  cursor: 'pointer',
                                },
                              }}
                              open={dialogDelete}
                              onClose={() => setDialogDelete(false)}
                            >
                              <Mui.DialogContent>
                                <Mui.Grid
                                // className={css.deleteMainDiv}
                                >
                                  <Mui.Grid>
                                    <Mui.Typography className={css.deletetitle}>
                                      Heads Up !
                                    </Mui.Typography>

                                    <Mui.Divider
                                      className={css.deleteDivider}
                                      variant="fullWidth"
                                    />
                                  </Mui.Grid>
                                  <Mui.Grid
                                    className={css.deleteDescriptionDesktop}
                                  >
                                    {' '}
                                    Are your sure that you want to delete this
                                    bill?
                                  </Mui.Grid>
                                  <Mui.Grid
                                    className={css.deleteDescriptionDesktop2}
                                  >
                                    {' '}
                                    Please note that all data associated with
                                    this bill will be permanently deleted
                                  </Mui.Grid>
                                  <Mui.Stack
                                    direction="row"
                                    className={css.buttonWidth}
                                  >
                                    <Mui.Button
                                      className={css.CancelButton}
                                      onClick={() => {
                                        setDialogDelete(false);
                                      }}
                                    >
                                      Cancel
                                    </Mui.Button>
                                    <Mui.Button
                                      className={css.submitButton}
                                      onClick={() => {
                                        deleteBill(tableDetails[0]?.id);
                                      }}
                                    >
                                      Confirm
                                    </Mui.Button>
                                  </Mui.Stack>
                                </Mui.Grid>
                              </Mui.DialogContent>
                            </Mui.Dialog>
                          </>
                        ))}
                      </Mui.Stack>
                    </SelectBottomSheet>
                  </Mui.Table>
                </Mui.TableContainer>
              </InfiniteScroll>
            )}
            {!loading && filterBillsArray.length === 0 && (
              <Mui.Typography align="center">No Data Found</Mui.Typography>
            )}
            {loading && (
              <Mui.Typography align="center">
                Data is being fetched...
              </Mui.Typography>
            )}
          </>
        )}
        <Mui.Dialog
          PaperProps={{
            elevation: 3,
            style: {
              width: '86%',
              height: file.includes('.pdf') ? '100%' : '',
              // position: 'absolute',

              overflow: 'visible',
              borderRadius: 16,
              cursor: 'pointer',
            },
          }}
          open={viewBill}
          onClose={() => setViewBill(false)}
        >
          <Mui.Stack
            direction="row"
            justifyContent="flex-end"
            p={1}
            onClick={() => handleDownloadClick()}
          >
            {/* <a href={file} target="_blank" rel="noreferrer" download> */}
            <img src={download} alt="download" />
            {/* </a> */}
          </Mui.Stack>
          <Mui.DialogContent style={{ position: 'relative' }}>
            <Mui.Grid className={css.iframeViewDocument}>
              {file.includes('.jpeg') ||
              file.includes('.png') ||
              file.includes('.pdf') === false ? (
                <img src={file} alt="upload" style={{ width: '100%' }} />
              ) : (
                Array.from({ length: pageNumber }, (_, i) => i + 1).map((i) => (
                  <Document
                    file={file}
                    className={css.pdfStyle}
                    loading="  "
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={i} className={css.page} />
                  </Document>
                ))
              )}
            </Mui.Grid>
          </Mui.DialogContent>
        </Mui.Dialog>
      </div>
      {deviceDetect !== 'desktop' ? (
        <SelectBottomSheet
          triggerComponent
          open={drawer.date}
          name="date"
          onClose={handleBottomSheet}
          addNewSheet
        >
          <div style={{ padding: '15px' }}>
            <p className={css.forlineYour}>
              Select the start and end date to filter
            </p>
          </div>
          <div className={css.dateWrapper}>
            <div
              style={{
                border: '1px solid #A0A4AF',
                borderRadius: '10px',
                width: '90%',
                padding: '5px',
                margin: '10px',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontStyle: 'light',
                  color: '#283049',
                }}
              >
                Start Date
              </div>
              <div
                style={{
                  marginLeft: '5px',
                  marginTop: '5px',
                  fontSize: '14px',
                  fontStyle: 'bold',
                  color: '#283049',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  margin: '5px',
                }}
              >
                <input
                  type="text"
                  value={
                    fromDate === null
                      ? 'dd-mm-yy'
                      : moment(fromDate).format('DD-MM-YYYY')
                  }
                  style={{
                    pointerEvents: 'none',
                    width: '70%',
                    border: 'none',
                  }}
                />

                <SelectBottomSheet
                  name="startDate"
                  addNewSheet
                  triggerComponent={
                    <CalendarIcon
                      style={{ width: 20, color: '#949494' }}
                      onClick={() => {
                        onTriggerDrawer('startDate');
                      }}
                    />
                  }
                  open={drawer.startDate}
                  // value={taxValue}
                  onTrigger={onTriggerDrawer}
                  onClose={() => {
                    setDrawer((d) => ({ ...d, startDate: false }));
                  }}
                  // maxHeight="45vh"
                >
                  <Calender
                    head="Select Start Date"
                    button="Select"
                    handleDate={handleStartDate}
                  />
                </SelectBottomSheet>
              </div>
            </div>
          </div>
          <div className={css.dateWrapper}>
            <div
              style={{
                border: '1px solid #A0A4AF',
                borderRadius: '10px',
                width: '90%',
                padding: '5px',
                margin: '10px',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  fontStyle: 'light',
                  color: '#283049',
                }}
              >
                End Date
              </div>
              <div
                style={{
                  marginLeft: '5px',
                  marginTop: '5px',
                  fontSize: '14px',
                  fontStyle: 'bold',
                  color: '#283049',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  margin: '5px',
                }}
              >
                <input
                  type="text"
                  style={{
                    pointerEvents: 'none',
                    width: '70%',
                    border: 'none',
                  }}
                  value={
                    toDate === null
                      ? 'dd-mm-yy'
                      : moment(toDate).format('DD-MM-YYYY')
                  }
                />
                <SelectBottomSheet
                  name="endDate"
                  addNewSheet
                  triggerComponent={
                    <CalendarIcon
                      style={{ width: 20, color: '#949494' }}
                      onClick={() => {
                        onTriggerDrawer('endDate');
                      }}
                    />
                  }
                  open={drawer.endDate}
                  // value={taxValue}
                  onTrigger={onTriggerDrawer}
                  onClose={() => {
                    setDrawer((d) => ({ ...d, endDate: false }));
                  }}
                  // maxHeight="45vh"
                >
                  <Calender
                    head="Select End Date"
                    button="Select"
                    handleDate={handleEndDate}
                  />
                </SelectBottomSheet>
              </div>
            </div>
          </div>
        </SelectBottomSheet>
      ) : (
        <Mui.Popover
          id="basic-menu-sort"
          anchorEl={anchorElCalendar}
          open={openCalendar}
          onClose={() => setAnchorElCalendar(null)}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          PaperProps={{
            elevation: 3,
            style: {
              maxHeight: 500,
              width: '40ch',
              padding: '18px',
              borderRadius: 20,
            },
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <div className={css.dateWrapper}>
            <span>Select the start and end date to filter</span>
            <hr className={css.forline} />
            <div className={css.startDateDiv}>
              <div
                style={{
                  fontSize: '11px',

                  fontStyle: 'light',

                  color: '#283049',
                }}
              >
                Start Date
              </div>

              <div
                style={{
                  marginLeft: '5px',
                  marginTop: '5px',
                  fontSize: '14px',
                  fontStyle: 'bold',
                  color: '#283049',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  margin: '5px',
                }}
              >
                <input
                  type="text"
                  value={
                    webValue.fromDate
                      ? moment(webValue.fromDate).format('DD-MM-YYYY')
                      : 'dd-mm-yyyy'
                  }
                  style={{
                    pointerEvents: 'none',
                    width: '100%',
                    border: 'none',
                    padding: 5,
                  }}
                />
                <OnlyDatePicker
                  selectedDate={fromDate || new Date()}
                  onChange={handleStartDate}
                />
              </div>
            </div>
          </div>
          <div className={css.dateWrapper}>
            <div className={css.startDateDiv}>
              <div
                style={{
                  fontSize: '11px',
                  fontStyle: 'light',
                  color: '#283049',
                }}
              >
                End Date
              </div>

              <div
                style={{
                  marginLeft: '5px',
                  marginTop: '5px',
                  fontSize: '14px',
                  fontStyle: 'bold',
                  color: '#283049',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  margin: '5px',
                }}
              >
                <input
                  type="text"
                  value={
                    webValue.toDate
                      ? moment(webValue.toDate).format('DD-MM-YYYY')
                      : 'dd-mm-yyyy'
                  }
                  style={{
                    pointerEvents: 'none',
                    width: '100%',
                    border: 'none',
                    padding: 5,
                  }}
                />

                <OnlyDatePicker
                  selectedDate={toDate || new Date()}
                  onChange={handleEndDate}
                />
              </div>
            </div>
            <Mui.Button
              contained
              className={css.applyDateButton}
              onClick={() => {
                setFromDate(webValue.fromDate);
                setToDate(webValue.toDate);
                setAnchorElCalendar({
                  ...anchorElCalendar,
                  date: null,
                });
              }}
              disabled={!webValue.fromDate || !webValue.toDate}
            >
              Apply Filters
            </Mui.Button>
          </div>
        </Mui.Popover>
      )}
      {deviceDetect === 'mobile' ? (
        <SelectBottomSheet
          triggerComponent
          open={drawer.vendor}
          name="vendor"
          onClose={handleBottomSheet}
          id="overFlowHidden"
          addNewSheet
        >
          <div className={classes.searchInput}>
            <p className={css.forlineYour}>Select Vendor</p>
            <Input
              name="search"
              placeholder="Search Vendor"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                type: 'text',
                startAdornment: (
                  <img
                    src={SearchIcon2}
                    alt="search"
                    className={css.searchVendor}
                  />
                ),
              }}
              fullWidth
              value={searchQuery}
              onChange={onInputChange}
              theme="light"
            />
            <div
              style={{
                minHeight: 'auto',
                maxHeight: deviceDetect === 'mobile' ? '50vh' : '85%',
                overflow: 'auto',
              }}
            >
              {state &&
                state?.vendors &&
                state.vendors.map((item) => {
                  return (
                    <div
                      className={css.checkboxList}
                      key={item.id}
                      role="menuitem"
                    >
                      <Checkbox
                        className={classes.checkbox}
                        checked={vendorList?.includes(item?.id)}
                        inputProps={{ id: item.name }}
                        value={item?.id}
                        icon={<UncheckedIcon />}
                        checkedIcon={<CheckedIcon />}
                        onChange={(e) => {
                          handleValueChange(e?.target?.value, e.target.checked);
                        }}
                      />
                      <div className={css.checkboxLabel}>
                        {(item?.short_name).toLowerCase()}
                      </div>
                    </div>
                  );
                })}
              {state?.vendors && state.vendors?.length === 0 && (
                <Mui.Typography align="center">
                  {loading ? 'Data is being fetched' : 'No Data Found'}
                </Mui.Typography>
              )}
            </div>
          </div>
        </SelectBottomSheet>
      ) : (
        <Mui.Popover
          id="basic-menu-list"
          anchorEl={anchorElForList}
          open={Boolean(anchorElForList)}
          onClose={() => {
            setAnchorElForList(null);
            handleBottomSheet('date');
          }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          PaperProps={{
            elevation: 3,
            style: {
              maxHeight: 500,
              width: '35ch',
              padding: '5px',
              overflow: 'hidden',
              borderRadius: 20,
            },
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <div className={classes.searchInput}>
            <span>Select Vendor</span>
            <hr className={css.forline} />
            <Input
              name="search"
              placeholder="Search Vendor"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                type: 'text',
                startAdornment: (
                  <img
                    src={SearchIcon2}
                    alt="search"
                    className={css.searchVendor}
                  />
                ),
              }}
              fullWidth
              value={searchQuery}
              onChange={onInputChange}
              theme="light"
            />
            <div
              style={{
                minHeight: 'auto',
                maxHeight: '49vh',
                overflow: 'auto',
              }}
            >
              {state &&
                state?.vendors &&
                state.vendors.map((item) => {
                  return (
                    <div
                      className={css.checkboxList}
                      key={item.id}
                      role="menuitem"
                    >
                      <Checkbox
                        className={classes.checkbox}
                        checked={vendorList?.includes(item?.id)}
                        inputProps={{ id: item.name }}
                        value={item?.id}
                        icon={<UncheckedIcon />}
                        checkedIcon={<CheckedIcon />}
                        onChange={(e) => {
                          handleValueChange(e?.target?.value, e.target.checked);
                        }}
                      />
                      <div className={css.checkboxLabel}>
                        {(item?.short_name).toLowerCase()}
                      </div>
                    </div>
                  );
                })}
              {state?.vendors && state.vendors?.length === 0 && (
                <Mui.Typography align="center">
                  {loading ? 'Data is being fetched' : 'No Data Found'}
                </Mui.Typography>
              )}
            </div>
          </div>
        </Mui.Popover>
      )}
      {deviceDetect !== 'desktop' ? (
        <SelectBottomSheet
          triggerComponent
          open={drawer.sort}
          name="sort"
          onClose={handleBottomSheet}
          addNewSheet
        >
          <div className={css.list}>
            <p style={{ margin: '20px' }} className={css.forlineYour}>
              Sort
            </p>
            {sortOptions.map((v) => (
              <div
                className={css.categoryOptions}
                onClick={() => onSortChange(v)}
                key={v.id}
                role="menuitem"
              >
                {v.name}
              </div>
            ))}
          </div>
        </SelectBottomSheet>
      ) : (
        <Mui.Popover
          id="basic-menu-sort"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          PaperProps={{
            elevation: 3,
            style: {
              maxHeight: 500,
              width: '35ch',
              padding: '5px',
              borderRadius: 20,
            },
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <div className={css.effortlessOptions}>
            <div className={css.sortPopoverHeading}>
              <span>Sort by</span>
              <hr className={css.forline} />
            </div>
            <ul
              className={css.optionsWrapper}
              style={{ listStyleType: 'none' }}
            >
              {sortOptions.map((e) => (
                <li className={css.items} aria-hidden="true">
                  <Mui.RadioGroup
                    value={webValue.orderBy}
                    onChange={(event) => {
                      setWebValue({ ...webValue, orderBy: event.target.value });
                    }}
                  >
                    <Mui.FormControlLabel
                      value={e.name}
                      control={<Mui.Radio style={{ color: '#F08B32' }} />}
                      label={e.name}
                    />
                  </Mui.RadioGroup>
                </li>
              ))}
            </ul>
            <Mui.Button
              contained
              className={css.applyFiltersButton}
              onClick={() => {
                onSortChange(
                  sortOptions.find((data) => data.name === webValue?.orderBy),
                );
                setAnchorEl(null);
              }}
            >
              Apply Filters
            </Mui.Button>
          </div>
        </Mui.Popover>
      )}

      <SelectBottomSheet
        triggerComponent
        open={drawer.download}
        name="download"
        onClose={handleBottomSheet}
      >
        <div className={css.list}>
          {downloadOptions.map((v) => (
            <div
              className={css.categoryOptions}
              onClick={() => handleBottomSheet('download', v)}
              key={v.id}
              role="menuitem"
            >
              {v.name}
            </div>
          ))}
        </div>
      </SelectBottomSheet>
      <SelectBottomSheet
        triggerComponent
        open={drawer.yourBill}
        name="yourBill"
        onClose={handleBottomSheet}
        addNewSheet
      >
        <div className={css.mainContainer}>
          {selectedBill.document_number && (
            <Mui.Grid className={css.yourBillsViewEditIcon}>
              {/* <div className={[css.headerContainer]}>
                <div className={css.headerLabel}>
                  {selectedBill.document_number
                    ? selectedBill.document_number
                    : '-'}
                </div>
                <span className={css.headerUnderline} />
              </div> */}
              <div className={css.parentDrawerContainer}>
                <p className={css.label}>Bill Number</p>
                <p className={css.value}>
                  {selectedBill.document_number || '-'}
                </p>
              </div>
              <Mui.Stack direction="row" className={css.viewAndEditMobile}>
                {selectedBill.file_url && (
                  <Mui.Grid
                    onClick={() => {
                      ViewUploadBill(selectedBill?.file_url);
                    }}
                  >
                    <img
                      src={viewYourBills}
                      className={css.editButton}
                      alt="viewYourbills"
                    />{' '}
                  </Mui.Grid>
                )}
                <Mui.Grid
                  onClick={() => {
                    editbill(selectedBill?.id);
                  }}
                >
                  <img
                    src={editYourBills}
                    className={css.editButton}
                    alt="editYourBills"
                  />{' '}
                </Mui.Grid>
              </Mui.Stack>
            </Mui.Grid>
          )}
          <div className={css.parentDrawerContainer}>
            <p className={css.label}>Document Date</p>
            <p className={css.value}>
              {moment(selectedBill?.document_date).format('DD-MM-YYYY')}
            </p>
          </div>
          <div className={css.parentDrawerContainer}>
            <p className={css.label}>Accounted Date</p>
            <p className={css.value}>
              {moment(selectedBill?.accounted_on).format('DD-MM-YYYY')}
            </p>
          </div>
          <div className={css.parentDrawerContainer}>
            <p className={css.label}>Vendor</p>
            <p className={css.value}>
              {(selectedBill.vendor && selectedBill.vendor.name) || '-'}
            </p>
          </div>
          <div className={css.drawerContainer}>
            <p className={css.label}>Taxable Value</p>
            <p className={css.value}>{FormattedAmount(selectedBill?.amount)}</p>
          </div>
          <div className={css.drawerContainer}>
            <p className={css.label}>TDS</p>
            <p className={css.value}>
              {FormattedAmount(selectedBill?.tds_amount)}
            </p>
          </div>
          <div className={css.drawerContainer}>
            <p className={css.label}>Expense Category</p>
            <p className={css.value}>
              {(selectedBill.expense_account &&
                selectedBill.expense_account.name) ||
                '-'}
            </p>
          </div>
          <div className={css.drawerContainer}>
            <p className={css.label}>Payment Mode</p>
            <p className={css.value}>
              {selectedBill?.payment_mode === 'personal'
                ? `${
                    paymentStatusListWithBill?.find(
                      (v) => v.id === selectedBill?.payment_mode,
                    )?.label
                  } ${selectedBill?.payer_details?.name || ''}` ||
                  selectedBill?.payment_mode ||
                  '-'
                : paymentStatusListWithBill?.find(
                    (v) => v.id === selectedBill?.payment_mode,
                  )?.label ||
                  selectedBill?.payment_mode ||
                  '-'}
            </p>
          </div>
          <div className={css.drawerContainer}>
            <p className={css.label}>Description</p>
            <p className={css.value}>{selectedBill.description || '-'}</p>
          </div>
        </div>
      </SelectBottomSheet>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </div>
  );
};

const YourBill = () => {
  const { state } = Router.useLocation();
  const device = localStorage.getItem('device_detect');
  const navigate = Router.useNavigate();

  return (
    <>
      <PageTitle
        title="Bill Booking"
        onClick={() => {
          if (state?.people) {
            navigate('/people', { state: { choose: state?.people?.from } });
          } else {
            navigate('/bill');
          }
        }}
      />
      <div
        className={
          device === 'mobile'
            ? // ? css.dashboardBodyContainer
              css3.dashboardBodyContainerhideNavBar
            : css3.dashboardBodyContainerDesktop
        }
      >
        <YourBillIn stateOut={state} />
      </div>
    </>
  );
};

export default YourBill;
