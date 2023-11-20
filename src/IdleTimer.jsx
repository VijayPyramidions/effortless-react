import { useEffect, useContext } from 'react';
import RestApi, { METHOD } from '@services/RestApi.jsx';
// import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import JSBridge from '@nativeBridge/jsbridge';
import AppContext from '@root/AppContext.jsx';
import { googleLogout } from '@react-oauth/google';

const IdleTimer = ({ timeout }) => {
  let timeoutTracker;
  let interval;
  const {
    toggleSidePanel,
    // setUserInfo,
    // setSessionToken,
    // user,
    // enableLoading
  } = useContext(AppContext);

  const updateExpiredTime = () => {
    if (timeoutTracker) {
      clearTimeout(timeoutTracker);
    }
    timeoutTracker = setTimeout(() => {
      localStorage.setItem('_expiredTime', Date.now() + timeout * 1000);
    }, 300);
  };

  function tracker() {
    window.addEventListener('mousemove', updateExpiredTime);
    window.addEventListener('scroll', updateExpiredTime);
    window.addEventListener('keydown', updateExpiredTime);
  }

  function cleanUp() {
    localStorage.removeItem('_expiredTime');
    clearInterval(interval);
    window.removeEventListener('mousemove', updateExpiredTime);
    window.removeEventListener('scroll', updateExpiredTime);
    window.removeEventListener('keydown', updateExpiredTime);
  }

  const LogoutFunction = async (tokenData) => {
    await RestApi(`sessions/logout`, {
      method: METHOD.DELETE,
      headers: {
        Authorization: `Bearer ${tokenData}`,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          // setUserInfo({ userInfo: null });
          // setSessionToken({ activeToken: null });
          localStorage.removeItem('session_token');
        } else if (res.error) {
          // openSnackBar({
          //   message: res?.error || res?.message || 'Something Went Wrong',
          //   type: MESSAGE_TYPE.INFO,
          // });
          console.log('timeout');
          localStorage.removeItem('session_token');
        }
        // enableLoading(false);
      })
      .catch((e) => {
        // openSnackBar({
        //   message: e?.message || "Timeout",
        //   type: MESSAGE_TYPE.ERROR,
        // });
        localStorage.removeItem('session_token');
        console.log('timeout', e);
        // enableLoading(false);
      });
  };

  const onTimeout = async () => {
    // addOrgId({ orgId: null });
    JSBridge.logoutNative();
    googleLogout();
    toggleSidePanel();
    await localStorage.removeItem('user_info');
    await localStorage.removeItem('current_user_info');
    // await localStorage.removeItem('session_token');
    await localStorage.removeItem('selected_organization');
    await localStorage.removeItem('PageWithParams');
    // changeView('signIn');
    // changeSubView('');
    await LogoutFunction(localStorage.getItem('session_token'));

    console.log('timeout');
    // localStorage.removeItem('user_info');
    // localStorage.removeItem('current_user_info');
    // localStorage.removeItem('session_token');
    // localStorage.removeItem('selected_organization');
    window.history.pushState('', 'Effortless', '/');
    window.location.reload();
  };

  const onExpired = async () => {
    // addOrgId({ orgId: null });
    JSBridge.logoutNative();
    googleLogout();
    toggleSidePanel();
    await localStorage.removeItem('user_info');
    await localStorage.removeItem('current_user_info');
    await localStorage.removeItem('session_token');
    await localStorage.removeItem('selected_organization');
    // changeView('signIn');
    // changeSubView('');
    await LogoutFunction();

    console.log('expired');
    // localStorage.removeItem('user_info');
    // localStorage.removeItem('current_user_info');
    // localStorage.removeItem('session_token');
    // localStorage.removeItem('selected_organization');
    window.history.pushState('', 'Effortless', '/');
  };

  const startInterval = () => {
    updateExpiredTime();

    interval = setInterval(() => {
      const expiredTime = parseInt(
        localStorage.getItem('_expiredTime') || 0,
        10,
      );
      if (expiredTime < Date.now()) {
        if (onTimeout) {
          onTimeout();
          cleanUp();
        }
      }
    }, 1000);
  };

  useEffect(() => {
    const expiredTime = parseInt(localStorage.getItem('_expiredTime') || 0, 10);

    tracker();
    startInterval();
    if (expiredTime > 0 && expiredTime < Date.now()) {
      onExpired();
    }
  }, []);
};

export default IdleTimer;
