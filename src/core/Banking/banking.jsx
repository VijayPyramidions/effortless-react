/* eslint-disable no-unused-vars */

import * as React from 'react';
import * as Mui from '@mui/material';
import * as MuiIcon from '@mui/icons-material';
import JSBridge from '@nativeBridge/jsbridge';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';
import Paper from '@mui/material/Paper';
import DataGrid from '@components/DataGrid/CustomDataGrid';
import moment from 'moment';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import Calender from '@core/InvoiceView/Calander';
import Radio from '@material-ui/core/Radio';
import { OnlyDatePicker } from '@components/DatePicker/DatePicker.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import EffortlessBanking from '@assets/EffortlessBanking.svg';
import FinancialInstitution from '@assets/Financial Institution.svg';
import Xlogo from '@assets/xlogo.svg';
import Rupee from '@assets/rupee.svg';
import IciciIcon from '@assets/icici_Icon.svg';
import AppContext from '@root/AppContext.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { styled } from '@material-ui/core';
import RestApi, { METHOD, BASE_URL } from '@services/RestApi.jsx';
import * as Router from 'react-router-dom';
import success from '@assets/success.png';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TransactionPassword from '@core/PaymentView/TransactionVerify/TransactionPassword';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import Input from '@components/Input/Input.jsx';
// import CategorizationBnk from '@assets/CategorizationBnk.png';
import DownloadBnk from '@assets/Download-Bnk.png';
// import filterBanking from '@assets/filterBanking.svg';
// import sortBanking from '@assets/sortBanking.svg';
import OtpInput from 'react-otp-input';
import IppopayComponent from './Ippopay';
import EditIndividualAccount from './Components/EditIndividualAccount';
import LoadWithDraw from '../../components/LoadAndWithdraw/LoadWithDrawSheet';
// import CategorizeTransactions from './AccountBalance/CategorizeTransactions';
import * as css from './banking.scss';
import { ConnectBanking } from './ConnectBanking/ConnectBanking';
import { CreateFreeBankAccount } from './CreateFreeBankAccount';
import * as css2 from './AccountBalance/AccountBalance.scss';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  boxSizing: 'border-box',
}));

const Banking = () => {
  const {
    organization,
    user,
    enableLoading,
    setAmt,
    changeSubView,
    openSnackBar,
    registerEventListeners,
    deRegisterEventListener,
    connect,
    loading,
    currentUserInfo,
  } = React.useContext(AppContext);
  const [balance, setBalance] = React.useState();
  const [paymentCounts, setPaymentCounts] = React.useState();
  const [freeAccount, setFreeAccount] = React.useState([]);
  const [virtualAccountDetails, setVirtualAccountDetails] = React.useState([]);
  const [payUDatas, setPayUData] = React.useState();
  const [payUSha, setPayUSha] = React.useState();
  const navigate = Router.useNavigate();
  const [authenticate, setAuthenticate] = React.useState();
  const [activeTab, setActiveTab] = React.useState(0);

  const [founderAcc, setFounderAcc] = React.useState([]);
  const [bizAcc, setBizAcc] = React.useState([]);
  const [tableData, setTableData] = React.useState([]);
  const [records, setrecords] = React.useState(1);
  const [dataten, setdataten] = React.useState([]);
  const [hasMoreItems, sethasMoreItems] = React.useState(true);
  const [infinitData, setinfinitData] = React.useState('');
  const [toggleModal, setToggleModal] = React.useState(false);
  const [acc, setAcc] = React.useState({ company: 0, founder: 0 });
  const [accountDetails, setAccountDetails] = React.useState();
  const [bankListingDetails, setBankListingDetails] = React.useState();
  const [fastLinkConfig, setFastlinkConfig] = React.useState();
  const [fastLinkConfigLocal, setFastlinkConfigLocal] = React.useState();
  const [bankAccountType, setBankAccountType] = React.useState();
  const [congratsDrawer, setCongratsDrawer] = React.useState(false);
  const [closeInfoModal, setCloseInfoModal] = React.useState();
  const [offsetHeightContainer, setOffSetHeight] = React.useState(
    document?.getElementById('connectedBankingMobile')?.offsetHeight,
  );
  const [connectBankRef, setConnectBankRef] = React.useState();
  const [paymentResponse, setPaymentResponse] = React.useState();
  const [ippoPayModal, setIppopayModal] = React.useState(false);
  // const [group, setGroup] = React.useState(false);

  React.useEffect(() => {
    if (records === 1) {
      setdataten(virtualAccountDetails);
    }
  }, [virtualAccountDetails]);

  React.useMemo(() => {
    setOffSetHeight(connectBankRef?.current?.clientHeight);
  }, [connectBankRef]);

  React.useMemo(() => {
    if (paymentResponse?.collection_service_provider === 'ippopay') {
      setIppopayModal(true);
    } else {
      setIppopayModal(false);
    }
  }, [paymentResponse]);

  const fetchBankDetails2 = () => {
    // const val = state?.value === undefined ? amt : state?.value;

    enableLoading(true);
    // `organizations/${organization.orgId}/yodlee_bank_accounts/a683ac3b-5243-4bfd-84b8-d213c5e85ea7/txns?page=${records}`
    RestApi(
      `organizations/${organization?.orgId}/effortless_virtual_accounts/txns?page=${records}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          // setinfinitDataLoad(res.data.map((c) => c));
          // setinfinitData(res);
          // showItems();
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
      fetchBankDetails2();
    }
  }, [records]);

  const activeTabHandler = (tab) => {
    return () => {
      if (tab === 0) {
        setTableData(founderAcc);
        setActiveTab(tab);
        return;
      }
      if (tab === 1) {
        setTableData(bizAcc);
        setActiveTab(tab);
        return;
      }
      if (tab === 2) {
        // setTableData(BILL_DATA_BUSINESS_BANK);
        setActiveTab(tab);
      }
    };
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event, val) => {
    setAnchorEl(event.currentTarget);
    console.log(event.currentTarget, val);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    setToggleModal(false);
    setFastlinkConfig(undefined);
    setFastlinkConfigLocal(undefined);
    setBankAccountType(undefined);
  };

  const [popover, setPopover] = React.useState({
    loadMoney: false,
    withdrawMoney: false,
    loadMoneyVerify: false,
    withdrawMoneyverify: false,
    loadMoneySuccess: false,
    withdrawMoneySuccess: false,
    disableAccount: false,
    editAccount: false,
  });
  const [money, setMoney] = React.useState({
    loadMoney: 0,
    withdrawMoney: 0,
  });
  const [otp, setOtp] = React.useState({
    loadMoney: '',
    withdrawMoney: '',
  });

  const [bankingRes, setBankingRes] = React.useState(true);
  const [bankDetail, setBankDetail] = React.useState({
    data: [],
    open: false,
    id: '',
  });
  const [editState, setEditState] = React.useState({
    name: '',
    // bank_swift_code: '',
    bank_account_number: '',
    bank_account_name: '',
    bank_ifsc_code: '',
    bank_branch: '',
    // default: true,
    id: '',
  });
  const [downloadStatement, setDownloadStatement] = React.useState(false);
  const [downloadPeriod, setdownloadPeriod] = React.useState('');
  const [customDate, setcustomDate] = React.useState('');
  const [drawer, setDrawer] = React.useState({
    date: false,
    vendor: false,
    startDate: false,
    endDate: false,
  });
  const [fileFormatErr, setFileFormatErr] = React.useState(false);
  const [datePeriodErr, setDatePeriodErr] = React.useState(false);
  const [fileFormat, setFileFormat] = React.useState('');
  const [downloadStatementformat, setDownloadStatementformat] =
    React.useState(false);
  const [payUlink, setPayUlink] = React.useState(
    'https://secure.payu.in/_payment',
  );
  const [payUSalt, setPayUSalt] = React.useState(
    '1m95eGJLk8MgVsrw817fxCkz3YC9JCwu',
  );

  const setUserAuthenticationData = (response) => {
    setAuthenticate(JSON.parse(response.detail.value)?.status);
  };

  React.useEffect(() => {
    registerEventListeners({
      name: 'userAuthorize',
      method: setUserAuthenticationData,
    });
    return () =>
      deRegisterEventListener({
        name: 'userAuthorize',
        method: setUserAuthenticationData,
      });
  }, []);
  // FileUpload();

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
  const onTriggerDrawer = (name) => {
    setDrawer((d) => ({ ...d, [name]: true }));
  };

  const DownloadStatement = () => {
    const dateFilter = downloadPeriod
      ? `?date=${downloadPeriod}`
      : `?start_date=${customDate?.start}&end_date=${customDate.end}`;
    const efforrtless = `effortless_virtual_accounts`;
    enableLoading(true);
    fetch(
      `${BASE_URL}/organizations/${organization.orgId}/${efforrtless}/downloads${fileFormat}${dateFilter}`,
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

  const fetchBankDetails = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization?.orgId}/yodlee_bank_accounts/bank_listing`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          if (res.message) {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.WARNING,
            });
          } else {
            const arr = [0];
            const founderArr = [];
            const bizArr = [];
            const val = res.data.map((e) => {
              if (e.bank_account_type === 'founder') {
                const op = +arr[0] + +e.available_balance;
                arr[0] = op;
                setAcc({ founder: arr[0], company: acc.company });
                founderArr.push({
                  id: e.id,
                  account_type: e.account_type,
                  bank_amount: e.available_balance,
                  uncategorised_transaction: e.uncategorized_count,
                  fetch_status: e.account_status,
                  account_details: {
                    name: e.account_name,
                    number: e.bank_account_number,
                    updated: e.last_synced_at,
                  },
                  type: e.bank_account_type,
                });
              } else if (e.bank_account_type === 'company') {
                const op = +arr[0] + +e.available_balance;
                arr[0] = op;
                setAcc({ company: arr[0], founder: acc.company });
                bizArr.push({
                  id: e.id,
                  account_type: e.account_type,
                  bank_amount: e.available_balance,
                  uncategorised_transaction: e.uncategorized_count,
                  fetch_status: e.account_status,
                  account_details: {
                    name: e.account_name,
                    number: e.bank_account_number,
                    updated: e.last_synced_at,
                  },
                  type: e.bank_account_type,
                });
              }
              return val;
            });
            if (activeTab === 1) {
              setTableData(bizArr);
            } else {
              setTableData(founderArr);
            }
            setFounderAcc(founderArr);
            setBizAcc(bizArr);
            setBankListingDetails(res.data);
          }
        }
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.INFO,
        });
      });
  };

  const fetchEffortlessTxns = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization?.orgId}/effortless_virtual_accounts/txns`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (!res?.error) {
          if (res.message) {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.WARNING,
            });
          } else {
            setinfinitData(res);
            setVirtualAccountDetails(res?.data?.map((c) => c));
          }
        }
        enableLoading(false);
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.INFO,
        });
      });
  };

  const effortlessBalance = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/effortless_virtual_accounts`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          if (res.message === 'Effortless Virtual Account not created yet') {
            setFreeAccount([]);
          } else {
            setFreeAccount(res);
            fetchEffortlessTxns();
          }
          enableLoading(false);
        } else {
          enableLoading(false);
        }
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.WARNING,
        });
      });
  };

  const GetIndividualAccountDetails = () => {
    const bankAccountId = bankListingDetails?.find(
      (e) => e.id === accountDetails.id,
    );
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/bank_accounts/${bankAccountId.bank_account_id}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          enableLoading(false);
          if (res.message === 'Bank Account not found') {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.WARNING,
            });
            setPopover({ ...popover, editAccount: false });
          } else {
            // console.log(res);
            setEditState({
              name: res?.name,
              // bank_swift_code: res?.bank_swift_code,
              bank_account_number: res?.bank_account_number,
              bank_account_name: res?.bank_account_name,
              bank_ifsc_code: res?.bank_ifsc_code,
              bank_branch: res?.bank_branch,
              // default: res?.default,
              id: res?.id,
            });
          }
        }
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.WARNING,
        });
      });
  };

  const DisableBankSync = () => {
    const bankAccountId = bankListingDetails?.find(
      (e) => e.id === accountDetails.id,
    );
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/yodlee_bank_accounts/${bankAccountId.id}/disable_bank_sync`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          enableLoading(false);
          if (res.id && res.account_status === 'paused') {
            openSnackBar({
              message: 'Sync disabled',
              type: MESSAGE_TYPE.INFO,
            });
          }
          if (res.message === 'Bank Account not found') {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.WARNING,
            });
            // setPopover({ ...popover, editAccount: false });
          }
          fetchBankDetails();
        } else if (res.error) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.WARNING,
          });
        }
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.WARNING,
        });
      });
  };

  const DeactivateBankAccount = () => {
    const bankAccountId = bankListingDetails?.find(
      (e) => e.id === accountDetails.id,
    );
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/yodlee_bank_accounts/${bankAccountId.id}`,
      {
        method: METHOD.DELETE,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          enableLoading(false);
          if (res.id && res.deactivate) {
            openSnackBar({
              message: 'Account Deactivated',
              type: MESSAGE_TYPE.INFO,
            });
            fetchBankDetails();
          }
          if (res.message === 'Bank Account not found') {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.WARNING,
            });
            // setPopover({ ...popover, editAccount: false });
          } else if (res.error) {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.WARNING,
            });
          }
        }
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.WARNING,
        });
      });
  };

  React.useEffect(() => {
    if (popover.editAccount) {
      GetIndividualAccountDetails();
    }
  }, [popover.editAccount]);

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
      },
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
              ? bankListingDetails?.find((e) => e.id === accountDetails.id)?.id
              : undefined,
        },
      },
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
              iframeScrolling: 'yes',
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
            'Fastlink-container',
          );
          // } else {
          JSBridge.connectYodlee(res, accountType);
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

  React.useEffect(() => {
    effortlessBalance();
    const live =
      window.location.origin === 'https://app.goeffortless.co' ||
      window.location.origin === 'https://i.goeffortless.ai' ||
      window.location.origin === 'https://d11997a5ngzp0a.cloudfront.net';
    if (live) {
      setPayUlink('https://secure.payu.in/_payment');
      setPayUSalt('1m95eGJLk8MgVsrw817fxCkz3YC9JCwu');
    } else {
      setPayUlink('https://test.payu.in/_payment');
      setPayUSalt('4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW');
    }
  }, []);

  const BalanceApi = () => {
    // enableLoading(true);
    RestApi(`organizations/${organization.orgId}/bank_accounts/summary`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (
        res.message === 'No bank account is connected' ||
        res.message === 'Effortless Virtual Account is not found' ||
        res.message === 'Effortless Virtual Account not created yet'
      ) {
        // openSnackBar({
        //   message: res.message,
        //   type: MESSAGE_TYPE.INFO,
        // });
        // console.log('noBankAccFound', res);
        // setBalance([]);
      } else {
        setBalance(res);
      }
      enableLoading(false);
    });
  };

  const PaymentCountsApi = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/bank_uncategorized/summary`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    }).then((res) => {
      if (res && !res.error) {
        setPaymentCounts(res);
      }

      enableLoading(false);
    });
  };
  const FetchConnectedBank = () => {
    RestApi(
      `organizations/${organization?.orgId}/bank_accounts/connected_bankings`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          setBankDetail((prev) => ({ ...prev, data: res?.data }));
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
    BalanceApi();
    fetchBankDetails();
    PaymentCountsApi();
    FetchConnectedBank();
  }, []);

  const device = localStorage.getItem('device_detect');
  const loadMoneyArray = [0, 1000, 10000, 100000];
  const setMoneyFun = (event, value) => {
    setMoney({
      ...money,
      [value]: event.target.value,
    });
  };

  function sha512(str) {
    return window.crypto.subtle
      .digest('SHA-512', new TextEncoder('utf-8').encode(str))
      .then((buf) => {
        return Array.prototype.map
          .call(new Uint8Array(buf), (x) => `00${x?.toString(16)}`.slice(-2))
          .join('');
      });
  }

  const fetchBankDetailsStatus = (id, type, accDetails) => {
    enableLoading(true);
    RestApi(`organizations/${organization?.orgId}/yodlee_bank_accounts/${id}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user?.activeToken}`,
      },
    })
      .then((res) => {
        if (res && res.account_status === 'fetching') {
          enableLoading(
            true,
            "Please Wait! - Effortless is pulling the bank transaction data, this first-time sync will take 2 to 5 minutes, so don't close the app...",
          );
          setTimeout(() => {
            // enableLoading(true);
            fetchBankDetailsStatus(res.id);
          }, 3000);
        } else if (
          res &&
          (res.account_status === 'active' || res.account_status === 'paused')
        ) {
          enableLoading(false);
          setAmt({
            accName: res.bank_name,
            amt: res.available_balance,
            id: res.id,
            accNum: res.bank_account_number,
            bankListingDetails,
            accountDetails: accDetails,
          });
          if (type === 'company') {
            navigate('/banking-banklist-account', {
              state: {
                value: {
                  accName: res.bank_name,
                  amt: res.available_balance,
                  id: res.id,
                  accNum: res.bank_account_number,
                  bankListingDetails,
                  accountDetails: accDetails,
                },
                key: 'accountBalanceFromBuisness',
              },
            });
          } else if (type === 'founder') {
            navigate('/banking-founders-account', {
              state: {
                value: {
                  accName: res.bank_name,
                  amt: res.available_balance,
                  id: res.id,
                  accNum: res.bank_account_number,
                  bankListingDetails,
                  accountDetails: accDetails,
                },
                key: 'accountBalanceFromFounder',
              },
            });
          } else {
            navigate('/banking-banklist-account', {
              state: {
                value: {
                  accName: res.bank_name,
                  amt: res.available_balance,
                  id: res.id,
                  accNum: res.bank_account_number,
                  bankListingDetails,
                  accountDetails: accDetails,
                },
                key: 'accountBalance',
              },
            });
          }
          enableLoading(false);
        } else if (res && res.account_status === 'disabled') {
          enableLoading(false);
          openSnackBar({
            message: 'Account is Disabled',
            type: MESSAGE_TYPE.WARNING,
          });
        }
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.INFO,
        });
      });
  };

  const cellHandler = (val) => {
    setAccountDetails(val);
    let bankAccountId;
    if (accountDetails?.id) {
      bankAccountId = bankListingDetails?.find(
        (e) => e.id === accountDetails.id,
      );
    }
    const bankType = val?.type || bankAccountId.bank_account_type;
    const bankId = val?.id || bankAccountId.id;
    if (bankType === 'company') {
      fetchBankDetailsStatus(bankId, 'company', val);
      return;
    }
    if (bankType === 'founder') {
      fetchBankDetailsStatus(bankId, 'founder', val);
    }
  };

  const moreHandler = (val) => {
    setAccountDetails(val);
  };

  const proceed = (val) => {
    // enableLoading(true);
    RestApi(
      `organizations/${organization?.orgId}/effortless_virtual_accounts/create_payment`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
        payload: {
          amount: val,
          bank_account_id: bankDetail?.id,
        },
      },
    )
      .then(async (res) => {
        if (res && !res.error) {
          if (res?.collection_service_provider === 'ippopay') {
            setPaymentResponse(res);
            return;
          }

          if (localStorage.getItem('device_detect') !== 'desktop') {
            const udf1 = `${window.location.origin}/banking`;
            const payUsha = await sha512(
              `${res.key}|${res.txn_id}|${res.amount}|${res.product_info}|${res.firstname}|${res.email}|${udf1}||||||||||${payUSalt}`,
            ).then((x) => x);

            if (authenticate)
              JSBridge.connectPayU(JSON.stringify(res, payUsha));
          } else {
            const udf1 = `${window.location.origin}/banking`;
            const payUsha = await sha512(
              `${res.key}|${res.txn_id}|${res.amount}|${res.product_info}|${res.firstname}|${res.email}|${udf1}||||||||||${payUSalt}`,
            ).then((x) => x);
            setPayUSha(payUsha);
            setPayUData(res);
            setTimeout(() => {
              document.getElementById('payUbtn').click();
              enableLoading(false);
            }, 2000);
          }
          // navigate('/ippopay', { state: { ...res } });
          // setPaymentResponse(res);
        } else if (res.error) {
          openSnackBar({
            message: res.error || res.message || 'Sorry, Something went wrong',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((e) => {
        console.log('PayU error', e);
        enableLoading(false);
      });
  };

  const url = new URL(window.location.href);
  const param = url.searchParams.get('order_id');

  React.useEffect(() => {
    if (param) {
      enableLoading(true);
      RestApi(
        `organizations/${organization.orgId}/inbound_transfers/${param}`,
        {
          method: METHOD.GET,
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
        },
      )
        .then((res) => {
          if (res && !res.error) {
            setBankingRes(res);
            setPopover({
              ...popover,
              loadMoneySuccess: true,
            });
            enableLoading(false);
          } else {
            enableLoading(false);
          }
        })
        .catch((e) => {
          openSnackBar({
            message: e.message,
            type: MESSAGE_TYPE.WARNING,
          });
        });
    }
  }, [param]);

  const columns = [
    {
      value: 'account_details',
      type: 'string',
      id: 1,
      title: (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>
            Account Details
          </Mui.Typography>
          {/* <img src={sortdraft} alt="sort" className={css.headingStackIcon} /> */}
        </div>
      ),
      displayVal: (v) => {
        return (
          <div
            className={css.accountDetailsContainer}
            style={{ justifyContent: 'start' }}
          >
            <Mui.Grid
              style={{
                border: '1px solid #A0A4AF',
                borderRadius: '50px',
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: '2px',
                color: 'blue',
              }}
            >
              <img
                src={FinancialInstitution}
                width="24px"
                alt="FinancialInstitutionIcon"
                style={
                  {
                    // filter: 'invert(.5) sepia(1) saturate(5) hue-rotate(210deg)',
                  }
                }
              />
            </Mui.Grid>
            <div className={css.accountDetails}>
              <p>{v.name}</p>
              <p>{v.number} </p>
              <p>
                Updated On:
                {v?.updated === ''
                  ? ' -'
                  : moment(v?.updated).format('DD-MM-YYYY')}{' '}
              </p>
            </div>
          </div>
        );
      },
      cellClick: (v) => cellHandler(v),
      align: 'center',
      hideSort: true,
      columnWidth: '250px',
      columnWidth2: '250px',
    },
    {
      value: 'fetch_status',
      type: 'string',
      id: 2,
      title: (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>
            Fetch Status
          </Mui.Typography>
          {/* <img src={sortdraft} alt="sort" className={css.headingStackIcon} /> */}
        </div>
      ),
      displayVal: (v) => {
        return (
          <div
            className={css.accountDetailsContainer}
            style={{ marginLeft: '5vw' }}
          >
            <div
              style={{
                border: '4px solid #FF9548',
                height: '1px',
                width: '0px',
                padding: '3px',
                borderRadius: '100px',
              }}
            />
            <div className={css.accountDetails}>
              {v === 'paused' && (
                <p
                  style={{
                    color: '#FF9548',
                    // textAlign: 'center',
                    textTransform: 'capitalize',
                  }}
                >
                  {v}{' '}
                </p>
              )}
              {v === 'fetching' && (
                <p
                  style={{
                    color: '#4062FF',
                    // textAlign: 'center',
                    textTransform: 'capitalize',
                  }}
                >
                  {v}{' '}
                </p>
              )}
              {v === 'active' && (
                <p
                  style={{
                    color: '#4062FF',
                    // textAlign: 'center',
                    textTransform: 'capitalize',
                  }}
                >
                  {v}{' '}
                </p>
              )}
              {v === 'disabled' && (
                <p
                  style={{
                    color: '#DE2F2F',
                    // textAlign: 'center',
                    textTransform: 'capitalize',
                  }}
                >
                  {v}{' '}
                </p>
              )}
              {v === 'invalid_credentials' && (
                <p
                  style={{
                    color: '#DE2F2F',
                    // textAlign: 'center',
                    textTransform: 'capitalize',
                  }}
                >
                  {v}{' '}
                </p>
              )}
            </div>
          </div>
        );
      },
      cellClick: (v) => cellHandler(v),
      hideSort: true,
      align: 'center',
    },
    {
      value: 'uncategorised_transaction',
      type: 'number',
      id: 3,
      title: (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>
            Uncategorised Transactions
          </Mui.Typography>
          {/* <img src={sortdraft} alt="sort" className={css.headingStackIcon} /> */}
        </div>
      ),
      displayVal: (v) => {
        return (
          <div className={css.accountDetailsContainer}>
            <div className={css.accountDetails}>
              <p style={{ color: '#DE2F2F', textAlign: 'center' }}>
                {v === null ? '-' : `${v} Transactions`}
              </p>
            </div>
          </div>
        );
      },
      cellClick: (v) => cellHandler(v),
      columnWidth: 120,
      hideSort: true,
      align: 'center',
    },
    {
      value: 'account_type',
      type: 'string',
      id: 4,
      title: (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>
            Account Type
          </Mui.Typography>
          {/* <img src={sortdraft} alt="sort" className={css.headingStackIcon} /> */}
        </div>
      ),
      displayVal: (v) => {
        return (
          <div className={css.accountDetailsContainer}>
            <div className={css.accountDetails}>
              <p style={{ textAlign: 'center' }}>{v}</p>
            </div>
          </div>
        );
      },
      // displayVal: (v) => `Rs. ${Number(v) 'en-IN')}`,
      cellClick: (v) => cellHandler(v),
      align: 'center',
      hideSort: true,
    },
    {
      value: 'bank_amount',
      type: 'number',
      id: 5,
      title: (
        <div className={css.headingStack}>
          <Mui.Typography className={css.headingStackText}>
            Amount in Bank
          </Mui.Typography>
          {/* <img src={sortdraft} alt="sort" className={css.headingStackIcon} /> */}
        </div>
      ),
      // displayVal: (v) => `Rs. ${Number(v) 'en-IN')}`,
      displayVal: (v) => {
        return (
          <div className={css.accountDetailsContainer}>
            <div className={css.accountDetails}>
              <p>{FormattedAmount(v)}</p>
            </div>
          </div>
        );
      },
      cellClick: (v) => cellHandler(v),
      align: 'center',
      hideSort: false,
    },
    {
      value: 'more',
      type: 'string',
      id: 5,
      title: '',
      displayVal: () => (
        <MoreVertIcon
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          style={{ fontSize: '18px' }}
        />
      ),
      cellClick: (v) => moreHandler(v),
      align: 'center',
      hideSort: true,
    },
  ];

  const Tabs = () => {
    return (
      <div className={css.tabsContainer}>
        <button
          type="button"
          onClick={activeTabHandler(0)}
          style={{ backgroundColor: activeTab === 0 ? 'white' : '' }}
        >
          Founder&#39;s Bank Account
        </button>
        <button
          type="button"
          onClick={activeTabHandler(1)}
          style={{ backgroundColor: activeTab === 1 ? 'white' : '' }}
        >
          Business&#39; Bank Account
        </button>
        <button
          type="button"
          onClick={activeTabHandler(2)}
          style={{ backgroundColor: activeTab === 2 ? 'white' : '' }}
        >
          Effortless Bank Account
        </button>
      </div>
    );
  };

  const TabMenuBar = () => {
    return (
      <>
        {activeTab !== 2 && (
          <div className={css.tabMenuBarContainer}>
            {activeTab === 1 && (
              <button
                type="button"
                className={css.exploreBtn}
                onClick={() => {
                  if (
                    !currentUserInfo?.transactionPasswordEnabled ||
                    (currentUserInfo?.transactionPasswordEnabled &&
                      +new Date(
                        currentUserInfo?.transactionPasswordExpireDate,
                      ) <= +new Date())
                  ) {
                    if (bankDetail?.data?.connected_banking.length === 0) {
                      navigate('/connect-banking', {
                        state: {
                          setCloseInfoModal,
                          setConnectBankRef,
                        },
                      });
                    } else {
                      setCongratsDrawer(true);
                    }
                  } else {
                    navigate('/connect-banking', {
                      state: {
                        setCloseInfoModal,
                      },
                    });
                  }
                }}
              >
                <img src={IciciIcon} alt="icici-icon" />
                Connect ICICI Bank Account
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (activeTab === 0) {
                  // connectBank('founder');
                  setBankAccountType('founder');
                  setFastlinkConfig('add_bank');
                  setFastlinkConfigLocal('add_bank');
                  return;
                }

                if (activeTab === 1) {
                  // connectBank('company');
                  setBankAccountType('company');
                  setFastlinkConfig('add_bank');
                  setFastlinkConfigLocal('add_bank');
                }
              }}
            >
              Connect a Bank Account
            </button>
          </div>
        )}

        {activeTab === 2 && (
          <>
            {freeAccount?.length === 0 ? (
              <Mui.Box
                sx={{
                  margin: '0 10px',
                  background: '#FFF',
                  borderRadius: '0 0 20px 20px',
                  padding: '0 30px 30px 30px',
                }}
              >
                <CreateFreeBankAccount changeSubView={changeSubView} />
              </Mui.Box>
            ) : (
              <div className={css.tabMenuBarContainer}>
                <Mui.Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ width: '100%' }}
                >
                  <Mui.Stack spacing={4} direction="row">
                    <button
                      type="button"
                      className={css.loadMoney}
                      onClick={() =>
                        // setPopover({ ...popover, loadMoney: true })
                        setBankDetail((prev) => ({
                          ...prev,
                          open: true,
                          type: 'load',
                        }))
                      }
                    >
                      <div>
                        <img src={Rupee} alt="rupee-icon" />
                        <p>&uarr;</p>
                      </div>
                      Load Money
                    </button>
                    <button
                      type="button"
                      className={css.withdrawMoney}
                      onClick={() =>
                        setPopover({ ...popover, withdrawMoney: true })
                      }
                    >
                      <div>
                        <img src={Rupee} alt="rupee-icon" />
                        <p>&darr;</p>
                      </div>
                      Withdraw Money
                    </button>
                  </Mui.Stack>
                  <Mui.Stack alignItems="center" justifyContent="center">
                    {device === 'desktop' && (
                      <Mui.Grid className={css.icons}>
                        <Mui.Grid
                          sx={{ cursor: 'pointer' }}
                          onClick={() => setDownloadStatement(true)}
                        >
                          <Mui.Tooltip title="Download" placement="bottom-end">
                            <img
                              src={DownloadBnk}
                              width="24px"
                              alt="bankIcon"
                            />
                          </Mui.Tooltip>
                        </Mui.Grid>
                        {/* <Mui.Grid
                          // onClick={() => navigate('/banking-categorize')}
                          sx={{ cursor: 'pointer' }}
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
                        <Mui.Grid
                          sx={{ cursor: 'pointer' }}
                          onClick={() => {
                            // setAnchorEl(event.currentTarget);
                          }}
                        >
                          <Mui.Tooltip title="Sort" placement="bottom-end">
                            <img
                              src={sortBanking}
                              width="24px"
                              alt="bankIcon"
                            />
                          </Mui.Tooltip>
                        </Mui.Grid> */}
                        {/* <Mui.Grid sx={{ cursor: 'pointer' }}>
                        <Mui.Tooltip
                    title="Filter"
                    placement="bottom-end"
                  >
                          <img
                            src={filterBanking}
                            width="24px"
                            alt="bankIcon"
                          />
                          </Mui.Tooltip>
                        </Mui.Grid> */}
                      </Mui.Grid>
                    )}
                  </Mui.Stack>
                </Mui.Stack>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return device === 'mobile' ? (
    <>
      <Mui.Grid
        container
        style={{ backgroundColor: '#EDEDED', position: 'relative' }}
      >
        <Mui.Grid
          item
          xs={12}
          style={{
            backgroundColor: '#EDEDED',
            marginTop: closeInfoModal
              ? `${offsetHeightContainer + 20}px`
              : 'unset',
          }}
        >
          {balance === undefined ? (
            <>
              {connect === false && (
                <Mui.Grid item xs={12} className={css.noBankAcc}>
                  <Mui.Grid className={css.head}>
                    <Mui.Typography>List of Banks</Mui.Typography>

                    <Mui.Divider className={css.divider} variant="fullWidth" />
                  </Mui.Grid>
                  <Mui.Stack style={{ textAlignLast: 'center' }}>
                    <Mui.Grid className={css.noBankContainer}>
                      <img
                        src={FinancialInstitution}
                        alt="financialInstitution"
                      />
                      <Mui.Typography className={css.notFound}>
                        No Bank Accounts found.
                      </Mui.Typography>
                    </Mui.Grid>
                    <Mui.Button
                      variant="outlined"
                      className={css.buttonNoAcc}
                      onClick={() => {
                        changeSubView('keytoConnect');
                        navigate('/banking-banklist', {
                          state: { connecting: 'keytoConnect' },
                        });
                      }}
                    >
                      Connect a Bank
                    </Mui.Button>
                  </Mui.Stack>
                </Mui.Grid>
              )}
              <ConnectBanking
                setCongratsDrawer={setCongratsDrawer}
                congratsDrawer={congratsDrawer}
                setCloseInfoModal={setCloseInfoModal}
                setConnectBankRef={setConnectBankRef}
              />
            </>
          ) : (
            <>
              {connect === false ? (
                <>
                  <Item className={css.amountPaper}>
                    <Mui.Stack direction="row" justifyContent="space-between">
                      <Mui.Stack
                        direction="column"
                        className={css.amountContainer}
                      >
                        <Mui.Typography className={css.typo2}>
                          {' '}
                          Balance Across All Accounts
                        </Mui.Typography>
                        <Mui.Typography className={css.typo3}>
                          Rs.
                          {balance
                            ? FormattedAmount(balance?.total_balance)
                            : 0}
                        </Mui.Typography>
                        <Mui.Typography className={css.typo4}>
                          Available Overdraft Limit
                        </Mui.Typography>
                        <Mui.Typography className={css.typo5}>
                          Rs.
                          {balance
                            ? FormattedAmount(balance?.total_overdraft_limit)
                            : 0}
                        </Mui.Typography>
                      </Mui.Stack>
                      <Mui.Button
                        className={css.viewMore}
                        style={{
                          width: ' 97px',
                          flex: 'none',
                          marginLeft: '-57%',
                          marginRight: '2%',
                        }}
                        onClick={() => {
                          // changeSubView('BankList');
                          navigate('/banking-banklist');
                        }}
                      >
                        View More
                      </Mui.Button>
                    </Mui.Stack>
                  </Item>

                  <Item className={css.amountPaper}>
                    <Mui.Grid style={{ margin: '3%' }}>
                      <Mui.Grid
                        direction="column"
                        className={css.amountContainer}
                      >
                        <Mui.Typography
                          className={css.typo2}
                          style={{ marginBottom: '18px' }}
                        >
                          {' '}
                          Categorize Transactions
                        </Mui.Typography>
                        <Mui.Grid
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Mui.Typography className={css.container2Typo1}>
                            {paymentCounts?.unsettled_payments_count} Unknown
                            Payments
                          </Mui.Typography>
                          <Mui.Typography className={css.container2Typo2}>
                            {FormattedAmount(
                              paymentCounts?.unsettled_payments_total,
                            )}
                          </Mui.Typography>
                        </Mui.Grid>
                        <Mui.Grid
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Mui.Typography className={css.container2Typo1}>
                            {paymentCounts?.unsettled_receipt_count} Unknown
                            Reciepts
                          </Mui.Typography>
                          <Mui.Typography className={css.container2Typo2}>
                            {FormattedAmount(
                              paymentCounts?.unsettled_receipts_total,
                            )}
                          </Mui.Typography>
                        </Mui.Grid>
                      </Mui.Grid>
                    </Mui.Grid>
                    <Mui.Button
                      className={css.viewMore}
                      style={{
                        width: '130px !important',
                        marginTop: '15px',
                        marginBottom: '18px',
                      }}
                      onClick={() => {
                        changeSubView('categorizeTransactions');
                        navigate('/bankingcategorizeddetails');
                      }}
                    >
                      categorize Now
                    </Mui.Button>
                  </Item>
                  <ConnectBanking
                    setCongratsDrawer={setCongratsDrawer}
                    congratsDrawer={congratsDrawer}
                    setCloseInfoModal={setCloseInfoModal}
                    setConnectBankRef={setConnectBankRef}
                  />
                </>
              ) : (
                <ConnectBanking
                  setCongratsDrawer={setCongratsDrawer}
                  congratsDrawer={congratsDrawer}
                  setCloseInfoModal={setCloseInfoModal}
                  setConnectBankRef={setConnectBankRef}
                />
              )}
            </>
          )}

          {/* <Item> */}
          {connect === false &&
            (freeAccount && freeAccount.length === 0 ? (
              <Mui.Grid item xs={12} style={{ margin: '10px 0' }}>
                <Mui.Card
                  className={css.amountPaper}
                  style={{
                    borderRadius: '18px 18px 0px 0px',
                    marginBottom: '10%',
                  }}
                >
                  <Mui.CardMedia component="img" image={EffortlessBanking} />
                  <Mui.CardContent>
                    <Mui.Grid
                      container
                      spacing={3}
                      className={css.amountContainer}
                    >
                      <Mui.Grid item xs={12}>
                        <Mui.Typography
                          variant="h6"
                          style={{
                            fontSize: '18px',
                            fontWeight: '400',
                            marginBottom: '10px',
                          }}
                        >
                          Choose Effortless banking
                        </Mui.Typography>
                      </Mui.Grid>

                      <Mui.Grid item xs={12}>
                        <Mui.Typography
                          variant="h5"
                          align="center"
                          style={{ fontSize: '15px', fontWeight: '300' }}
                        >
                          Effortless Banking is the Fastest Way to run your
                          business transactions. It is powered by your
                          Effortless Virtual Account.
                        </Mui.Typography>
                      </Mui.Grid>
                      <Mui.Grid item xs={12}>
                        <Mui.Typography
                          variant="h5"
                          align="left"
                          style={{ fontSize: '15px', fontWeight: '300' }}
                        >
                          Registration and Setup are{' '}
                          <span style={{ fontSize: '18px', fontWeight: '400' }}>
                            FREE
                          </span>
                          .
                        </Mui.Typography>
                      </Mui.Grid>
                      <Mui.Grid
                        item
                        xs={12}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Mui.Button
                          variant="outlined"
                          style={{
                            border: '1px solid #F08B32',
                            borderRadius: '20px',
                            color: '#F08B32',
                          }}
                          onClick={() => {
                            changeSubView('BankingForms', 'fromBottom');
                            // changeSubView('BankingForms');
                            navigate('/banking-virtualAccountOnBoarding');
                          }}
                        >
                          Create Free Account
                        </Mui.Button>
                      </Mui.Grid>
                    </Mui.Grid>
                  </Mui.CardContent>
                </Mui.Card>
              </Mui.Grid>
            ) : null)}
          {/* </Item> */}
        </Mui.Grid>
      </Mui.Grid>
      <SelectBottomSheet
        name="congratsDrawer"
        triggerComponent={<div style={{ display: 'none' }} />}
        open={congratsDrawer}
        addNewSheet
        maxHeight="45vh"
        hideClose
      >
        <TransactionPassword onClose={() => setCongratsDrawer(false)} />
      </SelectBottomSheet>
      {ippoPayModal && (
        <IppopayComponent
          orderId={paymentResponse?.order_id}
          publicKey={paymentResponse?.public_key}
          setIppopayModal={setIppopayModal}
        />
      )}
    </>
  ) : (
    <>
      <div style={{ display: 'none' }}>
        <form action={payUlink} method="post">
          <input type="hidden" name="key" value={payUDatas?.key} />
          <input type="hidden" name="txnid" value={payUDatas?.txn_id} />
          <input
            type="hidden"
            name="drop_category"
            value={payUDatas?.drop_category}
          />
          <input type="hidden" name="pg" value={payUDatas?.pg} />
          <input
            type="hidden"
            name="productinfo"
            value={payUDatas?.product_info}
          />
          <input type="hidden" name="amount" value={payUDatas?.amount} />
          <input type="hidden" name="email" value={payUDatas?.email} />
          <input type="hidden" name="firstname" value={payUDatas?.firstname} />
          {/* <!-- <input type="hidden" name="lastname" value="Kumar" /> --> */}
          <input type="hidden" name="surl" value={payUDatas?.surl} />
          {/* <input type="hidden" name="surl" value="https://pay.actionboard.xyz/payu_callback" /> */}
          <input type="hidden" name="furl" value={payUDatas?.furl} />
          {/* <input type="hidden" name="furl" value="https://pay.actionboard.xyz/payu_callback" /> */}
          <input
            type="hidden"
            name="udf1"
            value={`${window.location.origin}/banking`}
          />
          <input type="hidden" name="phone" value={payUDatas?.phone} />
          <input type="hidden" name="hash" value={payUSha} />
          <input type="submit" value="submit" id="payUbtn" />{' '}
        </form>
      </div>
      <Mui.Grid container spacing={1}>
        <Mui.Grid item xs={12} md={12}>
          <div className={css.tableContainer}>
            <Mui.Typography
              variant="h5"
              style={{
                padding: '0 5px',
              }}
            >
              Your Accounts
              <div>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      setPopover({ ...popover, editAccount: true });
                      handleClose();
                    }}
                  >
                    Edit Account Details
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      cellHandler();
                      handleClose();
                    }}
                  >
                    View Transactions
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      setFastlinkConfig('update_credentials');
                      setFastlinkConfigLocal('update_credentials');
                      setBankAccountType(
                        bankListingDetails?.find(
                          (e) => e.id === accountDetails.id,
                        )?.bank_account_type,
                      );
                      handleClose();
                    }}
                  >
                    Update Bank Credentials
                  </MenuItem>

                  {accountDetails?.fetch_status !== 'paused'
                    ? accountDetails?.fetch_status !== 'disabled' && (
                        <MenuItem
                          onClick={() => {
                            DisableBankSync();
                            handleClose();
                          }}
                        >
                          Disable Bank Sync
                        </MenuItem>
                      )
                    : accountDetails?.fetch_status !== 'disabled' && (
                        <MenuItem
                          onClick={() => {
                            setFastlinkConfig('refresh_bank');
                            setFastlinkConfigLocal('enable_sync');
                            setBankAccountType(
                              bankListingDetails?.find(
                                (e) => e.id === accountDetails.id,
                              )?.bank_account_type,
                            );
                            // EnableBankSync();
                            handleClose();
                          }}
                        >
                          Enable Bank Sync
                        </MenuItem>
                      )}

                  {accountDetails?.fetch_status !== 'disabled' ? (
                    <MenuItem
                      onClick={() => {
                        setPopover({ ...popover, disableAccount: true });
                        handleClose();
                      }}
                    >
                      Disable Account
                    </MenuItem>
                  ) : (
                    <MenuItem
                      onClick={() => {
                        setFastlinkConfig('refresh_bank');
                        setFastlinkConfigLocal('activate_bank');
                        handleClose();
                      }}
                    >
                      Enable Account
                    </MenuItem>
                  )}
                </Menu>
              </div>
            </Mui.Typography>
            {/* <button
              type="button"
              className={css.exploreBtn}
              onClick={() => {
                if (
                  !currentUserInfo?.transactionPasswordEnabled &&
                  +new Date(currentUserInfo?.transactionPasswordExpireDate) <=
                    +new Date()
                ) {
                  if (bankDetail?.data?.connected_banking.length === 0) {
                    navigate('/connect-banking');
                  } else {
                    setCongratsDrawer(true);
                  }
                } else {
                  navigate('/connect-banking');
                }
              }}
            >
              Explore ICICI Banking Services
            </button> */}
          </div>
          <Mui.Grid container spacing={2}>
            <Mui.Grid item xs={12}>
              <Tabs />
              <TabMenuBar />
              {activeTab !== 2 && (
                <div
                  style={{
                    margin: '3px 10px 0 10px',
                    background: '#FFF',
                    borderRadius: '0 0 20px 20px',
                  }}
                >
                  <DataGrid
                    bodyData={tableData}
                    headData={columns}
                    tableStyle={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '25rem',

                      // background: '#0254',
                      borderRadius: '20px',
                      '&::-webkit-scrollbar': { width: '0px' },
                    }}
                  />
                </div>
              )}
              <>
                {activeTab === 2 && (
                  <>
                    {freeAccount?.length === 0 ? (
                      ''
                    ) : (
                      <div
                        style={{
                          margin: '0 10px',
                          background: '#FFF',
                          borderRadius: '0 0 20px 20px',
                          padding: '0 30px 30px 30px',
                        }}
                      >
                        <Mui.Grid className={css.bankContainerAccBalDesktop}>
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
                                {freeAccount?.bank_account_name}
                              </Mui.Typography>
                              <Mui.Typography style={{ fontSize: '11px' }}>
                                {freeAccount?.bank_account_number}
                              </Mui.Typography>
                            </Mui.Grid>
                            <Mui.Typography style={{ fontSize: '17px' }}>
                              {FormattedAmount(freeAccount?.current_balanc)}
                            </Mui.Typography>
                          </Mui.Stack>
                        </Mui.Grid>

                        <Mui.Grid
                          style={{ marginTop: device === 'mobile' && '4%' }}
                        >
                          {loading && (
                            <Mui.Grid className={css.textAlign}>
                              Gathering your Banking Data. Please Wait.
                            </Mui.Grid>
                          )}
                          {!loading && dataten?.length === 0 && (
                            <Mui.Grid className={css.textAlign}>
                              No Transactions Found
                            </Mui.Grid>
                          )}
                          <InfiniteScroll
                            dataLength={dataten?.length}
                            next={loadMore}
                            // height="63vh"
                            scrollThreshold="20px"
                            initialScrollY="100px"
                            hasMore={hasMoreItems}

                            // useWindow={false}
                          >
                            {dataten?.map((e) => (
                              <Mui.Stack
                                className={css.transactionCard}
                                style={{
                                  backgroundColor: !e?.party_name && '#FFDFC4',
                                }}
                                id={e.name}
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Mui.Grid className={css.nameAndNarration}>
                                  <Mui.Stack direction="row">
                                    <Mui.Grid>
                                      {(e?.party_name === null
                                        ? 'Unknown'
                                        : e.party_name) || e?.narration}
                                    </Mui.Grid>
                                    {e?.similarity_group === true && (
                                      <Mui.Button
                                        className={css.groupBy}
                                        onClick={() => {
                                          // setGroup(true);
                                        }}
                                      >
                                        GROUP
                                      </Mui.Button>
                                    )}
                                  </Mui.Stack>
                                  <Mui.Grid className={css.narrate}>
                                    {e?.narration}
                                  </Mui.Grid>
                                </Mui.Grid>
                                <Mui.Stack
                                  direction="column"
                                  className={css.alignRight}
                                >
                                  <Mui.Grid
                                    className={
                                      e?.amount < 0 ? css.amtRed : css.amtGreen
                                    }
                                  >
                                    {e?.amount < 0 ? '-' : '+'}
                                    {FormattedAmount(e?.amount)}
                                  </Mui.Grid>
                                  <Mui.Grid className={css.date}>
                                    {moment(e?.date).format('DD MMMM YYYY')}
                                  </Mui.Grid>
                                </Mui.Stack>
                              </Mui.Stack>
                            ))}
                          </InfiniteScroll>
                        </Mui.Grid>
                      </div>
                    )}
                  </>
                )}
              </>
            </Mui.Grid>
          </Mui.Grid>
        </Mui.Grid>
        {balance === undefined ? (
          <Mui.Grid item xs={12} md={12}>
            <Mui.Typography variant="h5" style={{ padding: '0 5px' }}>
              Categorize Transaction
            </Mui.Typography>
            <Mui.Grid container spacing={2}>
              <Mui.Grid item xs={12}>
                <Mui.Card
                  className={css.amountPaper}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '25rem',
                  }}
                >
                  <Mui.CardContent>
                    <Mui.Grid
                      container
                      spacing={3}
                      className={css.amountContainer}
                    >
                      <Mui.Grid
                        item
                        xs={12}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Mui.IconButton>
                          <MuiIcon.AddCircle
                            style={{
                              width: '4rem',
                              height: 'fit-content',
                              color: '#f08b32',
                            }}
                          />
                        </Mui.IconButton>
                      </Mui.Grid>
                      <Mui.Grid
                        item
                        xs={12}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Mui.Typography
                          variant="h5"
                          style={{ fontSize: '15px', fontWeight: '300' }}
                        >
                          There are nothing to display
                        </Mui.Typography>
                      </Mui.Grid>

                      <Mui.Grid
                        item
                        xs={8}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: 'auto',
                        }}
                      >
                        <Mui.Button
                          style={{
                            border: '1px solid #F08B32',
                            borderRadius: '20px',
                            background: '#F08B32',
                            color: '#fff',
                            padding: '5px 15px',
                          }}
                        >
                          Add Account
                        </Mui.Button>
                      </Mui.Grid>
                    </Mui.Grid>
                  </Mui.CardContent>
                </Mui.Card>
              </Mui.Grid>
            </Mui.Grid>
          </Mui.Grid>
        ) : (
          <Mui.Grid item xs={12}>
            <Mui.Stack flexDirection="row" alignItems="center" width="100%">
              <Mui.Typography
                variant="h5"
                width="75%"
                style={{ padding: '0 5px' }}
              >
                Categorize Transaction
              </Mui.Typography>
            </Mui.Stack>
            <Mui.Grid
              item
              className={css.vendorContainer}
              sx={{
                height: { xs: '25rem', md: 'auto' },
                flexDirection: { xs: 'column', md: 'row' },
                width: '100%',
              }}
            >
              {/* {[1, 2, 3, 4, 5].map(() => ( */}
              <div className={css.vendorCard}>
                <div className={css.vendorCardBody}>
                  <p>Categorize Transactions</p>
                  <span>
                    {FormattedAmount(paymentCounts?.unsettled_payments_count)}
                    Unknown Payments
                  </span>
                  <div className={css.vendorCardAction}>
                    {FormattedAmount(paymentCounts?.unsettled_payments_total)}
                  </div>
                </div>
              </div>
              <div className={css.vendorCard}>
                <div className={css.vendorCardBody}>
                  <p>Categorize Transactions</p>
                  <span>
                    {FormattedAmount(paymentCounts?.unsettled_receipt_count)}
                    Unknown Receipts
                  </span>
                  <div className={css.vendorCardAction}>
                    {FormattedAmount(paymentCounts?.unsettled_receipts_total)}
                  </div>
                </div>
              </div>
              {/* ))} */}
            </Mui.Grid>
          </Mui.Grid>
        )}
        {/* {balance !== undefined && <CategorizeTransactions minWidth />} */}
        {/* <div
          id="categorize-button"
          style={{
            position: 'absolute',
            float: 'right',
            bottom: '50px',
            left: '90%',
          }}
        >
          <Mui.IconButton title="Categorize Now">
            <MuiIcon.ArrowCircleRight
              style={{
                width: '4rem',
                height: 'fit-content',
                color: '#f08b32',
              }}
              onClick={() => {
                navigate('/bankingcategorizeddetails', {
                  state: { from: 'founder' },
                });
              }}
            />
          </Mui.IconButton>
          <div>
            {window.innerWidth > 1030 ? (
              <label
                style={{
                  width: '200px',
                  float: 'left',
                  textAlign: 'left',
                  position: 'absolute',
                  left: '-100px',
                  top: '35px',
                  fontSize: '.9vw',
                }}
                htmlFor="categorize-button"
              >
                Categorize Now
              </label>
            ) : (
              ''
            )}
          </div>
        </div> */}
      </Mui.Grid>

      <Mui.Dialog
        open={bankDetail?.open}
        onClose={() => setBankDetail((prev) => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
      >
        <LoadWithDraw
          type={bankDetail?.type}
          // accounts={[...new Set([...bankDetail?.data?.connected_banking, ...bankListingDetails])]}
          accounts={bankDetail?.data?.connected_banking?.concat(
            bankListingDetails,
          )}
          handleBottomSheet={(bankId) => {
            setBankDetail((prev) => ({ ...prev, open: false, id: bankId }));
            if (bankDetail?.type === 'load') {
              setPopover({ ...popover, loadMoney: true });
            }
          }}
        />
      </Mui.Dialog>
      <Mui.Dialog
        open={popover.loadMoney}
        onClose={() => setPopover({ ...popover, loadMoney: false })}
        maxWidth="sm"
        fullWidth
      >
        <Mui.Stack justifyContent="flex-end" flexDirection="row">
          <Mui.IconButton
            onClick={() => setPopover({ ...popover, loadMoney: false })}
          >
            <MuiIcon.Close />
          </Mui.IconButton>
        </Mui.Stack>
        <Mui.DialogTitle>Load Your Effortless Virtual Account</Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.Stack>
            <Input
              name="amount"
              // onBlur={}
              // error={}
              // helperText={}
              label="Enter Amount"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setMoneyFun(e, 'loadMoney');
              }}
              value={money.loadMoney}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              type="number"
              required
            />
            <Mui.Stack flexDirection="row" spacing={3}>
              {loadMoneyArray.map((item, index) => (
                <Mui.Button
                  key={item}
                  variant="contained"
                  style={{
                    background:
                      loadMoneyArray.indexOf(money.loadMoney) === index ||
                      item === money.loadMoney ||
                      (item === 0 && !loadMoneyArray.includes(money.loadMoney))
                        ? '#eb963a69'
                        : '#fff',

                    color: '#ea7c1ea8',
                    border: '1px solid #ff7f12a8',
                    height: '2.5rem',
                    whiteSpace: 'nowrap',
                    borderRadius: '10px',
                    margin: '5px',
                    padding: '5px 20px',
                    fontWeight: '600',
                    width: '24%',
                    textTransform: 'none',
                  }}
                  onClick={() => {
                    if (loadMoneyArray.slice(1).includes(item)) {
                      setMoney((prev) => ({
                        ...prev,
                        loadMoney: loadMoneyArray[loadMoneyArray.indexOf(item)],
                      }));
                    } else {
                      setMoney((prev) => ({ ...prev, loadMoney: 0 }));
                    }
                  }}
                >
                  {item === 0 ? 'Custom' : 'Rs '}
                  {item !== 0 && item}
                </Mui.Button>
              ))}
            </Mui.Stack>
            <Mui.Button
              contained
              style={{
                background: '#ff7f12a8',
                color: '#fff',
                borderRadius: '20px',
                padding: '5px 40px',
                fontWeight: '600',
                margin: '20px 0',
              }}
              onClick={() => {
                if (money.loadMoney > 0) {
                  setPopover({
                    ...popover,
                    loadMoney: false,
                    // loadMoneyVerify: true,
                  });
                }
                JSBridge.userAuthenticationforPayments();
                proceed(money.loadMoney);
              }}
            >
              Proceed
            </Mui.Button>
          </Mui.Stack>
        </Mui.DialogContent>
      </Mui.Dialog>

      <Mui.Dialog
        open={popover.loadMoneyVerify}
        onClose={() => setPopover({ ...popover, loadMoneyVerify: false })}
        maxWidth="sm"
        fullWidth
      >
        <Mui.Stack justifyContent="flex-end" flexDirection="row">
          <Mui.IconButton
            onClick={() => setPopover({ ...popover, loadMoneyVerify: false })}
          >
            <MuiIcon.Close />
          </Mui.IconButton>
        </Mui.Stack>
        <Mui.DialogTitle style={{ textAlign: 'center' }}>
          <Mui.Typography
            vaiant="caption"
            style={{ color: '#ffab63', padding: '5px 0' }}
          >
            Effortless Virtual Account
          </Mui.Typography>
          <Mui.Typography
            vaiant="h6"
            style={{ fontWeight: 600, padding: '5px 0' }}
          >
            Verification Code
          </Mui.Typography>
          <Mui.Typography vaiant="caption" style={{ padding: '5px 0' }}>
            Please enter the verification code
            <br /> sent to{' '}
            <span style={{ fontWeight: 600 }}>+91 6865577889</span>
          </Mui.Typography>
        </Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.Stack alignItems="center">
            <OtpInput
              value={otp.loadMoney}
              onChange={(otps) => setOtp({ ...otp, loadMoney: otps })}
              numInputs={6}
              style={{}}
              inputStyle={{
                width: '45.76px',
                height: '56px',
                left: '153.83px',
                backgroundColor: '#FDDFC5',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxSizing: 'border-box',
                borderRadius: '8px',
              }}
              separator={
                <span
                  style={{
                    paddingRight: '10px',
                  }}
                >
                  {' '}
                </span>
              }
            />
            <Mui.Stack flexDirection="column" spacing={1} alignItems="center">
              <Mui.Typography variant="caption" style={{ padding: '5px 0' }}>
                Didn’t receive OTP?
              </Mui.Typography>
              <Mui.Typography
                variant="caption"
                style={{ fontWeight: 600, textDecoration: 'underline' }}
              >
                Resend OTP
              </Mui.Typography>
            </Mui.Stack>
            <Mui.Button
              contained
              style={{
                background: '#ff7f12a8',
                color: '#fff',
                borderRadius: '20px',
                padding: '5px 40px',
                fontWeight: '600',
                margin: '20px 0',
              }}
              onClick={() => {
                setPopover({
                  ...popover,
                  loadMoneyVerify: true,
                  loadMoneySuccess: true,
                });
              }}
            >
              Done
            </Mui.Button>
          </Mui.Stack>
        </Mui.DialogContent>
      </Mui.Dialog>

      <Mui.Dialog
        open={popover.loadMoneySuccess}
        onClose={() => {
          setPopover({ ...popover, loadMoneySuccess: false });
          effortlessBalance();
          const newURL = window.location.href.split('?')[0];
          window.history.pushState('object', document.title, newURL);
        }}
        maxWidth="sm"
        fullWidth
      >
        <Mui.DialogTitle style={{ textAlign: 'center' }}>
          <Mui.Typography vaiant="caption" style={{ padding: '5px 0' }}>
            {bankingRes?.status === 'failed_pg'
              ? 'Money Cannot be Loaded!'
              : 'Effortless Virtual Account has been Loaded'}
          </Mui.Typography>
        </Mui.DialogTitle>
        <Mui.DialogContent style={{ textAlign: 'center' }}>
          <img
            src={bankingRes?.status === 'failed_pg' ? Xlogo : success}
            alt="success"
            style={{ width: '25%' }}
          />

          <Mui.Typography vaiant="caption" style={{ padding: '5px 0' }}>
            {bankingRes?.status === 'failed_pg'
              ? '-Nill-'
              : bankingRes?.productinfo}
          </Mui.Typography>
          <Mui.Typography
            style={{
              color: '#ffab63',
              padding: '5px 0px',
              fontWeight: '400',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() => {
              setPopover({
                ...popover,
                loadMoneyVerify: false,
                loadMoneySuccess: false,
              });
              effortlessBalance();
              const newURL = window.location.href.split('?')[0];
              window.history.pushState('object', document.title, newURL);
            }}
          >
            {bankingRes?.status === 'failed_pg'
              ? 'Close'
              : 'Return to Dashboard'}
          </Mui.Typography>
        </Mui.DialogContent>
      </Mui.Dialog>

      <Mui.Dialog
        open={popover.withdrawMoney}
        onClose={() => setPopover({ ...popover, withdrawMoney: false })}
        maxWidth="sm"
        fullWidth
      >
        <Mui.Stack justifyContent="flex-end" flexDirection="row">
          <Mui.IconButton
            onClick={() => setPopover({ ...popover, withdrawMoney: false })}
          >
            <MuiIcon.Close />
          </Mui.IconButton>
        </Mui.Stack>
        <Mui.DialogTitle>
          Withdraw from Your Effortless Virtual Account
        </Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.Stack>
            <Input
              name="amount"
              // onBlur={}
              // error={}
              // helperText={}
              label="Enter Amount"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setMoneyFun(e, 'withdrawMoney');
              }}
              value={money.withdrawMoney}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              type="number"
              required
            />
            <Mui.Stack flexDirection="row" spacing={3}>
              {loadMoneyArray.map((item, index) => (
                <Mui.Button
                  key={item}
                  variant="contained"
                  style={{
                    background:
                      loadMoneyArray.indexOf(money.withdrawMoney) === index ||
                      item === money.withdrawMoney ||
                      (item === 0 &&
                        !loadMoneyArray.includes(money.withdrawMoney))
                        ? '#eb963a69'
                        : '#fff',
                    color: '#ea7c1ea8',
                    border: '1px solid #ff7f12a8',
                    height: '2.5rem',
                    whiteSpace: 'nowrap',
                    borderRadius: '10px',
                    margin: '5px',
                    padding: '5px 20px',
                    fontWeight: '600',
                    width: '24%',
                    textTransform: 'none',
                  }}
                  onClick={() => {
                    if (loadMoneyArray.slice(1).includes(item)) {
                      setMoney((prev) => ({
                        ...prev,
                        withdrawMoney:
                          loadMoneyArray[loadMoneyArray.indexOf(item)],
                      }));
                    } else {
                      setMoney((prev) => ({ ...prev, withdrawMoney: 0 }));
                    }
                  }}
                >
                  {item === 0 ? 'Custom' : 'Rs '}
                  {item !== 0 && item}
                </Mui.Button>
              ))}
            </Mui.Stack>
            <Mui.Button
              contained
              style={{
                background: '#ff7f12a8',
                color: '#fff',
                borderRadius: '20px',
                padding: '5px 40px',
                fontWeight: '600',
                margin: '20px 0',
              }}
              onClick={() => {
                if (
                  money.withdrawMoney > 0 &&
                  money.withdrawMoney <= balance?.total_balance
                ) {
                  setPopover({
                    ...popover,
                    withdrawMoney: false,
                    // withdrawMoneyVerify: true,
                  });
                }
                JSBridge.userAuthenticationforPayments();
                proceed(money.withdrawMoney);
              }}
            >
              Proceed
            </Mui.Button>
          </Mui.Stack>
        </Mui.DialogContent>
      </Mui.Dialog>

      <Mui.Dialog
        open={popover.withdrawMoneyVerify}
        onClose={() => setPopover({ ...popover, withdrawMoneyVerify: false })}
        maxWidth="sm"
        fullWidth
      >
        <Mui.Stack justifyContent="flex-end" flexDirection="row">
          <Mui.IconButton
            onClick={() =>
              setPopover({ ...popover, withdrawMoneyVerify: false })
            }
          >
            <MuiIcon.Close />
          </Mui.IconButton>
        </Mui.Stack>
        <Mui.DialogTitle style={{ textAlign: 'center' }}>
          <Mui.Typography
            vaiant="caption"
            style={{ color: '#ffab63', padding: '5px 0' }}
          >
            Effortless Virtual Account
          </Mui.Typography>
          <Mui.Typography
            vaiant="h6"
            style={{ fontWeight: 600, padding: '5px 0' }}
          >
            Verification Code
          </Mui.Typography>
          <Mui.Typography vaiant="caption" style={{ padding: '5px 0' }}>
            Please enter the verification code
            <br /> sent to{' '}
            <span style={{ fontWeight: 600 }}>+91 6865577889</span>
          </Mui.Typography>
        </Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.Stack alignItems="center">
            <OtpInput
              value={otp.withdrawMoney}
              onChange={(otps) => setOtp({ ...otp, withdrawMoney: otps })}
              numInputs={6}
              style={{}}
              inputStyle={{
                width: '45.76px',
                height: '56px',
                left: '153.83px',
                backgroundColor: '#FDDFC5',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxSizing: 'border-box',
                borderRadius: '8px',
              }}
              // className={classes.otp}
              separator={
                <span
                  style={{
                    paddingRight: '10px',
                  }}
                >
                  {' '}
                </span>
              }
            />
            <Mui.Stack flexDirection="column" spacing={1} alignItems="center">
              <Mui.Typography variant="caption" style={{ padding: '5px 0' }}>
                Didn’t receive OTP?
              </Mui.Typography>
              <Mui.Typography
                variant="caption"
                style={{ fontWeight: 600, textDecoration: 'underline' }}
              >
                Resend OTP
              </Mui.Typography>
            </Mui.Stack>
            <Mui.Button
              contained
              style={{
                background: '#ff7f12a8',
                color: '#fff',
                borderRadius: '20px',
                padding: '5px 40px',
                fontWeight: '600',
                margin: '20px 0',
              }}
              onClick={() => {
                setPopover({
                  ...popover,
                  withdrawMoneyVerify: true,
                  withdrawMoneySuccess: true,
                });
              }}
            >
              Done
            </Mui.Button>
          </Mui.Stack>
        </Mui.DialogContent>
      </Mui.Dialog>

      <Mui.Dialog
        open={popover.disableAccount}
        onClose={() => setPopover({ ...popover, disableAccount: false })}
        maxWidth="sm"
        fullWidth
      >
        <Mui.DialogTitle style={{ textAlign: 'left' }}>
          <Mui.Typography
            vaiant="caption"
            style={{ color: '#283049', padding: '5px 0' }}
          >
            Heads Up!
          </Mui.Typography>
          <Mui.Typography
            vaiant="h6"
            style={{ fontWeight: 600, padding: '5px 0' }}
          >
            Are you sure you want to disable?
          </Mui.Typography>
        </Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={4}
            mt={4}
            mb={2}
          >
            <Mui.Button
              variant="outlined"
              style={{
                borderColor: '#ff7f12a8',
                color: '#f08b32',
                borderRadius: '20px',
                padding: '7px 50px',
                fontWeight: '600',
              }}
              onClick={() => {
                setPopover({
                  ...popover,
                  disableAccount: false,
                });
              }}
            >
              No
            </Mui.Button>
            <Mui.Button
              contained
              style={{
                background: '#ff7f12a8',
                color: '#fff',
                borderRadius: '20px',
                padding: '7px 50px',
                fontWeight: '600',
              }}
              onClick={() => {
                DeactivateBankAccount();
                setPopover({
                  ...popover,
                  disableAccount: false,
                });
              }}
            >
              Yes
            </Mui.Button>
          </Mui.Stack>
        </Mui.DialogContent>
      </Mui.Dialog>
      <Mui.Dialog
        open={popover.editAccount}
        onClose={() => setPopover({ ...popover, editAccount: false })}
        maxWidth="sm"
        fullWidth
      >
        <Mui.DialogTitle style={{ textAlign: 'left' }}>
          <Mui.Typography
            vaiant="caption"
            style={{ color: '#283049', fontWeight: 600, padding: '5px 0' }}
          >
            Edit Account Details
          </Mui.Typography>
          <Mui.Typography style={{ color: '#283049', padding: '5px 0' }}>
            Modify this Bank Account&apos;s Details
          </Mui.Typography>
        </Mui.DialogTitle>
        <Mui.DialogContent>
          <EditIndividualAccount
            valueCont={editState}
            closeDrawer={() =>
              setPopover({
                ...popover,
                editAccount: false,
              })
            }
          />
        </Mui.DialogContent>
      </Mui.Dialog>

      <Mui.Dialog
        open={popover.withdrawMoneySuccess}
        onClose={() =>
          setPopover({
            ...popover,
            withdrawMoneyverify: false,
            withdrawMoneySuccess: false,
          })
        }
        maxWidth="sm"
        fullWidth
      >
        <Mui.DialogTitle style={{ textAlign: 'center' }}>
          <Mui.Typography vaiant="caption" style={{ padding: '5px 0' }}>
            Money withdrawn - Successfull
          </Mui.Typography>
        </Mui.DialogTitle>
        <Mui.DialogContent style={{ textAlign: 'center' }}>
          <img src={success} alt="success" style={{ width: '25%' }} />

          <Mui.Typography vaiant="caption" style={{ padding: '5px 0' }}>
            10,000 has been debited
          </Mui.Typography>
          <Mui.Typography
            style={{
              color: '#ffab63',
              padding: '5px 0px',
              fontWeight: '400',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() => {
              setPopover({
                ...popover,
                withdrawMoneyVerify: false,
                withdrawMoneySuccess: false,
              });
            }}
          >
            Return to Dashboard
          </Mui.Typography>
        </Mui.DialogContent>
      </Mui.Dialog>
      <Mui.Modal open={toggleModal} onClose={handleCloseModal}>
        <div
          id="Fastlink-container"
          style={{ height: '100vh', overflow: 'scroll', marginTop: '4vh' }}
        />
      </Mui.Modal>

      <SelectBottomSheet
        name="congratsDrawer"
        triggerComponent={<div style={{ display: 'none' }} />}
        open={congratsDrawer}
        addNewSheet
        maxHeight="45vh"
        hideClose
      >
        <TransactionPassword onClose={() => setCongratsDrawer(false)} />
      </SelectBottomSheet>

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
                <Mui.Stack direction="row" className={css2.alignCenterjus}>
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
                <Mui.Stack direction="row" className={css2.alignCenterjus}>
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
                <Mui.Grid className={css2.downloadDescr}>Download As </Mui.Grid>
                <Mui.Stack direction="column" className={css2.spaceBetween}>
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
                    {fileFormatErr ? 'Please Select valid file format' : ''}
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
                  // if (state?.key === 'connectedBankingTransactions') {
                  //   DownloadConnectedBankingStatement();
                  // } else {
                  DownloadStatement();
                  // }
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
              <Mui.Stack direction="column" className={css2.downloadStatement}>
                {' '}
                <Mui.Stack
                  direction="column"
                  className={css2.titleGridDownload}
                >
                  <Mui.Typography className={css2.accBalTitle}>
                    Download as{' '}
                  </Mui.Typography>

                  <Mui.Divider className={css2.divider1} variant="fullWidth" />
                </Mui.Stack>
                <Mui.Stack
                  onClick={() => {
                    setFileFormat('.xlsx');
                    setFileFormatErr(false);
                    if (
                      (customDate.start && customDate.end) ||
                      (downloadPeriod && fileFormat)
                    ) {
                      // if (state?.key === 'connectedBankingTransactions') {
                      //   DownloadConnectedBankingStatement();
                      // } else {
                      DownloadStatement();
                      // }
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
                      // if (state?.key === 'connectedBankingTransactions') {
                      //   DownloadConnectedBankingStatement();
                      // } else {
                      DownloadStatement();
                      // }
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
                      // if (state?.key === 'connectedBankingTransactions') {
                      //   DownloadConnectedBankingStatement();
                      // } else {
                      DownloadStatement();
                      // }
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
      {ippoPayModal && (
        <IppopayComponent
          orderId={paymentResponse?.order_id}
          publicKey={paymentResponse?.public_key}
          setIppopayModal={setIppopayModal}
        />
      )}
    </>
  );
};

export default Banking;
