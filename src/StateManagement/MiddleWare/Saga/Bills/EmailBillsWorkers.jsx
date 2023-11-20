import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  SetStateGetEmailUserList,
  SetStateGetEmailBillsList,
  SetStateGetEmailBillsProviderCategory,
  SetEmailBillActionState,
  SetStateGetAllEmailListData,
  SetStateGetSingleEmailBill,
} from '../../../Store/Reducers/Bills/EmailBillsState';
import {
  openSnackbar,
  enableLoading,
} from '../../../Store/Reducers/Errors/Errors';

import {
  GetEmailUserList_API,
  GetEmailBillsList_API,
  GetEmailBillsProviderCategory_API,
  PostNewProvider_API,
  PostNewEmailUser_API,
  PostEmailSync_API,
  DeleteEmail_API,
  GetAllEmailListData_API,
  GetSingleEmailBill_API,
  DeleteEmailBill_API,
  DeleteEmailProvider_API,
} from '../../API/Bills/EmailBillsApi';

// Email Bills

export function* GetEmailUserList({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetEmailUserList_API, payload);
    if (res.status === 200) {
      yield put(SetStateGetEmailUserList(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetEmailUserList({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetEmailUserList : ${e}`);
    yield put(SetStateGetEmailUserList({}));
    yield put(enableLoading(false));
  }
}

export function* GetEmailBillsList({ payload }) {
  try {
    if (payload?.pageNum === 1) {
      yield put(enableLoading(true));
    }
    const res = yield call(GetEmailBillsList_API, payload);
    if (res.status === 200) {
      yield put(
        SetStateGetEmailBillsList({
          response: res.data,
          withId: !!payload?.emailListId,
        })
      );
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetEmailBillsList({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetEmailBillsList : ${e}`);
    yield put(SetStateGetEmailBillsList({}));
    yield put(enableLoading(false));
  }
}

export function* GetEmailBillsProviderCategory({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetEmailBillsProviderCategory_API, payload);
    if (res.status === 200) {
      yield put(SetStateGetEmailBillsProviderCategory(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetEmailBillsProviderCategory({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetEmailBillsProviderCategory : ${e}`);
    yield put(SetStateGetEmailBillsProviderCategory({}));
    yield put(enableLoading(false));
  }
}

export function* PostNewProvider({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostNewProvider_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message:
            payload?.type === 'edit' ? 'Provider Edited' : 'Provider Created',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(
        SetEmailBillActionState(
          payload?.type === 'edit'
            ? { name: 'providerEdited', response: res.data }
            : 'newProviderCreated'
        )
      );
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetEmailBillActionState(''));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostNewProvider : ${e}`);
    yield put(SetEmailBillActionState(''));
    yield put(enableLoading(false));
  }
}

export function* PostNewEmailUser({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostNewEmailUser_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'New Email User Added',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(SetEmailBillActionState('newEmailUserCreated'));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetEmailBillActionState(''));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostNewEmailUser : ${e}`);
    yield put(SetEmailBillActionState(''));
    yield put(enableLoading(false));
  }
}

export function* PostEmailSync({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostEmailSync_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: payload?.syncNow
            ? 'Email is being synced.'
            : (payload?.payload?.status === 'active' &&
                'Email is being synced.') ||
              'Sync stopped successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      if (payload?.payload?.status !== 'inactive') {
        yield put(SetEmailBillActionState('emailSynced'));
      } else if (payload?.payload?.status === 'inactive') {
        yield put(SetEmailBillActionState('emailSyncStoped'));
      }
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetEmailBillActionState(''));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostEmailSync : ${e}`);
    yield put(SetEmailBillActionState(''));
    yield put(enableLoading(false));
  }
}

export function* DeleteEmail({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(DeleteEmail_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Email Deactivated',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(SetEmailBillActionState('emailDeleted'));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetEmailBillActionState(''));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`DeleteEmail : ${e}`);
    yield put(SetEmailBillActionState(''));
    yield put(enableLoading(false));
  }
}

export function* GetSingleEmailBill({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetSingleEmailBill_API, payload);
    if (res.status === 200) {
      yield put(SetStateGetSingleEmailBill(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetSingleEmailBill({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetSingleEmailBill : ${e}`);
    yield put(SetStateGetSingleEmailBill({}));
    yield put(enableLoading(false));
  }
}

export function* DeleteEmailBill({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(DeleteEmailBill_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Bill Deleted',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(SetEmailBillActionState('emailBillDeleted'));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetEmailBillActionState(''));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`DeleteEmailBill : ${e}`);
    yield put(SetEmailBillActionState(''));
    yield put(enableLoading(false));
  }
}

export function* DeleteEmailProvider({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(DeleteEmailProvider_API, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Provider Deleted',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(SetEmailBillActionState('emailProviderDeleted'));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetEmailBillActionState(''));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`DeleteEmailProvider : ${e}`);
    yield put(SetEmailBillActionState(''));
    yield put(enableLoading(false));
  }
}

// Email List

export function* GetAllEmailListData({ payload }) {
  try {
    if (payload?.pageNum === 1) {
      yield put(enableLoading(true));
    }
    const res = yield call(GetAllEmailListData_API, payload);
    if (res.status === 200) {
      yield put(SetStateGetAllEmailListData(res.data));
    } else {
      yield put(
        openSnackbar({ message: 'try again', type: MESSAGE_TYPE.ERROR })
      );
      yield put(SetStateGetAllEmailListData({}));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetAllEmailListData : ${e}`);
    yield put(SetStateGetAllEmailListData({}));
    yield put(enableLoading(false));
  }
}
