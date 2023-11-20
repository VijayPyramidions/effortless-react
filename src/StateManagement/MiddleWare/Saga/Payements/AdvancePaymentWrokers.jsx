/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */

import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  setAdvancePaymentVoucher,
  setAdvancePayment,
  setExpenceCategory,
  setAssetCategory,
  setVendorList,
  setVendorListMap,
} from '@action/Store/Reducers/Payments/AdvancePaymentState';

import {
  openSnackbar,
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import { PostPaymentVoucher_Api , CreateGetVoucherItems_Api } from '../../API/Payments/MakePaymentApi';
import {
  CreateUpdateAdvPaymentDetail_Api,
  GetExpenceCategoryDetails_Api,
  GetAssetCategoryDetails_Api,
  GetVendorListDetails_Api,
} from '../../API/Payments/AdvancePaymentApi';

export function* GetPaymentVoucher({ payload }) {
  try {
    const res = yield call(PostPaymentVoucher_Api, payload);
    if (res.status === 200) {
      yield put(setAdvancePaymentVoucher(res.data.id));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`GetPaymentVoucher :  ${e}`);
  }
}

export function* CreateUpdateAdvPaymentDetail({ payload }) {
  try {
    const res = yield call(CreateUpdateAdvPaymentDetail_Api, payload);
    yield put(enableLoading(false));
    if (res.status === 200) {
      yield put(setAdvancePayment(res.data));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    yield put(setAdvancePayment(e.response.data));
    console.log(`GetPaymentVoucher :  ${e?.response?.data}`,e?.response?.data);
    yield put(enableLoading(false));
  }
}

export function* GetExpenceCategoryDetails({ payload }) {
  try {
    const res = yield call(GetExpenceCategoryDetails_Api, payload);
    if (res.status === 200) yield put(setExpenceCategory(res.data?.data));
    else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`GetExpenceCategoryDetails :  ${e}`);
  }
}

export function* GetAssetCategoryDetails({ payload }) {
  try {
    const res = yield call(GetAssetCategoryDetails_Api, payload);
    if (res.status === 200) {
      yield put(setAssetCategory(res.data?.data));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`GetAssetCategoryDetails :  ${e}`);
  }
}

export function* GetVendorListDetails({ payload }) {
  try {
    const res = yield call(GetVendorListDetails_Api, payload);
    if (res.status === 200) {
      yield put(enableLoading(false));
      yield put(setVendorList(res.data?.data));
      if (!payload.searchVal && !payload.allParties)
        yield put(setVendorListMap(res.data?.data));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`GetVendorListDetails :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetVoucherItemsDetail({ payload }) {
  try {
    const res = yield call(CreateGetVoucherItems_Api, {
      type: 'get',
      VoucherId: payload,
    });

    if (res.status === 200) {
      yield put(setAdvancePayment(res.data.data[0]));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
  } catch (e) {
    console.log(`GetVoucherItemsDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}
