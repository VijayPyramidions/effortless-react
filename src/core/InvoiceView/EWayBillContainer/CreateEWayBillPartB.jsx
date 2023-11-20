import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import {
  Stack,
  Box,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
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
  disabledClass: {
    pointerEvents: 'none !important',
    background: '#F8F8F8 !important',
  },
  disabledClassWithoutBackGround: {
    pointerEvents: 'none !important',
  },
});
const CreateEWayBillPartB = ({ updateEWayBillParams, EWayBillStatus }) => {
  const classes = useStyles();
  const { state } = useLocation();
  const device = localStorage.getItem('device_detect');
  const [drawer, setDrawer] = useState({});
  const [localState, setLocalState] = useState({
    transportMode: 'road',
    vehicle_type: 'regular',
    document_date: null,
    vehicle_number: null,
    document_number: null,
  });
  const debounce_vehicle_number = useDebounce(localState?.vehicle_number, 500);
  const debounce_document_number = useDebounce(
    localState?.document_number,
    500
  );

  const handleTransportDate = (val) => {
    setLocalState((s) => ({
      ...s,
      document_date: val,
    }));
    updateEWayBillParams(
      {
        document_date: moment(val)?.format('YYYY-MM-DD'),
      },
      'partB'
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
      updateEWayBillParams({ [name]: value }, 'partB');
    }
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
      'partB'
    );
  }, [localState?.transportMode]);

  useEffect(() => {
    if (debounce_vehicle_number !== null) {
      updateEWayBillParams(
        {
          vehicle_number: debounce_vehicle_number,
        },
        'partB'
      );
    }
  }, [debounce_vehicle_number]);

  useEffect(() => {
    if (debounce_document_number !== null) {
      updateEWayBillParams(
        {
          document_number: debounce_document_number,
        },
        'partB'
      );
    }
  }, [debounce_document_number]);

  useEffect(() => {
    if (Object.keys(state?.EWayBillResponse || {})?.length > 0) {
      setLocalState({
        transportMode:
          state?.EWayBillResponse?.transportation_details?.[0]?.mode,
        vehicle_type:
          state?.EWayBillResponse?.transportation_details?.[0]?.vehicle_type,
        document_date: state?.EWayBillResponse?.transportation_details?.[0]
          ?.document_date
          ? new Date(
              state?.EWayBillResponse?.transportation_details?.[0]?.document_date
            )
          : null,
        vehicle_number:
          state?.EWayBillResponse?.transportation_details?.[0]?.vehicle_number,
        document_number:
          state?.EWayBillResponse?.transportation_details?.[0]?.document_number,
      });
    }
  }, [state?.EWayBillResponse]);

  return (
    <Box
      component={Stack}
      gap="12px"
      direction="column"
      alignItems="center"
      className={css.createewaybillpartb}
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
            EWayBillStatus && `${classes.disabledClassWithoutBackGround}`
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
                EWayBillStatus
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
          Vehicle No{' '}
          {localState?.transportMode === 'road' && (
            <span style={{ color: '#f00' }}>*</span>
          )}
        </p>
        <TextField
          type="text"
          className={
            EWayBillStatus
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
          Transportation Doc No
          {localState?.transportMode !== 'road' && (
            <span style={{ color: '#f00' }}>*</span>
          )}
        </p>
        <TextField
          type="text"
          className={
            EWayBillStatus
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
                  'partB'
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
                EWayBillStatus
                  ? `${classes.datefieldroot} ${classes.disabledClass}`
                  : `${classes.datefieldroot}`
              }
            />
          </LocalizationProvider>
        )}
        {device === 'mobile' && (
          <div
            className={
              EWayBillStatus
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
    </Box>
  );
};

export default CreateEWayBillPartB;
