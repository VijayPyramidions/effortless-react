import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Button, Box, Stack, TextField } from '@mui/material';
import { makeStyles, styled } from '@material-ui/core/styles';

import { validateRequired } from '@services/Validation.jsx';
import Input from '@components/Input/Input.jsx';
import * as themes from '@root/theme.scss';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import CalendarIcon from '@mui/icons-material/CalendarToday';

import editIcon from '@assets/edit-2.svg';
import Calender from '../../../../InvoiceView/Calander';

import * as css from '../EInvoiceSettingsMain.scss';

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const useStyles = makeStyles({
  root: {
    borderRadius: '6px',
    border: '1px solid #0000001a',
    background: '#00000005',
    margin: '0px !important',
    textTransform: 'capitalize',
    '& .MuiInputLabel-root': {
      margin: '0px',
      color: `rgb(160, 164, 175) !important`,
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
  textfiledroot: {
    '& .MuiInputBase-input': {
      padding: '6px 16px',
      letterSpacing: 2,
      fontFamily: 'Lexend, sans-serif !important',
      height: '30px',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      '& fieldset': {
        border: '1px solid #ECECEC',
        borderRadius: '4px',
      },
      '&:hover fieldset': {
        border: '1px solid #ECECEC',
        borderRadius: '4px',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ECECEC !important',
    },
    '& .Mui-error': {
      paddingLeft: '8px',
    },
  },
  datefieldroot: {
    border: '1px solid rgba(0, 0, 0, 0.1) !important',
    padding: '5px 16px !important',
    borderRadius: '4px',
    height: '30px',
  },
  disabledclass: {
    pointerEvents: 'none',
    opacity: '.9',
  },
});

const VALIDATION = {
  username: {
    errMsg: 'Enter valid Username',
    test: validateRequired,
  },
  password: {
    errMsg: 'Enter valid Password',
    test: validateRequired,
  },
  clientid: {
    errMsg: 'Enter valid Client ID',
    test: validateRequired,
  },
  clientsecret: {
    errMsg: 'Enter valid Client Secret',
    test: validateRequired,
  },
};

export const EInvoiceForm = ({
  formValues,
  formType,
  updateEInvoice,
  invoiceAction,
}) => {
  const device = localStorage.getItem('device_detect');
  return device === 'desktop' ? (
    <EInvoiceFormDesktop
      formValues={formValues}
      formType={formType}
      updateEInvoice={updateEInvoice}
      invoiceAction={invoiceAction}
    />
  ) : (
    <EInvoiceFormMobile
      formValues={formValues}
      formType={formType}
      updateEInvoice={updateEInvoice}
      invoiceAction={invoiceAction}
    />
  );
};

export const EInvoiceFormMobile = ({
  formValues,
  formType,
  updateEInvoice,
  invoiceAction,
}) => {
  const classes = useStyles();
  const [showCred, setShowCred] = useState(false);
  const [drawer, setDrawer] = useState({});
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [localState, setLocalState] = useState({
    einvoicedate: new Date(),
    username: '',
    password: '',
    clientid: '',
    clientsecret: '',
  });
  const [typeForm, setTypeForm] = useState();

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value = ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    setLocalState((s) => ({
      ...s,
      [name]: value,
    }));
  };
  const handleEInvoiceDate = (val) => {
    setLocalState((s) => ({
      ...s,
      einvoicedate: val,
    }));
    setDrawer((d) => ({ ...d, invoicedate: false }));
  };

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(localState[v]);
      return a;
    }, {});
  };
  const arraysHaveSameValues = (arr1, arr2) => {
    for (let i = 0; i < arr1.length; i += 1) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  };

  const onFormSubmit = () => {
    const sectionValidation = {};
    Object.keys(VALIDATION).forEach((k) => {
      sectionValidation[k] = VALIDATION[k];
    });
    const g = validateAllFields(sectionValidation);
    const valid = Object.values(g).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...g }));
    } else {
      const arr1 = Object.values(formValues || {});
      const arr2 = Object.values(localState || {});
      if (!arraysHaveSameValues(arr1, arr2)) {
        updateEInvoice({
          irp_credentials: {
            password: localState?.password,
            username: localState?.username,
            client_id: localState?.clientid,
            client_secret: localState?.clientsecret,
          },
          effective_from: localState?.einvoicedate
            ? moment(localState?.einvoicedate)?.format('YYYY-MM-DD')
            : moment(formValues?.einvoicedate)?.format('YYYY-MM-DD'),
        });
        setTypeForm(formType);
        setShowCred(false);
      }
    }
  };

  useEffect(() => {
    setLocalState(formValues);
  }, [formValues]);

  useEffect(() => {
    setTypeForm(formType);
  }, [formType]);

  useEffect(() => {
    setTypeForm(formType);
    setShowCred(false);
    setValidationErr(initialValidationErr);
    setLocalState(formValues);
  }, [invoiceAction, drawer?.eform]);

  return (
    <>
      <Box
        onClick={() => setDrawer({ ...drawer, eform: true })}
        className={css.einvoiceform}
        component={Button}
      >
        <p className={css.credentials}>View E-Invoice Details</p>
      </Box>
      <SelectBottomSheet
        open={drawer?.eform}
        onClose={() => setDrawer({ ...drawer, eform: false })}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <Puller />
        <Box className={css.einvoiceformmobile}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            padding="0 20px"
          >
            <p className={css.headertext}>E-Invoice</p>
            {showCred && (
              <Visibility
                onClick={() => setShowCred(!showCred)}
                className={typeForm === 'edit' && `${classes.disabledclass}`}
              />
            )}
            {!showCred && (
              <VisibilityOff
                onClick={() => setShowCred(!showCred)}
                className={typeForm === 'edit' && `${classes.disabledclass}`}
              />
            )}
          </Stack>

          <Stack direction="column" gap="24px" padding="20px">
            <div className={css.mobiledate}>
              <p className={css.mobiledatelabel}>E-Invoice From</p>
              <div className={css.mobiledatefield}>
                <input
                  type="text"
                  value={moment(localState?.einvoicedate).format('DD-MM-YYYY')}
                  className={
                    typeForm === 'edit'
                      ? `${css.mobiledateinput} ${classes.disabledclass}`
                      : css.mobiledateinput
                  }
                />

                <SelectBottomSheet
                  name="einvoicedate"
                  addNewSheet
                  triggerComponent={
                    <CalendarIcon
                      style={{ width: 20, color: '#949494' }}
                      onClick={() => {
                        if (typeForm === 'add')
                          setDrawer({ ...drawer, invoicedate: true });
                      }}
                    />
                  }
                  open={drawer.invoicedate}
                  onClose={() => setDrawer({ ...drawer, invoicedate: false })}
                >
                  <Calender
                    head="Select E-Invoice Date"
                    button="Select"
                    handleDate={handleEInvoiceDate}
                  />
                </SelectBottomSheet>
              </div>
            </div>

            <Input
              name="username"
              label="Username"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              className={
                typeForm === 'edit'
                  ? `${classes.root} ${classes.disabledclass}`
                  : `${classes.root}`
              }
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              type={showCred ? 'text' : 'password'}
              onBlur={reValidate}
              error={validationErr.username}
              helperText={
                validationErr.username ? VALIDATION?.username?.errMsg : ''
              }
              onChange={onInputChange}
              value={localState?.username}
              required
            />
            <Input
              name="password"
              label="Password"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              className={
                typeForm === 'edit'
                  ? `${classes.root} ${classes.disabledclass}`
                  : `${classes.root}`
              }
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              type={showCred ? 'text' : 'password'}
              onBlur={reValidate}
              error={validationErr.password}
              helperText={
                validationErr.password ? VALIDATION?.password?.errMsg : ''
              }
              onChange={onInputChange}
              value={localState?.password}
              required
            />
            <Input
              name="clientid"
              label="Client ID"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              className={
                typeForm === 'edit'
                  ? `${classes.root} ${classes.disabledclass}`
                  : `${classes.root}`
              }
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              type={showCred ? 'text' : 'password'}
              onBlur={reValidate}
              error={validationErr.clientid}
              helperText={
                validationErr.clientid ? VALIDATION?.clientid?.errMsg : ''
              }
              onChange={onInputChange}
              value={localState?.clientid}
              required
            />
            <Input
              name="clientsecret"
              label="Client Secret"
              variant="standard"
              InputLabelProps={{
                shrink: true,
              }}
              className={
                typeForm === 'edit'
                  ? `${classes.root} ${classes.disabledclass}`
                  : `${classes.root}`
              }
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid #A0A4AF',
              }}
              type={showCred ? 'text' : 'password'}
              onBlur={reValidate}
              error={validationErr.clientsecret}
              helperText={
                validationErr.clientsecret
                  ? VALIDATION?.clientsecret?.errMsg
                  : ''
              }
              onChange={onInputChange}
              value={localState?.clientsecret}
              required
            />
            <Stack width="100%" direction="row" justifyContent="space-between">
              {typeForm === 'edit' && (
                <Button
                  className={css.secondaryButton}
                  onClick={() => setTypeForm('add')}
                >
                  <Stack direction="row" alignItems="center" gap="8px">
                    <img src={editIcon} alt="edit" />
                    Edit
                  </Stack>
                </Button>
              )}
              {typeForm === 'add' && (
                <Button
                  className={css.primaryButton}
                  onClick={() => onFormSubmit()}
                >
                  Save
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      </SelectBottomSheet>
    </>
  );
};

export const EInvoiceFormDesktop = ({
  formValues,
  formType,
  updateEInvoice,
  invoiceAction,
}) => {
  const classes = useStyles();
  // const device = localStorage.getItem('device_detect');
  const [showCred, setShowCred] = useState(false);
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [localState, setLocalState] = useState({
    einvoicedate: new Date(),
    username: '',
    password: '',
    clientid: '',
    clientsecret: '',
  });
  const [typeForm, setTypeForm] = useState();

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value = ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };

  const onInputChange = (ps) => {
    reValidate(ps);
    const [name, value] = getEventNameValue(ps);
    setLocalState((s) => ({
      ...s,
      [name]: value,
    }));
  };

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(localState[v]);
      return a;
    }, {});
  };

  const arraysHaveSameValues = (arr1, arr2) => {
    for (let i = 0; i < arr1.length; i += 1) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  };

  const onFormSubmit = () => {
    const sectionValidation = {};
    Object.keys(VALIDATION).forEach((k) => {
      sectionValidation[k] = VALIDATION[k];
    });
    const g = validateAllFields(sectionValidation);
    const valid = Object.values(g).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...g }));
    } else {
      const arr1 = Object.values(formValues || {});
      const arr2 = Object.values(localState || {});
      if (!arraysHaveSameValues(arr1, arr2)) {
        updateEInvoice({
          irp_credentials: {
            password: localState?.password,
            username: localState?.username,
            client_id: localState?.clientid,
            client_secret: localState?.clientsecret,
          },
          effective_from: localState?.einvoicedate
            ? moment(localState?.einvoicedate)?.format('YYYY-MM-DD')
            : moment(formValues?.einvoicedate)?.format('YYYY-MM-DD'),
        });
        setTypeForm(formType);
        setShowCred(false);
      }
    }
  };

  useEffect(() => {
    setLocalState(formValues);
  }, [formValues]);

  useEffect(() => {
    setTypeForm(formType);
  }, [formType]);

  useEffect(() => {
    if (!invoiceAction?.find((val) => val?.id === 'e-invoice')?.expand) {
      setTypeForm(formType);
      setShowCred(false);
      setValidationErr(initialValidationErr);
    }
  }, [invoiceAction]);

  return (
    <Stack direction="column" gap="16px" className={css.einvoiceform}>
      <Stack width="100%" direction="row" gap="4%">
        <Stack width="48%" gap="8px">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <p className={css.formlabel}>E-Invoice From</p>
            <DatePicker
              inputFormat="DD-MM-YYYY"
              InputProps={{ disableUnderline: true }}
              value={localState?.einvoicedate}
              onChange={(newValue) => {
                setLocalState((s) => ({
                  ...s,
                  einvoicedate: newValue?.$d,
                }));
              }}
              views={['year', 'month', 'day']}
              renderInput={(params) => (
                <TextField
                  // onKeyDown={(e) => e.preventDefault()}
                  variant="standard"
                  {...params}
                />
              )}
              className={classes.datefieldroot}
              disabled={typeForm === 'edit'}
            />
          </LocalizationProvider>
        </Stack>

        <Stack width="48%" gap="8px">
          <p className={css.formlabel}>Username</p>
          <TextField
            type={showCred ? 'text' : 'password'}
            className={classes.textfiledroot}
            disabled={typeForm === 'edit'}
            name="username"
            onChange={onInputChange}
            onBlur={reValidate}
            error={validationErr.username}
            helperText={
              validationErr.username ? VALIDATION?.username?.errMsg : ''
            }
            value={localState?.username}
          />
        </Stack>
      </Stack>
      <Stack width="100%" direction="row" gap="4%">
        <Stack width="48%" gap="8px">
          <p className={css.formlabel}>Password</p>
          <TextField
            type={showCred ? 'text' : 'password'}
            className={classes.textfiledroot}
            disabled={typeForm === 'edit'}
            name="password"
            onChange={onInputChange}
            onBlur={reValidate}
            error={validationErr.password}
            helperText={
              validationErr.password ? VALIDATION?.password?.errMsg : ''
            }
            value={localState?.password}
          />
        </Stack>

        <Stack width="48%" gap="8px">
          <p className={css.formlabel}>Client ID</p>
          <TextField
            type={showCred ? 'text' : 'password'}
            className={classes.textfiledroot}
            disabled={typeForm === 'edit'}
            name="clientid"
            onChange={onInputChange}
            onBlur={reValidate}
            error={validationErr.clientid}
            helperText={
              validationErr.clientid ? VALIDATION?.clientid?.errMsg : ''
            }
            value={localState?.clientid}
          />
        </Stack>
      </Stack>
      <Stack width="100%" direction="row">
        <Stack width="48%" gap="8px">
          <p className={css.formlabel}>Client Secret</p>
          <TextField
            type={showCred ? 'text' : 'password'}
            className={classes.textfiledroot}
            disabled={typeForm === 'edit'}
            name="clientsecret"
            onChange={onInputChange}
            onBlur={reValidate}
            error={validationErr.clientsecret}
            helperText={
              validationErr.clientsecret ? VALIDATION?.clientsecret?.errMsg : ''
            }
            value={localState?.clientsecret}
          />
        </Stack>
      </Stack>
      <Stack width="100%" direction="row" marginTop="4px">
        <Stack width="35%" gap="28px" direction="row">
          {typeForm === 'edit' && (
            <Button
              className={css.secondaryButton}
              onClick={() => setTypeForm('add')}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap="8px"
                maxWidth="160px"
              >
                <img src={editIcon} alt="edit" />
                Edit
              </Stack>
            </Button>
          )}
          {typeForm === 'add' && (
            <Button
              className={css.primaryButton}
              onClick={() => onFormSubmit()}
            >
              Save
            </Button>
          )}
        </Stack>
      </Stack>
      <Stack
        style={{ position: 'absolute', top: -5, right: 0, cursor: 'pointer' }}
        direction="row"
        alignItems="center"
        gap="4px"
        onClick={() => setShowCred(!showCred)}
        component={Button}
        className={typeForm === 'edit' && `${classes.disabledclass}`}
      >
        {showCred && (
          <Visibility style={{ fontSize: '16px', color: '#3049BF' }} />
        )}
        {showCred && <p className={css.credentials}>Hide Credentials</p>}
        {!showCred && (
          <VisibilityOff style={{ fontSize: '16px', color: '#3049BF' }} />
        )}
        {!showCred && <p className={css.credentials}>View Credentials</p>}
      </Stack>
    </Stack>
  );
};
