import React, { useContext } from 'react';
import AppContext from '@root/AppContext.jsx';
import * as Mui from '@mui/material';
import * as Router from 'react-router-dom';
import JSBridge from '@nativeBridge/jsbridge';
import PageTitle from '@core/DashboardView/PageTitle';
import * as cssDash from '@core/DashboardView/DashboardViewContainer.scss';
import moment from 'moment';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
// import RupeesReceivables from '@assets/WebAssets/RupeesReceivables.svg';
import SearchIcon from '@mui/icons-material/Search';
// import download from '@assets/downloadReceivables.svg';
import RequestPayment from '@core/Receivables/Ageing/RequestPayment.jsx';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import Calender from '@core/InvoiceView/Calander';
import DownloadIcon from '@mui/icons-material/Download';
import MailIcon from '@assets/Greenmail';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FileDownloadIcon from '@assets/Rdownload';
// import BorderColorIcon from '@assets/Redit';
// import DeleteIcon from '@assets/Rdelete';
import netBalance from '@assets/netBalance.png';
import collectionEffectiveness from '@assets/collectionEffective.png';
import dso from '@assets/dso.png';
// import Rupee from '@assets/IndianRupee.svg';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import { makeStyles } from '@material-ui/core';
import PopperComp from '../../../components/Popper/PopperComp';
// import * as css from './AgeingRece.scss';
import * as css from './Ageing.scss';
import OpenBills from './OpenBills';
import RelationShip from './RelationShip';
import Reports from './Report';
import Agreement from './Agreement';

const useStyles = makeStyles(() => ({
  chips: {
    width: '23vw',
    flexDirection: 'column',
    '& .MuiChip-root': {
      background: 'white',
      border: '1px solid #f0f0f0',
      flexDirection: 'row-reverse !important',
      padding: '20px 10px',
      justifyContent: 'space-between',
    },
    '& .MuiChip-icon': {
      marginRight: '5px',
      marginLeft: '-10px',
    },
  },
  chipsForMob: {
    margin: '20px 20px 16px',
    alignItems: 'end',
    '& .MuiChip-root': {
      background: '#FFF !important',
      border: '1px solid #a7abaf63 !important',
      borderRadius: '4.4px !important',
      flexDirection: 'row-reverse !important',
      padding: '20px 15px',
      width: '53vw',
      justifyContent: 'space-between',
      boxShadow: 'none !important',
    },
    '& .MuiChip-icon': {
      marginRight: '5px',
      marginLeft: '-10px',
    },
  },
  chipsDown: {
    margin: '0 5px',
    '& .MuiChip-root': {
      background: 'white',
      border: '1px solid #f0f0f0',
      flexDirection: 'row-reverse !important',
      padding: '5px 12px 5px 5px',
    },
    '& .MuiChip-icon': {
      margin: '0 0 0 5px',
    },
  },
  chipsUp: {
    margin: '0 5px',
    '& .MuiChip-root': {
      background: 'white',
      border: '1px solid #F08B32',
      padding: '8px 12px !important',
      height: '36px',
    },
    '& .MuiChip-icon': {
      marginRight: '5px',
      marginLeft: '-10px',
    },
  },
  paper: {
    padding: '20px 10px',
    borderRadius: '18px !important',
    // marginBottom: '40px',
  },
}));

const SelectedAging = () => {
  // const { name, noofInvoices, rupees, average, status, sampleRowData, id } = props.data;
  const [menuSelected, setMenuSelected] = React.useState('openbills');
  const { organization, user, enableLoading, openSnackBar, userPermissions, openPanelContext } =
    useContext(AppContext);
  const [data, setData] = React.useState();
  const [customerAgreement, setCustomerAgreement] = React.useState();
  const [showCustomerAgreement, setShowCustomerAgreement] =
    React.useState(false);
  const [topVal, setTopVal] = React.useState({
    collection: 0,
    dso: 0,
    balance: 0,
  });
  const classes = useStyles();

  const { state } = Router.useLocation();
  const navigate = Router.useNavigate();
  const [selected, setSelected] = React.useState(1);
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  const [dateState, setDateState] = React.useState({
    startDate: '',
    endDate: '',
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElDate, setAnchorElDate] = React.useState({
    value: state?.selectedDate,
    opened: null,
  });
  const [anchorElDateOutstand, setAnchorElOutstand] = React.useState(null);
  const device = localStorage.getItem('device_detect');
  const [actState, setActState] = React.useState([]);
  const [actStateBalance, setActStateBalance] = React.useState({});
  const open = Boolean(anchorEl);
  const [customerList, setCustomerList] = React.useState([]);
  const [customerId, setCustomerId] = React.useState(state?.tableId);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [requestPayment, setRequestPayment] = React.useState(false);
  const [filteredCustList, setFilteredCustList] = React.useState([]);
  const [dateStateAuto, setDateStateAuto] = React.useState({
    startDate: false,
    endDate: false,
  });
  const [stmtFilter, setStmtFilter] = React.useState({});
  const [userRoles, setUserRoles] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  React.useEffect(() => {
    if (Object.keys(userPermissions?.Receivables || {})?.length > 0) {
      if (!userPermissions?.Receivables?.Receivables) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRoles({ ...userPermissions?.Receivables });
    }
  }, [userPermissions]);

  React.useEffect(() => {
    if (
      Object.keys(userRoles?.['Customer Ageing'] || {})?.length > 0 &&
      menuSelected === 'openbills'
    ) {
      if (!userRoles?.['Customer Ageing']?.view_receivable_ageing) {
        setHavePermission({
          open: true,
          back: () => {
            navigate(-1);
            setHavePermission({ open: false });
          },
        });
      }
    }
    if (
      Object.keys(userRoles?.['Customer Analytics'] || {})?.length > 0 &&
      menuSelected === 'Analytics'
    ) {
      if (!userRoles?.['Customer Analytics']?.view_receivable_analytics) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
            setMenuSelected('openbills');
          },
        });
      }
    }
    if (
      Object.keys(userRoles?.['Customer Relationships'] || {})?.length > 0 &&
      menuSelected === 'relationship'
    ) {
      if (!userRoles?.['Customer Relationships']?.view_customer_interactions) {
        setHavePermission({
          open: true,
          back: () => {
            setHavePermission({ open: false });
            setMenuSelected('openbills');
          },
        });
      }
    }
  }, [
    userRoles?.['Customer Ageing'],
    userRoles?.['Customer Analytics'],
    userRoles?.['Customer Relationships'],
    menuSelected,
  ]);

  const RecurringCheck = (r_type) => {
    if (!userPermissions?.Invoicing?.Contract?.[r_type]) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return false;
    }
    return true;
   };

  React.useEffect(() => {
    if (searchQuery?.length > 0) {
      setFilteredCustList(
        customerList?.filter((filterVal) =>
          filterVal?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
        ),
      );
    } else {
      setFilteredCustList(customerList);
    }
  }, [searchQuery, customerList]);

  React.useEffect(() => {
    if (!state) {
      navigate('/receivables');
    }
    if (state?.from === 'people') {
      setMenuSelected(state?.open);
    }
  }, [state]);
  React.useEffect(() => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/accounts/${customerId}/profiles`,
      {
        method: METHOD.GET,
        headers: {
          authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          setData(res);
        } else {
          openSnackBar({
            message: res.message || 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((err) => {
        enableLoading(false);
        console.log(err);
        openSnackBar({
          message: `Sorry we will look into in`,
          type: MESSAGE_TYPE.ERROR,
        });
      });
  }, [customerId]);

  const statement = () => {
    enableLoading(true);
    RestApi(
      `organizations/${
        organization.orgId
      }/receivables/account_statements/${customerId}?start_date=${
        dateState.startDate === ''
          ? ''
          : moment(dateState.startDate).format('YYYY-MM-DD')
      }&end_date=${
        dateState.endDate === ''
          ? ''
          : moment(dateState.endDate).format('YYYY-MM-DD')
      }`,
      {
        method: METHOD.GET,
        headers: {
          authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          setActState(
            res?.data?.map((val, index) => ({ ...val, ids: index + 1 })),
          );
          setActStateBalance({opening_balance: res?.opening_balance, closing_balance: res?.closing_balance});
        }
        enableLoading(false);
      })
      .catch((err) => {
        enableLoading(false);
        console.log(err);
      });
    if (dateStateAuto?.startDate || dateStateAuto.endDate) {
      setDateStateAuto({ startDate: false, endDate: false });
    }
  };

  React.useEffect(() => {
    const wait = setTimeout(() => {
      if (dateStateAuto?.startDate || dateStateAuto.endDate) {
        statement();
      }
    }, 500);
    return () => {
      clearTimeout(wait);
    };
  }, [dateStateAuto.startDate, dateStateAuto.endDate]);

  const CustomerAgreements = () => {
    RestApi(
      // `organizations/${organization.orgId}/accounts/${pageParams}/profiles`,
      `organizations/${organization.orgId}/customer_agreements?customer_id=${customerId}`,
      {
        method: METHOD.GET,
        headers: {
          authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          // setValue(res?.data);
          if (res?.show_agreement) {
            setCustomerAgreement(res?.data);
            setShowCustomerAgreement(true);
          } else {
            setCustomerAgreement(null);
            setShowCustomerAgreement(false);
            if (menuSelected === 'Agreements') {
              setMenuSelected('openbills');
            }
          }
        } else if (res?.error) {
          openSnackBar({
            message: res?.message || 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch(() => {
        openSnackBar({
          message: 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  React.useEffect(() => {
    if (selected === 2) {
      statement();
    }
    if (customerId) CustomerAgreements();

    if (menuSelected === 'Analytics') {
      const temp = menuSelected;
      setMenuSelected('');
      setTimeout(() => {
        setMenuSelected(state?.open || temp);
      }, 500);
    }
  }, [customerId]);

  React.useEffect(() => {
    enableLoading(true);
    RestApi(
      `organizations/${
        organization.orgId
      }/receivables/open_bills?customer_id=${customerId}&date=${moment(
        anchorElDate.value,
      ).format('YYYY-MM-DD')}&report_view=${state?.wise}`,
      // `organizations/${organization.orgId}/receivables/open_bills?customer_id=95cb1847-8ff0-4028-80ea-00aa1f0435f0`,
      {
        method: METHOD.GET,
        headers: {
          authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      if (res && !res.error) {
        setTopVal({
          collection: res?.collection_effectiveness,
          dso: res?.dso,
          // dso: 0,
          balance: res?.net_balance,
        });
      }
      enableLoading(false);
    });
  }, [customerId, anchorElDate?.value]);

  const handleChange = (event) => {
    setAnchorElOutstand(null);
    setSelected(event);
    if (event === 2) {
      statement();
    }
  };
  const handleTabChange = (event, newValue) => {
    setMenuSelected(newValue);
  };

  React.useEffect(() => {
    setSelected(1);
    setDateState({ startDate, endDate: new Date() });
  }, [menuSelected]);

  React.useEffect(() => {
    if (device === 'desktop' && dateState.startDate && dateState.endDate) {
      if (
        new Date(dateState.startDate).setHours(0, 0, 0, 0) >
        new Date(dateState.endDate).setHours(0, 0, 0, 0)
      ) {
        setDateState({
          endDate: new Date(),
          startDate,
        });
      }
    }
    // if (selected === 2) {
    //   statement();
    // }
    // else if (device === 'mobile' && fromDate && toDate) {
    //   if (
    //     new Date(fromDate).setHours(0, 0, 0, 0) >
    //     new Date(toDate).setHours(0, 0, 0, 0)
    //   ) {
    //     setFromDate(null);
    //   }
    // }
  }, [dateState.startDate]);

  React.useEffect(() => {
    if (device === 'desktop' && dateState.startDate && dateState.endDate) {
      if (
        new Date(dateState.endDate).setHours(0, 0, 0, 0) <
        new Date(dateState.startDate).setHours(0, 0, 0, 0)
      ) {
        setDateState({
          startDate,
          endDate: new Date(),
        });
      }
    }
    // else if (device === 'mobile' && fromDate && toDate) {
    //   if (
    //     new Date(toDate).setHours(0, 0, 0, 0) <
    //     new Date(fromDate).setHours(0, 0, 0, 0)
    //   ) {
    //     setToDate(null);
    //   }
    // }
  }, [dateState.endDate]);

  const downloadFunction = () => {
    const fetchUrl = selected === 1
      ? `${BASE_URL}/organizations/${organization.orgId
      }/receivables/open_bills.xlsx?customer_id=${customerId}&date=${moment(
        anchorElDate.value,
      ).format('YYYY-MM-DD')}&report_view=${state?.wise}`
      : `${BASE_URL}/organizations/${organization.orgId
      }/receivables/account_statements/${customerId}.xlsx?start_date=${dateState.startDate === ''
        ? ''
        : moment(dateState.startDate).format('YYYY-MM-DD')
      }&end_date=${dateState.endDate === ''
        ? ''
        : moment(dateState.endDate).format('YYYY-MM-DD')
      }`;
    if (device === 'mobile') {
      JSBridge.downloadWithAuthentication(fetchUrl);
    } else {
      enableLoading(true);
      fetch(fetchUrl,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
        },
      )
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = selected === 1 ? 'open_bills' : 'statement';
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
      enableLoading(false);
    }
  };

  // const Transition = React.forwardRef(function Transition(props, ref) {
  //   return <Mui.Slide direction="left" ref={ref} {...props} />;
  // });

  React.useEffect(() => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/receivables/ageing?date=${moment(
        anchorElDate.value,
      ).format('YYYY-MM-DD')}`,
      // `organizations/${organization.orgId}/receivables/ageing?date=19/03/2021`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    ).then((res) => {
      if (res && !res.error) {
        setCustomerList(res.data);
      }
      enableLoading(false);
    });
  }, [organization.orgId, user.activeToken, anchorElDate.value]);

  React.useEffect(() => {
    const temp = menuSelected;
    setMenuSelected('');
    setTimeout(() => {
      setMenuSelected(state?.open || temp);
     }, 500);
   }, [openPanelContext]);

  return (
    <>
      <PageTitle
        title="Receivables"
        onClick={() => {
          if (state?.from === 'people') {
            navigate('/people', { state: { choose: 'tab1' } });
          } else {
            navigate(-1);
          }
        }}
      />
      <div
        className={
          device === 'mobile'
            ? // ? css.dashboardBodyContainer
              cssDash.dashboardBodyContainerhideNavBar
            : cssDash.dashboardBodyContainerDesktop
        }
        // style={{
        //   margin:
        //     device === 'desktop' && pathName === '/payables-ageing-view'
        //       ? 0
        //       : '',
        // }}
      >
        <div
          className={
            device === 'mobile' ? css.DetailsPaper : css.DetailsPaperDesk
          }
          style={{
            filter:
              device === 'mobile' && menuSelected === 'Agreements'
                ? 'blur(0px)'
                : '',
          }}
        >
          {/* {device !== 'mobile' && (
        // <Mui.Typography className={css.ageingTitle}>Ageing</Mui.Typography> */}
          <div
            style={{
              display: device === 'mobile' ? 'block' : 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: device === 'mobile' ? 0 : '30px',
            }}
          >
            <div
              className={
                device === 'mobile' ? classes.chipsForMob : classes.chips
              }
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p
                  className={
                    device === 'mobile' ? css.chipHeaderMob : css.chipHeader
                  }
                >
                  Select customer
                </p>
                <Mui.Chip
                  label={
                    <p
                      className={
                        device === 'mobile'
                          ? css.chipsNameForMob
                          : css.chipsName
                      }
                    >
                      {data?.name || '-'}
                    </p>
                  }
                  icon={
                    <KeyboardArrowDown
                      style={{
                        color: device === 'mobile' ? '#f08b32' : '#000',
                      }}
                    />
                  }
                  className={css.chipLabel2}
                  onClick={(event) => {
                    setSearchQuery('');
                    setAnchorEl(event.currentTarget);
                  }}
                  sx={{
                    '& .MuiChip-label': {
                      paddingLeft: 0,
                    },
                  }}
                />
              </div>
              {device === 'mobile' && menuSelected === 'openbills' && (
                <div style={{ display: 'flex', gap: 16 }}>
                  {selected === 1 && (
                    <Mui.IconButton
                      onClick={() => {
                        // navigate('/receivables-schedule')
                        setRequestPayment(true);
                      }}
                      style={{ background: '#E5F6F1', height: 40, width: 40 }}
                    >
                      <img src={MailIcon} alt="mail" />
                      {/* <MailOutlineIcon sx={{ color: '#F08B32' }} /> */}
                    </Mui.IconButton>
                  )}
                  <Mui.IconButton
                    onClick={() => {
                      downloadFunction();
                    }}
                    style={{ background: '#FDF3EA', height: 40, width: 40 }}
                  >
                    <img src={FileDownloadIcon} alt="download" />
                    {/* <FileDownloadIcon sx={{ color: '#F08B32' }} /> */}
                  </Mui.IconButton>
                </div>
              )}
            </div>
            {device === 'desktop' && (
              <div className={css.secondBox}>
                <div className={css.innerDiv1}>
                  <div
                    style={{
                      width: '20%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={netBalance}
                      alt="netBalance"
                      style={{ width: '32px', height: '32px' }}
                    />
                  </div>
                  <div style={{ width: '75%' }}>
                    <p className={css.headPTag}>Net Balance</p>
                    <p className={css.subPTag}>
                      {FormattedAmount(topVal?.balance)}
                    </p>
                  </div>
                </div>
                <div className={css.innerDiv2}>
                  <div
                    style={{
                      width: '20%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={collectionEffectiveness}
                      alt="collectionEffectiveness"
                      style={{ width: '32px', height: '32px' }}
                    />
                  </div>
                  <div style={{ width: '75%' }}>
                    <p className={css.headPTag}>Collection Effectiveness</p>
                    <p className={css.subPTag}>{topVal?.collection}%</p>
                  </div>
                </div>
                <div className={css.innerDiv3}>
                  <div
                    style={{
                      width: '20%',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={dso}
                      alt="dso"
                      style={{ width: '32px', height: '32px' }}
                    />
                  </div>
                  <div style={{ width: '75%' }}>
                    <p className={css.headPTag}>DSO</p>
                    <p className={css.subPTag}>{topVal?.dso} Days</p>
                  </div>
                </div>
              </div>
            )}
            {device === 'mobile' && (
              <div className={css.newMobTopCard}>
                {[
                  {
                    name: 'Current Receivable',
                    value: FormattedAmount(topVal?.balance),
                    color: '#4AA44D',
                  },
                  {
                    name: 'Collection Effectiveness',
                    value: `${topVal?.collection}%`,
                    color: '#F3894E',
                  },
                  {
                    name: 'DSO',
                    value: `${topVal?.dso} Days`,
                    color: '#ECBA3A',
                  },
                ].map((val) => (
                  <div className={css.mobileCard}>
                    <Mui.ListItemText
                      primary={
                        <Mui.Typography
                          className={
                            device === 'mobile' ? css.headTextMob : css.headText
                          }
                          color={val.color}
                        >
                          {val.name}
                        </Mui.Typography>
                      }
                      secondary={
                        <Mui.Typography
                          className={
                            device === 'mobile' ? css.subTextMob : css.subText
                          }
                          noWrap
                        >
                          {val.value}
                        </Mui.Typography>
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* )} */}
          <div
            className={device === 'mobile' ? css.receivables : css.receivables2}
          >
            {device === 'mobile' && (
              <div className={css.menuContainer}>
                <div
                  className={`${css.menu} ${
                    menuSelected === 'openbills' ? css.selected : ''
                  }`}
                  style={{
                    borderRadius: device === 'mobile' ? '8px' : '10px 0 0 10px',
                  }}
                  onClick={() => setMenuSelected('openbills')}
                >
                  Open Bills
                </div>
                <div
                  className={`${css.menu} ${
                    menuSelected === 'relationship' ? css.selected : ''
                  }`}
                  onClick={() => setMenuSelected('relationship')}
                >
                  Relationship
                </div>
                <div
                  className={`${css.menu} ${
                    menuSelected === 'Analytics' ? css.selected : ''
                  }`}
                  onClick={() => setMenuSelected('Analytics')}
                >
                  Analytics
                </div>
                {showCustomerAgreement && (
                  <div
                    className={`${css.menu} ${
                      menuSelected === 'Agreements' ? css.selected : ''
                    }`}
                    style={{
                      borderRadius:
                        device === 'mobile' ? '8px' : '0 10px 10px 0',
                    }}
                    onClick={() => setMenuSelected('Agreements')}
                  >
                    Agreements
                  </div>
                )}
              </div>
            )}

            {device === 'desktop' && (
              <Mui.Box
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  marginBottom: '20px',
                }}
              >
                <Mui.Tabs
                  value={menuSelected}
                  onChange={handleTabChange}
                  aria-label="basic tabs example"
                  sx={{
                    '& .MuiTabs-indicator': {
                      width: '100%',
                      backgroundColor: '#F08B32',
                    },
                    '& .MuiTabs-flexContainer': {
                      justifyContent: 'space-around',
                    },
                    '& .Mui-selected': {
                      color: '#F08B32 !important',
                      fontWeight: '400 !important',
                    },
                    '& .MuiTab-root': {
                      fontWeight: '300',
                    },
                  }}
                >
                  <Mui.Tab
                    label={<p className={css.newTabPTag}>Open Bills</p>}
                    value="openbills"
                  />
                  <Mui.Tab
                    label={<p className={css.newTabPTag}>Relationship</p>}
                    value="relationship"
                  />
                  <Mui.Tab
                    label={<p className={css.newTabPTag}>Analytics</p>}
                    value="Analytics"
                  />
                  {showCustomerAgreement && (
                    <Mui.Tab
                      label={<p className={css.newTabPTag}>Agreements</p>}
                      value="Agreements"
                    />
                  )}
                </Mui.Tabs>
              </Mui.Box>
            )}
            {menuSelected === 'openbills' && (
              <div
                className={
                  device === 'mobile'
                    ? (selected === 1 && css.outstandingMob) ||
                      css.outstandingMobStmt
                    : css.outstanding
                }
              >
                {device === 'desktop' && (
                  <div className={css.newChangeTab}>
                    <div
                      onClick={() => handleChange(1)}
                      className={
                        selected === 1 ? css.selectedTab : css.unselectedTab
                      }
                    >
                      <p style={{ margin: 'auto' }}>Outstanding</p>
                    </div>
                    <div
                      onClick={() => handleChange(2)}
                      className={
                        selected === 2 ? css.selectedTab : css.unselectedTab
                      }
                    >
                      <p style={{ margin: 'auto' }}>Statement Of Account</p>
                    </div>
                  </div>
                )}
                {device === 'mobile' && (
                  <div className={classes.chipsDown}>
                    <Mui.Chip
                      label={
                        <Mui.Grid className={css.chipsSortName1}>
                          {selected === 1
                            ? 'Outstanding'
                            : 'Statement of Accounts'}
                        </Mui.Grid>
                      }
                      icon={<KeyboardArrowDown style={{ color: '#F08B32' }} />}
                      className={css.chipLabel2}
                      onClick={(event) =>
                        setAnchorElOutstand(event.currentTarget)
                      }
                      sx={{
                        '& .MuiChip-label': {
                          paddingLeft: 0,
                        },
                      }}
                    />
                    <Mui.Popover
                      id="basic-menu-sort"
                      anchorEl={anchorElDateOutstand}
                      open={Boolean(anchorElDateOutstand)}
                      PaperProps={{
                        sx: {
                          p: selected === 2 ? '5px 18px' : '5px 17px',
                          ml:
                            device === 'mobile' && selected === 2 ? '-6px' : '',
                        },
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      onClose={() => setAnchorElOutstand(null)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {['Outstanding', 'Statement of Accounts'].map(
                        (i, index) => (
                          <Mui.Typography
                            sx={{
                              padding: selected === 1 ? '5px ' : '5px',
                              fontSize: '10px',
                            }}
                            onClick={() => handleChange(index + 1)}
                          >
                            {i}
                          </Mui.Typography>
                        ),
                      )}
                    </Mui.Popover>
                  </div>
                )}
                {device === 'mobile' && selected === 1 && (
                  <div className={classes.chipsDown}>
                    <Mui.Chip
                      label={
                        <Mui.Grid className={css.chipsSortName1}>
                          As of{' '}
                          {moment(anchorElDate.value).format('DD MMM YYYY')}
                        </Mui.Grid>
                      }
                      icon={<KeyboardArrowDown style={{ color: '#F08B32' }} />}
                      className={css.chipLabel2}
                      onClick={(event) =>
                        setAnchorElDate({
                          value: anchorElDate.value,
                          opened: event.currentTarget,
                        })
                      }
                      sx={{
                        '& .MuiChip-label': {
                          paddingLeft: 0,
                        },
                      }}
                    />
                  </div>
                )}
                    <Mui.Stack
                      flexDirection="row"
                      justifyContent={
                        selected === 2 ? 'space-between' : 'flex-end'
                      }
                    >
                      {selected === 2 && device === 'mobile' && (
                        <Mui.Stack
                          flexDirection="row"
                          alignItems="center"
                          width={device === 'mobile' ? '100%' : 'auto'}
                          margin="15px 0px 20px"
                          gap="8px"
                        >
                          <div className={css.dateInput}>
                            <input
                              type="text"
                              value={
                                dateState.startDate === ''
                                  ? 'Start Date'
                                  : moment(dateState.startDate).format(
                                      'DD MMM YYYY',
                                    )
                              }
                              className={css.field}
                              onClick={() => {
                                setStmtFilter({ open: true, for: 'Start' });
                              }}
                              readOnly
                            />
                          <InsertInvitationIcon
                            onClick={() => setStmtFilter({ open: true, for: 'Start' })}
                            sx={{fontSize: 20}}
                          />
                          </div>

                          <div className={css.dateInput}>
                            <input
                              type="text"
                              value={
                                dateState.endDate === ''
                                  ? 'End Date'
                                  : moment(dateState.endDate).format(
                                      'DD MMM YYYY',
                                    )
                              }
                              className={css.field}
                              onClick={() => {
                                setStmtFilter({ open: true, for: 'End' });
                              }}
                              readOnly
                            />
                            <InsertInvitationIcon
                            onClick={() => setStmtFilter({ open: true, for: 'End' })}
                            sx={{fontSize: 20}}
                          />
                          </div>
                          <Mui.Button
                            variant={
                              device === 'mobile' ? 'outline' : 'contained'
                            }
                            style={{
                              backgroundColor:
                                device === 'mobile' ? '#FFF' : '#F08B32',
                              color: device === 'mobile' ? '#F08B32' : '#FFF',
                              // margin: '0 15px',
                              width: 'auto',
                              borderRadius: '25px',
                              padding: '0 20px',
                              height: '35px',
                              border: '1px solid #F08B32',
                            }}
                            disableElevation
                            disableTouchRipple
                            disableFocusRipple
                            disabled={
                              dateState.startDate === '' ||
                              dateState.endDate === ''
                            }
                            onClick={() => {
                              statement();
                            }}
                          >
                            Apply
                          </Mui.Button>
                        </Mui.Stack>
                      )}
                      {device === 'desktop' && selected === 1 && (
                        <div className={classes.chipsDown}>
                          <Mui.Chip
                            label={
                              <Mui.Grid className={css.chipsSortName}>
                                As of{' '}
                                {moment(anchorElDate.value).format(
                                  'DD MMM YYYY',
                                )}
                              </Mui.Grid>
                            }
                            icon={<KeyboardArrowDown />}
                            className={css.chipLabel2}
                            sx={{ height: '36px' }}
                            onClick={(event) =>
                              setAnchorElDate({
                                value: anchorElDate.value,
                                opened: event.currentTarget,
                              })
                            }
                          />
                        </div>
                      )}
                      {device === 'desktop' && (
                        <div
                          className={classes.chipsUp}
                          style={{ borderRadius: '4px' }}
                        >
                          <Mui.Chip
                            label={
                              <Mui.Grid className={css.chipsSortName3}>
                                {selected === 1 ? 'Download Outstanding':'Download Statements'}
                              </Mui.Grid>
                            }
                            onClick={() => {
                              downloadFunction();
                            }}
                            icon={
                              <DownloadIcon sx={{ color: '#FFF !important' }} />
                            }
                            className={css.chipLabel3}
                          />
                        </div>
                      )}
                      {device === 'desktop' && selected === 1 && (
                        <div className={classes.chipsUp}>
                          <Mui.Chip
                            label={
                              <Mui.Grid className={css.chipsSortName4}>
                                Follow-Up via Email
                              </Mui.Grid>
                            }
                            icon={
                              <MailOutlineIcon
                                sx={{ color: '#F08B32 !important' }}
                              />
                            }
                            className={css.chipLabel4}
                            onClick={() => {
                              // navigate('/receivables-schedule')
                              setRequestPayment(true);
                            }}
                          />
                        </div>
                      )}
                    </Mui.Stack>
              </div>
            )}
            {selected === 2 && device === 'desktop' && (
              <div className={css.newDateStmt}>
                <div className={css.dateInputDes}>
                  <input
                    type="text"
                    value={
                      dateState.startDate === ''
                        ? 'Start Date'
                        : moment(dateState.startDate).format('DD MMM YYYY')
                    }
                    className={css.field}
                    readOnly
                    onClick={(e) => {
                      e.stopPropagation();
                      const parentBtn =
                        document.querySelector('.billStartDate');
                      const childBtn = parentBtn.querySelector(
                        '.MuiButtonBase-root',
                      );
                      childBtn.click();
                    }}
                    // role="presentation"
                  />
                  <OnlyDatePicker
                    // className={css.billsStartDate}
                    classNameV="billStartDate"
                    selectedDate={dateState.startDate || new Date()}
                    // label={new Date(invoiceDate).toLocaleDateString()}
                    onChange={(e) =>
                      setDateState({
                        endDate: dateState.endDate,
                        startDate: new Date(e),
                      })
                    }
                  />
                </div>

                <div className={css.dateInputDes}>
                  <input
                    type="text"
                    value={
                      dateState.endDate === ''
                        ? 'End Date'
                        : moment(dateState.endDate).format('DD MMM YYYY')
                    }
                    className={css.field}
                    readOnly
                    onClick={(e) => {
                      e.stopPropagation();
                      const parentBtn = document.querySelector('.billEndDate');
                      const childBtn = parentBtn.querySelector(
                        '.MuiButtonBase-root',
                      );
                      childBtn.click();
                    }}
                  />
                  <OnlyDatePicker
                    // className={css.avatarForDate}
                    classNameV="billEndDate"
                    selectedDate={dateState.endDate || new Date()}
                    // label={new Date(invoiceDate).toLocaleDateString()}
                    onChange={(e) =>
                      setDateState({
                        endDate: new Date(e),
                        startDate: dateState.startDate,
                      })
                    }
                  />
                </div>
                <Mui.Button
                  variant="contained"
                  className={css.applyButton}
                  disableElevation
                  disableTouchRipple
                  disableFocusRipple
                  disabled={
                    dateState.startDate === '' || dateState.endDate === ''
                  }
                  onClick={() => {
                    statement();
                  }}
                >
                  Apply Now
                </Mui.Button>
              </div>
            )}
            <div
              className={
                device === 'mobile'
                  ? css.selectedMenuPage
                  : css.selectedMenuPage2
              }
            >
              {menuSelected === 'openbills' && (
                <OpenBills
                  id={customerId}
                  statement={selected === 1}
                  stmtData={actState}
                  date={anchorElDate?.value}
                  wise={state?.wise}
                  setStartDate={async () => {
                    const changeDate = dateState?.startDate;
                    changeDate.setMonth(changeDate.getMonth() - 1);
                    await setDateState((prev) => ({
                      ...prev,
                      startDate: changeDate,
                    }));
                    await setDateStateAuto({ startDate: true, endDate: false });
                  }}
                  setEndDate={async () => {
                    await setDateState((prev) => ({ ...prev, startDate }));
                    await setDateStateAuto({ startDate: true, endDate: false });
                  }}
                  custName={data?.name || '-'}
                  tabState={state?.tabState}
                  opening={actStateBalance?.opening_balance}
                  closing={actStateBalance?.closing_balance}
                />
              )}
              {menuSelected === 'relationship' && (
                <RelationShip id={customerId} />
              )}
              {menuSelected === 'Analytics' && (
                <Reports id={customerId} date={anchorElDate?.value} />
              )}
              {menuSelected === 'Agreements' && (
                <Agreement
                  id={customerId}
                  customerAgreement={customerAgreement}
                  RecurringAccess={(type) => RecurringCheck(type)}
                />
              )}
            </div>
          </div>
          {device === 'desktop' && (
            <PopperComp
              openProps={open}
              anchorElProps={anchorEl}
              onClose={() => {
                setAnchorEl(null);
              }}
              popperStyle={{
                maxHeight: '40vh',
                width: '22.5vw',
                background: '#fff',
                borderRadius: '8px',
                marginTop: '10px',
                boxShadow: '0px 4px 10px #00000014',
              }}
            >
              <div>
                <Mui.Stack
                  flexDirection="row"
                  alignItems="center"
                  sx={{
                    bgcolor: '#F5F5F5',
                    padding: '10px 20px',
                    borderRadius: '8px 8px 0 0',
                  }}
                >
                  <SearchIcon />
                  <input
                    className={css.textField}
                    placeholder="Search for a Customer..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                    autoFocus
                  />
                </Mui.Stack>
                <div style={{ height: '28vh', overflow: 'auto' }}>
                  <Mui.FormControl sx={{ width: '100%' }}>
                    <Mui.RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="radio-buttons-group"
                      value={
                        customerList?.find((val) => val?.id === customerId)
                          ?.name
                      }
                    >
                      {filteredCustList?.length > 0 &&
                        filteredCustList?.map((val) => (
                          <>
                            <Mui.FormControlLabel
                              value={val.name}
                              sx={{
                                padding: '5px 20px',
                                borderBottom: '1px solid #999ea563',
                              }}
                              onClick={() => {
                                setCustomerId(val?.id);
                                setAnchorEl(false);
                                // setSearchQuery('');
                              }}
                              control={
                                <Mui.Radio
                                  sx={{
                                    color: '#D9D9D9',
                                    '&.Mui-checked': {
                                      color: '#F08B32',
                                    },
                                  }}
                                />
                              }
                              label={
                                <>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: '14px',
                                      fontWeight: 400,
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      width: '18vw',
                                    }}
                                  >
                                    {val.name}
                                  </p>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: '13px',
                                      fontWeight: 300,
                                    }}
                                  >
                                    Balance: {FormattedAmount(val.net_balance)}
                                  </p>
                                </>
                              }
                            />
                          </>
                        ))}
                      {filteredCustList?.length === 0 && (
                        <Mui.Typography align="center">
                          {/* {loading ? 'Data is being fetched' : 'No Data Found'} */}
                          No Data Found
                        </Mui.Typography>
                      )}
                    </Mui.RadioGroup>
                  </Mui.FormControl>
                </div>
              </div>
            </PopperComp>
          )}
          {device === 'mobile' && (
            <SelectBottomSheet
              open={open}
              onClose={() => {
                // setSearchQuery('');
                setAnchorEl(false);
              }}
              triggerComponent={<div style={{ display: 'none' }} />}
              addNewSheet
            >
              <div style={{ padding: '15px 20px' }}>
                <Mui.Stack
                  flexDirection="row"
                  alignItems="center"
                  sx={{ bgcolor: '#F5F5F5', padding: '14px 20px' }}
                >
                  <SearchIcon />
                  <input
                    className={css.textField}
                    placeholder="Search for a Customer..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                  />
                </Mui.Stack>
                <div style={{ height: '33ch', overflow: 'auto' }}>
                  <Mui.FormControl >
                    <Mui.RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="radio-buttons-group"
                      value={
                        customerList?.find((val) => val?.id === customerId)
                          ?.name
                      }
                    >
                      {filteredCustList?.length > 0 &&
                        filteredCustList?.map((val) => (
                          <>
                            <Mui.FormControlLabel
                              value={val.name}
                              sx={{ padding: '5px 20px' }}
                              onClick={() => {
                                setCustomerId(val?.id);
                                setAnchorEl(false);
                                // setSearchQuery('');
                              }}
                              control={
                                <Mui.Radio
                                  sx={{
                                    color: '#D9D9D9',
                                    '&.Mui-checked': {
                                      color: '#F08B32',
                                    },
                                  }}
                                />
                              }
                              label={
                                <>
                                  <p style={{ margin: 0 }}>{val.name}</p>
                                  <p style={{ margin: 0, fontSize: '12px' }}>
                                    Balance: {FormattedAmount(val.net_balance)}
                                  </p>
                                </>
                              }
                            />
                            <hr
                              style={{
                                width: '100%',
                                border: '.1px solid #999ea5cc',
                              }}
                            />
                          </>
                        ))}
                      {filteredCustList?.length === 0 && (
                        <Mui.Typography align="center">
                          {/* {loading ? 'Data is being fetched' : 'No Data Found'} */}
                          No Data Found
                        </Mui.Typography>
                      )}
                    </Mui.RadioGroup>
                  </Mui.FormControl>
                </div>
              </div>
            </SelectBottomSheet>
          )}

<SelectBottomSheet
              open={stmtFilter?.open}
              onClose={() => {
                setStmtFilter({});
              }}
              triggerComponent={<></>}
              addNewSheet
          >
            <Calender
              head={`Select ${stmtFilter?.for || ''} Date`}
              button="Select"
              handleDate={(e) => {
                if (stmtFilter?.for === 'Start') {
                  setDateState({
                    endDate: dateState.endDate,
                    startDate: new Date(e),
                  });
                } else {
                  setDateState({
                    endDate: new Date(e),
                    startDate: dateState.startDate,
                  });
                }
                setStmtFilter({});
              }}
            />
            </SelectBottomSheet>

          <Mui.Dialog
            open={requestPayment}
            onClose={() => setRequestPayment(false)}
          >
            <RequestPayment
              customer_id={customerId}
              setRequestPayment={setRequestPayment}
            />
          </Mui.Dialog>
          <PopperComp
            openProps={Boolean(anchorElDate.opened)}
            anchorElProps={anchorElDate.opened}
            onClose={() => {
              setAnchorElDate((prev) => ({ ...prev, opened: null }));
            }}
            popperStyle={{
              width: device === 'mobile' ? '40vw' : '180px',
              border: '0.5px solid #C7C7C7',
              boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              marginTop: '10px'
            }}
          >
            <div>
              {[-1, 0, 1, 2, 3, 4].map((i) => (
                <div className={css.DivTagPopover}
                onClick={() =>
                  setAnchorElDate({
                    value:
                      i === -1
                        ? new Date()
                        : new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() - i,
                            0,
                          ),
                    opened: null,
                  })
                }
                >
                <p className={css.PTagPopover}>
                  {i === -1
                    ? moment().format('DD MMM YYYY')
                    : moment(
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() - i,
                          0,
                        ),
                      ).format('DD MMM YYYY')}
                  </p></div>
              ))}
            </div>
          </PopperComp>
        </div>
      </div>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default SelectedAging;
