import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  SetStateGetBillBoxBills,
  SetStateGetVendorBillsCount,
  SetStateGetVendorBillDetails,
  SetStateDeleteVendorBill,
} from '../../../Store/Reducers/Bills/BillBoxState';
import {
  openSnackbar,
  enableLoading,
} from '../../../Store/Reducers/Errors/Errors';

import {
  GetBillBoxBills_API,
  GetVendorBillsCount_API,
  GetVendorBillDetails_API,
  DeleteVendorBill_API,
} from '../../API/Bills/BillBoxApi';

export function* GetBillBoxBills({ payload }) {
  try {
    // yield put(enableLoading(true));
    const res = yield call(GetBillBoxBills_API, payload);
    if (res.status === 200) {
      yield put(SetStateGetBillBoxBills(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetBillBoxBills({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetBillBoxBills : ${e}`);
    yield put(SetStateGetBillBoxBills({}));
    yield put(enableLoading(false));
  }
}

export function* GetVendorBillsCount({ payload }) {
  try {
    // yield put(enableLoading(true));
    const res = yield call(GetVendorBillsCount_API, payload);
    if (res.status === 200) {
      yield put(SetStateGetVendorBillsCount(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetVendorBillsCount({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetVendorBillsCount : ${e}`);
    yield put(SetStateGetBillBoxBills({}));
    yield put(enableLoading(false));
  }
}

export function* GetVendorBillDetails({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetVendorBillDetails_API, payload);
    if (res.status === 200) {
      yield put(SetStateGetVendorBillDetails(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetVendorBillDetails({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetVendorBillDetails : ${e}`);
    yield put(SetStateGetBillBoxBills({}));
    yield put(enableLoading(false));
  }
}

export function* DeleteVendorBill({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(DeleteVendorBill_API, payload);
    if (res.status === 200) {
      yield put(SetStateDeleteVendorBill('vendorBillDeleted'));
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
      yield put(SetStateDeleteVendorBill(''));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`DeleteVendorBill : ${e}`);
    yield put(SetStateGetBillBoxBills({}));
    yield put(enableLoading(false));
  }
}
