import { takeLatest } from 'redux-saga/effects';

import {
  getClaims,
  postClaims,
  getOneClaim,
  updateClaim,
  deleteClaim,
  getReimbursementAdvances,
  getTrips,
  getAllTrips,
  postTrip,
  getManagers,
  getEmployees,
  postFollowUp,
  getTripExpenses,
  approveClaim,
  rejectClaim,
  raiseClaim,
  getOCRData,
  fetchOCRData,
  getVoucher,
  postItems,
  postItemsDelete,
  advanceAdjust,
  editTrip,
  deleteTrip,
  tripAdjustAmount,
} from '../../../Store/Reducers/Reimbursement/ReimbursementState';

import {
  GetClaimsDetails,
  PostClaimsDetails,
  GetOneClaimDetails,
  UpdateClaimDetails,
  DeleteClaimDetails,
  GetReimbursementAdvancesDetails,
  PostTripDetails,
  GetTripsDetails,
  EditTripDetails,
  DeleteTripDetails,
  GetManagersDetails,
  GetEmployeesDetails,
  PostFollowUpDetail,
  GetTripExpensesDetail,
  ApproveClaimDetail,
  RejectClaimDetail,
  RaiseClaimDetail,
  GetOCRDataDetail,
  FetchOCRDataDetail,
  GetVoucher,
  CreateVoucherItem,
  DeleteVoucherItem,
  AdjustAdvanceItem,
  TripAdjustItem,
} from './ReimbursementWorker';

export function* GetClaims() {
  yield takeLatest(getClaims.type, GetClaimsDetails);
}

export function* PostClaims() {
  yield takeLatest(postClaims.type, PostClaimsDetails);
}

export function* GetOneClaim() {
  yield takeLatest(getOneClaim.type, GetOneClaimDetails);
}

export function* UpdateClaim() {
  yield takeLatest(updateClaim.type, UpdateClaimDetails);
}

export function* DeleteClaim() {
  yield takeLatest(deleteClaim.type, DeleteClaimDetails);
}

export function* GetReimbursementAdvancesCall() {
  yield takeLatest(
    getReimbursementAdvances.type,
    GetReimbursementAdvancesDetails
  );
}

export function* GetTrips() {
  yield takeLatest(getTrips.type, GetTripsDetails);
}

export function* GetAllTrips() {
  yield takeLatest(getAllTrips.type, GetTripsDetails);
}

export function* PostTrip() {
  yield takeLatest(postTrip.type, PostTripDetails);
}

export function* EditTrip() {
  yield takeLatest(editTrip.type, EditTripDetails);
}

export function* DeleteTrip() {
  yield takeLatest(deleteTrip.type, DeleteTripDetails);
}

export function* GetManagers() {
  yield takeLatest(getManagers.type, GetManagersDetails);
}

export function* GetEmployees() {
  yield takeLatest(getEmployees.type, GetEmployeesDetails);
}

export function* PostFollowUp() {
  yield takeLatest(postFollowUp.type, PostFollowUpDetail);
}

export function* GetTripExpenses() {
  yield takeLatest(getTripExpenses.type, GetTripExpensesDetail);
}

export function* ApproveClaim() {
  yield takeLatest(approveClaim.type, ApproveClaimDetail);
}

export function* RejectClaim() {
  yield takeLatest(rejectClaim.type, RejectClaimDetail);
}

export function* RaiseClaim() {
  yield takeLatest(raiseClaim.type, RaiseClaimDetail);
}

export function* GetOCRData() {
  yield takeLatest(getOCRData.type, GetOCRDataDetail);
}

export function* FetchOCRData() {
  yield takeLatest(fetchOCRData.type, FetchOCRDataDetail);
}

export function* GetVoucherData() {
  yield takeLatest(getVoucher.type, GetVoucher);
}

export function* VoucherItemsData() {
  yield takeLatest(postItems.type, CreateVoucherItem);
}

export function* DeleteVoucherItemsData() {
  yield takeLatest(postItemsDelete.type, DeleteVoucherItem);
}

export function* AdvanceAdjust() {
  yield takeLatest(advanceAdjust.type, AdjustAdvanceItem);
}

export function* TripAdjustAmount() {
  yield takeLatest(tripAdjustAmount.type, TripAdjustItem);
}
