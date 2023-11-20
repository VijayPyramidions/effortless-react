/* @flow */
/**
 * @fileoverview Verification Code container
 */

import React, { useState, useContext, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';

import InputBase from '@material-ui/core/InputBase';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import * as Router from 'react-router-dom';

import * as Mui from '@mui/material';
import * as css from './SignInContainer.scss';
import login from '../../assets/loginScreen.svg';
import flowerLogo from '../../assets/WebLogo.png';

export const VCODE_LENGTH = 6;

export const VerificationCodeInput = ({
  paymentPage,
  length,
  onChange,
  dataCode,
}) => {
  const [codes, setCodes] = useState(new Array(length).fill(''));
  const inputRefs = [];

  const isKDelete = (k) => k === 8 || k === 46; // Backspace or Delete
  useEffect(() => {
    inputRefs?.[0]?.focus();
  }, []);

  useEffect(() => {
    onChange(codes.join(''));
  }, [codes]);

  const onKeyDown = (e, i) => {
    if (!codes[i] && isKDelete(e.which)) {
      inputRefs[i - 1]?.focus();
      e.stopPropagation();
    }
  };

  const handleFocus = (i) => {
    inputRefs[i]?.select();
  };

  const onPaste = (e) => {
    const isString = typeof e === 'string';
    const paste = isString ? e : e?.clipboardData?.getData('text/plain');
    const filterCode = paste.replace(/[^0-9]/g, '');
    const clipped = filterCode?.substr(0, length);
    const codeArr = clipped.split('');
    codeArr.length = length;
    codeArr.fill('', clipped.length);
    setCodes(codeArr);
    handleFocus(length - 1);
  };

  useEffect(() => {
    if (dataCode?.length === 4) {
      onPaste(dataCode);
      // handleFocus(dataCode?.length - 1);
    }
  }, [dataCode]);

  const onVCodeUpdate = (e, idx) => {
    const { value } = e.target;
    if (value.length > 1 && idx === 0) {
      onPaste(value);
      return;
    }
    if (value.length === 1 || value === '') {
      setCodes((c) => {
        const cc = [...c];
        cc[idx] = value;
        return cc;
      });
    }
    if (idx < length && value.length === 1) {
      inputRefs[idx + 1]?.focus();
    }
  };

  return (
    <div
      className={css.verificationInputs}
      style={{
        gap: length === 4 ? '4px' : '12px',
        justifyContent: length === 4 ? 'center' : 'space-around',
      }}
    >
      {codes &&
        codes.map((v, idx) => (
          <InputBase
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            type="number"
            className={`${css.vCodeInput} ${
              paymentPage ? css.paymentScreen : ''
            }`}
            onChange={(e) => {
              onVCodeUpdate(e, idx);
            }}
            inputProps={{ onPaste }}
            value={v}
            onFocus={() => handleFocus(idx)}
            onKeyDown={(e) => onKeyDown(e, idx)}
            inputRef={(i) => {
              inputRefs[idx] = i;
            }}
          />
        ))}
    </div>
  );
};

export const IntroHeader = () => (
  <div className={css.introHeaderContainer}>
    <span className={css.appName}>Effortless</span>
    <span className={css.appDescription}>Verification Code</span>
  </div>
);

const VerificationCodeContainer = () => {
  const { user, changeView, enableLoading, openSnackBar } =
    useContext(AppContext);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = Router.useNavigate();
  const { state } = Router.useLocation();
  const backPayload = state?.payload;

  React.useEffect(() => {
    if (!user?.phoneNo) {
      navigate('/signup');
    }
  }, []);

  const onVcodeComplete = (val) => {
    setVerificationCode(val);
  };

  const resendOtp = () => {
    const url =
      backPayload?.type === 'registration'
        ? 'registrations/send_otp'
        : 'sessions/send_otp';
    const payload =
      backPayload?.type === 'registration'
        ? {
            user_ref: user.email,
          }
        : {
            user_ref: user.phoneNo,
          };
    RestApi(url, {
      method: METHOD.POST,
      payload,
    })
      .then((res) => {
        if (res && !res.error) {
          enableLoading(false);
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.INFO,
          });
        } else if (res.error) {
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

  const onChangeNumber = () => {
    // changeView('signUp');
    navigate('/signup', { state: { backPayload } });
  };

  const onValidateOtp = () => {
    enableLoading(true);
    RestApi('registrations/validate_otp', {
      method: METHOD.POST,
      payload: {
        user_ref: user.email,
        otp: verificationCode,
      },
    })
      .then((res) => {
        if (res) {
          if (!res.user) {
            setErrorMessage('Invalid OTP');
            enableLoading(false);
            return;
          }
          // setSessionToken({ activeToken: res.access_token });
          // setUserInfo({ userInfo: res.user });
          changeView('fillOrgDetails');
          navigate('/fill-org-details', {
            state: { activeToken: res.access_token, userInfo: res.user },
          });
        }
        enableLoading(false);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const onValidateOtpWithGoogle = () => {
    enableLoading(true);
    RestApi('sessions/validate_otp', {
      method: METHOD.POST,
      payload: {
        id: backPayload?.id,
        otp: verificationCode,
      },
    })
      .then((res) => {
        if (res) {
          enableLoading(false);
          if (!res.error) {
            navigate('/fill-org-details', {
              state: { activeToken: res.access_token, userInfo: res.user },
            });
            return;
          }
          setErrorMessage(res?.message);
        }
        enableLoading(false);
      })
      .catch((error) => {
        enableLoading(false);
        throw new Error(error);
      });
  };

  const theme = Mui.useTheme();
  const BigScreen = Mui.useMediaQuery(theme.breakpoints.up('sm'));
  return (
    <>
      {BigScreen ? (
        <>
          <Mui.Grid container>
            <Mui.Grid md={6} className={css.loginImageContainer}>
              <Mui.Stack className={css.imageStack}>
                <img src={login} alt="img" className={css.imageStyle} />
              </Mui.Stack>
            </Mui.Grid>
            <Mui.Grid md={6} xs={12}>
              <Mui.Stack className={css.loginFormContainer}>
                <Mui.Stack direction="row" mt={4}>
                  <img
                    src={flowerLogo}
                    alt="flowerLogo"
                    style={{ width: '250px', marginLeft: '-1px' }}
                  />
                  {/* <img src={fontLogo} alt="fontLogo" /> */}
                  {/* <Mui.Typography className={css.fontlogo}>
                    effortless
                  </Mui.Typography> */}
                </Mui.Stack>

                <Mui.Stack style={{ marginTop: '3rem' }}>
                  <Mui.Typography className={css.loginFont}>
                    Verification Code
                  </Mui.Typography>
                  <Mui.Typography className={css.loginSubFont}>
                    We have sent a Verification Code to your Mobile Number
                  </Mui.Typography>
                </Mui.Stack>

                <div className={css.numberContainerDesktop}>
                  <div className={css.numberRow}>
                    <span className={css.userNumber}>+91 {user.phoneNo}</span>
                    <span
                      className={css.changeNumber}
                      onClick={onChangeNumber}
                      role="button"
                    >
                      Change
                    </span>
                  </div>
                  <VerificationCodeInput
                    length={VCODE_LENGTH}
                    onChange={onVcodeComplete}
                  />

                  {errorMessage && (
                    <div
                      className={css.errorContainer}
                      style={{ margin: '25px 0' }}
                    >
                      <InfoOutlinedIcon fontSize="small" />{' '}
                      <span className={css.errorText}>{errorMessage}</span>
                    </div>
                  )}
                </div>

                <span className={css.resendOtpTxt} onClick={resendOtp}>
                  Resend OTP
                </span>

                {verificationCode.length === VCODE_LENGTH && (
                  <Mui.Stack
                    direction="row"
                    spacing={2}
                    className={css.marginT}
                  >
                    <Button
                      variant="contained"
                      className={css.submitBtn}
                      fullWidth
                      onClick={() => {
                        if (backPayload?.provider?.googleSignUp) {
                          onValidateOtpWithGoogle();
                        } else {
                          onValidateOtp();
                        }
                      }}
                    >
                      <Mui.Typography className={css.loginBtnText}>
                        Submit
                      </Mui.Typography>
                    </Button>
                  </Mui.Stack>
                )}
              </Mui.Stack>
            </Mui.Grid>
          </Mui.Grid>
        </>
      ) : (
        <div className={css.loginContainer}>
          <IntroHeader />
          <div className={css.signInContainer}>
            <span className={css.titleInfo}>
              We have sent a Verification Code to
              <br />
              your Mobile Number
            </span>

            <div className={css.numberContainer}>
              <div className={css.numberRow}>
                <span className={css.userNumber}>+91 {user?.phoneNo}</span>
                <span
                  className={css.changeNumber}
                  onClick={onChangeNumber}
                  role="button"
                >
                  Change
                </span>
              </div>
              <VerificationCodeInput
                length={VCODE_LENGTH}
                onChange={onVcodeComplete}
              />

              {errorMessage && (
                <div className={css.errorContainer}>
                  <InfoOutlinedIcon fontSize="small" />{' '}
                  <span className={css.errorText}>{errorMessage}</span>
                </div>
              )}
            </div>

            <div className={css.resendOtpContainer}>
              <span className={css.resendOtpTxt} onClick={resendOtp}>
                Resend OTP
              </span>
            </div>

            <Button
              variant="contained"
              className={css.submitButton}
              fullWidth
              onClick={() => {
                if (backPayload?.provider?.googleSignUp) {
                  onValidateOtpWithGoogle();
                } else {
                  onValidateOtp();
                }
              }}
              disabled={verificationCode.length !== VCODE_LENGTH}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default VerificationCodeContainer;
