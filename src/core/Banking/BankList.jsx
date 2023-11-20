import * as React from 'react';
import * as Mui from '@mui/material';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import Paper from '@mui/material/Paper';
import { Drawer, styled } from '@material-ui/core';
import JSBridge from '@nativeBridge/jsbridge';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Input from '@components/Input/Input.jsx';
import tick from '@assets/ticDone.svg';
import threeDotBanking from '@assets/threeDotBanking.svg';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import * as Router from 'react-router-dom';
import LoadWithDraw from '../../components/LoadAndWithdraw/LoadWithDrawSheet';

import * as css from './BankList.scss';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  boxSizing: 'border-box',
  margin: '30px,32px,29px,10px',
}));

const TextfieldStyle = (props) => {
  return (
    <Input
      {...props}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      fullWidth
      theme="light"
      className={css.textfield}
    />
  );
};
const Puller = styled(Mui.Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));
const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiPaper-root': {
    minHeight: '25vh',
    maxHeight: '80vh',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
  },
}));
const BankList = () => {
  const [Banketails, setBanketails] = React.useState([]);
  const {
    organization,
    user,
    setAmt,
    enableLoading,
    registerEventListeners,
    openSnackBar,
  } = React.useContext(AppContext);
  const [toggleDrawer, setToggleDrawer] = React.useState(false);
  const [successDrawer, setSuccessDrawer] = React.useState(false);
  const [toggleModal, setToggleModal] = React.useState(false);

  const [val, setVal] = React.useState();
  const [freeAccount, setFreeAccount] = React.useState([]);
  const [m2pBalanace, setM2pBalanace] = React.useState(0);
  const [payUDatas, setPayUData] = React.useState();
  const [payUSha, setPayUSha] = React.useState();
  const [bankCount, setBankCount] = React.useState({
    currentAcc: 0,
    FD: 0,
    currentAccAmt: 0,
    FDAmt: 0,
    savings: 0,
    savingsAmt: 0,
    creditCard: 0,
    creditCardAmt: 0,
    currentFoundersAcc: 0,
    currentFoundersAccAmt: 0,
    FDFounders: 0,
    FDFoundersAmt: 0,
    savingsFounders: 0,
    savingsFoundersAmt: 0,
    creditCardFounders: 0,
    creditCardFoundersAmt: 0,
    otherAccCompany: 0,
    otherAccCompanyAmt: 0,
    otherAccFounders: 0,
    otherAccFoundersAmt: 0,
  });
  const [subIconStatus, setsubIconStatus] = React.useState('');
  const [bankDetail, setBankDetail] = React.useState({
    data: [],
    open: false,
    id: '',
  });
  const [payUlink, setPayUlink] = React.useState(
    'https://secure.payu.in/_payment',
  );
  const [payUSalt, setPayUSalt] = React.useState(
    '1m95eGJLk8MgVsrw817fxCkz3YC9JCwu',
  );

  const { state } = Router.useLocation();
  const navigate = Router.useNavigate();
  const from = state?.from;
  React.useEffect(() => {
    enableLoading(true);
    RestApi(
      `organizations/${organization?.orgId}/effortless_virtual_accounts`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          if (res.message === 'Effortless Virtual Account not created yet') {
            setFreeAccount([]);
            setM2pBalanace(0);
          } else {
            setFreeAccount(res);
            setM2pBalanace(res);
          }
          enableLoading(false);
        } else {
          enableLoading(false);
        }
      })
      .catch((e) => {
        openSnackBar({
          message: e.message,
          type: MESSAGE_TYPE.INFO,
        });
      });
  }, []);

  React.useEffect(() => {
    if (freeAccount && freeAccount.length > 0) {
      enableLoading(true);
      RestApi(`organizations/${organization?.orgId}/m2p/balance`, {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
      })
        .then((res) => {
          if (res && !res.error) {
            if (res.message === 'Effortless Virtual Account not created yet') {
              setM2pBalanace(0);
            } else {
              setM2pBalanace(res);
            }
            enableLoading(false);
          } else {
            enableLoading(false);
          }
        })
        .catch((e) => {
          openSnackBar({
            message: e.message,
            type: MESSAGE_TYPE.INFO,
          });
        });
    }
  }, [freeAccount]);

  const ToggleState = () => {
    setToggleDrawer(false);
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
  const proceed = () => {
    enableLoading(true);
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
        if (localStorage.getItem('device_detect') !== 'desktop') {
          const udf1 = `${window.location.origin}/banking`;
          const payUsha = await sha512(
            `${res.key}|${res.txn_id}|${res.amount}|${res.product_info}|${res.firstname}|${res.email}|${udf1}||||||||||${payUSalt}`,
          ).then((x) => x);
          await Object.assign(res, { payUsha });
          JSBridge.connectPayU(JSON.stringify(res));
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
      })
      .catch((e) => {
        console.log('PayU error', e);
        enableLoading(false);
      });
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
            setBanketails([]);
          } else {
            setBanketails(res.data.map((c) => c));
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
          if (res?.message) {
            openSnackBar({
              message: res?.message,
              type: MESSAGE_TYPE.WARNING,
            });
          } else {
            navigate('/banking-banklist-account', {
              state: {
                value: {
                  accName: res?.bank_name,
                  amt: res?.available_balance,
                  id: res?.id,
                  accNum: res?.bank_account_number,
                },
                key: 'accountBalance',
                efforrtless: true,
              },
            });
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

  const handleClose = () => {
    setToggleModal(false);
  };
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
            bankListingDetails: Banketails,
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
                  bankListingDetails: Banketails,
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
                  bankListingDetails: Banketails,
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
                  bankListingDetails: Banketails,
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

  const createBankDetails = (response, accountType) => {
    enableLoading(true);
    const responseData = response.detail
      ? JSON.parse(response.detail.value)
      : response;
    RestApi(
      `organizations/${organization?.orgId}/yodlee_bank_accounts/create_bank`,
      {
        method: METHOD.POST,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
        payload: {
          additionalStatus: responseData.additionalStatus,
          fnToCall: responseData.fnToCall,
          providerAccountId: responseData.providerAccountId,
          providerId: responseData.providerId,
          providerName: responseData.providerName,
          requestId: responseData.requestId,
          status: responseData.status,
          reason: responseData.reason,
          account_type: responseData.accountType || accountType,
        },
      },
    )
      .then((res) => {
        if (res) {
          fetchBankDetails();
          handleClose();
        }
      })
      .catch(() => {
        enableLoading(false);
        handleClose();
      });
  };

  const fetchVirtualAccAmt = (response) => {
    const responseData = JSON.parse(response.detail.value);
    console.log(responseData);
    RestApi(
      `organizations/${organization?.orgId}/effortless_virtual_accounts`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res) {
          // fetchBankDetails();
          console.log('effortless_virtual_accounts', res);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const connectBank = (accountType) => {
    enableLoading(true);
    RestApi(
      `organizations/${organization?.orgId}/yodlee_bank_accounts/add_bank`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user?.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (res && res.fastlink_url) {
          if (localStorage.getItem('device_detect') === 'desktop') {
            setToggleModal(true);
            window.fastlink.open(
              {
                fastLinkURL: res.fastlink_url,
                accessToken: `Bearer ${res.access_token}`,
                params: {
                  configName: res.fast_link_config_name,
                },
                forceIframe: true,
                onError(data) {
                  // will be called on error. For list of possible message, refer to onError(data) Method.
                  console.log(data);
                },
                onClose(data) {
                  // will be called called to close FastLink. For list of possible message, refer to onClose(data) Method.
                  if (
                    data.action === 'exit' &&
                    data.status === 'USER_CLOSE_ACTION'
                  ) {
                    handleClose();
                  } else if (
                    data.action === 'exit' &&
                    data.sites &&
                    data.sites.length > 0
                  ) {
                    createBankDetails(data.sites[0], accountType);
                  }
                },
              },
              'Fastlink-container',
            );
          } else {
            JSBridge.connectYodlee(res, accountType);
          }

          enableLoading(false);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  React.useEffect(() => {
    if (state?.connecting === undefined || state?.connecting === null) {
      fetchBankDetails();
    }
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

  React.useEffect(() => {
    registerEventListeners({ name: 'bankData', method: createBankDetails });
    registerEventListeners({ name: 'payUData', method: fetchVirtualAccAmt });
  }, []);
  React.useLayoutEffect(() => {
    if (state?.from === 'keytoConnect') {
      connectBank('company');
    } else if (state?.from === 'keytoConnectFounder') {
      connectBank('founder');
    }
  }, []);
  const device = localStorage.getItem('device_detect');
  React.useEffect(() => {
    if (device === 'desktop' && state === null) {
      navigate('/banking');
    }
  }, []);

  const bankListCount = () => {
    Banketails.forEach((e) => {
      if (e.account_type === 'CURRENT' && e.bank_account_type === 'company') {
        setBankCount((prev) => ({
          ...prev,
          currentAcc: bankCount.currentAcc + 1,
          currentAccAmt: bankCount.currentAccAmt + +e.available_balance,
        }));
      } else if (e.account_type === 'FD' && e.bank_account_type === 'company') {
        setBankCount((prev) => ({
          ...prev,
          FD: bankCount.FD + 1,
          FDAmt: bankCount.FDAmt + +e.available_balance,
        }));
      } else if (
        e.account_type === 'SAVINGS' &&
        e.bank_account_type === 'company'
      ) {
        setBankCount((prev) => ({
          ...prev,
          savings: bankCount.savings + 1,
          savingsAmt: bankCount.savingsAmt + +e.available_balance,
        }));
      } else if (
        e.account_type === 'CURRENT' &&
        e.bank_account_type === 'founder'
      ) {
        setBankCount((prev) => ({
          ...prev,
          currentFoundersAcc: bankCount.currentFoundersAcc + 1,
          currentFoundersAccAmt:
            bankCount.currentFoundersAccAmt + +e.available_balance,
        }));
      } else if (e.account_type === 'FD' && e.bank_account_type === 'founder') {
        setBankCount((prev) => ({
          ...prev,
          FDFounders: bankCount.FDFounders + 1,
          FDFoundersAmt: bankCount.FDFoundersAmt + +e.available_balance,
        }));
      } else if (
        e.account_type === 'SAVINGS' &&
        e.bank_account_type === 'founder'
      ) {
        setBankCount((prev) => ({
          ...prev,
          savingsFounders: bankCount.savingsFounders + 1,
          savingsFoundersAmt:
            bankCount.savingsFoundersAmt + +e.available_balance,
        }));
      } else if (
        e.account_type === 'CREDIT CARD' &&
        e.bank_account_type === 'founder'
      ) {
        setBankCount((prev) => ({
          ...prev,
          creditCardFounders: bankCount.creditCardFounders + 1,
          creditCardFoundersAmt:
            bankCount.creditCardFoundersAmt + +e.available_balance,
        }));
      } else if (
        e.account_type === 'CREDIT CARD' &&
        e.bank_account_type === 'company'
      ) {
        setBankCount((prev) => ({
          ...prev,
          creditCard: bankCount.creditCard + 1,
          creditCardAmt: bankCount.creditCardAmt + +e.available_balance,
        }));
      } else if (e.bank_account_type === 'company') {
        setBankCount((prev) => ({
          ...prev,
          otherAccCompany: bankCount.otherAccCompany + 1,
          otherAccCompanyAmt:
            bankCount.otherAccCompanyAmt + +e.available_balance,
        }));
      } else if (e.bank_account_type === 'founder') {
        setBankCount((prev) => ({
          ...prev,
          otherAccFounders: bankCount.otherAccFounders + 1,
          otherAccFoundersAmt:
            bankCount.otherAccFoundersAmt + +e.available_balance,
        }));
      }
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
    FetchConnectedBank();
  }, []);

  React.useEffect(() => {
    bankListCount();
  }, [Banketails]);
  return (
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
          <input type="hidden" name="furl" value={payUDatas?.furl} />
          <input type="hidden" name="phone" value={payUDatas?.phone} />
          <input type="hidden" name="hash" value={payUSha} />
          <input type="submit" value="submit" id="payUbtn" />{' '}
        </form>
      </div>
      <Mui.Grid
        container
        className={device === 'mobile' ? css.container : css.containerWeb}
      >
        <Mui.Grid
          item
          xs={12}
          className={device === 'mobile' ? css.grid1 : css.grid1Web}
        >
          {!from && freeAccount && freeAccount.id && (
            <Item className={css.paper}>
              <Mui.Stack className={css.amountContainer}>
                <Mui.Stack
                  direction="column"
                  className={device === 'desktop' && css.gridListHeading}
                >
                  <Mui.Grid style={{ paddingBottom: '10px' }}>
                    <Mui.Typography className={css.typo2}>
                      Effortless Virtual Account
                    </Mui.Typography>
                    <Mui.Divider className={css.dividerTitle} />
                  </Mui.Grid>
                  <Mui.Typography className={css.typo3}>
                    For Smoother Transactions, Load Money into your Effortless
                    Virtual Account.
                  </Mui.Typography>
                  <Mui.Grid className={css.balance}>
                    <Mui.Typography className={css.typo4}>
                      Total Balance
                    </Mui.Typography>
                    <Mui.Typography className={css.typo3}>
                      Rs.
                      {m2pBalanace && m2pBalanace.current_balance
                        ? FormattedAmount(m2pBalanace?.current_balance)
                        : m2pBalanace}
                    </Mui.Typography>
                  </Mui.Grid>
                </Mui.Stack>
                <Mui.Stack
                  direction="row"
                  justifyContent="space-between"
                  style={{ marginTop: '23px' }}
                >
                  <Mui.Button
                    className={css.loadMoney}
                    style={{ color: ' #F08B32 ', backgroundColor: 'white' }}
                    // onClick={() => {
                    //   setBankDetail((prev) => ({ ...prev, open: true, type: 'withdraw' }));
                    // }}
                  >
                    <Mui.Typography>Withdraw Money</Mui.Typography>
                  </Mui.Button>
                  <Mui.Button
                    className={css.loadMoney}
                    style={{ color: '#FFFFFF ', backgroundColor: '#F08B32' }}
                    onClick={() => {
                      // setToggleDrawer(true);
                      setBankDetail((prev) => ({
                        ...prev,
                        open: true,
                        type: 'load',
                      }));
                    }}
                  >
                    <Mui.Typography>load money</Mui.Typography>
                  </Mui.Button>
                </Mui.Stack>
              </Mui.Stack>
            </Item>
          )}

          {(!from || from === 'effortlessTxns') && (
            <Mui.Stack className={css.pb}>
              <Mui.Stack
                direction="row"
                className={device === 'desktop' && css.gridListHeading}
                justifyContent="space-between"
              >
                <Mui.Grid style={{ paddingBottom: '10px' }}>
                  <Mui.Typography className={css.typo2}>
                    Effortless Virtual Account
                  </Mui.Typography>
                  <Mui.Divider className={css.dividerTitle} />
                </Mui.Grid>
              </Mui.Stack>
              {}
              {freeAccount && freeAccount.id && (
                <Mui.Stack
                  className={css.bankDetailsGrey}
                  onClick={() => {
                    setAmt({
                      accName: freeAccount.bank_account_name,
                      amt: freeAccount.current_balance,
                      id: freeAccount.id,
                      accNum: freeAccount.bank_account_number,
                    });
                    fetchEffortlessTxns();
                  }}
                >
                  <Mui.Typography className={css.typo3}>
                    {freeAccount.bank_account_name}
                  </Mui.Typography>
                  <Mui.Stack direction="row" justifyContent="space-between">
                    <Mui.Typography className={css.accNum}>
                      {freeAccount.bank_account_number}
                    </Mui.Typography>
                    <Mui.Typography className={css.balAmount}>
                      {FormattedAmount(freeAccount.current_balance)}
                    </Mui.Typography>
                  </Mui.Stack>
                </Mui.Stack>
              )}

              {/* {Banketails.length === 0 && <span>Bank Account not found</span>} */}
            </Mui.Stack>
          )}

          {(!from || from === 'company' || from === 'keytoConnect') && (
            <Mui.Stack className={css.pb}>
              <Mui.Stack
                direction="row"
                className={device === 'desktop' && css.gridListHeading}
                justifyContent="space-between"
              >
                <Mui.Grid>
                  <Mui.Typography className={css.typo2}>
                    List of Business Accounts
                  </Mui.Typography>
                  <Mui.Divider className={css.dividerTitle} />
                </Mui.Grid>
                <Mui.Button
                  className={
                    device === 'mobile'
                      ? css.connectButton
                      : css.connectButtonWeb
                  }
                  // onClick={() => {
                  //   changeSubView('accountBalance');
                  // }}
                  onClick={() => connectBank('company')}
                >
                  {device === 'mobile' ? 'Connect' : 'Connect an Account'}
                </Mui.Button>
              </Mui.Stack>
              {}
              <Mui.Grid
                style={{ display: bankCount.currentAcc === 0 && 'none' }}
                className={
                  subIconStatus === 'current'
                    ? css.bankDetailsGridAfter
                    : css.bankDetailsGridbefore
                }
                onClick={() => {
                  setsubIconStatus(
                    subIconStatus === 'current' ? '' : 'current',
                  );
                }}
              >
                <Mui.Stack className={css.bankDetailsTop} direction="row">
                  <Mui.Typography className={css.typo3}>
                    {bankCount.currentAcc} CURRENT ACCOUNTS
                  </Mui.Typography>
                  <Mui.Stack direction="row" className={css.amountTotalStack}>
                    <Mui.Typography className={css.balAmount}>
                      {FormattedAmount(bankCount.currentAccAmt)}
                    </Mui.Typography>
                    <Mui.Grid
                      className={
                        device !== 'mobile' ? css.arrowDownWeb : css.arrowDown
                      }
                      onClick={() => {
                        setsubIconStatus(
                          subIconStatus === 'current' ? '' : 'current',
                        );
                      }}
                    >
                      <KeyboardArrowDownIcon
                        className={
                          subIconStatus === 'current'
                            ? css.arrowiconDown
                            : css.arrowiconRight
                        }
                      />
                    </Mui.Grid>
                  </Mui.Stack>
                </Mui.Stack>
                {subIconStatus === 'current' && (
                  <>
                    {Banketails &&
                      Banketails.map((e) =>
                        e.account_type === 'CURRENT' &&
                        e.bank_account_type === 'company' ? (
                          <Mui.Stack
                            style={{
                              background: device !== 'mobile' ? '#F2F2F0' : '',
                            }}
                            className={css.bankDetails}
                            onClick={() => {
                              fetchBankDetailsStatus(e.id, 'company', e);
                            }}
                          >
                            <Mui.Typography className={css.typo3}>
                              {e.bank_name} -{e.account_type}
                            </Mui.Typography>
                            <Mui.Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Mui.Typography className={css.accNum}>
                                {e.bank_account_number}
                              </Mui.Typography>

                              <Mui.Stack
                                direction="row"
                                className={css.amountTotalStack}
                              >
                                <Mui.Typography className={css.balAmount}>
                                  {FormattedAmount(e.available_balance)}
                                </Mui.Typography>
                                <Mui.Grid className={css.bankDetailsGridRight}>
                                  {device === 'mobile' ? (
                                    <img src={threeDotBanking} alt="options" />
                                  ) : (
                                    <KeyboardArrowDownIcon
                                      className={css.arrowiconRight}
                                    />
                                  )}
                                </Mui.Grid>
                              </Mui.Stack>
                            </Mui.Stack>
                          </Mui.Stack>
                        ) : (
                          ''
                        ),
                      )}
                  </>
                )}
              </Mui.Grid>
              <Mui.Grid
                style={{ display: bankCount.savings === 0 && 'none' }}
                className={
                  subIconStatus === 'savings'
                    ? css.bankDetailsGridAfter
                    : css.bankDetailsGridbefore
                }
                onClick={() => {
                  setsubIconStatus(
                    subIconStatus === 'savings' ? '' : 'savings',
                  );
                }}
              >
                <Mui.Stack className={css.bankDetailsTop} direction="row">
                  <Mui.Typography className={css.typo3}>
                    {bankCount.savings} SAVINGS ACCOUNTS
                  </Mui.Typography>
                  <Mui.Stack direction="row" className={css.amountTotalStack}>
                    <Mui.Typography className={css.balAmount}>
                      {FormattedAmount(bankCount.savingsAmt)}
                    </Mui.Typography>
                    <Mui.Grid
                      className={
                        device !== 'mobile' ? css.arrowDownWeb : css.arrowDown
                      }
                      onClick={() => {
                        setsubIconStatus(
                          subIconStatus === 'savings' ? '' : 'savings',
                        );
                      }}
                    >
                      <KeyboardArrowDownIcon
                        className={
                          subIconStatus === 'savings'
                            ? css.arrowiconDown
                            : css.arrowiconRight
                        }
                      />{' '}
                    </Mui.Grid>
                  </Mui.Stack>
                </Mui.Stack>
                {subIconStatus === 'savings' && (
                  <>
                    {Banketails &&
                      Banketails.map((e) =>
                        e.account_type === 'SAVINGS' &&
                        e.bank_account_type === 'company' ? (
                          <Mui.Stack
                            style={{
                              background: device !== 'mobile' ? '#F2F2F0' : '',
                            }}
                            className={css.bankDetails}
                            onClick={() => {
                              fetchBankDetailsStatus(e.id, 'company', e);
                            }}
                          >
                            <Mui.Typography className={css.typo3}>
                              {e.bank_name} -{e.account_type}
                            </Mui.Typography>
                            <Mui.Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Mui.Typography className={css.accNum}>
                                {e.bank_account_number}
                              </Mui.Typography>
                              <Mui.Stack
                                direction="row"
                                className={css.amountTotalStack}
                              >
                                <Mui.Typography className={css.balAmount}>
                                  {FormattedAmount(e.available_balance)}
                                </Mui.Typography>
                                <Mui.Grid className={css.bankDetailsGridRight}>
                                  {device === 'mobile' ? (
                                    <img src={threeDotBanking} alt="options" />
                                  ) : (
                                    <KeyboardArrowDownIcon
                                      className={css.arrowiconRight}
                                    />
                                  )}
                                </Mui.Grid>
                              </Mui.Stack>
                            </Mui.Stack>
                          </Mui.Stack>
                        ) : (
                          ''
                        ),
                      )}
                  </>
                )}
              </Mui.Grid>
              <Mui.Grid
                style={{ display: bankCount.FD === 0 && 'none' }}
                className={
                  subIconStatus === 'FD'
                    ? css.bankDetailsGridAfter
                    : css.bankDetailsGridbefore
                }
                onClick={() => {
                  setsubIconStatus(subIconStatus === 'FD' ? '' : 'FD');
                }}
              >
                <Mui.Stack className={css.bankDetailsTop} direction="row">
                  <Mui.Typography className={css.typo3}>
                    {bankCount.FD} FIXED DEPOSITS
                  </Mui.Typography>
                  <Mui.Stack direction="row" className={css.amountTotalStack}>
                    <Mui.Typography className={css.balAmount}>
                      {FormattedAmount(bankCount.FDAmt)}
                    </Mui.Typography>
                    <Mui.Grid
                      className={
                        device !== 'mobile' ? css.arrowDownWeb : css.arrowDown
                      }
                      onClick={() => {
                        setsubIconStatus(subIconStatus === 'FD' ? '' : 'FD');
                      }}
                    >
                      <KeyboardArrowDownIcon
                        className={
                          subIconStatus === 'FD'
                            ? css.arrowiconDown
                            : css.arrowiconRight
                        }
                      />{' '}
                    </Mui.Grid>
                  </Mui.Stack>
                </Mui.Stack>
                {subIconStatus === 'FD' && (
                  <>
                    {Banketails &&
                      Banketails.map((e) =>
                        e.account_type === 'FD' &&
                        e.bank_account_type === 'company' ? (
                          <Mui.Stack
                            style={{
                              background: device !== 'mobile' ? '#F2F2F0' : '',
                            }}
                            className={css.bankDetails}
                            onClick={() => {
                              fetchBankDetailsStatus(e.id, 'company', e);
                            }}
                          >
                            <Mui.Typography className={css.typo3}>
                              {e.bank_name} -{e.account_type}
                            </Mui.Typography>
                            <Mui.Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Mui.Typography className={css.accNum}>
                                {e.bank_account_number}
                              </Mui.Typography>

                              <Mui.Stack
                                direction="row"
                                className={css.amountTotalStack}
                              >
                                <Mui.Typography className={css.balAmount}>
                                  {FormattedAmount(e.available_balance)}
                                </Mui.Typography>
                                <Mui.Grid className={css.bankDetailsGridRight}>
                                  {device === 'mobile' ? (
                                    <img src={threeDotBanking} alt="options" />
                                  ) : (
                                    <KeyboardArrowDownIcon
                                      className={css.arrowiconRight}
                                    />
                                  )}
                                </Mui.Grid>
                              </Mui.Stack>
                            </Mui.Stack>
                          </Mui.Stack>
                        ) : (
                          ''
                        ),
                      )}
                  </>
                )}
              </Mui.Grid>

              <Mui.Grid
                style={{ display: bankCount.otherAccCompany === 0 && 'none' }}
                className={
                  subIconStatus === 'others'
                    ? css.bankDetailsGridAfter
                    : css.bankDetailsGridbefore
                }
                onClick={() => {
                  setsubIconStatus(subIconStatus === 'others' ? '' : 'others');
                }}
              >
                <Mui.Stack className={css.bankDetailsTop} direction="row">
                  <Mui.Typography className={css.typo3}>
                    {bankCount.otherAccCompany} Other Accounts
                  </Mui.Typography>
                  <Mui.Stack direction="row" className={css.amountTotalStack}>
                    <Mui.Typography className={css.balAmount}>
                      {FormattedAmount(bankCount.otherAccCompanyAmt)}
                    </Mui.Typography>
                    <Mui.Grid
                      className={
                        device !== 'mobile' ? css.arrowDownWeb : css.arrowDown
                      }
                      onClick={() => {
                        setsubIconStatus(
                          subIconStatus === 'others' ? '' : 'others',
                        );
                      }}
                    >
                      <KeyboardArrowDownIcon
                        className={
                          subIconStatus === 'others'
                            ? css.arrowiconDown
                            : css.arrowiconRight
                        }
                      />{' '}
                    </Mui.Grid>
                  </Mui.Stack>
                </Mui.Stack>
                {subIconStatus === 'others' && (
                  <>
                    {Banketails &&
                      Banketails.map((e) =>
                        e.account_type !== 'CURRENT' &&
                        e.account_type !== 'SAVINGS' &&
                        e.account_type !== 'FD' &&
                        e.bank_account_type === 'company' ? (
                          <Mui.Stack
                            style={{
                              background: device !== 'mobile' ? '#F2F2F0' : '',
                            }}
                            className={css.bankDetails}
                            onClick={() => {
                              // changeSubView('accountBalance');
                              // setAmt({
                              //   accName: e.bank_name,
                              //   amt: e.available_balance,
                              //   id: e.id,
                              //   accNum: e.bank_account_number,
                              // });
                              fetchBankDetailsStatus(e.id, 'company', e);
                            }}
                          >
                            <Mui.Typography className={css.typo3}>
                              {e.bank_name} -{e.account_type}
                            </Mui.Typography>
                            <Mui.Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Mui.Typography className={css.accNum}>
                                {e.bank_account_number}
                              </Mui.Typography>

                              <Mui.Stack
                                direction="row"
                                className={css.amountTotalStack}
                              >
                                <Mui.Typography className={css.balAmount}>
                                  {FormattedAmount(e.available_balance)}
                                </Mui.Typography>
                                <Mui.Grid className={css.bankDetailsGridRight}>
                                  {device === 'mobile' ? (
                                    <img src={threeDotBanking} alt="options" />
                                  ) : (
                                    <KeyboardArrowDownIcon
                                      className={css.arrowiconRight}
                                    />
                                  )}
                                </Mui.Grid>
                              </Mui.Stack>
                            </Mui.Stack>
                          </Mui.Stack>
                        ) : (
                          ''
                        ),
                      )}
                  </>
                )}
              </Mui.Grid>

              <Mui.Grid
                style={{ display: bankCount.creditCard === 0 && 'none' }}
                className={
                  subIconStatus === 'creditCard'
                    ? css.bankDetailsGridAfter
                    : css.bankDetailsGridbefore
                }
                onClick={() => {
                  setsubIconStatus(
                    subIconStatus === 'creditCard' ? '' : 'creditCard',
                  );
                }}
              >
                <Mui.Stack className={css.bankDetailsTop} direction="row">
                  <Mui.Typography className={css.typo3}>
                    {bankCount.creditCard} CREDIT CARDS
                  </Mui.Typography>
                  <Mui.Stack direction="row" className={css.amountTotalStack}>
                    <Mui.Typography className={css.balAmount}>
                      {FormattedAmount(bankCount.creditCardAmt)}
                    </Mui.Typography>
                    <Mui.Grid
                      className={
                        device !== 'mobile' ? css.arrowDownWeb : css.arrowDown
                      }
                      onClick={() => {
                        setsubIconStatus(
                          subIconStatus === 'creditCard' ? '' : 'creditCard',
                        );
                      }}
                    >
                      <KeyboardArrowDownIcon
                        className={
                          subIconStatus === 'creditCard'
                            ? css.arrowiconDown
                            : css.arrowiconRight
                        }
                      />{' '}
                    </Mui.Grid>
                  </Mui.Stack>
                </Mui.Stack>
                {subIconStatus === 'creditCard' && (
                  <>
                    {Banketails &&
                      Banketails.map((e) =>
                        e.account_type === 'CREDIT CARD' &&
                        e.bank_account_type === 'company' ? (
                          <Mui.Stack
                            style={{
                              background: device !== 'mobile' ? '#F2F2F0' : '',
                            }}
                            className={css.bankDetails}
                            onClick={() => {
                              fetchBankDetailsStatus(e.id, 'company', e);
                            }}
                          >
                            <Mui.Typography className={css.typo3}>
                              {e.bank_name} -{e.account_type}
                            </Mui.Typography>
                            <Mui.Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Mui.Typography className={css.accNum}>
                                {e.bank_account_number}
                              </Mui.Typography>
                              <Mui.Stack
                                direction="row"
                                className={css.amountTotalStack}
                              >
                                <Mui.Typography className={css.balAmount}>
                                  {FormattedAmount(e.available_balance)}
                                </Mui.Typography>
                                <Mui.Grid className={css.bankDetailsGridRight}>
                                  {device === 'mobile' ? (
                                    <img src={threeDotBanking} alt="options" />
                                  ) : (
                                    <KeyboardArrowDownIcon
                                      className={css.arrowiconRight}
                                    />
                                  )}
                                </Mui.Grid>
                              </Mui.Stack>
                            </Mui.Stack>
                          </Mui.Stack>
                        ) : (
                          ''
                        ),
                      )}
                  </>
                )}
              </Mui.Grid>

              {/* {Banketails.length === 0 && <span>Bank Account not found</span>} */}
            </Mui.Stack>
          )}
          {(!from || from === 'founder' || from === 'keytoConnectFounder') && (
            <Mui.Stack className={css.pb}>
              <Mui.Stack
                direction="row"
                className={device === 'desktop' && css.gridListHeading}
                justifyContent="space-between"
              >
                <Mui.Grid>
                  <Mui.Typography className={css.typo2}>
                    List of Founders’ Accounts
                  </Mui.Typography>
                  <Mui.Divider className={css.dividerTitle} />
                </Mui.Grid>
                <Mui.Button
                  className={
                    device === 'mobile'
                      ? css.connectButton
                      : css.connectButtonWeb
                  }
                  onClick={() => connectBank('founder')}
                >
                  {device === 'mobile' ? 'Connect' : 'Connect an Account'}
                </Mui.Button>
              </Mui.Stack>

              <Mui.Grid
                style={{
                  display: bankCount.currentFoundersAcc === 0 && 'none',
                }}
                className={
                  subIconStatus === 'currentFoundersAcc'
                    ? css.bankDetailsGridAfter
                    : css.bankDetailsGridbefore
                }
                onClick={() => {
                  setsubIconStatus(
                    subIconStatus === 'currentFoundersAcc'
                      ? ''
                      : 'currentFoundersAcc',
                  );
                }}
              >
                <Mui.Stack className={css.bankDetailsTop} direction="row">
                  <Mui.Typography className={css.typo3}>
                    {bankCount.currentFoundersAcc} CURRENT ACCOUNTS
                  </Mui.Typography>
                  <Mui.Stack direction="row" className={css.amountTotalStack}>
                    <Mui.Typography className={css.balAmount}>
                      {FormattedAmount(bankCount.currentFoundersAccAmt)}
                    </Mui.Typography>
                    <Mui.Grid
                      className={
                        device !== 'mobile' ? css.arrowDownWeb : css.arrowDown
                      }
                      onClick={() => {
                        setsubIconStatus(
                          subIconStatus === 'currentFoundersAcc'
                            ? ''
                            : 'currentFoundersAcc',
                        );
                      }}
                    >
                      <KeyboardArrowDownIcon
                        className={
                          subIconStatus === 'currentFoundersAcc'
                            ? css.arrowiconDown
                            : css.arrowiconRight
                        }
                      />
                    </Mui.Grid>
                  </Mui.Stack>
                </Mui.Stack>
                {subIconStatus === 'current' && (
                  <>
                    {Banketails &&
                      Banketails.map((e) =>
                        e.account_type === 'CURRENT' &&
                        e.bank_account_type === 'founder' ? (
                          <Mui.Stack
                            style={{
                              background: device !== 'mobile' ? '#F2F2F0' : '',
                            }}
                            className={css.bankDetails}
                            onClick={() => {
                              fetchBankDetailsStatus(e.id, 'founder', e);
                            }}
                          >
                            <Mui.Typography className={css.typo3}>
                              {e.bank_name} -{e.account_type}
                            </Mui.Typography>
                            <Mui.Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Mui.Typography className={css.accNum}>
                                {e.bank_account_number}
                              </Mui.Typography>
                              <Mui.Stack
                                direction="row"
                                className={css.amountTotalStack}
                              >
                                <Mui.Typography className={css.balAmount}>
                                  {FormattedAmount(e.available_balance)}
                                </Mui.Typography>
                                <Mui.Grid className={css.bankDetailsGridRight}>
                                  {device === 'mobile' ? (
                                    <img src={threeDotBanking} alt="options" />
                                  ) : (
                                    <KeyboardArrowDownIcon
                                      className={css.arrowiconRight}
                                    />
                                  )}
                                </Mui.Grid>
                              </Mui.Stack>
                            </Mui.Stack>
                          </Mui.Stack>
                        ) : (
                          ''
                        ),
                      )}
                  </>
                )}
              </Mui.Grid>
              <Mui.Grid
                style={{ display: bankCount.savingsFounders === 0 && 'none' }}
                className={
                  subIconStatus === 'savingsFounders'
                    ? css.bankDetailsGridAfter
                    : css.bankDetailsGridbefore
                }
                onClick={() => {
                  setsubIconStatus(
                    subIconStatus === 'savingsFounders'
                      ? ''
                      : 'savingsFounders',
                  );
                }}
              >
                <Mui.Stack className={css.bankDetailsTop} direction="row">
                  <Mui.Typography className={css.typo3}>
                    {bankCount.savingsFounders} SAVINGS ACCOUNTS
                  </Mui.Typography>
                  <Mui.Stack direction="row" className={css.amountTotalStack}>
                    <Mui.Typography className={css.balAmount}>
                      {FormattedAmount(bankCount.savingsFoundersAmt)}
                    </Mui.Typography>
                    <Mui.Grid
                      className={
                        device !== 'mobile' ? css.arrowDownWeb : css.arrowDown
                      }
                      onClick={() => {
                        setsubIconStatus(
                          subIconStatus === 'savingsFounders'
                            ? ''
                            : 'savingsFounders',
                        );
                      }}
                    >
                      <KeyboardArrowDownIcon
                        className={
                          subIconStatus === 'savingsFounders'
                            ? css.arrowiconDown
                            : css.arrowiconRight
                        }
                      />{' '}
                    </Mui.Grid>
                  </Mui.Stack>
                </Mui.Stack>
                {subIconStatus === 'savingsFounders' && (
                  <>
                    {Banketails &&
                      Banketails.map((e) =>
                        e.account_type === 'SAVINGS' &&
                        e.bank_account_type === 'founder' ? (
                          <Mui.Stack
                            style={{
                              background: device !== 'mobile' ? '#F2F2F0' : '',
                            }}
                            className={css.bankDetails}
                            onClick={() => {
                              fetchBankDetailsStatus(e.id, 'founder', e);
                            }}
                          >
                            <Mui.Typography className={css.typo3}>
                              {e.bank_name} -{e.account_type}
                            </Mui.Typography>
                            <Mui.Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Mui.Typography className={css.accNum}>
                                {e.bank_account_number}
                              </Mui.Typography>
                              <Mui.Stack
                                direction="row"
                                className={css.amountTotalStack}
                              >
                                <Mui.Typography className={css.balAmount}>
                                  {FormattedAmount(e.available_balance)}
                                </Mui.Typography>
                                <Mui.Grid className={css.bankDetailsGridRight}>
                                  {device === 'mobile' ? (
                                    <img src={threeDotBanking} alt="options" />
                                  ) : (
                                    <KeyboardArrowDownIcon
                                      className={css.arrowiconRight}
                                    />
                                  )}
                                </Mui.Grid>
                              </Mui.Stack>
                            </Mui.Stack>
                          </Mui.Stack>
                        ) : (
                          ''
                        ),
                      )}
                  </>
                )}
              </Mui.Grid>
              <Mui.Grid
                style={{ display: bankCount.FDFounders === 0 && 'none' }}
                className={
                  subIconStatus === 'FDFounders'
                    ? css.bankDetailsGridAfter
                    : css.bankDetailsGridbefore
                }
                onClick={() => {
                  setsubIconStatus(
                    subIconStatus === 'FDFounders' ? '' : 'FDFounders',
                  );
                }}
              >
                <Mui.Stack className={css.bankDetailsTop} direction="row">
                  <Mui.Typography className={css.typo3}>
                    {bankCount.FDFounders} FIXED DEPOSITS
                  </Mui.Typography>
                  <Mui.Stack direction="row" className={css.amountTotalStack}>
                    <Mui.Typography className={css.balAmount}>
                      {FormattedAmount(bankCount.FDFoundersAmt)}
                    </Mui.Typography>
                    <Mui.Grid
                      className={
                        device !== 'mobile' ? css.arrowDownWeb : css.arrowDown
                      }
                      onClick={() => {
                        setsubIconStatus(
                          subIconStatus === 'FDFounders' ? '' : 'FDFounders',
                        );
                      }}
                    >
                      <KeyboardArrowDownIcon
                        className={
                          subIconStatus === 'FDFounders'
                            ? css.arrowiconDown
                            : css.arrowiconRight
                        }
                      />{' '}
                    </Mui.Grid>
                  </Mui.Stack>
                </Mui.Stack>
                {subIconStatus === 'FDFounders' && (
                  <>
                    {Banketails &&
                      Banketails.map((e) =>
                        e.account_type === 'FDFounders' &&
                        e.bank_account_type === 'founder' ? (
                          <Mui.Stack
                            style={{
                              background: device !== 'mobile' ? '#F2F2F0' : '',
                            }}
                            className={css.bankDetails}
                            onClick={() => {
                              fetchBankDetailsStatus(e.id, 'founder', e);
                            }}
                          >
                            <Mui.Typography className={css.typo3}>
                              {e.bank_name} -{e.account_type}
                            </Mui.Typography>
                            <Mui.Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Mui.Typography className={css.accNum}>
                                {e.bank_account_number}
                              </Mui.Typography>
                              <Mui.Stack
                                direction="row"
                                className={css.amountTotalStack}
                              >
                                <Mui.Typography className={css.balAmount}>
                                  {FormattedAmount(e.available_balance)}
                                </Mui.Typography>
                                <Mui.Grid className={css.bankDetailsGridRight}>
                                  {device === 'mobile' ? (
                                    <img src={threeDotBanking} alt="options" />
                                  ) : (
                                    <KeyboardArrowDownIcon
                                      className={css.arrowiconRight}
                                    />
                                  )}
                                </Mui.Grid>
                              </Mui.Stack>
                            </Mui.Stack>
                          </Mui.Stack>
                        ) : (
                          ''
                        ),
                      )}
                  </>
                )}
              </Mui.Grid>

              <Mui.Grid
                style={{ display: bankCount.otherAccFounders === 0 && 'none' }}
                className={
                  subIconStatus === 'foundersOthers'
                    ? css.bankDetailsGridAfter
                    : css.bankDetailsGridbefore
                }
                onClick={() => {
                  setsubIconStatus(
                    subIconStatus === 'foundersOthers' ? '' : 'foundersOthers',
                  );
                }}
              >
                <Mui.Stack className={css.bankDetailsTop} direction="row">
                  <Mui.Typography className={css.typo3}>
                    {bankCount.otherAccFounders} Other Accounts
                  </Mui.Typography>
                  <Mui.Stack direction="row" className={css.amountTotalStack}>
                    <Mui.Typography className={css.balAmount}>
                      Rs. {FormattedAmount(bankCount.otherAccFoundersAmt)}
                    </Mui.Typography>
                    <Mui.Grid
                      className={
                        device !== 'mobile' ? css.arrowDownWeb : css.arrowDown
                      }
                      onClick={() => {
                        setsubIconStatus(
                          subIconStatus === 'foundersOthers'
                            ? ''
                            : 'foundersOthers',
                        );
                      }}
                    >
                      <KeyboardArrowDownIcon
                        className={
                          subIconStatus === 'foundersOthers'
                            ? css.arrowiconDown
                            : css.arrowiconRight
                        }
                      />{' '}
                    </Mui.Grid>
                  </Mui.Stack>
                </Mui.Stack>
                {subIconStatus === 'foundersOthers' && (
                  <>
                    {Banketails &&
                      Banketails.map((e) =>
                        e.account_type !== 'CURRENT' &&
                        e.account_type !== 'SAVINGS' &&
                        e.account_type !== 'FDFounders  ' &&
                        e.bank_account_type === 'founder' ? (
                          <Mui.Stack
                            style={{
                              background: device !== 'mobile' ? '#F2F2F0' : '',
                            }}
                            className={css.bankDetails}
                            onClick={() => {
                              fetchBankDetailsStatus(e.id, 'founder', e);
                            }}
                          >
                            <Mui.Typography className={css.typo3}>
                              {e.bank_name} -{e.account_type}
                            </Mui.Typography>
                            <Mui.Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Mui.Typography className={css.accNum}>
                                {e.bank_account_number}
                              </Mui.Typography>
                              <Mui.Stack
                                direction="row"
                                className={css.amountTotalStack}
                              >
                                <Mui.Typography className={css.balAmount}>
                                  {FormattedAmount(e.available_balance)}
                                </Mui.Typography>
                                <Mui.Grid className={css.bankDetailsGridRight}>
                                  {device === 'mobile' ? (
                                    <img src={threeDotBanking} alt="options" />
                                  ) : (
                                    <KeyboardArrowDownIcon
                                      className={css.arrowiconRight}
                                    />
                                  )}
                                </Mui.Grid>
                              </Mui.Stack>
                            </Mui.Stack>
                          </Mui.Stack>
                        ) : (
                          ''
                        ),
                      )}
                  </>
                )}
              </Mui.Grid>

              <Mui.Grid
                style={{
                  display: bankCount.creditCardFounders === 0 && 'none',
                }}
                className={
                  subIconStatus === 'founderscreditCard'
                    ? css.bankDetailsGridAfter
                    : css.bankDetailsGridbefore
                }
                onClick={() => {
                  setsubIconStatus(
                    subIconStatus === 'founderscreditCard'
                      ? ''
                      : 'founderscreditCard',
                  );
                }}
              >
                <Mui.Stack className={css.bankDetailsTop} direction="row">
                  <Mui.Typography className={css.typo3}>
                    {bankCount.creditCardFounders}
                    CREDIT CARDS
                  </Mui.Typography>
                  <Mui.Stack direction="row" className={css.amountTotalStack}>
                    <Mui.Typography className={css.balAmount}>
                      {FormattedAmount(bankCount.FDAmt)}
                    </Mui.Typography>
                    <Mui.Grid
                      className={
                        device !== 'mobile' ? css.arrowDownWeb : css.arrowDown
                      }
                      onClick={() => {
                        setsubIconStatus(
                          subIconStatus === 'founderscreditCard'
                            ? ''
                            : 'founderscreditCard',
                        );
                      }}
                    >
                      <KeyboardArrowDownIcon
                        className={
                          subIconStatus === 'founderscreditCard'
                            ? css.arrowiconDown
                            : css.arrowiconRight
                        }
                      />{' '}
                    </Mui.Grid>
                  </Mui.Stack>
                </Mui.Stack>
                {subIconStatus === 'founderscreditCard' && (
                  <>
                    {Banketails &&
                      Banketails.map((e) =>
                        e.account_type === 'CREDIT CARD' &&
                        e.bank_account_type === 'founder' ? (
                          <Mui.Stack
                            style={{
                              background: device !== 'mobile' ? '#F2F2F0' : '',
                            }}
                            className={css.bankDetails}
                            onClick={() => {
                              fetchBankDetailsStatus(e.id, 'founder', e);
                            }}
                          >
                            <Mui.Typography className={css.typo3}>
                              {e.bank_name} -{e.account_type}
                            </Mui.Typography>
                            <Mui.Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Mui.Typography className={css.accNum}>
                                {e.bank_account_number}
                              </Mui.Typography>
                              <Mui.Stack
                                direction="row"
                                className={css.amountTotalStack}
                              >
                                <Mui.Typography className={css.balAmount}>
                                  {FormattedAmount(e.available_balance)}
                                </Mui.Typography>
                                <Mui.Grid className={css.bankDetailsGridRight}>
                                  {device === 'mobile' ? (
                                    <img src={threeDotBanking} alt="options" />
                                  ) : (
                                    <KeyboardArrowDownIcon
                                      className={css.arrowiconRight}
                                    />
                                  )}
                                </Mui.Grid>
                              </Mui.Stack>
                            </Mui.Stack>
                          </Mui.Stack>
                        ) : (
                          ''
                        ),
                      )}
                  </>
                )}
              </Mui.Grid>
            </Mui.Stack>
          )}

          <StyledDrawer
            anchor="bottom"
            open={bankDetail?.open}
            onClose={() => setBankDetail((prev) => ({ ...prev, open: false }))}
          >
            <Mui.Stack className={css.drawerStack} spacing={2}>
              <Puller />
              <LoadWithDraw
                type={bankDetail?.type}
                accounts={bankDetail?.data?.connected_banking}
                handleBottomSheet={(bankId) => {
                  setBankDetail((prev) => ({
                    ...prev,
                    open: false,
                    id: bankId,
                  }));
                  if (bankDetail?.type === 'load') {
                    setToggleDrawer(true);
                  }
                }}
              />
            </Mui.Stack>
          </StyledDrawer>

          <StyledDrawer
            anchor="bottom"
            open={toggleDrawer}
            onClose={ToggleState}
          >
            <Mui.Stack className={css.drawerStack} spacing={2}>
              <Puller />
              <Mui.Typography className={css.heading}>
                Load your Effortless Virtual Account
              </Mui.Typography>
              <TextfieldStyle
                label="Enter Amount"
                type="number"
                onChange={(e) => setVal(e.target.value)}
                value={val}
              />
              <Mui.Stack direction="row" spacing={1}>
                <Mui.Button
                  variant="outlined"
                  className={css.selectBtn}
                  onClick={() => setVal('')}
                >
                  <Mui.Typography className={css.selectBtnText}>
                    Add Custom
                  </Mui.Typography>
                </Mui.Button>
                <Mui.Button
                  variant="outlined"
                  className={css.selectBtn}
                  onClick={() => setVal('1000')}
                >
                  <Mui.Typography className={css.selectBtnText}>
                    Add Rs.1,000
                  </Mui.Typography>
                </Mui.Button>
                <Mui.Button
                  variant="outlined"
                  className={css.selectBtn}
                  onClick={() => setVal('5000')}
                >
                  <Mui.Typography className={css.selectBtnText}>
                    Add Rs.5,000
                  </Mui.Typography>
                </Mui.Button>
              </Mui.Stack>
              <Mui.Stack direction="row" spacing={1}>
                <Mui.Button
                  variant="outlined"
                  className={css.selectBtn}
                  onClick={() => setVal('10000')}
                >
                  <Mui.Typography className={css.selectBtnText}>
                    Add Rs.10,000
                  </Mui.Typography>
                </Mui.Button>
                <Mui.Button
                  variant="outlined"
                  className={css.selectBtn}
                  onClick={() => setVal('100000')}
                >
                  <Mui.Typography className={css.selectBtnText}>
                    Add Rs.1,00,000
                  </Mui.Typography>
                </Mui.Button>
              </Mui.Stack>
              <Mui.Button
                variant="outlined"
                className={css.proceedBtn}
                onClick={proceed}
              >
                <Mui.Typography className={css.proceedBtnText}>
                  proceed
                </Mui.Typography>
              </Mui.Button>
            </Mui.Stack>
          </StyledDrawer>

          <StyledDrawer
            anchor="bottom"
            open={successDrawer}
            onClose={() => setSuccessDrawer(false)}
          >
            <Mui.Stack className={css.drawerStack} spacing={2}>
              <Puller />
              <Mui.Typography className={css.heading}>
                Effortless Virtual Account has been Loaded
              </Mui.Typography>
              <img src={tick} alt="tick" />
              <Mui.Typography>Your Balance is Rs. {val}</Mui.Typography>
              <Mui.Button
                variant="outlined"
                className={css.proceedBtn}
                onClick={() => {
                  setSuccessDrawer(false);
                }}
              >
                <Mui.Typography className={css.proceedBtnText}>
                  return
                </Mui.Typography>
              </Mui.Button>
            </Mui.Stack>
          </StyledDrawer>
        </Mui.Grid>
      </Mui.Grid>
      <Mui.Modal open={toggleModal} onClose={handleClose}>
        <div id="Fastlink-container" />
      </Mui.Modal>
    </>
  );
};
export default BankList;
