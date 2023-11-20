import { takeLatest } from 'redux-saga/effects';

import {
  getOrganizationSettings,
  patchOrganizationSettings,
} from '@action/Store/Reducers/Settings/SettingsState';

import {
  GetOrganizationSettingsDetails,
  PatchOrganizationSettingsDetails,
} from './SettingsWorkers';

export function* GetOrganizationSettings() {
  yield takeLatest(
    getOrganizationSettings.type,
    GetOrganizationSettingsDetails
  );
}

export function* PatchOrganizationSettings() {
  yield takeLatest(
    patchOrganizationSettings.type,
    PatchOrganizationSettingsDetails
  );
}
