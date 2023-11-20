import React from 'react';

import RestApi, { METHOD } from '@services/RestApi.jsx';
import * as Mui from '@mui/material';
import Input from '@components/Input/Input.jsx';
import AppContext from '@root/AppContext.jsx';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as theme from '@root/theme.scss';
import * as Router from 'react-router-dom';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
// import SearchIcon from '@material-ui/icons/Search';
import { validatePasswordWithLength } from '@services/Validation.jsx';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {
  VerificationCodeInput,
  VCODE_LENGTH,
} from '@core/LoginContainer/VerificationCodeContainer.jsx';
// import ellipse from '../../assets/Ellipse 6.svg';

import {
  IconButton,
  InputAdornment,
  makeStyles,
  // withStyles,
} from '@material-ui/core';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import flowerLogo from '../../assets/WebLogo.png';
// import flowerMobileLogo from '../../assets/MobileLogo.png';
import * as css from './MemberRequest.scss';
import login from '../../assets/loginScreen.svg';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiInputAdornment-root .MuiButtonBase-root': {
      marginRight: '4px !important',
      color: theme.colorGray,
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

const MemberReq = () => {
  // const themes = useTheme();
  // const Mobile = useMediaQuery(themes.breakpoints.down('md'));
  const { enableLoading, openSnackBar } = React.useContext(AppContext);
  const navigate = Router.useNavigate();
  const classes = useStyles();
  const [openPage, setOpenPage] = React.useState({
    existingPWD: true,
    otp: false,
    validPwd: false,
  });
  const [value, setValue] = React.useState({
    oldPWD: '',
    OTP: '',
    password: '',
    confirmPassword: '',
  });

  const [showPWD, setShowPWD] = React.useState({
    showPassword: false,
    showConfirmPassword: false,
    validPwd: false,
  });

  const [errorMessage, setErrorMessage] = React.useState('');
  const [validationErr, setValidationErr] = React.useState({
    password: false,
    confirmPassword: false,
  });

  const reset_password_token = new URLSearchParams(window.location.search).get(
    'reset_password_token',
  );
  const organization_id = new URLSearchParams(window.location.search).get(
    'organization_id',
  );

  React.useEffect(() => {
    if (!organization_id || !reset_password_token) {
      navigate('/');
    }
  }, [organization_id, reset_password_token]);

  const submitExisting = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization_id}/members/validate_existing_password`,
      {
        method: METHOD.POST,
        // headers: {
        //   Authorization: `Bearer ${user.activeToken}`,
        // },
        payload: {
          reset_password_token,
          existing_password: value?.oldPWD,
          organization_id,
        },
      },
    )
      .then((res) => {
        if (res && !res.error && res?.message) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.INFO,
          });
          setOpenPage({
            existingPWD: false,
            otp: true,
            validPwd: false,
          });
        } else {
          openSnackBar({
            message:
              res?.error ||
              res?.message ||
              'Something Went Wrong, Please Try again',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((res) => {
        openSnackBar({
          message:
            res?.error ||
            res?.message ||
            'Something Went Wrong, Please Try again',
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  const submitOTP = () => {
    enableLoading(true);
    RestApi(`organizations/${organization_id}/members/validate_otp`, {
      method: METHOD.POST,
      // headers: {
      //   Authorization: `Bearer ${user.activeToken}`,
      // },
      payload: {
        reset_password_token,
        otp: value?.OTP,
      },
    })
      .then((res) => {
        if (res && !res.error && res?.message) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.INFO,
          });
          setOpenPage({
            existingPWD: false,
            otp: false,
            validPwd: true,
          });
        } else {
          openSnackBar({
            message: res?.error?.errors || 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((res) => {
        openSnackBar({
          message: res?.error?.errors || 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  const submitPassword = () => {
    enableLoading(true);
    RestApi(`organizations/${organization_id}/members/reset_password`, {
      method: METHOD.PATCH,
      // headers: {
      //   Authorization: `Bearer ${user.activeToken}`,
      // },
      payload: {
        reset_password_token,
        password: value.password,
        password_confirmation: value?.confirmPassword,
      },
    })
      .then((res) => {
        if (res && !res.error && res?.message) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.INFO,
          });
          navigate('/');
        } else {
          openSnackBar({
            message: res?.message || 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((res) => {
        openSnackBar({
          message: res?.error?.errors || 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };

  const onOtpComplete = (val) => setValue((prev) => ({ ...prev, OTP: val }));

  const reValidate = (ps) => {
    const [name, values] = [ps?.target?.name, ps?.target?.value];
    if (name === 'confirmPassword') {
      if (value.password === values) {
        setValidationErr((v) => ({
          ...v,
          [name]: false,
        }));
      } else {
        setValidationErr((v) => ({
          ...v,
          [name]: true,
        }));
      }
    } else {
      setValidationErr((v) => ({
        ...v,
        [name]: !validatePasswordWithLength(values),
      }));
    }
  };

  const handleClick = () => {
    if (openPage?.existingPWD) {
      if (!value?.oldPWD) {
        setErrorMessage('Please fill in required fields');
      } else {
        setErrorMessage('');
        submitExisting();
      }
    }
    if (openPage?.otp) {
      if (value?.OTP?.length <= 5) {
        setErrorMessage('Please fill in valid input');
      } else {
        setErrorMessage('');
        submitOTP();
      }
    }
    if (openPage?.validPwd) {
      const g = {
        password: !validatePasswordWithLength(value.password),
        confirmPassword: !validatePasswordWithLength(value.confirmPassword),
      };

      const valid = Object.values(g).every((val) => !val);

      if (!valid) {
        setValidationErr(g);
      } else if (value.password !== value.confirmPassword) {
        setValidationErr({
          password: false,
          confirmPassword: true,
        });
      } else if (valid && value.password === value.confirmPassword) {
        submitPassword();
      }
    }
  };

  const onInputChange = (setter) => (e) => {
    e.persist();
    if (openPage?.validPwd) {
      reValidate(e);
    }
    setValue((prev) => ({ ...prev, [setter]: e.target.value }));
  };

  return (
    // Mobile ? <>Desktop</> : <>Mobile</>

    <div className={css.loginContainerDesktop}>
      <Mui.Stack direction="row" style={{ margin: '1rem 0rem' }}>
        <img src={flowerLogo} alt="flowerLogo" style={{ width: '250px' }} />
        {/* <img src={fontLogo} alt="fontLogo" /> */}
        {/* <Mui.Typography className={css.fontlogo}>effortless</Mui.Typography> */}
      </Mui.Stack>

      <div className={css.signInContainer}>
        {openPage?.existingPWD && (
          <>
            <Mui.Typography className={css.pageTitle}>
              Enter Password
            </Mui.Typography>
            <Mui.Typography className={css.pageSubTitle}>
              Enter the existing password
            </Mui.Typography>
            <Input
              label="Password"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                type: showPWD.validPwd ? 'text' : 'password',
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowPWD((prev) => ({
                          ...prev,
                          validPwd: !showPWD?.validPwd,
                        }))
                      }
                      edge="end"
                      style={{ color: '#fff' }}
                    >
                      {showPWD.validPwd ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={value?.oldPWD}
              onChange={onInputChange('oldPWD')}
              fullWidth
              className={
                errorMessage && !value?.oldPWD
                  ? `${css.hasError} ${css.inputField}`
                  : css.inputField
              }
            />
          </>
        )}

        {<></>}

        {openPage?.otp && (
          <>
            <Mui.Typography className={css.pageTitle}>
              Verification Code
            </Mui.Typography>
            <Mui.Typography className={css.pageSubTitle}>
              We have sent you a verification code to your registered mobile
              number.
              {/* <span style={{ color: '#F08B32' }}>+91 {phoneNo}</span>{' '} */}
            </Mui.Typography>
            <VerificationCodeInput
              length={VCODE_LENGTH}
              onChange={onOtpComplete}
            />
          </>
        )}

        {openPage?.validPwd && (
          <>
            <Mui.Typography className={css.pageTitle}>
              Set Your Password
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
                  type: showPWD.showPassword ? 'text' : 'password',
                }}
                autoComplete="new-password"
                fullWidth
                className={
                  validationErr.password
                    ? `${css.hasError} ${css.inputField} ${classes.root}`
                    : `${css.inputField} ${classes.root}`
                }
                helperText={validationErr?.password ? 'Enter New Password' : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowPWD((prev) => ({
                            ...prev,
                            showPassword: !showPWD?.showPassword,
                          }))
                        }
                        edge="end"
                        style={{ color: '#fff' }}
                      >
                        {showPWD.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={value?.password}
                onChange={onInputChange('password')}
                name="password"
                onBlur={reValidate}
              />
              <Input
                name="confirmPassword"
                label="CONFIRM PASSWORD"
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  type: showPWD.showConfirmPassword ? 'text' : 'password',
                }}
                helperText={
                  validationErr?.confirmPassword
                    ? 'Enter Same as New Password'
                    : ''
                }
                fullWidth
                autoComplete="new-password"
                className={
                  validationErr.confirmPassword
                    ? `${css.hasError} ${css.inputField} ${classes.root}`
                    : `${css.inputField} ${classes.root}`
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowPWD((prev) => ({
                            ...prev,
                            showConfirmPassword: !showPWD?.showConfirmPassword,
                          }))
                        }
                        edge="end"
                        style={{ color: '#fff' }}
                      >
                        {showPWD.showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={value?.confirmPassword}
                onChange={onInputChange('confirmPassword')}
                onBlur={reValidate}
              />
            </Mui.Stack>
          </>
        )}

        {errorMessage && (
          <div className={css.errorContainer}>
            <InfoOutlinedIcon fontSize="small" />{' '}
            <span className={css.errorText}>{errorMessage}</span>
          </div>
        )}

        <Mui.Button
          variant="contained"
          className={css.submitButton}
          fullWidth
          onClick={
            () => handleClick()
            // validEmail && !enterPasswordComp
            //   ? SubmitOTP
            //   : submitButtonHandler
          }
        >
          {/* {validEmail && !enterPasswordComp ? 'Submit' : 'Send OTP'} */}
          {openPage?.existingPWD ? 'Proceed' : 'Submit'}
        </Mui.Button>
      </div>
    </div>
  );
};

const MemberReqRes = () => {
  const themes = useTheme();
  const Mobile = useMediaQuery(themes.breakpoints.down('md'));

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
          <MemberReq />
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
        <MemberReq />
      </Mui.Grid>
    </Mui.Grid>
  );
};

export default MemberReqRes;
