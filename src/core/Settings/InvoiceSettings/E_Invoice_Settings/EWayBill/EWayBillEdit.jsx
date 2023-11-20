import React, { useState, useEffect } from 'react';
import { Button, Box, Stack, TextField } from '@mui/material';
import { makeStyles, styled } from '@material-ui/core/styles';

import { validateRequired } from '@services/Validation.jsx';
import Input from '@components/Input/Input.jsx';
import * as themes from '@root/theme.scss';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import editIcon from '@assets/edit-2.svg';

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
  disabledclass: {
    pointerEvents: 'none',
    opacity: '.9',
  },
});

const VALIDATION = {
  threshold_limit: {
    errMsg: 'Enter Threshold Limit',
    test: validateRequired,
  },
};

export const EWayBillEdit = ({
  formValues,
  formType,
  updateEWayBill,
  invoiceAction,
}) => {
  const device = localStorage.getItem('device_detect');
  return device === 'desktop' ? (
    <EWayBillEditDesktop
      formValues={formValues}
      formType={formType}
      updateEWayBill={updateEWayBill}
      invoiceAction={invoiceAction}
    />
  ) : (
    <EWayBillEditMobile
      formValues={formValues}
      formType={formType}
      updateEWayBill={updateEWayBill}
      invoiceAction={invoiceAction}
    />
  );
};

export const EWayBillEditMobile = ({
  formValues,
  formType,
  updateEWayBill,
  invoiceAction,
}) => {
  const classes = useStyles();
  const [drawer, setDrawer] = useState(false);
  // const device = localStorage.getItem('device_detect');
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [localState, setLocalState] = useState({
    threshold_limit: '',
    generate_any: false,
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
    const [name, value] = getEventNameValue(ps);
    if (value >= 0 && value <= 50000) {
      reValidate(ps);
      setLocalState((s) => ({
        ...s,
        [name]: value,
      }));
    }
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
        updateEWayBill({
          threshold_limit: localState?.threshold_limit,
          use_threshold: localState?.generate_any,
        });
      }
    }
  };

  // useEffect(() => {
  //   setLocalState(formValues);
  // }, [formValues]);

  useEffect(() => {
    setTypeForm(formType);
  }, [formType]);

  useEffect(() => {
    setTypeForm(formType);
    setValidationErr(initialValidationErr);
    setLocalState(formValues);
  }, [invoiceAction, drawer?.eform]);

  return (
    <>
      <Box
        onClick={() => setDrawer({ ...drawer, eform: true })}
        className={css.ewaybilledit}
        component={Button}
      >
        <p className={css.credentials}>View E-Way Bill Threshold Details</p>
      </Box>
      <SelectBottomSheet
        open={drawer?.eform}
        onClose={() => setDrawer({ ...drawer, eform: false })}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <Puller />
        <Box className={css.ewaybillformmobile}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            padding="0 20px"
          >
            <p className={css.headertext}>E-way Bill Threshold</p>
          </Stack>

          <Stack direction="column" gap="24px" padding="20px">
            <Input
              name="threshold_limit"
              label="Threshold Limit"
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
              type="number"
              onBlur={reValidate}
              error={validationErr.threshold_limit}
              helperText={
                validationErr.threshold_limit
                  ? VALIDATION?.threshold_limit?.errMsg
                  : ''
              }
              onChange={onInputChange}
              value={localState?.threshold_limit}
              required
            />

            <Stack width="100%" gap="8px">
              <p className={css.formlabel}>
                Generate Eway Bill irrespective of threshold limit
              </p>
              <Stack
                direction="row"
                gap="20px"
                alignItems="center"
                padding="4px 12px"
                maxWidth="min-content"
                sx={{ background: '#F5F4F7', borderRadius: '4px' }}
              >
                <Box
                  className={
                    !localState?.generate_any
                      ? `${css.generatebtn} ${css.selected}`
                      : `${css.generatebtn}`
                  }
                  component={Button}
                  onClick={() =>
                    setLocalState((s) => ({
                      ...s,
                      generate_any: false,
                    }))
                  }
                  disabled={typeForm === 'edit'}
                >
                  Yes
                </Box>
                <Box
                  className={
                    localState?.generate_any
                      ? `${css.generatebtn} ${css.selected}`
                      : `${css.generatebtn}`
                  }
                  component={Button}
                  onClick={() =>
                    setLocalState((s) => ({
                      ...s,
                      generate_any: true,
                    }))
                  }
                  disabled={typeForm === 'edit'}
                >
                  No
                </Box>
              </Stack>
            </Stack>

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

export const EWayBillEditDesktop = ({
  formValues,
  formType,
  updateEWayBill,
  invoiceAction,
}) => {
  const classes = useStyles();
  // const device = localStorage.getItem('device_detect');
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [localState, setLocalState] = useState({
    threshold_limit: '',
    generate_any: false,
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
    const [name, value] = getEventNameValue(ps);
    if (value >= 0 && value <= 50000) {
      reValidate(ps);
      setLocalState((s) => ({
        ...s,
        [name]: value,
      }));
    }
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
        updateEWayBill({
          threshold_limit: localState?.threshold_limit,
          use_threshold: localState?.generate_any,
        });
      }
    }
  };

  // useEffect(() => {
  //   setLocalState(formValues);
  // }, [formValues]);

  useEffect(() => {
    setTypeForm(formType);
  }, [formType]);

  useEffect(() => {
    setTypeForm(formType);
    setValidationErr(initialValidationErr);
    setLocalState(formValues);
  }, [invoiceAction]);
  return (
    <Stack direction="column" gap="16px" className={css.ewaybilledit}>
      <Stack width="100%" direction="row" gap="4%">
        <Stack width="48%" gap="8px">
          <p className={css.formlabel}>Threshold Limit</p>
          <TextField
            type="number"
            className={classes.textfiledroot}
            disabled={typeForm === 'edit'}
            name="threshold_limit"
            onChange={onInputChange}
            onBlur={reValidate}
            error={validationErr.threshold_limit}
            helperText={
              validationErr.threshold_limit
                ? VALIDATION?.threshold_limit?.errMsg
                : ''
            }
            value={localState?.threshold_limit}
          />
        </Stack>
        <Stack width="48%" gap="8px">
          <p className={css.formlabel}>
            Generate Eway Bill irrespective of threshold limit
          </p>
          <Stack
            direction="row"
            gap="20px"
            alignItems="center"
            padding="4px 12px"
            maxWidth="min-content"
            sx={{ background: '#F5F4F7', borderRadius: '4px' }}
          >
            <Box
              className={
                !localState?.generate_any
                  ? `${css.generatebtn} ${css.selected}`
                  : `${css.generatebtn}`
              }
              component={Button}
              onClick={() =>
                setLocalState((s) => ({
                  ...s,
                  generate_any: false,
                }))
              }
              disabled={typeForm === 'edit'}
            >
              Yes
            </Box>
            <Box
              className={
                localState?.generate_any
                  ? `${css.generatebtn} ${css.selected}`
                  : `${css.generatebtn}`
              }
              component={Button}
              onClick={() =>
                setLocalState((s) => ({
                  ...s,
                  generate_any: true,
                }))
              }
              disabled={typeForm === 'edit'}
            >
              No
            </Box>
          </Stack>
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
    </Stack>
  );
};
