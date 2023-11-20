import * as React from 'react';
import * as Mui from '@mui/material';
import syncIcon from '@assets/sync.svg';
import CategorizationBnk from '@assets/CategorizationBnk.png';
import DownloadBnk from '@assets/Download-Bnk.png';
import deleteBin from '@assets/binRed.svg';
import sortBanking from '@assets/sortBanking.svg';
import Group from '@assets/WebAssets/Group.svg';
import { makeStyles } from '@material-ui/core/styles';
import * as MuiIcon from '@mui/icons-material';
import Radio from '@material-ui/core/Radio';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import Calender from '@core/InvoiceView/Calander';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import CheckIcon from '@mui/icons-material/Check';
import InfiniteScroll from 'react-infinite-scroll-component';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import moment from 'moment';
import AppContext from '@root/AppContext.jsx';
import { useLocation } from 'react-router-dom';

import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
import {
  Selectfounders,
  BankingDownoad,
} from '@components/SvgIcons/SvgIcons.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import * as Router from 'react-router-dom';
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
    color: '  #6E6E6E',
    cursor: 'default',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  fontcolrs: {
    color: '#F08B32',
    cursor: 'default',
    '&:hover': {
      cursor: 'pointer',
    },
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
let thing;

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
let isbusinessselected = false;

const BankAccontDetails = () => {
  const classes = useStyles();
  const [color, setColor] = React.useState(false);
  const [bgColor, setbgColor] = React.useState([]);
  const { amt } = React.useContext(AppContext);
  const navigate = Router.useNavigate();
  const location = useLocation();

  const selection = (i) => {
    if (bgColor.includes(i) === true) {
      setbgColor((prev) => [...prev.filter((text) => text !== i)]);
    } else {
      setbgColor((prev) => [...prev, i]);
    }
  };

  React.useEffect(() => {
    console.log(isbusinessselected);
    if (isbusinessselected) {
      console.log('hit');
      setColor(true);
    }
  }, [location]);

  const {
    organization,
    openSnackBar,
    user,
    changeSubView,
    enableLoading,
    loading,
  } = React.useContext(AppContext);
  const [BankDetails, setBankDetails] = React.useState([]);
  const [filter, setFilter] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { state } = Router.useLocation();
  const [group, setGroup] = React.useState(false);
  const [dialogDelete, setDialogDelete] = React.useState(false);

  const [downloadStatement, setDownloadStatement] = React.useState(false);
  const [downloadStatementformat, setDownloadStatementformat] =
    React.useState(false);
  const [downloadPeriod, setdownloadPeriod] = React.useState('');
  const [infinitData, setinfinitData] = React.useState('');
  const [drawer, setDrawer] = React.useState({
    date: false,
    vendor: false,
    startDate: false,
    endDate: false,
  });
  const [fileFormat, setFileFormat] = React.useState('');
  const [fileFormatErr, setFileFormatErr] = React.useState(false);
  const [datePeriodErr, setDatePeriodErr] = React.useState(false);
  const device = localStorage.getItem('device_detect');
  const [customDate, setcustomDate] = React.useState('');
  const [sortBy, setSortBy] = React.useState('');
  const [records, setrecords] = React.useState(1);

  /* Fastlink configs  */
  const [fastLinkConfig, setFastlinkConfig] = React.useState();
  const [fastLinkConfigLocal, setFastlinkConfigLocal] = React.useState();
  const [bankAccountType, setBankAccountType] = React.useState();
  const [toggleModal, setToggleModal] = React.useState(false);
  const [bankListingDetails, setBankListingDetails] = React.useState(
    state?.value?.bankListingDetails
  );
  const [accountDetails, setAccountDetails] = React.useState(
    state?.value?.accountDetails
  );
  const [sorByValue, setSortByValue] = React.useState('');
  const [Currentrow, setCurrentrow] = React.useState(-1);
  const [dataSelected, setdataSelected] = React.useState({});
  const [BankAccountID, setBankAccountID] = React.useState('');
  const [SelectedBankID, setSelectedBankID] = React.useState(null);
  const [hasMoreItems, sethasMoreItems] = React.useState(true);
  const [dataten, setdataten] = React.useState([]);

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
            setdataten((prev) => [...prev, ...res.data]);
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

  React.useEffect(() => {
    if (sorByValue === 'clear') {
      fetchBankDetails();
      setAnchorEl(null);
      setFilter(false);
    } else if (sorByValue?.length > 0) {
      fetchBankDetails(true);
      setAnchorEl(null);
      setFilter(false);
    }
  }, [sorByValue]);

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
          fetchBankDetails();
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
                  if (data.code === 'E103') fetchBankDetails();
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
    setDatePeriodErr(false);
    setDrawer((d) => ({ ...d, startDate: false }));
  };
  const handleEndDate = (val) => {
    const input = new Date(val)
      .toLocaleDateString('fr-CA')
      .split('-')
      .join('-');
    setcustomDate((prev) => ({ ...prev, end: input }));
    setDatePeriodErr(false);
    setDrawer((d) => ({ ...d, endDate: false }));
  };

  const DownloadStatement = () => {
    const val = state?.value === undefined ? amt : state?.value;
    const dateFilter = downloadPeriod
      ? `?date=${downloadPeriod}`
      : `?start_date=${customDate?.start}&end_date=${customDate.end}`;
    enableLoading(true);
    fetch(
      `${BASE_URL}/organizations/${organization.orgId}/yodlee_bank_accounts/${val?.id}/downloads${fileFormat}${dateFilter}`,
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

  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };

  React.useEffect(() => {
    setbgColor([]);
    fetchBankDetails();
  }, [color]);

  const submitMarkedPersonal = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/yodlee_bank_accounts/${amt.id}/txn_update`,
      {
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          ids: bgColor,
          txn_category: color === false ? 'business' : 'personal',
        },
      }
    )
      .then((res) => {
        if (res && !res.error) {
          setbgColor([]);
          fetchBankDetails();
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

  const ui = (e) => {
    if (e?.party_initial === null) {
      thing = '?';
    } else {
      thing = e.party_initial;
    }
  };

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
  //       `organizations/${organization.orgId}/yodlee_bank_accounts/${state?.value?.id}/txns?page=${records}`,
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
  const loadMore = () => {
    if (records >= infinitData.pages) {
      sethasMoreItems(false);
    } else {
      setrecords((prev) => prev + 1);
    }
  };
  React.useEffect(() => {
    if (records > 1) {
      if (sorByValue?.length > 0) {
        fetchBankDetails(true);
      } else {
        fetchBankDetails();
      }
      // fetchBankDetails2();
    }
  }, [records]);

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

  React.useEffect(() => {
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
    let datafound = false;
    console.log(eve.id);
    if (dataten && dataten.length > 0) {
      const ndataten = dataten.filter(
        (data) => data.txn_category.toLowerCase() === 'business'
      );
      ndataten.forEach((banktransaction) => {
        if (banktransaction.id === eve.id) {
          dataselected = banktransaction;
          rowfound = rowcounter;
          datafound = true;
        }
        rowcounter += 1;
      });
    }
    if (datafound) {
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
      alldata.data = datanew.filter(
        (data) => data.txn_category.toLowerCase() === 'business'
      );
      setCurrentrow(rowf);
      setdataSelected(dataselected);
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
        dataselected.categorized ? 'Edit' : 'Add'
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
          selecteddata: dataSelected,
          masterslist: derivedMasters,
        },
      });
    }
  };

  return (
    <>
      {device === 'desktops' ? (
        <>
          <Mui.Grid container spacing={3} className={css.container}>
            <Mui.Grid
              item
              xs={12}
              lg={12}
              md={12}
              sm={12}
              className={
                device === 'mobile' ? css.griditem1 : css.gridItemDesktop
              }
            >
              <Mui.Box
                className={
                  device === 'mobile' ? css.heightCss : css.heightCssDesktop
                }
              >
                <Mui.Grid
                  item
                  xs={12}
                  lg={12}
                  md={12}
                  sm={12}
                  sx={{ height: { xs: '', md: '100%' } }}
                >
                  <Mui.Stack
                    direction="column"
                    spacing={1}
                    justifyContent={
                      device === 'mobile' ? 'space-between' : 'normal'
                    }
                    style={{
                      paddingBottom: device === 'mobile' ? '0px' : 0,
                      height: device === 'mobile' ? '' : '100%',
                    }}
                  >
                    <Mui.Stack direction="row" className={css2.accBalHeadStack}>
                      <Mui.Grid
                        className={
                          device === 'desktop'
                            ? css2.headiconsDesktop
                            : css2.headiconsAccBal
                        }
                      >
                        <Mui.Stack direction="column">
                          <Mui.Typography>
                            {device === 'mobile'
                              ? 'Account Balance'
                              : 'Founders Account'}
                          </Mui.Typography>
                          <Mui.Divider
                            style={{
                              borderRadius: '4px',
                              width: '10px',
                              marginTop: '7px',
                              height: '1px',
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
                      {device === 'mobile' && (
                        <Mui.Grid
                          style={{ marginRight: '20px' }}
                          onClick={() => fetchBankDetails()}
                        >
                          <img src={syncIcon} alt="loading" />
                        </Mui.Grid>
                      )}
                    </Mui.Stack>

                    <Mui.Grid className={css.bankContainer}>
                      <Mui.Stack
                        direction="row"
                        justifyContent="space-between"
                        style={{ padding: '1rem', color: '#FFFFFF' }}
                      >
                        {' '}
                        <Mui.Grid>
                          <Mui.Typography style={{ fontSize: '17px' }}>
                            {amt?.accName}
                          </Mui.Typography>

                          <Mui.Typography style={{ fontSize: '11px' }}>
                            {amt?.accNum}
                          </Mui.Typography>
                        </Mui.Grid>
                        <Mui.Typography style={{ fontSize: '17px' }}>
                          {FormattedAmount(amt?.amt)}
                        </Mui.Typography>
                      </Mui.Stack>
                    </Mui.Grid>

                    <Mui.Stack
                      direction="row"
                      justifyContent="space-around"
                      style={{ marginTop: '14px' }}
                    >
                      <Mui.Grid
                        style={{ fontSize: '15px' }}
                        className={
                          color === true ? classes.fontcolr : classes.fontcolrs
                        }
                        onClick={() => {
                          isbusinessselected = false;
                          setColor(false);
                        }}
                      >
                        Personal
                      </Mui.Grid>
                      <Mui.Grid
                        style={{ fontSize: '15px' }}
                        className={
                          color === false ? classes.fontcolr : classes.fontcolrs
                        }
                        onClick={() => {
                          isbusinessselected = true;
                          setColor(true);
                        }}
                      >
                        {' '}
                        Business
                      </Mui.Grid>
                    </Mui.Stack>
                    <Mui.Grid
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        // marginLeft: '-13.5%',
                        width: '100%',
                      }}
                    >
                      <Mui.Grid xs={6} lg={6} md={6} sm={6}>
                        <Mui.Divider
                          className={
                            color === true ? classes.colr : classes.colrs
                          }
                          variant="fullWidth"
                        />{' '}
                      </Mui.Grid>
                      <Mui.Grid xs={6} lg={6} md={6} sm={6}>
                        <Mui.Divider
                          className={
                            color === false ? classes.colr : classes.colrs
                          }
                          variant="fullWidth"
                        />
                      </Mui.Grid>{' '}
                    </Mui.Grid>

                    <InfiniteScroll
                      loadMore={loadMore}
                      hasMore={hasMoreItems}
                      loader={<div className={css2.loader}> Loading... </div>}
                      useWindow={false}
                    >
                      <Mui.Grid
                        className={
                          device === 'desktop'
                            ? css.dataGridDesktop
                            : css.dataGrid
                        }
                      >
                        {BankDetails.map((e) =>
                          (e.txn_category === 'business' && color === true) ||
                          (e.txn_category === 'personal' && color === false) ? (
                            <>
                              <Mui.Stack
                                id={e.id}
                                direction="row"
                                justifyContent="space-between"
                                onClick={() => {
                                  selection(e.id);
                                }}
                                className={
                                  bgColor.includes(e.id) === true
                                    ? css.payments2
                                    : css.payments
                                }
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
                                    {bgColor.includes(e.id) === true ? (
                                      <CheckIcon />
                                    ) : (
                                      (ui(e), thing)
                                    )}
                                  </Mui.Avatar>
                                </Mui.Grid>
                                <Mui.Grid
                                  onClick={() => {
                                    changeSubView({
                                      route: 'categorizeTransactions',
                                      id: e.id,
                                    });
                                  }}
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                  }}
                                >
                                  <Mui.Grid
                                    style={{
                                      fontSize: '14px',
                                      marginLeft: '4%',
                                      marginRight: '14%',
                                    }}
                                  >
                                    {e?.party_name === null
                                      ? 'Unknown'
                                      : e.party_name}
                                  </Mui.Grid>
                                  <Mui.Stack
                                    direction="column"
                                    className={css2.alignRight}
                                    style={{
                                      marginRight: ' 0%',
                                      whiteSpace: 'nowrap',
                                    }}
                                    onClick={() => {
                                      changeSubView({
                                        route: 'categorizeTransactions',
                                        id: e.id,
                                      });
                                    }}
                                  >
                                    <Mui.Grid
                                      className={
                                        e?.amount < 0
                                          ? css.amtRed
                                          : css.amtGreen
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
                                </Mui.Grid>
                              </Mui.Stack>
                            </>
                          ) : (
                            <></>
                          )
                        )}
                      </Mui.Grid>
                    </InfiniteScroll>
                  </Mui.Stack>
                </Mui.Grid>
              </Mui.Box>
              {device === 'desktop' && (
                <Mui.Button
                  className={
                    device === 'desktop'
                      ? css.lastButtonDesktop
                      : css.lastButton
                  }
                  onClick={() => submitMarkedPersonal()}
                >
                  {color === false
                    ? `Mark ${bgColor.length} Transactions as Business`
                    : `Mark ${bgColor.length} Transactions as Personal`}
                </Mui.Button>
              )}
            </Mui.Grid>
            {device === 'mobile' && (
              <Mui.Button
                className={
                  device === 'desktop' ? css.lastButtonDesktop : css.lastButton
                }
                onClick={() => submitMarkedPersonal()}
              >
                {color === false
                  ? `Mark ${bgColor.length} Transactions as Business`
                  : `Mark ${bgColor.length} Transactions as Personal`}
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
                className={classes.text}
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
                {device === 'mobile' ? 'Account Balance' : 'Account Statement'}
              </Mui.Typography>

              <Mui.Divider className={css2.divider1} variant="fullWidth" />
            </Mui.Stack>
            {device === 'desktop' && (
              <Mui.Grid className={css2.icons}>
                <Mui.Grid
                  onClick={() => setDownloadStatement(true)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Mui.Tooltip title="Download" placement="bottom-end">
                    <img src={DownloadBnk} width="24px" alt="bankIcon" />
                  </Mui.Tooltip>
                </Mui.Grid>
                <Mui.Grid
                  onClick={() => navigate('/bankingcategorizeddetails')}
                  sx={{ cursor: 'pointer' }}
                >
                  <Mui.Tooltip
                    title="Categorize Transaction"
                    placement="bottom-end"
                  >
                    <img src={CategorizationBnk} width="24px" alt="bankIcon" />
                  </Mui.Tooltip>
                </Mui.Grid>
                <Mui.Grid
                  sx={{ cursor: 'pointer' }}
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
                    setFastlinkConfig('refresh_bank');
                    setFastlinkConfigLocal('refresh_bank');
                    setBankAccountType(
                      bankListingDetails?.find(
                        (e) => e.id === accountDetails.id
                      )?.bank_account_type
                    );
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <Mui.Tooltip title="Refresh" placement="bottom-end">
                    <img src={Group} width="24px" alt="repeat" />
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
                              setinfinitData('');
                              setBankDetails([]);
                              setdataten([]);
                              setrecords(0);
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
                    {state?.value?.accName}
                  </Mui.Typography>
                </Mui.Stack>
                <Mui.Typography
                  style={{ fontSize: '11px' }}
                  className={css2.insideContainer}
                >
                  {state?.value?.accNum}
                </Mui.Typography>
              </Mui.Grid>
              <Mui.Typography
                style={{ fontSize: '17px' }}
                className={css2.insideContainerRight}
              >
                {FormattedAmount(state?.value?.amt)}
              </Mui.Typography>
            </Mui.Stack>

            {device === 'mobile' && (
              <Mui.Grid className={css2.icons}>
                <Mui.Grid onClick={() => setDownloadStatement(true)}>
                  <img src={DownloadBnk} width="24px" alt="bankIcon" />
                </Mui.Grid>
                <Mui.Grid
                  onClick={() =>
                    navigate('/bankingcategorizeddetails', {
                      state: { from: 'founder' },
                    })
                  }
                >
                  <img src={CategorizationBnk} width="24px" alt="bankIcon" />
                </Mui.Grid>
                <Mui.Grid onClick={() => setFilter(true)}>
                  <img src={sortBanking} width="24px" alt="bankIcon" />
                </Mui.Grid>
                <Mui.Grid
                  onClick={() => {
                    setFastlinkConfig('refresh_bank');
                    setFastlinkConfigLocal('refresh_bank');
                    setBankAccountType(
                      bankListingDetails?.find(
                        (e) => e.id === accountDetails.id
                      )?.bank_account_type
                    );
                  }}
                >
                  <img src={Group} width="24px" alt="bankIcon" />
                </Mui.Grid>
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
                    <Mui.Stack direction="column">
                      <Mui.Typography>Sort by</Mui.Typography>

                      <Mui.Divider
                        className={css2.dividerSortBy}
                        variant="fullWidth"
                      />
                    </Mui.Stack>
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
                    <Mui.Divider />
                    {/* <Mui.Typography
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
                    </Mui.Typography>
                    <Mui.Divider /> */}
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
              </Mui.Grid>
            )}
          </Mui.Grid>
          <Mui.Stack
            direction="row"
            justifyContent="space-around"
            style={{ marginTop: '14px' }}
          >
            <Mui.Grid
              style={{ fontSize: '15px' }}
              className={color === true ? classes.fontcolr : classes.fontcolrs}
              onClick={() => {
                isbusinessselected = false;
                setColor(false);
              }}
            >
              {/* Business */}
              Personal
            </Mui.Grid>
            <Mui.Grid
              style={{ fontSize: '15px' }}
              className={color === false ? classes.fontcolr : classes.fontcolrs}
              onClick={() => {
                isbusinessselected = true;
                setColor(true);
              }}
            >
              {' '}
              {/* Personal */}
              Business
            </Mui.Grid>
          </Mui.Stack>
          <Mui.Grid className={css2.markTransactions}>
            <Mui.Grid xs={6} lg={6} md={6} sm={6}>
              <Mui.Divider
                className={color === true ? classes.colr : classes.colrs}
                variant="fullWidth"
              />{' '}
            </Mui.Grid>
            <Mui.Grid xs={6} lg={6} md={6} sm={6}>
              <Mui.Divider
                className={color === false ? classes.colr : classes.colrs}
                variant="fullWidth"
              />
            </Mui.Grid>{' '}
          </Mui.Grid>

          <>
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

              // useWindow={false}
            >
              <Mui.Grid>
                {dataten?.map(
                  (e) =>
                    ((e.txn_category === 'business' && color === true) ||
                      (e.txn_category === 'personal' && color === false)) && (
                      <Mui.Grid
                        item
                        xs={12}
                        lg={12}
                        md={12}
                        sx={12}
                        id={e.id}
                        style={{
                          backgroundColor:
                            state?.efforrtless !== true &&
                            !e?.party_name &&
                            '#FFDFC4',
                        }}
                        onClick={() => {
                          selection(e.id);
                        }}
                        className={
                          bgColor.includes(e.id) === true
                            ? css.payments2
                            : css.payments
                        }
                        direction="row"
                        justifyContent="space-between"
                      >
                        {bgColor.includes(e.id) === true && (
                          <Mui.Grid
                            item
                            xs={2}
                            lg={1}
                            md={1}
                            sx={2}
                            alignSelf="center"
                          >
                            <Selectfounders />
                          </Mui.Grid>
                        )}

                        <Mui.Grid
                          item
                          xs={7}
                          lg={10}
                          md={10}
                          sx={7}
                          className={
                            bgColor.includes(e.id) === true
                              ? css2.nameAndNarrationAfter
                              : css2.nameAndNarration
                          }
                        >
                          <Mui.Stack direction="row">
                            <Mui.Grid>
                              {(state?.efforrtless !== true &&
                                (e?.party_name === null
                                  ? 'Unknown'
                                  : e.party_name)) ||
                                e?.narration}
                            </Mui.Grid>
                            {e.txn_category === 'business' ? (
                              <Mui.Grid style={{ paddingLeft: '15px' }}>
                                <Mui.Button
                                  onClick={() =>
                                    BankTransactionSelected(
                                      e,
                                      e.categorized ? 'edit' : 'add'
                                    )
                                  }
                                  style={{
                                    borderRadius: '10px',
                                    height: '20px',
                                    color: 'white',
                                    background: '#f08b32',
                                    fontSize: '.9vw',
                                    float: 'right',
                                  }}
                                >
                                  {!e.categorized
                                    ? 'Categorize'
                                    : 'Edit Categorization'}
                                </Mui.Button>
                              </Mui.Grid>
                            ) : (
                              ''
                            )}
                            {e?.similarity_group === true && (
                              <Mui.Button
                                className={css2.groupBy}
                                onClick={(event) => {
                                  event.stopPropagation();
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
                        <Mui.Grid
                          item
                          xs={3}
                          lg={1}
                          md={1}
                          sx={3}
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
                          <Mui.Grid className={css2.date}>
                            {moment(e?.date).format('DD MMMM YYYY')}
                          </Mui.Grid>
                        </Mui.Grid>
                      </Mui.Grid>
                    )
                )}
                <Mui.Button
                  className={
                    device === 'desktop'
                      ? css.lastButtonDesktop
                      : css.markSubmit
                  }
                  onClick={() => submitMarkedPersonal()}
                >
                  {color === false
                    ? `Mark ${bgColor.length} Transactions as Business`
                    : `Mark ${bgColor.length} Transactions as Personal`}
                </Mui.Button>

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
                      <Mui.Grid className={css2.groupByName}>
                        Group Name :
                      </Mui.Grid>
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
                        <Mui.Stack
                          direction="row"
                          className={css2.groupNameAmount}
                        >
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
                        Are you sure that you want to remove this transaction
                        from the {'<Group Name>'} Group?
                      </Mui.Grid>
                      <Mui.Stack direction="row" className={css2.buttonWidth}>
                        <Mui.Button className={css2.CancelButton}>
                          No
                        </Mui.Button>
                        <Mui.Button className={css2.submitButton}>
                          Yes
                        </Mui.Button>
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

                      <Mui.Divider
                        className={css2.divider1}
                        variant="fullWidth"
                      />
                    </Mui.Grid>
                    <Mui.Grid className={css2.cardDownload}>
                      <Mui.Grid className={css2.downloadDescr}>
                        From which period do you need a statement?
                      </Mui.Grid>
                      <Mui.Grid className={css2.paddingRadio}>
                        <Mui.Stack
                          direction="row"
                          className={css2.spaceBetween}
                        >
                          <Mui.Stack
                            direction="row"
                            className={css2.alignCenter}
                          >
                            <Radio
                              checked={downloadPeriod === 'Last Month'}
                              onChange={(e) => {
                                setdownloadPeriod(e.target.value);
                                setDatePeriodErr(false);
                              }}
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
                              onChange={(e) => {
                                setdownloadPeriod(e.target.value);
                                setDatePeriodErr(false);
                              }}
                              value="Last 3 Months"
                              style={{ color: '#F08B32' }}
                            />
                            Last 3 Months
                          </Mui.Stack>
                        </Mui.Stack>
                        <Mui.Stack
                          direction="row"
                          className={css2.spaceBetween}
                        >
                          <Mui.Stack
                            direction="row"
                            className={css2.alignCenter}
                          >
                            <Radio
                              checked={downloadPeriod === 'Last 6 Months'}
                              onChange={(e) => {
                                setdownloadPeriod(e.target.value);
                                setDatePeriodErr(false);
                              }}
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
                              onChange={(e) => {
                                setdownloadPeriod(e.target.value);
                                setDatePeriodErr(false);
                              }}
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
                                    ? moment(customDate?.start).format(
                                        'DD-MM-YYYY'
                                      )
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
                                    ? moment(customDate?.end).format(
                                        'DD-MM-YYYY'
                                      )
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
                                    setDrawer((d) => ({
                                      ...d,
                                      endDate: false,
                                    }));
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
                            <Mui.Stack
                              direction="row"
                              className={css2.alignCenter}
                            >
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
                            <Mui.Stack
                              direction="row"
                              className={css2.alignCenter}
                            >
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
                            <Mui.Stack
                              direction="row"
                              className={css2.alignCenter}
                            >
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
                            ((customDate.start && customDate.end) ||
                              downloadPeriod)
                          ) {
                            DownloadStatement();
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
                                DownloadStatement();
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
                                DownloadStatement();
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
                                DownloadStatement();
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
              </Mui.Grid>
            </InfiniteScroll>
          </>
        </Mui.Grid>
      )}
      <Mui.Modal open={toggleModal} onClose={handleCloseModal}>
        <div
          id="Fastlink-container"
          style={{ height: '100vh', overflow: 'scroll', marginTop: '4vh' }}
        />
      </Mui.Modal>
    </>
  );
};
export default BankAccontDetails;
