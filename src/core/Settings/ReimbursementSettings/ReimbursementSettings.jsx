/* eslint-disable no-lonely-if */
/* eslint-disable  no-else-return */
import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import {
  getReimbursements,
  postReimbursement,
  getOneReimbursement,
  patchReimbursement,
  getMileageHistory,
  setOneReimbursement,
  setDrawer,
} from '@action/Store/Reducers/Settings/ReimburssementSettingsState';

import {
  openSnackbar,
  // enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import {
  Box,
  Stack,
  Typography,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import AppContext from '@root/AppContext';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import { Toggle } from '@components/ToggleSwitch/ToggleSwitch';
import { DatePickerLabeled } from '@components/DatePicker/DatePicker';

import { InputText } from '@components/Input/Input';

import * as css from './Reimbursements.scss';
import VehicleHistory from './Mobile/VehicleHistory';
import { convertKeysToSnakeCase } from '../../../components/utils';

const TextfieldStyle = (props) => {
  return (
    <InputText
      {...props}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      theme="light"
    />
  );
};

const initialErrors = {
  maxClaimAmount: false,
  startDate: false,
  endDate: false,
  mileageRate: false,
};

const ReimbursementSettings = () => {
  const device = localStorage.getItem('device_detect');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { reimbursements, oneReimbursement, drawer } = useSelector(
    (state) => state.ReimbursementSettings
  );

  const { currentUserInfo, userPermissions } = useContext(AppContext);

  const initialState = {
    enabled: false,
    maxClaimAmount: '',
    mandateReceiptLimit: '',
    mandateDescription: false,
    vehicleType: 'bike',
    startDate: null,
    endDate: null,
    mileageRate: '',
  };

  const [formState, setFormState] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [selectedExpense, setSelectedExpense] = useState({});
  const [havePermission, setHavePermission] = useState(false);

  const drawerOpenClose = (name, value, data) => {
    dispatch(setDrawer({ name, value }));
    if (data) setSelectedExpense(data);
  };

  const validate = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: !value }));
  };

  const disablePolicy = (data) => {
    dispatch(patchReimbursement(data));
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    validate(e);
    if (
      name === 'mandateReceiptLimit' &&
      Number(value) > Number(formState.maxClaimAmount)
    ) {
      dispatch(
        openSnackbar({
          type: 'error',
          message: 'Reception amount should not greater than expense amount',
        })
      );
      return;
    }

    if (name === 'maxClaimAmount')
      setFormState((prev) => ({ ...prev, mandateReceiptLimit: '' }));

    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const onRadioChange = (e) => {
    const { name, checked } = e.target;
    validate(e);

    if (
      !checked &&
      Object.keys(oneReimbursement || {}).length > 0 &&
      !userPermissions?.Settings?.['Reimbursement Policy']
        ?.delete_reimbursement_policy
    ) {
      setHavePermission(true);
      return;
    }

    setFormState((prev) => ({ ...prev, [name]: checked }));

    if (name === 'enabled')
      if (selectedExpense.name === 'Own Vehicle Expenses') {
        if (formState.vehicleType === 'bike') {
          if (selectedExpense.bike_rule)
            disablePolicy({
              id: selectedExpense.id,
              enabled: e?.target?.checked,
              vehicle_type: 'bike',
            });
        } else if (formState.vehicleType === 'car') {
          if (selectedExpense.car_rule)
            disablePolicy({
              id: selectedExpense.id,
              enabled: e?.target?.checked,
              vehicle_type: 'car',
            });
        }
      } else {
        if (selectedExpense.rule)
          disablePolicy({
            id: selectedExpense.id,
            enabled: e?.target?.checked,
          });
      }
  };

  const oneReimursement = (id) => dispatch(getOneReimbursement(id));

  const viewHistory = () => {
    drawerOpenClose('expense', false);
    drawerOpenClose('history', true);
    dispatch(getMileageHistory(selectedExpense.id));
  };

  const onSubmit = () => {
    if (selectedExpense.name === 'Own Vehicle Expenses') {
      let err = false;
      if (formState.mileageRate === '' || Number(formState.mileageRate) === 0) {
        setErrors((prev) => ({ ...prev, mileageRate: true }));
        err = true;
      }
      if (!moment(formState.startDate, 'DD-MM-YYYY').isValid()) {
        setErrors((prev) => ({ ...prev, startDate: true }));
        err = true;
      }
      if (!moment(formState.endDate, 'DD-MM-YYYY').isValid()) {
        setErrors((prev) => ({ ...prev, endDate: true }));
        err = true;
      }
      if (err) return;
    } else {
      if (
        formState.maxClaimAmount === '' ||
        Number(formState.maxClaimAmount) === 0
      ) {
        setErrors((prev) => ({ ...prev, maxClaimAmount: true }));
        return;
      }
    }

    const data = convertKeysToSnakeCase(formState);
    let type;

    if (selectedExpense.name === 'Own Vehicle Expenses') {
      if (formState.vehicleType === 'bike') {
        type = selectedExpense.bike_rule ? 'Vehicle' : 'Expense';
      }

      if (formState.vehicleType === 'car') {
        type = selectedExpense.car_rule ? 'Vehicle' : 'Expense';
      }

      delete data.max_claim_amount;
      delete data.mandate_receipt_limit;
      delete data.mandate_escription;
    } else {
      type = 'Expense';
      delete data.vehicle_type;
      delete data.start_date;
      delete data.end_date;
      delete data.mileage_rate;
    }

    if (selectedExpense.rule && selectedExpense.name !== 'Own Vehicle Expenses')
      dispatch(
        patchReimbursement({
          ...data,
          id: selectedExpense.id,
          start_date: moment(data.start_date).format('YYYY-MM-DD'),
          end_date: moment(data.end_date).format('YYYY-MM-DD'),
        })
      );
    else
      dispatch(
        postReimbursement({
          ...data,
          id: selectedExpense.id,
          start_date: moment(data.start_date).format('YYYY-MM-DD'),
          end_date: moment(data.end_date).format('YYYY-MM-DD'),
          type,
        })
      );
  };

  useEffect(() => {
    if (Object.keys(oneReimbursement).length > 0)
      setFormState((prev) => ({
        ...prev,
        enabled: oneReimbursement?.enabled || false,
        maxClaimAmount: oneReimbursement?.max_claim_amount || '',
        mandateReceiptLimit: oneReimbursement?.mandate_receipt_limit || '',
        mandateDescription: oneReimbursement?.mandate_description || false,
        vehicleType: oneReimbursement?.vehicle_type,
        startDate: oneReimbursement?.start_date || null,
        endDate: oneReimbursement?.end_date || null,
        mileageRate: oneReimbursement?.mileage_rate || '',
      }));
    else setFormState(initialState);
  }, [oneReimbursement]);

  useEffect(() => {
    if (selectedExpense.name === 'Own Vehicle Expenses') {
      if (formState.vehicleType === 'bike') {
        if (selectedExpense.bike_rule)
          oneReimursement({
            id: selectedExpense.id,
            vehicleType: formState.vehicleType,
          });
        else if (!selectedExpense.bike_rule)
          setFormState({
            ...initialState,
            enabled: true,
            vehicleType: 'bike',
          });
      }

      if (formState.vehicleType === 'car') {
        if (selectedExpense.car_rule)
          oneReimursement({
            id: selectedExpense.id,
            vehicleType: formState.vehicleType,
          });
        else if (!selectedExpense.car_rule) {
          setFormState({
            ...initialState,
            enabled: true,
            vehicleType: 'car',
          });
        }
      }
    } else if (selectedExpense.rule)
      oneReimursement({ id: selectedExpense.id });
  }, [selectedExpense, formState.vehicleType]);

  useEffect(() => {
    if (!drawer.expense && !drawer.history) {
      dispatch(setOneReimbursement({}));
      setErrors(initialErrors);
      setSelectedExpense({});
    }
  }, [drawer.expense]);

  useEffect(() => {
    dispatch(getReimbursements());
    if (currentUserInfo?.role !== 'Founder') navigate('/settings');
  }, []);

  return (
    <Box className={css.reimbursecontainer}>
      <Typography variant="h2" className={css.headertitle}>
        Manage Policies & Rules
      </Typography>
      {device === 'desktop' ? (
        <Stack className={css.policyrules}>
          {reimbursements.map((item) => (
            <Stack
              className={css.cardcontainer}
              key={item.id}
              onClick={() => drawerOpenClose('expense', true, item)}
            >
              <img src={item.icon} alt="logo" className={css.cardicon} />
              <Typography className={css.cardtitle}>{item.name}</Typography>
              <Typography className={css.carddesc}>
                {item.description}
              </Typography>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Stack className={css.policyrulesmobile}>
          {reimbursements.map((item) => (
            <Stack
              className={css.cardcontainermobile}
              key={item.id}
              onClick={() => drawerOpenClose('expense', true, item)}
            >
              <Stack className={css.cardelementwrapper}>
                <Typography className={css.cardtitlemobile}>
                  {item.name}
                </Typography>
                <img
                  src={item.icon}
                  alt="logo"
                  className={css.cardiconmobile}
                />
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}

      <SelectBottomSheet
        open={drawer.expense}
        onClose={() => {
          // dispatch(setOneReimbursement({}));
          // setErrors(initialErrors);
          // setSelectedExpense({});
          drawerOpenClose('expense', false);
        }}
        triggerComponent={<></>}
        addNewSheet
      >
        <Stack className={css.expencecontainer}>
          <span className={css.linebar} />
          <Stack className={css.headercontainer}>
            <Stack className={css.headerwrapper}>
              <Typography className={css.headertitle}>
                {selectedExpense.name}
              </Typography>

              {selectedExpense.name === 'Own Vehicle Expenses' && (
                <Button className={css.viewhistory} onClick={viewHistory}>
                  View History
                </Button>
              )}
            </Stack>

            <Stack className={css.rulesswitchwrapper}>
              <Typography className={css.rulesLabel}>
                Expense Rules Enabled?
              </Typography>
              <Toggle
                name="enabled"
                onChange={onRadioChange}
                checked={formState.enabled}
              />
            </Stack>
          </Stack>
          <Stack className={css.expenceformcontainer}>
            {selectedExpense.name === 'Own Vehicle Expenses' ? (
              <Stack key={formState.vehicleType}>
                <Stack className={css.vehicletypewrapper}>
                  <Typography className={css.vehicletypelabel}>
                    Select Vehicle Types
                  </Typography>

                  <FormControl>
                    <RadioGroup
                      row
                      value={formState.vehicleType}
                      name="vehicleType"
                      onChange={onInputChange}
                    >
                      <FormControlLabel
                        value="bike"
                        // disabled={!formState.enabled}
                        control={
                          <Radio
                            sx={{
                              color: 'rgba(0, 0, 0, 0.10)',
                              '&.Mui-checked': {
                                color: '#f08b32',
                              },

                              '&.Mui-disabled': {
                                opacity: 0.5,
                              },
                            }}
                          />
                        }
                        label="Bike"
                        className={css.radiolablel}
                      />
                      <FormControlLabel
                        value="car"
                        // disabled={!formState.enabled}
                        control={
                          <Radio
                            sx={{
                              color: 'rgba(0, 0, 0, 0.10)',
                              '&.Mui-checked': {
                                color: '#f08b32',
                              },

                              '&.Mui-disabled': {
                                opacity: 0.5,
                              },
                            }}
                          />
                        }
                        label="Car"
                        className={css.radiolablel}
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>
                <Stack className={css.datepicker}>
                  <DatePickerLabeled
                    name="startDate"
                    label="Start Date"
                    required
                    value={formState.startDate}
                    onChange={(e) => {
                      if (moment(e?.$d, 'DD-MM-YYYY').isValid())
                        setErrors((prev) => ({ ...prev, startDate: false }));
                      else setErrors((prev) => ({ ...prev, startDate: true }));

                      setFormState((prev) => ({ ...prev, startDate: e?.$d }));
                    }}
                    disabled={!formState.enabled}
                    error={errors.startDate}
                    helperText={
                      errors.startDate
                        ? 'Please enter the valid start date'
                        : ''
                    }
                  />
                  <DatePickerLabeled
                    name="endDate"
                    label="End Date"
                    minDate={formState.startDate}
                    disabled={!formState.enabled}
                    value={formState.endDate}
                    onChange={(e) => {
                      if (moment(e?.$d, 'DD-MM-YYYY').isValid())
                        setErrors((prev) => ({ ...prev, endDate: false }));
                      else setErrors((prev) => ({ ...prev, endDate: true }));
                      setFormState((prev) => ({ ...prev, endDate: e?.$d }));
                    }}
                    required
                    error={errors.endDate}
                    helperText={
                      errors.endDate ? 'Please enter the valid end date' : ''
                    }
                  />
                </Stack>
                <Typography className={css.mileagedesc}>
                  Please Note that the Milage Rate will be applicable for the
                  period between the dates provided above.
                </Typography>
                <TextfieldStyle
                  label="Milage Rate"
                  name="mileageRate"
                  type="number"
                  required
                  value={formState.mileageRate}
                  className={
                    !formState.enabled
                      ? `${css.textFieldSize} ${css.marginbottom} ${css.disabled}`
                      : `${css.textFieldSize} ${css.marginbottom}`
                  }
                  onChange={(e) => onInputChange(e)}
                  onWheel={(e) => e.target.blur()}
                  disabled={!formState.enabled}
                  error={errors.mileageRate}
                  helperText={
                    errors.mileageRate
                      ? 'Please enter the valid mileage rate'
                      : ''
                  }
                />
              </Stack>
            ) : (
              <>
                <TextfieldStyle
                  label="Expense Amount Limit"
                  name="maxClaimAmount"
                  type="number"
                  required
                  value={formState.maxClaimAmount}
                  className={
                    !formState.enabled
                      ? `${css.textFieldSize} ${css.disabled}`
                      : css.textFieldSize
                  }
                  onWheel={(e) => e.target.blur()}
                  onChange={onInputChange}
                  disabled={!formState.enabled}
                  error={errors.maxClaimAmount}
                  helperText={
                    errors.maxClaimAmount
                      ? 'Please enter the valid expense limit'
                      : ''
                  }
                />
                <TextfieldStyle
                  label="Receipts Required Beyond"
                  name="mandateReceiptLimit"
                  type="number"
                  value={formState.mandateReceiptLimit}
                  className={
                    !formState.enabled
                      ? `${css.textFieldSize} ${css.disabled}`
                      : css.textFieldSize
                  }
                  onWheel={(e) => e.target.blur()}
                  onChange={onInputChange}
                  disabled={!formState.enabled}
                />
                <Stack className={css.descswitchwrapper}>
                  <Typography className={css.desclabel}>
                    Make Description Mandatory?
                  </Typography>
                  <Toggle
                    name="mandateDescription"
                    onChange={onRadioChange}
                    checked={formState.mandateDescription}
                    disabled={!formState.enabled}
                  />
                </Stack>
              </>
            )}
            <Button
              className={css.submitBtn}
              disabled={!formState.enabled}
              onClick={() => {
                if (Object.keys(oneReimbursement || {}).length === 0) {
                  if (
                    userPermissions?.Settings?.['Reimbursement Policy']
                      ?.create_reimbursement_policy
                  )
                    onSubmit();
                  else setHavePermission(true);
                } else {
                  if (
                    userPermissions?.Settings?.['Reimbursement Policy']
                      ?.edit_reimbursement_policy
                  )
                    onSubmit();
                  else setHavePermission(true);
                }
              }}
            >
              Confirm Expense Rules
            </Button>
          </Stack>
        </Stack>
      </SelectBottomSheet>

      <SelectBottomSheet
        open={drawer.history}
        onClose={() => {
          drawerOpenClose('history', false);
          drawerOpenClose('expense', true);
        }}
        triggerComponent={<></>}
        addNewSheet
      >
        <VehicleHistory />
      </SelectBottomSheet>

      {havePermission && (
        <PermissionDialog onClose={() => setHavePermission(false)} />
      )}
    </Box>
  );
};

export default ReimbursementSettings;
