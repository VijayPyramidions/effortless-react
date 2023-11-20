/* @flow */
/**
 * @fileoverview SignUp container
 */

import React, { useState, useContext, useRef } from 'react';
import JSBridge from '@nativeBridge/jsbridge';
import Button from '@material-ui/core/Button';
// import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import * as Mui from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import SvgIcon from '@material-ui/core/SvgIcon';
import Input, { MobileNumberFormatCustom } from '@components/Input/Input.jsx';
import Grid from '@material-ui/core/Grid';
import AppContext from '@root/AppContext.jsx';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { extractErrorMessage } from '@root/Utilities.js';
import { IntroHeader } from '@core/LoginContainer/SignInContainer.jsx';
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateName,
} from '@services/Validation.jsx';
import SimpleSnackbar from '@components/SnackBarContainer/CustomSnackBar.jsx';
import * as Router from 'react-router-dom';

import * as css from './SignInContainer.scss';
import login from '../../assets/loginScreen.svg';
import flowerLogo from '../../assets/WebLogo.png';

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

const SignUpContainer = () => {
  const { signUpSubmit, changeView, enableLoading, openSnackBar } =
    useContext(AppContext);
  const emailPassword = useRef(null);
  const [fullname, setFullrname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState();
  const [validationErr, setValidationErr] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
    name: false,
  });
  const [errorMsgDetails, setErrorMsgDetails] = useState({
    fieldName: '',
    errorMessage: '',
  });
  const navigate = Router.useNavigate();
  const { state } = Router.useLocation();
  const [agreeCheck, setAgreeCheck] = React.useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [SigUpWithGoogle, setSigUpWithGoogle] = React.useState({
    googleSignUp: false,
    response: {},
  });
  // const device = localStorage.getItem('device_detect');

  React.useEffect(() => {
    if (state?.backPayload?.provider?.googleSignUp) {
      setPhoneNo(state?.backPayload?.phoneNo);
      setUserId(state?.backPayload?.id);
      setSigUpWithGoogle({
        googleSignUp: true,
        response: state?.backPayload?.provider?.response,
      });
    } else if (state?.backPayload) {
      setFullrname(state?.backPayload?.fullname);
      setUsername(state?.backPayload?.username);
      setPhoneNo(state?.backPayload?.phoneNo);
      setPassword(state?.backPayload?.password);
      setConfirmPassword(state?.backPayload?.confirmPassword);
      setUserId(state?.backPayload?.id);
    }
  }, [state]);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const nameValid = validateName(fullname);
    const emailValid = validateEmail(username);
    const passwordValid = validatePassword(password);
    const confirmValid =
      confirmPassword?.length === 0 ? false : password === confirmPassword;
    const phoneValid = validatePhone(phoneNo);
    const userIdPatch = userId ? `/${userId}` : '';
    if (!emailValid || !passwordValid || !phoneValid) {
      setValidationErr(() => ({
        name: !nameValid,
        email: !emailValid,
        password: !passwordValid,
        confirmPassword: !confirmValid,
        phone: !phoneValid,
      }));
      return;
    }

    if (password?.length < 8 || confirmPassword?.length < 8) {
      setValidationErr((s) => ({
        ...s,
        password: true,
        confirmPassword: true,
      }));
      return;
    }

    if (!agreeCheck) {
      setOpenSnack(true);
      return;
    }

    enableLoading(true);
    if (password === confirmPassword) {
      RestApi(`registrations${userIdPatch}`, {
        method: userId ? METHOD.PATCH : METHOD.POST,
        payload: {
          name: fullname,
          email: username,
          mobile_number: phoneNo,
          password,
          password_confirmation: password,
        },
      })
        .then((res) => {
          if (res) {
            if (res.error) {
              openSnackBar({
                message: Object.values(res.errors)[0],
                type: MESSAGE_TYPE.ERROR,
              });
              const errorMessages = extractErrorMessage(res.errors);
              const setErr = {
                fieldName: errorMessages.map((v) => v.fieldName)[0],
                errorMessage: errorMessages.map((v) => v.fieldErrorMsg)[0],
              };
              setHasError(true);
              //   setErrorMsgDetails({
              //     fieldName: errorMessages.map(v => v.fieldName)[0],
              //     errorMessage:errorMessages.map(v => v.fieldErrorMsg)[0]
              // });
              setErrorMsgDetails(setErr);
              setErrorMessage(
                errorMessages.map((v) => (
                  <span>{`${v.fieldName}: ${v.fieldErrorMsg}`}</span>
                )),
              );
              enableLoading(false);
              return;
            }
            setUserId(res.id);
            signUpSubmit({
              userId: res.id,
              email: res.email,
              phoneNo: res.mobile_number,
            });
            navigate('/verification', {
              state: {
                payload: {
                  fullname,
                  username,
                  confirmPassword,
                  phoneNo,
                  password,
                  id: res.id,
                  type: 'registration',
                },
              },
            });
          } else {
            setErrorMessage('Something went wrong');
          }
          enableLoading(false);
        })
        .catch((error) => {
          enableLoading(false);
          setErrorMessage('Something went wrong');
          throw new Error(error);
        });
    } else {
      enableLoading(false);
      setValidationErr(() => ({
        name: !nameValid,
        email: !emailValid,
        password: !passwordValid,
        confirmPassword: !confirmValid,
        phone: !phoneValid,
      }));
    }
  };

  const onGoogleSubmit = () => {
    const phoneValid = validatePhone(phoneNo);
    // const userIdPatch = userId ? `/${userId}` : '';
    if (!phoneValid) {
      setValidationErr((prev) => ({
        ...prev,
        phone: !phoneValid,
      }));
      return;
    }

    if (!agreeCheck) {
      setOpenSnack(true);
      return;
    }

    RestApi(`social_login/send_otp`, {
      method: METHOD.POST,
      payload: {
        mobile_number: phoneNo,
        id: userId || SigUpWithGoogle?.response?.id,
      },
    })
      .then((res) => {
        if (res) {
          if (res?.error) {
            openSnackBar({
              message: res?.message || 'Unknown error occured',
              type: MESSAGE_TYPE.ERROR,
            });
            enableLoading(false);
            return;
          }
          openSnackBar({
            message: res?.message,
            type: MESSAGE_TYPE.INFO,
          });
          setUserId(
            SigUpWithGoogle?.response?.user?.user_id ||
              SigUpWithGoogle?.response?.id,
          );
          signUpSubmit({
            userId:
              SigUpWithGoogle?.response?.user?.user_id ||
              SigUpWithGoogle?.response?.id,
            email: SigUpWithGoogle?.response?.user?.email,
            phoneNo,
          });
          navigate('/verification', {
            state: {
              payload: {
                phoneNo,
                id:
                  userId ||
                  SigUpWithGoogle?.response?.user?.user_id ||
                  SigUpWithGoogle?.response?.id,
                provider: SigUpWithGoogle,
                type: 'session',
              },
            },
          });
        } else {
          setErrorMessage('Something went wrong');
        }
        enableLoading(false);
      })
      .catch((error) => {
        enableLoading(false);
        setErrorMessage('Something went wrong');
        throw new Error(error);
      });
  };

  const highlightErrorField = (fieldName) =>
    JSON.stringify(errorMessage).includes(fieldName);

  const onChangeView = () => {
    changeView('signIn');
    navigate('/');
  };

  const onInputBlur = (e) => {
    const name = e?.target?.name.trim();
    const value = e?.target?.value.trim();
    const isValid = {
      name: validateName,
      email: validateEmail,
      password: validatePassword,
      phone: validatePhone,
    };
    setValidationErr((s) => ({ ...s, [name]: !isValid?.[name]?.(value) }));
    if (name === 'confirmPassword') {
      const confirmValid = value === password;
      setValidationErr((s) => ({ ...s, confirmPassword: !confirmValid }));
    }
  };

  const onInputChange = (setter) => (e) => {
    onInputBlur(e);
    if (setter === setFullrname) {
      setter(e.target.value);
    } else {
      setter(e.target.value.trim());
    }
  };

  const resetErrorMessage = () => {
    setErrorMessage('');
    setValidationErr({
      name: false,
      email: false,
      phone: false,
      password: false,
      confirmPassword: false,
    });
  };

  const onAuthClick = (authType) => {
    resetErrorMessage();
    if (authType === 'google') {
      JSBridge.launchGoogleSignIN();
    } else if (authType === 'apple') {
      JSBridge.launchAppleSignIN();
    }
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
            // eslint-disable-next-line no-lonely-if
            if (res?.new_user) {
              setSigUpWithGoogle({
                googleSignUp: true,
                response: res,
              });
            } else if (!res?.new_user) {
              openSnackBar({
                message: 'This email-id is already used.',
                type: MESSAGE_TYPE.WARNING,
              });
            }
          }
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const googleSignWeb = useGoogleLogin({
    onSuccess: (tokenResponse) => autoLoginListener(tokenResponse),
    flow: 'auth-code',
    auto_select: true,
  });

  const theme = Mui.useTheme();
  const desktopView = Mui.useMediaQuery(theme.breakpoints.up('sm'));

  return (
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
              <Mui.Stack spacing={2} className={css.loginFormContainerSignup}>
                <Mui.Stack className={css.loginFormContainerMain}>
                  <Mui.Stack direction="row">
                    <img
                      src={flowerLogo}
                      alt="flowerLogo"
                      style={{ width: '250px', marginLeft: '-1px' }}
                    />
                    {/* <Mui.Typography className={css.fontlogo}>
                      effortless
                    </Mui.Typography> */}
                  </Mui.Stack>
                  <Mui.Stack>
                    <Mui.Typography className={css.loginFont}>
                      Create account
                    </Mui.Typography>
                    <Mui.Typography className={css.loginSubFont}>
                      The Finance OS for your Business
                    </Mui.Typography>
                  </Mui.Stack>

                  {!SigUpWithGoogle?.googleSignUp && (
                    <Mui.Grid
                      className={css.inputStack1}
                      container
                      spacing={2.3}
                    >
                      <Mui.Grid item md={12}>
                        <Input
                          name="name"
                          onBlur={onInputBlur}
                          error={validationErr.name}
                          helperText={
                            validationErr.name
                              ? 'Please provide valid input'
                              : ''
                          }
                          label="FULL NAME"
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          className={css.inputField}
                          onChange={onInputChange(setFullrname)}
                          value={fullname}
                          autoComplete="off"
                        />
                      </Mui.Grid>
                      <Mui.Grid item md={12}>
                        <Input
                          name="phone"
                          label="PHONE NO"
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            inputComponent: MobileNumberFormatCustom,
                          }}
                          // type="number"
                          // inputProps={{
                          //   type: 'tel',
                          // }}
                          error={validationErr.phone}
                          helperText={
                            validationErr.phone
                              ? 'Please provide valid input'
                              : ''
                          }
                          onBlur={onInputBlur}
                          fullWidth
                          className={
                            (hasError && !phoneNo) ||
                            highlightErrorField('mobile_number')
                              ? `${css.hasError} ${css.inputField}`
                              : css.inputField
                          }
                          // onChange={onInputChange(setPhoneNo)}
                          // onChange={(e) => setPhoneNo(e?.target?.value)}
                          onChange={onInputChange(setPhoneNo)}
                          value={phoneNo}
                          autoComplete="off"
                        />
                      </Mui.Grid>
                      <Mui.Grid item md={12}>
                        <Input
                          name="email"
                          label="EMAIL"
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={
                            errorMsgDetails?.fieldName === 'email' ||
                            validationErr.email
                          }
                          helperText={
                            (errorMsgDetails?.fieldName === 'email' &&
                              errorMsgDetails?.errorMessage) ||
                            (validationErr.email &&
                              'Please provide valid input') ||
                            ''
                          }
                          onBlur={onInputBlur}
                          fullWidth
                          className={
                            (hasError && !username) ||
                            highlightErrorField('email')
                              ? `${css.hasError} ${css.inputField}`
                              : css.inputField
                          }
                          onChange={onInputChange(setUsername)}
                          value={username}
                          autoComplete="off"
                        />
                      </Mui.Grid>
                      <Mui.Grid item md={12}>
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
                              ? (password.length < 8 &&
                                  'Password length must be minimum of 8 characters') ||
                                'Please provide correct input'
                              : ''
                          }
                          onBlur={onInputBlur}
                          fullWidth
                          className={
                            errorMsgDetails?.fieldName === 'passowrd'
                              ? `${css.hasError} ${css.inputField}`
                              : css.inputField
                          }
                          onChange={onInputChange(setPassword)}
                          value={password}
                          autoComplete="off"
                        />
                      </Mui.Grid>
                      <Mui.Grid item md={12}>
                        <Input
                          inputRef={emailPassword}
                          name="confirmPassword"
                          label="CONFIRM PASSWORD"
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            type: showConfirmPassword ? 'password' : 'text',
                            endAdornment: (
                              <Mui.InputAdornment
                                position="end"
                                onClick={handleClickShowConfirmPassword}
                              >
                                <Mui.IconButton
                                  size="small"
                                  style={{ color: '#fff' }}
                                >
                                  {showConfirmPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </Mui.IconButton>
                              </Mui.InputAdornment>
                            ),
                          }}
                          error={validationErr.confirmPassword}
                          helperText={
                            validationErr.confirmPassword
                              ? (confirmPassword.length < 8 &&
                                  'Password length must be minimum of 8 characters') ||
                                'Please provide correct input'
                              : ''
                          }
                          onBlur={onInputBlur}
                          fullWidth
                          className={
                            errorMsgDetails?.fieldName === 'passowrd'
                              ? `${css.hasError} ${css.inputField}`
                              : css.inputField
                          }
                          onChange={onInputChange(setConfirmPassword)}
                          value={confirmPassword}
                          autoComplete="off"
                        />
                      </Mui.Grid>
                    </Mui.Grid>
                  )}

                  {SigUpWithGoogle?.googleSignUp && (
                    <Mui.Grid
                      className={css.inputStack1}
                      container
                      spacing={2.3}
                      py={14}
                    >
                      <Mui.Grid item md={12}>
                        <Input
                          name="phone"
                          label="PHONE NO"
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            inputComponent: MobileNumberFormatCustom,
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
                            (hasError && !phoneNo) ||
                            highlightErrorField('mobile_number')
                              ? `${css.hasError} ${css.inputField}`
                              : css.inputField
                          }
                          onChange={(e) => setPhoneNo(e?.target?.value)}
                          value={phoneNo}
                          autoComplete="off"
                        />
                      </Mui.Grid>
                    </Mui.Grid>
                  )}

                  <Mui.Stack mt={0} className={css.rememberMeSection}>
                    <Mui.Stack
                      direction="row"
                      style={{
                        width: '452px',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Mui.Stack direction="row" alignItems="center">
                        <CustomCheckbox style={{ color: 'white' }} />
                        <Mui.Typography className={css.checkboxText}>
                          remember me
                        </Mui.Typography>
                      </Mui.Stack>
                    </Mui.Stack>
                    <Mui.Stack direction="row" alignItems="center">
                      <CustomCheckbox
                        style={{ color: 'white' }}
                        checked={agreeCheck}
                        onChange={() => setAgreeCheck(!agreeCheck)}
                      />
                      <Mui.Typography className={css.checkboxText}>
                        I agree to all the
                        <a
                          href="https://goeffortless.ai/#/terms-of-use"
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: '#36e3c0',
                            marginLeft: '3px',
                            marginRight: '3px',
                          }}
                        >
                          Terms
                        </a>
                        and
                        <a
                          href="https://goeffortless.ai/#/privacy-policy"
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#36e3c0', marginLeft: '3px' }}
                        >
                          Privacy policy
                        </a>
                      </Mui.Typography>
                    </Mui.Stack>
                  </Mui.Stack>

                  <Mui.Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      className={css.loginBtn}
                      fullWidth
                      onClick={(e) => {
                        if (!SigUpWithGoogle?.googleSignUp) {
                          onSubmit(e);
                        } else {
                          onGoogleSubmit();
                        }
                      }}
                    >
                      <Mui.Typography className={css.loginBtnText}>
                        next
                      </Mui.Typography>
                    </Button>

                    <Mui.Button
                      onClick={() => googleSignWeb()}
                      className={css.siginBtn}
                    >
                      <GoogleSvgIcon />
                    </Mui.Button>
                  </Mui.Stack>

                  <Mui.Stack direction="row" mt={2}>
                    <img src={googlebatch} alt="googlebatch" />
                    <img src={appstorebatch} alt="appstorebatch" />
                  </Mui.Stack>
                  <Mui.Stack
                    direction="row"
                    className={css.footerLink}
                    onClick={onChangeView}
                    onKeyDown={onChangeView}
                    aria-hidden="true"
                  >
                    Already have an Account?{' '}
                    <span className={css.greenColorText}>
                      {' '}
                      &nbsp;Sign in &gt;
                    </span>
                  </Mui.Stack>
                </Mui.Stack>
              </Mui.Stack>
            </Mui.Grid>
            <Mui.Stack className={css.ellipseStack}>
              <img src={ellipse} alt="ellipse" style={{ width: '70px' }} />
            </Mui.Stack>
          </Mui.Grid>
        </>
      ) : (
        <Mui.Stack className={`${css.loginContainer} ${css.paddingForSignUp}`}>
          {/* <Mui.Stack direction="row">
            <img src={flowerLogo} alt="flowerLogo" style={{ width: '10%' }} />
            <Mui.Typography className={css.fontlogo}>effortless</Mui.Typography>
          </Mui.Stack> */}
          <IntroHeader onAuthClick={onAuthClick} view="signUp" />
          <div
            className={`${css.signInContainer} ${css.paddingForsignInContainer}`}
          >
            <span className={css.titleInfo}>Sign Up for Effortless</span>
            {!SigUpWithGoogle?.googleSignUp ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Input
                    name="name"
                    onBlur={onInputBlur}
                    error={validationErr.name}
                    helperText={
                      validationErr.name ? 'Please provide valid input' : ''
                    }
                    label="FULL NAME"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    className={css.inputField}
                    onChange={onInputChange(setFullrname)}
                    value={fullname}
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    name="phone"
                    label="PHONE NO"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputComponent: MobileNumberFormatCustom,
                    }}
                    // type="number"
                    // inputProps={{
                    //   type: 'tel',
                    // }}
                    error={validationErr.phone}
                    helperText={
                      validationErr.phone ? 'Please provide valid input' : ''
                    }
                    onBlur={onInputBlur}
                    fullWidth
                    className={
                      (hasError && !phoneNo) ||
                      highlightErrorField('mobile_number')
                        ? `${css.hasError} ${css.inputField}`
                        : css.inputField
                    }
                    onChange={onInputChange(setPhoneNo)}
                    // onChange={(e) => setPhoneNo(e?.target?.value)}
                    value={phoneNo}
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    name="email"
                    label="EMAIL"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={
                      errorMsgDetails?.fieldName === 'email' ||
                      validationErr.email
                    }
                    helperText={
                      (errorMsgDetails?.fieldName === 'email' &&
                        errorMsgDetails?.errorMessage) ||
                      (validationErr.email && 'Please provide valid input') ||
                      ''
                    }
                    onBlur={onInputBlur}
                    fullWidth
                    className={
                      (hasError && !username) || highlightErrorField('email')
                        ? `${css.hasError} ${css.inputField}`
                        : css.inputField
                    }
                    onChange={onInputChange(setUsername)}
                    value={username}
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </Mui.IconButton>
                        </Mui.InputAdornment>
                      ),
                    }}
                    error={validationErr.password}
                    helperText={
                      validationErr.password
                        ? (password.length < 8 &&
                            'Password length must be minimum of 8 characters') ||
                          'Please provide correct input'
                        : ''
                    }
                    onBlur={onInputBlur}
                    fullWidth
                    className={
                      errorMsgDetails?.fieldName === 'passowrd'
                        ? `${css.hasError} ${css.inputField}`
                        : css.inputField
                    }
                    onChange={onInputChange(setPassword)}
                    value={password}
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    inputRef={emailPassword}
                    name="confirmPassword"
                    label="CONFIRM PASSWORD"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      type: showConfirmPassword ? 'password' : 'text',
                      endAdornment: (
                        <Mui.InputAdornment
                          position="end"
                          onClick={handleClickShowConfirmPassword}
                        >
                          <Mui.IconButton
                            size="small"
                            style={{ color: '#fff' }}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </Mui.IconButton>
                        </Mui.InputAdornment>
                      ),
                    }}
                    error={validationErr.confirmPassword}
                    helperText={
                      validationErr.confirmPassword
                        ? (confirmPassword.length < 8 &&
                            'Password length must be minimum of 8 characters') ||
                          'Please provide correct input'
                        : ''
                    }
                    onBlur={onInputBlur}
                    fullWidth
                    className={
                      errorMsgDetails?.fieldName === 'passowrd'
                        ? `${css.hasError} ${css.inputField}`
                        : css.inputField
                    }
                    onChange={onInputChange(setConfirmPassword)}
                    value={confirmPassword}
                    autoComplete="off"
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {/* <Grid item xs={12}>
                <Input
                  name="name"
                  onBlur={onInputBlur}
                  error={validationErr.name}
                  helperText={
                    validationErr.name ? 'Please provide valid input' : ''
                  }
                  label="FULL NAME"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  className={css.inputField}
                  onChange={onInputChange(setFullrname)}
                  value={fullname}
                  autoComplete="off"
                />
              </Grid> */}
                <Grid item xs={12}>
                  <Input
                    name="phone"
                    label="PHONE NO"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputComponent: MobileNumberFormatCustom,
                    }}
                    // type="number"
                    // inputProps={{
                    //   type: 'tel',
                    // }}
                    error={validationErr.phone}
                    helperText={
                      validationErr.phone ? 'Please provide valid input' : ''
                    }
                    onBlur={onInputBlur}
                    fullWidth
                    className={
                      (hasError && !phoneNo) ||
                      highlightErrorField('mobile_number')
                        ? `${css.hasError} ${css.inputField}`
                        : css.inputField
                    }
                    onChange={onInputChange(setPhoneNo)}
                    // onChange={(e) => setPhoneNo(e?.target?.value)}
                    value={phoneNo}
                    autoComplete="off"
                  />
                </Grid>
                {/* <Grid item xs={12}>
                <Input
                  name="email"
                  label="EMAIL"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={
                    errorMsgDetails?.fieldName === 'email' ||
                    validationErr.email
                  }
                  helperText={
                    (errorMsgDetails?.fieldName === 'email' &&
                      errorMsgDetails?.errorMessage) ||
                    (validationErr.email && 'Please provide valid input') ||
                    ''
                  }
                  onBlur={onInputBlur}
                  fullWidth
                  className={
                    (hasError && !username) || highlightErrorField('email')
                      ? `${css.hasError} ${css.inputField}`
                      : css.inputField
                  }
                  onChange={onInputChange(setUsername)}
                  value={username}
                  autoComplete="off"
                />
              </Grid> */}
                {/* <Grid item xs={12}>
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </Mui.IconButton>
                        </Mui.InputAdornment>
                      ),
                    }}
                    error={validationErr.password}
                    helperText={
                      validationErr.password ? 'Please provide valid input' : ''
                    }
                    onBlur={onInputBlur}
                    fullWidth
                    className={
                      errorMsgDetails?.fieldName === 'passowrd'
                        ? `${css.hasError} ${css.inputField}`
                        : css.inputField
                    }
                    onChange={onInputChange(setPassword)}
                    value={password}
                    autoComplete="off"
                  />
                </Grid> */}
                {/* <Grid item xs={12}>
                  <Input
                    inputRef={emailPassword}
                    name="confirmPassword"
                    label="CONFIRM PASSWORD"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      type: showConfirmPassword ? 'password' : 'text',
                      endAdornment: (
                        <Mui.InputAdornment
                          position="end"
                          onClick={handleClickShowConfirmPassword}
                        >
                          <Mui.IconButton
                            size="small"
                            style={{ color: '#fff' }}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </Mui.IconButton>
                        </Mui.InputAdornment>
                      ),
                    }}
                    error={validationErr.confirmPassword}
                    helperText={
                      validationErr.confirmPassword
                        ? 'Please provide correct input'
                        : ''
                    }
                    onBlur={onInputBlur}
                    fullWidth
                    className={
                      errorMsgDetails?.fieldName === 'passowrd'
                        ? `${css.hasError} ${css.inputField}`
                        : css.inputField
                    }
                    onChange={onInputChange(setConfirmPassword)}
                    value={confirmPassword}
                    autoComplete="off"
                  />
                </Grid> */}
              </Grid>
            )}

            {/* {hasError ? (
               <div className={css.errorContainer}>
                 <InfoOutlinedIcon fontSize="small" />{' '}
                 <span className={css.errorText}>{errorMessage}</span>
               </div>
             ) : (
               ''
             )} */}

            <Mui.Stack mt={0} className={css.rememberMeSection}>
              <Mui.Stack
                direction="row"
                style={{
                  width: desktopView ? '452px' : 'auto',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'white',
                }}
              >
                <Mui.Stack direction="row" alignItems="center">
                  <CustomCheckbox
                    style={{ color: 'white', fontWeight: '300' }}
                  />
                  <Mui.Typography
                    className={css.checkboxText}
                    style={{ color: 'white', fontWeight: '300' }}
                  >
                    Remember me
                  </Mui.Typography>
                </Mui.Stack>
              </Mui.Stack>
              <Mui.Stack
                direction="row"
                alignItems="center"
                style={{ color: 'white' }}
              >
                <CustomCheckbox
                  style={{ color: 'white', fontWeight: '300' }}
                  checked={agreeCheck}
                  onChange={() => setAgreeCheck(!agreeCheck)}
                />
                <Mui.Typography
                  className={css.checkboxText}
                  style={{ color: 'white', fontWeight: '300' }}
                >
                  I agree to all the
                  <a
                    href="https://goeffortless.ai/#/terms-of-use"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#36e3c0',
                      marginLeft: '3px',
                      marginRight: '3px',
                    }}
                  >
                    Terms
                  </a>
                  and
                  <a
                    href="https://goeffortless.ai/#/privacy-policy"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#36e3c0', marginLeft: '3px' }}
                  >
                    Privacy policy
                  </a>
                </Mui.Typography>
              </Mui.Stack>
            </Mui.Stack>

            <Button
              variant="contained"
              className={css.submitButton}
              fullWidth
              onClick={(e) => {
                if (!SigUpWithGoogle?.googleSignUp) {
                  onSubmit(e);
                } else {
                  onGoogleSubmit();
                }
              }}
            >
              Sign Up
            </Button>

            <div
              className={css.footerLink}
              onClick={onChangeView}
              onKeyPress={onChangeView}
              aria-hidden="true"
            >
              Already have an Account?&nbsp;{' '}
              <span className={css.greenColorText}> Sign in &gt;</span>
            </div>
          </div>
        </Mui.Stack>
      )}
      <SimpleSnackbar
        openSnack={openSnack}
        message="Please Accept the Terms & Policy"
        setOpenSnack={setOpenSnack}
      />
    </>
  );
};

export default SignUpContainer;
