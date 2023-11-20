import React from 'react';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import { useTheme } from '@mui/material/styles';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as Mui from '@mui/material';
import {
  VerificationCodeInput,
  VCODE_LENGTH,
} from '@core/LoginContainer/VerificationCodeContainer.jsx';
import * as Router from 'react-router-dom';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import * as css from './VerifyMem.scss';
import flowerLogo from '../../assets/WebLogo.png';
import flowerMobileLogo from '../../assets/MobileLogo.png';

import login from '../../assets/loginScreen.svg';

const VerifyMember = ({ company_name, mobile_number, email }) => {
  const { signIn, enableLoading, openSnackBar } = React.useContext(AppContext);
  const navigate = Router.useNavigate();
  const [otpSent, setOtpSent] = React.useState({
    sent: false,
  });
  const [valueOTP, setValueOTP] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  const onOtpComplete = (val) => {
    setValueOTP(val);
  };

  const sendOTP = () => {
    RestApi('sessions/send_otp', {
      method: METHOD.POST,
      payload: {
        user_ref: email,
      },
    })
      .then((res) => {
        if (res && !res.error && res?.message === 'OTP sent successfully') {
          enableLoading(false);
          setOtpSent({ sent: true });
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.INFO,
          });
        } else {
          openSnackBar({
            message: res.message || res.error || 'Unknown error Occured, Sorry',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((error) => {
        enableLoading(false);
        throw new Error(error);
      });
  };

  const validateFunction = (sessionRes) => {
    enableLoading(true);
    RestApi(`organizations`, {
      method: METHOD.GET,
      headers: {
        Authorization: sessionRes?.access_token,
      },
    })
      .then((res) => {
        if (res.error) {
          enableLoading(false);
        } else if (res && !res.error) {
          if (res?.data?.length > 0) {
            navigate('/', { state: { verified: res, sessionRes } });
            enableLoading(false);
          } else if (res?.message) {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.WARNING,
            });
            // navigate('/');
          } else {
            navigate('/fill-org-details', {
              state: {
                activeToken: sessionRes?.access_token,
                userInfo: sessionRes?.user,
              },
            });
          }
          enableLoading(false);
        }
      })
      .catch((e) => {
        if (e?.message) {
          openSnackBar({
            message: e.message,
            type: MESSAGE_TYPE.ERROR,
          });
        }
      });
  };

  const validateOTP = () => {
    RestApi('sessions/validate_otp', {
      method: METHOD.POST,
      payload: {
        user_ref: email,
        otp: valueOTP,
      },
    })
      .then((res) => {
        if (res) {
          enableLoading(false);
          if (res.message) {
            setErrorMessage(res.message);
            return;
          }
          if (res?.user && res?.access_token) {
            signIn({
              userId: res.user && res.user.user_id,
              email: res.user && res.user.email,
            });
            validateFunction(res);
          }
        } else {
          setErrorMessage('Something went wrong');
        }
      })
      .catch((error) => {
        enableLoading(false);
        throw new Error(error);
      });
  };

  return (
    <div className={css.loginContainerDesktop}>
      <Mui.Stack direction="row" style={{ margin: '1rem 0rem' }}>
        <img
          src={flowerMobileLogo}
          alt="flowerLogo"
          style={{ width: '200px', marginLeft: '-8px', marginBottom: '31px' }}
        />
        {/* <img src={fontLogo} alt="fontLogo" /> */}
        {/* <Mui.Typography className={css.fontlogo}>effortless</Mui.Typography> */}
      </Mui.Stack>

      <div className={css.signInContainer}>
        <p className={css.joinHeader}>Join {company_name || '-'} Workspace</p>
        <p className={css.pTag}>
          Click this button to receive an OTP . Enter the OTP correctly to
          become a part of {company_name} Workspace on Effortless.
        </p>
        <div className={css.phoneSubmit}>
          <p className={css.phoneFiled}>+91 {mobile_number || '----------'}</p>

          {otpSent?.sent && (
            <VerificationCodeInput
              length={VCODE_LENGTH}
              onChange={onOtpComplete}
            />
          )}

          {errorMessage && (
            <div className={css.errorContainer}>
              <InfoOutlinedIcon fontSize="small" />{' '}
              <span className={css.errorText}>{errorMessage}</span>
            </div>
          )}

          {!otpSent?.sent && (
            <div style={{ marginTop: 10 }}>
              <Mui.Button
                variant="contained"
                className={css.submitButton}
                fullWidth
                onClick={() => sendOTP()}
              >
                Send OTP
              </Mui.Button>
            </div>
          )}

          {otpSent?.sent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <Mui.Button
                variant="contained"
                className={css.submitButton}
                fullWidth
                onClick={() => {
                  if (valueOTP?.length === 6) {
                    setErrorMessage('');
                    validateOTP();
                  } else {
                    setErrorMessage('Please fill in valid input');
                  }
                }}
              >
                Submit
              </Mui.Button>{' '}
              <div onClick={() => sendOTP()}>
                <p className={css.resend}>Resend OTP</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VerifyExsistMember = ({ mobile_number }) => {
  const onOtpComplete = (val) => {
    console.log(val);
    // setValue((prev) => ({ ...prev, OTP: val }));
  };

  return (
    <div className={css.loginContainerDesktop}>
      <Mui.Stack direction="row" style={{ margin: '1rem 0rem' }}>
        <img src={flowerLogo} alt="flowerLogo" style={{ width: '250px' }} />
        {/* <img src={fontLogo} alt="fontLogo" /> */}
        <Mui.Typography className={css.fontlogo}>effortless</Mui.Typography>
      </Mui.Stack>

      <div className={css.signInContainer}>
        <p className={css.joinHeader}>Verification Code</p>
        <p className={css.pTag}>
          We have sent a Verification Code to your Mobile Number
        </p>

        <div className={css.phoneSubmit}>
          <p className={css.phoneFiled}>+91 {mobile_number}</p>

          <VerificationCodeInput
            length={VCODE_LENGTH}
            onChange={onOtpComplete}
          />

          <div style={{ marginTop: 10 }}>
            <Mui.Button
              variant="contained"
              className={css.submitButton}
              fullWidth
              // onClick={() => }
            >
              Submit
            </Mui.Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VerifyMemberRes = () => {
  const themes = useTheme();
  const Mobile = useMediaQuery(themes.breakpoints.down('md'));
  // eslint-disable-next-line no-unused-vars
  const [exsistMember, setExsisMember] = React.useState(false);
  const navigate = Router.useNavigate();

  const company_name = new URLSearchParams(window.location.search).get(
    'company_name',
  );
  const mobile_number = new URLSearchParams(window.location.search).get(
    'mobile_number',
  );
  const email = new URLSearchParams(window.location.search).get('email');

  React.useEffect(() => {
    if (!mobile_number || !email) {
      navigate('/');
    }
  }, [mobile_number, email]);

  return Mobile ? (
    <>
      <div className={css.loginContainer}>
        {/* <div className={css.introHeaderContainer}>
      <span className={css.appName}>Effortless</span>
    </div> */}
        {/* <Mui.Stack direction="row">
          <img src={flowerLogo} alt="flowerLogo" style={{ width: '14%' }} />
          <Mui.Typography className={css.fontlogo}>
            effortless
          </Mui.Typography>
        </Mui.Stack> */}
        <div className={css.signInContainer}>
          {exsistMember ? (
            <VerifyExsistMember
              company_name={company_name}
              mobile_number={mobile_number}
              email={email}
            />
          ) : (
            <VerifyMember
              company_name={company_name}
              mobile_number={mobile_number}
              email={email}
            />
          )}
        </div>
      </div>
    </>
  ) : (
    <Mui.Grid container className={css.memberReg}>
      <Mui.Grid item lg={6} md={6} className={css.forgotImageContainer}>
        <Mui.Stack className={css.imageStack}>
          <img src={login} alt="img" className={css.imageStyle} />
        </Mui.Stack>
      </Mui.Grid>
      <Mui.Grid item lg={6} md={6}>
        {exsistMember ? (
          <VerifyExsistMember
            company_name={company_name}
            mobile_number={mobile_number}
            email={email}
          />
        ) : (
          <VerifyMember
            company_name={company_name}
            mobile_number={mobile_number}
            email={email}
          />
        )}
      </Mui.Grid>
    </Mui.Grid>
  );
};

export default VerifyMemberRes;
