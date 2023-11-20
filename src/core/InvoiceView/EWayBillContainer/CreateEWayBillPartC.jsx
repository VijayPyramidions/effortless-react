import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import {
  Stack,
  Box,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Select,
  MenuItem,
  OutlinedInput,
  Radio,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { makeStyles } from '@material-ui/core/styles';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import useDebounce from '@components/Debounce/Debounce.jsx';

import truck from '@assets/truck.svg';
import aero from '@assets/aero.svg';
import train from '@assets/train.svg';
import truckSelected from '@assets/truckSelected.svg';
import aeroSelected from '@assets/aeroSelected.svg';
import trainSelected from '@assets/trainSelected.svg';
import SailingIcon from '@mui/icons-material/Sailing';
import Calender from '../Calander';

import * as css from './EWayBillStyle.scss';

const useStyles = makeStyles({
  textfiledroot: {
    flexGrow: 1,
    borderRadius: '8px',
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
  datefieldroot: {
    border: '1px solid rgba(0, 0, 0, 0.1) !important',
    borderRadius: '8px',
    background: '#FFF',
    padding: '6px 12px !important',
    height: '30px',
    flexGrow: 1,
    width: 'calc(60% - 24px)',
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
  disabledClassWithoutBackGround: {
    pointerEvents: 'none !important',
  },
});
const CreateEWayBillPartC = ({
  updateEWayBillParams,
  showValue,
  typeCheck,
}) => {
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');
  const [localState, setLocalState] = useState({
    transportMode: 'road',
    vehicle_type: 'regular',
    document_date: null,
    vehicle_number: null,
    document_number: null,
    from_place: null,
    remarks: null,
    from_state: null,
    reason: null,
  });
  const { stateGeneral } = useSelector((value) => value.General);
  const [drawer, setDrawer] = useState({});
  const [from_state, setform_state] = useState([]);

  const debounce_vehicle_number = useDebounce(localState?.vehicle_number, 500);
  const debounce_document_number = useDebounce(
    localState?.document_number,
    500
  );
  const debounce_from_place = useDebounce(localState?.from_place, 500);
  const debounce_remarks = useDebounce(localState?.remarks, 500);

  const reasons_list = [
    'due to break down',
    'due to transhipment',
    'others',
    'first time',
  ];

  const handleTransportDate = (val) => {
    setLocalState((s) => ({
      ...s,
      document_date: val,
    }));
    updateEWayBillParams(
      {
        document_date: moment(val)?.format('YYYY-MM-DD'),
      },
      'partC'
    );
    setDrawer((d) => ({ ...d, invoicedate: false }));
  };

  const onInputChange = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setLocalState((prev) => ({
      ...prev,
      [name]: name === 'vehicle_number' ? value?.toUpperCase() : value,
    }));
    if (name === 'vehicle_type') {
      updateEWayBillParams({ [name]: value }, 'partC');
    }
  };

  const TriggerDrawer = (name, bool) => {
    setDrawer((prev) => ({ ...prev, [name]: bool }));
  };

  useEffect(() => {
    updateEWayBillParams(
      {
        mode: localState?.transportMode,
        vehicle_type: localState?.vehicle_type,
        document_date: localState?.document_date
          ? moment(localState?.document_date)?.format('YYYY-MM-DD')
          : null,
      },
      'partC'
    );
  }, [localState?.transportMode]);

  useEffect(() => {
    if (debounce_vehicle_number !== null) {
      updateEWayBillParams(
        {
          vehicle_number: debounce_vehicle_number,
        },
        'partC'
      );
    }
  }, [debounce_vehicle_number]);

  useEffect(() => {
    if (debounce_document_number !== null) {
      updateEWayBillParams(
        {
          document_number: debounce_document_number,
        },
        'partC'
      );
    }
  }, [debounce_document_number]);

  useEffect(() => {
    if (debounce_from_place !== null) {
      updateEWayBillParams(
        {
          from_place: debounce_from_place,
        },
        'partC'
      );
    }
  }, [debounce_from_place]);

  useEffect(() => {
    if (debounce_remarks !== null) {
      updateEWayBillParams(
        {
          remarks: debounce_remarks,
        },
        'partC'
      );
    }
  }, [debounce_remarks]);

  useEffect(() => {
    if (localState?.from_state) {
      updateEWayBillParams({ from_state: localState?.from_state }, 'partC');
    }
  }, [localState?.from_state]);

  useEffect(() => {
    if (localState?.reason) {
      updateEWayBillParams({ reason: localState?.reason }, 'partC');
    }
  }, [localState?.reason]);

  useEffect(() => {
    if (stateGeneral?.data?.length > 0)
      setform_state(stateGeneral?.data?.map((val) => val?.state_name));
  }, [stateGeneral?.data]);

  useEffect(() => {
    if (Object.keys(showValue || {})?.length > 0) {
      setLocalState({
        from_state: showValue?.from_state,
        reason: showValue?.reason,
        transportMode: showValue?.mode,
        vehicle_type: showValue?.vehicle_type,
        document_date: showValue?.document_date,
        vehicle_number: showValue?.vehicle_number,
        document_number: showValue?.document_number,
        from_place: showValue?.from_place,
        remarks: showValue?.remarks,
      });
    }
  }, [showValue]);

  return (
    <Box
      component={Stack}
      gap="12px"
      direction="column"
      alignItems="center"
      className={css.createewaybillpartc}
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
        >
          Mode of Transportation
        </p>

        <Stack
          direction="row"
          alignItems="center"
          gap="12px"
          justifyContent="space-between"
          className={
            typeCheck === 'view' && `${classes.disabledClassWithoutBackGround}`
          }
        >
          <Box
            component={Stack}
            direction="row"
            alignItems="center"
            gap="4px"
            className={
              localState?.transportMode === 'road'
                ? css.transportmodeselected
                : css.transportmode
            }
            onClick={() =>
              setLocalState({ ...localState, transportMode: 'road' })
            }
          >
            {localState?.transportMode === 'road' ? (
              <img src={truckSelected} alt="truck" />
            ) : (
              <img src={truck} alt="truck" />
            )}
            <p>Road</p>
          </Box>
          <Box
            component={Stack}
            direction="row"
            alignItems="center"
            gap="4px"
            className={
              localState?.transportMode === 'rail'
                ? css.transportmodeselected
                : css.transportmode
            }
            onClick={() =>
              setLocalState({ ...localState, transportMode: 'rail' })
            }
          >
            {localState?.transportMode === 'rail' ? (
              <img src={trainSelected} alt="train" />
            ) : (
              <img src={train} alt="train" />
            )}
            <p>Rail</p>
          </Box>
          <Box
            component={Stack}
            direction="row"
            alignItems="center"
            gap="4px"
            className={
              localState?.transportMode === 'ship'
                ? css.transportmodeselected
                : css.transportmode
            }
            onClick={() =>
              setLocalState({ ...localState, transportMode: 'ship' })
            }
          >
            {localState?.transportMode === 'ship' ? (
              <SailingIcon sx={{ color: '#F08B32', fontSize: '16px' }} />
            ) : (
              <SailingIcon sx={{ color: '#283049', fontSize: '16px' }} />
            )}
            <p>Ship</p>
          </Box>
          <Box
            component={Stack}
            direction="row"
            alignItems="center"
            gap="4px"
            className={
              localState?.transportMode === 'air'
                ? css.transportmodeselected
                : css.transportmode
            }
            onClick={() =>
              setLocalState({ ...localState, transportMode: 'air' })
            }
          >
            {localState?.transportMode === 'air' ? (
              <img src={aeroSelected} alt="aero" />
            ) : (
              <img src={aero} alt="aero" />
            )}
            <p>Air</p>
          </Box>
        </Stack>
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
          Vehicle Type
        </p>

        <Stack>
          <FormControl>
            <RadioGroup
              defaultValue={localState?.vehicle_type}
              className={
                typeCheck === 'view'
                  ? `${css.checkboxgroup} ${classes.disabledClassWithoutBackGround}`
                  : `${css.checkboxgroup}`
              }
              name="vehicle_type"
              value={localState?.vehicle_type}
              onChange={onInputChange}
            >
              <FormControlLabel
                value="regular"
                control={<Radio style={{ color: '#F08B32' }} />}
                label={<p className={css.checkboxtext}>Regular</p>}
                sx={{ margin: 0 }}
              />
              <FormControlLabel
                value="over dimensional cargo"
                control={<Radio style={{ color: '#F08B32' }} />}
                label={
                  <p className={css.checkboxtext}>Over Dimensional Cargo</p>
                }
                sx={{ margin: 0 }}
              />
            </RadioGroup>
          </FormControl>
        </Stack>
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
          Vehicle No
          {localState?.transportMode === 'road' && (
            <span style={{ color: '#f00' }}>*</span>
          )}
        </p>
        <TextField
          type="text"
          className={
            typeCheck === 'view'
              ? `${classes.textfiledroot} ${classes.disabledClass}`
              : `${classes.textfiledroot}`
          }
          name="vehicle_number"
          value={localState?.vehicle_number}
          onChange={onInputChange}
          inputProps={{ style: { textTransform: 'uppercase' } }}
        />
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
          From Place
          <span style={{ color: '#f00' }}>*</span>
        </p>
        <TextField
          type="text"
          className={
            typeCheck === 'view'
              ? `${classes.textfiledroot} ${classes.disabledClass}`
              : `${classes.textfiledroot}`
          }
          name="from_place"
          value={localState?.from_place}
          onChange={onInputChange}
        />
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
          From State
          <span style={{ color: '#f00' }}>*</span>
        </p>
        {device === 'desktop' && (
          <FormControl sx={{ flexGrow: 1 }}>
            <Select
              name="from_state"
              value={localState?.from_state}
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
              className={typeCheck === 'view' && classes.disabledClass}
            >
              {from_state.map((name) => (
                <MenuItem key={name} value={name} className={classes.menutext}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {device === 'mobile' && (
          <Box
            className={
              typeCheck === 'view'
                ? `${css.opensheetfieldroot} ${classes.disabledClass}`
                : `${css.opensheetfieldroot}`
            }
            width={device === 'desktop' ? '55%' : 'calc(100% - 18px)'}
            component={Stack}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => TriggerDrawer('from_state', true)}
          >
            <p
              style={{
                color: localState?.from_state ? '#000' : '#A0A4AF',
              }}
            >
              {localState?.from_state}
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
          Reason
          <span style={{ color: '#f00' }}>*</span>
        </p>
        {device === 'desktop' && (
          <FormControl sx={{ flexGrow: 1 }}>
            <Select
              name="reason"
              value={localState?.reason}
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
              className={typeCheck === 'view' && classes.disabledClass}
              sx={{
                textTransform: 'capitalize !important',
              }}
            >
              {reasons_list.map((name) => (
                <MenuItem key={name} value={name} className={classes.menutext}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {device === 'mobile' && (
          <Box
            className={
              typeCheck === 'view'
                ? `${css.opensheetfieldroot} ${classes.disabledClass}`
                : `${css.opensheetfieldroot}`
            }
            width={device === 'desktop' ? '55%' : 'calc(100% - 18px)'}
            component={Stack}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => TriggerDrawer('reasons', true)}
          >
            <p
              style={{
                color: localState?.reason ? '#000' : '#A0A4AF',
                textTransform: 'capitalize',
              }}
            >
              {localState?.reason}
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
          Remarks
          <span style={{ color: '#f00' }}>*</span>
        </p>
        <TextField
          type="text"
          className={
            typeCheck === 'view'
              ? `${classes.textfiledroot} ${classes.disabledClass}`
              : `${classes.textfiledroot}`
          }
          placeholder="Enter the remarks"
          multiline
          sx={{
            '& .MuiInputBase-input': {
              height: '80px !important',
              padding: '0px !important',
            },
          }}
          name="remarks"
          value={localState?.remarks}
          onChange={onInputChange}
        />
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
          Transportation Doc No
          {localState?.transportMode !== 'road' && (
            <span style={{ color: '#f00' }}>*</span>
          )}
        </p>
        <TextField
          type="text"
          className={
            typeCheck === 'view'
              ? `${classes.textfiledroot} ${classes.disabledClass}`
              : `${classes.textfiledroot}`
          }
          name="document_number"
          value={localState?.document_number}
          onChange={onInputChange}
        />
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
          Transportation Doc Date
          {localState?.transportMode !== 'road' && (
            <span style={{ color: '#f00' }}>*</span>
          )}
        </p>

        {device === 'desktop' && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              inputFormat="DD-MM-YYYY"
              InputProps={{ disableUnderline: true }}
              value={localState?.document_date}
              onChange={(newValue) => {
                setLocalState((s) => ({
                  ...s,
                  document_date: newValue?.$d,
                }));
                updateEWayBillParams(
                  {
                    document_date: moment(newValue?.$d)?.format('YYYY-MM-DD'),
                  },
                  'partC'
                );
              }}
              views={['year', 'month', 'day']}
              renderInput={(params) => (
                <TextField
                  // onKeyDown={(e) => e.preventDefault()}
                  variant="standard"
                  {...params}
                />
              )}
              className={
                typeCheck === 'view'
                  ? `${classes.datefieldroot} ${classes.disabledClass}`
                  : `${classes.datefieldroot}`
              }
            />
          </LocalizationProvider>
        )}
        {device === 'mobile' && (
          <div
            className={
              typeCheck === 'view'
                ? `${css.mobiledate} ${classes.disabledClass}`
                : `${css.mobiledate}`
            }
          >
            <div
              className={css.mobiledatefield}
              onClick={() => {
                // if (typeForm === 'add')
                setDrawer({ ...drawer, invoicedate: true });
              }}
            >
              <input
                type="text"
                value={
                  localState?.document_date
                    ? moment(localState?.document_date).format('DD-MM-YYYY')
                    : 'dd-mm-yyyy'
                }
                className={css.mobiledateinput}
              />
              <CalendarIcon style={{ width: 20, color: '#949494' }} />
            </div>
          </div>
        )}
      </Stack>

      <SelectBottomSheet
        open={drawer.from_state}
        onClose={() => TriggerDrawer('from_state', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        {from_state.map((name) => (
          <MenuItem
            key={name}
            value={name}
            className={classes.menutext}
            onClick={() => {
              setLocalState({ ...localState, from_state: name });
              TriggerDrawer('from_state', false);
            }}
            sx={{
              background: localState?.from_state === name && '#f08b3250',
            }}
          >
            {name}
          </MenuItem>
        ))}
      </SelectBottomSheet>

      <SelectBottomSheet
        name="einvoicedate"
        addNewSheet
        triggerComponent={<></>}
        open={drawer.invoicedate}
        onClose={() => setDrawer({ ...drawer, invoicedate: false })}
      >
        <Calender
          head="Select Date"
          button="Select"
          handleDate={handleTransportDate}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        open={drawer.reasons}
        onClose={() => TriggerDrawer('reasons', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        {reasons_list.map((name) => (
          <MenuItem
            key={name}
            value={name}
            className={classes.menutext}
            onClick={() => {
              setLocalState({ ...localState, reason: name });
              TriggerDrawer('reasons', false);
            }}
            sx={{
              background: localState?.reason === name && '#f08b3250',
            }}
          >
            {name}
          </MenuItem>
        ))}
      </SelectBottomSheet>
    </Box>
  );
};

export default CreateEWayBillPartC;
