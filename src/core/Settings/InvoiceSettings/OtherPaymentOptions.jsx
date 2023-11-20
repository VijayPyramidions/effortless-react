import React from 'react';
import * as Router from 'react-router-dom';
import * as Mui from '@mui/material';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { Divider } from '@material-ui/core';
import ToggleSwitch from '@components/ToggleSwitch/ToggleSwitch';
import AppContext from '@root/AppContext.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import RefreshIcon from '@mui/icons-material/Refresh';
import { otherPaymentOptionsCard } from '../SettingsImages';
import * as css from './InvoiceSettings.scss';

const btnCssOutContained = {
  background: '#F08B32',
  color: '#FFF',
  padding: '8px 15px',
  marginBottom: '15px',
  borderRadius: 15,
};
const btnCssOutOutlined = {
  marginBottom: '15px',
  background: '#fff',
  padding: '8px 15px',
  color: '#F08B32',
  border: '1px solid #F08B32',
  borderRadius: 15,
};

function OtherPaymentOptions() {
  const {
    organization,
    enableLoading,
    user,
    // openSnackBar,
    userPermissions
  } = React.useContext(AppContext);
  const device = localStorage.getItem('device_detect');
  // const toggleSwitch = () => {};
  const [toggleModal, setToggleModal] = React.useState(false);
  const navigate = Router.useNavigate();
  const [valToggleSwitch, setValToggleSwitch] = React.useState({
    payViaRazorPay: false,
  });
  const [fetchData, setFetchData] = React.useState({});
  const [refresh, setRefresh] = React.useState({ click: true });

  const [userRoles, setUserRoles] = React.useState({});
  const [havePermission, setHavePermission] = React.useState({ open: false });

  const uploadNavigatePerm = (route, stateParam) => { 
    setHavePermission({
      open: true,
      back: () => {
        setHavePermission({ open: false });
        if (stateParam) {
          navigate(route, stateParam);
        } else if(route) {
          navigate(route || '/settings');
        }
      },
    });
  }; 

  React.useEffect(() => {
      if (Object.keys(userPermissions?.Settings || {})?.length > 0) {
        if (!userPermissions?.Settings?.Settings) {
          uploadNavigatePerm('/settings');
        }
        setUserRoles({ ...userPermissions?.Settings });
      }
  }, [userPermissions]);

  React.useEffect(() => {
    if (Object.keys(userRoles?.['Razorpay Setup'] || {})?.length > 0 && !userRoles?.['Razorpay Setup']?.view_razorpay_submerchant) {
          uploadNavigatePerm('/settings');
    }
}, [userRoles?.['Razorpay Setup']]);

  const RefreshStatus = () => {
    setRefresh({ click: false });
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/razorpay/submerchant_onboarding/fetch_status`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        console.log(res);
        setRefresh({ click: true });
        enableLoading(false);
      })
      .catch((e) => {
        console.log(e);
        enableLoading(false);
        setRefresh({ click: true });
      });
  };

  const fetchStatus = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/razorpay/submerchants`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        setFetchData(res);
        enableLoading(false);
      })
      .catch((e) => {
        console.log(e);
        enableLoading(false);
      });
  };

  const card1 = [
    {
      id: 1,
      lable: 'Pay via RazorPay',
      font: fetchData?.account_status,
      icon: otherPaymentOptionsCard?.payViaRazorPay,
      isActive: valToggleSwitch?.payViaRazorPay,
    },
    // {
    //   id: 2,
    //   lable: 'Pay via QR Code',
    //   font: 'Get 25% cashback on using razorpay',
    //   icon: otherPaymentOptionsCard.payViaQrCode,
    //   isActive: false,
    // },
    // {
    //   id: 3,
    //   lable: 'Pay via UPI',
    //   font: 'Get 25% cashback on using razorpay',
    //   icon: otherPaymentOptionsCard.payViaUPI,
    //   isActive: false,
    // },
  ];

  console.log(card1, fetchData);

  // React.useEffect(() => {
  //   setTimeout(() => { setValToggleSwitch((prev) => ({...prev,  payViaRazorPay: true })); }, [3000]);
  //  }, []);

  React.useEffect(() => {
    fetchStatus();
  }, []);

  const handleClose = () => {
    setToggleModal(false);
    setValToggleSwitch((prev) => ({ ...prev, payViaRazorPay: false }));
  };

  const clickHandler = () => {
    // if (merchantType === 'new-merchant') {
    //   return () =>
    // navigate('/settings-razorpay-newCustomer');
    // }
    // // existinge merchant
    // return () =>
    //   navigate('/settings-razorpay-existingCustomer', {
    //     state: { merchantType: 'existing' },
    //   });
    if (fetchData?.account_status === 'not_yet_created') {
      if (!userRoles?.['Razorpay Setup']?.edit_razorpay_submerchant) {
        uploadNavigatePerm();
        return;
  }
      navigate('/settings-razorpay-newCustomer', {
        state: { response: fetchData },
      });
    } else {
      if (!userRoles?.['Razorpay Setup']?.create_razorpay_submerchant) {
        uploadNavigatePerm();
        return;
  }
      navigate('/settings-razorpay-newCustomer');
    }
  };

  const ToggleCard = ({ item, length }) => {
    return (
      <>
        <div className={css.ToggleCardContainer}>
          <div className={css.iconWrapper}>
            <img className={css.icon} src={item.icon} alt={item.lable} />
          </div>

          <div className={css.lable}>{item.lable}</div>
          <ToggleSwitch
            checked={item.isActive}
            onChange={() => {
              if (!item.isActive) {
                setValToggleSwitch((prev) => ({
                  ...prev,
                  payViaRazorPay: true,
                }));
                setToggleModal(true);
              }
            }}
          />
        </div>
        {length !== item.id && (
          <div className={css.divider}>
            <Divider />
          </div>
        )}
      </>
    );
  };
  return device === 'desktop' ? (
    <>
      <Mui.Stack direction="row" spacing={2} style={{ marginTop: '5rem' }}>
        {card1.map((item) => {
          return (
            <Mui.Stack direction="row" className={css.cardDesktop}>
              <Mui.Stack direction="row" spacing={2} alignItems="center">
                <Mui.Avatar className={css.avatar}>
                  <img className={css.icon} src={item.icon} alt={item.lable} />
                </Mui.Avatar>
                <Mui.Stack style={{ width: '12vw' }}>
                  <Mui.Typography className={css.cardLabel}>
                    {item.lable}
                  </Mui.Typography>
                  <Mui.Typography className={css.cardFont}>
                    Status: {item.font}
                  </Mui.Typography>
                </Mui.Stack>
              </Mui.Stack>
              <Mui.Stack
                alignItems="center"
                justifyContent="center"
                height="100%"
                sx={{ position: 'relative' }}
              >
                {fetchData?.account_status === 'not_yet_created' && (
                  <RefreshIcon
                    onClick={() => {
                      if (refresh.click) {
                        RefreshStatus();
                      }
                    }}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      color: '#f08b32',
                      cursor: 'pointer',
                      transition: '.2s',
                    }}
                    className={!refresh.click && css.rotate}
                  />
                )}
                <ToggleSwitch
                  checked={item.isActive}
                  onChange={() => {
                    if (!item.isActive) {
                      setValToggleSwitch((prev) => ({
                        ...prev,
                        payViaRazorPay: true,
                      }));
                      setToggleModal(true);
                    }
                  }}
                />
              </Mui.Stack>
            </Mui.Stack>
          );
        })}
      </Mui.Stack>
      {/* <Mui.Stack className={css.cardBtnStack}>
        <Mui.Button className={css.cardBtn}>
          <Mui.Typography className={css.cardBtnTxt}>Save</Mui.Typography>
        </Mui.Button>
      </Mui.Stack> */}
      <Mui.Dialog
        open={toggleModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Mui.DialogTitle id="alert-dialog-title">
          Razorpay Verification
        </Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.DialogContentText id="alert-dialog-description">
            Continue to Register Razorpay&#39;s system?
          </Mui.DialogContentText>
        </Mui.DialogContent>
        <Mui.DialogActions>
          <Mui.Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Mui.Box
              sx={{
                width: '380px',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <Mui.Button style={btnCssOutOutlined} onClick={handleClose}>
                Cancel
              </Mui.Button>
              <Mui.Button
                style={btnCssOutContained}
                onClick={() => clickHandler()}
              >
                Continue
              </Mui.Button>
            </Mui.Box>
          </Mui.Box>
        </Mui.DialogActions>
      </Mui.Dialog>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  ) : (
    <div className={css.contactDetailsOnInvoiceContainer}>
      <div className={css.card}>
        {card1.map((item) => {
          return (
            <div key={item.id}>
              <ToggleCard item={item} length={card1.length} />
            </div>
          );
        })}
        </div>
        {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </div>
  );
}

export default OtherPaymentOptions;
