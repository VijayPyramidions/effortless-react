import { takeLatest } from 'redux-saga/effects';

import {
  getSync,
  getOneSync,
  postSync,
  getSyncHistory,
  getSyncSummary,
  getSyncConfig,
  postSyncConfig,
  updateSyncConfig,
  getSyncMapping,
  postSyncMapping,
  postSyncMappingSuper,
  getLog,
} from '@action/Store/Reducers/Integration/TallySyncState';

import {
  GetOneSyncDetail,
  GetSyncDetail,
  PostSyncDetail,
  GetSyncHistoryDetail,
  GetSyncSummaryDetail,
  GetSyncConfigDetail,
  PostSyncConfigDetail,
  UpdateSyncConfigDetail,
  GetSyncMappingDetail,
  PostSyncMappingDetail,
  PostSyncMappingSuperDetail,
  GetLogDetail,
} from './TallySyncWorkers';

export function* GetSync() {
  yield takeLatest(getSync.type, GetSyncDetail);
}

export function* GetOneSync() {
  yield takeLatest(getOneSync.type, GetOneSyncDetail);
}

export function* PostSync() {
  yield takeLatest(postSync.type, PostSyncDetail);
}

export function* GetSyncHistory() {
  yield takeLatest(getSyncHistory.type, GetSyncHistoryDetail);
}

export function* GetSyncSummary() {
  yield takeLatest(getSyncSummary.type, GetSyncSummaryDetail);
}

// sync log

export function* GetLog() {
  yield takeLatest(getLog.type, GetLogDetail);
}

// config

export function* GetSyncConfig() {
  yield takeLatest(getSyncConfig.type, GetSyncConfigDetail);
}

export function* PostSyncConfig() {
  yield takeLatest(postSyncConfig.type, PostSyncConfigDetail);
}

export function* UpdateSyncConfig() {
  yield takeLatest(updateSyncConfig.type, UpdateSyncConfigDetail);
}

// mapping

export function* GetSyncMapping() {
  yield takeLatest(getSyncMapping.type, GetSyncMappingDetail);
}

export function* PostSyncMapping() {
  yield takeLatest(postSyncMapping.type, PostSyncMappingDetail);
}

export function* PostSyncMappingSuper() {
  yield takeLatest(postSyncMappingSuper.type, PostSyncMappingSuperDetail);
}
