import { takeLatest } from 'redux-saga/effects';

import {
  GetGeneralState,
  GetCustomerEntityState,
  GetVendorEntityState,
  GetEmployeeEntityState,
  GetPincodeDetailsState,
  GetIndividualEntityState,
  verifyPan,
  GetMemberListState,
} from '@action/Store/Reducers/General/GeneralState';
import {
  GetStateCall,
  GetCustomerEntity,
  GetVendorEntity,
  GetEmployeeEntity,
  GetPincodeDetails,
  GetIndividualEntity,
  VerifyPanDetails,
  GetMemberList,
} from './GeneralWorkers';

export function* GetGeneralStateList() {
  yield takeLatest(GetGeneralState.type, GetStateCall);
}

export function* GetCustomerEntityList() {
  yield takeLatest(GetCustomerEntityState.type, GetCustomerEntity);
}

export function* GetVendorEntityList() {
  yield takeLatest(GetVendorEntityState.type, GetVendorEntity);
}

export function* GetEmployeeEntityList() {
  yield takeLatest(GetEmployeeEntityState.type, GetEmployeeEntity);
}

export function* GetIndividualEntityCall() {
  yield takeLatest(GetIndividualEntityState.type, GetIndividualEntity);
}

export function* GetPincodeDetailsList() {
  yield takeLatest(GetPincodeDetailsState.type, GetPincodeDetails);
}

export function* VerifyPan() {
  yield takeLatest(verifyPan.type, VerifyPanDetails);
}

export function* GetMemberListCall() {
  yield takeLatest(GetMemberListState.type, GetMemberList);
}
