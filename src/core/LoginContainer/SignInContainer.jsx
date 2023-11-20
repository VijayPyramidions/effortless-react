/* @flow */
/**
 * @fileoverview SignIn container
 */

import React, { useState, useContext, useEffect, useRef } from 'react';
import OnBackEventHandle from '@core/OnBackEventHandle';
import ReactRecaptcha3 from 'react-google-recaptcha3';
import ReactRecaptcha from 'react-google-recaptcha';
import JSBridge from '@nativeBridge/jsbridge';
import AppleIcon from '@material-ui/icons/Apple';
import SmsIcon from '@material-ui/icons/Sms';
import * as Mui from '@mui/material';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import SvgIcon from '@material-ui/core/SvgIcon';
import Button from '@material-ui/core/Button';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import {
  VerificationCodeInput,
  VCODE_LENGTH,
} from '@core/LoginContainer/VerificationCodeContainer.jsx';

import {
  validateEmail,
  validatePhone,
  validatePassword,
} from '@services/Validation.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import {
  useMediaQuery,
  makeStyles,
  withStyles,
  InputAdornment,
} from '@material-ui/core';
import AppContext from '@root/AppContext.jsx';
import Input from '@components/Input/Input.jsx';
import Grid from '@material-ui/core/Grid';
import { useGoogleLogin } from '@react-oauth/google';
// import ForgetPasswordContainer from '@core/LoginContainer/ForgotPasswordContainer.jsx';
import * as theme1 from '@root/theme.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import * as css from './SignInContainer.scss';
import login from '../../assets/loginScreen.svg';
import flowerLogo from '../../assets/WebLogo.png';
import flowerMobileLogo from '../../assets/MobileLogo.png';
// import googlelogo from '../../assets/googlelogo.svg';
import appstorebatch from '../../assets/appstorebatch.svg';
import googlebatch from '../../assets/googlebatch.svg';
import ellipse from '../../assets/Ellipse 6.svg';
import CustomCheckbox from '../../components/Checkbox/Checkbox';

const GoogleSvgIcon = () => (
  <SvgIcon viewBox="0 0 24 24">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path
        fill="#4285F4"
        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
      />
      <path
        fill="#34A853"
        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
      />
      <path
        fill="#FBBC05"
        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
      />
      <path
        fill="#EA4335"
        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
      />
    </g>
  </SvgIcon>
);

export const IntroHeader = ({
  enableOtpLogin = false,
  onAuthClick,
  toggleStaging,
  hide,
  view,
}) => (
  <div className={css.introHeaderContainer}>
    <Mui.Stack direction="row" onClick={toggleStaging}>
      <img
        src={flowerMobileLogo}
        alt="flowerLogo"
        style={{ width: '200px', marginLeft: '-8px', marginBottom: '10px' }}
      />
      {/* <Mui.Typography className={css.fontlogo}>effortless</Mui.Typography> */}
    </Mui.Stack>
    <span className={css.appDescription}>
      The Finance OS <br /> for your Business
    </span>
    {!hide && (
      <div className={css.oAuthContainer}>
        <div
          onClick={() => {
            onAuthClick('google');
          }}
          aria-hidden="true"
        >
          <span className={css.icons}>
            <GoogleSvgIcon />
          </span>
        </div>

        {window.getOS() === 'ios' && (
          <span className={css.icons}>
            <AppleIcon
              style={{ fontSize: '2rem', paddingBottom: '2px' }}
              onClick={() => {
                onAuthClick('apple');
              }}
            />
          </span>
        )}

        {!enableOtpLogin && view !== 'signUp' && (
          <span className={css.icons}>
            <SmsIcon
              style={{ fontSize: '2rem', paddingTop: '2px' }}
              onClick={() => {
                onAuthClick('mobile');
              }}
            />
          </span>
        )}
        {enableOtpLogin && (
          <span className={css.icons}>
            <EmailOutlinedIcon
              style={{ fontSize: '2rem', paddingTop: '2px' }}
              onClick={() => {
                onAuthClick('sigin');
              }}
            />
          </span>
        )}
      </div>
    )}
  </div>
);

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiInputAdornment-root .MuiButtonBase-root': {
      marginRight: '4px !important',
      color: theme1.colorGray,
    },
    '& .MuiAutocomplete-endAdornment .MuiAutocomplete-popupIndicator': {
      color: '#fff',
    },
  },
  searchIcon: {
    position: 'absolute',
    borderLeftColor: '3%',
  },
  input: {
    '& > label': {
      paddingLeft: '1.5em !important',
    },
    '& > div > input': {
      paddingLeft: '1.4em !important',
      color: 'white !important',
    },
  },
  noOptions: {
    color: 'white',
  },
}));

const CustomTextField = withStyles({
  root: {
    '& label': {
      color: '#ffffff7f',
      opacity: 0.8,
      fontWeight: 400,
      fontSize: '12px',
    },
    '& .MuiTextField-root': {
      borderBottomColor: 'white',
    },
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline': {
      borderBottomColor: '#ffffff35',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ffffff7f',
      },
      '&:hover fieldset': {
        borderColor: '#f08b32c5',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#F08B32',
      },
    },
  },
})(Mui.TextField);

const V3_SITE_KEY = '6Lesc6MlAAAAAB232eybQfqNitNc-bYepQ2SICpa';
const V2_SITE_KEY = '6LeYZKYlAAAAAI3Us1kAXeIn05nhe9w6yWDxY1kQ';

const SignInContainer = () => {
  const {
    signIn,
    changeView,
    // loading,
    enableLoading,
    setSessionToken,
    setUserInfo,
    // validateSession,
    getCurrentUser,
    registerEventListeners,
    deRegisterEventListener,
    checkNotification,
    organization,
    openSnackBar,
    addOrgId,
    addOrgName,
  } = useContext(AppContext);
  const theme = Mui.useTheme();
  const desktopView = useMediaQuery(theme.breakpoints.up('sm'));
  const captchaRef = useRef(null);
  const classes = useStyles();
  const emailUserName = useRef(null);
  const emailPassword = useRef(null);
  const [captchaToken, setCaptchaToken] = useState();
  const [captchaStatus, setCaptchaStatus] = useState();
  const [v3Recaptcha, setV3Recaptcha] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [phoneNo, setPhoneNo] = useState('');
  const [otp, setOtp] = useState('');
  const [selectCompany, setSelectCompany] = useState(false);
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [organizationList, setOrganizationList] = useState([]);
  const [sessionResponse, setSessionResponse] = useState();
  const [organizationResponse, setOrganizationResponse] = useState();
  const [organizationSelect, setOrganizationSelect] = useState({
    orgId: '',
    orgName: '',
    shortName: '',
  });
  const [validationErr, setValidationErr] = useState({
    email: false,
    password: false,
    phone: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [count, setCount] = useState(0);
  const [enableLoginWithOtp, setEnableLoginWithOtp] = useState('sigin');
  const [EmailSelection, setEmailSelection] = React.useState({
    email: '',
    emailList: [],
    selected: {},
    selectedEmailId: '',
    emailOtp: '',
    twoFactorId: '',
    twoFactorOtp: '',
  });
  const navigate = useNavigate();
  const { state } = useLocation();
  const PageNavigateData = JSON.parse(localStorage.getItem('PageWithParams'));
  const clearErrorMessage = () => {
    setErrorMessage('');
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  React.useEffect(() => {
    if (organizationList.length > 0) {
      setSelectCompany(true);
    }
  }, [organizationList]);

  const ResetEmailSelection = () => {
    setEmailSelection({
      email: false,
      emailList: [],
      selected: '',
      selectedEmailId: '',
      emailOtp: '',
      twoFactorId: '',
      twoFactorOtp: '',
    });
  };

  const submitButtonHandler = () => {
    setSessionToken({ activeToken: sessionResponse?.access_token });
    setUserInfo({ userInfo: organizationResponse });
    localStorage.setItem(
      'selected_organization',
      JSON.stringify({
        orgId: organizationSelect?.orgId,
        orgName: organizationSelect?.orgName,
        shortName: organizationSelect?.shortName,
      }),
    );
    addOrgId({ orgId: organizationSelect?.orgId });
    addOrgName({
      orgName: organizationSelect?.orgName,
      shortName: organizationSelect?.shortName,
    });
    JSBridge.sessionInfo();
    if (PageNavigateData?.url) navigate(PageNavigateData?.url);
    else navigate('/dashboard', { state: { from: 'openedNow' } });
  };

  React.useEffect(() => {
    if (captchaStatus === 'success' && desktopView) {
      //   ReactRecaptcha3.getToken().then((data)=>{
      //   console.log("token",data);
      //   setCaptchaToken(data);
      // }).catch(e=>{
      //   console.log("token error",e);
      // });

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(V3_SITE_KEY, { action: 'login' })
          .then((token) => {
            setCaptchaToken(token);
          });
      });
    }
  }, [captchaStatus]);

  React.useEffect(() => {
    if (desktopView) {
      ReactRecaptcha3.init(V3_SITE_KEY).then((status) => {
        setCaptchaStatus(status);
      });
    }
  }, [desktopView]);

  React.useEffect(() => {
    if (organizationSelect?.orgId) {
      submitButtonHandler();
    }
  }, [organizationSelect]);

  React.useEffect(() => {
    if (state?.verified) {
      setOrganizationList(state?.verified?.data);
      setOrganizationResponse(state?.verified);
      setSessionResponse(state?.sessionRes);
      enableLoading(false);
    }
  }, [state?.verified]);

  const validateFunction = (token, user) => {
    enableLoading(true);
    RestApi(`organizations`, {
      method: METHOD.GET,
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        if (res.error) {
          console.log(res);
          enableLoading(false);
        } else if (res && !res.error) {
          if (res?.data?.length > 0) {
            setOrganizationList(res.data);
            setOrganizationResponse(res);
            enableLoading(false);
            if (PageNavigateData?.organization_id) {
              const filteredOrgData = res?.data?.filter(
                (ele) => ele.id === PageNavigateData?.organization_id,
              )[0];
              setOrganizationSelect((prev) => ({
                ...prev,
                orgId: filteredOrgData.id,
                orgName: filteredOrgData.name,
                shortName: filteredOrgData?.short_name,
              }));
            }
          } else if (res?.message) {
            openSnackBar({
              message: res.message,
              type: MESSAGE_TYPE.WARNING,
            });
            navigate('/');
          } else {
            navigate('/fill-org-details', {
              state: { activeToken: token, userInfo: user },
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
          navigate('/');
        }
      });
  };

  // const socialLogin = (code, provider) => {
  //   if (code && provider) {
  //     enableLoading(true);
  //     RestApi(`social_login`, {
  //       method: METHOD.POST,
  //       payload: {
  //         code,
  //         provider,
  //         redirect_uri: window.location.origin,
  //       },
  //     })
  //       .then((res) => {
  //         enableLoading(false);
  //         if (res && !res.error) {
  //           if (res.message) {
  //             openSnackBar({
  //               message: res.message,
  //               type: MESSAGE_TYPE.WARNING,
  //             });
  //           } else if (res?.new_user) {
  //             openSnackBar({
  //               message: 'Please sign up to continue',
  //               type: MESSAGE_TYPE.GREETING,
  //             });
  //             setTimeout(() => {
  //               navigate('/signup', {
  //                 state: {
  //                   backPayload: {
  //                     provider: { googleSignUp: true },
  //                     id: res?.id,
  //                   },
  //                 },
  //               });
  //             }, 500);
  //           } else if (res?.user?.user_id) {
  //             ResetEmailSelection();
  //             setSessionResponse(res);
  //             validateFunction(res?.access_token, res?.user);
  //           }
  //         }
  //       })
  //       .catch(() => {
  //         enableLoading(false);
  //       });
  //   }
  // };

  const autoLoginListener = (e) => {
    const accessCodeData = e.detail ? e.detail.code : e.code;
    const accessProvider = e.detail ? e.detail.provider : 'google';
    // socialLogin(accessCodeData, accessProvider);
    if (accessCodeData && accessProvider) {
      enableLoading(true);
      RestApi(`social_login`, {
        method: METHOD.POST,
        payload: {
          code: accessCodeData,
          provider: accessProvider,
          redirect_uri: window.location.origin,
        },
      })
        .then((res) => {
          enableLoading(false);
          if (res && !res.error) {
            if (res.message) {
              openSnackBar({
                message: res.message,
                type: MESSAGE_TYPE.WARNING,
              });
            } else if (res?.new_user) {
              openSnackBar({
                message: 'Please sign up to continue',
                type: MESSAGE_TYPE.GREETING,
              });
              setTimeout(() => {
                navigate('/signup', {
                  state: {
                    backPayload: {
                      provider: { googleSignUp: true },
                      id: res?.id,
                    },
                  },
                });
              }, 500);
            } else if (res?.user?.user_id) {
              // ResetEmailSelection();
              // setSessionResponse(res);
              // validateFunction(res?.access_token, res?.user);
              enableLoading(true);
              RestApi(`organizations`, {
                method: METHOD.GET,
                headers: {
                  Authorization: res?.access_token,
                },
              })
                .then((resVal) => {
                  if (resVal.error) {
                    console.log(resVal);
                    enableLoading(false);
                  } else if (resVal && !resVal.error) {
                    if (resVal?.data?.length > 0) {
                      if (window.location.pathname !== '/') {
                        navigate('/', {
                          state: {
                            verified: resVal,
                            sessionRes: res,
                          },
                        });
                        return;
                      }
                      // setOrganizationList(resVal.data);
                      // setOrganizationResponse(resVal);
                      navigate('/', {
                        state: {
                          verified: resVal,
                          sessionRes: res,
                        },
                      });
                      enableLoading(false);
                    } else if (resVal?.message) {
                      openSnackBar({
                        message: resVal.message,
                        type: MESSAGE_TYPE.WARNING,
                      });
                      navigate('/');
                    } else {
                      navigate('/fill-org-details', {
                        state: {
                          activeToken: res?.access_token,
                          userInfo: res?.user,
                        },
                      });
                    }
                    enableLoading(false);
                  }
                })
                .catch((err) => {
                  if (err?.message) {
                    openSnackBar({
                      message: err.message,
                      type: MESSAGE_TYPE.ERROR,
                    });
                    navigate('/');
                  }
                });
            }
          }
        })
        .catch(() => {
          enableLoading(false);
        });
    }
  };

  const googleLoginWeb = useGoogleLogin({
    onSuccess: (tokenResponse) => autoLoginListener(tokenResponse),
    flow: 'auth-code',
    auto_select: true,
  });

  const onValidatePhone = () => {
    clearErrorMessage();
    const phoneValid = validatePhone(phoneNo);
    if (!phoneValid) {
      setValidationErr((s) => ({ ...s, phone: !phoneValid }));
      return;
    }

    enableLoading(true);
    RestApi('passwords/send_mobile_otp', {
      method: METHOD.POST,
      payload: {
        user_ref: phoneNo,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res) {
          // TODO: BE should send a boolean in the response to validate

          if (!res?.error) {
            setEnableLoginWithOtp('otp');
            openSnackBar({
              message: res?.message,
              type: MESSAGE_TYPE.INFO,
            });
          } else {
            setErrorMessage(res.message);
          }
        } else {
          setErrorMessage('Something went wrong');
        }
      })
      .catch((error) => {
        enableLoading(false);
        setErrorMessage('Something went wrong');
        throw new Error(error);
      });
  };

  const ChooseMailSubmit = () => {
    enableLoading(true);
    RestApi('sessions/send_otp', {
      method: METHOD.POST,
      payload: {
        user_ref: EmailSelection?.selected?.email,
        mode: 'Mail',
      },
    })
      .then((res) => {
        if (res && !res.error) {
          setErrorMessage('');
          openSnackBar({
            message: res?.message,
            type: MESSAGE_TYPE.INFO,
          });
          enableLoading(false);
          setEmailSelection((prev) => ({
            ...prev,
            email: 'emailOtp',
            selectedEmailId: res?.id,
          }));
        } else if (res.error) {
          enableLoading(false);
          openSnackBar({
            message: res?.message || 'Something went wrong',
            type: MESSAGE_TYPE.ERROR,
          });
          setErrorMessage(res?.message);
        }
      })
      .catch((error) => {
        enableLoading(false);
        openSnackBar({
          message: error?.message || 'Something went wrong',
          type: MESSAGE_TYPE.ERROR,
        });
        throw new Error(error);
      });
  };

  const ChangeEmailSelection = (val) => {
    const temp = EmailSelection?.emailList?.find((ele) => ele?.email === val);
    setEmailSelection((prev) => ({
      ...prev,
      selected: temp,
    }));
  };

  const onSignInWithOtp = () => {
    clearErrorMessage();
    if (otp.length !== VCODE_LENGTH) {
      setErrorMessage('Fill in the OTP');
      return;
    }

    enableLoading(true);
    RestApi('passwords/validate_mobile_otp', {
      method: METHOD.POST,
      payload: {
        user_ref: phoneNo,
        otp,
      },
    })
      .then((res) => {
        if (res) {
          enableLoading(false);
          if (res.email_list?.length > 0) {
            setEmailSelection((prev) => ({
              ...prev,
              email: 'selectEmail',
              emailList: res?.email_list || [],
            }));
            return;
          }
          setErrorMessage('Invalid OTP');
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const onOtpEmailComplete = (val) =>
    setEmailSelection((prev) => ({ ...prev, emailOtp: val }));

  const onOtp2FAComplete = (val) =>
    setEmailSelection((prev) => ({ ...prev, twoFactorOtp: val }));

  const onSubmit = (e) => {
    let loginUsername;
    let loginPassword;
    if (e) {
      e.preventDefault();
      loginUsername = emailUserName.current.value;
      loginPassword = emailPassword.current.value;
      const emailValid = validateEmail(emailUserName.current.value);
      const passwordValid = validatePassword(
        password || emailPassword.current.value,
      );
      if (!emailValid || !passwordValid) {
        setValidationErr((s) => ({
          ...s,
          email: !emailValid,
          password: !passwordValid,
        }));
        if ((password || emailPassword.current.value).length < 8) {
          setValidationErr((s) => ({
            ...s,
            password: !passwordValid,
          }));
          return;
        }
        return;
      }
    } else {
      loginUsername = username;
      loginPassword = password;
    }

    const payload = v3Recaptcha
      ? {
          user_ref: loginUsername,
          password: loginPassword,
          remember_me: isCheckboxSelected,
          'g-recaptcha-response': captchaRef?.current?.getValue(),
        }
      : {
          user_ref: loginUsername,
          password: loginPassword,
          remember_me: isCheckboxSelected,
          'g-recaptcha-response-data': { login: captchaToken },
        };
    enableLoading(true);
    RestApi('sessions', {
      method: METHOD.POST,
      payload,
    })
      .then((res) => {
        if (res) {
          enableLoading(false);
          if (!res.error) {
            if (res?.two_factor_auth) {
              openSnackBar({
                message: res?.message,
                type: MESSAGE_TYPE.INFO,
              });
              setEmailSelection((prev) => ({
                ...prev,
                email: '2FA',
                twoFactorId: res?.id,
              }));
              return;
            }
            signIn({
              userId: res.user && res.user.user_id,
              email: res.user && res.user.email,
            });
            setSessionResponse(res);
            validateFunction(res?.access_token, res?.user);
          } else {
            if (res?.error && res?.v2_recaptcha) {
              setV3Recaptcha(res?.v2_recaptcha);
              setErrorMessage(res?.message);
              enableLoading(false);
              return;
            }
            setErrorMessage(res?.message);
          }
        } else {
          setErrorMessage('Something went wrong');
          enableLoading(false);
        }
      })
      .catch((error) => {
        enableLoading(false);
        throw new Error(error);
      });
  };

  const enterOTPConfirm = (payload) => {
    clearErrorMessage();

    if (payload?.otp?.length !== VCODE_LENGTH) {
      setErrorMessage('please fill in required fields');
      return;
    }
    enableLoading(true);
    RestApi('sessions/validate_otp', {
      method: METHOD.POST,
      payload,
    })
      .then((res) => {
        if (res) {
          enableLoading(false);
          if (!res.error) {
            validateFunction(res?.access_token, res?.user?.user_id);
            ResetEmailSelection();
            setSessionResponse(res);
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

  const onOtpComplete = (val) => {
    setOtp(val);
  };

  const resetErrorMessage = () => {
    setErrorMessage('');
    setValidationErr({ email: false, phone: false, password: false });
  };

  const onAuthClick = (authType) => {
    resetErrorMessage();
    if (authType === 'google') {
      JSBridge.launchGoogleSignIN();
    } else if (authType === 'apple') {
      JSBridge.launchAppleSignIN();
    } else {
      setEnableLoginWithOtp(authType);
    }
  };

  const onChangeView = () => {
    changeView('signUp');
    navigate('/signup');
  };
  const onForgetPassword = () => {
    changeView('forgetPassword');
    navigate('forgot-password');
  };
  useEffect(() => {
    registerEventListeners({
      name: 'autoLogin',
      method: (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        autoLoginListener(e);
      },
    });
    return () =>
      deRegisterEventListener({
        name: 'autoLogin',
        method: (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          autoLoginListener(e);
        },
      });
  }, []);

  useEffect(() => {
    if (organization && organization?.orgId) {
      checkNotification(organization.orgId);
      getCurrentUser(organization.orgId);
    }
  }, [organization]);

  const onInputBlur = (e) => {
    const name = (e?.target?.name).trim();
    const value = (e?.target?.value).trim();
    const isValid = {
      email: validateEmail,
      password: validatePassword,
      phone: validatePhone,
    };
    setValidationErr((s) => ({ ...s, [name]: !isValid?.[name]?.(value) }));
  };

  const onInputChange = (setter) => (e) => {
    onInputBlur(e);
    setter(e.target.value.trim());
  };

  useEffect(() => {
    if (count && count === 3) {
      console.log(count === 3 ? 'tripple click' : 'not tripple click');
      JSBridge.launchStaging();
    }
  }, [count]);

  useEffect(() => {
    let listener = (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        console.log('Enter key was pressed. Run your function.');
        event.preventDefault();
        onSubmit(event);
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
      listener = null;
    };
  }, []);

  const toggleStaging = (e) => {
    if (
      window.location.origin !== 'https://app.goeffortless.co' ||
      window.location.origin !== 'https://i.goeffortless.ai' ||
      window.location.origin !== 'https://d11997a5ngzp0a.cloudfront.net'
    ) {
      e.persist();
      if (count < 3) {
        setCount((prev) => prev + e.detail);
      } else {
        setCount(0);
      }
    }
  };

  const handleCheckboxChange = (e) => {
    setIsCheckboxSelected(e?.target?.checked);
  };

  return (
    // loading ? (
    //   <></>
    // ) : (
    <>
      {desktopView ? (
        <>
          <Mui.Grid container>
            <Mui.Grid md={6} className={css.loginImageContainer}>
              <Mui.Stack className={css.imageStack}>
                <img src={login} alt="img" className={css.imageStyle} />
              </Mui.Stack>
            </Mui.Grid>
            <Mui.Grid md={6} xs={12}>
              <Mui.Stack className={css.loginFormContainer} spacing={2}>
                <Mui.Stack direction="row" mt={4}>
                  <img
                    src={flowerLogo}
                    alt="flowerLogo"
                    style={{ width: '250px' }}
                  />
                  {/* <Mui.Typography className={css.fontlogo}>
                    effortless
                  </Mui.Typography> */}
                </Mui.Stack>
                {!selectCompany && !EmailSelection?.email && (
                  <>
                    <Mui.Stack>
                      <Mui.Typography className={css.loginFont}>
                        log in
                      </Mui.Typography>
                      <Mui.Typography className={css.loginSubFont}>
                        The Finance OS for your Business
                      </Mui.Typography>
                    </Mui.Stack>

                    <Mui.Stack>
                      {enableLoginWithOtp === 'sigin' && (
                        <Mui.Stack spacing={3}>
                          <Mui.Stack className={css.inputStack}>
                            <Input
                              inputRef={emailUserName}
                              name="email"
                              label="EMAIL"
                              variant="standard"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              error={validationErr.email}
                              helperText={
                                validationErr.email
                                  ? 'Please provide valid Email'
                                  : ''
                              }
                              onBlur={onInputBlur}
                              fullWidth
                              className={
                                errorMessage && !username
                                  ? `${css.hasError} ${css.inputField}`
                                  : css.inputField
                              }
                              onChange={onInputChange(setUsername)}
                              autoComplete="off"
                              autoFocus
                            />
                          </Mui.Stack>
                          <Mui.Stack className={css.inputStack} pb={1}>
                            <Input
                              inputRef={emailPassword}
                              name="password"
                              label="PASSWORD"
                              variant="standard"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              InputProps={{
                                type: showPassword ? 'password' : 'text',
                                endAdornment: (
                                  <Mui.InputAdornment
                                    position="end"
                                    onClick={handleClickShowPassword}
                                  >
                                    <Mui.IconButton
                                      size="small"
                                      style={{ color: '#fff' }}
                                    >
                                      {showPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </Mui.IconButton>
                                  </Mui.InputAdornment>
                                ),
                              }}
                              error={validationErr.password}
                              helperText={
                                validationErr.password
                                  ? 'Please provide the valid Password'
                                  : ''
                              }
                              onBlur={onInputBlur}
                              fullWidth
                              className={
                                errorMessage && !username
                                  ? `${css.hasError} ${css.inputField}`
                                  : css.inputField
                              }
                              onChange={onInputChange(setPassword)}
                              autoComplete="off"
                            />
                          </Mui.Stack>

                          {/* <Grid item xs={12}> */}
                          {v3Recaptcha && (
                            <Mui.Stack>
                              <ReactRecaptcha
                                sitekey={V2_SITE_KEY}
                                ref={captchaRef}
                              />
                            </Mui.Stack>
                          )}
                          {/* </Grid> */}
                        </Mui.Stack>
                      )}

                      {enableLoginWithOtp === 'mobile' && (
                        <Mui.Stack spacing={3}>
                          <Mui.Stack className={css.inputStack} pb={1}>
                            <Input
                              name="phone"
                              label="PHONE NO"
                              variant="standard"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              inputProps={{
                                type: 'tel',
                              }}
                              error={validationErr.phone}
                              helperText={
                                validationErr.phone
                                  ? 'Please provide valid input'
                                  : ''
                              }
                              onBlur={onInputBlur}
                              fullWidth
                              className={
                                errorMessage && !phoneNo
                                  ? `${css.hasError} ${css.inputField}`
                                  : css.inputField
                              }
                              onChange={onInputChange(setPhoneNo)}
                            />
                          </Mui.Stack>
                        </Mui.Stack>
                      )}
                      {enableLoginWithOtp === 'otp' && (
                        <Mui.Stack spacing={3}>
                          <Mui.Stack className={css.inputStack} pb={1}>
                            <VerificationCodeInput
                              length={VCODE_LENGTH}
                              onChange={onOtpComplete}
                            />
                          </Mui.Stack>
                        </Mui.Stack>
                      )}

                      <Grid item xs={12}>
                        <div
                          className={css.forgotPassword}
                          onClick={() => {
                            onForgetPassword();
                          }}
                          onKeyDown={() => {
                            onForgetPassword();
                          }}
                          aria-hidden="true"
                        >
                          Forgot Password?
                        </div>
                      </Grid>

                      {errorMessage && (
                        <div className={css.errorContainer}>
                          <InfoOutlinedIcon fontSize="small" />{' '}
                          <span className={css.errorText}>{errorMessage}</span>
                        </div>
                      )}

                      <Mui.Stack>
                        <Mui.Stack direction="row" alignItems="center">
                          <CustomCheckbox
                            style={{ color: 'white' }}
                            onChange={handleCheckboxChange}
                            checked={isCheckboxSelected}
                          />
                          <Mui.Typography className={css.checkboxText}>
                            remember me
                          </Mui.Typography>
                        </Mui.Stack>
                      </Mui.Stack>

                      <Mui.Stack
                        direction="row"
                        spacing={2}
                        className={css.marginT}
                      >
                        {enableLoginWithOtp === 'sigin' ? (
                          <Button
                            variant="contained"
                            className={css.loginBtn}
                            fullWidth
                            onClick={onSubmit}
                          >
                            <Mui.Typography className={css.loginBtnText}>
                              log in
                            </Mui.Typography>
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            className={css.loginBtn}
                            fullWidth
                            onClick={
                              enableLoginWithOtp === 'mobile'
                                ? onValidatePhone
                                : onSignInWithOtp
                            }
                          >
                            <Mui.Typography className={css.loginBtnText}>
                              {enableLoginWithOtp === 'mobile'
                                ? 'Request OTP'
                                : 'Log In'}
                            </Mui.Typography>
                          </Button>
                        )}

                        <Mui.Button
                          className={css.siginBtn}
                          onClick={() => googleLoginWeb()}
                        >
                          <GoogleSvgIcon />
                        </Mui.Button>

                        {enableLoginWithOtp === 'sigin' && (
                          <Mui.Button
                            className={css.siginBtn}
                            onClick={() => onAuthClick('mobile')}
                          >
                            <SmsIcon
                              style={{ fontSize: '2rem', color: '#fff' }}
                            />
                          </Mui.Button>
                        )}

                        {(enableLoginWithOtp === 'mobile' ||
                          enableLoginWithOtp === 'otp') && (
                          <Mui.Button
                            className={css.siginBtn}
                            onClick={() => onAuthClick('sigin')}
                          >
                            <EmailOutlinedIcon
                              style={{ fontSize: '2rem', color: '#fff' }}
                            />
                          </Mui.Button>
                        )}
                      </Mui.Stack>

                      {(enableLoginWithOtp === 'sigin' ||
                        enableLoginWithOtp === 'mobile') && (
                        <Mui.Stack direction="row" className={css.footerLink}>
                          <p>
                            Don&apos;t have an Account?{' '}
                            <span
                              className={css.greenColorText}
                              onClick={onChangeView}
                              onKeyDown={onChangeView}
                            >
                              Sign up &gt;
                            </span>
                          </p>
                        </Mui.Stack>
                      )}

                      {enableLoginWithOtp === 'otp' && (
                        <div
                          className={css.footerLink}
                          onClick={onValidatePhone}
                          aria-hidden="true"
                        >
                          Didn&apos;t receive code?{' '}
                          <span style={{ color: '#36E3C0', marginLeft: '3px' }}>
                            {' '}
                            Request again
                          </span>
                        </div>
                      )}

                      <Mui.Stack
                        direction="row"
                        className={css.footerLink}
                        aria-hidden="true"
                      >
                        <div className={css.signInContainerFooter}>
                          {/* <p>
                                  Don&apos;t have an Account?{' '}
                                  <span className={css.greenColorText} onClick={onChangeView} onKeyDown={onChangeView}>
                                    Sign up &gt;
                                  </span>
                                </p> */}

                          <Mui.Stack direction="row">
                            <img
                              src={googlebatch}
                              alt="googlebatch"
                              width={135}
                              height={40}
                            />
                            <img
                              src={appstorebatch}
                              alt="appstorebatch"
                              width={135}
                              height={40}
                            />
                          </Mui.Stack>

                          <div className={css.policyLinks}>
                            <a
                              href="https://goeffortless.ai/#/terms-of-use"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Terms & Conditions
                            </a>
                            <a
                              href="https://goeffortless.ai/#/privacy-policy"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Privacy Policy
                            </a>
                          </div>
                        </div>
                        <Mui.Stack className={css.ellipseStack}>
                          <img
                            src={ellipse}
                            alt="ellipse"
                            style={{ width: '70px' }}
                          />
                        </Mui.Stack>
                      </Mui.Stack>
                    </Mui.Stack>
                  </>
                )}
                {organizationList?.length > 0 &&
                  selectCompany &&
                  !EmailSelection?.email && (
                    <Mui.Stack
                      className={css.signInContainer}
                      sx={{
                        p: desktopView
                          ? '10px 10px 10px 10px'
                          : '10px 5% 0px 10px',
                        m: desktopView
                          ? '0 0 24vh 0 !important'
                          : '0 0 30vh 0 !important',
                      }}
                    >
                      <Mui.Grid item xs={12} md={12} lg={10}>
                        <Mui.Typography className={css.pageTitle}>
                          Select Company
                        </Mui.Typography>
                        <Autocomplete
                          open={organizationSelect?.orgId === ''}
                          noOptionsText="No organization found"
                          clearOnBlur={false}
                          disablePortal
                          id="auto-complete"
                          options={organizationList}
                          classes={{
                            root: classes.root,
                            noOptions: classes.noOptions,
                          }}
                          getOptionLabel={(option) => option.name}
                          onChange={(e, newValue) => {
                            setOrganizationSelect({
                              ...e,
                              orgId: newValue.id,
                              orgName: newValue.name,
                              shortName: newValue?.short_name,
                            });
                          }}
                          PaperComponent={({ children }) => (
                            <Mui.Paper
                              sx={{
                                background: '#2F1C0D',
                                border: '1px solid #F08B32',
                                color: 'white',
                                maxHeight: '30vh',
                                overflow: 'hidden',
                                '& > ul': {
                                  maxHeight: '28vh',
                                },
                              }}
                            >
                              {children}
                            </Mui.Paper>
                          )}
                          autoComplete
                          includeInputInList
                          renderInput={(params) => (
                            <CustomTextField
                              {...params}
                              label="Search company"
                              margin="normal"
                              variant="outlined"
                              autoFocus
                              ref={params.InputProps.ref}
                              className={classes.input}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <Mui.InputAdornment position="start">
                                    <SearchIcon
                                      className={classes.searchIcon}
                                      style={{ color: '#ffffff7f' }}
                                    />
                                  </Mui.InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </Mui.Grid>
                    </Mui.Stack>
                  )}
                {EmailSelection?.email && !selectCompany && (
                  <Mui.Grid container>
                    <Mui.Grid item lg={6} md={6}>
                      {EmailSelection?.email === 'selectEmail' && (
                        <>
                          <Mui.Typography className={css.emailTitle}>
                            Choose Email ID
                          </Mui.Typography>
                          <Mui.Typography
                            className={css.emailSubTitle}
                            sx={{ color: '#FFFFFF !important' }}
                          >
                            Email IDs associated with your Mobile Number
                            <span style={{ color: '#F08B32' }}>
                              +91 {phoneNo}
                            </span>{' '}
                          </Mui.Typography>
                          <Autocomplete
                            // {...defaultProps}
                            id="auto-complete"
                            options={EmailSelection?.emailList?.map(
                              (val) => val?.email,
                            )}
                            getOptionLabel={(option) => option}
                            classes={{
                              root: classes.root,
                              noOptions: classes.noOptions,
                            }}
                            onChange={(e, newValue) => {
                              ChangeEmailSelection(newValue);
                            }}
                            PaperComponent={({ children }) => (
                              <Mui.Paper
                                sx={{
                                  background: '#2F1C0D',
                                  border: '1px solid #F08B32',
                                  color: 'white',
                                  maxHeight: '30vh',
                                  overflow: 'hidden',
                                  '& > ul': {
                                    maxHeight: '28vh',
                                  },
                                }}
                              >
                                {children}
                              </Mui.Paper>
                            )}
                            autoComplete
                            includeInputInList
                            renderInput={(params) => (
                              <CustomTextField
                                {...params}
                                label="Search Email ID"
                                margin="normal"
                                variant="outlined"
                                className={classes.input}
                                InputProps={{
                                  ...params.InputProps,
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <SearchIcon
                                        className={classes.searchIcon}
                                        style={{ color: '#ffffff7f' }}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                          {Object?.keys(EmailSelection?.selected || {})
                            ?.length > 0 && (
                            <Mui.Stack alignItems="center" mt={4}>
                              {EmailSelection?.selected?.sign_up_method ===
                              'google' ? (
                                <Mui.Button
                                  className={css.siginBtn}
                                  style={{ height: '45px' }}
                                  onClick={() => {
                                    googleLoginWeb();
                                  }}
                                >
                                  <GoogleSvgIcon />
                                </Mui.Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  className={css.loginBtn}
                                  fullWidth
                                  onClick={ChooseMailSubmit}
                                >
                                  <Mui.Typography className={css.loginBtnText}>
                                    Submit
                                  </Mui.Typography>
                                </Button>
                              )}
                            </Mui.Stack>
                          )}
                        </>
                      )}

                      {EmailSelection?.email === '2FA' && (
                        <>
                          <Mui.Typography className={css.pageTitle}>
                            Verification Code
                          </Mui.Typography>
                          <Mui.Typography className={css.pageSubTitle}>
                            We have sent you a verification code to your{' '}
                            <span style={{ color: '#F08B32' }}>
                              +91 XXXXX XXXXX
                            </span>{' '}
                          </Mui.Typography>
                          <VerificationCodeInput
                            length={VCODE_LENGTH}
                            onChange={onOtp2FAComplete}
                          />

                          {errorMessage && (
                            <div className={css.errorContainer}>
                              <InfoOutlinedIcon fontSize="small" />{' '}
                              <span className={css.errorText}>
                                {errorMessage}
                              </span>
                            </div>
                          )}

                          <div>
                            <Mui.Button
                              variant="contained"
                              className={css.submitButton}
                              fullWidth
                              onClick={() =>
                                enterOTPConfirm({
                                  id: EmailSelection?.twoFactorId,
                                  otp: EmailSelection?.twoFactorOtp,
                                })
                              }
                            >
                              Submit
                            </Mui.Button>
                            <div
                              className={css.footerLinkMobile}
                              onClick={() => onSubmit()}
                              aria-hidden="true"
                            >
                              Didn&apos;t receive code?{' '}
                              <span
                                style={{ color: '#36E3C0', marginLeft: '3px' }}
                              >
                                {' '}
                                Request again
                              </span>
                            </div>
                          </div>
                        </>
                      )}

                      {EmailSelection?.email === 'emailOtp' && (
                        <>
                          <Mui.Typography className={css.pageTitle}>
                            Verification Code
                          </Mui.Typography>
                          <Mui.Typography className={css.pageSubTitle}>
                            We have sent you a verification code to your{' '}
                            <span style={{ color: '#F08B32' }}>
                              {EmailSelection?.selected?.email}
                            </span>{' '}
                          </Mui.Typography>
                          <VerificationCodeInput
                            length={VCODE_LENGTH}
                            onChange={onOtpEmailComplete}
                          />

                          {errorMessage && (
                            <div className={css.errorContainer}>
                              <InfoOutlinedIcon fontSize="small" />{' '}
                              <span className={css.errorText}>
                                {errorMessage}
                              </span>
                            </div>
                          )}

                          <div>
                            <Mui.Button
                              variant="contained"
                              className={css.submitButton}
                              fullWidth
                              onClick={() =>
                                enterOTPConfirm({
                                  id: EmailSelection?.selectedEmailId,
                                  otp: EmailSelection?.emailOtp,
                                })
                              }
                            >
                              Submit
                            </Mui.Button>
                            <div
                              className={css.footerLinkMobile}
                              onClick={ChooseMailSubmit}
                              aria-hidden="true"
                            >
                              Didn&apos;t receive code?{' '}
                              <span
                                style={{ color: '#36E3C0', marginLeft: '3px' }}
                              >
                                {' '}
                                Request again
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </Mui.Grid>
                  </Mui.Grid>
                )}
              </Mui.Stack>
            </Mui.Grid>
          </Mui.Grid>
        </>
      ) : (
        <div className={css.loginContainer}>
          <IntroHeader
            onAuthClick={onAuthClick}
            enableOtpLogin={
              enableLoginWithOtp === 'mobile' || enableLoginWithOtp === 'otp'
            }
            toggleStaging={toggleStaging}
            hide={EmailSelection?.email}
            view="signIn"
          />
          {!organizationList?.length > 0 &&
            !selectCompany &&
            !EmailSelection?.email && (
              <>
                <div className={css.signInContainer}>
                  <span className={css.titleInfo}>
                    Sign In with your Effortless Account
                  </span>
                  {enableLoginWithOtp === 'mobile' && (
                    <Input
                      name="phone"
                      label="PHONE NO"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        type: 'tel',
                      }}
                      error={validationErr.phone}
                      helperText={
                        validationErr.phone ? 'Please provide valid input' : ''
                      }
                      onBlur={onInputBlur}
                      fullWidth
                      className={
                        errorMessage && !phoneNo
                          ? `${css.hasError} ${css.inputField}`
                          : css.inputField
                      }
                      onChange={onInputChange(setPhoneNo)}
                    />
                  )}
                  {enableLoginWithOtp === 'otp' && (
                    <VerificationCodeInput
                      length={VCODE_LENGTH}
                      onChange={onOtpComplete}
                    />
                  )}
                  {enableLoginWithOtp === 'sigin' && (
                    <>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Input
                            inputRef={emailUserName}
                            name="email"
                            label="EMAIL"
                            variant="standard"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            error={validationErr.email}
                            helperText={
                              validationErr.email
                                ? 'Please provide valid Email'
                                : ''
                            }
                            onBlur={onInputBlur}
                            fullWidth
                            className={
                              errorMessage && !username
                                ? `${css.hasError} ${css.inputField}`
                                : css.inputField
                            }
                            onChange={onInputChange(setUsername)}
                            autoComplete="off"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Input
                            inputRef={emailPassword}
                            name="password"
                            label="PASSWORD"
                            variant="standard"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              type: showPassword ? 'password' : 'text',
                              endAdornment: (
                                <Mui.InputAdornment
                                  position="end"
                                  onClick={handleClickShowPassword}
                                >
                                  <Mui.IconButton
                                    size="small"
                                    style={{ color: '#fff' }}
                                  >
                                    {showPassword ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </Mui.IconButton>
                                </Mui.InputAdornment>
                              ),
                            }}
                            error={validationErr.password}
                            helperText={
                              validationErr.password
                                ? 'Please provide a Password'
                                : ''
                            }
                            onBlur={onInputBlur}
                            fullWidth
                            className={
                              errorMessage && !username
                                ? `${css.hasError} ${css.inputField}`
                                : css.inputField
                            }
                            onChange={onInputChange(setPassword)}
                            autoComplete="off"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <div
                            className={`${css.forgotPassword} ${css.greenColorText}`}
                            onClick={() => {
                              onForgetPassword();
                            }}
                            onKeyDown={() => {
                              onForgetPassword();
                            }}
                            aria-hidden="true"
                          >
                            Forgot Password?
                          </div>
                        </Grid>
                      </Grid>
                    </>
                  )}

                  {/* <Grid item xs={12}>
                    {v3Recaptcha && (
                      <ReactRecaptcha sitekey={V2_SITE_KEY} ref={captchaRef} />
                    )}
                  </Grid> */}

                  {errorMessage && (
                    <div className={css.errorContainer}>
                      <InfoOutlinedIcon fontSize="small" />{' '}
                      <span className={css.errorText}>{errorMessage}</span>
                    </div>
                  )}

                  {enableLoginWithOtp === 'sigin' ? (
                    <Button
                      variant="contained"
                      className={css.submitButton}
                      fullWidth
                      onClick={onSubmit}
                    >
                      Sign In
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      className={css.submitButton}
                      fullWidth
                      onClick={
                        enableLoginWithOtp === 'mobile'
                          ? onValidatePhone
                          : onSignInWithOtp
                      }
                    >
                      {enableLoginWithOtp === 'mobile'
                        ? 'Request OTP'
                        : 'Sign In'}
                    </Button>
                  )}
                  {(enableLoginWithOtp === 'sigin' ||
                    enableLoginWithOtp === 'mobile') && (
                    <div
                      className={css.footerLink}
                      // onClick={onChangeView}
                      // onKeyDown={onChangeView}
                      aria-hidden="true"
                    >
                      <div className={css.signInContainerFooter}>
                        <p>
                          Don&apos;t have an Account?{' '}
                          <span
                            className={css.greenColorText}
                            onClick={onChangeView}
                            onKeyDown={onChangeView}
                          >
                            Sign up &gt;
                          </span>
                        </p>
                        <div className={css.policyLinks}>
                          <a
                            href="https://goeffortless.ai/#/terms-of-use"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Terms & Conditions
                          </a>
                          <a
                            href="https://goeffortless.ai/#/privacy-policy"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Privacy Policy
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  {enableLoginWithOtp === 'otp' && (
                    <div
                      className={css.footerLinkMobile}
                      onClick={onValidatePhone}
                      aria-hidden="true"
                    >
                      Didn&apos;t receive code?{' '}
                      <span style={{ color: '#36E3C0', marginLeft: '3px' }}>
                        {' '}
                        Request again
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          {organizationList?.length > 0 &&
            selectCompany &&
            !EmailSelection?.email && (
              <Mui.Stack
                className={css.signInContainer}
                sx={{
                  p: desktopView ? '10px 10px 10px 10px' : '10px 5% 0px 10px',
                  m: desktopView
                    ? '0 0 24vh 0 !important'
                    : '0 0 30vh 0 !important',
                }}
              >
                <Mui.Grid item xs={12} md={8}>
                  <Mui.Typography className={css.pageTitle}>
                    Select Company
                  </Mui.Typography>
                  <Autocomplete
                    open={organizationSelect?.orgId === ''}
                    noOptionsText="No organization found"
                    clearOnBlur={false}
                    // {...defaultProps}
                    disablePortal
                    id="auto-complete"
                    options={organizationList}
                    classes={{
                      root: classes.root,
                      noOptions: classes.noOptions,
                    }}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, newValue) => {
                      setOrganizationSelect({
                        ...e,
                        orgId: newValue.id,
                        orgName: newValue.name,
                        shortName: newValue?.short_name,
                      });
                    }}
                    PaperComponent={({ children }) => (
                      <Mui.Paper
                        style={{
                          background: '#2F1C0D',
                          border: '1px solid #F08B32',
                          color: 'white',
                        }}
                      >
                        {children}
                      </Mui.Paper>
                    )}
                    autoComplete
                    includeInputInList
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        label="Search company"
                        margin="normal"
                        variant="outlined"
                        className={classes.input}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <Mui.InputAdornment position="start">
                              <SearchIcon
                                className={classes.searchIcon}
                                style={{ color: '#ffffff7f' }}
                              />
                            </Mui.InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Mui.Grid>
              </Mui.Stack>
            )}
          {EmailSelection?.email && !selectCompany && (
            <Mui.Grid container>
              <Mui.Grid item lg={6} md={6} mt={2}>
                {EmailSelection?.email === 'selectEmail' && (
                  <>
                    <Mui.Typography className={css.emailTitle}>
                      Choose Email ID
                    </Mui.Typography>
                    <Mui.Typography
                      className={css.emailSubTitle}
                      sx={{ color: '#FFFFFF !important' }}
                    >
                      Email IDs associated with your Mobile Number
                      <span style={{ color: '#F08B32' }}>
                        +91 {phoneNo}
                      </span>{' '}
                    </Mui.Typography>
                    <Autocomplete
                      // {...defaultProps}
                      id="auto-complete"
                      options={EmailSelection?.emailList?.map(
                        (val) => val?.email,
                      )}
                      getOptionLabel={(option) => option}
                      classes={{
                        root: classes.root,
                        noOptions: classes.noOptions,
                      }}
                      onChange={(e, newValue) => {
                        ChangeEmailSelection(newValue);
                      }}
                      PaperComponent={({ children }) => (
                        <Mui.Paper
                          sx={{
                            background: '#2F1C0D',
                            border: '1px solid #F08B32',
                            color: 'white',
                            maxHeight: '30vh',
                            overflow: 'hidden',
                            '& > ul': {
                              maxHeight: '28vh',
                            },
                          }}
                        >
                          {children}
                        </Mui.Paper>
                      )}
                      autoComplete
                      includeInputInList
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          label="Search Email ID"
                          margin="normal"
                          variant="outlined"
                          className={classes.input}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon
                                  className={classes.searchIcon}
                                  style={{ color: '#ffffff7f' }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                    {Object?.keys(EmailSelection?.selected || {})?.length >
                      0 && (
                      <Mui.Stack alignItems="center" mt={4}>
                        {EmailSelection?.selected?.sign_up_method ===
                        'google' ? (
                          <div className={css.oAuthContainerForgot}>
                            <div
                              onClick={() => {
                                onAuthClick('google');
                              }}
                              aria-hidden="true"
                            >
                              <span className={css.icons}>
                                <GoogleSvgIcon />
                              </span>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="contained"
                            className={css.submitButton}
                            fullWidth
                            onClick={ChooseMailSubmit}
                          >
                            <Mui.Typography
                              className={css.loginBtnText}
                              color="#fff"
                            >
                              Submit
                            </Mui.Typography>
                          </Button>
                        )}
                      </Mui.Stack>
                    )}
                  </>
                )}

                {EmailSelection?.email === '2FA' && (
                  <>
                    <Mui.Typography className={css.pageTitle}>
                      Verification Code
                    </Mui.Typography>
                    <Mui.Typography className={css.pageSubTitle}>
                      We have sent you a verification code to your{' '}
                      <span style={{ color: '#F08B32' }}>+91 XXXXX XXXXX</span>{' '}
                    </Mui.Typography>
                    <VerificationCodeInput
                      length={VCODE_LENGTH}
                      onChange={onOtp2FAComplete}
                    />

                    {errorMessage && (
                      <div className={css.errorContainer}>
                        <InfoOutlinedIcon fontSize="small" />{' '}
                        <span className={css.errorText}>{errorMessage}</span>
                      </div>
                    )}

                    <div>
                      <Mui.Button
                        variant="contained"
                        className={css.submitButton}
                        fullWidth
                        onClick={() =>
                          enterOTPConfirm({
                            id: EmailSelection?.twoFactorId,
                            otp: EmailSelection?.twoFactorOtp,
                          })
                        }
                      >
                        Submit
                      </Mui.Button>
                      <div
                        className={css.footerLinkMobile}
                        onClick={() => onSubmit()}
                        aria-hidden="true"
                      >
                        Didn&apos;t receive code?{' '}
                        <span style={{ color: '#36E3C0', marginLeft: '3px' }}>
                          {' '}
                          Request again
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {EmailSelection?.email === 'emailOtp' && (
                  <>
                    <Mui.Typography className={css.pageTitle}>
                      Verification Code
                    </Mui.Typography>
                    <Mui.Typography className={css.pageSubTitle}>
                      We have sent you a verification code to your{' '}
                      <span style={{ color: '#F08B32' }}>
                        {EmailSelection?.selected?.email}
                      </span>{' '}
                    </Mui.Typography>
                    <VerificationCodeInput
                      length={VCODE_LENGTH}
                      onChange={onOtpEmailComplete}
                    />

                    {errorMessage && (
                      <div className={css.errorContainer}>
                        <InfoOutlinedIcon fontSize="small" />{' '}
                        <span className={css.errorText}>{errorMessage}</span>
                      </div>
                    )}

                    <div>
                      <Mui.Button
                        variant="contained"
                        className={css.submitButton}
                        fullWidth
                        onClick={() =>
                          enterOTPConfirm({
                            id: EmailSelection?.selectedEmailId,
                            otp: EmailSelection?.emailOtp,
                          })
                        }
                      >
                        Submit
                      </Mui.Button>
                      <div
                        className={css.footerLinkMobile}
                        onClick={ChooseMailSubmit}
                        aria-hidden="true"
                      >
                        Didn&apos;t receive code?{' '}
                        <span style={{ color: '#36E3C0', marginLeft: '3px' }}>
                          {' '}
                          Request again
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </Mui.Grid>
            </Mui.Grid>
          )}
        </div>
      )}
      {OnBackEventHandle()}
    </>
  );
};

export default SignInContainer;
