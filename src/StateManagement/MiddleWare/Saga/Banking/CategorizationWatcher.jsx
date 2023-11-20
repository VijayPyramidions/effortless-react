import { takeLatest } from 'redux-saga/effects';
import {
  updateEntity,
  billSettlement,
  getContraBanks,
} from '../../../Store/Reducers/Banking/CategorizationState';

import {
  EntityUpdate,
  postBillSettlement,
  GetContraBanks,
} from './CategorizationWorker';

export function* Entity() {
  yield takeLatest(updateEntity.type, EntityUpdate);
}

export function* BillSettlement() {
  yield takeLatest(billSettlement.type, postBillSettlement);
}

export function* ContraBanks() {
  yield takeLatest(getContraBanks.type, GetContraBanks);
}
