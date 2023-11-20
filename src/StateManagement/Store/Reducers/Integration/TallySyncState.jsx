import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataLoad: { syncData: true },
  drawer: { logHistory: false },
  syncDetail: null,
  oneSyncDetail: null,
  syncHistory: null,
  syncSummary: null,
  configDetail: null,
  syncMappingDetail: null,
  syncLogDetail: null,
  summaryDetails:null,
};

export const TallySyncSlice = createSlice({
  name: 'TallySync',
  initialState,
  reducers: {
    getSync: (state) => state,
    setSync: (state, { payload }) => {
      state.syncData = payload;
      state.dataLoad.syncData = false;
    },

    getOneSync: (state) => state,
    setOneSync: (state, { payload }) => {
      state.oneSyncDetail = payload;
    },

    setSummaryId:(state,{payload}) => {
      state.summaryDetails = payload;
    },

    postSync: (state) => state,

    getSyncHistory: (state) => state,
    setSyncHistory: (state, { payload }) => {
      state.syncHistory = payload;
    },

    getSyncSummary: (state) => state,
    setSyncSummary: (state, { payload }) => {
      state.syncSummary = payload;
    },

    // sync log

    getLog: (state) => state,
    setLog: (state, { payload }) => {
      state.syncLogDetail = payload;
    },

    // Config

    getSyncConfig: (state) => state,
    setSyncConfig: (state, { payload }) => {
      state.configDetail = payload;
    },

    postSyncConfig: (state) => state,
    updateSyncConfig: (state) => state,

    // mapping

    getSyncMapping: (state) => state,
    setSyncMapping: (state, { payload }) => {
      state.syncMappingDetail = payload;
    },

    postSyncMapping: (state) => state,
    postSyncMappingSuper: (state) => state,

    setDrawer: (state, { payload }) => {
      state.drawer[payload.name] = payload.value;
    },
  },
});

export const {
  getSync,
  setSync,
  getOneSync,
  setOneSync,
  postSync,
  getSyncHistory,
  setSyncHistory,
  getSyncSummary,
  setSyncSummary,
  getLog,
  setLog,
  getSyncConfig,
  setSyncConfig,
  postSyncConfig,
  updateSyncConfig,
  getSyncMapping,
  setSyncMapping,
  postSyncMapping,
  postSyncMappingSuper,
  setDrawer,
  setSummaryId,
} = TallySyncSlice.actions;

export default TallySyncSlice.reducer;
