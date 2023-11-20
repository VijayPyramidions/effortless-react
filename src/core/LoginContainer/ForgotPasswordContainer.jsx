/* @flow */
/**
 * @fileoverview  Forgot password container
 */

import React, { useState, useContext } from 'react';
import OnBackEventHandle from '@core/OnBackEventHandle';
import JSBridge from '@nativeBridge/jsbridge';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import * as Mui from '@mui/material';
import Input, { MobileNumberFormatCustom } from '@components/Input/Input.jsx';
import Button from '@material-ui/core/Button';
import AppContext from '@root/AppContext.jsx';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SvgIcon from '@material-ui/core/SvgIcon';
import { useGoogleLogin } from '@react-oauth/google';
import SearchIcon from '@material-ui/icons/Search';
import { validatePhone } from '@services/Validation.jsx';
import {
  VerificationCodeInput,
  VCODE_LENGTH,
} from '@core/LoginContainer/VerificationCodeContainer.jsx';

import {
  IconButton,
  InputAdornment,
  makeStyles,
  withStyles,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { useToggle } from '@services/CustomHooks';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import * as theme from '@root/theme.scss';
import { useNavigate } from 'react-router-dom';
import * as css from './SignInContainer.scss';
import flowerLogo from '../../assets/WebLogo.png';
import flowerMobileLogo from '../../assets/MobileLogo.png';

import login from '../../assets/loginScreen.svg';
import ellipse from '../../assets/Ellipse 6.svg';

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

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiInputAdornment-root .MuiButtonBase-root': {
      marginRight: '4px !important',
      color: theme.colorGray,
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
})(TextField);

const COMPANY_LIST = [
  { title: 'Axis Co.', id: 1 },
  { title: 'Deccan Co.', id: 2 },
  { title: 'Aero Wings', id: 3 },
  { title: 'Harpy Firm', id: 4 },
  { title: 'Inazuma Inc', id: 5 },
  { title: 'Cog United', id: 6 },
  { title: 'Pyramidion Solutions', id: 7 },
  { title: 'Team X', id: 8 },
  { title: 'Wonder View', id: 9 },
  { title: 'Baltimore Corp', id: 10 },
  { title: 'Acute Angle', id: 11 },
  { title: 'Calcimo', id: 12 },
  { title: 'Elysium', id: 13 },
  { title: 'Elephant Notes', id: 14 },
  { title: 'Dunder Mufflin', id: 15 },
  { title: 'Parks & Creation', id: 16 },
  { title: 'Brooklyn 9', id: 17 },
  { title: 'Rex', id: 18 },
  { title: 'Generator Buddies', id: 19 },
  { title: 'Ghostbusters', id: 20 },
  { title: 'Corporate Law', id: 21 },
  { title: 'Testimonials', id: 22 },
  { title: 'Support 4', id: 23 },
  { title: 'Inu Yasha', id: 24 },
  { title: 'Monsters Inc.', id: 25 },
  { title: 'Wild Frank', id: 26 },
  { title: 'Nat Geo', id: 27 },
  { title: 'Bennigtons', id: 28 },
  { title: 'Wonder Weis', id: 29 },
  { title: 'Star Troopers', id: 30 },
];

const ForgotPasswordContainer = () => {
  const classes = useStyles();
  const [phoneNo, setPhoneNo] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailList, setEmailList] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [chooseMailId, setChooseMailId] = useState({});
  const [email, setEmail] = useState(false);
  const [OTP, setOtp] = useState('');
  const [showPassword, togglePassword] = useToggle(false);
  const [showConfirmPassword, toggleConfirmPassword] = useToggle(false);
  const [enterPasswordComp, setEnterPasswordComp] = useState(false);
  const [passwordEmail, setPasswordEmail] = useState(false);
  const [showCompanyComponent, setShowCompanyComponent] = useState(false);
  const { enableLoading, changeView, openSnackBar } = useContext(AppContext);
  const navigate = useNavigate();
  const themess = useTheme();
  const Mobile = useMediaQuery(themess.breakpoints.down('md'));

  const onInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const clearErrorMessage = () => {
    setErrorMessage('');
  };

  // passwords

  const onValidateEmail = () => {
    clearErrorMessage();
    const validNum = validatePhone(phoneNo);
    if (!phoneNo) {
      setErrorMessage('Please fill in required fields');
    } else if (!validNum) {
      setErrorMessage('Please fill in valid input');
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
        if (res?.error) {
          // TODO: BE should send a boolean in the response to validate
          setErrorMessage(res.message);
          openSnackBar({
            message: res?.message || 'Something went wrong',
            type: MESSAGE_TYPE.ERROR,
          });
        } else if (!res?.error) {
          setErrorMessage('');
          setValidEmail(true);
          openSnackBar({
            message: res?.message,
            type: MESSAGE_TYPE.INFO,
          });
        }
      })
      .catch((error) => {
        enableLoading(false);
        setErrorMessage('Something went wrong');
        throw new Error(error);
      });
  };
  const enterPasswordCompHandler = () => {
    clearErrorMessage();

    if (OTP.length !== VCODE_LENGTH) {
      setErrorMessage('please fill in required fields');
      return;
    }
    enableLoading(true);
    RestApi('passwords/validate_mobile_otp', {
      method: METHOD.POST,
      payload: {
        user_ref: phoneNo,
        otp: OTP,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res?.email_list?.length > 0) {
          setEmailList(res?.email_list);
          setEmail(true);
          // TODO: BE should send a boolean in the response to validate
          if (res.message === 'Invalid OTP') {
            setErrorMessage(res.message);
            // return;
            setEmailList(res?.email_list);
            setEmail(true);
            // setEnterPasswordComp(true);
          }
        } else {
          setErrorMessage(res.message);
        }
      })
      .catch((error) => {
        enableLoading(false);
        setEnterPasswordComp();
        setErrorMessage(error?.message);
        throw new Error(error);
      });
  };
  const onOtpComplete = (val) => setOtp(val);
  const onOtpEmailComplete = (val) => setOtp(val);

  const ChooseMailSubmit = () => {
    if (Object?.keys(chooseMailId || {})?.length === 0) {
      setErrorMessage('please fill in required fields');
      return;
    }
    enableLoading(true);
    RestApi('passwords', {
      method: METHOD.POST,
      payload: {
        user_ref: chooseMailId?.email,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          setErrorMessage('');
          enableLoading(false);
          setEmailVerify(true);
          openSnackBar({
            message: res?.message,
            type: MESSAGE_TYPE.INFO,
          });
        } else if (res.error) {
          enableLoading(false);
          setErrorMessage(res?.message);
          openSnackBar({
            message: res?.message || 'Something went wrong',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((error) => {
        enableLoading(false);
        setErrorMessage(error?.message);
        throw new Error(error);
      });
  };

  const enterOTPConfirm = () => {
    clearErrorMessage();

    if (OTP.length !== VCODE_LENGTH) {
      setErrorMessage('please fill in required fields');
      return;
    }
    enableLoading(true);
    RestApi('passwords/validate_otp', {
      method: METHOD.POST,
      payload: {
        user_ref: chooseMailId?.email,
        otp: OTP,
      },
    })
      .then((res) => {
        setErrorMessage('');
        enableLoading(false);
        if (res && !res.error) {
          setEmail(true);
          setPasswordEmail(true);
          setEmailVerify(true);
        } else if (res.error) {
          setErrorMessage(res.message);
        }
      })
      .catch((error) => {
        enableLoading(false);
        setErrorMessage(error?.message);
        throw new Error(error);
      });
  };

  const onPasswordChange = () => {
    clearErrorMessage();

    if (!password || !confirmPassword) {
      setErrorMessage('please fill in required fields');
      return;
    }

    if (password.length < 8 || confirmPassword.length < 8) {
      setErrorMessage('Password must have minimum of 8 Characters');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password & Confirm Password doesn't match");
      return;
    }

    // below code is commented at the moment, when the API is deployed the following method might be used

    enableLoading(true);
    RestApi('passwords', {
      method: METHOD.PATCH,
      payload: {
        user_ref: chooseMailId?.email,
        password: confirmPassword,
      },
    })
      .then((res) => {
        if (res && !res.error) {
          enableLoading(false);
          // TODO: BE should send a boolean in the response to validate
          if (res?.message && res.message === 'Invalid credentials') {
            setErrorMessage(res.message);
            return;
          }
          if (
            res?.message &&
            res.message === 'Password is updated successfully'
          ) {
            openSnackBar({
              message: res.message || 'Last operation was successful',
              type: MESSAGE_TYPE.INFO,
            });
            setValidEmail(true);
            setShowCompanyComponent(true);
            navigate('/');
            // return;
          }

          // changeView('signIn');
          // navigate('/');
        }
      })
      .catch((error) => {
        enableLoading(false);
        setErrorMessage(error?.message);
        throw new Error(error);
      });
  };

  const submitButtonHandler = () => {
    if (!validEmail) {
      onValidateEmail();
      return;
    }

    if (validEmail && enterPasswordComp) {
      onPasswordChange();
    }
  };

  const SubmitOTP = () => {
    if (validEmail && !enterPasswordComp) {
      enterPasswordCompHandler();
    }
  };

  const PasswordSubmit = () => {
    onPasswordChange();
  };

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
            navigate('/', {
              state: {
                verified: res,
                sessionRes: { access_token: token, user },
              },
            });
            enableLoading(false);
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

  const autoLoginListener = (e) => {
    const accessCode = e.detail ? e.detail.code : e.code;
    const accessProvider = e.detail ? e.detail.provider : 'google';
    enableLoading(true);
    RestApi(`social_login`, {
      method: METHOD.POST,
      payload: {
        code: accessCode,
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
          } else {
            validateFunction(res?.access_token, res?.user);
          }
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const ChangeEmailSelection = (val) => {
    const temp = emailList?.find((ele) => ele?.email === val);
    setChooseMailId(temp);
  };

  const googleLoginWeb = useGoogleLogin({
    onSuccess: (tokenResponse) => autoLoginListener(tokenResponse),
    flow: 'auth-code',
    auto_select: true,
  });

  const onAuthClick = (authType) => {
    if (authType === 'google') {
      JSBridge.launchGoogleSignIN();
    }
  };

  // const device = localStorage.getItem('device_detect');
  return (
    <>
      {!Mobile ? (
        <Mui.Grid container>
          <Mui.Grid item lg={6} md={6} className={css.forgotImageContainer}>
            <Mui.Stack className={css.imageStack}>
              <img src={login} alt="img" className={css.imageStyle} />
            </Mui.Stack>
          </Mui.Grid>
          <Mui.Grid item lg={6} md={6}>
            {' '}
            <div className={css.loginContainerDesktop}>
              <Mui.Stack direction="row" style={{ margin: '1rem 0rem' }}>
                <img
                  src={flowerLogo}
                  alt="flowerLogo"
                  style={{ width: '250px' }}
                />
                {/* <img src={fontLogo} alt="fontLogo" /> */}
                {/* <Mui.Typography className={css.fontlogo}>
                  effortless
                </Mui.Typography> */}
              </Mui.Stack>
              <div className={css.signInContainer}>
                {/* <span className={css.titleInfo}>Forgot Password</span> */}
                {!validEmail && (
                  <>
                    <Mui.Typography className={css.pageTitle}>
                      Forget Password
                    </Mui.Typography>
                    <Mui.Typography className={css.pageSubTitle}>
                      The Finance OS for your Business
                    </Mui.Typography>
                    <Input
                      label="MOBILE NO"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      // inputProps={{
                      //   type: 'tel',
                      // }}
                      InputProps={{
                        inputComponent: MobileNumberFormatCustom,
                        // startAdornment: (
                        //   <Mui.InputAdornment
                        //     position="start"
                        //     sx={{ alignItems: 'center' }}
                        //   >
                        //     <Mui.Typography
                        //       color="#FFF"
                        //       sx={{ mt: '10px', fontSize: '14px' }}
                        //     >
                        //       +91
                        //     </Mui.Typography>
                        //   </Mui.InputAdornment>
                        // ),
                      }}
                      onChange={onInputChange(setPhoneNo)}
                      fullWidth
                      className={
                        errorMessage && !phoneNo
                          ? `${css.hasError} ${css.inputField}`
                          : css.inputField
                      }
                    />
                  </>
                )}
                {validEmail && !enterPasswordComp && !email && (
                  <>
                    <Mui.Typography className={css.pageTitle}>
                      Verification Code
                    </Mui.Typography>
                    <Mui.Typography className={css.pageSubTitle}>
                      We have sent you a verification code to your{' '}
                      <span style={{ color: '#F08B32' }}>+91 {phoneNo}</span>{' '}
                    </Mui.Typography>
                    <VerificationCodeInput
                      length={VCODE_LENGTH}
                      onChange={onOtpComplete}
                    />
                  </>
                )}
                {email && !emailVerify && (
                  <>
                    <Mui.Typography className={css.emailTitle}>
                      Choose Email ID
                    </Mui.Typography>
                    <Mui.Typography
                      className={css.emailSubTitle}
                      sx={{ color: '#FFFFFF !important' }}
                    >
                      Email IDs associated with your Mobile Number
                      {/* <span style={{ color: '#F08B32' }}>+91 {phoneNo}</span>{' '} */}
                    </Mui.Typography>
                    <Autocomplete
                      // {...defaultProps}
                      id="auto-complete"
                      options={emailList?.map((val) => val?.email)}
                      getOptionLabel={(option) => option}
                      classes={{
                        root: classes.root,
                        noOptions: classes.noOptions,
                      }}
                      onChange={(e, newValue) => {
                        ChangeEmailSelection(newValue);
                      }}
                      PaperComponent={({ children }) => (
                        <Paper
                          style={{
                            background: '#2F1C0D',
                            border: '1px solid #F08B32',
                            color: 'white',
                          }}
                        >
                          {children}
                        </Paper>
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
                  </>
                )}
                {emailVerify && !passwordEmail && (
                  <>
                    <Mui.Typography className={css.pageTitle}>
                      Verification Code
                    </Mui.Typography>
                    <Mui.Typography className={css.pageSubTitle}>
                      We have sent you a verification code to your{' '}
                      <span style={{ color: '#F08B32' }}>
                        {chooseMailId?.email}
                      </span>{' '}
                    </Mui.Typography>
                    <VerificationCodeInput
                      length={VCODE_LENGTH}
                      onChange={onOtpEmailComplete}
                    />
                  </>
                )}

                {passwordEmail && (
                  <>
                    <Mui.Typography className={css.pageTitle}>
                      Reset Your Password
                    </Mui.Typography>
                    <Mui.Typography className={css.pageSubTitle}>
                      The Finance OS for your Business
                    </Mui.Typography>
                    <Mui.Stack
                      direction="column"
                      spacing={5}
                      // className={css.space}
                    >
                      <Input
                        label="PASSWORD"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          type: showPassword ? 'text' : 'password',
                        }}
                        autoComplete="new-password"
                        fullWidth
                        className={
                          errorMessage && !password
                            ? `${css.hasError} ${css.inputField} ${classes.root}`
                            : `${css.inputField} ${classes.root}`
                        }
                        onChange={onInputChange(setPassword)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={togglePassword}
                                edge="end"
                                style={{ color: '#fff' }}
                              >
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Input
                        label="CONFIRM PASSWORD"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          type: showConfirmPassword ? 'text' : 'password',
                        }}
                        fullWidth
                        autoComplete="new-password"
                        className={
                          errorMessage && !confirmPassword
                            ? `${css.hasError} ${css.inputField} ${classes.root}`
                            : `${css.inputField} ${classes.root}`
                        }
                        onChange={onInputChange(setConfirmPassword)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={toggleConfirmPassword}
                                edge="end"
                                style={{ color: '#fff' }}
                              >
                                {showConfirmPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Mui.Stack>
                  </>
                )}
                {validEmail && enterPasswordComp && showCompanyComponent && (
                  <>
                    <Mui.Typography className={css.pageTitle}>
                      Select Company
                    </Mui.Typography>
                    <Autocomplete
                      // {...defaultProps}
                      id="auto-complete"
                      options={COMPANY_LIST}
                      getOptionLabel={(option) => option.title}
                      classes={{
                        root: classes.root,
                        noOptions: classes.noOptions,
                      }}
                      PaperComponent={({ children }) => (
                        <Paper
                          style={{
                            background: '#2F1C0D',
                            border: '1px solid #F08B32',
                            color: 'white',
                          }}
                        >
                          {children}
                        </Paper>
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
                  </>
                )}

                {errorMessage && (
                  <div className={css.errorContainer}>
                    <InfoOutlinedIcon fontSize="small" />{' '}
                    <span className={css.errorText}>{errorMessage}</span>
                  </div>
                )}
                {emailVerify && !passwordEmail && (
                  <>
                    <Mui.Button
                      variant="contained"
                      className={css.submitButton}
                      fullWidth
                      onClick={enterOTPConfirm}
                    >
                      Submit
                    </Mui.Button>
                    <div
                      className={css.footerLink}
                      onClick={ChooseMailSubmit}
                      aria-hidden="true"
                    >
                      Didn&apos;t receive code?{' '}
                      <span style={{ color: '#36E3C0', marginLeft: '3px' }}>
                        {' '}
                        Request again
                      </span>
                    </div>
                  </>
                )}
                {email &&
                  !emailVerify &&
                  (chooseMailId?.sign_up_method === 'google' ? (
                    <div className={`${css.oAuthContainerForgot}`}>
                      <div onClick={() => googleLoginWeb()} aria-hidden="true">
                        <span className={css.icons}>
                          <GoogleSvgIcon />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Mui.Button
                      variant="contained"
                      className={css.submitButton}
                      fullWidth
                      onClick={ChooseMailSubmit}
                    >
                      Submit
                    </Mui.Button>
                  ))}
                {passwordEmail && (
                  <Mui.Button
                    variant="contained"
                    className={css.submitButton}
                    fullWidth
                    onClick={PasswordSubmit}
                  >
                    Submit
                  </Mui.Button>
                )}
                {!email && (
                  <Button
                    variant="contained"
                    className={css.submitButton}
                    fullWidth
                    onClick={
                      validEmail && !enterPasswordComp
                        ? SubmitOTP
                        : submitButtonHandler
                    }
                  >
                    {validEmail && !enterPasswordComp ? 'Submit' : 'Send OTP'}
                  </Button>
                )}

                {!validEmail && (
                  <div
                    className={css.footerLink}
                    onClick={() => {
                      changeView('signIn');
                      navigate('/');
                    }}
                    onKeyDown={() => {
                      changeView('signIn');
                      navigate('/');
                    }}
                    aria-hidden="true"
                  >
                    Remembered your password?{' '}
                    <span style={{ color: '#36E3C0', marginLeft: '3px' }}>
                      {' '}
                      <span className={css.greenColorText}>Sign in &gt;</span>
                    </span>
                  </div>
                )}
                {validEmail && !enterPasswordComp && !email && (
                  <div
                    className={css.footerLink}
                    onClick={onValidateEmail}
                    //   changeView('signIn');
                    //   navigate('/');
                    // }}
                    // onKeyDown={() => {
                    //   changeView('signIn');
                    //   navigate('/');
                    // }}
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
            </div>
            <Mui.Stack className={css.ellipseStack}>
              <img src={ellipse} alt="ellipse" style={{ width: '70px' }} />
            </Mui.Stack>
          </Mui.Grid>
        </Mui.Grid>
      ) : (
        <>
          <div className={css.loginContainer}>
            {/* <div className={css.introHeaderContainer}>
          <span className={css.appName}>Effortless</span>
        </div> */}
            <Mui.Stack direction="row">
              <img
                src={flowerMobileLogo}
                alt="flowerLogo"
                style={{
                  width: '200px',
                  marginLeft: '-8px',
                  marginBottom: '31px',
                }}
              />
              {/* <Mui.Typography className={css.fontlogo}>
                effortless
              </Mui.Typography> */}
            </Mui.Stack>
            <div className={css.signInContainer}>
              {/* <span className={css.titleInfo}>Forgot Password</span> */}
              {!validEmail && (
                <>
                  <Mui.Typography className={css.pageTitle}>
                    Forget Password
                  </Mui.Typography>
                  <Mui.Typography className={css.pageSubTitle}>
                    The Finance OS for your Business
                  </Mui.Typography>
                  <Input
                    label="MOBILE NO."
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    // inputProps={{
                    //   type: 'tel',
                    // }}
                    // type="number"
                    InputProps={{
                      inputComponent: MobileNumberFormatCustom,
                      // startAdornment: (
                      //   <Mui.InputAdornment
                      //     position="start"
                      //     sx={{ alignItems: 'center' }}
                      //   >
                      //     <Mui.Typography
                      //       color="#FFF"
                      //       sx={{ mt: '10px', fontSize: '14px' }}
                      //     >
                      //       +91
                      //     </Mui.Typography>
                      //   </Mui.InputAdornment>
                      // ),
                    }}
                    onChange={onInputChange(setPhoneNo)}
                    fullWidth
                    className={
                      errorMessage && !phoneNo
                        ? `${css.hasError} ${css.inputField}`
                        : css.inputField
                    }
                  />
                </>
              )}

              {validEmail && !enterPasswordComp && !email && (
                <>
                  <Mui.Typography className={css.pageTitle}>
                    Verification Code
                  </Mui.Typography>
                  <Mui.Typography className={css.pageSubTitle}>
                    We have sent you a verification code to your{' '}
                    <span style={{ color: '#F08B32' }}>+91 {phoneNo}</span>{' '}
                  </Mui.Typography>
                  <VerificationCodeInput
                    length={VCODE_LENGTH}
                    onChange={onOtpComplete}
                  />
                </>
              )}
              {email && !emailVerify && (
                <>
                  <Mui.Typography className={css.emailTitle}>
                    Choose Email ID
                  </Mui.Typography>
                  <Mui.Typography
                    className={css.emailSubTitle}
                    sx={{ color: '#FFFFFF !important' }}
                  >
                    Email IDs associated with your Mobile Number
                    {/* <span style={{ color: '#F08B32' }}>+91 {phoneNo}</span>{' '} */}
                  </Mui.Typography>
                  <Autocomplete
                    // {...defaultProps}
                    id="auto-complete"
                    options={emailList?.map((val) => val?.email)}
                    getOptionLabel={(option) => option}
                    classes={{
                      root: classes.root,
                      noOptions: classes.noOptions,
                    }}
                    onChange={(e, newValue) => {
                      ChangeEmailSelection(newValue);
                    }}
                    PaperComponent={({ children }) => (
                      <Paper
                        style={{
                          background: '#2F1C0D',
                          border: '1px solid #F08B32',
                          color: 'white',
                        }}
                      >
                        {children}
                      </Paper>
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
                </>
              )}
              {emailVerify && !passwordEmail && (
                <>
                  <Mui.Typography className={css.pageTitle}>
                    Verification Code
                  </Mui.Typography>
                  <Mui.Typography className={css.pageSubTitle}>
                    We have sent you a verification code to your{' '}
                    <span style={{ color: '#F08B32' }}>
                      {chooseMailId?.email}
                    </span>{' '}
                  </Mui.Typography>
                  <VerificationCodeInput
                    length={VCODE_LENGTH}
                    onChange={onOtpEmailComplete}
                  />
                </>
              )}

              {passwordEmail && (
                <>
                  <Mui.Typography className={css.pageTitle}>
                    Reset Your Password
                  </Mui.Typography>
                  <Mui.Typography className={css.pageSubTitle}>
                    The Finance OS for your Business
                  </Mui.Typography>
                  <Mui.Stack
                    direction="column"
                    spacing={5}
                    // className={css.space}
                  >
                    <Input
                      label="PASSWORD"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        type: showPassword ? 'text' : 'password',
                      }}
                      autoComplete="new-password"
                      fullWidth
                      className={
                        errorMessage && !password
                          ? `${css.hasError} ${css.inputField} ${classes.root}`
                          : `${css.inputField} ${classes.root}`
                      }
                      onChange={onInputChange(setPassword)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={togglePassword}
                              edge="end"
                              style={{ color: '#fff' }}
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Input
                      label="CONFIRM PASSWORD"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        type: showConfirmPassword ? 'text' : 'password',
                      }}
                      fullWidth
                      autoComplete="new-password"
                      className={
                        errorMessage && !confirmPassword
                          ? `${css.hasError} ${css.inputField} ${classes.root}`
                          : `${css.inputField} ${classes.root}`
                      }
                      onChange={onInputChange(setConfirmPassword)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={toggleConfirmPassword}
                              edge="end"
                              style={{ color: '#fff' }}
                            >
                              {showConfirmPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Mui.Stack>
                </>
              )}
              {validEmail && enterPasswordComp && showCompanyComponent && (
                <>
                  <Mui.Typography className={css.pageTitle}>
                    Select Company
                  </Mui.Typography>
                  <Autocomplete
                    // {...defaultProps}
                    id="auto-complete"
                    options={COMPANY_LIST}
                    getOptionLabel={(option) => option.title}
                    classes={{
                      root: classes.root,
                      noOptions: classes.noOptions,
                    }}
                    PaperComponent={({ children }) => (
                      <Paper
                        style={{
                          background: '#2F1C0D',
                          border: '1px solid #F08B32',
                          color: 'white',
                        }}
                      >
                        {children}
                      </Paper>
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
                </>
              )}

              {errorMessage && (
                <div className={css.errorContainer}>
                  <InfoOutlinedIcon fontSize="small" />{' '}
                  <span className={css.errorText}>{errorMessage}</span>
                </div>
              )}
              {emailVerify && !passwordEmail && (
                <>
                  <Mui.Button
                    variant="contained"
                    className={css.submitButton}
                    fullWidth
                    onClick={enterOTPConfirm}
                  >
                    Submit
                  </Mui.Button>
                  <div
                    className={css.footerLink}
                    onClick={ChooseMailSubmit}
                    aria-hidden="true"
                  >
                    Didn&apos;t receive code?{' '}
                    <span style={{ color: '#36E3C0', marginLeft: '3px' }}>
                      {' '}
                      Request again
                    </span>
                  </div>
                </>
              )}
              {email &&
                !emailVerify &&
                (chooseMailId?.sign_up_method === 'google' ? (
                  <div className={`${css.oAuthContainerForgot}`}>
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
                  <Mui.Button
                    variant="contained"
                    className={css.submitButton}
                    fullWidth
                    onClick={ChooseMailSubmit}
                  >
                    Submit
                  </Mui.Button>
                ))}
              {passwordEmail && (
                <Mui.Button
                  variant="contained"
                  className={css.submitButton}
                  fullWidth
                  onClick={PasswordSubmit}
                >
                  Submit
                </Mui.Button>
              )}
              {!email && (
                <Button
                  variant="contained"
                  className={css.submitButton}
                  fullWidth
                  onClick={
                    validEmail && !enterPasswordComp
                      ? SubmitOTP
                      : submitButtonHandler
                  }
                >
                  {validEmail && !enterPasswordComp ? 'Submit' : 'Send OTP'}
                </Button>
              )}

              {!validEmail && (
                <div
                  className={css.footerLink}
                  onClick={() => {
                    changeView('signIn');
                    navigate('/');
                  }}
                  onKeyDown={() => {
                    changeView('signIn');
                    navigate('/');
                  }}
                  aria-hidden="true"
                >
                  Remembered your password?{' '}
                  <span style={{ color: '#36E3C0', marginLeft: '3px' }}>
                    {' '}
                    Sign in &gt;
                  </span>
                </div>
              )}
              {validEmail && !enterPasswordComp && !email && (
                <div
                  className={css.footerLink}
                  onClick={onValidateEmail}
                  //   changeView('signIn');
                  //   navigate('/');
                  // }}
                  // onKeyDown={() => {
                  //   changeView('signIn');
                  //   navigate('/');
                  // }}
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
          </div>
        </>
      )}
      {OnBackEventHandle()}
    </>
  );
};

export default ForgotPasswordContainer;
