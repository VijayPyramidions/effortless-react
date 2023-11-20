import { call, put } from 'redux-saga/effects';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  setSync,
  setOneSync,
  setSyncHistory,
  setSyncSummary,
  setSyncConfig,
  setSyncMapping,
  getSyncMapping,
  getSyncConfig,
  setLog,
  getOneSync,
  setSummaryId,
} from '@action/Store/Reducers/Integration/TallySyncState';

import {
  openSnackbar,
  enableLoading,
} from '@action/Store/Reducers/Errors/Errors';

import {
  GetOneSyncDetailApi,
  GetSyncDetailApi,
  PostSyncDetailApi,
  GetSyncHistoryDetailApi,
  GetSyncSummaryDetailApi,
  GetSyncConfigDetailApi,
  PostSyncConfigDetailApi,
  UpdateSyncConfigDetailApi,
  GetSyncMappingDetailApi,
  PostSyncMappingDetailApi,
  PostSyncMappingSuperDetailApi,
  GetLogDetailApi,
} from '../../API/Integration/TallySyncApi';

export function* GetSyncDetail() {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetSyncDetailApi);
    if (res.status === 200) {
      yield put(setSync(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
      yield put(setSync(null));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetSyncDetail :  ${e}`);
    yield put(setSync(null));
    yield put(enableLoading(false));
  }
}

export function* GetOneSyncDetail({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetOneSyncDetailApi, payload);
    if (res.status === 200) {
      yield put(setOneSync(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
      yield put(setOneSync(null));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetSyncDetail :  ${e}`);
    yield put(setOneSync(null));
    yield put(enableLoading(false));
  }
}

export function* PostSyncDetail({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostSyncDetailApi, payload);
    if (res.status === 200) {
      // yield put(
      //   openSnackbar({
      //     message: 'Sync detail added successfully',
      //     type: MESSAGE_TYPE.ERROR,
      //   })
      // );
      yield put(setSummaryId(res.data));
      yield put(getOneSync(res.data?.data?.id));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostSyncDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}

export function* GetSyncHistoryDetail() {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetSyncHistoryDetailApi);

    if (res.status === 200) {
      yield put(setSyncHistory(res.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
      yield put(setSyncHistory(null));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetSyncHistoryDetail :  ${e}`);
    yield put(setSyncHistory(null));
    yield put(enableLoading(false));
  }
}

export function* GetSyncSummaryDetail({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetSyncSummaryDetailApi, payload);
    if (res.status === 200) {
      yield put(setSyncSummary(res?.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
      yield put(setSyncSummary(null));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetSyncSummaryDetail :  ${e}`);
    yield put(setSyncSummary(null));
    yield put(enableLoading(false));
  }
}

// sync log

export function* GetLogDetail({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetLogDetailApi, payload);
    if (res.status === 200) {
      yield put(setLog(res?.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
      yield put(setLog(null));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetLogDetail :  ${e}`);
    yield put(setLog(null));
    yield put(enableLoading(false));
  }
}

// config

export function* GetSyncConfigDetail() {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetSyncConfigDetailApi);
    if (res.status === 200) yield put(setSyncConfig(res.data));
    else {
      yield put(
        openSnackbar({
          message: res?.data?.message,
          type: MESSAGE_TYPE.ERROR,
        })
      );
      yield put(setSyncConfig(null));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetSyncConfigDetail :  ${e}`);
    yield put(setSyncConfig(null));
    yield put(enableLoading(false));
  }
}

export function* PostSyncConfigDetail({ payload }) {
  try {
    yield put(enableLoading(true));

    const res = yield call(PostSyncConfigDetailApi, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Sync configuration added successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getSyncConfig());
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostSyncConfigDetail :  ${e}`);
    yield put(getSyncConfig());
    yield put(enableLoading(false));
  }
}

export function* UpdateSyncConfigDetail({ payload }) {
  try {
    yield put(enableLoading(true));

    const res = yield call(UpdateSyncConfigDetailApi, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: 'Sync configuration updated successfully',

          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getSyncConfig(null));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`UpdateSyncConfigDetail :  ${e}`);
    yield put(getSyncConfig(null));
    yield put(enableLoading(false));
  }
}

// mapping

export function* GetSyncMappingDetail({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(GetSyncMappingDetailApi, payload);
    if (res.status === 200) {
      yield put(setSyncMapping(res?.data));
    } else {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );
      yield put(setSyncMapping(null));
    }
    yield put(enableLoading(false));
  } catch (e) {
    console.log(`GetSyncMappingDetail :  ${e}`);
    yield put(setSyncMapping(null));
    yield put(enableLoading(false));
  }
}

export function* PostSyncMappingDetail({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostSyncMappingDetailApi, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message: res?.data?.message || 'Sync Detail mapped successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      yield put(getSyncMapping('effortless'));
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostSyncMappingDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}
export function* PostSyncMappingSuperDetail({ payload }) {
  try {
    yield put(enableLoading(true));
    const res = yield call(PostSyncMappingSuperDetailApi, payload);
    if (res.status === 200) {
      yield put(
        openSnackbar({
          message:
            res?.data?.message ||
            'Sync Detail mapping assigned to super accountant successfully',
          type: MESSAGE_TYPE.INFO,
        })
      );
      if (res?.data?.message === 'Submitted to super accountant successfully') {
        yield put(getSyncMapping('tally'));
      }
    } else
      yield put(
        openSnackbar({
          message: res?.data?.message || 'try again',
          type: MESSAGE_TYPE.ERROR,
        })
      );

    yield put(enableLoading(false));
  } catch (e) {
    console.log(`PostSyncMappingSuperDetail :  ${e}`);
    yield put(enableLoading(false));
  }
}
