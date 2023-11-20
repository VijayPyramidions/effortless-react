import React from 'react';
// import * as Router from 'react-router-dom';
import Input from '@components/Input/Input.jsx';
import * as Mui from '@mui/material';
import { makeStyles } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import {
  validateEmail,
  validateIfsc,
  validateRequired,
} from '@services/Validation.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import AppContext from '@root/AppContext.jsx';
import OnBoardingThanks from './OnBoardingThanks';
import * as css from './Onboarding.scss';

const useStyles = makeStyles(() => ({
  chips: {
    margin: '0 5px',
    '& .MuiChip-root': {
      background: 'white',
      border: '1px solid #f0f0f0',
      flexDirection: 'row !important',
    },
    '& .MuiChip-icon': {
      marginRight: '5px',
      marginLeft: '5px',
    },
  },
  searchInput: {
    margin: '0 20px',
    padding: '5px 10px 0 0',
    '& .MuiTextField-root': {
      paddingLeft: '8px',
      marginBottom: '8px',
      border: '1px solid rgb(180 175 174)',
    },
    '& .MuiInput-root': {
      height: '56px !important',
    },
  },
  checkbox: {
    padding: 0,
    paddingTop: 4,
    '& .MuiSvgIcon-root': {
      fontSize: '2.4rem',
      fill: 'transparent',
    },
  },
  selectedchips: {
    minWidth: '80px',
    margin: '0 6px 0 0',
    background: '#fdf1e6',
    color: themes.colorPrimaryButton,
    borderColor: themes.colorPrimaryButton,
  },
  root: {
    background: themes.colorInputBG,
    // border: '0.7px solid',
    borderColor: themes.colorInputBorder,
    borderRadius: '8px',
    margin: '0px !important',
    '& .MuiInputLabel-root': {
      margin: '0px',
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiInput-root': {
      marginTop: '24px',
    },
    '& .MuiInput-multiline': {
      paddingTop: '10px',
    },
    '& .MuiSelect-icon': {
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiSelect-select': {
      borderColor: themes.colorInputBorder,
    },
    '& .MuiInputBase-adornedEnd .MuiSvgIcon-root': {
      marginTop: '-10px',
    },
  },
}));

const VALIDATIONHOME = {
  buisnessName: {
    errMsg: 'Enter valid Name',
    test: validateRequired,
  },
  prncipalContact: {
    errMsg: 'Enter valid Contact',
    test: validateRequired,
  },
  phoneNumber: {
    errMsg: 'Enter valid Contact',
    test: validateRequired,
  },
  bankEmail: {
    errMsg: 'Enter valid Email',
    test: validateEmail,
  },
  accNumber: {
    errMsg: 'Enter valid Account Number',
    test: validateRequired,
  },
  ifsc: {
    errMsg: 'Enter valid ifsc',
    test: validateIfsc,
  },
  gst: {
    errMsg: 'Choose any one',
    test: validateRequired,
  },
  msme: {
    errMsg: 'Choose any one',
    test: validateRequired,
  },
};

const VendorOnboarding = ({ titleHead }) => {
  // const classes = useStyles();
  const [viewFlow, setViewFlow] = React.useState({
    home: true,
    thanks: false,
  });

  return (
    <div className={css.vendorOnboarding}>
      <p className={css.TitleVendor}>{titleHead?.name}</p>
      {viewFlow?.home && (
        <VendorHome setViewFlow={setViewFlow} titleHead={titleHead} />
      )}
      {viewFlow?.thanks && <OnBoardingThanks />}
    </div>
  );
};
export default VendorOnboarding;

const VendorHome = ({ setViewFlow, titleHead }) => {
  const { organization, user, enableLoading, openSnackBar } =
    React.useContext(AppContext);
  const classes = useStyles();
  const [mainState, setMainState] = React.useState({
    buisnessName: '',
    prncipalContact: '',
    phoneNumber: '',
    bankEmail: '',
    gst: '',
    msme: '',
    accNumber: '',
    ifsc: '',
  });
  const initialValidationErr = Object.keys(VALIDATIONHOME).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] =
    React.useState(initialValidationErr);

  const handleIfscKeyPress = (event) => {
    const key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode,
    );
    if (!/^[a-zA-Z0-9\b]+$/.test(key)) {
      event.preventDefault();
    }
  };

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value = ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATIONHOME?.[name]?.test?.(value),
    }));
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    setMainState((s) => ({
      ...s,
      [name]: value,
    }));
  };

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(mainState[v]);
      return a;
    }, {});
  };

  const submitBank = () => {
    // const { id, ...param } = bankState;
    enableLoading(true);
    RestApi(
      // bankState?.id
      //   ? `organizations/${organization.orgId}/${type}/${custId}/bank_details/${bankState?.id}`
      //   :
      `organizations/${organization.orgId}/vendors/${titleHead?.user_id}/bank_details`,
      {
        method: METHOD.POST,
        // method: bankState?.id ? METHOD.PATCH : METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          ...mainState,
        },
      },
    )
      .then((res) => {
        if (res && !res.error) {
          openSnackBar({
            message: res.message,
            type: MESSAGE_TYPE.INFO,
          });
          setViewFlow({ home: false, thanks: true });
        }
        if (res?.error) {
          openSnackBar({
            message: res?.message || 'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
      })
      .catch((res) => {
        openSnackBar({
          message: res?.message || 'Unknown Error Occured',
          type: MESSAGE_TYPE.ERROR,
        });
        enableLoading(false);
      });
  };
  const submit = () => {
    const sectionValidation = {};
    Object.keys(VALIDATIONHOME).forEach((k) => {
      sectionValidation[k] = VALIDATIONHOME[k];
    });
    const g = validateAllFields(sectionValidation);
    const valid = Object.values(g).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...g }));
    } else {
      setValidationErr((s) => ({ ...s, ...g }));
      submitBank();
      // setViewFlow({ home: false, thanks: true });
    }
    console.log(g);
  };

  return (
    <section>
      <div>
        <Mui.Stack direction="column" className={css.vendorFields}>
          <div>
            <p className={css.subTitleVendor}>
              Enter your Business’ Name{' '}
              <sup style={{ color: '#ff1a1a' }}>*</sup>
            </p>
          </div>
          <Input
            required
            className={`${css.greyBorder} ${classes.root}`}
            label="As per your Bank Book"
            variant="standard"
            name="buisnessName"
            onChange={onInputChange}
            value={mainState.buisnessName}
            onBlur={reValidate}
            error={validationErr.buisnessName}
            helperText={
              validationErr.buisnessName
                ? VALIDATIONHOME?.buisnessName?.errMsg
                : ''
            }
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
          />
        </Mui.Stack>

        <Mui.Stack direction="row" className={css.vendorFields}>
          <Input
            required
            className={`${css.greyBorder} ${classes.root}`}
            label="Principal Contacts"
            variant="standard"
            name="prncipalContact"
            onChange={onInputChange}
            value={mainState.prncipalContact}
            onBlur={reValidate}
            error={validationErr.prncipalContact}
            helperText={
              validationErr.prncipalContact
                ? VALIDATIONHOME?.prncipalContact?.errMsg
                : ''
            }
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            type="number"
          />
        </Mui.Stack>

        <Mui.Stack direction="row" className={css.vendorFields}>
          <Input
            required
            className={`${css.greyBorder} ${classes.root}`}
            label="Phone Number"
            variant="standard"
            name="phoneNumber"
            onChange={onInputChange}
            value={mainState.phoneNumber}
            onBlur={reValidate}
            error={validationErr.phoneNumber}
            helperText={
              validationErr.phoneNumber
                ? VALIDATIONHOME?.phoneNumber?.errMsg
                : ''
            }
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            type="number"
          />
        </Mui.Stack>

        <Mui.Stack direction="row" className={css.vendorFields}>
          <Input
            required
            className={`${css.greyBorder} ${classes.root}`}
            label="Email ID"
            variant="standard"
            name="bankEmail"
            onChange={onInputChange}
            value={mainState.bankEmail}
            onBlur={reValidate}
            error={validationErr.bankEmail}
            helperText={
              validationErr.bankEmail ? VALIDATIONHOME?.bankEmail?.errMsg : ''
            }
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
          />
        </Mui.Stack>

        <Mui.Stack direction="column" className={css.vendorFields}>
          <Mui.FormControl>
            <p className={css.radioVendor}>
              Do you have a GST Number?{' '}
              <sup style={{ color: '#ff1a1a' }}>*</sup>
            </p>
            <Mui.RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={(e) => {
                setMainState((prev) => ({ ...prev, gst: e?.target?.value }));
                setValidationErr((prev) => ({ ...prev, gst: false }));
              }}
            >
              <Mui.FormControlLabel
                value="yes"
                control={
                  <Mui.Radio size="small" style={{ color: '#f08b32' }} />
                }
                label={<p className={css.radioVendor}>Yes</p>}
              />
              <Mui.FormControlLabel
                value="no"
                control={
                  <Mui.Radio size="small" style={{ color: '#f08b32' }} />
                }
                label={<p className={css.radioVendor}>No</p>}
              />
            </Mui.RadioGroup>
          </Mui.FormControl>
          {validationErr.gst && (
            <p style={{ fontSize: '10px', margin: 0, color: '#d8000c' }}>
              {VALIDATIONHOME?.gst?.errMsg}
            </p>
          )}
        </Mui.Stack>

        <Mui.Stack direction="column" className={css.vendorFields}>
          <Mui.FormControl>
            <p className={css.radioVendor}>
              Are you registered as MSME under MSME Act through
              https://udyamregistration.gov.in/Government-India/Ministry-MSME-registrartion.htm{' '}
              <sup style={{ color: '#ff1a1a' }}>*</sup>
            </p>
            <Mui.RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={(e) => {
                setMainState((prev) => ({ ...prev, msme: e?.target?.value }));
                setValidationErr((prev) => ({ ...prev, msme: false }));
              }}
            >
              <Mui.FormControlLabel
                value="yes"
                control={
                  <Mui.Radio size="small" style={{ color: '#f08b32' }} />
                }
                label={<p className={css.radioVendor}>Yes</p>}
              />
              <Mui.FormControlLabel
                value="no"
                control={
                  <Mui.Radio size="small" style={{ color: '#f08b32' }} />
                }
                label={<p className={css.radioVendor}>No</p>}
              />
            </Mui.RadioGroup>
          </Mui.FormControl>
          {validationErr.msme && (
            <p style={{ fontSize: '10px', margin: 0, color: '#d8000c' }}>
              {VALIDATIONHOME?.msme?.errMsg}
            </p>
          )}
        </Mui.Stack>

        <Mui.Stack direction="row" className={css.vendorFields}>
          <Input
            required
            className={`${css.greyBorder} ${classes.root}`}
            label="Bank Account Number"
            variant="standard"
            name="accNumber"
            onChange={onInputChange}
            value={mainState.accNumber?.toLocaleUpperCase()}
            onBlur={reValidate}
            error={validationErr.accNumber}
            helperText={
              validationErr.accNumber ? VALIDATIONHOME?.accNumber?.errMsg : ''
            }
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            type="number"
          />
        </Mui.Stack>

        <Mui.Stack direction="row" className={css.vendorFields}>
          <Input
            required
            className={`${css.greyBorder} ${classes.root}`}
            label="Bank IFSC Code"
            variant="standard"
            name="ifsc"
            onChange={onInputChange}
            value={mainState.ifsc?.toLocaleUpperCase()}
            onBlur={reValidate}
            error={validationErr.ifsc}
            helperText={validationErr.ifsc ? VALIDATIONHOME?.ifsc?.errMsg : ''}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            onKeyPress={handleIfscKeyPress}
          />
        </Mui.Stack>

        <Mui.Stack direction="row" className={css.vendorFields}>
          <Mui.Button
            variant="contained"
            className={css.containedButton}
            onClick={() => {
              submit();
            }}
          >
            Submit
          </Mui.Button>
        </Mui.Stack>
      </div>
    </section>
  );
};
