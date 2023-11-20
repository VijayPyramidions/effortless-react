import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  EWayBillState: {},
  EWayBillStateAppSidePanel: {},
  EWayBillDataLoad: null,
  EWayBillUpdateDataLoad: null,
};

export const EWayBillSlice = createSlice({
  name: 'EWayBill',
  initialState,
  reducers: {
    GetEWayBillState: (state) => {
      return { ...state, EWayBillDataLoad: null };
    },
    PostEWayBillState: (state) => {
      return { ...state, EWayBillDataLoad: null };
    },
    SetStateGetEWayBill: (state, action) => {
      state.EWayBillState = action.payload;
      state.EWayBillDataLoad = 'dataLoad';
      state.EWayBillUpdateDataLoad = null;
      state.EWayBillStateAppSidePanel = action.payload;
    },
    ClearStateGetEWayBill: (state) => {
      state.EWayBillState = {};
    },
    PatchEWayBillState: (state) => {
      return state;
    },
    DeleteEWayBillState: (state) => {
      return state;
    },
    SetStatePatchEWayBill: (state, action) => {
      state.EWayBillUpdateDataLoad = action?.payload;
    },
  },
});

export const {
  GetEWayBillState,
  SetStateGetEWayBill,
  ClearStateGetEWayBill,
  PatchEWayBillState,
  SetStatePatchEWayBill,
  PostEWayBillState,
  DeleteEWayBillState,
} = EWayBillSlice.actions;

export default EWayBillSlice.reducer;
