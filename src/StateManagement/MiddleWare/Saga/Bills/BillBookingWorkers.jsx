import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  setExpenseCategory,
  setAssetCategory,
  setVendorUnsettled,
  setVendorList,
  setOrgLocation,
  setOrgSetting,
  setAllLocation,
  setGstDetail,
} from '@action/Store/Reducers/Bills/BillBookingState';
import {
  openSnackbar,
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import {
  GetAllLocationDetailsApi,
  GetExpenseAccountsApi,
  GetOrgGstDetailApi,
  GetOrgLocationDetailsApi,
  GetOrgSettingDetailsApi,
  GetVendorListDetailsApi,
  GetVendorUnsettledDetailsApi,
  PostEntityDetailDetailsApi,
} from '../../API/Bills/BillBookingApi';

export function* GetExpenseCategoryDetails() {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetExpenseAccountsApi, 'expense_category');
    if (res.status === 200) {
      yield put(setExpenseCategory(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(setExpenseCategory([]));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetExpenseCategoryDetails : ${e}`);
    yield put(setExpenseCategory([]));
    yield put(enableLoading(false));
  }
}

export function* GetAssetCategoryDetails() {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetExpenseAccountsApi, 'asset');
    if (res.status === 200) {
      yield put(setAssetCategory(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(setAssetCategory([]));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetAssetCategoryDetails : ${e}`);
    yield put(setAssetCategory([]));
    yield put(enableLoading(false));
  }
}

export function* GetVendorUnsettledDetails({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetVendorUnsettledDetailsApi, payload);
    if (res.status === 200) {
      yield put(setVendorUnsettled(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(setVendorUnsettled([]));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetVendorUnsettledDetails : ${e}`);
    yield put(setVendorUnsettled([]));
    yield put(enableLoading(false));
  }
}

export function* GetVendorListDetails({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetVendorListDetailsApi, payload);
    if (res.status === 200) {
      yield put(setVendorList(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(setVendorList([]));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetVendorListDetails : ${e}`);
    yield put(setVendorList([]));
    yield put(enableLoading(false));
  }
}

export function* GetOrgLocationDetails() {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetOrgLocationDetailsApi);
    if (res.status === 200) yield put(setOrgLocation(res.data));
    else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(setOrgLocation(null));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetOrgLocationDetails : ${e}`);
    yield put(setOrgLocation(null));
    yield put(enableLoading(false));
  }
}

export function* GetOrgSettingDetails() {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetOrgSettingDetailsApi);
    if (res.status === 200) {
      yield put(setOrgSetting(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(setOrgSetting(null));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetOrgSettingDetails : ${e}`);
    yield put(setOrgSetting(null));
    yield put(enableLoading(false));
  }
}

export function* GetAllLocationDetails({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetAllLocationDetailsApi, payload);
    if (res.status === 200) {
      yield put(setAllLocation(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(setAllLocation([]));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetAllLocationDetails : ${e}`);
    yield put(setAllLocation([]));
    yield put(enableLoading(false));
  }
}

export function* PostEntityDetailDetails({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostEntityDetailDetailsApi, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({ message: res.data.message, type: MESSAGE_TYPE.INFO })
      );
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostEntityDetailDetails : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetOrgGstDetail({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetOrgGstDetailApi, payload);
    if (res.status === 200) yield put(setGstDetail(res.data));
    else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(setGstDetail(null));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetOrgGstDetail : ${e}`);
    yield put(setGstDetail(null));

    yield put(enableLoading(false));
  }
}
