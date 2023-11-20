/* eslint-disable import/no-duplicates */
/* eslint-disable no-unneeded-ternary */

import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useDebounce from '@components/Debounce/Debounce.jsx';

import {
  postClaims,
  updateClaim,
  deleteClaim,
  // getReimbursementAdvances,
  setDrawer as setDrawerRedux,
  clearReimbursementPerformanceAction,
  setTripExpenseRes,
  clearReimbursementOCRData,
  getClaims,
  clearReimbursementBillPatchData,
} from '@action/Store/Reducers/Reimbursement/ReimbursementState';
import {
  getOneReimbursement,
  setOneReimbursement,
} from '@action/Store/Reducers/Settings/ReimburssementSettingsState';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AppContext from '@root/AppContext';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import {
  // enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Stack,
  MenuItem,
  Dialog,
  Box,
  Typography,
  IconButton,
  Avatar,
} from '@mui/material';
import { styled } from '@material-ui/core/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import red_color_delete from '@assets/red_color_delete.svg';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SelectFieldExpense } from '@components/Select/Select';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import CalendarIcon from '@mui/icons-material/CalendarToday';

import { validateRequired } from '@services/Validation.jsx';

import Input from '@components/Input/Input.jsx';
import Calender from '../../InvoiceView/Calander';
import WithBill from './WithBill';
import { ImageUpload } from './WithBill';

import Isbillable from './Isbillable';
// import AdvanceTable from './AdvanceTable';
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

const ExpenseRequirementForm = ({
  selectedTip,
  action,
  data,
  tab,
  id,
  claimTripDetails,
  onClose,
  openMileage,
  setTripSheet,
  from,
  setValue,
}) => {
  const device = localStorage.getItem('device_detect');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { reimbursements, oneReimbursement } = useSelector(
    (value) => value.ReimbursementSettings
  );
  const { expensePerformActions, billPatchData } = useSelector(
    (value) => value.Reimbursement
  );
  // const { expensePerformActions, billPatchData, reimbursementsAdvances } =
  //   useSelector((value) => value.Reimbursement);
  const ReduxData = useSelector((value) => value.Reimbursement);
  const { userPermissions } = useContext(AppContext);

  const { state } = useLocation();
  const IntialState =
    device === 'desktop'
      ? {
          id: data?.id,
          reimbursementPolicyId: data?.reimbursement_policy_id || '',
          selectedCategory: data?.reimbursement_policy_id
            ? reimbursements?.find(
                (val) => val?.id === data?.reimbursement_policy_id
              )
            : {},
          date: data?.date || null,
          status: data?.status || undefined,
          amount: data?.amount || '',
          description: data?.description || '',
          is_this_billable: (data?.billable && 'yes') || 'no',
          client: data?.billable
            ? { id: data?.client_id || '', name: data?.client_name || '' }
            : {},
          reimbursementType: 'expense',
          claim_type: 'expense',
          vendor: data?.vendor_id
            ? {
                id: data?.vendor_id,
                name: data?.vendor_name,
              }
            : {
                id: null,
                name: action === 'new' ? '' : 'Do Not Track Vendor',
              },
          bill_details: data?.file_url
            ? {
                url: data?.file_url || null,
                name: data?.file_name || '',
              }
            : {},
          cgst_amount: data?.cgst_amount ? data?.cgst_amount : '',
          igst_amount: data?.igst_amount ? data?.igst_amount : '',
          taxable_value: data?.taxable_value ? data?.taxable_value : '',
        }
      : {
          id: state?.data?.id,
          status: state?.data?.status || undefined,
          reimbursementPolicyId: state?.data?.reimbursement_policy_id || '',
          selectedCategory: state?.data?.reimbursement_policy_id
            ? reimbursements?.find(
                (val) => val?.id === state?.data?.reimbursement_policy_id
              )
            : {},
          date: state?.data?.date || null,
          amount: state?.data?.amount || '',
          description: state?.data?.description || '',
          is_this_billable: (state?.data?.billable && 'yes') || 'no',
          client: state?.data?.billable
            ? {
                id: state?.data?.client_id || '',
                name: state?.data?.client_name || '',
              }
            : {},
          reimbursementType: 'expense',
          claim_type: 'expense',
          vendor: state?.data?.vendor_id
            ? {
                id: state?.data?.vendor_id,
                name: state?.data?.vendor_name,
              }
            : {},
          bill_details: state?.data?.file_url
            ? {
                url: state?.data?.file_url || null,
                name: state?.data?.file_name || '',
              }
            : {},
          cgst_amount: state?.data?.cgst_amount ? state?.data?.cgst_amount : '',
          igst_amount: state?.data?.igst_amount ? state?.data?.igst_amount : '',
          taxable_value: state?.data?.taxable_value
            ? state?.data?.taxable_value
            : '',
        };

  const [localState, setLocalState] = useState(IntialState);
  const [validationErr, setValidationErr] = useState({
    date: false,
    amount: false,
    is_this_billable: false,
    taxable_value: false,
  });
  const [ShowType, setShowType] = useState(action || state?.action);
  const [drawer, setDrawer] = useState({});
  const [havePermission, setHavePermission] = useState(false);

  const debouncedForAmount = useDebounce(localState?.amount);
  const debouncedForTaxableValue = useDebounce(localState?.taxable_value);
  const debouncedForCgst = useDebounce(localState?.cgst_amount);
  const debouncedForSgst = useDebounce(localState?.cgst_amount);
  const debouncedForIgst = useDebounce(localState?.igst_amount);
  const debouncedForDesc = useDebounce(localState?.description);

  const reValidate = (e) => {
    const { name, value } = e?.target;
    setValidationErr((s) => ({ ...s, [name]: !validateRequired(value) }));
  };

  const SaveBills = (param) => {
    if (ShowType !== 'view' && ShowType !== 'update') {
      const tempData = { ...localState };

      if (localState?.is_this_billable === 'yes')
        tempData.client_id = localState?.client?.id;
      else tempData.client_id = '';

      if (localState?.amount > oneReimbursement?.mandate_receipt_limit) {
        tempData.vendor_id = localState?.vendor?.id;
        tempData.file = localState?.bill_details?.id;
        tempData.cgst_amount =
          localState?.cgst_amount > 0 ? localState?.cgst_amount : undefined;
        tempData.sgst_amount =
          localState?.cgst_amount > 0 ? localState?.cgst_amount : undefined;
        tempData.igst_amount =
          localState?.igst_amount > 0 ? localState?.igst_amount : undefined;
        tempData.taxable_value =
          localState?.taxable_value !== 0 && localState?.taxable_value !== ''
            ? localState?.taxable_value
            : localState?.amount;
      } else {
        tempData.cgst_amount = 0;
        tempData.igst_amount = 0;
        tempData.sgst_amount = 0;
        tempData.taxable_value =
          localState?.taxable_value !== 0 && localState?.taxable_value !== ''
            ? localState?.taxable_value
            : localState?.amount;
        tempData.file_url = '';
        tempData.vendor_id = '';
      }

      const {
        is_this_billable,
        vendor,
        selectedCategory,
        client,
        bill_details,
        stepperActive,
        stepperData,
        ...paramTempData
      } = tempData;

      const arr = convertKeysToSnakeCase(paramTempData);

      let arrdata;
      if (id || state?.id)
        arrdata = {
          ...arr,
          tab: tab || state?.tab,
          date: arr?.date
            ? moment(arr?.date || '')?.format('YYYY-MM-DD')
            : undefined,
          reimbursement_group_id: id || state?.id,
        };
      else
        arrdata = {
          ...arr,
          tab:
            tempData.reimbursement_type === 'advance'
              ? 'advance'
              : 'outstanding',
          date: arr?.date ? moment(arr?.date)?.format('YYYY-MM-DD') : undefined,
        };
      if (!param?.id) {
        dispatch(postClaims({ ...param }));
      } else if (param?.id) {
        dispatch(updateClaim({ ...arrdata, ...param, status: 'draft' }));
      }
    }
  };

  const hanldeChange = (e, paramData) => {
    const { name, value } = e.target;
    if (name === 'amount' || name === 'description') {
      reValidate(e);
    }
    if (name === 'cgst_amount' && localState?.igst_amount > 0) {
      return;
    }
    if (name === 'igst_amount' && localState?.cgst_amount > 0) {
      return;
    }
    if (name === 'amount') {
      if (Number(value) > oneReimbursement?.max_claim_amount) {
        dispatch(
          openSnackbar({
            type: 'error',
            message: `Maximum claim amount is Rs. ${oneReimbursement?.max_claim_amount}`,
          })
        );
        return;
      }
    }

    if (name === 'reimbursementPolicyId') {
      const tempPolicy = reimbursements?.find((val) => val?.id === value);
      if (tempPolicy?.rule) {
        dispatch(getOneReimbursement({ id: value }));
        Object.keys(validationErr).forEach((v) => {
          validationErr[v] = false;
        });
        setLocalState({ ...localState, amount: '' });
        // SaveBills({
        //   reimbursement_policy_id: value,
        //   for: 'billPatch',
        //   id: localState?.id,
        // });
        // return;
      }
      if (!tempPolicy?.rule) {
        dispatch(
          openSnackbar({
            message: 'Please provide rules for the expense',
            type: 'error',
          })
        );
        return;
      }
    }

    if (name === 'billable' && value === 'no')
      setLocalState((prev) => ({ ...prev, client: '' }));

    setLocalState((prev) => ({ ...prev, [name]: value }));

    if (Object.keys(paramData || {})?.length > 0) {
      SaveBills({
        ...paramData,
        reimbursement_policy_id: localState?.reimbursementPolicyId,
        for: 'billPatch',
        id: localState?.id,
      });
    }
  };

  const ValidCheck = () => {
    if (
      !moment(localState?.date, 'DD MMM YYYY').isValid() ||
      Number(localState?.amount) === 0 ||
      !localState?.amount ||
      (!localState?.description && oneReimbursement?.mandate_description)
    ) {
      setValidationErr({
        date: !moment(localState?.date, 'DD MMM YYYY').isValid(),
        amount: Number(localState?.amount) === 0 || !localState?.amount,
        description:
          !localState?.description && oneReimbursement?.mandate_description,
      });
      return false;
    }
    if (
      oneReimbursement?.mandate_receipt_limit &&
      localState?.amount > oneReimbursement?.mandate_receipt_limit &&
      Object.keys(localState?.bill_details || {})?.length === 0
    ) {
      dispatch(
        openSnackbar({
          message: 'Please upload bill',
          type: 'error',
        })
      );
      return false;
    }
    if (
      oneReimbursement?.mandate_receipt_limit &&
      localState?.amount > oneReimbursement?.mandate_receipt_limit &&
      Object.keys(localState?.vendor)?.length === 0
    ) {
      dispatch(
        openSnackbar({
          message: 'Please select vendor',
          type: 'error',
        })
      );
      return false;
    }
    if (!localState?.is_this_billable) {
      dispatch(
        openSnackbar({
          message: 'Is this billable or not.',
          type: 'error',
        })
      );
      return false;
    }
    if (
      localState?.is_this_billable === 'yes' &&
      Object.keys(localState?.client)?.length === 0
    ) {
      dispatch(
        openSnackbar({
          message: 'Please select client',
          type: 'error',
        })
      );
      return false;
    }
    return true;
  };

  const handleDate = (val) => {
    setLocalState((s) => ({
      ...s,
      date: val,
    }));
    setDrawer((d) => ({ ...d, date: false }));
    setValidationErr((prev) => ({
      ...prev,
      date: false,
    }));
    SaveBills({
      date: moment(val)?.format('YYYY-MM-DD'),
      reimbursement_policy_id: localState?.reimbursementPolicyId,
      for: 'billPatch',
      id: localState?.id,
    });
  };

  const onCategorySelect = (item) => {
    if (item?.name === 'Own Vehicle Expenses') {
      if (from === 'trip') setTripSheet('mileage');
      else {
        onClose();
        openMileage();
      }
      return;
    }

    if (item?.rule) {
      dispatch(getOneReimbursement({ id: item.id }));

      if (device === 'mobile') {
        dispatch(setDrawerRedux({ name: 'expense', value: false }));
        const stateParam = {
          data: {
            reimbursement_policy_id: item?.id,
            selectedTip: claimTripDetails,
          },
          action: 'new',
          tab,
        };
        if (id) {
          stateParam.id = id;
          stateParam.claimTripDetails = claimTripDetails;
        }
        navigate('/reimbursement-expense', {
          state: stateParam,
        });
      } else
        setLocalState({
          ...localState,
          reimbursementPolicyId: item.id,
          selectedCategory: item,
        });

      // SaveBills({
      //   for: 'billPatch',
      //   reimbursement_policy_id: item.id,
      // });
    } else {
      dispatch(
        openSnackbar({
          message: 'Please provide rules for the expense',
          type: 'error',
        })
      );
    }
  };

  const onsubmitvalue = () => {
    if (ValidCheck()) {
      const tempData = { ...localState, status: 'submitted' };

      if (localState?.is_this_billable === 'yes')
        tempData.client_id = localState?.client?.id;
      else tempData.client_id = '';

      if (localState?.amount > oneReimbursement?.mandate_receipt_limit) {
        tempData.vendor_id = localState?.vendor?.id;
        tempData.file = localState?.bill_details?.id;
        tempData.cgst_amount =
          localState?.cgst_amount > 0 ? localState?.cgst_amount : undefined;
        tempData.sgst_amount =
          localState?.cgst_amount > 0 ? localState?.cgst_amount : undefined;
        tempData.igst_amount =
          localState?.igst_amount > 0 ? localState?.igst_amount : undefined;
        tempData.taxable_value =
          localState?.taxable_value > 0
            ? localState?.taxable_value
            : localState?.amount;
      } else {
        tempData.cgst_amount = 0;
        tempData.igst_amount = 0;
        tempData.sgst_amount = 0;
        tempData.taxable_value =
          localState?.taxable_value !== 0 && localState?.taxable_value !== ''
            ? localState?.taxable_value
            : localState?.amount;
        tempData.file_url = '';
        tempData.vendor_id = '';
      }

      tempData.billable = localState?.is_this_billable === 'yes';

      const {
        is_this_billable,
        vendor,
        selectedCategory,
        client,
        bill_details,
        ...paramTempData
      } = tempData;

      const arr = convertKeysToSnakeCase(paramTempData);

      let arrdata;
      if (id || state?.id)
        arrdata = {
          ...arr,
          tab: tab || state?.tab,
          date: moment(arr?.date)?.format('YYYY-MM-DD'),
          reimbursement_group_id: id || state?.id,
        };
      else
        arrdata = {
          ...arr,
          tab:
            tempData.reimbursement_type === 'advance'
              ? 'advance'
              : 'outstanding',
          date: moment(arr?.date)?.format('YYYY-MM-DD'),
          reimbursement_group_id: id || state?.id,
        };

      dispatch(updateClaim(arrdata));
      if (from === 'trip') setTripSheet('trip_view');
    }
  };

  const onupdatevalue = () => {
    if (ValidCheck()) {
      const tempData = { ...localState, status: 'submitted' };

      if (localState?.is_this_billable === 'yes')
        tempData.client_id = localState?.client?.id || '';
      else tempData.client_id = '';

      if (localState?.amount > oneReimbursement?.mandate_receipt_limit) {
        tempData.vendor_id = localState?.vendor?.id;
        tempData.file = localState?.bill_details?.id;
        tempData.cgst_amount =
          localState?.cgst_amount > 0 ? localState?.cgst_amount : undefined;
        tempData.sgst_amount =
          localState?.cgst_amount > 0 ? localState?.cgst_amount : undefined;
        tempData.igst_amount =
          localState?.igst_amount > 0 ? localState?.igst_amount : undefined;
        tempData.taxable_value =
          localState?.taxable_value > 0
            ? localState?.taxable_value
            : localState?.amount;
      } else {
        tempData.cgst_amount = 0;
        tempData.igst_amount = 0;
        tempData.sgst_amount = 0;
        tempData.taxable_value =
          localState?.taxable_value !== 0 && localState?.taxable_value !== ''
            ? localState?.taxable_value
            : localState?.amount;
        tempData.file_url = '';
        tempData.vendor_id = '';
      }

      tempData.billable = localState?.is_this_billable === 'yes' ? true : false;

      const {
        is_this_billable,
        vendor,
        client,
        selectedCategory,
        bill_details,
        ...paramTempData
      } = tempData;
      const arr = convertKeysToSnakeCase(paramTempData);

      let arrdata;
      if (id || state?.id)
        arrdata = {
          ...arr,
          date: moment(arr?.date)?.format('YYYY-MM-DD'),
          reimbursement_group_id: id || state?.id,
        };
      else
        arrdata = {
          ...arr,
          tab: tab || state?.tab,
          reimbursement_group_id: id || state?.id,
          date: moment(arr?.date)?.format('YYYY-MM-DD'),
        };

      dispatch(updateClaim(arrdata));
    }
  };

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
              name: 'Approved on',
              label: moment(
                data?.approved_on || state?.data?.approved_on
              )?.format('DD MMM YYYY'),
              id: 2,
              type: 'approve',
              approvedBy:
                data?.approver_details?.name ||
                state?.approver_details?.name ||
                '-',
            },
          ],
        };
      if (data?.status === 'paid' || state?.data?.status === 'paid')
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
              name: 'Approved on',
              label: moment(
                data?.approved_on || state?.data?.approved_on
              )?.format('DD MMM YYYY'),
              id: 2,
              type: 'approve',
              approvedBy:
                data?.approver_details?.name ||
                state?.approver_details?.name ||
                '-',
            },
            {
              name: 'Payment on',
              label:
                data?.paid_on || state?.data?.paid_on
                  ? moment(data?.paid_on || state?.data?.paid_on)?.format(
                      'DD MMM YYYY'
                    )
                  : '',
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
              name: 'Approved on',
              label: moment(
                data?.approved_on || state?.data?.approved_on
              )?.format('DD MMM YYYY'),
              id: 2,
              type: 'approve',
              approvedBy:
                data?.approver_details?.name ||
                state?.approver_details?.name ||
                '-',
            },
            {
              name: 'Payment on',
              label:
                data?.paid_on || state?.data?.paid_on
                  ? moment(data?.paid_on || state?.data?.paid_on)?.format(
                      'DD MMM YYYY'
                    )
                  : '',
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
              name: 'Rejected on',
              label:
                data?.cancelled_on || state?.data?.cancelled_on
                  ? moment(
                      data?.cancelled_on || state?.data?.cancelled_on
                    )?.format('DD MMM YYYY')
                  : '',
              id: 2,
              rejectedBy:
                data?.canceller_details?.name ||
                state?.canceller_details?.name ||
                '-',
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
    if (
      device === 'mobile' &&
      window.location.pathname === '/reimbursement-expense'
    ) {
      if (Object.keys(state?.data || {})?.length === 0) {
        navigate('/reimbursement');
      }
    }
  }, [state]);

  useEffect(() => {
    if (expensePerformActions === 'expense_added_successfully')
      if (device === 'mobile' && state?.id)
        navigate('/reimbursement-trip-claim', {
          state: { selectedTrip: { ...state?.claimTripDetails } },
        });
      else if (device === 'mobile') {
        navigate('/reimbursement');
      } else if (device === 'desktop')
        dispatch(setDrawerRedux({ name: 'expense', value: false }));
      else navigate('/reimbursement');
    if (expensePerformActions === 'expense_updated_successfully') {
      if (device === 'mobile' && state?.id)
        navigate('/reimbursement-trip-claim', {
          state: { selectedTrip: { ...state?.claimTripDetails } },
        });
      else if (device === 'mobile') {
        navigate('/reimbursement');
      } else if (device === 'desktop')
        dispatch(setDrawerRedux({ name: 'expense', value: false }));
    }
    return () => {
      dispatch(clearReimbursementPerformanceAction());
    };
  }, [expensePerformActions]);

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
          type: 'error',
          message: `${
            reimbursements?.find((item) => item.id === oneReimbursement?.id)
              ?.name
          } claim is disabled`,
        })
      );
  }, [oneReimbursement]);

  useEffect(() => {
    return () => {
      dispatch(setOneReimbursement({}));
      dispatch(setTripExpenseRes(''));
      dispatch(clearReimbursementBillPatchData());
      dispatch(clearReimbursementOCRData());
    };
  }, []);

  useEffect(() => {
    if (Object.keys(billPatchData || {})?.length > 0 && !localState?.id) {
      setLocalState({ ...localState, id: billPatchData?.id });
    }
  }, [billPatchData]);

  useEffect(() => {
    if (
      Number(debouncedForAmount) > 0 &&
      Number(debouncedForAmount) < oneReimbursement?.mandate_receipt_limit &&
      (Object.keys(localState?.vendor || {})?.length > 0 ||
        Number(localState?.cgst_amount) > 0 ||
        Number(localState?.igst_amount) > 0 ||
        Number(localState?.taxable_value) > 0)
    ) {
      const tempData = localState;

      tempData.bill_details = {};
      tempData.vendor = {};
      tempData.cgst_amount = 0;
      tempData.igst_amount = 0;
      tempData.taxable_value = '';
      setLocalState({ ...tempData });
      dispatch(clearReimbursementOCRData());
    }
  }, [oneReimbursement?.mandate_receipt_limit, debouncedForAmount]);

  useEffect(() => {
    if (localState?.id) {
      SaveBills({
        amount: debouncedForAmount,
        taxable_value: debouncedForTaxableValue,
        cgst_amount: debouncedForCgst,
        sgst_amount: debouncedForSgst,
        igst_amount: debouncedForIgst,
        description: debouncedForDesc,
        reimbursement_policy_id: localState?.reimbursementPolicyId,
        for: 'billPatch',
        id: localState?.id,
      });
    }
  }, [
    debouncedForAmount,
    debouncedForCgst,
    debouncedForSgst,
    debouncedForIgst,
    debouncedForDesc,
    debouncedForTaxableValue,
  ]);

  useEffect(() => {
    if (
      !ReduxData?.drawer?.expense &&
      device === 'desktop' &&
      ShowType !== 'view'
    ) {
      dispatch(getClaims({ type: 'outstanding' }));
      if (typeof setValue === 'function') setValue();
    }
  }, [ReduxData?.drawer?.expense]);

  return (
    <>
      {localState?.reimbursementPolicyId === '' &&
        !state?.reimbursementPolicyId && (
          <div className={css.reimursementsheet}>
            <>
              {device === 'mobile' && (
                <Stack className={css.bottomsheetheaderwrapper}>
                  <span className={css.bar} />
                  <Stack className={css.bottomsheetheadtitle}>
                    <Typography className={css.headertext}>
                      Select Expense Category
                    </Typography>
                    <CloseRoundedIcon
                      className={css.bottomSheetClose}
                      onClick={() => {
                        dispatch(
                          setDrawerRedux({ name: 'expense', value: false })
                        );
                        if (onClose) onClose();
                      }}
                    />
                  </Stack>
                </Stack>
              )}

              {device === 'desktop' && (
                <Stack className={css.categoryheader}>
                  {from === 'trip' && (
                    <IconButton onClick={() => setTripSheet('trip_view')}>
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                  <Typography
                    className={css.headertext}
                    style={{ padding: '0 0 4px 30px' }}
                  >
                    Select Expense Category
                  </Typography>
                </Stack>
              )}

              <div className={css.selectcont}>
                <ul
                  style={{ padding: 0, margin: 0 }}
                  className={device === 'mobile' && css.categoryListMobile}
                >
                  {reimbursements?.map((item) => (
                    <MenuItem
                      key={item?.id}
                      value={item?.name}
                      onClick={async () => onCategorySelect(item)}
                      className={css.menutext}
                    >
                      <Stack direction="row" className={css.categorylist}>
                        <Avatar
                          src={item.icon}
                          alt={item.name}
                          className={css.categoryicon}
                        />
                        <Typography className={css.categoryname}>
                          {item?.name}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </ul>
              </div>
            </>
          </div>
        )}

      {localState?.reimbursementPolicyId && (
        <div
          className={css.reimursementsheet}
          style={{ background: device === 'mobile' && '#fff' }}
        >
          {device === 'desktop' && (
            <p className={css.headertext}>
              Expense Reimbursement{' '}
              {data?.number && (
                <span style={{ color: '#3049BF', fontSize: '20px' }}>
                  {data?.number}
                </span>
              )}
            </p>
          )}
          {device === 'mobile' && (
            <p className={css.headertext}>
              {localState?.selectedCategory?.name}{' '}
              {state?.data?.number && (
                <span style={{ color: '#3049BF', fontSize: '16px' }}>
                  {state?.data?.number}
                </span>
              )}
            </p>
          )}
          <div className={css.expensecont}>
            {device === 'desktop' && (
              <SelectFieldExpense
                label="Category"
                name="reimbursementPolicyId"
                defaultValue={localState?.reimbursementPolicyId}
                required
                options={reimbursements}
                onChange={(e) => hanldeChange(e)}
                PaperProps={{
                  style: {
                    flexGrow: 1,
                    marginTop: 8,
                    minWidth: 366,
                    borderRadius: 8,
                  },
                }}
                MenuItemProps={{
                  color: '#283049',
                  fontFamily: 'Lexend, sans-serif !important',
                  fontSize: '13px',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  borderBottom: '1px solid rgba(199, 199, 199, 0.50)',
                }}
                style={{ marginBottom: '0' }}
                disabled={ShowType === 'view'}
              />
            )}
            {device === 'desktop' && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="date"
                  minDate={selectedTip?.start_date}
                  maxDate={selectedTip?.end_date || moment()}
                  inputFormat="DD-MM-YYYY"
                  InputProps={{ disableUnderline: true }}
                  value={localState?.date || ''}
                  onChange={(e) => {
                    if (moment(e?.$d, 'DD-MM-YYYY').isValid()) {
                      setValidationErr((prev) => ({
                        ...prev,
                        date: false,
                      }));

                      SaveBills({
                        date: moment(e?.$d)?.format('YYYY-MM-DD'),
                        reimbursement_policy_id:
                          localState?.reimbursementPolicyId,
                        for: 'billPatch',
                        id: localState?.id,
                      });
                    } else
                      setValidationErr((prev) => ({
                        ...prev,
                        date: true,
                      }));
                    setLocalState((prev) => ({ ...prev, date: e?.$d }));
                  }}
                  views={['year', 'month', 'day']}
                  renderInput={(params) => (
                    <Input
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
                      if (ShowType !== 'view')
                        setDrawer({ ...drawer, date: true });
                    }}
                  >
                    <Input
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
                      selectedTip={{
                        start_date: moment(
                          state?.data?.selectedTip?.start_date,
                          'YYYY-MM-DD'
                        ).format('YYYY-MM-DD'),
                        end_date: moment(
                          state?.data?.selectedTip?.end_date,
                          'YYYY-MM-DD'
                        ).format('YYYY-MM-DD'),
                      }}
                      maxDate={moment().format('DD-MM-YYYY')}
                    />
                  </SelectBottomSheet>
                </div>
              </div>
            )}

            <Input
              required
              label="Amount Paid"
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
              type="number"
              placeholder="0"
              error={validationErr?.amount}
              helperText={validationErr?.amount ? 'Enter Valid Amount' : ''}
              onChange={hanldeChange}
              value={localState?.amount}
              disabled={ShowType === 'view'}
              onWheel={(e) => e.target.blur()}
            />

            {oneReimbursement?.mandate_receipt_limit &&
              oneReimbursement?.mandate_receipt_limit !== 0 &&
              oneReimbursement?.mandate_receipt_limit !== '' &&
              Number(localState?.amount) >=
                Number(oneReimbursement?.mandate_receipt_limit) && (
                <WithBill
                  localState={localState}
                  actiontype={action}
                  hanldeChange={hanldeChange}
                  ShowType={ShowType}
                  reValidate={reValidate}
                  validationErr={validationErr}
                  setDrawerState={setDrawer}
                  drawerState={drawer}
                />
              )}

            <Input
              required={oneReimbursement?.mandate_description}
              label="Description"
              variant="standard"
              name="description"
              multiline
              rows={3}
              onBlur={oneReimbursement?.mandate_description && reValidate}
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
              onChange={hanldeChange}
              value={localState?.description}
              disabled={ShowType === 'view'}
            />

            <div className={css.isthisbillable}>
              <p className={css.texttag}>
                Is this Billable?
                <span>*</span>
              </p>
              <RadioGroup
                sx={{ flexDirection: 'row' }}
                name="is_this_billable"
                onChange={(e) =>
                  hanldeChange(e, { billable: e?.target?.value === 'yes' })
                }
                value={localState?.is_this_billable}
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

            {localState?.is_this_billable === 'yes' && (
              <Isbillable
                localState={localState}
                hanldeChange={hanldeChange}
                ShowType={ShowType}
              />
            )}
            {(localState.status === 'paid' ||
              localState.status === 'approved' ||
              localState.status === 'declined') && (
              <CustomizedStepper
                stepperList={localState?.stepperData}
                active={localState?.stepperActive}
              />
            )}
            {/* {reimbursementsAdvances?.data && localState?.id && (
              <AdvanceTable
                value={reimbursementsAdvances?.data}
                reimbursementId={localState?.id}
              />
            )} */}
            {ShowType === 'new' && (
              <Button
                className={css.primaryButton}
                onClick={() => onsubmitvalue()}
                disabled={
                  !oneReimbursement?.enabled ||
                  !oneReimbursement?.active ||
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
                        userPermissions?.Reimbursement?.['Reimbursement Claims']
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
                        userPermissions?.Reimbursement?.['Reimbursement Claims']
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
                onClick={() => onupdatevalue()}
                disabled={!oneReimbursement?.enabled}
              >
                Update Expense Detail
              </Button>
            )}
          </div>
        </div>
      )}
      {havePermission && (
        <PermissionDialog onClose={() => setHavePermission(false)} />
      )}
      <Dialog
        open={drawer?.delete && device === 'desktop'}
        PaperProps={{ style: { width: '416px', borderRadius: '16px' } }}
        onClose={() => setDrawer({ ...drawer, delete: false })}
      >
        <DeleteContent
          handleNo={() => setDrawer({ ...drawer, delete: false })}
          handleYes={() => {
            setDrawer({ ...drawer, delete: false });
            if (typeof onClose === 'function') onClose();
            if (id)
              dispatch(
                deleteClaim({
                  id: data.id,
                  reimbursement_group_id: id,
                  claim_type: 'expense',
                })
              );
            else
              dispatch(
                deleteClaim({ id: data.id, tab, claim_type: 'expense' })
              );
          }}
          type="claim"
        />
      </Dialog>
      <Dialog
        open={drawer?.showimage}
        onClose={() => setDrawer({ ...drawer, showimage: false })}
        PaperProps={{
          elevation: 3,
          style: {
            borderRadius: 16,
            padding: '16px',
          },
        }}
      >
        <>
          <ImageUpload
            localState={localState}
            style={{ height: '500px', width: '500px' }}
          />
        </>
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
            if (state?.id)
              dispatch(
                deleteClaim({
                  id: state?.data?.id,
                  reimbursement_group_id: state?.id,
                  claim_type: 'expense',
                })
              );
            else
              dispatch(
                deleteClaim({
                  id: state?.data?.id,
                  tab: state?.tab,
                  claim_type: 'expense',
                })
              );
          }}
          type="claim"
        />
      </SelectBottomSheet>
    </>
  );
};

export default ExpenseRequirementForm;
