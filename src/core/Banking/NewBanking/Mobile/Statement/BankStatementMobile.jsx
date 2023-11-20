/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
import React, { memo, useState, useContext, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';

import JSBridge from '@nativeBridge/jsbridge';

import {
  Stack,
  Box,
  Button,
  Typography,
  ButtonGroup,
  Avatar,
  IconButton,
  // Skeleton,
} from '@mui/material';
import { Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';
// import {
//   getBankTxns,
//   emptyTxns,
//   transactionMove,
// } from '@action/Store/Reducers/Banking/StatementState';
import { IndianCurrency } from '@components/utils';

import RestApi, { METHOD, BASE_URL } from '@services/RestApi';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import AppContext from '@root/AppContext';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import axiosInst from '@action/ApiConfig/AxiosInst';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CloseRoundedIon from '@mui/icons-material/CloseRounded';

import CashAccount from '@assets/BankLogo/cashaccount.svg';

import SelectBottomSheet from '../../../../../components/SelectBottomSheet/SelectBottomSheet';
import BottomSelectList from '../Components/BottomSelectList';
import AccountSelect from '../Components/AccountSelect';
import TransactionDetails from '../Components/TransactionDetails';
import StatementLoader from './StatementLoader';

// import MobileCalendar from '../../../../../components/MobileCalendar/DateRangePicker';
import Calendar from '../../../../../assets/calendar.svg';
import Download from '../../../../../assets/st_download.svg';
import Refresh from '../../../../../assets/st_refresh.svg';
// import { StyledMenu, AccountType } from '../../Statement/util';
import * as css from '../bankingmobile.scss';

const listItemData = [
  'Virtual Bank Account',
  'Business Bank Account',
  'Founder’s Bank Account',
];

const datePriodData = [
  'Today',
  'Yesterday',
  'This Week',
  'This Month',
  'This Year',
  'This Quarter',
  // 'Custom',
];

const intialAccButton = {
  virtual: 'Virtual Bank Account',
  business: 'Business Bank Account',
  founder: 'Founder’s Bank Account',
};

export const useStyle = makeStyles({
  checkBoxRoot: {
    paddingTop: '3px !important',
    paddingRight: '0px !important',

    '& .MuiCheckbox-root:not(.Mui-checked)': {
      '& .MuiIconButton-label': {
        color: '#FFFFFF !important',
        border: '1px solid #E5E5E5',
        borderRadius: '2px',
        width: '16px',
        height: '16px',
        margin: '3px',

        '&:hover': {
          background: '#FFFFFF',
        },

        '& .MuiSvgIcon-root': {
          display: 'none',
        },
      },
    },
    '& .MuiCheckbox-colorSecondary.Mui-checked': {
      color: '#F08B32 !important',
    },
    '& .MuiCheckbox-root.Mui-disabled': {
      background: 'rgba(203, 213, 225, 0.5)',
      border: '1px solid rgba(203, 213, 225, 0.5)',
      cursor: 'not-allowed',
    },
  },
});

const derivedMasters = {
  incomecategories: { data: [] },
  expensecategories: { data: [] },
  towards: { inflow: {}, outflow: {}, data: [] },
  type: [
    { name: 'Receipt', id: 'receipt_from_party' },
    { name: 'Payment', id: 'pauyment_to_party' },
  ],
};

const BankStatementMobile = () => {
  const classes = useStyle();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { organization, user, userPermissions } = useContext(AppContext);

  const { bankListingDetails, effortlessAccount } = useSelector(
    (state) => state.Banking
  );

  // const { dataLoad } = useSelector((state) => state.Statement);
  // BankTxns, BankTxnsDetails, loadingOne,

  const {
    accDetails,
    filedDisable,
    fill,
    fillclass,
    datefill,
    period,
    billId,
    paymentStats,
    uploadPDF,
    typeOfImage,
    uploadFlieName,
    uploadId,
    isSuperAccountant,
    // rangefill,
  } = useLocation().state;
  const fillValues = useLocation();

  const initialTabButton =
    accDetails?.bank_account_type === 'company'
      ? {
          first: 'All Transaction',
          second: 'Uncategorized',
          third: 'Categorized',
        }
      : {
          first: 'Personal',
          second: 'Business',
          third: 'Categorized',
        };

  const initialAccount = { btnVal: '', Icon: '' };
  if (
    accDetails?.bank_account_type === 'company' &&
    accDetails?.account_name !== 'Effortless Virtual Account'
  ) {
    initialAccount.btnVal = intialAccButton.business;
    initialAccount.Icon = true;
  } else if (accDetails?.bank_account_type === 'founder') {
    initialAccount.btnVal = intialAccButton.founder;
    initialAccount.Icon = true;
  } else {
    initialAccount.btnVal = intialAccButton.virtual;
    initialAccount.Icon = false;
  }

  const [acctbtnVal, setacctbtnVal] = useState(initialAccount.btnVal);
  const [Account, setAccount] = useState(accDetails);
  const [datePeriod, setDatePeriod] = useState(
    period ? period : datePriodData[4]
  );

  const [date, setDate] = useState(
    datefill
      ? datefill
      : {
          fromDate: moment().startOf('year').format('YYYY-MM-DD'),
          endDate: moment().endOf('year').format('YYYY-MM-DD'),
        }
  );

  const scrollRef = useRef();
  const [oneTransaction, setOneTransaction] = useState('');

  const [accountTypeShow, setAccountTypeShow] = useState(false);
  const [datePeriodShow, setDatePeriodShow] = useState(false);
  const [accountShow, setAccountShow] = useState(false);
  const [transactionShow, setTransactionShow] = useState(false);

  const [tabButton, setTabButton] = useState(initialTabButton);
  const [btnClass, setbtnClass] = useState(
    fillclass ? fillclass : initialTabButton.first
  );
  const [icon, setIcon] = useState(initialAccount.Icon);

  const [filter, setFilter] = useState(fill ? fill : 'all');
  const [page, setPage] = useState(1);
  // const [loading, setLoading] = useState(false);

  const [bankTxns, setBankTxns] = useState([]);
  const [bankTxnsDetails, setBankTxnsDetails] = useState({});
  const [dataLength, setDataLength] = useState([]);
  const [rowLoader, setRowLoader] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState([]);
  const [hasMoreItems, sethasMoreItems] = useState(true);
  const [vendorBillDetails, setVendorBillDetails] = useState('');

  const [havePermission, setHavePermission] = useState({ open: false });

  const handleAccountType = (val) => () => {
    setacctbtnVal(val);
    setAccountTypeShow(false);

    if (val === intialAccButton.founder) {
      setTabButton({
        ...tabButton,
        first: 'Personal',
        second: 'Business',
        third: 'Categorized',
      });
      setbtnClass('Personal');
      setBankTxns([]);
      setBankTxnsDetails({});
      setAccount('');
    } else {
      setTabButton({
        ...tabButton,
        first: 'All Transaction',
        second: 'Uncategorized',
        third: 'Categorized',
      });
      setbtnClass('All Transaction');
      setBankTxns([]);
      setBankTxnsDetails({});
      setAccount('');
    }
  };

  const handleDateChange = (item) => () => {
    let datefillt = {};
    // let rangefillt = [];

    if (item === datePriodData[0]) {
      datefillt = {
        fromDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      };
      // rangefillt = [
      //   moment().format('YYYY-MM-DD'),
      //   moment().format('YYYY-MM-DD'),
      // ];
    } else if (item === datePriodData[1]) {
      datefillt = {
        fromDate: moment().add(-1, 'days').format('YYYY-MM-DD'),
        endDate: moment().add(-1, 'days').format('YYYY-MM-DD'),
      };
      // rangefillt = [
      //   moment().add(-1, 'days').format('YYYY-MM-DD'),
      //   moment().add(-1, 'days').format('YYYY-MM-DD'),
      // ];
    } else if (item === datePriodData[2]) {
      datefillt = {
        fromDate: moment().startOf('week').format('YYYY-MM-DD'),
        endDate: moment().endOf('week').format('YYYY-MM-DD'),
      };
      // rangefillt = [
      //   moment().startOf('week').format('YYYY-MM-DD'),
      //   moment().endOf('week').format('YYYY-MM-DD'),
      // ];
    } else if (item === datePriodData[3]) {
      datefillt = {
        fromDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD'),
      };
      // rangefillt = [
      //   moment().startOf('month').format('YYYY-MM-DD'),
      //   moment().endOf('month').format('YYYY-MM-DD'),
      // ];
    } else if (item === datePriodData[4]) {
      datefillt = {
        fromDate: moment().startOf('year').format('YYYY-MM-DD'),
        endDate: moment().endOf('year').format('YYYY-MM-DD'),
      };
      // rangefillt = [
      //   moment().startOf('year').format('YYYY-MM-DD'),
      //   moment().endOf('year').format('YYYY-MM-DD'),
      // ];
    } else if (item === datePriodData[5]) {
      datefillt = {
        fromDate: moment().startOf('quarter').format('YYYY-MM-DD'),
        endDate: moment().endOf('quarter').format('YYYY-MM-DD'),
      };
      // rangefillt = [
      //   moment().startOf('quarter').format('YYYY-MM-DD'),
      //   moment().endOf('quarter').format('YYYY-MM-DD'),
      // ];
    }

    // if (item === datePriodData[0]) {
    //   setDatePeriod(item);
    //   setDate({
    //     ...date,
    //     fromDate: moment().format('YYYY-MM-DD'),
    //     endDate: moment().format('YYYY-MM-DD'),
    //   });
    // } else if (item === datePriodData[1]) {
    //   setDatePeriod(item);
    //   setDate({
    //     ...date,
    //     fromDate: moment().add(-1, 'days').format('YYYY-MM-DD'),
    //     endDate: moment().add(-1, 'days').format('YYYY-MM-DD'),
    //   });
    // } else if (item === datePriodData[2]) {
    //   setDate({
    //     ...date,
    //     fromDate: moment().startOf('week').format('YYYY-MM-DD'),
    //     endDate: moment().endOf('week').format('YYYY-MM-DD'),
    //   });
    // } else if (item === datePriodData[3]) {
    //   setDatePeriod(item);
    //   setDate({
    //     ...date,
    //     fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    //     endDate: moment().endOf('month').format('YYYY-MM-DD'),
    //   });
    // } else if (item === datePriodData[4]) {
    //   setDatePeriod(item);
    //   setDate({
    //     ...date,
    //     fromDate: moment().startOf('year').format('YYYY-MM-DD'),
    //     endDate: moment().endOf('year').format('YYYY-MM-DD'),
    //   });
    // } else if (item === datePriodData[5]) {
    //   setDatePeriod(item);
    //   setDate({
    //     ...date,
    //     fromDate: moment().startOf('quarter').format('YYYY-MM-DD'),
    //     endDate: moment().endOf('quarter').format('YYYY-MM-DD'),
    //   });
    // }
    setDatePeriod(item);
    setDate(datefillt);

    setDatePeriodShow(false);

    navigate('/banking-statement', {
      state: {
        ...fillValues.state,

        datefill: datefillt,
        period: item,
        // rangefill: rangefillt,
      },
    });
  };

  const handleAccountSelect = (val) => () => {
    setAccount(val);
    setAccountShow(false);
    if (val?.sub_account_group === 'Cash Accounts') {
      setbtnClass('All Transaction');
      setFilter('all');
      navigate('/banking-statement', {
        state: {
          ...fillValues.state,
          fill: 'all',
          fillclass: 'All Transaction',
          accDetails: val,
        },
      });
    } else
      navigate('/banking-statement', {
        state: { ...fillValues.state, accDetails: val },
      });
  };

  const StatementDownload = () => {
    const params = `from_date=${date.fromDate}&to_date=${date.endDate}`;

    JSBridge.downloadWithAuthentication(
      Account.service_provider === 'yodlee'
        ? `${BASE_URL}/organizations/${organization?.orgId}/yodlee_bank_accounts/${Account?.id}/downloads.xlsx?${params}`
        : `${BASE_URL}/organizations/${organization?.orgId}/icici_bank_accounts/${Account?.bank_account_id}/download.xlsx?${params}`
    );
  };

  const btnAction = (val) => () => {
    setbtnClass(val);
    setPage(1);
    sethasMoreItems(true);
    let fillClass = '';

    if (scrollRef.current) scrollRef.current.scrollTop = 0;

    if (val === initialTabButton.first) fillClass = 'all';
    else if (val === initialTabButton.second) fillClass = 'uncat';
    else if (val === initialTabButton.third) fillClass = 'cat';

    setFilter(fillClass);

    navigate('/banking-statement', {
      state: { ...fillValues.state, fill: fillClass, fillclass: val },
    });
  };

  const BankAccountsGroupBusiness = (data) => {
    const dateGroupData = data?.reduce((x, y) => {
      (x[moment(y.date).format('DD MMM YYYY')] =
        x[moment(y.date).format('DD MMM YYYY')] || []).push(y);
      return x;
    }, []);

    setBankTxnsDetails((prev) => ({ ...prev, ...dateGroupData }));
    setRowLoader('dataLoaded');
  };

  const BankAccountsGroupPersonal = (data) => {
    const dateGroupData = data?.reduce((x, y) => {
      (x[moment(y.date).format('DD MMM YYYY')] =
        x[moment(y.date).format('DD MMM YYYY')] || []).push(y);
      return x;
    }, []);

    const newArray = {};
    // const temparr = [];

    Object.keys(dateGroupData)?.forEach((item) => {
      if (btnClass !== 'Categorized') {
        const filteredcat = dateGroupData[item].filter(
          (obj) =>
            obj.txn_category === btnClass.toLowerCase() &&
            obj.categorized === false
        );
        if (filteredcat.length !== 0) newArray[item] = filteredcat;
      } else {
        const filteredcat = dateGroupData[item].filter(
          (obj) => obj.categorized === true
        );
        if (filteredcat.length !== 0) newArray[item] = filteredcat;
      }
    });

    setBankTxnsDetails((prev) => ({ ...prev, ...newArray }));
    setRowLoader('dataLoaded');
  };

  const FetchConnectedBankingTxns = () => {
    // let fillacctbtnVal = '';
    // if (
    //   accDetails?.bank_account_type === 'company' &&
    //   accDetails?.account_name !== 'Effortless Virtual Account'
    // )
    //   fillacctbtnVal = intialAccButton.business;
    // else if (accDetails?.bank_account_type === 'founder')
    //   fillacctbtnVal = intialAccButton.founder;
    // else fillacctbtnVal = intialAccButton.virtual;

    let params = '';

    if (acctbtnVal === intialAccButton.founder)
      params =
        filter === 'cat'
          ? `from_date=${date.fromDate}&to_date=${date.endDate}&categorized=true&page=${page}`
          : `from_date=${date.fromDate}&to_date=${date.endDate}&txn_category=${
              filter === 'all' ? 'personal' : 'business'
            }&page=${page}`;
    else
      params =
        filter === 'all'
          ? `from_date=${date.fromDate}&to_date=${date.endDate}&page=${page}`
          : `from_date=${date.fromDate}&to_date=${date.endDate}&categorized=${
              filter === 'cat' ? 'true' : 'false'
            }&page=${page}`;

    axiosInst
      .get(
        Account?.service_provider === 'yodlee'
          ? `organizations/${organization?.orgId}/yodlee_bank_accounts/${Account?.id}/txns?${params}`
          : `organizations/${organization?.orgId}/icici_bank_accounts/${Account?.bank_account_id}/txns?${params}`
      )
      .then((res) => {
        if (res && !res.error) {
          setBankTxns(res.data);

          setDataLength((prev) => [...prev, ...res.data.data]);
          if (accDetails?.bank_account_type === 'company')
            BankAccountsGroupBusiness(res?.data?.data);
          else {
            BankAccountsGroupPersonal(res?.data?.data);
          }

          dispatch(enableLoading(false));
        } else if (res.error) {
          dispatch(
            openSnackbar({
              message: res.message,
              type: MESSAGE_TYPE.ERROR,
            })
          );
          dispatch(enableLoading(false));
        }
      })
      .catch((e) => {
        dispatch(enableLoading(false));

        dispatch(
          openSnackbar({
            message: e.message,
            type: MESSAGE_TYPE.ERROR,
          })
        );
      });
  };

  // const DateRangeSelector = (dates) => {
  //   setDate({
  //     ...date,
  //     fromDate: moment(dates[0]).format('YYYY-MM-DD'),
  //     endDate: moment(dates[1]).format('YYYY-MM-DD'),
  //   });
  //   setDatePeriod(
  //     `${moment(dates[0]).format('DD/MM/YY')} to ${moment(dates[1]).format(
  //       'DD/MM/YY'
  //     )}`
  //   );

  //   setcalendarShow(true);
  // };

  const TransactionMove = () => {
    let cat;
    if (btnClass === 'Personal') cat = 'business';
    else if (btnClass === 'Business') cat = 'personal';

    dispatch(enableLoading(true));
    axiosInst
      .patch(
        `organizations/${organization?.orgId}/yodlee_bank_accounts/${Account?.id}/txn_update`,
        {
          ids: selectedTransaction,
          txn_category: cat,
        }
      )
      .then((res) => {
        if (res && !res.data.error && res.data.success) {
          dispatch(
            openSnackbar({
              message: 'Transaction moved successfully.',
              type: MESSAGE_TYPE.INFO,
            })
          );
          setBankTxnsDetails([]);
          setRowLoader('');
          // dispatch(emptyTxns());
          FetchConnectedBankingTxns();
          setSelectedTransaction([]);
        } else if (res.error) {
          dispatch(
            openSnackbar({
              message: res.message,
              type: MESSAGE_TYPE.ERROR,
            })
          );
        }

        dispatch(enableLoading(false));
      })
      .catch((e) => {
        dispatch(enableLoading(false));

        dispatch(
          openSnackbar({
            message: e.message,
            type: MESSAGE_TYPE.ERROR,
          })
        );
      });
  };

  const TransactionSelect = (id) => (e) => {
    e.stopPropagation();

    e.preventDefault();
    if (e.target.checked) setSelectedTransaction([...selectedTransaction, id]);
    else
      setSelectedTransaction([
        ...selectedTransaction?.slice(0, selectedTransaction?.indexOf(id)),
        ...selectedTransaction?.slice(selectedTransaction?.indexOf(id) + 1),
      ]);
  };

  const TransactionView = (row) => () => {
    if (paymentStats?.id) {
      if(Number(row?.amount) < 0){
        navigate('/bill-upload', {
          state: {
            selected: { ...vendorBillDetails, bank_txn_id: row?.id, payment_mode: paymentStats?.id, payer_account_id: accDetails?.bank_account_id,file_url:uploadPDF,typeOfImage,uploadFlieName,uploadId,isSuperAccountant },
            banking: true
          },
        });
    } else {
        dispatch(
          openSnackbar({
            message: 'Please select different transaction',
            type: MESSAGE_TYPE.ERROR,
          })
        );
      }
      return;
    }
    setOneTransaction(row);
    setTransactionShow(true);
  };

  const loadMore = () => {
    if (page >= bankTxns.pages) sethasMoreItems(false);
    else setPage((prev) => prev + 1);
  };

  const fetchExpenseCategoryDetails = () => {
    dispatch(enableLoading(true));
    const params = {
      category_type: 'expense_category',
    };
    const tquery = Object.keys(params)
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');
    const query = `?${tquery}`;
    const urls = `organizations/${organization?.orgId}/accounts${query}`;
    RestApi(urls, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user?.activeToken}`,
      },
    })
      .then((res) => {
        const newdata = res.data.filter((ecategory) => {
          return ecategory.active;
        });
        derivedMasters.expensecategories.data = newdata;
        dispatch(enableLoading(false));
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: e.message,
            type: MESSAGE_TYPE.INFO,
          })
        );
      });
  };

  const fetchIncomeCategoryDetails = () => {
    dispatch(enableLoading(true));
    const urls = `organizations/${organization?.orgId}/income_categories`;
    RestApi(urls, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user?.activeToken}`,
      },
    })
      .then((res) => {
        const newdata = res.data.filter((ecategory) => {
          return ecategory.active;
        });
        derivedMasters.incomecategories.data = newdata;
        dispatch(enableLoading(false));
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: e.message,
            type: MESSAGE_TYPE.INFO,
          })
        );
      });
  };

  const fetchTowardsDetails = () => {
    dispatch(enableLoading(true));
    const urls = `organizations/${organization?.orgId}/accounts/categorization_account_list`;
    RestApi(urls, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user?.activeToken}`,
      },
    })
      .then((res) => {
        derivedMasters.towards.data = res.data;
        derivedMasters.towards.data.push({
          id: 'expense',
          name: 'Expenses',
          inflow_description: 'Expense',
          outflow_description: 'Expense',
        });
        derivedMasters.towards.data.push({
          id: 'income',
          name: 'Income',
          inflow_description: 'Income',
          outflow_description: 'Income',
        });
        const newlist1 = {};
        const newlist2 = {};
        res.data.forEach((toward) => {
          newlist1[toward.inflow_description] = toward;
          newlist2[toward.outflow_description] = toward;
        });
        derivedMasters.towards.inflow = newlist1;
        derivedMasters.towards.outflow = newlist2;
        dispatch(enableLoading(false));
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: e.message,
            type: MESSAGE_TYPE.INFO,
          })
        );
      });
  };

  const CategTransactionSelect = (tranDetail) => () => {
    if (
      !userPermissions?.Banking?.['Categorizing Transactions']
        ?.view_categorization
    ) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }

    const alldata = { data: [] };
    let counter = 0;
    let rowfound = 0;

    const datanew = bankTxns?.data?.map((data) => {
      const temp = { ...data, index: counter };
      counter += 1;
      return temp;
    });

    const tr = datanew.filter((item) => item.id === tranDetail.id);

    alldata.data = datanew.filter(
      (data) => data.txn_category.toLowerCase() === 'business'
    );

    if (bankTxns.data && bankTxns.data.length > 0) {
      const ndataten = bankTxns.data.filter(
        (data) => data.txn_category.toLowerCase() === 'business'
      );
      ndataten.forEach((banktransaction, index) => {
        if (banktransaction.id === tranDetail.id) {
          rowfound = index;
        }
      });
    }

    localStorage.setItem('pagestart', rowfound);
    localStorage.setItem('itemstatus', tranDetail.categorized ? 'Edit' : 'Add');

    navigate('/banking-categorization', {
      state: {
        status: !tranDetail.categorized ? 'Add' : 'Edit',
        row: rowfound,
        selecteddata: tr[0],
        masterslist: derivedMasters,
        alldata,
        bankDetails: {
          bankName: accDetails.bank_name,
          bankId: accDetails.bank_account_id,
          bankAccountNumber: accDetails.bank_account_number,
        },
      },
    });
  };

  const TnxsRefresh = () => {
    if (Account.service_provider === 'yodlee') return;

    dispatch(enableLoading(true));
    axiosInst
      .get(
        Account.service_provider === 'yodlee'
          ? `organizations/${organization?.orgId}/yodlee_bank_accounts/${Account?.id}/sync`
          : `organizations/${organization?.orgId}/icici_bank_accounts/${Account?.bank_account_id}/sync`
      )
      .then((res) => {
        if (res && !res.data?.error && res.data?.success) {
          dispatch(
            openSnackbar({
              message: res.data.message,
              type: MESSAGE_TYPE.INFO,
            })
          );
          FetchConnectedBankingTxns();
        } else {
          dispatch(
            openSnackbar({
              message: res.data.message,
              type: MESSAGE_TYPE.ERROR,
            })
          );
          FetchConnectedBankingTxns();
        }

        dispatch(enableLoading(false));
      })
      .catch(() => {
        // dispatch(
        //   openSnackbar({
        //     message: e.message,
        //     type: MESSAGE_TYPE.ERROR,
        //   })
        // );
        dispatch(enableLoading(false));
      });
  };

  // const CategTransactionSelect = (tranDetail) => () => {
  //   const alldata = { data: [] };
  //   let counter = 0;
  //   let rowfound = 0;

  //   const datanew = bankTxnsDetails.map((data) => {
  //     data.index = counter;
  //     counter += 1;
  //     return data;
  //   });

  //   alldata.data = datanew.filter(
  //     (data) => data.txn_category.toLowerCase() === 'business'
  //   );

  //   if (bankTxnsDetails && bankTxnsDetails.length > 0) {
  //     const ndataten = bankTxnsDetails.filter(
  //       (data) => data.txn_category.toLowerCase() === 'business'
  //     );
  //     ndataten.forEach((banktransaction, index) => {
  //       if (banktransaction.id === tranDetail.id) {
  //         rowfound = index;
  //       }
  //     });
  //   }

  //   localStorage.setItem('pagestart', rowfound);
  //   localStorage.setItem('itemstatus', tranDetail.categorized ? 'Edit' : 'Add');

  //   navigate('/bankingcategorization', {
  //     state: {
  //       status: !tranDetail.categorized ? 'Add' : 'Edit', // selected transaction already categorized ? "Edit" : "Add"
  //       bankaccountid: accDetails.bank_account_id, // Bank Account ID
  //       selectedtype: 'others', //
  //       row: rowfound, //
  //       alldata, // All Business Category Transactions
  //       bankname: accDetails.bank_name, // Bank Name
  //       bankaccount: accDetails.bank_account_number, // Bank Account  Number
  //       bankid: accDetails.bank_account_id, // Bank Account ID
  //       selecteddata: tranDetail, // Selected Transaction Details
  //       masterslist: derivedMasters,
  //     },
  //   });
  //   // navigate('/bill-upload', { state: { tranDetail } });
  // };

  const getVendorBillDetails = () => {
    axiosInst
      .get(`organizations/${organization?.orgId}/vendor_bills/${billId}`)
      .then((res) => {
        // if (res && !res.error) {
        //   setVendorBillDetails(res.data);
        // } else if (res.error) {
        //   openSnackbar({
        //     message: res.message,
        //     type: MESSAGE_TYPE.ERROR,
        //   });
        // }
        setVendorBillDetails(res.data);

        enableLoading(false);
      })
      .catch((e) => {
        dispatch(
          openSnackbar({
            message: e.message,
            type: MESSAGE_TYPE.ERROR,
          })
        );
      });
  };

  useEffect(() => {
    if (acctbtnVal === 'Virtual Bank Account') {
      const Efaccount = bankListingDetails.filter(
        (row) => row?.account_name === 'Effortless Virtual Account'
      );

      if (Object.keys(effortlessAccount || {}).length > 0)
        setAccount(Efaccount[0]);
      else
        dispatch(
          openSnackbar({
            message: 'No virtual account found',
            type: MESSAGE_TYPE.ERROR,
          })
        );

      setIcon(false);
    } else {
      setIcon(true);
    }
  }, [acctbtnVal]);

  useEffect(() => {
    fetchTowardsDetails();
    fetchExpenseCategoryDetails();
    fetchIncomeCategoryDetails();
    if (paymentStats?.id) {
      const callFunc = btnAction(tabButton.second);
      callFunc();
    }
  }, []);

  // useEffect(() => {
  //   if (
  //     accDetails?.bank_account_type === 'company' &&
  //     accDetails?.account_name !== 'Effortless Virtual Account'
  //   ) {
  //     setacctbtnVal(intialAccButton.business);
  //     setIcon(true);
  //   } else if (accDetails?.bank_account_type === 'founder') {
  //     setacctbtnVal(intialAccButton.founder);
  //     setIcon(true);
  //   } else {
  //     setacctbtnVal(intialAccButton.virtual);
  //     setIcon(false);
  //   }
  //   setAccount(accDetails);
  // }, [accDetails]);

  useEffect(() => {
    if (page !== 1) {
      FetchConnectedBankingTxns();
      setRowLoader('');
    }
  }, [page]);

  useEffect(() => {
    if (Account !== '') {
      setSelectedTransaction([]);
      setBankTxnsDetails({});
      setPage(1);

      setRowLoader('');
      FetchConnectedBankingTxns();
    }
  }, [datePeriod, Account, filter]);

  useEffect(() => {
    if (billId) getVendorBillDetails();
  }, [billId]);

  // if (dataLoad === null) return null;

  return (
    <>
      <Box className={css.mobilestcontainer}>
        <Stack className={css.accountcalendarwrp}>
          <Button
            aria-expanded={accountTypeShow ? 'true' : undefined}
            variant="contained"
            disableElevation
            onClick={() => setAccountTypeShow(true)}
            endIcon={<KeyboardArrowDownOutlinedIcon />}
            className={css.dropdownbtn}
            disabled={filedDisable === 'true'}
          >
            {`${acctbtnVal.split(' ')?.[0]} ${acctbtnVal.split(' ')?.[2]}`}
          </Button>

          <Button
            variant="contained"
            disableElevation
            onClick={() => setDatePeriodShow(true)}
            startIcon={
              <>
                <img src={Calendar} alt="calendar" style={{ zIndex: 1 }} />
              </>
            }
            endIcon={<KeyboardArrowDownOutlinedIcon />}
            className={`${css.dropdownbtn} ${css.dateicon}`}
          >
            {datePeriod}
          </Button>
        </Stack>

        <Button
          aria-expanded={accountShow ? 'true' : undefined}
          variant="contained"
          disableElevation
          endIcon={icon && <KeyboardArrowDownOutlinedIcon />}
          className={css.dropdownbtn}
          onClick={() => icon && setAccountShow(true)}
          sx={{
            width: '100%',
            justifyContent: 'flex-start',
            marginBottom: '8px',
          }}
          disabled={filedDisable === 'true' && !icon}
        >
          {Account !== '' ? (
            <>
              <img
                src={
                  Account.sub_account_group === 'Cash Accounts'
                    ? CashAccount
                    : `https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/${
                        Account?.account_name === 'Effortless Virtual Account'
                          ? 'effortless'
                          : Account.bank_code
                      }.svg`
                }
                alt="Bank Logo"
                width="24px"
                height="24px"
                style={{ marginRight: 8 }}
                onError={(e) => {
                  e.target.src =
                    'https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/unknown.svg';
                }}
                loading="lazy"
              />
              {Account.sub_account_group === 'Cash Accounts'
                ? Account?.display_name
                : Account?.account_name !== 'Effortless Virtual Account'
                ? `${Account?.bank_name} - xxxx ${
                    Account?.bank_account_number?.slice(-4) || '-'
                  }`
                : 'Effortless Account'}
            </>
          ) : (
            'Select Bank Account'
          )}
        </Button>

        <Stack className={css.synciconwrp}>
          {selectedTransaction.length !== 0 ? (
            <>
              <Stack className={css.movetranwrp}>
                <Typography className={css.seltrancoounrt}>
                  {`${selectedTransaction.length} Transaction Selected`}
                </Typography>
                <IconButton
                  className={css.closeiconbtn}
                  onClick={() => setSelectedTransaction([])}
                >
                  <CloseRoundedIon className={css.closeicon} />
                </IconButton>
              </Stack>
              <Button className={css.tranmovesubmit} onClick={TransactionMove}>
                {`Move to ${btnClass === 'Personal' ? 'Business' : 'Personal'}`}
              </Button>
            </>
          ) : (
            <>
              <Typography className={css.lastsync}>
                {`Last Sync : ${
                  accDetails.lastsync !== ''
                    ? moment(accDetails.lastsync).format('DD-MM-YYYY hh:mm A')
                    : 'Not available'
                }`}
              </Typography>
              <ButtonGroup variant="outlined" className={css.btngroup}>
                {Account?.service_provider === 'icici' && (
                  <Button className={css.actionbtn} onClick={TnxsRefresh}>
                    <Avatar
                      className={css.actionbtnicon}
                      alt="refresh icon"
                      src={Refresh}
                    />
                  </Button>
                )}
                <Button className={css.actionbtn} onClick={StatementDownload}>
                  <Avatar
                    className={css.actionbtnicon}
                    alt="download icon"
                    src={Download}
                  />
                </Button>
              </ButtonGroup>
            </>
          )}
        </Stack>

        <Stack
          className={css.tabwrp}
          sx={{
            pointerEvents:
              Account.sub_account_group === 'Cash Accounts' &&
              'none !important',
          }}
        >
          <Button
            className={
              btnClass === tabButton.first
                ? `${css.tabs} ${css.active}`
                : css.tabs
            }
            onClick={btnAction(tabButton.first)}
            disabled={filedDisable === 'true'}
          >
            {tabButton.first}
          </Button>
          <Button
            className={
              btnClass === tabButton.second
                ? `${css.tabs} ${css.active}`
                : css.tabs
            }
            onClick={btnAction(tabButton.second)}
            // disabled={filedDisable === 'true'}
          >
            {tabButton.second}
          </Button>
          <Button
            className={
              btnClass === tabButton.third
                ? `${css.tabs} ${css.active}`
                : css.tabs
            }
            onClick={btnAction(tabButton.third)}
            disabled={filedDisable === 'true'}
          >
            {tabButton.third}
          </Button>
        </Stack>

        <Stack className={css.amountscontainer}>
          <Stack className={css.amountwrp}>
            <Stack>
              <Typography className={`${css.amounttitle} ${css.openbal}`}>
                Opening Balance
              </Typography>
              <Typography className={css.amount}>
                {IndianCurrency.format(Math.abs(bankTxns.opening_balance || 0))}
              </Typography>
            </Stack>
            <Stack>
              <Typography
                className={`${css.amounttitle} ${css.closebal} `}
                sx={{ textAlign: 'right' }}
              >
                Closing Balance
              </Typography>
              <Typography className={css.amount} sx={{ textAlign: 'right' }}>
                {IndianCurrency.format(Math.abs(bankTxns.closing_balance || 0))}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            className={css.amountwrp}
            sx={{ marginBottom: '0 !important' }}
          >
            <Stack>
              <Typography className={`${css.amounttitle} ${css.totalinbal} `}>
                Total Inflow
              </Typography>
              <Typography className={css.amount}>
                {IndianCurrency.format(Math.abs(bankTxns.inflow || 0))}
              </Typography>
            </Stack>
            <Stack>
              <Typography
                className={`${css.amounttitle} ${css.totaloutbal} `}
                sx={{ textAlign: 'right' }}
              >
                Total Outflow
              </Typography>
              <Typography className={css.amount} sx={{ textAlign: 'right' }}>
                {IndianCurrency.format(Math.abs(bankTxns.outflow || 0))}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {acctbtnVal === intialAccButton.founder ? (
          <Box
            className={css.transactioncontainer}
            id="tableContainerFounder"
            ref={scrollRef}
          >
            <InfiniteScroll
              dataLength={dataLength.length}
              next={loadMore}
              // loader={<h3>Loading...</h3>}
              hasMore={hasMoreItems}
              scrollableTarget="tableContainerFounder"
            >
              {rowLoader === '' ? (
                <StatementLoader rowNm={15} />
              ) : (
                <>
                  {Object.keys(bankTxnsDetails)?.map((item) => (
                    <Stack key={item}>
                      <Stack className={css.datesticky}>
                        <Typography className={css.transacdate}>
                          {item}
                        </Typography>
                      </Stack>

                      {bankTxnsDetails[item]?.map((row) => (
                        <Stack
                          className={css.transacsubcontainer}
                          key={row.id}
                          onClick={TransactionView(row)}
                        >
                          {btnClass === 'Categorized' ? (
                            <>
                              <Stack className={css.transacdescwrp}>
                                <Typography className={css.transacdesc}>
                                  {row.party_name || '-'}
                                </Typography>

                                <Typography
                                  className={
                                    Number(row.amount) > 0
                                      ? css.transacdescamtpos
                                      : css.transacdescamtneg
                                  }
                                >
                                  {`₹ ${row.formatted_amount}`}
                                </Typography>
                              </Stack>
                              <Stack className={css.transacsubdescwrp}>
                                <Typography className={css.transacsubdesc}>
                                  {row.narration}
                                </Typography>
                                <Typography className={css.transacbal}>
                                  {`Bal : ₹ ${row.formatted_running_balance}`}
                                </Typography>
                              </Stack>
                            </>
                          ) : (
                            <Stack className={css.transacsubdescwrp}>
                              <Stack
                                sx={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <span className={classes.checkBoxRoot}>
                                  <Checkbox
                                    onChange={TransactionSelect(row.id)}
                                    checked={selectedTransaction.includes(
                                      row.id
                                    )}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </span>
                                <Typography className={css.transacsubdesc}>
                                  {row.narration}
                                </Typography>
                              </Stack>

                              <Typography
                                className={
                                  Number(row.amount) > 0
                                    ? css.transacdescamtpos
                                    : css.transacdescamtneg
                                }
                              >
                                {`₹ ${row.formatted_amount}`}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      ))}
                    </Stack>
                  ))}
                </>
              )}
            </InfiniteScroll>
          </Box>
        ) : (
          <Box
            className={css.transactioncontainer}
            id="tableContainerBusiness"
            ref={scrollRef}
          >
            <InfiniteScroll
              dataLength={dataLength.length}
              next={loadMore}
              // loader={<h3>Loading...</h3>}
              hasMore={hasMoreItems}
              scrollableTarget="tableContainerBusiness"
            >
              {rowLoader === '' ? (
                <StatementLoader rowNm={15} />
              ) : (
                <>
                  {Object.keys(bankTxnsDetails)?.map((item) => (
                    <Stack key={item}>
                      <Stack className={css.datesticky}>
                        <Typography className={css.transacdate}>
                          {item}
                        </Typography>
                      </Stack>
                      {bankTxnsDetails[item].map((row) => (
                        <Stack
                          className={css.transacsubcontainer}
                          key={row.id}
                          onClick={TransactionView(row)}
                        >
                          <Stack className={css.transacdescwrp}>
                            <Typography className={css.transacdesc}>
                              {row.party_name ? row.party_name : '-'}
                            </Typography>
                            <Typography
                              className={
                                Number(row.amount) > 0
                                  ? css.transacdescamtpos
                                  : css.transacdescamtneg
                              }
                            >
                              {`₹ ${row.formatted_amount}`}
                            </Typography>
                          </Stack>
                          <Stack className={css.transacsubdescwrp}>
                            <Typography className={css.transacsubdesc}>
                              {row.narration}
                            </Typography>
                            <Typography className={css.transacbal}>
                              {`Bal : ₹ ${row.formatted_running_balance}`}
                            </Typography>
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  ))}
                </>
              )}
            </InfiniteScroll>
          </Box>
        )}
      </Box>

      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}

      <SelectBottomSheet
        triggerComponent
        open={accountTypeShow}
        name="Account Type"
        onClose={() => setAccountTypeShow(false)}
        addNewSheet
      >
        <BottomSelectList
          onClose={() => setAccountTypeShow(false)}
          handleChange={handleAccountType}
          selectedValue={acctbtnVal}
          title="Select Account Type"
          data={listItemData}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={datePeriodShow}
        name="Period Select"
        onClose={() => setDatePeriodShow(false)}
        addNewSheet
      >
        <BottomSelectList
          // onClose={() => setAccountTypeShow(false)}
          handleChange={handleDateChange}
          selectedValue={datePeriod}
          title="hide"
          data={datePriodData}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={accountShow}
        name="Account Select"
        onClose={() => setAccountShow(false)}
        addNewSheet
      >
        <AccountSelect
          onClose={() => setAccountShow(false)}
          handleAccountSelect={handleAccountSelect}
          title="Business Account Type"
          bankListingDetails={bankListingDetails}
          intialAccButton={intialAccButton}
          acctbtnVal={acctbtnVal}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={transactionShow}
        name="Transaction Detail"
        onClose={() => setTransactionShow(false)}
        addNewSheet
      >
        <TransactionDetails
          onClose={() => setTransactionShow(false)}
          title="Transaction details"
          data={oneTransaction}
          CategorizeTransaction={CategTransactionSelect}
          accDetails={accDetails}
        />
      </SelectBottomSheet>
    </>
  );
};

export default memo(BankStatementMobile);
