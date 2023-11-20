import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  SetStateGeneralState,
  SetSateCustomerEntity,
  SetSateVendorEntity,
  SetSateEmployeeEntity,
  SetSatePincodeDetails,
  SetSateIndividualEntity,
  SetSateIndividualEntityTypeChange,
  setPanResponse,
  SetStateGetMemberList,
} from '@action/Store/Reducers/General/GeneralState';
import {
  openSnackbar,
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import {
  GetState_API,
  GetEntityValue_API,
  GetPincodeDetails_API,
  GetIndividualEntity_API,
  VerifyPanDetails_Api,
  GetMemberList_API,
} from '../../API/General/GeneralApi';

export function* GetStateCall() {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetState_API);
    if (res.status === 200) {
      yield put(SetStateGeneralState(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetStateCall : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetCustomerEntity({ payload }) {
  try {
    // yield put(enableLoading(true));
    const res = yield call(GetEntityValue_API, {
      entityType: 'customer',
      ...payload,
    });
    if (res.status === 200) {
      yield put(SetSateCustomerEntity(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetCustomerEntity : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetVendorEntity({ payload }) {
  try {
    // yield put(enableLoading(true));
    const res = yield call(GetEntityValue_API, {
      entityType: 'vendor',
      ...payload,
    });
    if (res.status === 200) {
      yield put(SetSateVendorEntity(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetVendorEntity : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetEmployeeEntity({ payload }) {
  try {
    // yield put(enableLoading(true));
    const res = yield call(GetEntityValue_API, {
      entityType: 'employee',
      ...payload,
    });
    if (res.status === 200) {
      yield put(SetSateEmployeeEntity(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetEmployeeEntity : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetIndividualEntity({ payload }) {
  try {
    yield put(enableLoading(true));
    // if (!payload?.entityId || !payload?.entityType) {
    //   yield put(openSnackbar({ message: !payload?.entityId ? 'Entity Id Missing' : 'Entity Type Missing', type: MESSAGE_TYPE.WARNING }));
    //   yield put(enableLoading(false));
    // }
    const res = yield call(GetIndividualEntity_API, payload);
    if (res.status === 200) {
      if (payload?.createRelation) {
        yield put(SetSateIndividualEntityTypeChange(res.data));
      } else {
        yield put(SetSateIndividualEntity(res.data));
      }
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetIndividualEntity : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetPincodeDetails({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetPincodeDetails_API, payload);
    if (res.status === 200) {
      yield put(SetSatePincodeDetails(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetPincodeDetails : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* VerifyPanDetails({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(VerifyPanDetails_Api, payload);
    if (res.status === 200)
      yield put(setPanResponse({ ...res.data, ...payload }));
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetPincodeDetails : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetMemberList({ payload }) {
  try {
    // yield put(enableLoading(true));
    const res = yield call(GetMemberList_API, {
      ...payload,
    });
    if (res.status === 200) {
      yield put(SetStateGetMemberList(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetMemberList : ${e}`);
    yield put(enableLoading(false));
  }
}
