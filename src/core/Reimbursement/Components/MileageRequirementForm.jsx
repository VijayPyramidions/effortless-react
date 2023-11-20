/* eslint-disable no-unneeded-ternary */

import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  // enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import {
  postClaims,
  updateClaim,
  deleteClaim,
  setDrawer as setDrawerRedux,
  setReimbursementPerformanceAction,
  setClaimDetailsForBillPatch,
  getClaims,
} from '@action/Store/Reducers/Reimbursement/ReimbursementState';

import {
  getOneReimbursement,
  setOneReimbursement,
} from '@action/Store/Reducers/Settings/ReimburssementSettingsState';
import AppContext from '@root/AppContext';

import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Stack,
  Box,
  Dialog,
} from '@mui/material';

import { styled } from '@material-ui/core/styles';

import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import red_color_delete from '@assets/red_color_delete.svg';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import CalendarIcon from '@mui/icons-material/CalendarToday';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { validateRequired } from '@services/Validation';
import { InputText } from '@components/Input/Input';
import Calender from '../../InvoiceView/Calander';

import Isbillable from './Isbillable';
import { convertKeysToSnakeCase } from '../../../components/utils';
import { CustomizedStepper, DeleteContent } from './ReimbursementActionSheets';
import * as css from '../ReimbursementContainer.scss';

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const MileageRequirementForm = ({
  action,
  data,
  tab,
  id,
  selectedTrip,
  onClose,
  setTripSheet,
  locationState,
  from,
  setValue,
}) => {
  const device = localStorage.getItem('device_detect');
  const { state } = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const intialState =
    device === 'desktop'
      ? {
          id: data?.id,
          claimType: 'mileage',
          date: data?.date || null,
          vehicleType: data?.vehicle_type || 'bike',
          kilometerReading: data?.kilometer_reading || '',
          amount: data?.amount || '',
          description: data?.description || '',
          client: { name: data?.client_name },
          clientId: data?.client_id || '',
          billable: data?.billable ? 'yes' : 'no',
        }
      : {
          id: state?.data?.id,
          claimType: 'mileage',
          date: state?.data?.date || null,
          vehicleType: state?.data?.vehicle_type || 'bike',
          kilometerReading: state?.data?.kilometer_reading || '',
          amount: state?.data?.amount || '',
          description: state?.data?.description || '',
          client: { name: state?.data?.client_name },
          clientId: state?.data?.client_id || '',
          billable: state?.data?.billable ? 'yes' : 'no',
        };

  const { userPermissions } = useContext(AppContext);

  const [localState, setLocalState] = useState(intialState);

  const [validationErr, setValidationErr] = useState({
    claimType: '',
    date: false,
    vehicleType: false,
    kilometerReading: false,
    amount: false,
    description: false,
    billable: false,
    clientId: false,
  });

  const [ShowType, setShowType] = useState(action || state?.action);
  const [drawer, setDrawer] = useState({});
  const [havePermission, setHavePermission] = useState(false);

  const { reimbursements, oneReimbursement } = useSelector(
    (value) => value.ReimbursementSettings
  );
  const { mileagePerformActions, billPatchData } = useSelector(
    (value) => value.Reimbursement
  );

  const reValidate = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setValidationErr((s) => ({ ...s, [name]: !validateRequired(value) }));
  };

  const ValidCheck = () => {
    if (
      !localState?.date ||
      !localState?.amount ||
      !localState?.description ||
      !localState?.kilometerReading
    ) {
      setValidationErr({
        date: !localState?.date,
        amount: Number(localState?.amount) === 0 || !localState?.amount,
        description: !localState?.description,
        kilometerReading: !localState?.kilometerReading,
      });
      return false;
    }
    if (!localState?.vehicleType) {
      dispatch(
        openSnackbar({
          message: 'Select Vehicle Type.',
          type: MESSAGE_TYPE.ERROR,
        })
      );
      return false;
    }
    if (!localState?.billable) {
      dispatch(
        openSnackbar({
          message: 'Is this billable or not.',
          type: MESSAGE_TYPE.ERROR,
        })
      );
      return false;
    }
    if (
      localState?.billable === 'yes' &&
      Object.keys(localState?.client)?.length === 0
    ) {
      dispatch(
        openSnackbar({
          message: 'Please select client',
          type: MESSAGE_TYPE.ERROR,
        })
      );
      return false;
    }
    return true;
  };

  const OnSubmitValue = (param) => {
    if (
      ShowType !== 'view' &&
      ShowType !== 'update' &&
      oneReimbursement?.enabled &&
      oneReimbursement?.active &&
      Object.keys(oneReimbursement || {})?.length > 0
    ) {
      // const temp = { ...localState };
      // delete temp?.client;
      // let arr = convertKeysToSnakeCase(temp);

      // if (id || state?.id)
      //   arr = { ...arr, reimbursement_group_id: id || state?.id };

      if (billPatchData?.id)
        dispatch(
          updateClaim({
            ...param,
            id: billPatchData?.id,
            reimbursement_policy_id: billPatchData?.reimbursement_policy_id,
            for: 'billPatch',
            claim_type: 'mileage',
            status: 'draft',
            // date: moment(localState?.date)?.format('YYYY-MM-DD'),
            // tab: tab || state?.tab,
            // billable: temp?.billable === 'no' ? false : true,
          })
        );
      else
        dispatch(
          postClaims({
            ...param,
            // date: moment(localState?.date)?.format('YYYY-MM-DD'),
            // // tab: tab || state?.tab,
            // billable: temp?.billable === 'no' ? false : true,
            claim_type: 'mileage',
            status: 'draft',
            for: 'billPatch',
            reimbursement_type: 'expense',
          })
        );
    }
  };

  const onupdatevalue = (val) => {
    if (ValidCheck()) {
      const temp = { ...localState };
      delete temp?.client;
      let arr = convertKeysToSnakeCase(temp);

      if (id || state?.id)
        arr = { ...arr, reimbursement_group_id: id || state?.id };

      dispatch(
        updateClaim({
          ...arr,
          date: moment(localState?.date)?.format('YYYY-MM-DD'),
          tab: tab || state?.tab,
          Kilometer_reading: parseFloat(arr.Kilometer_reading),
          billable: temp?.billable === 'no' ? false : true,
          status: val === 'submit' ? 'submitted' : undefined,
        })
      );

      dispatch(setClaimDetailsForBillPatch(''));
      if (from === 'trip') setTripSheet('trip_view');
    }
  };

  const hanldeChange = (e) => {
    const { name, value } = e.target;
    if (
      name === 'amount' ||
      name === 'description' ||
      name === 'kilometerReading'
    ) {
      reValidate(e);
    }
    if (name === 'client')
      setLocalState((prev) => ({ ...prev, clientId: value.id }));

    if (name === 'billable' && value === 'no')
      setLocalState((prev) => ({ ...prev, client: '', clientId: '' }));

    if (name === 'kilometerReading') {
      setLocalState((prev) => ({
        ...prev,
        amount: parseFloat(oneReimbursement.mileage_rate) * parseFloat(value),
        kilometerReading: parseFloat(value),
      }));
      return;
    }

    setLocalState((prev) => ({ ...prev, [name]: value }));
  };

  const handleDate = (val) => {
    setLocalState((s) => ({
      ...s,
      date: val,
    }));
    OnSubmitValue({
      date: moment(val)?.format('YYYY-MM-DD'),
    });

    setDrawer((d) => ({ ...d, date: false }));
    setValidationErr((prev) => ({
      ...prev,
      date: false,
    }));
  };

  useEffect(() => {
    if (localState.kilometerReading)
      setLocalState((prev) => ({
        ...prev,
        amount:
          Number(oneReimbursement.mileage_rate) * localState.kilometerReading,
      }));
  }, [oneReimbursement]);

  useEffect(() => {
    return () => {
      dispatch(setClaimDetailsForBillPatch(''));
      dispatch(getClaims({ type: 'outstanding' }));
      if (typeof setValue === 'function') setValue();
    };
  }, []);

  useEffect(() => {
    const policy = reimbursements.find(
      (item) => item.name === 'Own Vehicle Expenses'
    );
    if (localState?.vehicleType)
      dispatch(
        getOneReimbursement({
          id: policy?.id,
          vehicleType: localState.vehicleType,
        })
      );
  }, [localState.vehicleType]);

  useEffect(() => {
    if (
      mileagePerformActions === 'milage_added_successfully' ||
      mileagePerformActions === 'milage_updated_successfully'
    )
      if (device === 'desktop')
        dispatch(setDrawerRedux({ name: 'mileage', value: false }));
      else if (from === 'mobileTrip')
        navigate('/reimbursement-trip-claim', { state: locationState });
      else navigate('/reimbursement');
    return () => {
      dispatch(
        setReimbursementPerformanceAction({
          name: 'mileagePerformActions',
          action: '',
        })
      );
    };
  }, [mileagePerformActions]);

  useEffect(() => {
    if (Object.keys(billPatchData || {})?.length > 0 && !localState?.id) {
      setLocalState({ ...localState, id: billPatchData?.id });
    }
  }, [billPatchData]);
  useEffect(() => {
    if (
      Object?.keys(oneReimbursement)?.length > 0 &&
      !oneReimbursement?.enabled &&
      (localState?.status === 'draft' ||
        localState?.status === 'submitted' ||
        !localState?.status)
    )
      dispatch(
        openSnackbar({
          type: MESSAGE_TYPE.ERROR,

          message: `${oneReimbursement?.vehicle_type} claim is disabled.`,
        })
      );
    else if (
      Object?.keys(oneReimbursement)?.length > 0 &&
      !oneReimbursement?.active
    )
      dispatch(
        openSnackbar({
          type: MESSAGE_TYPE.ERROR,

          message: `${oneReimbursement?.vehicle_type} claim not active currently`,
        })
      );
    else if (new Date(oneReimbursement?.end_date) < new Date())
      dispatch(
        openSnackbar({
          type: MESSAGE_TYPE.ERROR,

          message: `${oneReimbursement?.vehicle_type} claim is expired update the policy rules.`,
        })
      );
  }, [oneReimbursement]);

  useEffect(() => {
    if (state?.data || data) {
      let stepper;
      if (data?.status === 'approved' || state?.data?.status === 'approved')
        stepper = {
          active: 2,
          showData: [
            {
              name: 'Submitted on',
              label: moment(
                data?.claimed_on || state?.data?.claimed_on
              )?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved',
              label: moment(
                data?.approved_on || state?.data?.approved_on
              )?.format('DD MMM YYYY'),
              id: 2,
              type: 'approve',
            },
          ],
        };
      else if (data?.status === 'paid' || state?.data?.status === 'paid')
        stepper = {
          active: 3,
          showData: [
            {
              name: 'Submitted on',
              label: moment(
                data?.claimed_on || state?.data?.claimed_on
              )?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved',
              label: moment(
                data?.approved_on || state?.data?.approved_on
              )?.format('DD MMM YYYY'),
              id: 2,
              type: 'approve',
            },
            {
              name: 'Payment on',
              label: moment(data?.paid_on || state?.data?.paid_on)?.format(
                'DD MMM YYYY'
              ),
              id: 3,
              type: 'payment',
              status: 'paid',
            },
          ],
        };
      else if (
        data?.status === 'partially_paid' ||
        state?.data?.status === 'partially_paid'
      )
        stepper = {
          active: 3,
          showData: [
            {
              name: 'Submitted on',
              label: moment(
                data?.claimed_on || state?.data?.claimed_on
              )?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Approved',
              label: moment(
                data?.approved_on || state?.data?.approved_on
              )?.format('DD MMM YYYY'),
              id: 2,
              type: 'approve',
            },
            {
              name: 'Payment on',
              label: moment(data?.paid_on || state?.data?.paid_on)?.format(
                'DD MMM YYYY'
              ),
              id: 3,
              type: 'payment',
              status: 'partially_paid',
              paidamt: data?.paid_amount
                ? data?.paid_amount
                : state?.data?.paid_amount,
              balanceamt: data?.amount
                ? data?.amount - data?.paid_amount || 0
                : state?.data?.amount - state?.data?.paid_amount || 0,
            },
          ],
        };
      else if (
        data?.status === 'declined' ||
        state?.data?.status === 'declined'
      )
        stepper = {
          active: 2,
          showData: [
            {
              name: 'Submitted on',
              label: moment(
                data?.claimed_on || state?.data?.claimed_on
              )?.format('DD MMM YYYY'),
              id: 1,
              type: 'submit',
            },
            {
              name: 'Rejected',
              label: moment(
                data?.cancelled_on || state?.data?.rejected_on
              )?.format('DD MMM YYYY'),
              id: 2,
              reason: data?.reject_reason || 'Contact your manager.',
              type: 'declined',
            },
          ],
        };

      setLocalState((prev) => ({
        ...prev,
        stepperActive: stepper?.active || 0,
        stepperData: stepper?.showData || [],
      }));
    }
  }, [data, state?.data]);

  useEffect(() => {
    return () => {
      dispatch(setOneReimbursement({}));
    };
  }, []);

  return (
    <>
      <div className={css.reimursementsheet}>
        {device === 'desktop' && (
          <p className={css.headertext}>
            Mileage Reimbursement{' '}
            {data?.number && (
              <span style={{ color: '#3049BF', fontSize: '20px' }}>
                {data?.number}
              </span>
            )}
          </p>
        )}
        {device === 'mobile' && (
          <p className={css.headertext}>
            Mileage Claim{' '}
            {state?.data?.number && (
              <span style={{ color: '#3049BF', fontSize: '16px' }}>
                {state?.data?.number}
              </span>
            )}
          </p>
        )}
        <div className={css.milagecont}>
          {device === 'desktop' && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="date"
                inputFormat="DD-MM-YYYY"
                InputProps={{ disableUnderline: true }}
                value={localState?.date || ''}
                onChange={(e) => {
                  if (moment(e?.$d, 'DD-MM-YYYY').isValid())
                    setValidationErr((prev) => ({
                      ...prev,
                      date: false,
                    }));
                  else
                    setValidationErr((prev) => ({
                      ...prev,
                      date: true,
                    }));
                  OnSubmitValue({
                    date: moment(e?.$d)?.format('YYYY-MM-DD'),
                  });
                  setLocalState((prev) => ({
                    ...prev,
                    date: e?.$d,
                  }));
                }}
                views={['year', 'month', 'day']}
                minDate={
                  selectedTrip?.start_date &&
                  moment(selectedTrip?.start_date).format('YYYY-MM-DD')
                }
                maxDate={
                  selectedTrip?.end_date
                    ? moment(selectedTrip?.end_date).format('YYYY-MM-DD')
                    : moment().format('YYYY-MM-DD')
                }
                renderInput={(params) => (
                  <InputText
                    {...params}
                    required
                    label="Date"
                    variant="standard"
                    name="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    theme="light"
                    rootStyle={{
                      border: '1px solid rgba(153, 158, 165, 0.39)',
                    }}
                    error={validationErr?.date}
                    helperText={validationErr?.date ? 'Enter Valid Date' : ''}
                  />
                )}
                disabled={ShowType === 'view'}
              />
            </LocalizationProvider>
          )}
          {device === 'mobile' && (
            <div className={css.mobiledate}>
              <div className={css.mobiledatefield}>
                <div
                  onClick={() => {
                    setDrawer({ ...drawer, date: true });
                  }}
                >
                  <InputText
                    type="text"
                    value={
                      localState?.date
                        ? moment(localState?.date).format('DD-MM-YYYY')
                        : 'dd-mm-yyyy'
                    }
                    className={
                      // ShowType === 'view'
                      //   ? `${css.mobiledateinput} ${classes.disabledclass}` :
                      css.mobiledateinput
                    }
                    required
                    label="Date"
                    variant="standard"
                    name="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    theme="light"
                    rootStyle={{
                      border: '1px solid rgba(153, 158, 165, 0.39)',
                    }}
                    error={validationErr?.date}
                    helperText={validationErr?.date ? 'Enter Valid Date' : ''}
                  />
                </div>

                <SelectBottomSheet
                  name="date"
                  addNewSheet
                  triggerComponent={
                    <CalendarIcon
                      style={{ width: 20, color: '#949494' }}
                      onClick={() => {
                        setDrawer({ ...drawer, date: true });
                      }}
                    />
                  }
                  open={drawer.date}
                  onClose={() => setDrawer({ ...drawer, date: false })}
                >
                  <Calender
                    head="Select Date"
                    button="Select"
                    handleDate={handleDate}
                    selectedTip={
                      selectedTrip?.start_date
                        ? {
                            start_date: moment(
                              selectedTrip?.start_date,
                              'YYYY-MM-DD'
                            ).format('YYYY-MM-DD'),
                            end_date: moment(
                              selectedTrip?.end_date,
                              'YYYY-MM-DD'
                            ).format('YYYY-MM-DD'),
                          }
                        : { end_date: moment().format('YYYY-MM-DD') }
                    }
                  />
                </SelectBottomSheet>
              </div>
            </div>
          )}
          <div className={css.selectvehicle}>
            <p className={css.texttag}>
              Select Vehicle Type?
              <span>*</span>
            </p>
            <RadioGroup
              sx={{ flexDirection: 'row', gap: '8px' }}
              name="vehicleType"
              onChange={(e) => {
                hanldeChange(e);
                OnSubmitValue({
                  vehicle_type: e?.target?.value,
                });
              }}
              value={localState?.vehicleType}
            >
              <FormControlLabel
                value="car"
                control={
                  <Radio
                    sx={{
                      color: '#E5E5E5',
                      '&.Mui-checked': { color: '#F08B32' },
                    }}
                  />
                }
                label={<p className={css.texttag}>Car</p>}
                sx={{ margin: 0 }}
                disabled={ShowType === 'view'}
              />
              <FormControlLabel
                value="bike"
                control={
                  <Radio
                    sx={{
                      color: '#E5E5E5',
                      '&.Mui-checked': { color: '#F08B32' },
                    }}
                  />
                }
                label={<p className={css.texttag}>Bike</p>}
                sx={{ margin: 0 }}
                disabled={ShowType === 'view'}
              />
            </RadioGroup>
          </div>
          <InputText
            required
            label="Kilometer Reading"
            variant="standard"
            type="number"
            name="kilometerReading"
            onBlur={reValidate}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid rgba(153, 158, 165, 0.39)',
            }}
            error={validationErr?.kilometerReading}
            helperText={
              validationErr?.kilometerReading ? 'Please Enter kilometer' : ''
            }
            onWheel={(e) => e.target.blur()}
            onChange={(e) => {
              OnSubmitValue({
                Kilometer_reading: parseFloat(e?.target?.value),
                amount:
                  parseFloat(oneReimbursement.mileage_rate) *
                  parseFloat(e?.target?.value),
              });
              hanldeChange(e);
            }}
            value={localState?.kilometerReading}
            placeholder="0"
            className={css.input}
            disabled={ShowType === 'view'}
          />
          <InputText
            required
            label="Amount Paid"
            variant="standard"
            name="amount"
            className={css.amountdisable}
            onBlur={reValidate}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            theme="light"
            rootStyle={{
              border: '1px solid rgba(153, 158, 165, 0.39)',
            }}
            type="number"
            placeholder="0"
            error={validationErr?.amount}
            helperText={validationErr?.amount ? 'Enter Valid Amount' : ''}
            // onChange={(e) => {
            //   const pattern = /^[0-9]*$/;
            //   if (pattern.test(e?.target?.value)) hanldeChange(e);
            // }}
            value={localState?.amount}
            disabled
          />
          <InputText
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
            }}
            error={validationErr?.description}
            helperText={
              validationErr?.description ? 'Please Provide description' : ''
            }
            onChange={(e) => {
              OnSubmitValue({
                claimType: 'mileage',
                description: e?.target?.value,
              });
              hanldeChange(e);
            }}
            value={localState?.description}
            disabled={ShowType === 'view'}
          />
          <div className={css.isthisbillable}>
            <p className={css.texttag}>
              Is this Billable?
              <span>*</span>
            </p>
            <RadioGroup
              sx={{ flexDirection: 'row', gap: '8px' }}
              name="billable"
              onChange={(e) => {
                OnSubmitValue({
                  billable: e?.target?.value === 'yes' ? true : false,
                });
                hanldeChange(e);
              }}
              value={localState?.billable}
            >
              <FormControlLabel
                value="yes"
                control={
                  <Radio
                    sx={{
                      color: '#E5E5E5',
                      '&.Mui-checked': { color: '#F08B32' },
                    }}
                  />
                }
                label={<p className={css.texttag}>Yes</p>}
                sx={{ margin: 0 }}
                disabled={ShowType === 'view'}
              />
              <FormControlLabel
                value="no"
                control={
                  <Radio
                    sx={{
                      color: '#E5E5E5',
                      '&.Mui-checked': { color: '#F08B32' },
                    }}
                  />
                }
                label={<p className={css.texttag}>No</p>}
                sx={{ margin: 0 }}
                disabled={ShowType === 'view'}
              />
            </RadioGroup>
          </div>

          {(data?.status === 'paid' ||
            data?.status === 'declined' ||
            data?.status === 'approved' ||
            state?.data?.status === 'paid' ||
            state?.data?.status === 'approved' ||
            state?.data?.status === 'declined') && (
            <Stack sx={{ marginTop: '12px' }}>
              <CustomizedStepper
                stepperList={localState?.stepperData}
                active={localState?.stepperActive}
              />
            </Stack>
          )}
          {localState?.billable === 'yes' && (
            <Isbillable
              localState={localState}
              hanldeChange={(e) => {
                OnSubmitValue({
                  client_id: e?.target?.value?.id,
                });
                hanldeChange(e);
              }}
              ShowType={ShowType}
            />
          )}
          {ShowType === 'new' && (
            <Button
              className={css.primaryButton}
              onClick={() => onupdatevalue('submit')}
              disabled={
                !oneReimbursement?.enabled ||
                !oneReimbursement?.active ||
                new Date(oneReimbursement?.end_date) < new Date() ||
                Object.keys(oneReimbursement || {})?.length === 0
              }
            >
              Raise Claim
            </Button>
          )}
          {ShowType === 'view' &&
            data?.status !== 'paid' &&
            data?.status !== 'approved' &&
            data?.status !== 'declined' &&
            state?.data?.status !== 'paid' &&
            state?.data?.status !== 'approved' &&
            state?.data?.status !== 'declined' && (
              <Stack
                direction="row"
                width="100%"
                justifyContent="space-between"
              >
                <Button
                  className={css.deleteButton}
                  onClick={() => {
                    if (
                      userPermissions?.Reimbursement['Reimbursement Claims']
                        ?.delete_reimbursement_claim
                    )
                      setDrawer({ ...drawer, delete: true });
                    else setHavePermission(true);
                  }}
                >
                  <img
                    src={red_color_delete}
                    alt="delete"
                    style={{ width: '14px' }}
                  />
                  Delete Claim
                </Button>
                <Button
                  className={css.editButton}
                  onClick={() => {
                    if (
                      userPermissions?.Reimbursement['Reimbursement Claims']
                        ?.edit_reimbursement_claim
                    )
                      setShowType('update');
                    else setHavePermission(true);
                  }}
                >
                  <DriveFileRenameOutlineIcon sx={{ fontSize: '16px' }} />
                  Edit
                </Button>
              </Stack>
            )}

          {ShowType === 'update' && (
            <Button
              className={css.primaryButton}
              onClick={() => onupdatevalue('submit')}
              disabled={!oneReimbursement?.enabled}
            >
              {data?.status === 'draft'
                ? `Update and Send for Approval`
                : `Update`}
            </Button>
          )}
        </div>
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
            dispatch(deleteClaim({ id: data.id, tab }));
            onClose();
          }}
          type="claim"
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
            dispatch(deleteClaim({ id: data.id, tab }));
          }}
          type="claim"
        />
      </SelectBottomSheet>

      {havePermission && (
        <PermissionDialog onClose={() => setHavePermission(false)} />
      )}
    </>
  );
};

export default MileageRequirementForm;
