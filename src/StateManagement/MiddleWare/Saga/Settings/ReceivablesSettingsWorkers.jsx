import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  GetReceivablesRemainderState,
  SetStateReceivablesRemainder,
  SetStateCreateReceivablesRemainder,
} from '../../../Store/Reducers/Settings/ReceivablesSettingsState';
import {
  openSnackbar,
  enableLoading,
} from '../../../Store/Reducers/Errors/Errors';

import {
  GetReceivablesRemainder_API,
  PostCreateReceivablesRemainder_API,
  DeleteReceivablesRemainder_API,
  GetReceivablesDuplicateRemainder_API,
  PatchUpdateReceivablesRemainder_API,
} from '../../API/Settings/ReceivablesSettingsApi';

export function* GetReceivablesRemainder() {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetReceivablesRemainder_API);
    if (res.status === 200) {
      yield put(SetStateReceivablesRemainder(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateReceivablesRemainder({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetReceivablesRemainder : ${e}`);
    yield put(SetStateReceivablesRemainder({}));
    yield put(enableLoading(false));
  }
}

export function* PostCreateReceivablesRemainder({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostCreateReceivablesRemainder_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: res?.message || 'Reminder added successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(
        SetStateCreateReceivablesRemainder({ newRemainder: res?.data })
      );
      yield put(GetReceivablesRemainderState());
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostCreateReceivablesRemainder : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* DeleteReceivablesRemainder({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(DeleteReceivablesRemainder_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: res?.message || 'Deleted successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(GetReceivablesRemainderState());
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`DeleteReceivablesRemainder : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetReceivablesDuplicateRemainder({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetReceivablesDuplicateRemainder_API, payload);
    if (res?.status === 200) {
      // yield put(openSnackbar({ message: 'Duplicate Remainder created successfully.', type: MESSAGE_TYPE.INFO }));
      yield put(
        SetStateCreateReceivablesRemainder({ duplicateRemainder: res?.data })
      );
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetReceivablesDuplicateRemainder : ${e}`);
    yield put(enableLoading(false));
  }
}

export function* PatchUpdateReceivablesRemainder({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PatchUpdateReceivablesRemainder_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: res?.message || 'Reminder edited successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(
        SetStateCreateReceivablesRemainder({ newRemainder: res?.data })
      );
      yield put(GetReceivablesRemainderState());
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PatchUpdateReceivablesRemainder : ${e}`);
    yield put(enableLoading(false));
  }
}
