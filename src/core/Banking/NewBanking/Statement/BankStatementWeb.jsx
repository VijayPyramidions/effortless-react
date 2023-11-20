/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
import React, { memo, useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import InfiniteScroll from 'react-infinite-scroll-component';

import {
  Box,
  Stack,
  Typography,
  ButtonGroup,
  Button,
  Avatar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  IconButton,
  Grid,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

import { Checkbox } from '@material-ui/core';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import axiosInst from '@action/ApiConfig/AxiosInst';

import { getBankList } from '@action/Store/Reducers/Banking/BankingState';

import {
  getBankTxns,
  emptyTxns,
  // transactionMove,
} from '@action/Store/Reducers/Banking/StatementState';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import MobileCalendar from '@components/MobileCalendar/DateRangePicker';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import { IndianCurrency } from '@components/utils';

import { BASE_URL } from '@services/RestApi';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import AppContext from '@root/AppContext';

import CashAccount from '@assets/BankLogo/cashaccount.svg';

import Download from '@assets/st_download.svg';
// import Upload from '@assets/st_upload.svg';
import Refresh from '@assets/st_refresh.svg';
import OpenBal from '@assets/st_open_bal.svg';
import Inflow from '@assets/st_total_inflow.svg';
import Outflow from '@assets/st_total_outflow.svg';
import CloseBal from '@assets/st_close_bal.svg';
import Calendar from '@assets/calendar.svg';

import { TranStatus, AccountType, StyledMenu, DateListItem } from './util';

import * as css from '../bankingnew.scss';
import TableRowsLoader from '../Mobile/Statement/TableRowLoader';

export const useStyle = makeStyles({
  checkBoxRoot: {
    paddingTop: '3px !important',
    paddingRight: '0px !important',
    flexDirection: 'row !important',
    alignItems: 'center',

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

const intialAccButton = {
  virtual: 'Virtual Bank Account',
  business: 'Business Bank Account',
  founder: 'Founder’s Bank Account',
};

const derivedMasters = {
  incomecategories: { data: [] },
  expensecategories: { data: [] },
  towards: { inflow: {}, outflow: {}, data: [] },
  type: [
    { name: 'Receipt', id: 'receipt_from_party' },
    { name: 'Payment', id: 'payment_to_party' },
  ],
};

const BankStatementWeb = () => {
  const { bankListingDetails } = useSelector((state) => state.Banking);

  const {
    accDetails,
    filedDisable,
    billId,
    fill,
    fillclass,
    datefill,
    period,
    rangefill,
    paymentStats,
    uploadPDF,
    typeOfImage,
    uploadFlieName,
    uploadId,
    isSuperAccountant,
  } = useLocation().state;

  const fillValues = useLocation();

  const classes = useStyle();
  const { organization, user, userPermissions } = useContext(AppContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { BankTxns, BankTxnsDetails, loadingOne } = useSelector(
    (state) => state.Statement
  );
  const { effortlessAccount } = useSelector((state) => state.Banking);

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

  const [title, setTitle] = useState(initialTabButton.first);
  const [tabButton, setTabButton] = useState(initialTabButton);
  const [btnClass, setbtnClass] = useState(
    fillclass ? fillclass : initialTabButton.first
  );
  const [columCount, setColumnCount] = useState({ business: 7, founder: 5 });

  const [acctbtnVal, setacctbtnVal] = useState(
    accDetails?.bank_account_type === 'company' &&
      accDetails?.account_name !== 'Effortless Virtual Account'
      ? intialAccButton.business
      : accDetails?.bank_account_type === 'founder'
      ? intialAccButton.founder
      : intialAccButton.virtual
  );

  const [search, setSearch] = useState('');
  const [calendarShow, setcalendarShow] = useState(true);

  const [filteredBanks, setfilteredBanks] = useState([]);
  const [bankLength, setbankLength] = useState(0);
  const [loading, setLoading] = useState('Loading');
  const [Account, setAccount] = useState(accDetails);
  // const [bankTxns, setBankTxns] = useState([]);
  // const [bankTxnsDetails, setBankTxnsDetails] = useState([]);
  const [date, setDate] = useState(
    datefill
      ? datefill
      : {
          fromDate: moment().startOf('year').format('YYYY-MM-DD'),
          endDate: moment().endOf('year').format('YYYY-MM-DD'),
        }
  );
  const [datePeriod, setDatePeriod] = useState(
    period ? period : DateListItem[4]
  );
  const [datePeriodCalendar, setDatePeriodCalendar] = useState(
    rangefill
      ? rangefill
      : [
          moment().startOf('year').format('YYYY-MM-DD'),
          moment().endOf('year').format('YYYY-MM-DD'),
        ]
  );
  const [filter, setFilter] = useState(fill ? fill : 'all');

  const [accTypeEl, setAccTypeEl] = useState(null);
  const [accountEl, setAccountEl] = useState(null);
  const [dateEl, setDateEl] = useState(null);

  const open = Boolean(accTypeEl);
  const accountopen = Boolean(accountEl);
  const dateopen = Boolean(dateEl);

  const [selectedTransaction, setSelectedTransaction] = useState([]);
  const [vendorBillDetails, setVendorBillDetails] = useState('');
  // const [LoadingOne, setLoadingOne] = useState(false);
  const [havePermission, setHavePermission] = useState({ open: false });
  console.log(vendorBillDetails);

  // Infinite Scroll Start //
  const [hasMoreItems, sethasMoreItems] = useState(true);
  const [page, setPage] = useState(1);
  // Infinite Scroll  End//

  const handleClick = (event) => {
    setAccTypeEl(event.currentTarget);
  };

  const handleClose = (val) => () => {
    setacctbtnVal(val);
    setAccTypeEl(null);
    sethasMoreItems(false);
    setPage(1);
    setFilter('all');

    if (val === intialAccButton.founder) {
      setTabButton({
        ...tabButton,
        first: 'Personal',
        second: 'Business',
        third: 'Categorized',
      });
      setbtnClass('Personal');
      setTitle('Personal');

      setAccount('');
    } else {
      setTabButton({
        ...tabButton,
        first: 'All Transaction',
        second: 'Uncategorized',
        third: 'Categorized',
      });

      setbtnClass('All Transaction');
      setTitle('All Transaction');

      setAccount('');
    }
    dispatch(emptyTxns());
  };

  const handleAccountSelect = (val) => () => {
    if (Account?.bank_account_id !== val.bank_account_id) dispatch(emptyTxns());
    setAccount(val);
    setAccountEl(null);
    sethasMoreItems(true);
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

  const btnAction = (val) => () => {
    setbtnClass(val);
    setTitle(val);
    if (val !== btnClass) dispatch(emptyTxns());

    // setBankTxnsDetails([]);
    setPage(1);
    sethasMoreItems(true);
    let fillClass = '';

    if (val === tabButton.first) fillClass = 'all';
    else if (val === tabButton.second) fillClass = 'uncat';
    else if (val === tabButton.third) fillClass = 'cat';

    setFilter(fillClass);

    if (acctbtnVal === intialAccButton.founder) {
      if (val === 'Personal') setColumnCount({ ...columCount, founder: 5 });
      else if (val === 'Business')
        setColumnCount({ ...columCount, founder: 6 });
      else setColumnCount({ ...columCount, founder: 6 });
    } else if (acctbtnVal === intialAccButton.business) {
      if (val === 'All Transaction')
        setColumnCount({ ...columCount, business: 7 });
      else if (val === 'Uncategorized')
        setColumnCount({ ...columCount, business: 5 });
      else setColumnCount({ ...columCount, business: 7 });
    }

    navigate('/banking-statement', {
      state: { ...fillValues.state, fill: fillClass, fillclass: val },
    });
  };

  const dropDownAccountFilter = () => {
    let type;
    if (acctbtnVal === intialAccButton.business) type = 'company';
    else if (acctbtnVal === intialAccButton.founder) type = 'founder';
    else type = 'virtual';

    if (type === 'company' || type === 'founder') {
      const filteredRow = bankListingDetails.filter((row) =>
        row.sub_account_group === 'Cash Accounts'
          ? row.bank_account_type === type &&
            row.account_name !== 'Effortless Virtual Account' &&
            row?.display_name?.toLowerCase()?.includes(search?.toLowerCase())
          : row.bank_account_type === type &&
            row.account_name !== 'Effortless Virtual Account' &&
            row?.bank_name?.toLowerCase()?.includes(search?.toLowerCase())
      );

      const len = bankListingDetails.filter(
        (row) =>
          row.bank_account_type === type &&
          row.account_name !== 'Effortless Virtual Account'
      );

      setbankLength(len?.length);
      setfilteredBanks(filteredRow);
      setLoading('loaded');
    } else if (type === 'virtual') {
      const Efaccount = bankListingDetails.filter(
        (row) => row.account_name === 'Effortless Virtual Account'
      );

      setAccount(Efaccount[0]);
    }
  };

  const FetchConnectedBankingTxns = () => {
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
    dispatch(
      getBankTxns({
        provider: Account?.service_provider,
        account_id: Account
          ? Account?.service_provider === 'yodlee'
            ? Account?.id
            : Account?.bank_account_id
          : accDetails?.service_provider === 'yodlee'
          ? accDetails?.id
          : accDetails?.bank_account_id,
        params,
      })
    );

    // RestApi(
    //   Account.service_provider === 'yodlee' || Account.service_provider === null
    //     ? `organizations/${organization?.orgId}/yodlee_bank_accounts/${Account?.id}/txns?${params}`
    //     : `organizations/${organization?.orgId}/icici_bank_accounts/${Account?.bank_account_id}/txns?${params}`,
    //   {
    //     method: METHOD.GET,
    //     headers: {
    //       Authorization: `Bearer ${user?.activeToken}`,
    //     },
    //   }
    // )
    //   .then((res) => {
    //     if (res && !res.error) {
    //       setBankTxns(res);
    //       setBankTxnsDetails((prev) => [...prev, ...res.data]);
    //       enableLoading(false);
    //       setLoadingOne(false);
    //     } else if (res.error) {
    //       openSnackbar({
    //         message: res.message,
    //         type: MESSAGE_TYPE.ERROR,
    //       });
    //       enableLoading(false);
    //       setLoadingOne(false);
    //     }
    //   })
    //   .catch((e) => {
    //     enableLoading(false);
    //     setLoadingOne(false);
    //     openSnackbar({
    //       message: e.message,
    //       type: MESSAGE_TYPE.ERROR,
    //     });
    //   });
  };

  const StatementDownload = () => {
    enableLoading(true);

    const params = `from_date=${date.fromDate}&to_date=${date.endDate}`;

    fetch(
      Account?.service_provider === 'yodlee'
        ? `${BASE_URL}/organizations/${organization?.orgId}/yodlee_bank_accounts/${Account?.id}/downloads.xlsx?${params}`
        : `${BASE_URL}/organizations/${organization?.orgId}/icici_bank_accounts/${Account?.bank_account_id}/download.xlsx?${params}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        enableLoading(false);

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `statement from ${date.fromDate} to ${date.endDate}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
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

  const TnxsRefresh = () => {
    if (Account?.service_provider === 'yodlee') return;
    dispatch(enableLoading(true));
    axiosInst
      .get(
        Account?.service_provider === 'yodlee'
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
        dispatch(enableLoading(false));
      });
  };

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

          dispatch(emptyTxns());
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

  const handleDateChange = (item) => () => {
    let datefillt = {};
    let rangefillt = [];

    if (item === DateListItem[0]) {
      datefillt = {
        fromDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      };
      rangefillt = [
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ];
    } else if (item === DateListItem[1]) {
      datefillt = {
        fromDate: moment().add(-1, 'days').format('YYYY-MM-DD'),
        endDate: moment().add(-1, 'days').format('YYYY-MM-DD'),
      };
      rangefillt = [
        moment().add(-1, 'days').format('YYYY-MM-DD'),
        moment().add(-1, 'days').format('YYYY-MM-DD'),
      ];
    } else if (item === DateListItem[2]) {
      datefillt = {
        fromDate: moment().startOf('week').format('YYYY-MM-DD'),
        endDate: moment().endOf('week').format('YYYY-MM-DD'),
      };
      rangefillt = [
        moment().startOf('week').format('YYYY-MM-DD'),
        moment().endOf('week').format('YYYY-MM-DD'),
      ];
    } else if (item === DateListItem[3]) {
      datefillt = {
        fromDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD'),
      };
      rangefillt = [
        moment().startOf('month').format('YYYY-MM-DD'),
        moment().endOf('month').format('YYYY-MM-DD'),
      ];
    } else if (item === DateListItem[4]) {
      datefillt = {
        fromDate: moment().startOf('year').format('YYYY-MM-DD'),
        endDate: moment().endOf('year').format('YYYY-MM-DD'),
      };
      rangefillt = [
        moment().startOf('year').format('YYYY-MM-DD'),
        moment().endOf('year').format('YYYY-MM-DD'),
      ];
    } else if (item === DateListItem[5]) {
      datefillt = {
        fromDate: moment().startOf('quarter').format('YYYY-MM-DD'),
        endDate: moment().endOf('quarter').format('YYYY-MM-DD'),
      };
      rangefillt = [
        moment().startOf('quarter').format('YYYY-MM-DD'),
        moment().endOf('quarter').format('YYYY-MM-DD'),
      ];
    }

    setDatePeriod(item);

    setDate(datefillt);
    setDatePeriodCalendar(rangefillt);
    navigate('/banking-statement', {
      state: {
        ...fillValues.state,

        datefill: datefillt,
        period: item,
        rangefill: rangefillt,
      },
    });
    setDateEl(null);
    if (item !== datePeriod) dispatch(emptyTxns());
  };

  const DateRangeSelector = (dates) => {
    setDatePeriodCalendar(dates);
    setDate({
      ...date,
      fromDate: dates[0] && moment(dates[0]).format('YYYY-MM-DD'),
      endDate: dates[1] && moment(dates[1]).format('YYYY-MM-DD'),
    });
    setDatePeriod(
      `${(dates[0] && moment(dates[0]).format('DD/MM/YY')) || '-'} to ${
        (dates[1] && moment(dates[1]).format('DD/MM/YY')) || '-'
      }`
    );
    navigate('/banking-statement', {
      state: {
        ...fillValues.state,

        datefill: {
          fromDate: dates[0] && moment(dates[0]).format('YYYY-MM-DD'),
          endDate: dates[1] && moment(dates[1]).format('YYYY-MM-DD'),
        },
        period: `${
          (dates[0] && moment(dates[0]).format('DD/MM/YY')) || '-'
        } to ${(dates[1] && moment(dates[1]).format('DD/MM/YY')) || '-'}`,
        rangefill: dates,
      },
    });
    setcalendarShow(true);
    dispatch(emptyTxns());
  };

  const TransactionSelect = (id) => (e) => {
    if (e.target.checked) setSelectedTransaction([...selectedTransaction, id]);
    else
      setSelectedTransaction([
        ...selectedTransaction.slice(0, selectedTransaction.indexOf(id)),
        ...selectedTransaction.slice(selectedTransaction.indexOf(id) + 1),
      ]);
  };

  const loadMore = () => {
    if (BankTxns.pages !== undefined) {
      if (page >= BankTxns.pages) {
        sethasMoreItems(false);
      } else {
        setPage((prev) => prev + 1);
      }
    }
  };

  const fetchExpenseCategoryDetails = () => {
    enableLoading(true);
    const params = {
      category_type: 'expense_category',
    };
    const tquery = Object.keys(params)
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');
    const query = `?${tquery}`;
    const urls = `organizations/${organization?.orgId}/accounts${query}`;
    axiosInst
      .get(urls)
      .then((res) => {
        const newdata = res.data.data.filter((ecategory) => {
          return ecategory.active;
        });
        derivedMasters.expensecategories.data = newdata;
        enableLoading(false);
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
    enableLoading(true);
    const urls = `organizations/${organization?.orgId}/income_categories`;
    axiosInst
      .get(urls)
      .then((res) => {
        const newdata = res.data.data.filter((ecategory) => {
          return ecategory.active;
        });
        derivedMasters.incomecategories.data = newdata;
        enableLoading(false);
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
    enableLoading(true);
    const urls = `organizations/${organization?.orgId}/accounts/categorization_account_list`;
    axiosInst
      .get(urls)
      .then((res) => {
        derivedMasters.towards.data = res.data.data;
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
        res.data.data.forEach((toward) => {
          newlist1[toward.inflow_description] = toward;
          newlist2[toward.outflow_description] = toward;
        });
        derivedMasters.towards.inflow = newlist1;
        derivedMasters.towards.outflow = newlist2;
        enableLoading(false);
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
    if (paymentStats?.id) {
      if (Number(tranDetail?.amount) < 0) {
        navigate('/bill-upload', {
          state: {
            selected: {
              ...vendorBillDetails,
              bank_txn_id: tranDetail?.id,
              payment_mode: paymentStats?.id,
              payer_account_id: accDetails?.bank_account_id,
              file_url: uploadPDF,
              typeOfImage,
              uploadFlieName,
              uploadId,
              isSuperAccountant,
            },
            banking: true,
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
    if (
      acctbtnVal === intialAccButton.virtual ||
      (Account?.sub_account_group === 'Cash Accounts' &&
        Number(tranDetail.amount) > 0)
    )
      return;

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

    const datanew = BankTxnsDetails.map((data) => {
      const temp = { ...data, index: counter };
      counter += 1;
      return temp;
    });

    const tr = datanew.filter((item) => item.id === tranDetail.id);

    alldata.data = datanew.filter(
      (data) => data?.txn_category?.toLowerCase() === 'business'
    );

    if (BankTxnsDetails && BankTxnsDetails.length > 0) {
      const ndataten = BankTxnsDetails.filter(
        (data) => data?.txn_category?.toLowerCase() === 'business'
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
          bankName:
            Account?.sub_account_group === 'Cash Accounts'
              ? 'Cash Account'
              : Account?.bank_name,
          bankId: Account?.bank_account_id,
          bankAccountNumber:
            Account?.sub_account_group === 'Cash Accounts'
              ? Account?.display_name
              : Account?.bank_account_number,
        },
      },
    });
  };

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

  const txnIdCopy = (id) => (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    dispatch(
      openSnackbar({
        message: 'Transaction id copied.',
        type: MESSAGE_TYPE.INFO,
      })
    );
  };

  useEffect(() => {
    fetchTowardsDetails();
    fetchExpenseCategoryDetails();
    fetchIncomeCategoryDetails();
    dispatch(getBankList());
    if (paymentStats?.id) {
      const callFunc = btnAction(tabButton.second);
      callFunc();
    }
    return () => {
      dispatch(emptyTxns());
    };
  }, []);

  useEffect(() => {
    if (billId) getVendorBillDetails();
  }, [billId]);

  useEffect(() => {
    dropDownAccountFilter();
  }, [search, acctbtnVal]);

  useEffect(() => {
    if (Account !== '') {
      if (page === 1) setSelectedTransaction([]);
      FetchConnectedBankingTxns();
    }
  }, [datePeriod, Account, filter, page]);

  useEffect(() => {
    setAccount(accDetails);
  }, [accDetails]);

  return (
    <>
      <Box className={css.statementcontainer}>
        <Stack className={css.headercontainer}>
          <Stack className={css.titlewrp}>
            <Typography variant="h4" className={css.titletext}>
              {title}
            </Typography>
            <Stack className={css.categbtnwrp}>
              {BankTxns?.uncategorized > 0 && filter === 'all' && (
                <Button
                  className={css.categalert}
                  onClick={() => {
                    setFilter('uncat');
                    setTitle(initialTabButton.second);
                    setbtnClass(initialTabButton.second);
                    setColumnCount({ ...columCount, founder: 6 });
                    dispatch(emptyTxns());
                  }}
                >
                  <span className={css.uncategcount}>
                    {BankTxns?.uncategorized}
                  </span>
                  <Typography className={css.uncategtext}>
                    Uncategorized Transactions
                  </Typography>
                </Button>
              )}

              <ButtonGroup variant="contained" className={css.btngroup}>
                <Button className={css.actionbtn} onClick={StatementDownload}>
                  <Avatar
                    className={css.actiontbnicon}
                    alt="icon logo"
                    src={Download}
                  />
                  Download
                </Button>
                {/* <Button className={css.actionbtn}>
                  <Avatar
                    className={css.actiontbnicon}
                    alt="icon logo"
                    src={Upload}
                  />
                  Upload
                </Button> */}

                {Account?.service_provider === 'icici' && (
                  <Button className={css.actionbtn} onClick={TnxsRefresh}>
                    <Avatar
                      className={css.actiontbnicon}
                      alt="icon logo"
                      src={Refresh}
                    />
                    Refresh
                  </Button>
                )}
              </ButtonGroup>
            </Stack>
          </Stack>

          <Stack className={css.filterelwrp}>
            <Grid
              className={css.balamountwrp}
              container
              spacing={{ md: 4, lg: 2 }}
              columns={{ md: 12, lg: 12 }}
            >
              <Grid item md={6} lg={4.5}>
                <Stack>
                  <ButtonGroup
                    variant="contained"
                    className={css.trantbnwrp}
                    sx={{
                      pointerEvents:
                        Account?.sub_account_group === 'Cash Accounts' &&
                        'none !important',
                    }}
                  >
                    <Button
                      className={
                        btnClass === tabButton.first
                          ? `${css.tranbtnactive} ${
                              btnClass === 'All Transaction' && css.padd
                            }`
                          : `${css.tranbtn} ${
                              tabButton.first === 'All Transaction' && css.padd
                            }`
                      }
                      onClick={btnAction(tabButton.first)}
                      disabled={filedDisable === 'true'}
                    >
                      {tabButton.first}
                    </Button>
                    <Button
                      className={
                        btnClass === tabButton.second
                          ? css.tranbtnactive
                          : css.tranbtn
                      }
                      // disabled={filedDisable === 'true'}
                      onClick={btnAction(tabButton.second)}
                    >
                      {tabButton.second}
                    </Button>
                    <Button
                      className={
                        btnClass === tabButton.third
                          ? css.tranbtnactive
                          : css.tranbtn
                      }
                      disabled={filedDisable === 'true'}
                      onClick={btnAction(tabButton.third)}
                    >
                      {tabButton.third}
                    </Button>
                  </ButtonGroup>
                </Stack>
              </Grid>

              {selectedTransaction.length === 0 ? (
                <>
                  <Grid item md={6} lg={2}>
                    <Stack>
                      <Button
                        aria-expanded={open ? 'true' : undefined}
                        variant="contained"
                        disableElevation
                        onClick={handleClick}
                        endIcon={<KeyboardArrowDownOutlinedIcon />}
                        className={css.dropdownbtn}
                        disabled={filedDisable === 'true'}
                      >
                        {`${acctbtnVal.split(' ')?.[0]} ${
                          acctbtnVal.split(' ')?.[2]
                        }`}
                      </Button>
                      <StyledMenu
                        anchorEl={accTypeEl}
                        open={open}
                        onClose={() => setAccTypeEl(null)}
                        listwidth={184}
                      >
                        {Object.keys(intialAccButton).map((val) => (
                          <>
                            {val === 'virtual' ? (
                              <>
                                {Object.keys(effortlessAccount || {}).length >
                                  0 && (
                                  <MenuItem
                                    onClick={handleClose(intialAccButton[val])}
                                    disableRipple
                                    selected={
                                      acctbtnVal === intialAccButton[val]
                                    }
                                    key={val}
                                  >
                                    {intialAccButton[val]}
                                  </MenuItem>
                                )}
                              </>
                            ) : (
                              <MenuItem
                                onClick={handleClose(intialAccButton[val])}
                                disableRipple
                                selected={acctbtnVal === intialAccButton[val]}
                                key={val}
                              >
                                {intialAccButton[val]}
                              </MenuItem>
                            )}
                          </>
                        ))}
                      </StyledMenu>
                    </Stack>
                  </Grid>

                  <Grid item md={6} lg={2.7}>
                    <Stack>
                      <Button
                        aria-expanded={accountopen ? 'true' : undefined}
                        variant="contained"
                        disableElevation
                        onClick={(e) => {
                          setAccountEl(e.currentTarget);
                          dropDownAccountFilter();
                        }}
                        endIcon={<KeyboardArrowDownOutlinedIcon />}
                        className={css.dropdownbtn}
                        sx={
                          Account !== ''
                            ? { padding: '8px 12px !important' }
                            : { padding: '10px 12px !important' }
                        }
                        disabled={
                          filedDisable === 'true' ||
                          Account?.account_name === 'Effortless Virtual Account'
                        }
                      >
                        {Account !== '' ? (
                          <>
                            <img
                              src={
                                Account?.sub_account_group === 'Cash Accounts'
                                  ? CashAccount
                                  : `https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/${
                                      Account?.account_name ===
                                      'Effortless Virtual Account'
                                        ? 'effortless'
                                        : Account?.bank_code
                                    }.svg`
                              }
                              alt="bank logo"
                              onError={(e) => {
                                e.target.src =
                                  'https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/unknown.svg';
                              }}
                              style={{
                                marginRight: 8,
                                width: '24px',
                                height: '24px',
                              }}
                              loading="lazy"
                            />
                            {Account?.sub_account_group === 'Cash Accounts'
                              ? Account?.display_name
                              : Account?.account_name !==
                                'Effortless Virtual Account'
                              ? `${Account?.bank_name} - xxxx ${
                                  Account?.bank_account_number?.slice(-4) || '-'
                                }`
                              : 'Effortless Account'}
                          </>
                        ) : (
                          'Select Bank Account'
                        )}
                      </Button>
                      <StyledMenu
                        anchorEl={accountEl}
                        open={accountopen}
                        onClose={() => setAccountEl(null)}
                        sx={{
                          '& .MuiPaper-root': {
                            padding: 0,
                          },

                          '& .MuiMenuItem-root': {
                            marginBottom: '0px !important',
                            justifyContent: 'space-between',
                          },
                        }}
                        listwidth={224}
                      >
                        {bankLength > 5 && (
                          <Stack className={css.searchBanks}>
                            <input
                              name="search"
                              type="search"
                              placeholder="Search Bank"
                              className={css.searchInput}
                              onChange={(e) => {
                                e.stopPropagation();
                                setSearch(e.target.value);
                              }}
                              onKeyDown={(e) => e.stopPropagation()}
                              value={search}
                            />
                          </Stack>
                        )}

                        {filteredBanks?.slice(0, 5)?.map((val) => (
                          <MenuItem
                            onClick={handleAccountSelect(val)}
                            disableRipple
                            key={val?.bank_account_id || val?.id}
                          >
                            <Stack className={css.banklogowrp}>
                              <img
                                src={
                                  val?.sub_account_group === 'Cash Accounts'
                                    ? CashAccount
                                    : `https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/${
                                        val?.account_name ===
                                        'Effortless Virtual Account'
                                          ? 'effortless'
                                          : val?.bank_code
                                      }.svg`
                                }
                                onError={(e) => {
                                  e.target.src =
                                    'https://axb-tally-bridge.s3.ap-south-1.amazonaws.com/bank_logos/unknown.svg';
                                }}
                                alt="Bank Logo"
                                width="20px"
                                height="20px"
                                loading="lazy"
                                style={{ marginRight: 8 }}
                              />
                              <Stack>
                                <Typography className={css.bankname}>
                                  {val?.sub_account_group === 'Cash Accounts'
                                    ? val?.display_name?.length > 15
                                      ? `${val?.display_name?.slice(0, 13)}...`
                                      : val?.display_name
                                    : val?.bank_name?.length > 15
                                    ? `${val?.bank_name?.slice(0, 13)}...`
                                    : val?.bank_name}
                                </Typography>
                                {val?.sub_account_group !== 'Cash Accounts' && (
                                  <Typography className={css.accnumber}>
                                    {`xxxx ${
                                      val?.bank_account_number?.slice(-4) || '-'
                                    }`}
                                  </Typography>
                                )}
                              </Stack>
                            </Stack>
                            {AccountType[val.account_type]}
                          </MenuItem>
                        ))}
                        {filteredBanks.length === 0 && (
                          <MenuItem>
                            {loading === 'Loading'
                              ? 'Loading...'
                              : 'No banks found'}
                          </MenuItem>
                        )}
                      </StyledMenu>
                    </Stack>
                  </Grid>

                  <Grid item md={6} lg={2.8}>
                    <Stack>
                      <Button
                        id="demo-customized-button"
                        aria-controls={
                          dateopen ? 'demo-customized-menu' : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={dateopen ? 'true' : undefined}
                        variant="contained"
                        disableElevation
                        onClick={(e) => setDateEl(e.currentTarget)}
                        startIcon={
                          <>
                            <img
                              src={Calendar}
                              alt="calendar"
                              style={{ zIndex: 1 }}
                            />
                          </>
                        }
                        endIcon={<KeyboardArrowDownOutlinedIcon />}
                        className={`${css.dropdownbtn} ${css.dateicon}`}
                      >
                        {datePeriod}
                      </Button>
                      <StyledMenu
                        anchorEl={dateEl}
                        open={dateopen}
                        onClose={() => setDateEl(null)}
                        sx={{
                          '& .MuiPaper-root': {
                            padding: '8px 0',
                          },

                          '& .MuiMenuItem-root': {
                            marginBottom: '8px !important',
                          },
                        }}
                      >
                        {calendarShow ? (
                          <>
                            {DateListItem.map((row) => (
                              <MenuItem
                                key={row}
                                disableRipple
                                onClick={handleDateChange(row)}
                              >
                                {row}
                              </MenuItem>
                            ))}
                            <MenuItem
                              disableRipple
                              sx={{
                                color: '#f08b32 !important',
                                fontWeight: '500 !important',
                                marginBottom: 0,
                              }}
                              onClick={() => setcalendarShow(false)}
                            >
                              Custom
                            </MenuItem>
                          </>
                        ) : (
                          <MobileCalendar
                            DateRangeSelector={DateRangeSelector}
                            onClose={() => setDateEl(null)}
                            onCancel={() => setcalendarShow(true)}
                            dateRange={datePeriodCalendar}
                          />
                        )}
                      </StyledMenu>
                    </Stack>
                  </Grid>
                </>
              ) : (
                <Grid item md={12} lg={6}>
                  <Stack className={css.movetranwrp}>
                    <Button
                      className={css.movesubmit}
                      onClick={TransactionMove}
                    >
                      {`Move to
                   ${
                     btnClass === 'Personal' ? 'business' : 'personal'
                   } transaction`}
                    </Button>
                    <Typography className={css.selectedtranscount}>
                      {`${selectedTransaction.length} Transaction Selected`}
                    </Typography>
                    <IconButton
                      className={css.closeicon}
                      onClick={() => setSelectedTransaction([])}
                    >
                      <CloseRoundedIcon />
                    </IconButton>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </Stack>

          <Grid
            className={css.balamountwrp}
            container
            spacing={{ md: 4, lg: 2 }}
            columns={{ md: 12, lg: 12 }}
          >
            <Grid item md={6} lg={3}>
              <Stack className={css.balamtelwrp}>
                <Avatar alt="open" src={OpenBal} className={css.balamticon} />
                <Stack>
                  <Typography className={css.balamttitle}>
                    Opening Balance
                  </Typography>
                  <Typography className={css.balamt}>
                    {IndianCurrency.format(
                      Math.abs(BankTxns.opening_balance || 0)
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item md={6} lg={3}>
              <Stack className={css.balamtelwrp}>
                <Avatar
                  alt="total inflow"
                  src={Inflow}
                  className={css.balamticon}
                />
                <Stack>
                  <Typography className={css.balamttitle}>
                    Total Inflow
                  </Typography>
                  <Typography className={css.balamt}>
                    {IndianCurrency.format(Math.abs(BankTxns.inflow || 0))}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item md={6} lg={3}>
              <Stack className={css.balamtelwrp}>
                <Avatar
                  alt="total outflow"
                  src={Outflow}
                  className={css.balamticon}
                />
                <Stack>
                  <Typography className={css.balamttitle}>
                    Total Outflow
                  </Typography>
                  <Typography className={css.balamt}>
                    {IndianCurrency.format(Math.abs(BankTxns.outflow || 0))}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item md={6} lg={3}>
              <Stack className={css.balamtelwrp}>
                <Avatar alt="close" src={CloseBal} className={css.balamticon} />
                <Stack>
                  <Typography className={css.balamttitle}>
                    Closing Balance
                  </Typography>
                  <Typography className={css.balamt}>
                    {IndianCurrency.format(
                      Math.abs(BankTxns.closing_balance || 0)
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Stack>

        <InfiniteScroll
          dataLength={BankTxnsDetails?.length}
          next={loadMore}
          // loader={<TableCell>Loading...</TableCell>}

          hasMore={hasMoreItems}
          scrollableTarget="tableContainer"
        >
          <TableContainer
            className={css.st_table_container}
            id="tableContainer"
          >
            <Table sx={{ minWidth: 650 }} stickyHeader>
              {acctbtnVal === intialAccButton.founder ? (
                <>
                  <TableHead>
                    <TableRow className={css.table_head_row}>
                      {btnClass !== 'Categorized' && <TableCell />}

                      <TableCell sx={{ minWidth: 105, paddingLeft: '23px' }}>
                        Date
                      </TableCell>
                      {btnClass === 'Business' && <TableCell>Status</TableCell>}
                      {btnClass === 'Categorized' && (
                        <>
                          <TableCell sx={{ minWidth: 115 }}>Party</TableCell>

                          <TableCell sx={{ minWidth: 115 }}>Purpose</TableCell>
                        </>
                      )}
                      <TableCell>Description</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>Inflow</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>Outflow</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {BankTxnsDetails?.length > 0 ? (
                      <>
                        {loadingOne ? (
                          <TableRowsLoader
                            rowsNum={15}
                            cellNum={columCount.founder}
                          />
                        ) : (
                          <>
                            {BankTxnsDetails?.map((val) => (
                              <TableRow
                                className={css.table_body_row}
                                sx={{ cursor: 'pointer' }}
                                key={val.id}
                                onClick={
                                  val.txn_category !== 'personal' &&
                                  CategTransactionSelect(val)
                                }
                              >
                                {btnClass !== 'Categorized' && (
                                  <TableCell className={classes.checkBoxRoot}>
                                    <Checkbox
                                      onChange={TransactionSelect(val.id)}
                                      checked={selectedTransaction.includes(
                                        val.id
                                      )}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </TableCell>
                                )}

                                <TableCell
                                  className={css.date}
                                  sx={
                                    btnClass === 'Categorized'
                                      ? {
                                          minWidth: 105,
                                          paddingLeft: '23px !important',
                                        }
                                      : {
                                          minWidth: 105,
                                        }
                                  }
                                >
                                  {moment.utc(val.date).format('MMM Do, YYYY')}
                                </TableCell>

                                {btnClass === 'Business' && (
                                  <TableCell className={css.status}>
                                    {TranStatus(val.status)}
                                  </TableCell>
                                )}
                                {btnClass === 'Categorized' && (
                                  <>
                                    <TableCell className={css.party}>
                                      {val.party_name || '-'}
                                    </TableCell>
                                    <TableCell className={css.party}>
                                      {val.purpose || '-'}
                                    </TableCell>
                                  </>
                                )}
                                <TableCell className={css.desc}>
                                  <Typography className={css.desc_title}>
                                    {val.narration || '-'} <br />
                                    {val.narration &&
                                      val.narration.length > 0 && (
                                        <div
                                          style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <span>{`Ref # : ${val.id}`}</span>

                                          <IconButton
                                            style={{
                                              marginLeft: 8,
                                              padding: '4px',
                                            }}
                                            onClick={txnIdCopy(val.id)}
                                          >
                                            <ContentCopyRoundedIcon
                                              style={{ width: 16, height: 16 }}
                                            />
                                          </IconButton>
                                        </div>
                                      )}
                                  </Typography>
                                </TableCell>
                                <TableCell className={css.inflow}>
                                  {Number(val.amount) > 0
                                    ? `₹${val.formatted_amount}`
                                    : ' '}
                                </TableCell>
                                <TableCell className={css.outflow}>
                                  {Number(val.amount) < 0
                                    ? `₹${val.formatted_amount}`
                                    : ' '}
                                </TableCell>
                              </TableRow>
                            ))}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {loadingOne ? (
                          <TableRowsLoader
                            rowsNum={15}
                            cellNum={columCount.founder}
                          />
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={
                                btnClass === 'Personal'
                                  ? 5
                                  : btnClass === 'Business'
                                  ? 6
                                  : 7
                              }
                              sx={{ textAlign: 'center', borderBottom: 'none' }}
                            >
                              No data found
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )}
                  </TableBody>
                </>
              ) : (
                <>
                  <TableHead>
                    <TableRow className={css.table_head_row}>
                      <TableCell sx={{ minWidth: 105, paddingLeft: '23px' }}>
                        Date
                      </TableCell>
                      {btnClass === 'Categorized' && (
                        <>
                          <TableCell sx={{ minWidth: 140 }}>Doc.No</TableCell>
                          <TableCell>Party</TableCell>
                          <TableCell>Purpose</TableCell>
                        </>
                      )}
                      {btnClass === 'All Transaction' && (
                        <TableCell>Status</TableCell>
                      )}
                      {(btnClass === 'All Transaction' ||
                        acctbtnVal === intialAccButton.virtual) && (
                        <TableCell sx={{ minWidth: 115 }}>
                          Party & Purpose
                        </TableCell>
                      )}

                      {/* //acctbtnVal === intialAccButton.business  */}
                      <TableCell>Description</TableCell>
                      {btnClass === 'Uncategorized' && (
                        <TableCell>Status</TableCell>
                      )}

                      <TableCell sx={{ textAlign: 'right' }}>Inflow</TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>Outflow</TableCell>
                      {btnClass === 'All Transaction' && (
                        <TableCell sx={{ textAlign: 'right' }}>
                          Balance
                        </TableCell>
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {BankTxnsDetails?.length > 0 ? (
                      <>
                        {loadingOne ? (
                          <TableRowsLoader
                            rowsNum={15}
                            cellNum={columCount.business}
                          />
                        ) : (
                          <>
                            {BankTxnsDetails?.map((val) => (
                              <TableRow
                                className={css.table_body_row}
                                key={val.id}
                                onClick={CategTransactionSelect(val)}
                                sx={{
                                  cursor: 'pointer',
                                }}
                              >
                                <TableCell
                                  className={css.date}
                                  sx={{
                                    minWidth: 105,
                                    paddingLeft: '23px !important',
                                  }}
                                >
                                  {moment.utc(val.date).format('MMM Do, YYYY')}
                                </TableCell>
                                {btnClass === 'Categorized' && (
                                  <>
                                    <TableCell
                                      className={css.party}
                                      sx={{
                                        fontWeight: '400 !important',
                                        color: '#3049BF !important',
                                        minWidth: '100px',
                                      }}
                                    >
                                      {val.voucher_reference || '-'}
                                    </TableCell>
                                    <TableCell className={css.party}>
                                      {val.party_name || '-'}
                                    </TableCell>
                                    <TableCell className={css.party}>
                                      {val.purpose || '-'}
                                    </TableCell>
                                  </>
                                )}

                                {btnClass === 'All Transaction' && (
                                  <TableCell className={css.status}>
                                    {TranStatus(val.status)}
                                  </TableCell>
                                )}
                                {(btnClass === 'All Transaction' ||
                                  acctbtnVal === intialAccButton.virtual) && (
                                  <TableCell className={css.party}>
                                    {val.party_name || '-'} <br />
                                    {val.purpose || '-'}
                                  </TableCell>
                                )}

                                <TableCell className={css.desc}>
                                  <Typography className={css.desc_title}>
                                    {val.narration || '-'} <br />
                                    {val.narration &&
                                      val.narration.length > 0 && (
                                        <div
                                          style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                          }}
                                        >
                                          <span>{`Ref # : ${val.id}`}</span>

                                          <IconButton
                                            style={{
                                              marginLeft: 8,
                                              padding: '4px',
                                            }}
                                            onClick={txnIdCopy(val.id)}
                                          >
                                            <ContentCopyRoundedIcon
                                              style={{ width: 16, height: 16 }}
                                            />
                                          </IconButton>
                                        </div>
                                      )}
                                  </Typography>

                                  {/* <Typography className={css.desc_subtitle}>
                        xxxxxxxxxx2242 with account number xxxx2242 has been
                        added.
                      </Typography> */}
                                </TableCell>

                                {btnClass === 'Uncategorized' && (
                                  <TableCell className={css.status}>
                                    {TranStatus(val.status)}
                                  </TableCell>
                                )}

                                <TableCell className={css.inflow}>
                                  {Number(val?.amount || 0) > 0
                                    ? `₹${val?.formatted_amount}`
                                    : `-`}
                                </TableCell>

                                <TableCell className={css.outflow}>
                                  {Number(val?.amount || 0) < 0
                                    ? `₹${val?.formatted_amount}`
                                    : `-`}
                                </TableCell>

                                {btnClass === 'All Transaction' && (
                                  <TableCell className={css.balance}>
                                    {IndianCurrency.format(val.running_balance)}
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {loadingOne ? (
                          <TableRowsLoader
                            rowsNum={15}
                            cellNum={columCount.business}
                          />
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={
                                btnClass === 'Personal'
                                  ? 5
                                  : btnClass === 'Business'
                                  ? 6
                                  : 7
                              }
                              sx={{ textAlign: 'center', borderBottom: 'none' }}
                            >
                              No data found
                            </TableCell>
                          </TableRow>
                        )}
                      </>

                      // <TableRow>
                      //   <TableCell
                      //     colSpan={7}
                      //     sx={{ textAlign: 'center', borderBottom: 'none' }}
                      //   >
                      //     {loadingOne ? 'Loading...' : 'No data.'}
                      //   </TableCell>
                      // </TableRow>
                    )}
                  </TableBody>
                </>
              )}
            </Table>
          </TableContainer>
        </InfiniteScroll>

        {havePermission.open && (
          <PermissionDialog onClose={() => havePermission.back()} />
        )}
      </Box>
    </>
  );
};

export default memo(BankStatementWeb);
