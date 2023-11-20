import { takeLatest } from 'redux-saga/effects';

import {
  getExpenseCategory,
  getAssetCategory,
  getVendorUnsettled,
  // getVendorList,
  getOrgLocation,
  getOrgSetting,
  getAllLocation,
  postEntityDetail,
  getGstDetail,
} from '../../../Store/Reducers/Bills/BillBookingState';

import {
  GetAllLocationDetails,
  GetAssetCategoryDetails,
  GetExpenseCategoryDetails,
  GetOrgGstDetail,
  GetOrgLocationDetails,
  GetOrgSettingDetails,
  // GetVendorListDetails,
  GetVendorUnsettledDetails,
  PostEntityDetailDetails,
} from './BillBookingWorkers';

export function* GetExpenseCategory() {
  yield takeLatest(getExpenseCategory.type, GetExpenseCategoryDetails);
}

export function* GetBillAssetCategory() {
  yield takeLatest(getAssetCategory.type, GetAssetCategoryDetails);
}

export function* GetVendorUnsettled() {
  yield takeLatest(getVendorUnsettled.type, GetVendorUnsettledDetails);
}

// export function* GetBillVendorList() {
//   yield takeLatest(getVendorList.type, GetVendorListDetails);
// }

export function* GetOrgLocation() {
  yield takeLatest(getOrgLocation.type, GetOrgLocationDetails);
}

export function* GetOrgSetting() {
  yield takeLatest(getOrgSetting.type, GetOrgSettingDetails);
}

export function* GetAllLocation() {
  yield takeLatest(getAllLocation.type, GetAllLocationDetails);
}

export function* PostEntityDetail() {
  yield takeLatest(postEntityDetail.type, PostEntityDetailDetails);
}

export function* GetGstDetail() {
  yield takeLatest(getGstDetail.type, GetOrgGstDetail);
}
