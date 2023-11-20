/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import AppContext from '@root/AppContext';

import {
  postTrip,
  editTrip,
  setTripSave,
} from '@action/Store/Reducers/Reimbursement/ReimbursementState';

import {
  createUpdateAdvPayment,
  setAdvPaymentDetails,
} from '@action/Store/Reducers/Payments/AdvancePaymentState';
import { getBankAccounts } from '@action/Store/Reducers/Payments/PaymentsState';

import {
  Button,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  TextField,
  InputAdornment,
  // Puller,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';

import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { KeyboardBackspaceRounded as KeyboardBackspaceRoundedIcon } from '@mui/icons-material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ProceedToPay from '@core/PaymentView/shared/ProceedToPay';
import ForgetPassword from '@core/PaymentView/TransactionVerify/ForgetPassword';

import { FormattedAmount } from '@components/formattedValue/FormattedValue';

import red_color_delete from '@assets/red_color_delete.svg';
import { SearchIconModule } from '@components/SvgIcons/SvgIcons';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { convertKeysToSnakeCase } from '@components/utils';
import { validateRequired } from '@services/Validation';
import Input from '@components/Input/Input';
import { styled } from '@mui/material/styles';

import Calender from '../../InvoiceView/Calander';
import * as css from '../ReimbursementContainer.scss';
// import { SelectField } from '../../../components/Select/Select';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,

  backgroundColor: '#FFFFFF',
  border: '1px solid #F08B32',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  padding: 0,
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: '#FFFFFF',
    border: '1px solid #F08B32',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(57,75,89,.5)'
        : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#F08B32',

  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#F08B32',
  },
});

const BpRadio = (props) => {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
};

const AddTrip = ({
  type,
  setTripSheet,
  onClose,
  selectedTip,
  byManager,
  setAddTripManager,
}) => {
  const device = localStorage.getItem('device_detect');
  const { currentUserInfo } = useContext(AppContext);
  const { state } = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElEmp, setAnchorElEmp] = useState(null);
  const { bankAccounts } = useSelector((value) => value.Payments);
  const { paymentVoucharId, advPaymentDetails, advPaymentId } = useSelector(
    (value) => value.AdvancePayment
  );
  const [transacForgetPass, setTransacForgetPass] = useState(false);

  const { managers, employees, tripSave } = useSelector(
    (value) => value.Reimbursement
  );
  const [localState, setLocalState] = useState({
    id: selectedTip?.id || '',
    name: selectedTip?.name || '',
    startDate: selectedTip?.start_date || null,
    endDate: selectedTip?.end_date || null,
    selectedManager: selectedTip?.manager_details || null,
    advance: selectedTip?.advance_amount > 0 ? 'yes' : 'no' || 'no',
    amount: selectedTip?.advance_amount || '',
    description: selectedTip?.advance_description || '',
  });

  const [validationErr, setValidationErr] = useState({
    name: false,
    startDate: false,
    endDate: false,
    selectedManager: false,
    amount: false,
    description: false,
  });

  const [ShowType, setShowType] = useState(type);
  const [drawer, setDrawer] = useState({});

  const reValidate = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setValidationErr((s) => ({ ...s, [name]: !validateRequired(value) }));
  };

  const hanldeChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      reValidate(e);
    }
    if (name !== 'amount')
      setLocalState((prev) => ({ ...prev, [name]: value }));
    else {
      const pattern = /^[0-9]*$/;
      if (pattern.test(value)) {
        setLocalState((prev) => ({ ...prev, [name]: value }));
        setValidationErr((s) => ({ ...s, [name]: !validateRequired(value) }));
      }
    }
  };

  const handleDate = (name, val) => {
    setLocalState((s) => ({
      ...s,
      [name]: val,
    }));
    setDrawer((d) => ({ ...d, [name]: false }));
    setValidationErr((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const ValidCheck = () => {
    if (
      !localState?.name ||
      !moment(localState?.startDate).isValid() ||
      !moment(localState?.endDate).isValid() ||
      !localState?.selectedManager ||
      (localState?.advance === 'yes' && !localState?.amount) ||
      (localState?.advance === 'yes' && !localState?.description)
    ) {
      setValidationErr({
        name: !localState?.name,
        startDate: !localState?.startDate,
        endDate: !localState?.endDate,
        selectedManager: !localState?.selectedManager,
        amount: localState.advance === 'yes' && !localState?.amount,
        description: localState.advance === 'yes' && !localState.description,
      });
      return false;
    }
    return true;
  };

  const ValidCheckManager = () => {
    if (
      !localState?.name ||
      !localState?.startDate ||
      !localState?.endDate ||
      (localState?.advance === 'yes' && !localState?.amount) ||
      (localState?.advance === 'yes' && !localState?.description)
    ) {
      setValidationErr({
        name: !localState?.name,
        startDate: !localState?.startDate,
        endDate: !localState?.endDate,
        amount: localState.advance === 'yes' && !localState?.amount,
        description: localState.advance === 'yes' && !localState.description,
      });
      return false;
    }
    return true;
  };

  const onsubmitvalue = () => {
    const arr = convertKeysToSnakeCase(localState);
    if (ValidCheck()) {
      const payload =
        arr.advance === 'yes'
          ? {
              ...arr,
              start_date: moment(arr.start_date).format('YYYY-MM-DD'),
              end_date: moment(arr.end_date).format('YYYY-MM-DD'),
              manager_id: arr.selected_manager.id,
              advance: {
                amount: arr.advance === 'yes' ? arr.amount : 0,
                description: arr.advance === 'yes' ? arr.description : null,
              },
            }
          : {
              ...arr,
              start_date: moment(arr.start_date).format('YYYY-MM-DD'),
              end_date: moment(arr.end_date).format('YYYY-MM-DD'),
              manager_id: arr.selected_manager.id,
            };
      if (payload.advance === 'no') delete payload.advance;

      dispatch(postTrip(payload));
    }
  };

  const onsubmitvalueManager = () => {
    const arr = convertKeysToSnakeCase(localState);
    if (ValidCheckManager()) {
      dispatch(
        postTrip({
          // ...arr,
          name: arr?.name,
          start_date: moment(arr.start_date).format('YYYY-MM-DD'),
          end_date: moment(arr.end_date).format('YYYY-MM-DD'),
          manager_id: currentUserInfo?.id,
          advance: {
            amount: arr.amount,
            description: arr.description,
            // advance_request_date: moment().format('YYYY-MM-DD'),
          },
          employee_id: arr?.employee_id,
        })
      );
    }
  };

  const onupdatevalue = () => {
    const arr = convertKeysToSnakeCase(localState);

    if (ValidCheck()) {
      const payload =
        arr.advance === 'yes'
          ? {
              ...arr,
              start_date: moment(arr.start_date).format('YYYY-MM-DD'),
              end_date: moment(arr.end_date).format('YYYY-MM-DD'),
              manager_id: arr.selected_manager.id,
              advance: {
                amount: arr.advance === 'yes' ? arr.amount : 0,
                description: arr.advance === 'yes' ? arr.description : null,
              },
            }
          : {
              ...arr,
              start_date: moment(arr.start_date).format('YYYY-MM-DD'),
              end_date: moment(arr.end_date).format('YYYY-MM-DD'),
              manager_id: arr.selected_manager.id,
            };

      if (payload.advance === 'no') delete payload.advance;

      dispatch(editTrip(payload));
    }
  };

  useEffect(() => {
    if (device === 'mobile') {
      setShowType(state?.type || type || 'new');
    }
  }, [state]);

  useEffect(() => {
    // setAddTripManager(false);
    if (tripSave?.id && byManager) {
      dispatch(
        createUpdateAdvPayment({
          type: 'post',
          payload: {
            // advance_request_id: ,
            amount: localState?.amount,
            vendor_id: localState?.selectedEmployee?.entity_id,
            entity_type: 'employee',
          },
        })
      );
    }
    return () => dispatch(setTripSave(null));
  }, [tripSave]);

  useEffect(() => {
    if (advPaymentDetails?.id) {
      dispatch(getBankAccounts(paymentVoucharId));
      setDrawer((d) => ({ ...d, proceedToPay: true }));
    } else if (advPaymentDetails?.error) {
      setAddTripManager(false);
    }
    return () => dispatch(setAdvPaymentDetails(null));
  }, [advPaymentDetails]);

  return (
    <>
      <div className={css.reimursementsheet}>
        <Stack
          direction="row"
          alignItems="center"
          className={css.headerwrapper}
        >
          <IconButton
            sx={{ marginRight: '8px' }}
            onClick={() => {
              if (byManager) setAddTripManager(false);
              if (device === 'mobile') {
                setTripSheet('main');
                onClose();
              } else setTripSheet('main');
            }}
          >
            <KeyboardBackspaceRoundedIcon />
          </IconButton>
          <Typography
            className={css.headertext}
            style={{ padding: '0 0 4px 0' }}
          >
            {ShowType === 'update' ? 'Update Trip Detail' : 'Create New Trip'}
          </Typography>
        </Stack>
        <div className={css.addtripcont}>
          {byManager && (
            <>
              <div
                onClick={(e) => {
                  if (ShowType !== 'view') setAnchorElEmp(e?.currentTarget);
                }}
                className={
                  ShowType === 'view' ? css.selectfielddisable : css.selectfield
                }
              >
                <Input
                  type="text"
                  className={`${css.selectfieldinput} ${css.selectarrow}`}
                  required
                  label="Select Employee"
                  variant="standard"
                  name="selectedEmployee"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  theme="light"
                  rootStyle={{
                    border: '1px solid rgba(153, 158, 165, 0.39)',
                  }}
                  error={validationErr?.selectedEmployee}
                  helperText={
                    validationErr?.selectedEmployee
                      ? 'Please Select Employee'
                      : ''
                  }
                  value={localState?.selectedEmployee?.name}
                  disabled={ShowType === 'view'}
                />
              </div>

              <Popover
                anchorEl={anchorElEmp}
                PaperProps={{
                  style: {
                    width: '366px',
                    boxShadow:
                      '0px 9px 42px rgba(0, 0, 0, 0.1), 0px 0px 6px rgba(0, 0, 0, 0.05)',
                    borderRadius: '8px',
                    marginTop: '10px',
                  },
                }}
                open={Boolean(anchorElEmp && device === 'desktop')}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                onClose={() => setAnchorElEmp(null)}
              >
                <ListForFiled
                  list={employees}
                  state={localState?.selectedEmployee}
                  setState={(val) => {
                    setLocalState({
                      ...localState,
                      selectedEmployee: val,
                      employeeId: val.user_id,
                    });
                    setValidationErr({
                      ...validationErr,
                      selectedEmployee: false,
                    });
                    setAnchorElEmp(null);
                  }}
                  name="Employee"
                />
              </Popover>

              <SelectBottomSheet
                open={anchorElEmp && device === 'mobile'}
                triggerComponent={<></>}
                onClose={() => setAnchorElEmp(null)}
              >
                {/* <Puller /> */}
                <ListForFiled
                  list={employees}
                  state={localState?.selectedEmployee}
                  setState={(val) => {
                    setLocalState({
                      ...localState,
                      selectedEmployee: val,
                      employeeId: val.user_id,
                    });
                    setValidationErr({
                      ...validationErr,
                      selectedEmployee: false,
                    });
                    setAnchorElEmp(null);
                  }}
                  name="Employee"
                />
              </SelectBottomSheet>
            </>
          )}

          <Input
            className={`${css.selectfieldinput}`}
            required
            label="Trip Name"
            variant="standard"
            name="name"
            onBlur={reValidate}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid rgba(153, 158, 165, 0.39)',
              pointerEvents: 'all',
            }}
            error={validationErr?.name}
            helperText={validationErr?.name ? 'Please Enter Trip Name' : ''}
            onChange={hanldeChange}
            value={localState?.name}
            disabled={ShowType === 'view'}
          />
          {device === 'desktop' && (
            <Stack
              direction="row"
              width="100%"
              justifyContent="space-between"
              gap="16px"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="startDate"
                  inputFormat="DD-MM-YYYY"
                  InputProps={{ disableUnderline: true }}
                  value={localState?.startDate || ''}
                  onChange={(e) => {
                    if (moment(e?.$d, 'DD-MM-YYYY').isValid())
                      setValidationErr((prev) => ({
                        ...prev,
                        startDate: false,
                      }));
                    else
                      setValidationErr((prev) => ({
                        ...prev,
                        startDate: true,
                      }));
                    setLocalState((prev) => ({ ...prev, startDate: e?.$d }));
                  }}
                  views={['year', 'month', 'day']}
                  renderInput={(params) => (
                    <Input
                      {...params}
                      required
                      label="Start Date"
                      variant="standard"
                      name="startDate"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      theme="light"
                      rootStyle={{
                        border: '1px solid rgba(153, 158, 165, 0.39)',
                      }}
                      error={validationErr?.startDate}
                      helperText={
                        validationErr?.startDate ? 'Enter Valid Date' : ''
                      }
                    />
                  )}
                  disabled={ShowType === 'view'}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="endDate"
                  inputFormat="DD-MM-YYYY"
                  minDate={moment(localState?.startDate, 'YYYY-MM-DD').format(
                    'YYYY-MM-DD'
                  )}
                  InputProps={{ disableUnderline: true }}
                  value={localState?.endDate || ''}
                  onChange={(e) => {
                    if (moment(e?.$d, 'DD-MM-YYYY').isValid())
                      setValidationErr((prev) => ({
                        ...prev,
                        endDate: false,
                      }));
                    else
                      setValidationErr((prev) => ({
                        ...prev,
                        endDate: true,
                      }));
                    setLocalState((prev) => ({ ...prev, endDate: e?.$d }));
                  }}
                  views={['year', 'month', 'day']}
                  renderInput={(params) => (
                    <Input
                      {...params}
                      required
                      label="End Date"
                      variant="standard"
                      name="endDate"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      theme="light"
                      rootStyle={{
                        border: '1px solid rgba(153, 158, 165, 0.39)',
                      }}
                      error={validationErr?.endDate}
                      helperText={
                        validationErr?.endDate ? 'Enter Valid Date' : ''
                      }
                    />
                  )}
                  disabled={ShowType === 'view'}
                />
              </LocalizationProvider>
            </Stack>
          )}

          {device === 'mobile' && (
            <Stack
              direction="row"
              width="100%"
              justifyContent="space-between"
              gap="16px"
            >
              <div className={css.mobiledate}>
                <div className={css.mobiledatefield}>
                  <div
                    onClick={() => {
                      setDrawer({ ...drawer, startDate: true });
                    }}
                  >
                    <Input
                      type="text"
                      value={
                        localState?.startDate
                          ? moment(localState?.startDate).format('DD-MM-YYYY')
                          : 'dd-mm-yyyy'
                      }
                      className={
                        // ShowType === 'view'
                        //   ? `${css.mobiledateinput} ${classes.disabledclass}` :
                        css.mobiledateinput
                      }
                      required
                      label="Start Date"
                      variant="standard"
                      name="startDate"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      theme="light"
                      rootStyle={{
                        border: '1px solid rgba(153, 158, 165, 0.39)',
                      }}
                      error={validationErr?.startDate}
                      helperText={
                        validationErr?.startDate ? 'Enter Valid Date' : ''
                      }
                    />
                  </div>

                  <SelectBottomSheet
                    name="startDate"
                    addNewSheet
                    triggerComponent={
                      <CalendarIcon
                        style={{ width: 20, color: '#949494' }}
                        onClick={() => {
                          setDrawer({ ...drawer, startDate: true });
                        }}
                      />
                    }
                    open={drawer.startDate}
                    onClose={() => setDrawer({ ...drawer, startDate: false })}
                  >
                    <Calender
                      head="Select Start Date"
                      button="Select"
                      handleDate={(date) => handleDate('startDate', date)}
                    />
                  </SelectBottomSheet>
                </div>
              </div>
              <div className={css.mobiledate}>
                <div className={css.mobiledatefield}>
                  <Input
                    type="text"
                    value={
                      localState?.endDate
                        ? moment(localState?.endDate).format('DD-MM-YYYY')
                        : 'dd-mm-yyyy'
                    }
                    className={
                      // ShowType === 'view'
                      //   ? `${css.mobiledateinput} ${classes.disabledclass}` :
                      css.mobiledateinput
                    }
                    required
                    label="End Date"
                    variant="standard"
                    name="endDate"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    theme="light"
                    rootStyle={{
                      border: '1px solid rgba(153, 158, 165, 0.39)',
                    }}
                    error={validationErr?.endDate}
                    helperText={
                      validationErr?.endDate ? 'Enter Valid Date' : ''
                    }
                  />

                  <SelectBottomSheet
                    name="endDate"
                    addNewSheet
                    triggerComponent={
                      <CalendarIcon
                        style={{ width: 20, color: '#949494' }}
                        onClick={() => {
                          setDrawer({ ...drawer, endDate: true });
                        }}
                      />
                    }
                    open={drawer.endDate}
                    onClose={() => setDrawer({ ...drawer, endDate: false })}
                  >
                    <Calender
                      head="Select End Date"
                      button="Select"
                      handleDate={(date) => handleDate('endDate', date)}
                      selectedTip={{
                        start_date: moment(localState?.startDate).format(
                          'YYYY-MM-DD'
                        ),
                      }}
                    />
                  </SelectBottomSheet>
                </div>
              </div>
            </Stack>
          )}
          {!byManager && (
            <>
              <div
                onClick={(e) => {
                  if (ShowType !== 'view') setAnchorEl(e?.currentTarget);
                }}
                className={
                  ShowType === 'view' ? css.selectfielddisable : css.selectfield
                }
              >
                <Input
                  type="text"
                  className={`${css.selectfieldinput} ${css.selectarrow}`}
                  required
                  label="Select Manager"
                  variant="standard"
                  name="selectedManager"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  theme="light"
                  rootStyle={{
                    border: '1px solid rgba(153, 158, 165, 0.39)',
                  }}
                  error={validationErr?.selectedManager}
                  helperText={
                    validationErr?.selectedManager
                      ? 'Please Select Manager'
                      : ''
                  }
                  value={localState?.selectedManager?.name}
                  disabled={ShowType === 'view'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        // aria-label="toggle password visibility"
                        // onClick={handleClickShowPassword}
                        // onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        <KeyboardArrowDownRoundedIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </div>

              <Popover
                anchorEl={anchorEl}
                PaperProps={{
                  style: {
                    width: '366px',
                    boxShadow:
                      '0px 9px 42px rgba(0, 0, 0, 0.1), 0px 0px 6px rgba(0, 0, 0, 0.05)',
                    borderRadius: '8px',
                    marginTop: '10px',
                  },
                }}
                open={Boolean(anchorEl && device === 'desktop')}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                onClose={() => setAnchorEl(null)}
              >
                <ListForFiled
                  list={managers.map((item) => ({
                    ...item,
                    id: item.manager_id,
                  }))}
                  state={localState?.selectedManager}
                  setState={(val) => {
                    setLocalState({
                      ...localState,
                      selectedManager: { ...val, id: val.manager_id },
                      managerId: val.manager_id,
                    });
                    setValidationErr({
                      ...validationErr,
                      selectedManager: false,
                    });
                    setAnchorEl(null);
                  }}
                  name="Manager"
                />
              </Popover>
              <SelectBottomSheet
                open={Boolean(anchorEl) && device === 'mobile'}
                triggerComponent={<></>}
                onClose={() => setAnchorEl(false)}
              >
                {/* <Puller /> */}
                <ListForFiled
                  list={managers?.map((item) => ({
                    ...item,
                    id: item.manager_id,
                  }))}
                  state={localState?.selectedManager}
                  setState={(val) => {
                    setLocalState({
                      ...localState,
                      selectedManager: { ...val, id: val.manager_id },
                      managerId: val.manager_id,
                    });
                    setAnchorEl(null);
                  }}
                  name="manager"
                />
              </SelectBottomSheet>
            </>
          )}
          <Stack direction="row" className={css.advancetrip}>
            <Typography className={css.adtriplabel}>
              {`${byManager ? 'Pay' : 'Request'} Advance for this Trip`}
            </Typography>
            {!byManager && (
              <Stack className={css.adtripoptions}>
                <RadioGroup
                  row
                  name="advance"
                  value={localState.advance}
                  onChange={hanldeChange}
                  className={css.radiobtn}
                >
                  <FormControlLabel
                    value="yes"
                    control={<BpRadio />}
                    label="Yes"
                    className={css.radiolabel}
                  />
                  <FormControlLabel
                    value="no"
                    control={<BpRadio />}
                    label="No"
                    className={css.radiolabel}
                  />
                </RadioGroup>
              </Stack>
            )}
          </Stack>
          {(localState.advance === 'yes' || byManager) && (
            <>
              <Input
                required
                label="Enter Amount"
                variant="standard"
                name="amount"
                onBlur={reValidate}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid rgba(153, 158, 165, 0.39)',
                }}
                type="text"
                placeholder="0"
                error={validationErr?.amount}
                helperText={validationErr?.amount ? 'Enter Valid Amount' : ''}
                onChange={hanldeChange}
                value={localState?.amount}
                sx={ShowType === 'view' && { background: '#F2F2F2' }}
                disabled={ShowType === 'view'}
              />

              <Stack
                direction="row"
                alignItems="center"
                gap="20px"
                sx={device === 'mobile' ? { marginTop: '0px' } : {}}
              >
                <Button
                  className={css.amountbutton}
                  value={2000}
                  name="amount"
                  onClick={hanldeChange}
                >
                  ₹2,000
                </Button>
                <Button
                  className={css.amountbutton}
                  value={4000}
                  name="amount"
                  onClick={hanldeChange}
                >
                  ₹4,000
                </Button>
                <Button
                  className={css.amountbutton}
                  value={6000}
                  name="amount"
                  onClick={hanldeChange}
                >
                  ₹6,000
                </Button>
              </Stack>
              <Input
                required
                label="Trip Details"
                variant="standard"
                name="description"
                multiline
                rows={3}
                onBlur={reValidate}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                theme="light"
                rootStyle={{
                  border: '1px solid rgba(153, 158, 165, 0.39)',
                }}
                error={validationErr?.description}
                helperText={
                  validationErr?.description
                    ? 'Please Provide Trip Details'
                    : ''
                }
                onChange={hanldeChange}
                value={localState?.description}
                disabled={ShowType === 'view'}
              />
            </>
          )}

          {ShowType === 'new' && (
            <>
              {!byManager ? (
                <Button
                  className={css.primaryButton}
                  onClick={() => onsubmitvalue()}
                >
                  {localState?.advance === 'no' && !byManager
                    ? 'Create Trip'
                    : 'Create Trip & Request Advance'}
                </Button>
              ) : (
                <Button
                  className={css.primaryButton}
                  onClick={() => onsubmitvalueManager()}
                >
                  Create Trip & Pay Advance
                </Button>
              )}
            </>
          )}

          {ShowType === 'view' && (
            <Stack direction="row" width="100%" justifyContent="space-between">
              <Button className={css.deleteButton}>
                <img
                  src={red_color_delete}
                  alt="delete"
                  style={{ width: '14px' }}
                />
                Delete Trip
              </Button>
              <Button
                className={css.editButton}
                onClick={() => setShowType('update')}
              >
                <DriveFileRenameOutlineIcon sx={{ fontSize: '16px' }} />
                Edit
              </Button>
            </Stack>
          )}

          {ShowType === 'update' && (
            <Button
              className={css.primaryButton}
              onClick={() => onupdatevalue()}
            >
              Update Trip
            </Button>
          )}
        </div>
      </div>
      <SelectBottomSheet
        triggerComponent
        open={drawer.proceedToPay}
        name="proceedToPay"
        onClose={() => setDrawer((d) => ({ ...d, proceedToPay: false }))}
        addNewSheet
      >
        <ProceedToPay
          onClose={(res) => {
            setDrawer((d) => ({ ...d, proceedToPay: false }));
            if (res === 'success') navigate('/payment-history');
          }}
          paymentVoucharId={paymentVoucharId}
          advancePaymentId={advPaymentId}
          // setMultiplePayments={setMultiplePayments}
          // setPaymentsResponse={setPaymentsResponse}
          showVerifyPassword={[drawer, setDrawer]}
          bankAccounts={bankAccounts}
          paidAmount={Number(localState?.amount)?.toFixed(2)}
          payNow={{
            active: true,
            title: FormattedAmount(localState?.amount),
            subTitle: '',
          }}
          ShowTransForgPass={() => setTransacForgetPass(true)}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        triggerComponent
        open={transacForgetPass}
        name="forgetPassword"
        hideClose
      >
        <ForgetPassword onClose={() => setTransacForgetPass(false)} />
      </SelectBottomSheet>
    </>
  );
};

export default AddTrip;

const ListForFiled = ({ list, state, setState, name }) => {
  const device = localStorage.getItem('device_detect');
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div>
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIconModule />
            </InputAdornment>
          ),
        }}
        sx={{
          width: '90%',
          margin: '16px 5% !important',
          borderRadius: '4px',
          border: '1px solid rgba(0, 0, 0, 0.10) !important',
          '& .MuiInputBase-input': {
            padding: '8px 0',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            '& fieldset': {
              border: 'none',
            },
          },
          '& svg': {
            color: 'red',
          },
        }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e?.target?.value)}
        placeholder={`Search ${name} Name`}
      />
      <div
        style={{
          overflow: 'auto',
          height: device === 'desktop' ? '200px' : 'unset',
        }}
      >
        {list?.filter((data) =>
          data?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        )?.length === 0 && (
          <p className={css.menutext} style={{ textAlign: 'center' }}>
            No Data
          </p>
        )}
        <ul style={{ padding: 0 }}>
          {list
            ?.filter((data) =>
              data?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
            )
            ?.map((val) => (
              <MenuItem
                key={val?.id}
                value={val?.id}
                onClick={() => {
                  setState(val);
                }}
                className={css.menutext}
                sx={{
                  background: state?.id === val?.id && '#f08b3250',
                  display: 'flex !important',
                  justifyContent: 'flex-start !important',
                }}
              >
                {val?.name}
              </MenuItem>
            ))}
        </ul>
      </div>
    </div>
  );
};
