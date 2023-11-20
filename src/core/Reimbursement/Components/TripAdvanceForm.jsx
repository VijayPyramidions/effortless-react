import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import {
  getManagers,
  postClaims,
  deleteClaim,
  updateClaim,
  setReimbursementPerformanceAction,
  rejectClaim,
  setOnClaim,
  setAdvanceRes,
  getTrips,
} from '@action/Store/Reducers/Reimbursement/ReimbursementState';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import AppContext from '@root/AppContext';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import {
  createUpdateAdvPayment,
  setAdvPaymentDetails,
} from '@action/Store/Reducers/Payments/AdvancePaymentState';
import { getBankAccounts } from '@action/Store/Reducers/Payments/PaymentsState';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
import {
  // enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import { styled } from '@material-ui/core/styles';
import {
  Button,
  Stack,
  Box,
  Typography,
  MenuItem,
  TextField,
  InputAdornment,
  Dialog,
  Avatar,
  // IconButton,
} from '@mui/material';
// import FormControl from '@mui/material/FormControl';

import { FormattedAmount } from '@components/formattedValue/FormattedValue';
// import { createUpdateAdvPayment } from '@action/Store/Reducers/Payments/AdvancePaymentState';

import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import red_color_delete from '@assets/red_color_delete.svg';
import Popover from '@material-ui/core/Popover';
// import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { SearchIconModule } from '@components/SvgIcons/SvgIcons';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import { validateRequired } from '@services/Validation';
import Input from '@components/Input/Input';
import { IndianCurrency, convertKeysToSnakeCase } from '@components/utils';
import { CustomizedStepper, DeleteContent } from './ReimbursementActionSheets';
import ProceedToPay from '../../PaymentView/shared/ProceedToPay';
import ForgetPassword from '../../PaymentView/TransactionVerify/ForgetPassword';

// import AdvanceTable from './AdvanceTable';
import * as css from '../ReimbursementContainer.scss';

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  margin: '16px auto 0 auto',
  // top: 8,
  // left: 'calc(50% - 15px)',
}));

export const RequestTripAdvanceForm = ({
  tab,
  action,
  dataValue,
  onClose,
  payment,
  disabled,
  active,
}) => {
  const device = localStorage.getItem('device_detect');
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();

  const {
    managers,
    advancePerformActions,
    oneClaimDetails,
    // tripSave,
    tripDetails,
  } = useSelector((value) => value.Reimbursement);

  const { userPermissions } = useContext(AppContext);
  const { bankAccounts } = useSelector((value) => value.Payments);

  const { paymentVoucharId, advPaymentDetails, advPaymentId } = useSelector(
    (value) => value.AdvancePayment
  );

  const [drawer, setDrawer] = useState({});

  const [drawerState, setDrawerState] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectvalidationErr, setRejectValidationErr] = useState({
    description: false,
  });
  const [transacForgetPass, setTransacForgetPass] = useState(false);
  const [havePermission, setHavePermission] = useState(false);

  // const [activeStepper] = useState({
  //   active: 3,
  //   showData: [
  //     {
  //       name: 'Submitted on',
  //       label: moment(data?.date)?.format('DD MMM YYYY'),
  //       id: 1,
  //       type: 'submit',
  //     },
  //     {
  //       name: 'Approved',
  //       label: '',
  //       id: 2,
  //       type: 'approve',
  //     },
  //     {
  //       name: 'Payment on',
  //       label: '',
  //       id: 3,
  //       type: 'payment',
  //     },
  //   ],
  // });

  const intialState = {
    reimbursementType: 'advance',
    tab: 'advance',
    id: '',
    amount: '',
    selectedTrip: {},
    selectedTripId: '',
    selectedManager: {},
    managerId: '',
    description: '',
    status: '',
  };
  // : {
  //     reimbursementType: 'advance',
  //     tab: 'advance',
  //     id: state?.data?.id || '',
  //     amount: state?.data?.amount || '',
  //     selectedManager: {},
  //     managerId: state?.data?.manager_id || '',
  //     description: state?.data?.description || '',
  //   };

  const [localState, setLocalState] = useState(intialState);
  const [validationErr, setValidationErr] = useState({
    amount: false,
    description: false,
    selectedTrip: false,
    selectedManager: false,
  });
  const [ShowType, setShowType] = useState(action || state?.action);
  const [anchorEl, setAnchorEl] = useState(null);
  const [btnDisable, setBtnDisable] = useState(false);

  const reValidate = (e) => {
    const { name, value } = e.target;

    setValidationErr((s) => ({ ...s, [name]: !validateRequired(value) }));
  };

  const hanldeChange = (e) => {
    const { name, value } = e.target;
    reValidate(e);
    setLocalState((prev) => ({ ...prev, [name]: value }));
  };

  const amtClick = (e) => {
    const { value } = e?.target;
    reValidate(e);
    setLocalState((prev) => ({
      ...prev,
      amount: Number(value),
    }));
  };

  const ValidCheck = () => {
    const validState = {
      amount: Number(localState?.amount) === 0 || !localState?.amount,
      description: !localState?.description,
      selectedManager:
        Object.keys(localState?.selectedManager || {})?.length === 0,
      selectedTrip: Object.keys(localState?.selectedTrip || {})?.length === 0,
    };

    setValidationErr({ ...validState });
    const valid = Object.values(validState).every((val) => !val);
    if (!valid) return false;
    return true;
  };

  const onsubmitvalue = () => {
    setBtnDisable(true);
    setTimeout(() => setBtnDisable(false), 3000);
    if (payment || state?.payment) {
      dispatch(
        createUpdateAdvPayment({
          type: 'post',
          payload: {
            advance_request_id: oneClaimDetails?.id,
            amount: localState?.amount,
            vendor_id: oneClaimDetails?.employee_id,
            entity_type: 'employee',
          },
        })
      );
    } else {
      const arr = convertKeysToSnakeCase(localState);
      if (ValidCheck()) {
        if (localState?.id) dispatch(updateClaim(arr));
        else
          dispatch(
            postClaims({
              ...arr,
              reimbursement_group_id: arr.selected_trip.id || null,
            })
          );
      }
    }
  };

  const onsubmitReject = async () => {
    if (rejectReason) {
      await dispatch(
        rejectClaim({
          id: oneClaimDetails?.id || localState?.id,
          reason: rejectReason,
          tab: active,
        })
      );
      setDrawerState((d) => ({ ...d, rejectReason: false }));
      if (!device) {
        onClose();
      } else {
        navigate('/reimbursement-approval');
      }
    } else {
      setRejectValidationErr((s) => ({ ...s, description: true }));
    }
  };

  useEffect(() => {
    setLocalState((prev) => ({
      ...prev,
      selectedManager: managers?.find(
        (item) => item.manager_id === localState?.managerId
      ),
    }));
  }, [managers, localState?.managerId]);

  useEffect(() => {
    if (advPaymentDetails) {
      setDrawer((d) => ({ ...d, proceedToPay: true }));
      dispatch(getBankAccounts(paymentVoucharId));
    }
  }, [advPaymentDetails]);

  useEffect(() => {
    if (
      device === 'desktop' &&
      window.location.pathname === '/reimbursement-trip-advance-request'
    ) {
      navigate('/reimbursement');
    }
    dispatch(getTrips({ type: 'outstanding', status: '' }));
    return () => {
      dispatch(setOnClaim({}));
      dispatch(setAdvPaymentDetails(null));
    };
  }, []);

  useEffect(() => {
    dispatch(getManagers());
    // dispatch(
    //   createUpdateAdvPayment({
    //     type: 'post',
    //     payload: { vendor_id: data?.creator_id },
    //   })
    // );
    return () => {
      dispatch(
        setReimbursementPerformanceAction({
          name: 'advancePerformActions',
          value: '',
        })
      );

      dispatch(setAdvanceRes(''));
      setLocalState(intialState);
    };
  }, [dispatch]);

  useEffect(() => {
    if (
      advancePerformActions === 'request_advance_added_successfully' ||
      advancePerformActions === 'request_advance_updated_successfully'
    )
      navigate('/reimbursement');
  }, [advancePerformActions]);

  useEffect(() => {
    if (oneClaimDetails) {
      let stepper;
      if (oneClaimDetails?.status === 'paid')
        stepper = {
          active: 3,
          showData: [
            {
              name: 'Submitted on',
              label: moment(oneClaimDetails?.claimed_on)?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved on',
              label: moment(oneClaimDetails?.approved_on)?.format(
                'DD MMM YYYY'
              ),
              id: 2,
              type: 'approve',
              approvedBy: oneClaimDetails?.approver_details?.name || '-',
            },
            {
              name: 'Payment on',
              label: moment(oneClaimDetails?.paid_on)?.format('DD MMM YYYY'),
              id: 3,
              type: 'payment',
              status: 'paid',
            },
          ],
        };
      else if (oneClaimDetails?.status === 'partially_paid')
        stepper = {
          active: 3,
          showData: [
            {
              name: 'Submitted on',
              label: moment(oneClaimDetails?.claimed_on)?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved on',
              label: moment(oneClaimDetails?.approved_on)?.format(
                'DD MMM YYYY'
              ),
              id: 2,
              type: 'approve',
              approvedBy: oneClaimDetails?.approver_details?.name || '-',
            },
            {
              name: 'Payment on',
              label: moment(oneClaimDetails?.paid_on)?.format('DD MMM YYYY'),
              id: 3,
              type: 'payment',
              status: 'partially_paid',
              paidamt: oneClaimDetails?.paid_amount,
              balanceamt:
                oneClaimDetails?.amount - oneClaimDetails?.paid_amount,
            },
          ],
        };
      else if (oneClaimDetails?.status === 'declined')
        stepper = {
          active: 2,
          showData: [
            {
              name: 'Submitted on',
              label: moment(oneClaimDetails?.claimed_on)?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Rejected on',
              label: oneClaimDetails?.date,
              id: 2,
              reason: oneClaimDetails?.reject_reason || 'Contact your manager.',
              type: 'declined',
              rejectedBy: oneClaimDetails?.canceller_details?.name || '-',
            },
          ],
        };
      setLocalState((prev) => ({
        ...prev,
        id: oneClaimDetails?.id || '',
        amount: oneClaimDetails?.amount || '',
        managerId: oneClaimDetails?.manager_id || '',
        selectedTripId: oneClaimDetails?.reimbursement_group_id || '',
        selectedTrip:
          (oneClaimDetails?.reimbursement_group && {
            ...oneClaimDetails?.reimbursement_group,
            name: oneClaimDetails?.reimbursement_group?.trip_name,
          }) ||
          {},
        description: oneClaimDetails?.description || '',
        stepperActive: stepper?.active || 0,
        stepperData: stepper?.showData || [],
        status: oneClaimDetails?.status || '',
      }));
    }
  }, [oneClaimDetails]);

  return (
    <>
      <div className={css.requesttripadvanceform}>
        {device !== 'mobile' && (
          <p className={css.headertext}>
            {`${payment ? 'Pay' : 'Request'} Advance`}{' '}
            {oneClaimDetails?.number && (
              <span style={{ color: '#3049BF', fontSize: '20px' }}>
                {oneClaimDetails?.number}
              </span>
            )}
          </p>
        )}

        {(payment || state?.payment) && (
          <div className={css.header}>
            <div className={css.nameContainer}>
              <Avatar
                className={css.orgAvatar}
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                  oneClaimDetails?.employee_name || '-'
                }&chars=2`}
              />
              <Typography className={css.nameContainerText}>
                {oneClaimDetails?.employee_name || '-'}
              </Typography>
            </div>
          </div>
        )}
        <div
          // style={disabled || state?.disabled ? { pointerEvents: 'none' } : {}}
          className={css.pointerEventsEnable}
        >
          {payment === undefined && state?.payment === undefined && (
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
                onChange={(e) => {
                  const pattern = /^[0-9]*$/;
                  if (pattern.test(e?.target?.value)) hanldeChange(e);
                }}
                value={localState?.amount}
                sx={ShowType === 'view' && { background: '#F2F2F2' }}
                disabled={ShowType === 'view'}
              />

              {ShowType !== 'view' && (
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="20px"
                  sx={device === 'mobile' ? { marginTop: '-4px' } : {}}
                >
                  <Button
                    className={css.amountbutton}
                    value={2000}
                    name="amount"
                    onClick={amtClick}
                  >
                    ₹2,000
                  </Button>
                  <Button
                    className={css.amountbutton}
                    value={4000}
                    name="amount"
                    onClick={amtClick}
                  >
                    ₹4,000
                  </Button>
                  <Button
                    className={css.amountbutton}
                    value={6000}
                    name="amount"
                    onClick={amtClick}
                  >
                    ₹6,000
                  </Button>
                </Stack>
              )}
            </>
          )}
          <div
            onClick={(e) => {
              if (ShowType !== 'view') setAnchorEl(e?.currentTarget);
            }}
            className={
              ShowType === 'view' || disabled || state?.disabled
                ? css.selectfielddisable
                : css.selectfield
            }
          >
            <Input
              type="text"
              className={`${css.selectfieldinput} ${css.selectarrow}`}
              required
              label="Select Trip"
              variant="standard"
              name="selectedTrip"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              rootStyle={{
                border: '1px solid rgba(153, 158, 165, 0.39)',
              }}
              error={validationErr?.selectedTrip}
              helperText={
                validationErr?.selectedTrip ? 'Please Select Trip' : ''
              }
              value={localState?.selectedTrip?.name}
              disabled={ShowType === 'view' || disabled || state?.disabled}
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
              list={tripDetails.filter(
                (item) => item.status === 'draft' || item.status === 'submitted'
              )}
              state={localState?.selectedTrip}
              setState={(val) => {
                reValidate({
                  target: {
                    name: 'selectedTrip',
                    value: val.name,
                  },
                });
                reValidate({
                  target: {
                    name: 'selectedManager',
                    value: val.manager_details.name,
                  },
                });
                setLocalState({
                  ...localState,
                  selectedManager: val.manager_details,
                  selectedTrip: val,
                  description: val.description,
                  managerId: val.manager_details.id,
                });
                setAnchorEl(null);
              }}
              name="Trip"
            />
          </Popover>
          <SelectBottomSheet
            open={anchorEl && device === 'mobile'}
            triggerComponent={<></>}
            onClose={() => setAnchorEl(null)}
          >
            <Puller />
            <ListForFiled
              list={tripDetails.filter(
                (item) => item.status === 'draft' || item.status === 'submitted'
              )}
              state={localState?.selectedTrip}
              setState={(val) => {
                reValidate({
                  target: {
                    name: 'selectedTrip',
                    value: val.manager_details.name,
                  },
                });
                reValidate({
                  target: {
                    name: 'selectedManager',
                    value: val.manager_details.name,
                  },
                });
                setLocalState({
                  ...localState,
                  selectedManager: val.manager_details,
                  selectedTrip: val,
                  description: val.description,
                  managerId: val.manager_details.id,
                });
                setAnchorEl(null);
              }}
              name="Trip"
            />
          </SelectBottomSheet>
        </div>
        {(payment || state?.payment) && (
          <>
            <div
              style={
                disabled || state?.disabled ? { pointerEvents: 'none' } : {}
              }
              className={css.pointerEventsEnable}
            >
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
                    value={localState?.selectedTrip?.start_date || ''}
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
                    disabled={
                      ShowType === 'view' || disabled || state?.disabled
                    }
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
                    value={localState?.selectedTrip?.end_date || ''}
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
                    disabled={
                      ShowType === 'view' || disabled || state?.disabled
                    }
                  />
                </LocalizationProvider>
              </Stack>
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="requestDate"
                  inputFormat="DD-MM-YYYY"
                  InputProps={{ disableUnderline: true }}
                  value={localState?.selectedTrip?.request_date || ''}
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
                      label="Request Date"
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
              </LocalizationProvider> */}
            </div>

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
              onChange={(e) => {
                const pattern = /^[0-9]*$/;
                if (pattern.test(e?.target?.value)) hanldeChange(e);
              }}
              value={localState?.amount}
              sx={ShowType === 'view' && { background: '#F2F2F2' }}
              disabled={
                dataValue?.status === 'paid' ||
                dataValue?.status === 'partially_paid' ||
                state?.dataValue?.status === 'paid' ||
                state?.dataValue?.status === 'partially_paid'
              }
            />
          </>
        )}
        {payment === undefined && state?.payment === undefined && (
          <div
            // onClick={(e) => {
            //   if (ShowType !== 'view') setAnchorEl(e?.currentTarget);
            // }}
            className={
              ShowType === 'view' ? css.selectfielddisable : css.selectfield
            }
          >
            <Input
              type="text"
              className={css.selectfieldinput}
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
                validationErr?.selectedManager ? 'Please Select Manager' : ''
              }
              value={localState?.selectedManager?.name}
              disabled
            />
          </div>
        )}
        {/* <Popover
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
            open={anchorEl && device === 'mobile'}
            triggerComponent={<></>}
            onClose={() => setAnchorEl(null)}
          >
            <Puller />
            <ListForFiled
              list={tripDetails.map((item) => ({
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
          </SelectBottomSheet> */}
        <div
          style={disabled || state?.disabled ? { pointerEvents: 'none' } : {}}
          className={css.pointerEventsEnable}
        >
          <Input
            required
            label="Trip Details"
            variant="standard"
            name="description"
            multiline
            rows={2}
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
              validationErr?.description ? 'Please Provide Trip Details' : ''
            }
            onChange={hanldeChange}
            value={localState?.description}
            disabled={ShowType === 'view' || disabled || state?.disabled}
          />
        </div>

        {(ShowType === 'new' || ShowType === 'update') &&
          localState.status !== 'paid' &&
          localState.status !== 'declined' &&
          localState.status !== 'partially_paid' && (
            <>
              <Box
                className={
                  (payment || state?.payment) && advPaymentDetails?.error
                    ? `${css.advancesubmitbutton} ${css.disable}`
                    : css.advancesubmitbutton
                }
              >
                <Box className={css.advanceamountbox}>
                  <Typography className={css.amounttext}>
                    {`₹ ${localState?.amount || 0}`}
                  </Typography>
                  <Typography className={css.advancetext}>
                    Advance Amount
                  </Typography>
                </Box>
                <Typography
                  className={css.submittext}
                  onClick={() => {
                    if (
                      (payment || state?.payment) &&
                      !userPermissions?.Payments?.Payment?.create_payment
                    ) {
                      setHavePermission(true);
                      return;
                    }
                    onsubmitvalue();
                  }}
                  component={Button}
                  disabled={
                    ((payment || state?.payment) && advPaymentDetails?.error) ||
                    btnDisable
                  }
                >
                  {payment || state?.payment ? 'Pay' : 'Request'}
                </Typography>
              </Box>
              {(payment || state?.payment) && (
                <Button
                  className={css.rejectBtn}
                  onClick={() => {
                    if (
                      userPermissions?.Reimbursement?.['Payment Request']
                        ?.cancel_reimbursement_payment_req
                    )
                      setDrawerState(true);
                    else setHavePermission(true);
                  }}
                >
                  Reject
                </Button>
              )}
            </>
          )}

        {ShowType === 'view' &&
          localState.status !== 'paid' &&
          localState.status !== 'declined' &&
          localState.status !== 'partially_paid' && (
            <Stack direction="row" width="100%" justifyContent="space-between">
              <Button
                className={css.deleteButton}
                onClick={() => setDrawer({ ...drawer, delete: true })}
              >
                <img
                  src={red_color_delete}
                  alt="delete"
                  style={{ width: '14px' }}
                />
                Delete Request
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
        {(localState.status === 'paid' ||
          localState.status === 'declined' ||
          localState.status === 'partially_paid') && (
          <CustomizedStepper
            stepperList={localState?.stepperData}
            active={localState?.stepperActive}
          />
        )}

        {/* {localState.status === 'paid' && (
          <Stack>
            <AdvanceTable
              value={[
                {
                  date: '20-12-2023',
                  description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit... ',
                  amount: '42000',
                },
                {
                  date: '20-12-2023',
                  description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit... ',
                  amount: '42000',
                },
                {
                  date: '20-12-2023',
                  description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit... ',
                  amount: '42000',
                },
              ]}
            />
            <Button className={css.adjustbtn}>Adjust</Button>
          </Stack>
        )} */}
      </div>

      <Dialog
        open={drawer?.delete && device === 'desktop'}
        PaperProps={{ style: { width: '416px', borderRadius: '16px' } }}
        onClose={() => setDrawer({ ...drawer, delete: false })}
      >
        <DeleteContent
          handleNo={() => setDrawer({ ...drawer, delete: false })}
          handleYes={() => {
            setDrawer({ ...drawer, delete: false });
            dispatch(
              deleteClaim({
                claim_type: 'requestAdvance',
                id: localState?.id,
                tab,
              })
            );
          }}
          type="advance"
        />
      </Dialog>

      <SelectBottomSheet
        open={drawer?.delete && device === 'mobile'}
        triggerComponent={<></>}
        onClose={() => setDrawer({ ...drawer, delete: false })}
      >
        <Puller />
        <DeleteContent
          handleNo={() => setDrawer({ ...drawer, delete: false })}
          handleYes={() => {
            setDrawer({ ...drawer, delete: false });
            dispatch(
              deleteClaim({
                claim_type: 'requestAdvance',
                id: localState?.id,
                tab,
              })
            );
          }}
          type="advance"
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        triggerComponent
        open={drawer.proceedToPay}
        name="proceedToPay"
        onClose={() => setDrawer((d) => ({ ...d, proceedToPay: false }))}
        addNewSheet
      >
        <ProceedToPay
          onClose={(res) => {
            if (device === 'desktop') onClose();
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
          payType={false}
          forgetYes
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

      <SelectBottomSheet
        triggerComponent={<></>}
        open={drawerState}
        name="rejectReason"
        onClose={() => setDrawerState(false)}
        addNewSheet
      >
        <div className={css.reimbursementClaimContainerMobile}>
          <Typography className={css.headertitle}>
            Enter Reason for Rejection
          </Typography>
        </div>

        <Input
          required
          label="Description"
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
            width: 'calc(100% - 60px)',
            margin: '30px',
          }}
          error={rejectvalidationErr?.description}
          helperText={
            rejectvalidationErr?.description ? 'Please Provide description' : ''
          }
          onChange={(e) => setRejectReason(e?.target?.value)}
          value={rejectReason}
          // disabled={ShowType === 'view'}
        />
        <Stack alignItems="center" justifyContent="center" marginBottom="30px">
          <Button
            className={css.rejectReasonBtn}
            onClick={() => onsubmitReject()}
            disabled={!rejectReason}
          >
            Confirm & Deliver
          </Button>
        </Stack>
      </SelectBottomSheet>
      {havePermission && (
        <PermissionDialog onClose={() => setHavePermission(false)} />
      )}
    </>
  );
};

export const PayTripAdvanceForm = ({
  action,
  employeeList,
  setAddTripManager,
  onClose,
}) => {
  const device = localStorage.getItem('device_detect');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [localState, setLocalState] = useState({
    amount: '',
    description: '',
    selectedEmployee: {},
    selectedTrip: {},
    tripId: '',
    employeeId: '',
  });
  const [validationErr, setValidationErr] = useState({
    amount: false,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElTrip, setAnchorElTrip] = useState(null);
  const [ShowType, setShowType] = useState(action);
  const { bankAccounts } = useSelector((value) => value.Payments);
  const { tripDetails } = useSelector((value) => value.Reimbursement);
  const { paymentVoucharId, advPaymentDetails, advPaymentId } = useSelector(
    (value) => value.AdvancePayment
  );
  const { userPermissions } = useContext(AppContext);

  const [drawer, setDrawer] = useState({});
  const [transacForgetPass, setTransacForgetPass] = useState(false);
  const [havePermission, setHavePermission] = useState(false);

  const reValidate = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setValidationErr((s) => ({ ...s, [name]: !validateRequired(value) }));
  };

  const hanldeChange = (e) => {
    const { name, value } = e.target;
    reValidate(e);
    setLocalState((prev) => ({ ...prev, [name]: value }));
  };

  const amtClick = (e) => {
    const value = e?.target?.value;
    reValidate(e);
    setLocalState((prev) => ({
      ...prev,
      amount: Number(value),
    }));
  };

  const ValidCheck = () => {
    const validState = {
      amount: !localState?.amount,
      selectedEmployee:
        Object.keys(localState?.selectedEmployee || {})?.length === 0,
    };
    setValidationErr({ ...validState });
    const valid = Object.values(validState).every((val) => !val);
    if (!valid) return false;
    return true;
  };

  const onsubmitvalue = async () => {
    if (ValidCheck()) {
      if (localState?.selectedEmployee?.entity_id) {
        await dispatch(
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
        setTimeout(() => {
          dispatch(getBankAccounts(paymentVoucharId));
          setDrawer((d) => ({ ...d, proceedToPay: true }));
        }, 1000);
      } else {
        dispatch(
          openSnackbar({
            type: MESSAGE_TYPE.ERROR,
            message: 'Employee not found',
          })
        );
      }
    }
  };

  useEffect(() => {
    if (
      device === 'desktop' &&
      window.location.pathname === '/reimbursement-trip-advance-pay'
    ) {
      navigate('/reimbursement');
    }
    dispatch(getTrips({ type: 'pending_claims', status: '' }));
  }, []);

  return (
    <>
      <div className={css.requesttripadvanceform}>
        <p className={css.headertext}>
          {device === 'mobile' ? 'Pay Advance For Trip' : 'Pay Advance'}
        </p>

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
              validationErr?.selectedEmployee ? 'Please Select Employee' : ''
            }
            value={localState?.selectedEmployee?.name}
            // disabled
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
            list={employeeList}
            state={localState?.selectedEmployee}
            setState={(val) => {
              setLocalState({
                ...localState,
                selectedEmployee: val,
                employeeId: val.entity_id,
              });
              setValidationErr({
                ...validationErr,
                selectedEmployee: false,
              });
              setAnchorEl(null);
            }}
            name="Employee"
          />
        </Popover>

        <SelectBottomSheet
          open={anchorEl && device === 'mobile'}
          triggerComponent={<></>}
          onClose={() => setAnchorEl(null)}
        >
          <Puller />
          <ListForFiled
            list={employeeList}
            state={localState?.selectedEmployee}
            setState={(val) => {
              setLocalState({
                ...localState,
                selectedEmployee: val,
                employeeId: val.entity_id,
              });
              setValidationErr({
                ...validationErr,
                selectedEmployee: false,
              });
              setAnchorEl(null);
            }}
            name="Employee"
          />
        </SelectBottomSheet>

        <div
          onClick={(e) => {
            if (ShowType !== 'view' && !!localState.employeeId)
              setAnchorElTrip(e?.currentTarget);
          }}
          className={
            ShowType === 'view' ? css.selectfielddisable : css.selectfield
          }
        >
          <Input
            type="text"
            className={`${css.selectfieldinput} ${css.selectarrow}`}
            required
            label="Select Trip"
            variant="standard"
            name="selectedTrip"
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
              validationErr?.selectedManager ? 'Please Select Trip' : ''
            }
            value={localState?.selectedTrip?.name}
            // disabled
          />
        </div>

        <Popover
          anchorEl={anchorElTrip}
          PaperProps={{
            style: {
              width: '366px',
              boxShadow:
                '0px 9px 42px rgba(0, 0, 0, 0.1), 0px 0px 6px rgba(0, 0, 0, 0.05)',
              borderRadius: '8px',
              marginTop: '10px',
            },
          }}
          open={Boolean(anchorElTrip && device === 'desktop')}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          onClose={() => setAnchorElTrip(null)}
        >
          <ListForFiled
            list={tripDetails?.filter(
              (item) =>
                item?.employee_id === localState.employeeId &&
                (item.status === 'draft' || item.status === 'submitted')
            )}
            state={localState?.selectedTrip}
            staticRow={
              <>
                <MenuItem
                  direction="row"
                  className={css.staticcontent}
                  onClick={() => setAddTripManager(true)}
                >
                  <AddRoundedIcon className={css.icon} />
                  Add New Trip
                </MenuItem>
              </>
            }
            setState={(val) => {
              setLocalState({
                ...localState,
                selectedTrip: val,
                tripId: val.id,
                selectedEmployee: {
                  id: val?.employee_id,
                  name: val?.employee_name,
                },
              });
              setValidationErr({
                ...validationErr,
                selectedManager: false,
              });
              setAnchorElTrip(null);
            }}
            name="Trip"
          />
        </Popover>

        <SelectBottomSheet
          open={anchorElTrip && device === 'mobile'}
          triggerComponent={<></>}
          onClose={() => setAnchorElTrip(null)}
        >
          <Puller />
          <ListForFiled
            list={tripDetails?.filter(
              (item) =>
                item?.employee_id === localState.employeeId &&
                (item.status === 'draft' || item.status === 'submitted')
            )}
            state={localState?.selectedTrip}
            staticRow={
              <>
                <MenuItem
                  direction="row"
                  className={css.staticcontent}
                  onClick={() => setAddTripManager(true)}
                >
                  <AddRoundedIcon className={css.icon} />
                  Add New Trip
                </MenuItem>
              </>
            }
            setState={(val) => {
              setLocalState({
                ...localState,
                selectedTrip: val,
                tripId: val.id,
                selectedEmployee: {
                  id: val?.employee_id,
                  name: val?.employee_name,
                },
              });
              setAnchorElTrip(null);
            }}
            name="Trip"
          />
        </SelectBottomSheet>

        <Typography className={css.payadvtitle}>
          Pay Advance for this Trip
        </Typography>
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
          onChange={(e) => {
            const pattern = /^[0-9]*$/;
            if (pattern.test(e?.target?.value)) hanldeChange(e);
          }}
          value={localState?.amount}
          disabled={ShowType === 'view'}
        />

        {ShowType !== 'view' && (
          <Stack
            direction="row"
            alignItems="center"
            gap="20px"
            sx={device === 'mobile' ? { marginTop: '-4px' } : {}}
          >
            <Button
              className={css.amountbutton}
              value={2000}
              name="amount"
              onClick={amtClick}
            >
              ₹2,000
            </Button>
            <Button
              className={css.amountbutton}
              value={4000}
              name="amount"
              onClick={amtClick}
            >
              ₹4,000
            </Button>
            <Button
              className={css.amountbutton}
              value={6000}
              name="amount"
              onClick={amtClick}
            >
              ₹6,000
            </Button>
          </Stack>
        )}

        <Input
          required
          label="Trip Details"
          variant="standard"
          name="description"
          multiline
          rows={2}
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
            validationErr?.description ? 'Please Provide Trip Details' : ''
          }
          onChange={hanldeChange}
          value={localState?.description}
          disabled={ShowType === 'view'}
        />

        {(ShowType === 'new' || ShowType === 'update') && (
          <Box className={css.advancesubmitbutton}>
            <Box className={css.advanceamountbox}>
              <Typography className={css.amounttext}>
                {IndianCurrency.format(localState?.amount || 0)}
              </Typography>
              <Typography className={css.advancetext}>
                Advance Amount
              </Typography>
            </Box>
            <Typography
              className={css.submittext}
              onClick={() => {
                if (userPermissions?.Payments?.Payment?.create_payment)
                  onsubmitvalue();
                else setHavePermission(true);
              }}
              component={Button}
              disabled={advPaymentDetails?.error}
            >
              Pay Now
            </Typography>
          </Box>
        )}
        {ShowType === 'view' && (
          <Stack direction="row" width="100%" justifyContent="space-between">
            <Button
              className={css.deleteButton}
              // onClick={() =>}
            >
              <img
                src={red_color_delete}
                alt="delete"
                style={{ width: '14px' }}
              />
              Delete Request
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
      </div>
      {havePermission && (
        <PermissionDialog onClose={() => setHavePermission(false)} />
      )}

      <SelectBottomSheet
        triggerComponent
        open={drawer.proceedToPay}
        name="proceedToPay"
        onClose={() => setDrawer((d) => ({ ...d, proceedToPay: false }))}
        addNewSheet
      >
        <ProceedToPay
          onClose={(res) => {
            onClose();
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

const ListForFiled = ({ list, state, setState, name, staticRow }) => {
  const device = localStorage.getItem('device_detect');
  const [searchQuery, setSearchQuery] = useState('');

  const onInputChange = (event) => {
    event.preventDefault();
    setSearchQuery(event?.target?.value);
  };

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
          margin: '16px 5%',
          borderRadius: '4px',
          border: '1px solid rgba(0, 0, 0, 0.10)',
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
        onChange={onInputChange}
        placeholder={`Search ${name} Name`}
      />
      <div
        style={{
          overflowY: 'auto',
          overflowX: 'unset',
          height: device === 'desktop' ? '200px' : 'unset',
        }}
      >
        {list?.filter((data) =>
          data?.name
            ?.toLocaleLowerCase()
            ?.includes(searchQuery?.toLocaleLowerCase())
        )?.length === 0 && (
          <p className={css.menutext} style={{ textAlign: 'center' }}>
            No Data
          </p>
        )}
        <ul style={{ padding: 0 }}>
          {staticRow && staticRow}
          {list
            ?.filter((data) =>
              data?.name
                ?.toLocaleLowerCase()
                ?.includes(searchQuery?.toLocaleLowerCase())
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
