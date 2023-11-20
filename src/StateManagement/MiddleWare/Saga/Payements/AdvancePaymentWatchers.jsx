import { takeLatest } from 'redux-saga/effects';

import {
  advancePaymentVoucher,
  createUpdateAdvPayment,
  getExpenceCategory,
  getAssetCategory,
  getVendorList,
  getVoucherItems,
} from '@action/Store/Reducers/Payments/AdvancePaymentState';

import {
  GetPaymentVoucher,
  CreateUpdateAdvPaymentDetail,
  GetExpenceCategoryDetails,
  GetAssetCategoryDetails,
  GetVendorListDetails,
  GetVoucherItemsDetail,
} from './AdvancePaymentWrokers';

export function* AdvancePaymentVoucher() {
  yield takeLatest(advancePaymentVoucher.type, GetPaymentVoucher);
}

export function* CreateUpdateAdvancePayment() {
  yield takeLatest(createUpdateAdvPayment.type, CreateUpdateAdvPaymentDetail);
}

export function* GetExpenceCategory() {
  yield takeLatest(getExpenceCategory.type, GetExpenceCategoryDetails);
}

export function* GetAssetCategory() {
  yield takeLatest(getAssetCategory.type, GetAssetCategoryDetails);
}

export function* GetVendorList() {
  yield takeLatest(getVendorList.type, GetVendorListDetails);
}

export function* GetVoucherItemsAdvance() {
  yield takeLatest(getVoucherItems.type, GetVoucherItemsDetail);
}
