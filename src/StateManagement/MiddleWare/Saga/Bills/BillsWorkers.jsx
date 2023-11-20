import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  SetStateGetBillsList,
  SetStateGetVendorBillDetails,
  SetStateBillAction,
} from '../../../Store/Reducers/Bills/BillsState';
import {
  openSnackbar,
  enableLoading,
} from '../../../Store/Reducers/Errors/Errors';

import {
  GetBillsList_API,
  GetVendorBillDetails_API,
  DeleteVendorBill_API,
  PatchVendorBillDetails_API
} from '../../API/Bills/BillsApi';

export function* GetVendorBillDetails({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetVendorBillDetails_API, payload);
    if (res.status === 200) {
      yield put(SetStateGetVendorBillDetails(res.data));
      yield put(SetStateBillAction('vendorBillReterived' || payload?.action));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetVendorBillDetails({}));
      yield put(SetStateBillAction(''));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetVendorBillDetails : ${e}`);
    yield put(SetStateGetVendorBillDetails({}));
    yield put(enableLoading(false));
  }
}

export function* DeleteVendorBill({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(DeleteVendorBill_API, payload);
    if (res.status === 200) {
      yield put(SetStateBillAction('vendorBillDeleted'));
      yield put(
        openSnackbar({
          message: 'Vendor Bill Deleted Successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateBillAction(''));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`DeleteVendorBill : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PatchVendorBill({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PatchVendorBillDetails_API, payload);
    if (res.status === 200) {
      yield put(SetStateBillAction('InQueueUpdated'));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateBillAction(''));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PatchVendorBill : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetBillsList({ payload }) {
  try {
    if (
      payload?.filter !== '&status=draft' &&
      window.location.pathname === '/bill-draft'
    ) {
      yield put(enableLoading(true));
    }
    if (
      payload?.filter !== '&source_type=in_queue' &&
      window.location.pathname === '/bill-queue'
    ) {
      yield put(enableLoading(true));
    }
    const res = yield call(GetBillsList_API, payload);
    if (res.status === 200) {
      if (
        window.location.pathname === '/bill-draft' ||
        window.location.pathname === '/bill-queue'
      ) {
        yield put(SetStateGetBillsList(res.data));
      } else {
        yield put(SetStateGetBillsList({}));
      }
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetBillsList({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetBillsList : ${e}`);
    yield put(SetStateGetBillsList({}));
    yield put(enableLoading(false));
  }
}
