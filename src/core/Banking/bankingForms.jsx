/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useToggle } from '@services/CustomHooks';
import Input from '@components/Input/Input.jsx';
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validateLength,
} from '@services/Validation.jsx';
import TransactionPassword from '@core/PaymentView/TransactionVerify/TransactionPassword';

import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import { IconButton, InputAdornment, styled } from '@material-ui/core';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import SelectBusiness from '@components/Select/SelectBusiness.jsx';
import * as Mui from '@mui/material';
import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import * as Router from 'react-router-dom';
import * as css from './banking.scss';

const TextfieldStyle = (props) => {
  return (
    <Input
      {...props}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      required
      // fullWidth
      theme="light"
      className={css.textfieldStyle}
      style={{ margin: '0.7em 0rem' }}
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

const VALIDATION = {
  firstName: {
    errMsg: 'Please provide first name',
    test: (v) => validateRequired(v),
  },
  lastName: {
    errMsg: 'Name should be at-least 4 Characters',
    test: (v) => validateLength(v, 4, 20),
  },
  email: {
    errMsg: 'Please provide valid email',
    test: validateEmail,
  },
  phone: {
    errMsg: 'Please provide valid mobile no.',
    test: validatePhone,
  },
  gender: {
    errMsg: 'Please provide gender',
    test: (v) => validateRequired(v),
  },
  businessName: {
    errMsg: 'Please provide Business Name',
    test: (v) => validateRequired(v),
  },
  fidyPayPassword: {
    errMsg: 'Please enter your password',
    test: (v) => validateLength(v, 8, 16),
  },
};

const BankingForms = () => {
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [showPassword, togglePassword] = useToggle(false);
  const device = localStorage.getItem('device_detect');

  const { organization, user, currentUserInfo, openSnackBar } =
    React.useContext(AppContext);
  const initialState = {
    firstName: currentUserInfo?.name,
    lastName: '',
    email: currentUserInfo?.email,
    phone: currentUserInfo?.mobileNumber,
    gender: '',
    initial: '',
    martialStatus: '',
    date: '',
    businessName: organization?.name,
    fidyPayPassword: '',
  };

  function useStateCallback(initialStateVal) {
    const [state, setState] = React.useState(initialStateVal);
    const cbRef = React.useRef(null); // init mutable ref container for callbacks

    const setStateCallback = React.useCallback((stateParameter, cb) => {
      cbRef.current = cb; // store current, passed callback in ref
      setState(stateParameter);
    }, []); // keep object reference stable, exactly like `useState`

    React.useEffect(() => {
      // cb.current is `null` on initial render,
      // so we only invoke callback on state *updates*
      if (cbRef.current) {
        cbRef.current(state);
        cbRef.current = null; // reset callback after execution
      }
    }, [state]);

    return [state, setStateCallback];
  }

  const [gender, setGender] = React.useState(null);
  const [genderVal, setGenderVal] = React.useState([]);
  const navigate = Router.useNavigate();
  const [congratsDrawer, setCongratsDrawer] = React.useState(false);
  const [state, setState] = useStateCallback(initialState);
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);
  const validateAllFields = (stateParam) => {
    const stateData = stateParam || state;
    return Object.keys(VALIDATION).reduce((a, v) => {
      const paramValue = a;
      paramValue[v] = !VALIDATION?.[v]?.test(stateData[v]);
      return paramValue;
    }, {});
  };
  const Valid = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return false;
    }
    return true;
  };
  const getEventNameValue = (ps, val) => {
    const name = !val ? ps?.target?.name : ps;
    if (
      name === 'gender' ||
      name === 'panNo' ||
      name === 'gstn' ||
      name === 'martialStatus' ||
      name === ''
    ) {
      const value = ps?.target?.value.toUpperCase();
      return [name, value];
    }
    const value = !val ? ps?.target?.value : val;
    return [name, value];
  };
  const reValidate = (ps, val) => {
    const [name, value] = getEventNameValue(ps, val);
    if (device === 'mobile') {
      setValidationErr((v) => ({
        ...v,
        [name]: !VALIDATION?.[name]?.test?.(value),
      }));
    } else {
      setValidationErr((v) => ({
        ...v,
        [name]: !VALIDATION?.[name]?.test?.(value),
      }));
    }
  };
  const SubmitDetails = () => {
    if (Valid()) {
      RestApi(
        `organizations/${organization.orgId}/effortless_virtual_accounts`,
        {
          method: METHOD.POST,
          headers: {
            Authorization: `Bearer ${user.activeToken}`,
          },
          payload: {
            first_name: state?.firstName,
            last_name: state?.lastName,
            business_name: state?.businessName,
            gender: state?.gender,
            mobile_number: state?.phone,
            email: state?.email,
            password: state?.fidyPayPassword,
          },
        },
      )
        .then((res) => {
          if (res && !res.error) {
            if (res.message === 'Organization location is not present') {
              openSnackBar({
                message: res.message,
                type: MESSAGE_TYPE.ERROR,
              });
            } else {
              RestApi(
                `organizations/${organization.orgId}/effortless_virtual_accounts/${res?.id}/register`,
                {
                  method: METHOD.POST,
                  headers: {
                    Authorization: `Bearer ${user.activeToken}`,
                  },
                },
              ).then((response) => {
                if (response && !response.error) {
                  setCongratsDrawer(true);
                }
              });
            }
          } else if (res.error) {
            if (res.message === 'Organization location is not present') {
              openSnackBar({
                message: res.message,
                type: MESSAGE_TYPE.ERROR,
              });
            } else {
              openSnackBar({
                message: Object.values(res.errors).join(),
                type: MESSAGE_TYPE.ERROR,
              });
            }
          }
        })
        .catch(() => {
          openSnackBar({
            message: 'Sorry, Unknown error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        });
    }
  };

  const GenderSelect = (c) => {
    setState({ ...state, gender: c });
    setGender(!gender);
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    setState((s) => ({ ...s, [name]: value }));
  };
  React.useEffect(() => {
    setGenderVal({
      gender: [
        {
          payload: 'Male',
          text: 'Male',
        },
        {
          payload: 'Female',
          text: 'Female',
        },
      ],
    });
  }, []);

  return (
    <>
      <Mui.Stack
        className={
          device === 'mobile' ? css.mainStackMobile : css.mainStackDesktop
        }
      >
        <Mui.Stack className={css.headingStack}>
          <Mui.Typography
            className={device === 'mobile' ? css.headings : css.headingsDesktop}
          >
            {device === 'desktop' ? 'Basic Details' : 'Enter Details'}
          </Mui.Typography>
          {device === 'mobile' && <Mui.Divider className={css.dot} />}
        </Mui.Stack>
        <Mui.Stack
          className={device === 'desktop' ? css.stackDesktop : css.stackMobile}
        >
          <Mui.Box
            className={device === 'desktop' ? css.boxStack : css.boxStackMobile}
          >
            <Mui.Box
              className={device === 'desktop' ? css.boxDesktopLeft : css.box}
            >
              <TextfieldStyle
                label="First Name"
                name="firstName"
                onBlur={reValidate}
                error={validationErr.firstName}
                helperText={
                  validationErr.firstName ? VALIDATION?.firstName?.errMsg : ''
                }
                defaultValue={
                  state.firstName === ''
                    ? currentUserInfo?.name
                    : state?.firstName
                }
                className={css.textFieldSize}
                onChange={onInputChange}
              />
            </Mui.Box>
            <Mui.Box
              className={device === 'desktop' ? css.boxDesktopRight : css.box}
            >
              <TextfieldStyle
                label="Last Name"
                name="lastName"
                onBlur={reValidate}
                className={css.textField}
                error={validationErr.lastName}
                helperText={
                  validationErr.lastName ? VALIDATION?.lastName?.errMsg : ''
                }
                defaultValue={currentUserInfo?.name}
                value={state.lastName}
                onChange={onInputChange}
              />
            </Mui.Box>
          </Mui.Box>
          <Mui.Box
            className={device === 'desktop' ? css.boxStack : css.boxStackMobile}
          >
            <Mui.Box
              className={device === 'desktop' ? css.boxDesktopLeft : css.box}
            >
              <TextfieldStyle
                label="Email ID"
                name="email"
                onBlur={reValidate}
                className={css.textField}
                error={validationErr.email}
                helperText={
                  validationErr.email ? VALIDATION?.email?.errMsg : ''
                }
                defaultValue={
                  state.email === '' ? currentUserInfo?.email : state?.email
                }
                onChange={onInputChange}
              />
            </Mui.Box>
            <Mui.Box
              className={device === 'desktop' ? css.boxDesktopRight : css.box}
            >
              <TextfieldStyle
                type="number"
                label="Mobile Number"
                name="phone"
                onBlur={reValidate}
                className={css.textField}
                error={validationErr.phone}
                helperText={
                  validationErr.phone ? VALIDATION?.phone?.errMsg : ''
                }
                defaultValue={
                  state.phone === ''
                    ? currentUserInfo?.mobileNumber
                    : state?.phone
                }
                onChange={onInputChange}
              />
            </Mui.Box>
          </Mui.Box>
          <Mui.Box
            className={
              device === 'desktop' ? css.boxStackGender : css.boxStackMobile
            }
          >
            {device === 'desktop' ? (
              <SelectBusiness
                name="gender"
                onBlur={reValidate}
                error={validationErr.gender}
                helperText={
                  validationErr.gender ? VALIDATION?.gender?.errMsg : ''
                }
                // className={`${css.greyBorder} ${classes.root}`}
                label="Gender"
                variant="standard"
                options={genderVal?.gender}
                value={state.gender}
                borderChange="1px solid  #d7d7d7"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{
                  width: '30%',
                }}
                fullWidth
                onChange={onInputChange}
                // theme="light"
                required
              />
            ) : (
              <Mui.Box
                className={
                  device === 'desktop'
                    ? css.genderStackDesktop
                    : css.genderStackMobile
                }
                onClick={() => {
                  setGender(!gender);
                }}
                name="gender"
                error={validationErr.gender}
                helperText={
                  validationErr.gender ? VALIDATION?.gender?.errMsg : ''
                }
              >
                <Mui.Stack className={css.font}>
                  <Mui.Typography className={css.t1}>Gender</Mui.Typography>
                  <Mui.Typography className={css.t2}>
                    {state?.gender}
                  </Mui.Typography>
                </Mui.Stack>
                <KeyboardArrowDownOutlinedIcon className={css.icon} />
              </Mui.Box>
            )}
            <Mui.Box
              className={
                device === 'desktop' ? css.boxDesktopRightBusiness : css.box
              }
            >
              <TextfieldStyle
                // type="number"
                label="Business Name"
                name="businessName"
                onBlur={reValidate}
                className={css.textFieldChange}
                error={validationErr.businessName}
                helperText={
                  validationErr.businessName
                    ? VALIDATION?.businessName?.errMsg
                    : ''
                }
                defaultValue={
                  state.phone === ''
                    ? currentUserInfo?.BusinessName
                    : state?.businessName
                }
                onChange={onInputChange}
              />
            </Mui.Box>
          </Mui.Box>
          <Mui.Box
            className={device === 'desktop' ? css.boxStack : css.boxStackMobile}
          >
            <Mui.Box
              className={device === 'desktop' ? css.boxDesktopLeft : css.box}
            >
              <TextfieldStyle
                label="Password"
                name="fidyPayPassword"
                inputProps={{
                  type: showPassword ? 'text' : 'password',
                }}
                onBlur={reValidate}
                error={validationErr.fidyPayPassword}
                helperText={
                  validationErr.fidyPayPassword
                    ? VALIDATION?.fidyPayPassword?.errMsg
                    : ''
                }
                defaultValue={
                  state.fidyPayPassword === ''
                    ? currentUserInfo?.fidyPayPassword
                    : state?.fidyPayPassword
                }
                className={css.textFieldSize}
                onChange={onInputChange}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePassword}
                        edge="end"
                        style={{ color: '#000' }}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Mui.Box>
          </Mui.Box>
          <Mui.Stack
            direction="row"
            className={
              device === 'desktop' ? css.btnStackDesktop : css.btnStack
            }
          >
            <Mui.Button variant="outlined" className={css.btnBack}>
              <Mui.Typography
                className={css.btnBackText}
                onClick={() => navigate('/banking')}
              >
                Back
              </Mui.Typography>
            </Mui.Button>
            <Mui.Button
              variant="outlined"
              className={css.btnNext}
              onClick={() => {
                SubmitDetails();
              }}
            >
              <Mui.Typography className={css.btnNextText}>
                {device === 'desktop' ? 'Proceed To Create' : 'Next'}
              </Mui.Typography>
            </Mui.Button>
          </Mui.Stack>
        </Mui.Stack>
      </Mui.Stack>
      <SelectBottomSheet
        name="congratsDrawer"
        triggerComponent={<div style={{ display: 'none' }} />}
        open={congratsDrawer}
        addNewSheet
        maxHeight="45vh"
      >
        <TransactionPassword onClose={() => setCongratsDrawer(false)} />
      </SelectBottomSheet>
      <SelectBottomSheet
        name="Verification"
        addNewSheet
        triggerComponent={<div style={{ display: 'none' }} />}
        open={gender}
        onClose={() => setGender(!gender)}
        maxHeight="45vh"
      >
        <Mui.Stack m={3}>
          <Puller />
          <Mui.Stack className={css.textGenderHeadingStack}>
            <Mui.Typography className={css.textGenderHeading}>
              Gender
            </Mui.Typography>
            <Mui.Divider className={css.dotGender} />
          </Mui.Stack>
          <Mui.Stack>
            {genderVal?.gender?.map((c) => {
              return (
                <>
                  <Mui.Typography
                    className={css.textGender}
                    name="gender"
                    onClick={() => GenderSelect(c?.text)}
                  >
                    {c?.text}
                  </Mui.Typography>
                  <Mui.Divider />
                </>
              );
            })}
          </Mui.Stack>
        </Mui.Stack>
      </SelectBottomSheet>
    </>
  );
};

export default BankingForms;
