/* eslint-disable no-extra-boolean-cast */
import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import Lottie from 'react-lottie';
import { useDispatch, useSelector } from 'react-redux';

import {
  getPaymentHistory,
  emptyPaymentHistory,
  getVendorDetail,
  retryPayment,
  setPagination,
  setRetryPayment,
  setDataLoad,
} from '@action/Store/Reducers/Payments/PaymentHistoryState';
import { enableLoading } from '@action/Store/Reducers/Errors/Errors';

import {
  Stack,
  Typography,
  Popover,
  ButtonGroup,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  IconButton,
  Skeleton,
  Avatar,
} from '@mui/material';
import { makeStyles, Chip } from '@material-ui/core';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import { IndianCurrency } from '@components/utils';
import * as themes from '@root/theme.scss';
import AppContext from '@root/AppContext';

import sucessAnimation from '@root/Lotties/paymentSucess.json';
import failAnimation from '@root/Lotties/paymentFailed.json';
import processingAnimation from '@root/Lotties/paymentProcessing.json';

import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

import Download from '@assets/downloadph.svg';
import StopWatch from '@assets/WebAssets/stopwatch.svg';
import CircleOk from '@assets/WebAssets/circle-ok.svg';
import ErrorImg from '@assets/WebAssets/error.svg';

import VendorList from './shared/VendorList';

import Calander from '../InvoiceView/Calander';

import * as css from './PaymentHistory.scss';

const useStyles = makeStyles(() => ({
  chips: {
    marginRight: '5px',
    '& .MuiChip-root': {
      background: 'white',
      border: '1px solid #f0f0f0',
      flexDirection: 'row-reverse !important',
    },
    '& .MuiChip-icon': {
      marginRight: '5px',
      marginLeft: '-10px',
    },
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
    margin: '0 6px 0 0',
    background: '#fdf1e6',
    color: themes.colorPrimaryButton,
    borderColor: themes.colorPrimaryButton,
  },
}));

const sortOptions = [
  {
    id: 1,
    name: 'Recent payments',
    click: { order_by: 'created_at', order: 'desc' },
  },
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

const defaultOptionsSuccess = {
  loop: true,
  autoplay: true,
  animationData: sucessAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const defaultOptionsFailed = {
  loop: true,
  autoplay: true,
  animationData: failAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const defaultOptionsProcessing = {
  loop: true,
  autoplay: true,
  animationData: processingAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const initialState = {
  vendors: [],
  sort: '',
  date: '',
};

const PaymentHistory = () => {
  const device = localStorage.getItem('device_detect');
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { userPermissions } = useContext(AppContext);

  const {
    paymentHistory,
    vendorList,
    dataLoad,
    retryPaymentResponse,
    pagination,
  } = useSelector((value) => value.PaymentHistory);
  const [state, setState] = useState(initialState);
  const [paymentDetails, setPaymentDetails] = useState();
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [showFromDate, setShowFromDate] = useState(true);
  const [activeTab, setActiveTab] = useState(
    !!location?.state?.paymentType ? location?.state?.paymentType : 'vendor',
  );

  const [drawer, setDrawer] = useState({
    date: false,
    vendor: false,
    sort: false,
    payment: false,
  });

  const [anchorElFor, setAnchorElFor] = useState({
    sort: null,
    date: null,
    list: null,
  });

  const [webValue, setWebValue] = useState({
    fromDate: null,
    toDate: null,
    customerID: null,
    orderBy: null,
  });

  const [hasMoreItems, sethasMoreItems] = useState(true);

  const [sortByType, setSortByType] = useState({
    order_by: '',
    order: '',
    sort: '',
  });

  const [userRoles, setUserRoles] = useState({});
  const [havePermission, setHavePermission] = useState({ open: false });

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };

  const handleBottomSheet = (name, data) => {
    setDrawer((d) => ({ ...d, [name]: false }));
    if (data) {
      setState((s) => ({ ...s, [name]: data }));
    }
  };

  const onClickVendor = (vendorId) => {
    const clickedVendor = vendorList.find((vl) => vl.id === vendorId);
    const selected = state.vendors.some((vs) => vs.id === clickedVendor.id);
    if (selected) {
      setState((ps) => {
        const pv = ps.vendors;
        return { ...ps, vendors: [...pv].filter((p) => p.id !== vendorId) };
      });
    } else {
      setState((ps) => ({ ...ps, vendors: [...ps.vendors, clickedVendor] }));
    }
  };

  const RetryPayment = async (id) => {
    dispatch(enableLoading(true, 'Please wait for a moment...'));
    dispatch(retryPayment({ payment_order_ids: [id] }));
  };

  const getVendors = async (searchVal) => {
    if (!!searchVal) dispatch(enableLoading(true));
    dispatch(getVendorDetail(searchVal));
  };

  const getPaymentHistorys = (pageNum) => {
    let filter = '';
    const vendorId = state && state.vendors && state.vendors.map((v) => v.id);

    if (activeTab === 'vendor') {
      if (vendorId && vendorId.length === 1) {
        filter += `vendor_id=${vendorId}`;
      } else if (vendorId && vendorId.length > 1) {
        vendorId.forEach((v) => {
          filter += `vendor_ids[]=${v}&`;
        });
      }
    }

    if (toDate) {
      const toDataStr = moment(toDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
      filter +=
        filter === '' ? `to_date=${toDataStr}` : `&to_date=${toDataStr}`;
    }

    if (fromDate) {
      const fromDataStr = moment(fromDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
      filter +=
        filter === ''
          ? `from_date=${fromDataStr}`
          : `&from_date=${fromDataStr}`;
    }

    if (sortByType?.order_by && sortByType?.order) {
      filter +=
        filter === ''
          ? `order_by=${sortByType?.order_by}&order=${sortByType?.order}`
          : `&order_by=${sortByType?.order_by}&order=${sortByType?.order}`;
    }

    dispatch(getPaymentHistory({ filter, pageNum, tab: activeTab }));
  };

  const loadMore = () => {
    if (
      pagination?.totalPage > 1 &&
      pagination?.totalPage > pagination?.currentPage
    ) {
      dispatch(
        setPagination({
          currentPage: pagination?.currentPage + 1,
          totalPage: pagination.totalPage,
        }),
      );
    }
  };

  const onSortChange = (v) => {
    setSortByType((s) => ({
      ...s,
      sort: v?.name,
      order_by: v?.click?.order_by,
      order: v?.click?.order,
    }));
    setDrawer({
      date: false,
      vendor: false,
      sort: false,
      payment: false,
    });
  };

  useEffect(() => {
    if (
      retryPaymentResponse &&
      retryPaymentResponse?.voucher_type === 'voucher_payment'
    ) {
      navigate('/payment-makepayment', {
        state: { voucherId: retryPaymentResponse?.payment_voucher_id },
      });
    } else if (
      retryPaymentResponse &&
      retryPaymentResponse?.voucher_type === 'advance_payment'
    ) {
      navigate('/payment-advancepayments', {
        state: { voucherId: retryPaymentResponse?.payment_voucher_id },
      });
    }
  }, [retryPaymentResponse]);
  useEffect(() => {
    if (
      pagination?.totalPage > 1 &&
      pagination?.currentPage > 1 &&
      pagination?.totalPage >= pagination?.currentPage
    ) {
      getPaymentHistorys(pagination?.currentPage);
    } else {
      sethasMoreItems(false);
    }
  }, [pagination?.currentPage]);

  useEffect(() => {
    if (pagination?.totalPage > 1) {
      sethasMoreItems(true);
    } else if (pagination?.totalPage === 1) {
      sethasMoreItems(false);
    }
  }, [pagination]);

  useEffect(() => {
    if (fromDate && toDate) {
      if (
        new Date(fromDate).setHours(0, 0, 0, 0) >
        new Date(toDate).setHours(0, 0, 0, 0)
      ) {
        setFromDate(null);
        setToDate(toDate);
      }
    }
  }, [fromDate]);

  useEffect(() => {
    if (fromDate && toDate) {
      if (
        new Date(toDate).setHours(0, 0, 0, 0) <
        new Date(fromDate).setHours(0, 0, 0, 0)
      ) {
        setFromDate(fromDate);
        setToDate(null);
      }
    }
  }, [toDate]);

  useEffect(() => {
    getVendors();
    return () => {
      dispatch(setDataLoad());
      dispatch(emptyPaymentHistory());
      dispatch(setRetryPayment(null));
    };
  }, []);

  useEffect(() => {
    dispatch(emptyPaymentHistory());
    getPaymentHistorys();
  }, [
    state.vendors,
    toDate,
    fromDate,
    sortByType?.order,
    sortByType?.order_by,
    activeTab,
  ]);

  useEffect(() => {
    if (Object.keys(userPermissions?.Payments || {})?.length > 0) {
      if (!userPermissions?.Payments?.Payment) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRoles({ ...userPermissions?.Payments });
    }
  }, [userPermissions]);

  useEffect(() => {
    if (
      Object.keys(userRoles?.Payment || {})?.length > 0 &&
      !userRoles?.['Payments History']?.view_payment_history
    ) {
      setHavePermission({
        open: true,
        back: () => {
          navigate('/payment');
          setHavePermission({ open: false });
        },
      });
    }
  }, [userRoles?.['Payments History']]);

  return (
    <div className={css.container}>
      <div
        className={
          device === 'desktop'
            ? css.paymentHistoryContainerDesktop
            : css.paymentHistoryContainer
        }
      >
        <div className={css.headerContainer}>
          <div
            className={
              device === 'desktop' ? css.headerLabelDesktop : css.headerLabel
            }
          >
            Payment History
          </div>
          <span
            className={
              device === 'desktop'
                ? css.headerLabelDesktop
                : css.headerUnderline
            }
          />
        </div>
        <div>
          <ButtonGroup variant="contained" className={css.groupbtn}>
            <Button
              className={
                activeTab === 'vendor'
                  ? `${css.vendorbtn} ${css.activebtn}`
                  : css.vendorbtn
              }
              onClick={() => {
                setActiveTab('vendor');
                setSortByType({
                  order_by: '',
                  order: '',
                  sort: '',
                });
              }}
            >
              Vendor Payments
            </Button>
            <Button
              className={
                activeTab === 'virtual'
                  ? `${css.virtualbtn} ${css.activebtn}`
                  : css.virtualbtn
              }
              onClick={() => {
                setSortByType({
                  order_by: '',
                  order: '',
                  sort: '',
                });
                setActiveTab('virtual');
              }}
            >
              Virtual Account Top-Ups
            </Button>
          </ButtonGroup>
        </div>

        <div className={css.searchContainer}>
          <div className={css.innerSearchContainer}>
            <div
              className={classes.chips}
              onClick={(e) => {
                onTriggerDrawer('date');
                setAnchorElFor({ ...anchorElFor, date: e.currentTarget });
              }}
            >
              <Chip
                label="Date"
                icon={<KeyboardArrowDown />}
                className={css.chipLabel}
              />
            </div>
            {activeTab === 'vendor' ? (
              <div
                className={classes.chips}
                onClick={(e) => {
                  onTriggerDrawer('vendor');
                  setAnchorElFor({ ...anchorElFor, list: e.currentTarget });
                }}
              >
                <Chip
                  label="Vendor"
                  icon={<KeyboardArrowDown />}
                  className={css.chipLabel}
                />
              </div>
            ) : (
              <div
                className={classes.chips}
                onClick={(e) => {
                  onTriggerDrawer('sort');
                  setAnchorElFor({ ...anchorElFor, sort: e.currentTarget });
                }}
              >
                <Chip
                  label="Sort"
                  icon={<KeyboardArrowDown />}
                  className={css.chipLabel}
                />
              </div>
            )}
          </div>
          {activeTab === 'vendor' ? (
            <div
              className={classes.chips}
              onClick={(e) => {
                onTriggerDrawer('sort');
                setAnchorElFor({ ...anchorElFor, sort: e.currentTarget });
              }}
            >
              <Chip
                label="Sort"
                icon={<KeyboardArrowDown />}
                className={css.chipLabel}
              />
            </div>
          ) : (
            <Button className={css.downloandhistoy}>
              Download history
              <Avatar
                src={Download}
                alt="download icon"
                sx={{ width: '24px', height: '24px', marginLeft: '12px' }}
              />
            </Button>
          )}
        </div>
        {((state.vendors && state.vendors.length > 0) ||
          state.sort ||
          toDate ||
          fromDate ||
          sortByType?.sort) && (
          <div className={css.selectedOptions}>
            {sortByType?.sort && (
              <Chip
                className={classes.selectedchips}
                label={sortByType?.sort}
                variant="outlined"
                onDelete={() => {
                  setSortByType({
                    sort: '',
                    order: '',
                    order_by: '',
                  });
                  setWebValue({ ...webValue, orderBy: null });
                }}
              />
            )}
            {toDate && fromDate && (
              <Chip
                className={classes.selectedchips}
                label={`${moment(fromDate, 'YYYY-MM-DD').format(
                  'MMM DD',
                )}-${moment(toDate, 'YYYY-MM-DD').format('MMM DD, YYYY')}`}
                variant="outlined"
                onDelete={() => {
                  setFromDate(null);
                  setToDate(null);
                  setWebValue({ ...webValue, fromDate: null, toDate: null });
                }}
              />
            )}
            {state.vendors &&
              state.vendors.map((a) => {
                return (
                  <Chip
                    className={classes.selectedchips}
                    label={a.name}
                    key={a.id}
                    variant="outlined"
                    onDelete={() => {
                      const newVendors = state.vendors.filter(
                        (i) => i.id !== a.id,
                      );

                      setState({ ...state, vendors: newVendors });
                    }}
                  />
                );
              })}
          </div>
        )}
      </div>

      <Stack
        className={
          device === 'desktop'
            ? css.historyInfoContainerDesktop
            : css.historyInfoContainer
        }
        id="scrollableDiv"
      >
        {paymentHistory.length === 0 && (
          <>
            {!Object.values(dataLoad)?.every((item) => !!item) ? (
              <>
                {[...Array(10)].map((item) => (
                  <>
                    {device === 'desktop' ? (
                      <PaymentHistoryCardLoading item={`val${item}`} />
                    ) : (
                      <PaymentHistoryCardMobileLoading item={`val${item}`} />
                    )}
                  </>
                ))}
              </>
            ) : (
              <Stack alignItems="center" sx={{ maxWidth: 750 }}>
                <Typography variant="h5" color=" #6E6E6E" align="center">
                  Sorry, No History Found ...
                </Typography>
              </Stack>
            )}
          </>
        )}
        {paymentHistory?.length > 0 && (
          <InfiniteScroll
            dataLength={paymentHistory?.length}
            next={() => loadMore()}
            // height={
            //   (pagination.totalPage === 1 && 'auto') ||
            //   (device === 'desktop' ? '70vh' : '80vh')
            // }
            // scrollThreshold="20px"
            // initialScrollY="100px"
            scrollableTarget="scrollableDiv"
            hasMore={hasMoreItems}
          >
            {paymentHistory.map((item) => {
              return device === 'desktop' ? (
                <PaymentHistoryCard
                  item={item}
                  RetryPay={RetryPayment}
                  cardClick={(val) => {
                    onTriggerDrawer('payment');
                    setPaymentDetails(val);
                  }}
                  userRoles={userRoles}
                  activeTab={activeTab}
                  setHavePermission={setHavePermission}
                />
              ) : (
                <PaymentHistoryCardMobile
                  item={item}
                  RetryPay={RetryPayment}
                  cardClick={(val) => {
                    onTriggerDrawer('payment');
                    setPaymentDetails(val);
                  }}
                  userRoles={userRoles}
                  activeTab={activeTab}
                  setHavePermission={setHavePermission}
                />
              );
            })}
          </InfiniteScroll>
        )}
      </Stack>

      {device === 'mobile' ? (
        <SelectBottomSheet
          triggerComponent
          open={drawer.date}
          name="date"
          onClose={handleBottomSheet}
          addNewSheet
        >
          {showFromDate ? (
            <Calander
              button="Next"
              head="Choose Starting Date"
              handleDate={(date) => {
                setFromDate(moment(date).format('YYYY-MM-DD'));
                setShowFromDate(false);
              }}
            />
          ) : (
            <Calander
              button="Done"
              head="Choose Ending Date"
              handleDate={(date) => {
                setToDate(moment(date).format('YYYY-MM-DD'));
                handleBottomSheet('date');
                setShowFromDate(true);
              }}
            />
          )}
        </SelectBottomSheet>
      ) : (
        <Popover
          id="basic-menu-list"
          anchorEl={anchorElFor.date}
          open={Boolean(anchorElFor.date)}
          onClose={() => {
            setAnchorElFor({ ...anchorElFor, date: null });
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
          <div className={css.paddingCal}>
            <span>Select the start and end date to filter</span>
            <hr className={css.forline} />

            <div className={css.card}>
              <div className={css.innerCard}>
                <div className={css.startDate}>Start Date</div>

                <div className={css.inputCalander}>
                  <input
                    type="text"
                    value={
                      webValue.fromDate === null
                        ? 'dd-mm-yyyy'
                        : moment(webValue.fromDate, 'YYYY-MM-DD').format(
                            'DD-MM-YYYY',
                          )
                    }
                    className={css.inputValues}
                    // onChange={(e) => {
                    // setWebValue({
                    //   fromDate: e.target.value,
                    //   toDate: toDate,
                    //   customerID: null,
                    //   orderBy: null,
                    // });
                    // }}
                  />
                  <OnlyDatePicker
                    selectedDate={webValue.fromDate}
                    onChange={(date) => {
                      setWebValue({
                        ...webValue,
                        fromDate: moment(date).format('YYYY-MM-DD'),
                      });
                    }}
                  />
                </div>
              </div>

              <div className={css.innerCard}>
                <div className={css.startDate}>End Date</div>

                <div className={css.inputCalander}>
                  <input
                    type="text"
                    className={css.inputValues}
                    value={
                      webValue.toDate === null
                        ? 'dd-mm-yyyy'
                        : moment(webValue.toDate, 'YYYY-MM-DD').format(
                            'DD-MM-YYYY',
                          )
                    }
                  />
                  <OnlyDatePicker
                    selectedDate={webValue.toDate}
                    onChange={(date) => {
                      setWebValue({
                        ...webValue,
                        toDate: moment(date).format('YYYY-MM-DD'),
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <Button
              contained
              style={{
                backgroundColor: '#F08B32',
                color: '#fff',
                margin: '20px 25%',
                width: '50%',
                borderRadius: 25,
              }}
              disabled={!webValue.fromDate || !webValue.toDate}
              onClick={() => {
                setFromDate(webValue?.fromDate);
                setToDate(webValue?.toDate);
                setAnchorElFor({ ...anchorElFor, date: null });
                handleBottomSheet('date');
              }}
            >
              Apply Filters
            </Button>
          </div>
        </Popover>
      )}

      {device === 'mobile' ? (
        <SelectBottomSheet
          triggerComponent
          open={drawer.vendor}
          name="vendor"
          onClose={() => {
            handleBottomSheet('vendor');
            getVendors();
          }}
          multiple
          // addNewSheet
          id="overFlowHidden"
        >
          <VendorList
            vendorList={vendorList}
            selected={state.vendors.map((v) => v.id)}
            disableAdd
            onClick={(v) => onClickVendor(v.id)}
            hideDoNotTrack
            callFunction={getVendors}
          />
        </SelectBottomSheet>
      ) : (
        <Popover
          id="basic-menu-list"
          anchorEl={anchorElFor.list}
          open={Boolean(anchorElFor.list)}
          onClose={() => {
            setAnchorElFor({ ...anchorElFor, list: null });
            getVendors();
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
          <div style={{ margin: '10px 25px' }}>
            <span>Select Vendor</span>
            <hr className={css.forline} />
          </div>
          <VendorList
            vendorList={vendorList}
            selected={state.vendors.map((v) => v.id)}
            disableAdd
            onClick={(v) => onClickVendor(v.id)}
            hideDoNotTrack
            popOverScroll
            callFunction={getVendors}
          />
        </Popover>
      )}

      {device === 'mobile' ? (
        <SelectBottomSheet
          triggerComponent
          open={drawer.sort}
          name="sort"
          onClose={handleBottomSheet}
          addNewSheet
        >
          <div className={css.list}>
            {sortOptions.map((v) => (
              <>
                {activeTab === 'virtual' ? (
                  <>
                    {v.name !== 'A-Z' && v.name !== 'Z-A' && (
                      <div
                        className={css.categoryOptions}
                        onClick={() => onSortChange(v)}
                        key={v.id}
                        role="menuitem"
                      >
                        {v.name}
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className={css.categoryOptions}
                    onClick={() => onSortChange(v)}
                    key={v.id}
                    role="menuitem"
                  >
                    {v.name}
                  </div>
                )}
              </>
            ))}
          </div>
        </SelectBottomSheet>
      ) : (
        <Popover
          id="basic-menu-list"
          anchorEl={anchorElFor.sort}
          open={Boolean(anchorElFor.sort)}
          onClose={() => {
            setAnchorElFor({ ...anchorElFor, sort: null });
            setWebValue((prev) => ({ ...prev, orderBy: sortByType?.sort }));
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
            horizontal: activeTab === 'vendor' ? 'right' : 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: activeTab === 'vendor' ? 'right' : 'left',
          }}
        >
          <div className={css.list}>
            <div style={{ margin: '10px 25px' }}>
              <span>Sort by</span>
              <hr className={css.forline} />
            </div>
            <ul
              className={css.optionsWrapper}
              style={{ listStyleType: 'none' }}
            >
              {sortOptions.map((e) => (
                <>
                  {activeTab === 'virtual' ? (
                    <>
                      {e.name !== 'Z-A' && e.name !== 'A-Z' && (
                        <li className={css.items} aria-hidden="true">
                          <RadioGroup
                            value={webValue.orderBy}
                            onChange={(event) => {
                              setWebValue({
                                ...webValue,
                                orderBy: event.target.value,
                              });
                            }}
                          >
                            <FormControlLabel
                              value={e.name}
                              control={<Radio style={{ color: '#F08B32' }} />}
                              label={e.name}
                            />
                          </RadioGroup>
                        </li>
                      )}
                    </>
                  ) : (
                    <li className={css.items} aria-hidden="true">
                      <RadioGroup
                        value={webValue.orderBy}
                        onChange={(event) => {
                          setWebValue({
                            ...webValue,
                            orderBy: event.target.value,
                          });
                        }}
                      >
                        <FormControlLabel
                          value={e.name}
                          control={<Radio style={{ color: '#F08B32' }} />}
                          label={e.name}
                        />
                      </RadioGroup>
                    </li>
                  )}
                </>
              ))}
            </ul>
            <Button
              contained
              style={{
                backgroundColor: '#F08B32',
                color: '#fff',
                margin: '20px 25%',
                width: '50%',
                borderRadius: 25,
              }}
              onClick={() => {
                onSortChange(
                  sortOptions.find((data) => data.name === webValue?.orderBy),
                );
                setAnchorElFor({ ...anchorElFor, sort: null });
              }}
            >
              Apply Filters
            </Button>
          </div>
        </Popover>
      )}

      {device === 'desktop' ? (
        <Dialog
          triggerComponent
          open={drawer.payment}
          name="payment"
          onClose={() => setDrawer((prev) => ({ ...prev, payment: false }))}
          PaperProps={{
            elevation: 0,
            style: {
              border: 18,
              minWidth: '32%',
            },
          }}
        >
          <PaymentDetilsShow
            paymentDetails={paymentDetails}
            defaultOptionsSuccess={defaultOptionsSuccess}
            defaultOptionsProcessing={defaultOptionsProcessing}
            defaultOptionsFailed={defaultOptionsFailed}
            handleClose={() =>
              setDrawer((prev) => ({ ...prev, payment: false }))
            }
          />
        </Dialog>
      ) : (
        <SelectBottomSheet
          triggerComponent
          open={drawer.payment}
          name="payment"
          onClose={handleBottomSheet}
          addNewSheet
        >
          <PaymentDetilsShow
            paymentDetails={paymentDetails}
            handleClose={() =>
              setDrawer((prev) => ({ ...prev, payment: false }))
            }
          />
        </SelectBottomSheet>
      )}

      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </div>
  );
};

export default PaymentHistory;

const PaymentHistoryCard = (props) => {
  const { item, RetryPay, cardClick, userRoles, activeTab, setHavePermission } =
    props;
  return (
    <div className={css.PaymentDiv}>
      <div className={css.leftDiv} onClick={() => cardClick(item)}>
        <div className={css.headConatin}>
          <p className={css.headName}>{item?.beneficiary_name}</p>
          <p className={css.headDate}>{item?.paid_at}</p>
        </div>
        <div className={css.secondConatin}>
          <div className={css.secondConatinSub}>
            <p className={css.key}>
              {item?.payment_status === 'failed' ||
              item?.payment_status === 'failure_bank'
                ? 'Attempt from'
                : 'Paid From'}
            </p>
            <p className={css.value}>{item?.bank_name}</p>
          </div>
          <div className={css.secondConatinSub}>
            <p className={css.key}>
              {item?.payment_status === 'failed' ||
              item?.payment_status === 'failure_bank'
                ? 'Attempt By'
                : 'Paid By'}
            </p>
            <p className={css.value}>{item?.payer_name}</p>
          </div>
          {(item?.payment_status === 'success_wallet' ||
            item.payment_status === 'success_bank') &&
            item?.bank_reference_number && (
              <div className={css.secondConatinSub}>
                <p className={css.key}>
                  {' '}
                  {activeTab === 'vendor' ? 'UTR Number:' : 'Order Id:'}
                </p>
                <p className={css.value}>
                  {activeTab === 'vendor'
                    ? item?.bank_reference_number
                    : item?.order_id}
                </p>
              </div>
            )}
        </div>
      </div>
      <div
        className={css.rightDiv}
        onClick={() => {
          if (
            item?.payment_status === 'success_wallet' ||
            item?.payment_status === 'success_bank' ||
            item?.payment_status === 'processing' ||
            item?.payment_status === 'bbps_success' ||
            item?.payment_status === 'settlement_processing'
          ) {
            cardClick(item);
          }
        }}
      >
        <div className={css.rightContain} onClick={() => cardClick(item)}>
          <p className={css.rightAmt}>{IndianCurrency.format(item?.amount)}</p>
          {(item?.payment_status === 'success_wallet' ||
            item?.payment_status === 'bbps_success' ||
            item?.payment_status === 'success_bank' ||
            item?.payment_status === 'success_load') && (
            <div className={css.statusDiv}>
              <img src={CircleOk} alt="success" />
              <p className={css.statusText} style={{ color: '#00A676' }}>
                Paid
              </p>
            </div>
          )}
          {(item?.payment_status === 'processing' ||
            item?.payment_status === 'bbps_pending' ||
            item?.payment_status === 'settlement_processing' ||
            item?.payment_status === 'initiated_pg' ||
            item?.payment_status === 'success_pg' ||
            item?.payment_status === 'initiated_load' ||
            item?.payment_status === 'processing_load' ||
            item?.payment_status === 'processing_pg') && (
            <div className={css.statusDiv}>
              <img src={StopWatch} alt="process" />
              <p className={css.statusText} style={{ color: '#F08B32' }}>
                Processing
              </p>
            </div>
          )}
          {(item?.payment_status === 'failed' ||
            item?.payment_status === 'bbps_failure' ||
            item?.payment_status === 'failure_bank' ||
            item?.payment_status === 'failed_pg' ||
            item?.payment_status === 'failed_load') && (
            <div className={css.statusDiv}>
              <img src={ErrorImg} alt="stop" />
              <p className={css.statusText} style={{ color: '#FF0000' }}>
                Failed
              </p>
            </div>
          )}
        </div>
        {(item?.payment_status === 'failed' ||
          item?.payment_status === 'failure_bank') && (
          <Button
            sx={{
              mt: '5px',
            }}
            onClick={() => {
              if (!userRoles?.Payment?.create_payment) {
                setHavePermission({
                  open: true,
                  back: () => {
                    setHavePermission({ open: false });
                  },
                });
                return;
              }

              RetryPay(item.id);
            }}
            className={css.retryButton}
          >
            Retry
          </Button>
        )}
      </div>
    </div>
  );
};

const PaymentHistoryCardLoading = ({ item }) => {
  return (
    <div className={css.PaymentDiv} key={item}>
      <div className={css.leftDiv}>
        <div className={css.headConatin}>
          <p className={css.headName} style={{ marginBottom: 8 }}>
            <Skeleton animation="wave" width="70%" height={16} />
          </p>
          <p className={css.headDate} style={{ marginBottom: 8 }}>
            <Skeleton animation="wave" width="70%" height={12} />
          </p>
        </div>
        <div className={css.secondConatin}>
          <div className={css.secondConatinSub} style={{ marginBottom: 6 }}>
            <p className={css.key}>
              <Skeleton animation="wave" width="90%" height={12} />
            </p>
            <p className={css.value} style={{ flex: 1 }}>
              <Skeleton animation="wave" width="50%" height={12} />
            </p>
          </div>
          <div className={css.secondConatinSub} style={{ marginBottom: 6 }}>
            <p className={css.key}>
              <Skeleton animation="wave" width="90%" height={12} />
            </p>
            <p className={css.value} style={{ flex: 1 }}>
              <Skeleton animation="wave" width="50%" height={12} />
            </p>
          </div>

          <div className={css.secondConatinSub} style={{ marginBottom: 6 }}>
            <p className={css.key}>
              <Skeleton animation="wave" width="90%" height={12} />
            </p>
            <p className={css.value} style={{ flex: 1 }}>
              <Skeleton animation="wave" width="50%" height={12} />
            </p>
          </div>
        </div>
      </div>
      <div className={css.rightDiv}>
        <div className={css.rightContain}>
          <p className={css.rightAmt}>
            <Skeleton animation="wave" width={75} height={16} />
          </p>

          <div className={css.statusDiv}>
            <Skeleton animation="wave" width={55} height={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentHistoryCardMobile = (props) => {
  const { item, RetryPay, cardClick, userRoles, activeTab, setHavePermission } =
    props;
  return (
    <div className={css.PaymentDivMobile}>
      <div className={css.rightDiv} onClick={() => cardClick(item)}>
        <div className={css.rightContain}>
          <div className={css.section1}>
            {(item?.payment_status === 'success_wallet' ||
              item?.payment_status === 'bbps_success' ||
              item?.payment_status === 'success_bank' ||
              item?.payment_status === 'success_load') && (
              <div className={css.statusDiv}>
                <img src={CircleOk} alt="success" />
                <p className={css.statusText} style={{ color: '#00A676' }}>
                  Paid
                </p>
              </div>
            )}
            {(item?.payment_status === 'processing' ||
              item?.payment_status === 'bbps_pending' ||
              item?.payment_status === 'settlement_processing' ||
              item?.payment_status === 'initiated_pg' ||
              item?.payment_status === 'success_pg' ||
              item?.payment_status === 'initiated_load' ||
              item?.payment_status === 'processing_load' ||
              item?.payment_status === 'processing_pg') && (
              <div className={css.statusDiv}>
                <img src={StopWatch} alt="process" />
                <p className={css.statusText} style={{ color: '#F08B32' }}>
                  Processing
                </p>
              </div>
            )}
            {(item?.payment_status === 'failed' ||
              item?.payment_status === 'bbps_failure' ||
              item?.payment_status === 'failure_bank' ||
              item?.payment_status === 'failed_pg' ||
              item?.payment_status === 'failed_load') && (
              <div className={css.statusDiv}>
                <img src={ErrorImg} alt="stop" />
                <p className={css.statusText} style={{ color: '#FF0000' }}>
                  Failed
                </p>
              </div>
            )}
            {/* "2023-06-06 05:48:37 UTC"
             */}

            <p className={css.headDate}>{item?.paid_at}</p>
          </div>

          <p className={css.rightAmt}> {IndianCurrency.format(item?.amount)}</p>
        </div>
      </div>
      <div className={css.leftDiv} onClick={() => cardClick(item)}>
        <div className={css.headConatin}>
          <p className={css.headName}>{item?.beneficiary_name}</p>
          {/* <p className={css.headDate}>
            {moment(item?.date_of_payment).format('MMM DD, YYYY')}
          </p> */}
        </div>
        <div className={css.secondConatin}>
          <div className={css.secondConatinSub}>
            <p className={css.key}>
              {' '}
              {item?.payment_status === 'failed' ||
              item?.payment_status === 'failure_bank'
                ? 'Attempt from'
                : 'Paid From'}
            </p>
            <p className={css.value}>{item?.bank_name}</p>
          </div>
          <div className={css.secondConatinSub}>
            <p className={css.key}>
              {item?.payment_status === 'failed' ||
              item?.payment_status === 'failure_bank'
                ? 'Attempt By'
                : 'Paid By'}
            </p>
            <p className={css.value}>{item?.payer_name}</p>
          </div>
          {(item?.payment_status === 'success_wallet' ||
            item.payment_status === 'success_bank') &&
            item?.bank_reference_number && (
              <div className={css.secondConatinSub}>
                <p className={css.key}>
                  {activeTab === 'vendor' ? 'UTR Number:' : 'Order Id:'}
                </p>
                <p className={css.value}>
                  {activeTab === 'vendor'
                    ? item?.bank_reference_number
                    : item?.order_id}
                </p>
              </div>
            )}
          {(item?.payment_status === 'failed' ||
            item?.payment_status === 'failure_bank') && (
            <Button
              sx={{
                display:
                  item?.payment_status === 'failed' ||
                  item?.payment_status === 'failure_bank'
                    ? 'flex'
                    : 'none',
                mt: '5px',
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!userRoles?.Payment?.create_payment) {
                  setHavePermission({
                    open: true,
                    back: () => {
                      setHavePermission({ open: false });
                    },
                  });
                  return;
                }
                RetryPay(item.id);
              }}
              className={css.retryButton}
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
const PaymentHistoryCardMobileLoading = ({ item }) => {
  return (
    <div className={css.PaymentDivMobile} key={item}>
      <div className={css.rightDiv}>
        <div className={css.rightContain} style={{ marginBottom: 6 }}>
          <div className={css.section1}>
            <div className={css.statusDiv} style={{ width: 80 }}>
              <Skeleton animation="wave" width="100%" height={12} />
            </div>

            <p className={css.headDate} style={{ width: 90 }}>
              <Skeleton animation="wave" width="100%" height={12} />
            </p>
          </div>

          <p className={css.rightAmt} style={{ width: 80 }}>
            <Skeleton animation="wave" width="100%" height={12} />
          </p>
        </div>
      </div>
      <div className={css.leftDiv}>
        <div className={css.headConatin} style={{ marginBottom: 4 }}>
          <p className={css.headName}>
            <Skeleton animation="wave" width="70%" height={16} />
          </p>
        </div>
        <div className={css.secondConatin} style={{ gap: 25 }}>
          <div className={css.secondConatinSub}>
            <p
              className={css.key}
              style={{ minWidth: 'unset', paddingRight: 0 }}
            >
              <Skeleton animation="wave" height={12} />
            </p>
            <p className={css.value}>
              <Skeleton animation="wave" height={12} />
            </p>
          </div>
          <div className={css.secondConatinSub}>
            <p
              className={css.key}
              style={{ minWidth: 'unset', paddingRight: 0 }}
            >
              <Skeleton animation="wave" height={12} />
            </p>
            <p className={css.value}>
              <Skeleton animation="wave" height={12} />
            </p>
          </div>

          <div className={css.secondConatinSub}>
            <p
              className={css.key}
              style={{ minWidth: 'unset', paddingRight: 0 }}
            >
              <Skeleton animation="wave" height={12} />
            </p>
            <p className={css.value}>
              <Skeleton animation="wave" height={12} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentDetilsShow = (props) => {
  const { paymentDetails, handleClose } = props;
  const device = localStorage.getItem('device_detect');

  return (
    <div className={css.paymentHistoryDetail}>
      <div className={`${css.headerContainer} ${css.headerWithClose}`}>
        <div>
          <div className={css.headerLabel}>View Details</div>
          <span className={css.headerUnderline} />
        </div>
        <IconButton onClick={() => handleClose()}>
          <CloseIcon />
        </IconButton>
      </div>

      <div className={`${css.detailsContainer} `}>
        <p className={device === 'mobile' ? css.dialogHeadMob : css.dialogHead}>
          {paymentDetails?.beneficiary_name}
        </p>
        <p className={device === 'mobile' ? css.dialogAmtMob : css.dialogAmt}>
          {FormattedAmount(paymentDetails?.amount)}
        </p>
      </div>

      <>
        {(paymentDetails?.payment_status === 'success_wallet' ||
          paymentDetails?.payment_status === 'bbps_success' ||
          paymentDetails?.payment_status === 'success_bank' ||
          paymentDetails?.payment_status === 'success_load') && (
          <div className={css.tickImg}>
            <Lottie options={defaultOptionsSuccess} />
          </div>
        )}
        {(paymentDetails?.payment_status === 'processing' ||
          paymentDetails?.payment_status === 'bbps_pending' ||
          paymentDetails?.payment_status === 'settlement_processing' ||
          paymentDetails?.payment_status === 'initiated_pg' ||
          paymentDetails?.payment_status === 'success_pg' ||
          paymentDetails?.payment_status === 'initiated_load' ||
          paymentDetails?.payment_status === 'processing_load' ||
          paymentDetails?.payment_status === 'processing_pg') && (
          <div className={css.tickImg}>
            <Lottie options={defaultOptionsProcessing} />
          </div>
        )}
        {(paymentDetails?.payment_status === 'failed' ||
          paymentDetails?.payment_status === 'bbps_failure' ||
          paymentDetails?.payment_status === 'failure_bank' ||
          paymentDetails?.payment_status === 'failed_pg' ||
          paymentDetails?.payment_status === 'failed_load') && (
          <div className={css.tickImg}>
            <Lottie options={defaultOptionsFailed} />
          </div>
        )}
      </>
      <p className={css.dialogDate}>{paymentDetails?.paid_at}</p>
      <p
        className={css.dialogDate}
        style={{ fontSize: 14, fontWeight: 300, color: '#FC3400' }}
      >
        {paymentDetails?.failure_reason || ' '}
      </p>
      <div className={css.contentBody}>
        <div
          className={
            device === 'mobile' ? css.secondConatinSubMob : css.secondConatinSub
          }
        >
          <p className={css.key}>Paid From</p>
          <p className={css.value}>- {paymentDetails?.bank_name}</p>
        </div>
        <div
          className={
            device === 'mobile' ? css.secondConatinSubMob : css.secondConatinSub
          }
        >
          <p className={css.key}>Paid By</p>
          <p className={css.value}>- {paymentDetails?.payer_name}</p>
        </div>
        {paymentDetails?.beneficiary_bank_name && (
          <div
            className={
              device === 'mobile'
                ? css.secondConatinSubMob
                : css.secondConatinSub
            }
          >
            <p className={css.key}>Bank Name</p>
            <p className={css.value}>
              - {paymentDetails?.beneficiary_bank_name}
            </p>
          </div>
        )}
        {paymentDetails?.bank_reference_number && (
          <div
            className={
              device === 'mobile'
                ? css.secondConatinSubMob
                : css.secondConatinSub
            }
          >
            <p className={css.key}>Transaction Number</p>
            <p className={css.value}>
              - {paymentDetails?.bank_reference_number}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
