import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetTransportersListState,
  PostTransportersCreateState,
} from '@action/Store/Reducers/Invoice/InvoiceEWayBillState';
import {
  Stack,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
} from '@mui/material';

import { validateRequired, validateGst } from '@services/Validation.jsx';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import { makeStyles, styled } from '@material-ui/core/styles';
import useDebounce from '@components/Debounce/Debounce.jsx';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import * as css from './EWayBillStyle.scss';

const useStyles = makeStyles({
  textfiledroot: {
    flexGrow: 1,
    borderRadius: '8px !important',
    background: '#FFF',
    '& .MuiInputBase-input': {
      padding: '12px',
      letterSpacing: 2,
      fontFamily: 'Lexend, sans-serif !important',
      fontSize: '14px',
      fontWeight: 400,
      height: '20px',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '& fieldset': {
        border: '1px solid #ECECEC',
        borderRadius: '8px',
      },
      '&:hover fieldset': {
        border: '1px solid #ECECEC',
        borderRadius: '8px',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ECECEC !important',
    },
    '& .Mui-error': {
      paddingLeft: '8px',
    },
  },
  menutext: {
    color: '#283049 !important',
    fontFamily: 'Lexend, sans-serif !important',
    fontSize: '14px !important',
    fontStyle: 'normal !important',
    fontWeight: '300 !important',
    lineHeight: 'normal !important',
    borderBottom: '1px solid rgba(199, 199, 199, 0.50) !important',
    textTransform: 'capitalize !important',
  },
  disabledClass: {
    pointerEvents: 'none !important',
    background: '#F8F8F8 !important',
  },
});

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const transaction_sub_type_list = [
  'supply',
  // 'Exibitions or trade fairs',
  // 'Export',
  // 'For Own Use',
  // 'Job Work',
  // 'Lines Sales',
  // 'Others',
  // 'Receipient not known',
  // 'SKD/CKD/Lots',
];

const VALIDATION_TRANSPORTER = {
  name: {
    errMsg: 'Enter Valid Name',
    test: validateRequired,
  },
  number: {
    errMsg: 'Enter Valid Tranporters ID',
    test: validateGst,
  },
};
const CreateEWayBillPartA = ({ updateEWayBillParams, EWayBillStatus }) => {
  const device = localStorage.getItem('device_detect');
  const classes = useStyles();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { TransportersListState, TransportersActionState } = useSelector(
    (value) => value.InvoiceEWayBill
  );
  const [drawer, setDrawer] = useState({});
  const [localState, setLocalState] = useState({
    transaction_sub_type: 'supply',
    transporter: {},
    distance: false,
  });
  const debounceDistance = useDebounce(localState?.distance);

  const TriggerDrawer = (name, bool) => {
    setDrawer((prev) => ({ ...prev, [name]: bool }));
  };

  const onInputChange = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setLocalState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(localState, 'localStateA');
  }, [localState]);

  useEffect(() => {
    dispatch(GetTransportersListState());
  }, []);

  useEffect(() => {
    if (TransportersActionState === 'transporterAdded') {
      TriggerDrawer('newtransport', false);
      dispatch(GetTransportersListState());
    }
  }, [TransportersActionState]);

  useEffect(() => {
    updateEWayBillParams({ sub_type: localState?.transaction_sub_type });
  }, [localState?.transaction_sub_type]);

  useEffect(() => {
    if (debounceDistance !== false) {
      updateEWayBillParams({ distance: debounceDistance });
    }
  }, [debounceDistance]);

  useEffect(() => {
    updateEWayBillParams({ transporter_id: localState?.transporter?.id });
  }, [localState?.transporter]);

  useEffect(() => {
    if (Object.keys(state?.EWayBillResponse || {})?.length > 0) {
      setLocalState({
        distance: state?.EWayBillResponse?.distance || 0,
        transaction_sub_type: state?.EWayBillResponse?.sub_type || '',
        transporter: state?.EWayBillResponse?.transporter_id
          ? {
              id: state?.EWayBillResponse?.transporter_id,
              name: state?.EWayBillResponse?.transporter_name,
              number: state?.EWayBillResponse?.transporter_number,
            }
          : {},
      });
    }
  }, [state?.EWayBillResponse]);

  return (
    <>
      <Box
        component={Stack}
        gap="12px"
        direction="column"
        alignItems="center"
        className={css.createewaybillparta}
      >
        <Stack
          direction={device === 'desktop' ? 'row' : 'column'}
          width="100%"
          gap={device === 'desktop' ? '20px' : '8px'}
          alignItems={device === 'desktop' ? 'center' : 'unset'}
        >
          <p
            className={
              device === 'desktop' ? css.labeltext : css.labeltextformobile
            }
            style={{ display: 'flex' }}
          >
            Transaction Sub Type <span style={{ color: '#f00' }}>*</span>
          </p>
          {device === 'desktop' && (
            <FormControl sx={{ flexGrow: 1 }}>
              <Select
                name="transaction_sub_type"
                value={localState?.transaction_sub_type}
                onChange={onInputChange}
                input={<OutlinedInput className={classes.textfiledroot} />}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 224,
                      flexGrow: 1,
                      marginTop: 8,
                      padding: '0 8px',
                      minWidth: 266,
                    },
                  },
                }}
                IconComponent={KeyboardArrowDownIcon}
                className={EWayBillStatus && classes.disabledClass}
                sx={{
                  textTransform: 'capitalize !important',
                }}
              >
                {transaction_sub_type_list.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    className={classes.menutext}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {device === 'mobile' && (
            <Box
              className={
                EWayBillStatus
                  ? `${css.opensheetfieldroot} ${classes.disabledClass}`
                  : `${css.opensheetfieldroot}`
              }
              width={device === 'desktop' ? '55%' : 'calc(100% - 18px)'}
              component={Stack}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              onClick={() => TriggerDrawer('transaction_sub_type', true)}
            >
              <p
                style={{
                  color: localState?.transaction_sub_type ? '#000' : '#A0A4AF',
                  textTransform: 'capitalize',
                }}
              >
                {localState?.transaction_sub_type}
              </p>{' '}
              <KeyboardArrowDownIcon sx={{ color: '#0000008a' }} />
            </Box>
          )}
        </Stack>
        <Stack
          direction={device === 'desktop' ? 'row' : 'column'}
          width="100%"
          gap={device === 'desktop' ? '20px' : '8px'}
          alignItems={device === 'desktop' ? 'center' : 'unset'}
        >
          <p
            className={
              device === 'desktop' ? css.labeltext : css.labeltextformobile
            }
          >
            Transporter<span style={{ color: '#f00' }}>*</span>
          </p>
          <Box
            className={
              EWayBillStatus
                ? `${css.opensheetfieldroot} ${classes.disabledClass}`
                : `${css.opensheetfieldroot}`
            }
            width={device === 'desktop' ? '55%' : 'calc(100% - 18px)'}
            component={Stack}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => {
              if (EWayBillStatus) return;
              TriggerDrawer('transport', true);
            }}
          >
            <p
              style={{
                color: localState?.transporter?.id ? '#000' : '#A0A4AF',
              }}
            >
              {localState?.transporter?.name || 'Select Transporter name'}
            </p>{' '}
            <KeyboardArrowDownIcon sx={{ color: '#0000008a' }} />
          </Box>
        </Stack>
        <Stack
          direction={device === 'desktop' ? 'row' : 'column'}
          width="100%"
          gap={device === 'desktop' ? '20px' : '8px'}
          alignItems={device === 'desktop' ? 'center' : 'unset'}
        >
          <p
            className={
              device === 'desktop' ? css.labeltext : css.labeltextformobile
            }
          >
            Distance (in Km)<span style={{ color: '#f00' }}>*</span>
          </p>
          <TextField
            type="number"
            className={
              EWayBillStatus
                ? `${classes.textfiledroot} ${classes.disabledClass}`
                : `${classes.textfiledroot}`
            }
            name="distance"
            onChange={onInputChange}
            value={localState?.distance}
          />
        </Stack>
      </Box>

      <SelectBottomSheet
        open={drawer.transport}
        onClose={() => TriggerDrawer('transport', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <div className={css.transportersheet}>
          {device === 'mobile' && <Puller />}
          <Stack>
            <Box
              component={Stack}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              padding={device === 'desktop' ? '26px 40px' : '36px 20px 20px'}
            >
              <p className={css.headertext}>Select Transporter</p>

              <Stack
                direction="row"
                gap="4px"
                alignItems="center"
                sx={{ cursor: 'pointer' }}
                onClick={() => TriggerDrawer('newtransport', true)}
              >
                <AddIcon sx={{ color: '#f08b32', fontSize: '14px' }} />
                <p className={css.addNew}>Add New Transporter</p>
              </Stack>
            </Box>
            <Box
              component={Stack}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              padding="12px 20px"
              sx={{ background: '#F5F5F5' }}
            >
              <p className={css.titletoptext}>Name</p>
              <p className={css.titletoptext}>Transporter Id</p>
            </Box>
            {TransportersListState?.data?.length === 0 && (
              <p className={css.nodatatext}>No Data Found</p>
            )}
            {TransportersListState?.data?.map((val) => (
              <Box
                component={Stack}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                padding="12px 20px"
                sx={{
                  borderBottom: '1px solid rgba(0, 0, 0, 0.10)',
                  cursor: 'pointer',
                  background:
                    localState?.transporter?.id === val?.id && '#f08b3250',
                }}
                onClick={() => {
                  setLocalState({ ...localState, transporter: val });
                  TriggerDrawer('transport', false);
                }}
              >
                <p className={css.transportertext}>{val?.name}</p>
                <p className={css.transportertext}>{val?.number}</p>
              </Box>
            ))}
          </Stack>
        </div>
      </SelectBottomSheet>
      <SelectBottomSheet
        open={drawer.newtransport}
        onClose={() => TriggerDrawer('newtransport', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <AddNewTransporter TriggerDrawer={TriggerDrawer} />
      </SelectBottomSheet>

      <SelectBottomSheet
        open={drawer.transaction_sub_type}
        onClose={() => TriggerDrawer('transaction_sub_type', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        {transaction_sub_type_list.map((name) => (
          <MenuItem
            key={name}
            value={name}
            onClick={() => {
              setLocalState({ ...localState, transaction_sub_type: name });
              TriggerDrawer('transaction_sub_type', false);
            }}
            className={classes.menutext}
            sx={{
              background:
                localState?.transaction_sub_type === name && '#f08b3250',
            }}
          >
            {name}
          </MenuItem>
        ))}
      </SelectBottomSheet>
    </>
  );
};

export default CreateEWayBillPartA;

const AddNewTransporter = ({ TriggerDrawer }) => {
  const device = localStorage.getItem('device_detect');
  const classes = useStyles();
  const dispatch = useDispatch();
  const initialValidationErr = Object.keys(VALIDATION_TRANSPORTER).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [localState, setLocalState] = useState({});

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value = ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION_TRANSPORTER?.[name]?.test?.(value),
    }));
  };

  const onInputChange = (ps) => {
    const [name, value] = getEventNameValue(ps);
    reValidate(ps);
    setLocalState((s) => ({
      ...s,
      [name]: name === 'number' ? value?.toUpperCase() : value,
    }));
  };

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(localState[v]);
      return a;
    }, {});
  };

  const onFormSubmit = () => {
    const sectionValidation = {};
    Object.keys(VALIDATION_TRANSPORTER).forEach((k) => {
      sectionValidation[k] = VALIDATION_TRANSPORTER[k];
    });
    const g = validateAllFields(sectionValidation);
    const valid = Object.values(g).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...g }));
    } else {
      dispatch(PostTransportersCreateState({ createTransporters: localState }));
    }
  };

  return (
    <div className={css.addtransportersheet}>
      {device === 'mobile' && <Puller />}
      <Stack>
        <Box padding={device === 'desktop' ? '26px 40px' : '36px 20px 20px'}>
          <p className={css.headertext}>New Transporter</p>
        </Box>
        <Box
          component={Stack}
          direction="column"
          padding={device === 'desktop' ? '8px 32px' : '24px 20px 32px'}
          gap="20px"
        >
          <Stack direction="column" width="100%" gap="8px">
            <p className={css.labeltext}>
              Transporter’s Name<span style={{ color: '#f00' }}>*</span>
            </p>
            <TextField
              type="text"
              className={classes.textfiledroot}
              name="name"
              onChange={onInputChange}
              onBlur={reValidate}
              error={validationErr.name}
              helperText={
                validationErr.name ? VALIDATION_TRANSPORTER?.name?.errMsg : ''
              }
              value={localState?.name}
            />
          </Stack>
          <Stack direction="column" width="100%" gap="8px">
            <p className={css.labeltext}>
              Transporter’s ID<span style={{ color: '#f00' }}>*</span>
            </p>
            <TextField
              type="text"
              className={classes.textfiledroot}
              name="number"
              onChange={onInputChange}
              onBlur={reValidate}
              error={validationErr.number}
              helperText={
                validationErr.number
                  ? VALIDATION_TRANSPORTER?.number?.errMsg
                  : ''
              }
              value={localState?.number}
              inputProps={{ style: { textTransform: 'uppercase' } }}
            />
          </Stack>

          <Stack
            direction="row"
            width="100%"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              className={css.secondaryButton}
              onClick={() => TriggerDrawer('newtransport', false)}
            >
              Cancel
            </Button>
            <Button
              className={css.primaryButton}
              onClick={() => onFormSubmit()}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Stack>
    </div>
  );
};
