/* eslint-disable no-nested-ternary  */

import React, { useState, useEffect } from 'react';
import * as Mui from '@mui/material';
import * as Router from 'react-router-dom';
import * as MuiIcon from '@mui/icons-material';
import { makeStyles } from '@material-ui/core/styles';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import moment from 'moment';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import AppContext from '@root/AppContext.jsx';
import Radio from '@material-ui/core/Radio';
import deleteBin from '@assets/binRed.svg';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import syncIcon from '@assets/sync.svg';
import CategorizationBnk from '@assets/CategorizationBnk.png';
import DownloadBnk from '@assets/Download-Bnk.png';
import sortBanking from '@assets/sortBanking.svg';
import Group from '@assets/WebAssets/Group.svg';
import { BankingDownoad } from '@components/SvgIcons/SvgIcons.jsx';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import Calender from '@core/InvoiceView/Calander';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import * as css from './BankAccountDetails.scss';
import * as css2 from './AccountBalance.scss';

const useStyles = makeStyles(() => ({
  tableHeadFonts: {
    fontSize: '12px',
  },
  colr: {
    height: '1px',
    backgroundColor: '  #6E6E6E',
  },
  colrs: {
    height: '1px',
    backgroundColor: '#F08B32',
  },
  fontcolr: {
    color: ' white',
  },

  text: {
    fontSize: '17px !important',
    fontWeight: '400 !important',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    color: '#283049',
    textTransform: 'capitalize',
  },
  text1: {
    fontSize: '16px !important',
    fontWeight: '400 !important',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    color: '#283049',
    textTransform: 'capitalize',
  },
  payments: {
    paddingTop: '23px !important',
    '& :nth-child(odd)': {
      backgroundColor: '#36e3c0',
    },
  },
}));
const derivedMasters = {
  incomecategories: { data: [] },
  expensecategories: { data: [] },
  towards: { inflow: {}, outflow: {}, data: [] },
  type: [
    { name: 'Receipt', id: 'receipt_from_party' },
    { name: 'Payment', id: 'pauyment_to_party' },
  ],
};
const categoryList = {};

const AccountBalance = () => {
  const classes = useStyles();
  const {
    organization,
    user,
    openSnackBar,
    amt,
    enableLoading,
    loading,
    userPermissions,
  } = React.useContext(AppContext);
  const [BankDetails, setBankDetails] = React.useState([]);
  const [toggleState, setToggleState] = React.useState(false);
  const [filter, setFilter] = React.useState(false);
  const [downloadStatement, setDownloadStatement] = React.useState(false);
  const [dataten, setdataten] = React.useState([]);
  const [hasMoreItems, sethasMoreItems] = React.useState(true);

  const [infinitData, setinfinitData] = React.useState('');
  const [records, setrecords] = React.useState(1);
  const [downloadStatementformat, setDownloadStatementformat] =
    React.useState(false);
  const [downloadPeriod, setdownloadPeriod] = React.useState('');
  const { state } = Router.useLocation();
  const navigate = Router.useNavigate();
  const [drawer, setDrawer] = React.useState({
    date: false,
    vendor: false,
    startDate: false,
    endDate: false,
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [group, setGroup] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('');
  const [sorByValue, setSortByValue] = React.useState('');
  const [fileFormat, setFileFormat] = React.useState('');
  const [dialogDelete, setDialogDelete] = React.useState(false);

  const device = localStorage.getItem('device_detect');
  const [customDate, setcustomDate] = React.useState('');

  const [fastLinkConfig, setFastlinkConfig] = React.useState();
  const [fastLinkConfigLocal, setFastlinkConfigLocal] = React.useState();
  const [bankAccountType, setBankAccountType] = React.useState();
  const [toggleModal, setToggleModal] = React.useState(false);
  console.log(state);
  const [bankListingDetails, setBankListingDetails] = React.useState(
    state?.value?.bankListingDetails
  );
  const [accountDetails, setAccountDetails] = React.useState(
    state?.value?.accountDetails
  );

  const [havePermission, setHavePermission] = React.useState({ open: false });

  const [fileFormatErr, setFileFormatErr] = React.useState(false);
  const [datePeriodErr, setDatePeriodErr] = React.useState(false);
  const [Currentrow, setCurrentrow] = useState(-1);
  // const [dataSelected, setdataSelected] = useState({});
  const [BankAccountID, setBankAccountID] = useState('');
  const [SelectedBankID, setSelectedBankID] = useState(null);

  const handleCloseModal = () => {
    setToggleModal(false);
    setFastlinkConfig(undefined);
    setFastlinkConfigLocal(undefined);
    setBankAccountType(undefined);
    setBankListingDetails(state?.value?.bankListingDetails);
    setAccountDetails(state?.value?.accountDetails);
  };

  const fetchBankDetails = (sort) => {
    enableLoading(true);
    console.log(state);
    const val = state?.value === undefined ? amt : state?.value;
    if (val === undefined || val.id === undefined) {
      enableLoading(false);
    } else {
      RestApi(
        sort
          ? `organizations/${organization.orgId}/yodlee_bank_accounts/${
              val?.id
            }/txns?${
              records === 0 ? `page=1` : `page=${records}`
            }&${sorByValue}`
          : `organizations/${organization.orgId}/yodlee_bank_accounts/${
              val?.id
            }/txns?${records === 0 ? `page=1` : `page=${records}`}`,
        {
          method: METHOD.GET,
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
        }
      )
        .then((res) => {
          if (res && !res.error && res.message !== 'Bank Account not found') {
            setinfinitData(res);
            setBankDetails(res?.data?.map((c) => c));
            // if(res.page < records){
            //   setdataten([...res.data]);
            // } else {
            //   setdataten((prev) => [...prev, ...res.data]);
            // }
            setdataten((prev) => [...prev, ...res.data]);
            // setdataten([...res.data]);
            setrecords(res?.page);
          } else {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.ERROR,
            });
          }
          enableLoading(false);
        })
        .catch((e) => {
          openSnackBar({
            message: Object.values(e.errors).join(),
            type: MESSAGE_TYPE.ERROR,
          });
          enableLoading(false);
        });
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
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.INFO,
        });
      });
  };

  const fetchIncomeCategoryDetails = () => {
    enableLoading(true);
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
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.INFO,
        });
      });
  };

  const fetchTowardsDetails = () => {
    enableLoading(true);
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
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.INFO,
        });
      });
  };

  useEffect(() => {
    fetchTowardsDetails();
    fetchExpenseCategoryDetails();
    fetchIncomeCategoryDetails();
    setSelectedBankID(state?.value.id);
    setBankAccountID(state?.value.id);
    if (document.querySelector('.DashboardViewContainer_appHeader')) {
      document.querySelector(
        '.DashboardViewContainer_appHeader'
      ).style.display = 'flex';
    }
    if (
      document.querySelector(
        '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
      )
    ) {
      document.querySelector(
        '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
      ).style.height = '100%';
      document.querySelector(
        '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
      ).style.background = '#f2f2f2';
    }

    return () => {
      if (
        document.querySelector(
          '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
        )
      ) {
        const element = document.querySelector(
          '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
        );
        element.style.removeProperty('background');
        element.style.removeProperty('height');
      }
    };
  }, []);

  const BankTransactionSelected = (eve) => {
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

    let dataselected = [];
    let rowcounter = 0;
    let rowfound = 0;
    if (document.querySelector('.DashboardViewContainer_appHeader')) {
      document.querySelector(
        '.DashboardViewContainer_appHeader'
      ).style.display = 'flex';
    }
    if (
      document.querySelector(
        '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
      )
    ) {
      document.querySelector(
        '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
      ).style.height = '100%';
      document.querySelector(
        '.DashboardViewContainer_dashboardBodyContainerhideNavBar'
      ).style.background = '#f2f2f2';
    }

    if (dataten && dataten.length > 0) {
      dataten.forEach((banktransaction) => {
        if (banktransaction.id === eve.id) {
          dataselected = banktransaction;
          rowfound = rowcounter;
        }
        rowcounter += 1;
      });
    }
    if (dataselected) {
      console.log('found');
      console.log(state);
      let rowf = rowfound;
      if (rowf < 0) {
        rowf = 0;
      }
      const alldata = { data: [] };
      let counter = 0;
      const datanew = dataten.map((data) => {
        data.index = counter;
        counter += 1;
        return data;
      });
      alldata.data = datanew;
      setCurrentrow(rowf);
      // setdataSelected(dataselected);
      if (dataselected.amount >= 0) {
        categoryList.data = [];
        categoryList.data.push({ id: 'incomecategorization', name: 'Income' });
        categoryList.data.push({ id: 'others', name: 'Receipts' });
      } else {
        categoryList.data = [];
        categoryList.data.push({
          id: 'expensecategorization',
          name: 'Expenses',
        });
        categoryList.data.push({ id: 'others', name: 'Payments' });
      }
      localStorage.setItem('pagestart', rowf);
      setCurrentrow(rowf);
      const bankName = state?.value.accName;
      const bankAccount = state?.value.accNum;
      //           setinitClosingBalance(!initClosingBalance);
      localStorage.setItem(
        'itemstatus',
        !dataselected.categorized ? 'Add' : 'Edit'
      );
      navigate('/bankingcategorization', {
        state: {
          status: !dataselected.categorized ? 'Add' : 'Edit',
          bankaccountid: BankAccountID,
          selectedtype: 'others',
          row: Currentrow,
          alldata,
          bankname: bankName,
          bankaccount: bankAccount,
          bankid: SelectedBankID,
          selecteddata: dataselected,
          masterslist: derivedMasters,
        },
      });
    }
  };

  const createBankDetails = (response, accountType) => {
    enableLoading(true);
    RestApi(
      `organizations/${organization?.orgId}/yodlee_bank_accounts/handle_fastlink_event`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
        payload: {
          fastlink_flow: fastLinkConfigLocal,
          sites: response,
          account_type: accountType,
        },
      }
    )
      .then((res) => {
        if (res && !res.error) {
          fetchBankDetails(false);
          handleCloseModal();
        } else if (res.error) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.ERROR,
          });
          handleCloseModal();
        }
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
        handleCloseModal();
      });
  };

  const connectBank = (accountType) => {
    enableLoading(true);
    RestApi(
      `organizations/${organization?.orgId}/yodlee_bank_accounts/fastlink_config`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
        payload: {
          fastlink_flow: fastLinkConfig,
          bank_account_id:
            fastLinkConfig !== 'add_bank'
              ? bankListingDetails?.find((e) => e.id === accountDetails?.id)?.id
              : undefined,
        },
      }
    )
      .then((res) => {
        if (res && res.fastlink_url) {
          // if (localStorage.getItem('device_detect') === 'desktop') {
          setToggleModal(true);
          let fastlinkParams;
          if (res.flow) {
            fastlinkParams = {
              configName: res.fast_link_config_name,
              flow: res.flow,
            };
          } else {
            fastlinkParams = {
              configName: res.fast_link_config_name,
            };
          }

          if (res.provider_account_id) {
            fastlinkParams = {
              ...fastlinkParams,
              providerAccountId: res.provider_account_id,
            };
          }

          window.fastlink.open(
            {
              fastLinkURL: res.fastlink_url,
              accessToken: `Bearer ${res.access_token}`,
              params: fastlinkParams,
              forceIframe: true,
              onError(data) {
                enableLoading(false);
                // will be called on error. For list of possible message, refer to onError(data) Method.
                console.log(data);
                // handleCloseModal();
              },
              onClose(data) {
                // will be called called to close FastLink. For list of possible message, refer to onClose(data) Method.
                if (
                  data.action === 'exit' &&
                  (data.status === 'USER_CLOSE_ACTION' ||
                    data.code === 'E103' ||
                    data.code === 'E110')
                ) {
                  handleCloseModal();
                  if (data.code === 'E103') fetchBankDetails(false);
                } else if (
                  data.action === 'exit' &&
                  data.sites &&
                  data.sites.length > 0
                ) {
                  createBankDetails(data.sites, accountType);
                }
              },
            },
            'Fastlink-container'
          );
          // } else {
          //   JSBridge.connectYodlee(res, accountType);
          // }

          enableLoading(false);
        } else if (res.error) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.ERROR,
          });
          setFastlinkConfig(undefined);
          setFastlinkConfigLocal(undefined);
          setBankAccountType(undefined);
          enableLoading(false);
        }
      })
      .catch(() => {
        openSnackBar({
          message: 'Sorry,Something went Wrong, Please try again',
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  React.useEffect(() => {
    if (fastLinkConfig) {
      connectBank(bankAccountType);
    }
  }, [fastLinkConfig]);

  const handleStartDate = (val) => {
    const input = new Date(val)
      .toLocaleDateString('fr-CA')
      .split('-')
      .join('-');
    setcustomDate((prev) => ({ ...prev, start: input }));
    setDrawer((d) => ({ ...d, startDate: false }));
  };
  const handleEndDate = (val) => {
    const input = new Date(val)
      .toLocaleDateString('fr-CA')
      .split('-')
      .join('-');
    setcustomDate((prev) => ({ ...prev, end: input }));
    setDrawer((d) => ({ ...d, endDate: false }));
  };

  const FetchConnectedBankingTxns = (sort) => {
    enableLoading(true);
    RestApi(
      sort
        ? `organizations/${organization?.orgId}/icici_bank_accounts/${state?.value.id}/txns?${sorByValue}`
        : `organizations/${organization?.orgId}/icici_bank_accounts/${state?.value.id}/txns`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
      }
    )
      .then((res) => {
        if (res && !res.error) {
          setBankDetails(res.data);
          enableLoading(false);
        } else if (res.error) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.ERROR,
          });
          enableLoading(false);
        }
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  React.useEffect(() => {
    if (sorByValue === 'clear') {
      if (state?.key === 'connectedBankingTransactions') {
        FetchConnectedBankingTxns();
      } else {
        fetchBankDetails();
      }
      setAnchorEl(null);
      setFilter(false);
    } else if (sorByValue?.length > 0) {
      if (state?.key === 'connectedBankingTransactions') {
        FetchConnectedBankingTxns(true);
      } else {
        fetchBankDetails(true);
      }
      setAnchorEl(null);
      setFilter(false);
    }
  }, [sorByValue]);

  const SyncConnectedBankingTxns = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization?.orgId}/icici_bank_accounts/${state?.value.id}/sync`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
      }
    )
      .then((res) => {
        if (res && !res.error) {
          if (res.success) {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.INFO,
            });
            FetchConnectedBankingTxns();
          }

          enableLoading(false);
        } else if (res.error) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.ERROR,
          });
          enableLoading(false);
        }
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const DownloadStatement = () => {
    const val = state?.value === undefined ? amt : state?.value;
    const dateFilter = downloadPeriod
      ? `?date=${downloadPeriod}`
      : `?start_date=${customDate?.start}&end_date=${customDate.end}`;
    const efforrtless = state?.efforrtless
      ? `effortless_virtual_accounts`
      : `yodlee_bank_accounts/${val?.id}`;
    enableLoading(true);
    fetch(
      `${BASE_URL}/organizations/${organization.orgId}/${efforrtless}/downloads${fileFormat}${dateFilter}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'BankStatement';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setFileFormat('');
        setdownloadPeriod('');
        setcustomDate('');
      });
    enableLoading(false);
  };

  const DownloadConnectedBankingStatement = () => {
    // const val = state?.value === undefined ? amt : state?.value;
    const dateFilter = downloadPeriod
      ? `?date=${downloadPeriod}`
      : `?from_date=${customDate?.start}&end_date=${customDate.end}`;
    const efforrtless = `icici_bank_accounts`;
    enableLoading(true);
    fetch(
      `${BASE_URL}/organizations/${organization.orgId}/${efforrtless}/${state?.value?.id}/download${fileFormat}${dateFilter}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'BankStatement';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setFileFormat('');
        setdownloadPeriod('');
        setcustomDate('');
      });
    enableLoading(false);
  };

  const fetchEffortlessTxns = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/effortless_virtual_accounts/txns`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        if (res && !res.error && res.message !== 'Bank Account not found') {
          setBankDetails(res?.data);
        } else {
          openSnackBar({
            message: res?.message || 'Sorry, Something Went Wrong',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })

      .catch((e) => {
        openSnackBar({
          message: Object.values(e.errors).join(),
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  React.useEffect(() => {
    if (state?.key !== 'connectedBankingTransactions') {
      if (state?.efforrtless === true) {
        fetchEffortlessTxns();
      } else {
        fetchBankDetails(false);
      }
    } else {
      FetchConnectedBankingTxns();
    }
  }, []);
  const toggleDrawer = (open) => {
    if (open === true) {
      setToggleState(open);
      // return;
    }
  };

  const todayD = new Date();
  const yyyy = todayD.getFullYear();
  let mm = todayD.getMonth() + 1; // Months start at 0!
  let dd = todayD.getDate();

  if (dd < 10) dd = `0${dd}`;
  if (mm < 10) mm = `0${mm}`;
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  // eslint-disable-next-line no-unused-vars
  const today = `${dd} ${monthNames[+mm]} ${yyyy}`;

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };

  React.useMemo(() => {
    if (state?.key === 'connectedBankingTransactions') {
      setBankDetails(state.value.response);
      setinfinitData(state?.value?.data);
    }
  }, [state.key]);
  // React.useEffect(() => {
  //   if (!amt?.amt) {
  //     if (device === 'desktop') {
  //       if (state.efforrtless === true) {
  //         navigate('/banking-banklist', {
  //           state: {
  //             from: 'effortlessTxns',
  //             efforrtless: true,
  //           },
  //         });
  //       } else {
  //         navigate('/banking-banklist', {
  //           state: {
  //             from:
  //               state?.key === 'accountBalanceFromBuisness' ? 'buisness' : '',
  //           },
  //         });
  //       }{}
  //     } else {
  //       navigate('/banking-banklist');
  //     }
  //   }
  // }, [amt]);

  React.useEffect(() => {
    if (records === 1) {
      setdataten(BankDetails);
    }
  }, [BankDetails]);

  // const fetchBankDetails2 = () => {
  //   const val = state?.value === undefined ? amt : state?.value;

  //   if (val === undefined) {
  //     enableLoading(false);
  //   } else {
  //     enableLoading(true);
  //     RestApi(
  //       `organizations/${organization.orgId}/yodlee_bank_accounts/${val?.id}/txns?page=${records}`,
  //       {
  //         method: METHOD.GET,
  //         headers: {
  //           Authorization: `Bearer ${user.activeToken}`,
  //         },
  //       },
  //     )
  //       .then((res) => {
  //         if (res && !res.error) {
  //           setdataten((prev) => [...prev, ...res.data]);
  //         }
  //         enableLoading(false);
  //       })
  //       .catch((e) => {
  //         openSnackBar({
  //           message: Object.values(e.errors).join(),
  //           type: MESSAGE_TYPE.ERROR,
  //         });

  //         enableLoading(false);
  //       });
  //   }
  // };

  const FetchConnectedBankingTxnsMore = () => {
    const val = state?.value === undefined ? amt : state?.value;

    if (val === undefined) {
      enableLoading(false);
    } else {
      enableLoading(true);
      RestApi(
        `organizations/${organization.orgId}/icici_bank_accounts/${state?.value?.id}/txns?page=${records}`,
        {
          method: METHOD.GET,
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
        }
      )
        .then((res) => {
          if (res && !res.error) {
            setdataten((prev) => [...prev, ...res.data]);
          }
          enableLoading(false);
        })
        .catch((e) => {
          openSnackBar({
            message: Object.values(e.errors).join(),
            type: MESSAGE_TYPE.ERROR,
          });

          enableLoading(false);
        });
    }
  };
  const loadMore = () => {
    if (records >= infinitData.pages) {
      sethasMoreItems(false);
    } else {
      setrecords((prev) => prev + 1);
    }
  };
  React.useEffect(() => {
    if (records > 1) {
      if (state?.key !== 'connectedBankingTransactions') {
        if (sorByValue?.length > 0) {
          fetchBankDetails(true);
        } else {
          fetchBankDetails();
        }
      } else {
        FetchConnectedBankingTxnsMore();
      }
    }
  }, [records]);

  return state ? (
    <>
      {device === 'desktops' ? (
        <>
          <Mui.Grid container className={css.container}>
            <Mui.Grid
              item
              xs={12}
              className={
                device === 'mobile' ? css.griditem1 : css.gridItemDesktop
              }
            >
              <Mui.Box className={device === 'desktop' && css.height}>
                <Mui.Grid
                  item
                  xs={12}
                  className={device === 'desktop' && css.height}
                >
                  <Mui.Stack
                    direction="column"
                    spacing={1}
                    justifyContent="space-between"
                    className={
                      device === 'mobile' ? css.accBalanc : css.accBalancDesk
                    }
                  >
                    <Mui.Stack
                      direction="row"
                      className={css2.accBalHeadStack}
                      // style={{ paddingTop: '22px' }}
                      // justifyContent="space-between"
                    >
                      <Mui.Grid
                        className={
                          device === 'desktop'
                            ? css2.headiconsDesktop
                            : css2.headicons
                        }
                      >
                        <Mui.Stack direction="column">
                          <Mui.Typography>
                            {device === 'mobile'
                              ? 'Account Balance'
                              : 'Business Account'}
                          </Mui.Typography>

                          <Mui.Divider
                            style={{
                              borderRadius: '4px',
                              width: '10px',
                              height: '1px',
                              marginTop: '7px',
                              backgroundColor: '#F08B32',
                            }}
                            variant="fullWidth"
                          />
                        </Mui.Stack>
                      </Mui.Grid>
                      {device !== 'mobile' && (
                        <Mui.Stack direction="row" alignItems="center">
                          <div style={{ margin: '8px 0 0 0' }}>
                            <BankingDownoad />
                          </div>
                          <Mui.Button
                            style={{
                              background: 'rgb(234 162 84 / 20%)',
                              color: 'rgba(234, 124, 30, 0.66)',
                              border: '1px solid rgba(255, 127, 18, 0.66)',
                              height: '1.7rem',
                              whiteSpace: 'nowrap',
                              borderRadius: '10px',
                              margin: '5px',
                              padding: '5px 20px',
                              fontWeight: 600,
                              width: '24%',
                              textTransform: 'none',
                            }}
                            onClick={(event) => {
                              setAnchorEl(event.currentTarget);
                            }}
                          >
                            Filter
                          </Mui.Button>
                        </Mui.Stack>
                      )}
                      {device === 'mobile' ? (
                        <Mui.Grid
                          alignSelf="self-end"
                          onClick={() => {
                            fetchBankDetails(false);
                          }}
                        >
                          <img src={syncIcon} alt="loading" />
                        </Mui.Grid>
                      ) : (
                        ''
                      )}
                    </Mui.Stack>

                    <Mui.Grid
                      className={
                        device === 'mobile'
                          ? css.bankContainerAccBal
                          : css.bankContainerAccBalDesktop
                      }
                    >
                      <Mui.Stack
                        direction="row"
                        justifyContent="space-between"
                        style={{
                          padding: '1rem',
                          color: '#FFFFFF',
                          alignItems: 'center',
                        }}
                      >
                        <Mui.Grid>
                          <Mui.Typography style={{ fontSize: '17px' }}>
                            {amt?.accName || state?.value.accName}
                          </Mui.Typography>
                          <Mui.Typography style={{ fontSize: '11px' }}>
                            {amt?.accNum || state?.value.accNum}
                          </Mui.Typography>
                        </Mui.Grid>
                        <Mui.Typography style={{ fontSize: '17px' }}>
                          Rs.
                          {Object.keys(amt).length !== 0
                            ? FormattedAmount(amt?.amt)
                            : FormattedAmount(state?.value?.amt)}
                        </Mui.Typography>
                      </Mui.Stack>
                    </Mui.Grid>
                    <div
                      style={{
                        height: device === 'mobile' ? '' : '100%',
                        overflow: device === 'mobile' ? 'hidden' : 'auto',
                      }}
                    >
                      <Mui.Grid
                        className={
                          device === 'mobile'
                            ? css.dataGridForAccBalMobile
                            : css.dataGridForAccBal
                        }
                      >
                        {!loading && BankDetails.length === 0 && (
                          <Mui.Grid className={css2.textAlign}>
                            {' '}
                            No Transactions Found
                          </Mui.Grid>
                        )}

                        {loading && (
                          <Mui.Grid className={css2.textAlign}>
                            {' '}
                            Gathering your Banking Data. Please Wait.
                          </Mui.Grid>
                        )}

                        {BankDetails?.map((e) => (
                          <>
                            <Mui.Grid style={{ paddingTop: '5px' }}>
                              <Mui.Stack
                                id={e?.name}
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Mui.Grid
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Mui.Grid
                                    style={{
                                      fontSize: '14px',
                                    }}
                                  >
                                    <Mui.Avatar
                                      style={{
                                        textTransform: 'uppercase',
                                        fontSize: '13.588px',
                                        color: 'black',
                                      }}
                                    >
                                      {(state?.efforrtless !== true &&
                                        (e?.party_initial === null
                                          ? '?'
                                          : e.party_initial)) ||
                                        e?.narration.slice(0, 1)}
                                    </Mui.Avatar>
                                  </Mui.Grid>
                                  <Mui.Grid
                                    style={{
                                      fontSize: '14px',
                                      marginLeft: '14px',
                                    }}
                                  >
                                    {(state?.efforrtless !== true &&
                                      (e?.party_name === null
                                        ? 'Unknown'
                                        : e?.party_name)) ||
                                      e?.narration}
                                  </Mui.Grid>
                                </Mui.Grid>
                                <Mui.Stack
                                  direction="column"
                                  className={css2.alignRight}
                                >
                                  <Mui.Grid
                                    className={
                                      e?.amount < 0 ? css.amtRed : css.amtGreen
                                    }
                                  >
                                    {e?.amount < 0
                                      ? FormattedAmount(e?.amount)
                                      : FormattedAmount(e?.amount)}
                                  </Mui.Grid>
                                  <Mui.Grid
                                    style={{
                                      fontSize: '12px',
                                      color: '#222222',
                                      opacity: '0.4',
                                    }}
                                  >
                                    {moment(e?.date).format('DD MMMM YYYY')}
                                  </Mui.Grid>
                                </Mui.Stack>
                              </Mui.Stack>
                            </Mui.Grid>
                          </>
                        ))}
                      </Mui.Grid>
                    </div>
                  </Mui.Stack>
                </Mui.Grid>
              </Mui.Box>
              {device === 'desktop' && state?.efforrtless !== true && (
                <Mui.Button
                  className={css.lastButtonDesktop}
                  onClick={() => toggleDrawer(true)}
                >
                  More Actions
                </Mui.Button>
              )}
            </Mui.Grid>
            <Mui.Drawer
              anchor="bottom"
              open={toggleState}
              onClose={() => setToggleState(false)}
              PaperProps={{
                elevation: 0,
                style: {
                  backgroundColor: 'white',
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                },
              }}
            >
              <Mui.Stack margin="1rem">
                <Mui.Typography className={classes.text}>
                  Download Statement
                </Mui.Typography>
                <Mui.Divider />
                <Mui.Typography
                  className={classes.text}
                  onClick={() => {
                    setFilter(true);
                    setToggleState(false);
                  }}
                >
                  Filters
                </Mui.Typography>
                <Mui.Divider />
                <Mui.Typography className={classes.text}>
                  Create FD
                </Mui.Typography>
                <Mui.Divider />
                <Mui.Typography className={classes.text}>
                  Break FD
                </Mui.Typography>
                <Mui.Divider />
              </Mui.Stack>
            </Mui.Drawer>

            {device === 'mobile' && (
              <Mui.Button
                className={css.lastButton}
                onClick={() => toggleDrawer(true)}
              >
                More Actions
              </Mui.Button>
            )}
          </Mui.Grid>
          <Mui.Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            PaperProps={{
              elevation: 3,
              style: {
                maxHeight: '405px',
                width: '35vh',
                padding: '5px',
              },
            }}
          >
            <Mui.Stack>
              <Mui.Typography
                className={classes.text1}
                style={{ color: '#fdbd84' }}
              >
                Filter By
              </Mui.Typography>
              <Mui.Divider />
              <Mui.Typography
                className={classes.text1}
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                Date{' '}
                <span>
                  {' '}
                  <MuiIcon.ArrowForwardIos style={{ color: '#fdbd84' }} />
                </span>
              </Mui.Typography>
              <Mui.Divider />
              <Mui.Typography className={classes.text1}>Party</Mui.Typography>
              <Mui.Divider />
              <Mui.Typography className={classes.text1}>
                Amount (Low to High)
              </Mui.Typography>
              <Mui.Divider />
              <Mui.Typography className={classes.text1}>
                Amount (High to Low)
              </Mui.Typography>
              <Mui.Divider />
              <Mui.Typography className={classes.text1}>
                Categorized Transactions
              </Mui.Typography>
              <Mui.Divider />
              <Mui.Typography className={classes.text1}>
                Uncategorized Transactions
              </Mui.Typography>
              <Mui.Divider />
            </Mui.Stack>
          </Mui.Menu>
        </>
      ) : (
        <Mui.Grid className={css2.heightAndWidth}>
          <Mui.Stack direction="row">
            <Mui.Stack
              direction="column"
              className={
                device === 'mobile' ? css2.titleGrid : css2.titleGridWeb
              }
            >
              <Mui.Typography className={css2.accBalTitle}>
                {device === 'mobile'
                  ? 'Account Balance'
                  : state?.key === 'connectedBankingTransactions'
                  ? 'Connected Account'
                  : 'Business Account'}
              </Mui.Typography>

              <Mui.Divider className={css2.divider1} variant="fullWidth" />
            </Mui.Stack>
            {device === 'desktop' && (
              <Mui.Grid className={css2.icons}>
                <Mui.Grid onClick={() => setDownloadStatement(true)}>
                  <Mui.Tooltip title="Download" placement="bottom-end">
                    <img src={DownloadBnk} width="24px" alt="bankIcon" />
                  </Mui.Tooltip>
                </Mui.Grid>

                {state?.efforrtless !== true && (
                  <Mui.Grid
                    onClick={() =>
                      navigate('/bankingcategorizeddetails', {
                        state: { bankdetails: state.value },
                      })
                    }
                  >
                    <Mui.Tooltip
                      title="Categorize Transaction"
                      placement="bottom-end"
                    >
                      <img
                        src={CategorizationBnk}
                        width="24px"
                        alt="bankIcon"
                      />
                    </Mui.Tooltip>
                  </Mui.Grid>
                )}
                <Mui.Grid
                  onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                  }}
                >
                  <Mui.Tooltip title="Sort" placement="bottom-end">
                    <img src={sortBanking} width="24px" alt="bankIcon" />
                  </Mui.Tooltip>
                </Mui.Grid>
                <Mui.Grid
                  onClick={() => {
                    if (state?.key === 'connectedBankingTransactions') {
                      SyncConnectedBankingTxns();
                    } else {
                      setFastlinkConfig('refresh_bank');
                      setFastlinkConfigLocal('refresh_bank');
                      setBankAccountType(
                        bankListingDetails?.find(
                          (e) => e.id === accountDetails.id
                        )?.bank_account_type
                      );
                    }
                  }}
                >
                  <Mui.Tooltip title="Refresh" placement="bottom-end">
                    <img src={Group} width="24px" alt="bankIcon" />
                  </Mui.Tooltip>
                </Mui.Grid>
                <Mui.Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                  PaperProps={{
                    elevation: 3,
                    style: {
                      maxHeight: '405px',
                      width: '28%',
                      padding: '5px',
                    },
                  }}
                >
                  <Mui.Stack className={css2.mainStackFilter}>
                    <Mui.Stack direction="row" className={css2.stackFilter}>
                      <Mui.Grid>
                        <Mui.Typography className={classes.text}>
                          Sort by
                          <Mui.Divider
                            className={css2.dividerFilter}
                            variant="fullWidth"
                          />
                        </Mui.Typography>
                      </Mui.Grid>
                      <Mui.Typography
                        className={classes.text1}
                        style={{
                          color: '#F08B32',
                          cursor: 'pointer',
                          fontWeight: '700 !important',
                        }}
                        onClick={() => {
                          sethasMoreItems(true);
                          setinfinitData('');
                          setBankDetails([]);
                          setdataten([]);
                          setrecords(0);
                          setSortBy('');
                          setSortByValue('clear');
                        }}
                      >
                        CLEAR
                      </Mui.Typography>
                    </Mui.Stack>
                    <Mui.Stack direction="row">
                      <Mui.FormControlLabel
                        control={
                          <Radio
                            style={{ color: '#F08B32' }}
                            onChange={(e) => {
                              sethasMoreItems(true);
                              setinfinitData('');
                              setBankDetails([]);
                              setdataten([]);
                              setrecords(0);
                              setSortBy(e.target.value);
                              setSortByValue('order_by=amount&order=asc');
                            }}
                            value="low"
                            checked={sortBy === 'low'}
                          />
                        }
                        label="Amount (Low to High)"
                      />
                      {/* <Mui.Typography className={classes.text1}>
                        Amount (Low to High)
                      </Mui.Typography> */}
                    </Mui.Stack>
                    <Mui.Stack direction="row">
                      <Mui.FormControlLabel
                        control={
                          <Radio
                            style={{ color: '#F08B32' }}
                            onChange={(e) => {
                              sethasMoreItems(true);
                              setinfinitData('');
                              setBankDetails([]);
                              setdataten([]);
                              setrecords(0);
                              setSortBy(e.target.value);
                              setSortByValue('order_by=amount&order=desc');
                            }}
                            value="high"
                            checked={sortBy === 'high'}
                          />
                        }
                        label="Amount (High to Low)"
                      />
                      {/* <Mui.Typography className={classes.text1}>
                        Amount (High to Low)
                      </Mui.Typography> */}
                    </Mui.Stack>
                    {/* <Mui.Stack direction="row">
                      <Mui.FormControlLabel
                        control={
                          <Radio
                            style={{ color: '#F08B32' }}
                            onChange={(e) => {
                              setSortBy(e.target.value);
                              setSortByValue('order_by=party_name&order=asc');
                            }}
                            value="a-z"
                            checked={sortBy === 'a-z'}
                          />
                        }
                        label="Party Name (A-Z)"
                      />
                    </Mui.Stack>
                    <Mui.Stack direction="row">
                      <Mui.FormControlLabel
                        control={
                          <Radio
                            style={{ color: '#F08B32' }}
                            onChange={(e) => {
                              setSortBy(e.target.value);
                              setSortByValue('order_by=party_name&order=desc');
                            }}
                            value="z-a"
                            checked={sortBy === 'z-a'}
                          />
                        }
                        label="Party Name (Z-A)"
                      />
                    </Mui.Stack> */}
                    <Mui.Stack direction="row">
                      <Mui.FormControlLabel
                        control={
                          <Radio
                            style={{ color: '#F08B32' }}
                            onChange={(e) => {
                              sethasMoreItems(true);
                              setinfinitData('');
                              setBankDetails([]);
                              setdataten([]);
                              setrecords(0);
                              setSortBy(e.target.value);
                              setSortByValue('categorized=true');
                            }}
                            value="Categorized"
                            checked={sortBy === 'Categorized'}
                          />
                        }
                        label="Categorization (Categorized Transactions)"
                      />
                      {/* <Mui.Typography className={classes.text1}>
                        Categorization (Categorized Transactions)
                      </Mui.Typography> */}
                    </Mui.Stack>
                    <Mui.Stack direction="row">
                      <Mui.FormControlLabel
                        control={
                          <Radio
                            style={{ color: '#F08B32' }}
                            onChange={(e) => {
                              sethasMoreItems(true);
                              setinfinitData('');
                              setBankDetails([]);
                              setrecords(0);
                              setdataten([]);
                              setSortBy(e.target.value);
                              setSortByValue('categorized=false');
                            }}
                            value="Uncategorized"
                            checked={sortBy === 'Uncategorized'}
                          />
                        }
                        label="Categorization (Uncategorized Transactions)"
                      />
                      {/* <Mui.Typography className={classes.text1}>
                        Categorization (Uncategorized Transactions)
                      </Mui.Typography> */}
                    </Mui.Stack>
                  </Mui.Stack>
                </Mui.Menu>
              </Mui.Grid>
            )}
          </Mui.Stack>
          <Mui.Grid
            className={
              device === 'mobile' ? css2.greenContainer : css2.greenContainerWeb
            }
          >
            <Mui.Stack direction="row" justifyContent="space-between">
              <Mui.Grid className={css2.accDetails}>
                <Mui.Stack direction="row">
                  <Mui.Typography
                    style={{ fontSize: '17px' }}
                    className={css2.insideContainer}
                  >
                    {amt?.accName || state?.value.accName}
                  </Mui.Typography>
                </Mui.Stack>
                <Mui.Typography
                  style={{ fontSize: '11px' }}
                  className={css2.insideContainer}
                >
                  {amt?.accNum || state?.value.accNum}
                </Mui.Typography>
              </Mui.Grid>
              <Mui.Typography
                style={{ fontSize: '17px' }}
                className={css2.insideContainerRight}
              >
                Rs.
                {
                  // Object.keys(amt).length !== 0
                  //   ? FormattedAmount(amt?.amt)
                  //   : state?.key === 'connectedBankingTransactions'
                  //   ? state?.value?.amt
                  //   :
                  FormattedAmount(state?.value?.amt)
                }
              </Mui.Typography>
            </Mui.Stack>

            {device === 'mobile' && (
              <Mui.Grid
                className={css2.icons}
                style={{
                  justifyContent:
                    state?.efforrtless !== true ? 'space-evenly' : 'flex-end',
                }}
              >
                <Mui.Grid
                  onClick={() => setDownloadStatement(true)}
                  style={{
                    marginRight: state?.efforrtless !== true ? 'none' : '12px',
                  }}
                >
                  <img src={DownloadBnk} width="24px" alt="bankIcon" />
                </Mui.Grid>
                {state?.efforrtless !== true && (
                  <>
                    <Mui.Grid
                      onClick={() =>
                        navigate('/bankingcategorizeddetails', {
                          state: { bankdetails: state.value },
                        })
                      }
                    >
                      <img
                        src={CategorizationBnk}
                        width="24px"
                        alt="bankIcon"
                      />
                    </Mui.Grid>

                    <Mui.Grid onClick={() => setFilter(true)}>
                      <img src={sortBanking} width="24px" alt="bankIcon" />
                    </Mui.Grid>
                    <Mui.Grid
                      onClick={() => {
                        if (state?.key === 'connectedBankingTransactions') {
                          SyncConnectedBankingTxns();
                        } else {
                          setFastlinkConfig('refresh_bank');
                          setFastlinkConfigLocal('refresh_bank');
                          setBankAccountType(
                            bankListingDetails?.find(
                              (e) => e.id === accountDetails.id
                            )?.bank_account_type
                          );
                        }
                      }}
                    >
                      <img src={Group} width="24px" alt="bankIcon" />
                    </Mui.Grid>
                  </>
                )}
              </Mui.Grid>
            )}
          </Mui.Grid>
          <>
            <Mui.Grid style={{ marginTop: device === 'mobile' && '4%' }}>
              {loading && (
                <Mui.Grid className={css2.textAlign}>
                  {' '}
                  Gathering your Banking Data. Please Wait.
                </Mui.Grid>
              )}

              {!loading && dataten?.length === 0 && (
                <Mui.Grid className={css2.textAlign}>
                  No Transactions Found
                </Mui.Grid>
              )}
              <InfiniteScroll
                dataLength={dataten?.length}
                next={loadMore}
                height="63vh"
                scrollThreshold="20px"
                initialScrollY="100px"
                hasMore={hasMoreItems}
              >
                {dataten
                  ?.filter((e) => (e === 'undefined' ? e?.length - 1 : e))
                  .map((e) => (
                    <Mui.Stack
                      className={css2.transactionCard}
                      style={{
                        backgroundColor:
                          state?.efforrtless !== true &&
                          !e?.categorized &&
                          '#FFDFC4',
                        cursor:
                          state?.efforrtless !== true &&
                          !e?.categorized &&
                          'pointer',
                      }}
                      id={e?.name}
                      direction="row"
                      onClick={() => {
                        if (!state?.efforrtless) BankTransactionSelected(e);
                        // srikanth changes
                        //                        navigate('/bankingcategorizeddetails', {
                        //                          state: {
                        //                            id: e?.id,
                        //                            route: 'BusinessAcc',
                        //                          },
                        //                        });
                      }}
                      justifyContent="space-between"
                    >
                      <Mui.Grid className={css2.nameAndNarration}>
                        <Mui.Stack direction="row">
                          <Mui.Grid>
                            {(state?.efforrtless !== true &&
                              (e?.party_name === null
                                ? 'Unknown'
                                : e?.party_name)) ||
                              e?.narration}
                          </Mui.Grid>
                          {e?.similarity_group === true && (
                            <Mui.Button
                              className={css2.groupBy}
                              onClick={() => {
                                setGroup(true);
                              }}
                            >
                              GROUP
                            </Mui.Button>
                          )}
                        </Mui.Stack>
                        <Mui.Grid className={css2.narrate}>
                          {e?.narration}
                        </Mui.Grid>
                      </Mui.Grid>
                      <Mui.Stack direction="column" className={css2.alignRight}>
                        <Mui.Grid
                          className={e?.amount < 0 ? css.amtRed : css.amtGreen}
                        >
                          {e?.amount < 0
                            ? FormattedAmount(e?.amount)
                            : FormattedAmount(e?.amount)}
                        </Mui.Grid>
                        <Mui.Grid className={css2.date}>
                          {moment(e?.date).format('DD MMMM YYYY')}
                        </Mui.Grid>
                      </Mui.Stack>
                    </Mui.Stack>
                  ))}
              </InfiniteScroll>
            </Mui.Grid>
            <SelectBottomSheet
              open={group}
              onClose={() => setGroup(false)}
              triggerComponent={<div style={{ display: 'none' }} />}
              addNewSheet
            >
              <Mui.Grid className={css2.groupbyPadding}>
                <Mui.Stack direction="column">
                  <Mui.Typography>Group Details</Mui.Typography>

                  <Mui.Divider
                    className={css2.groupDivider}
                    variant="fullWidth"
                  />
                </Mui.Stack>
                <Mui.Stack direction="row">
                  <Mui.Grid className={css2.groupByName}>Date:</Mui.Grid>
                  <Mui.Grid className={css2.groupByValue}>
                    {' '}
                    23 March 2022
                  </Mui.Grid>
                </Mui.Stack>
                <Mui.Stack direction="row">
                  <Mui.Grid className={css2.groupByName}>Group Name :</Mui.Grid>
                  <Mui.Grid className={css2.groupByValue}>
                    {' '}
                    Industrial RequirementsTotal
                  </Mui.Grid>
                </Mui.Stack>
                <Mui.Stack direction="row">
                  <Mui.Grid className={css2.groupByName}>Total:</Mui.Grid>
                  <Mui.Grid className={css2.groupByValue}>
                    {' '}
                    Rs. 1,44,000
                  </Mui.Grid>
                </Mui.Stack>

                <Mui.Grid>
                  <Mui.Grid className={css2.groupContainer}>
                    <Mui.Stack direction="row" className={css2.groupNameAmount}>
                      <Mui.Grid className={css2.groupNametitle}>
                        Narration
                      </Mui.Grid>
                      <Mui.Grid className={css2.groupNametitle}>
                        Amount
                      </Mui.Grid>
                    </Mui.Stack>
                    <Mui.Stack
                      direction="row"
                      className={css2.groupNameContents}
                    >
                      <Mui.Grid className={css2.groupBilltitle}>
                        Bill for services rendered lorem impsum
                      </Mui.Grid>
                      <Mui.Grid className={css2.groupAmounttitle}>
                        Rs.80,000
                      </Mui.Grid>
                      <Mui.Grid
                        onClick={() => setDialogDelete(true)}
                        className={css2.groupValuetitle}
                      >
                        <img src={deleteBin} alt="delete" />{' '}
                      </Mui.Grid>
                    </Mui.Stack>
                  </Mui.Grid>
                </Mui.Grid>
              </Mui.Grid>
            </SelectBottomSheet>

            <Mui.Dialog
              PaperProps={{
                elevation: 3,
                style: {
                  width: '86%',
                  overflow: 'visible',
                  borderRadius: 16,
                  cursor: 'pointer',
                },
              }}
              open={dialogDelete}
              onClose={() => setDialogDelete(false)}
            >
              <Mui.DialogContent>
                <Mui.Grid>
                  <Mui.Grid>
                    <Mui.Typography className={css2.deletetitle}>
                      Remove Transaction
                    </Mui.Typography>

                    <Mui.Divider
                      className={css2.deleteDivider}
                      variant="fullWidth"
                    />
                  </Mui.Grid>

                  <Mui.Grid className={css2.deleteDescriptionDesktop2}>
                    {' '}
                    Are you sure that you want to remove this transaction from
                    the {'<Group Name>'} Group?
                  </Mui.Grid>
                  <Mui.Stack direction="row" className={css2.buttonWidth}>
                    <Mui.Button className={css2.CancelButton}>No</Mui.Button>
                    <Mui.Button className={css2.submitButton}>Yes</Mui.Button>
                  </Mui.Stack>
                </Mui.Grid>
              </Mui.DialogContent>
            </Mui.Dialog>

            <SelectBottomSheet
              open={downloadStatement}
              onClose={() => setDownloadStatement(false)}
              triggerComponent={<div style={{ display: 'none' }} />}
              addNewSheet
            >
              <Mui.Grid>
                <Mui.Grid className={css2.titleDownload}>
                  <Mui.Typography className={css2.titleDownloadStatement}>
                    Download Bank Statement
                  </Mui.Typography>

                  <Mui.Divider className={css2.divider1} variant="fullWidth" />
                </Mui.Grid>
                <Mui.Grid className={css2.cardDownload}>
                  <Mui.Grid className={css2.downloadDescr}>
                    From which period do you need a statement?
                  </Mui.Grid>
                  <Mui.Grid className={css2.paddingRadio}>
                    <Mui.Stack direction="row" className={css2.spaceBetween}>
                      <Mui.Stack direction="row" className={css2.alignCenter}>
                        <Radio
                          checked={downloadPeriod === 'Last Month'}
                          onChange={(e) => setdownloadPeriod(e.target.value)}
                          value="Last Month"
                          style={{ color: '#F08B32' }}
                        />
                        Last Month
                      </Mui.Stack>
                      <Mui.Stack
                        direction="row"
                        className={css2.alignCenterjus}
                      >
                        <Radio
                          checked={downloadPeriod === 'Last 3 Months'}
                          onChange={(e) => setdownloadPeriod(e.target.value)}
                          value="Last 3 Months"
                          style={{ color: '#F08B32' }}
                        />
                        Last 3 Months
                      </Mui.Stack>
                    </Mui.Stack>
                    <Mui.Stack direction="row" className={css2.spaceBetween}>
                      <Mui.Stack direction="row" className={css2.alignCenter}>
                        <Radio
                          checked={downloadPeriod === 'Last 6 Months'}
                          onChange={(e) => setdownloadPeriod(e.target.value)}
                          value="Last 6 Months"
                          style={{ color: '#F08B32' }}
                        />
                        Last 6 Months
                      </Mui.Stack>
                      <Mui.Stack
                        direction="row"
                        className={css2.alignCenterjus}
                      >
                        <Radio
                          checked={downloadPeriod === 'Last 1 Year'}
                          onChange={(e) => setdownloadPeriod(e.target.value)}
                          value="Last 1 Year"
                          style={{ color: '#F08B32' }}
                        />
                        Last 1 Year
                      </Mui.Stack>
                    </Mui.Stack>
                  </Mui.Grid>
                  <Mui.Stack direction="row" className={css2.stackOr}>
                    <Mui.Divider className={css2.dividerDownload} />
                    <Mui.Grid className={css2.or}>OR</Mui.Grid>
                    <Mui.Divider className={css2.dividerDownload} />
                  </Mui.Stack>
                  <Mui.Grid className={css2.downloadDescr}>
                    Choose a Custom Date Range{' '}
                  </Mui.Grid>
                  <Mui.Stack direction="row" justifyContent="space-between">
                    <div className={css.dateWrapper}>
                      <div className={css2.dateBorder}>
                        <div className={css2.dateFont}>Start Date</div>

                        <div className={css2.dateInput}>
                          <input
                            type="text"
                            value={
                              customDate?.start
                                ? moment(customDate?.start).format('DD-MM-YYYY')
                                : 'DD-MM-YYYY'
                            }
                            style={{
                              width: '100%',
                              border: 'none',
                              padding: 5,
                            }}
                          />
                          {device === 'desktop' ? (
                            <OnlyDatePicker onChange={handleStartDate} />
                          ) : (
                            <SelectBottomSheet
                              name="startDate"
                              addNewSheet
                              triggerComponent={
                                <CalendarIcon
                                  className={css2.calanderIcon}
                                  onClick={() => {
                                    onTriggerDrawer('startDate');
                                  }}
                                />
                              }
                              open={drawer.startDate}
                              onTrigger={onTriggerDrawer}
                              onClose={() => {
                                setDrawer((d) => ({
                                  ...d,
                                  startDate: false,
                                }));
                              }}
                            >
                              <Calender
                                head="Select Start Date"
                                button="Select"
                                handleDate={handleStartDate}
                              />
                            </SelectBottomSheet>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={css.dateWrapper}>
                      <div className={css2.dateBorder}>
                        <div className={css2.dateFont}>End Date</div>
                        <div className={css2.dateInput}>
                          <input
                            type="text"
                            value={
                              customDate?.end
                                ? moment(customDate?.end).format('DD-MM-YYYY')
                                : 'DD-MM-YYYY'
                            }
                            style={{
                              width: '100%',
                              border: 'none',
                              padding: 5,
                            }}
                          />
                          {device === 'desktop' ? (
                            <OnlyDatePicker onChange={handleEndDate} />
                          ) : (
                            <SelectBottomSheet
                              name="endDate"
                              addNewSheet
                              triggerComponent={
                                <CalendarIcon
                                  className={css2.calanderIcon}
                                  onClick={() => {
                                    onTriggerDrawer('endDate');
                                  }}
                                />
                              }
                              open={drawer.endDate}
                              onTrigger={onTriggerDrawer}
                              onClose={() => {
                                setDrawer((d) => ({ ...d, endDate: false }));
                              }}
                            >
                              <Calender
                                head="Select End Date"
                                button="Select"
                                handleDate={handleEndDate}
                              />
                            </SelectBottomSheet>
                          )}
                        </div>
                      </div>
                    </div>
                  </Mui.Stack>
                  {datePeriodErr && (
                    <div className={css2.error}>
                      {datePeriodErr
                        ? 'Please Select valid Date Period or Date Range'
                        : ''}
                    </div>
                  )}
                  {device === 'desktop' ? (
                    <>
                      <Mui.Grid className={css2.downloadDescr}>
                        Download As{' '}
                      </Mui.Grid>
                      <Mui.Stack
                        direction="column"
                        className={css2.spaceBetween}
                      >
                        <Mui.Stack direction="row" className={css2.alignCenter}>
                          <Radio
                            checked={fileFormat === '.xlsx'}
                            onChange={() => {
                              setFileFormat('.xlsx');
                              setFileFormatErr(false);
                            }}
                            style={{ color: '#F08B32' }}
                          />
                          Microsoft Excel
                        </Mui.Stack>
                        <Mui.Stack direction="row" className={css2.alignCenter}>
                          <Radio
                            checked={fileFormat === '.pdf'}
                            onChange={() => {
                              setFileFormat('.pdf');
                              setFileFormatErr(false);
                            }}
                            style={{ color: '#F08B32' }}
                          />
                          PDF
                        </Mui.Stack>
                        <Mui.Stack direction="row" className={css2.alignCenter}>
                          <Radio
                            checked={fileFormat === '.csv'}
                            onChange={() => {
                              setFileFormat('.csv');
                              setFileFormatErr(false);
                            }}
                            style={{ color: '#F08B32' }}
                          />
                          CSV
                        </Mui.Stack>
                      </Mui.Stack>
                      {fileFormatErr && (
                        <div className={css2.error}>
                          {fileFormatErr
                            ? 'Please Select valid file format'
                            : ''}
                        </div>
                      )}
                    </>
                  ) : (
                    ''
                  )}
                  <Mui.Button
                    className={css2.submitButtonDone}
                    onClick={() => {
                      if (device === 'mobile') {
                        setDownloadStatementformat(true);
                      }
                      if (fileFormat === '') setFileFormatErr(true);
                      if (
                        customDate.start === '' ||
                        customDate.end === '' ||
                        downloadPeriod === ''
                      )
                        if (customDate.start && customDate.end) {
                          setDatePeriodErr(false);
                        } else if (downloadPeriod) {
                          setDatePeriodErr(false);
                        } else {
                          setDatePeriodErr(true);
                        }

                      if (
                        fileFormat &&
                        ((customDate.start && customDate.end) || downloadPeriod)
                      ) {
                        if (state?.key === 'connectedBankingTransactions') {
                          DownloadConnectedBankingStatement();
                        } else {
                          DownloadStatement();
                        }
                        setDownloadStatement(false);
                      }
                    }}
                  >
                    Done
                  </Mui.Button>
                  <SelectBottomSheet
                    open={downloadStatementformat}
                    onClose={() => setDownloadStatementformat(false)}
                    triggerComponent={<div style={{ display: 'none' }} />}
                    addNewSheet
                  >
                    <Mui.Stack
                      direction="column"
                      className={css2.downloadStatement}
                    >
                      {' '}
                      <Mui.Stack
                        direction="column"
                        className={css2.titleGridDownload}
                      >
                        <Mui.Typography className={css2.accBalTitle}>
                          Download as{' '}
                        </Mui.Typography>

                        <Mui.Divider
                          className={css2.divider1}
                          variant="fullWidth"
                        />
                      </Mui.Stack>
                      <Mui.Stack
                        onClick={() => {
                          setFileFormat('.xlsx');
                          setFileFormatErr(false);
                          if (
                            (customDate.start && customDate.end) ||
                            (downloadPeriod && fileFormat)
                          ) {
                            if (state?.key === 'connectedBankingTransactions') {
                              DownloadConnectedBankingStatement();
                            } else {
                              DownloadStatement();
                            }
                            setDownloadStatementformat(false);
                            setDownloadStatement(false);
                          }
                        }}
                        className={css2.textFieldDownload}
                      >
                        Microsoft Excel
                      </Mui.Stack>
                      <Mui.Divider />
                      <Mui.Stack
                        onClick={() => {
                          setFileFormat('.pdf');
                          setFileFormatErr(false);
                          if (
                            (customDate.start && customDate.end) ||
                            (downloadPeriod && fileFormat)
                          ) {
                            if (state?.key === 'connectedBankingTransactions') {
                              DownloadConnectedBankingStatement();
                            } else {
                              DownloadStatement();
                            }
                            setDownloadStatementformat(false);
                            setDownloadStatement(false);
                          }
                        }}
                        className={css2.textFieldDownload}
                      >
                        PDF
                      </Mui.Stack>
                      <Mui.Divider />
                      <Mui.Stack
                        onClick={() => {
                          setFileFormat('.csv');
                          setFileFormatErr(false);
                          if (
                            (customDate.start && customDate.end) ||
                            (downloadPeriod && fileFormat)
                          ) {
                            if (state?.key === 'connectedBankingTransactions') {
                              DownloadConnectedBankingStatement();
                            } else {
                              DownloadStatement();
                            }
                            setDownloadStatementformat(false);
                            setDownloadStatement(false);
                          }
                        }}
                        className={css2.textFieldDownload}
                      >
                        CSV
                      </Mui.Stack>
                      <Mui.Divider />
                    </Mui.Stack>
                  </SelectBottomSheet>
                </Mui.Grid>
              </Mui.Grid>
            </SelectBottomSheet>
          </>
        </Mui.Grid>
      )}

      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}

      <Mui.Modal open={toggleModal} onClose={handleCloseModal}>
        <div
          id="Fastlink-container"
          style={{ height: '100vh', overflow: 'scroll', marginTop: '4vh' }}
        />
      </Mui.Modal>
      <Mui.Drawer
        anchor="bottom"
        open={filter}
        onClose={() => setFilter(false)}
        PaperProps={{
          elevation: 0,
          style: {
            backgroundColor: 'white',
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
          },
        }}
      >
        <Mui.Stack margin="1rem">
          {/* <Mui.Typography className={classes.text1}>Date</Mui.Typography>
                <Mui.Divider />
                <Mui.Typography className={classes.text1}>Party</Mui.Typography>
                <Mui.Divider /> */}
          <Mui.Typography
            onClick={() => {
              setSortByValue('order_by=amount&order=asc');
            }}
            className={classes.text1}
          >
            Amount (Low to High)
          </Mui.Typography>
          <Mui.Divider />
          <Mui.Typography
            onClick={() => {
              setSortByValue('order_by=amount&order=desc');
            }}
            className={classes.text1}
          >
            Amount (High to Low)
          </Mui.Typography>
          {/* <Mui.Divider />
          <Mui.Typography
            onClick={() => {
              setSortByValue('order_by=party_name&order=asc');
            }}
            className={classes.text1}
          >
            Party Name (A-Z)
          </Mui.Typography>
          <Mui.Divider />
          <Mui.Typography
            onClick={() => {
              setSortByValue('order_by=party_name&order=desc');
            }}
            className={classes.text1}
          >
            Party Name (Z-A)
          </Mui.Typography> */}
          <Mui.Divider />
          <Mui.Typography
            onClick={() => {
              setSortByValue('categorized=true');
            }}
            className={classes.text1}
          >
            Categorization (Categorized Transactions)
          </Mui.Typography>
          <Mui.Divider />
          <Mui.Typography
            onClick={() => {
              setSortByValue('categorized=false');
            }}
            className={classes.text1}
          >
            Categorization (Uncategorized Transactions)
          </Mui.Typography>
          <Mui.Divider />
        </Mui.Stack>
      </Mui.Drawer>
    </>
  ) : (
    <Router.Navigate to="/banking" />
  );
};
export default AccountBalance;
