import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import{
  SetEstimateNameState,
} from '../../../Store/Reducers/Settings/AdditionalInvoicesettings';

import {
  openSnackbar,
  enableLoading,
} from '../../../Store/Reducers/Errors/Errors';

import {
  GetEstimateName_API,
  PatchEstimateName_API
} from '../../API/Settings/AdditionalInvoiceSettingsApi';

export function* GetEstimateName() {
  try{
    yield put(enableLoading(true));
    const res = yield call(GetEstimateName_API);
    if (res?.status === 200){
      yield put(SetEstimateNameState(res?.data));
    }else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetEstimateNameState({}));
    }
    yield put(enableLoading(false));
  }catch (e) {
    console.log(`GetEstimateName : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PatchEstimateName({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PatchEstimateName_API, payload);
    if (res.status === 200) {
      yield put(SetEstimateNameState(res?.data));
      yield put(
        openSnackbar({
          message: 'Updated Successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      // yield put(SetEstimateNameState(res?.data));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PatchEstimateName : ${e}`);
    // yield put(SetStatePatchEInvoice(null));
    yield put(enableLoading(false));
  }
}