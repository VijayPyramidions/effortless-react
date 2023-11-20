import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reimbursements: [],
  oneReimbursement: {},
  mileageHistory: [],
  drawer: { expense: false, history: false },
  dataLoad: { reimbursment: null },
};

export const ReimbursementSlice = createSlice({
  name: 'ReimbursementSettings',
  initialState,
  reducers: {
    getReimbursements: (state) => state,
    setReimbursements: (state, { payload }) => {
      state.reimbursements = payload;
      state.dataLoad.reimbursment = 'loaded';
    },
    postReimbursement: (state) => state,
    patchReimbursement: (state) => state,

    getOneReimbursement: (state) => state,
    setOneReimbursement: (state, { payload }) => {
      state.oneReimbursement = payload;
    },

    getMileageHistory: (state) => state,
    setMileageHistory: (state, { payload }) => {
      state.mileageHistory = payload;
    },

    setDrawer: (state, { payload }) => {
      state.drawer[payload.name] = payload.value;
    },
  },
});

export const {
  getReimbursements,
  setReimbursements,
  postReimbursement,
  patchReimbursement,
  getOneReimbursement,
  setOneReimbursement,
  getMileageHistory,
  setMileageHistory,
  setDrawer,
} = ReimbursementSlice.actions;

export default ReimbursementSlice.reducer;
