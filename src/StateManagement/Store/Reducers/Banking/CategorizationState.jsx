import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showLoader: false,
  anothercategorization: false,
  opModal: false,
  alertdisplaymessage: 'false',
  alertwarning: '',
  buttontext1: 'Yes',
  buttontext2: 'No',
  closebutton: false,
  AlertOpen: false,
  buttonInProcess: true,
  categorizationDone: false,
  contraBanks: [],

  dataLoad: null,
};

export const CategorizationSlice = createSlice({
  name: 'Categorization',
  initialState,
  reducers: {
    updateEntity: (state) => state,
    updateLoader: (state, { payload }) => {
      if (payload) state.showLoader = true;
      else state.showLoader = false;
    },
    anotherCategorizationUpdate: (state, { payload }) => {
      state.anothercategorization = payload;
    },
    opModalUpdate: (state, { payload }) => {
      state.opModal = payload;
    },
    alertDisplayMessageUpdate: (state, { payload }) => {
      state.alertdisplaymessage = payload;
    },
    alertWarningUpdate: (state, { payload }) => {
      state.alertwarning = payload;
    },
    buttonText1Update: (state, { payload }) => {
      state.buttontext1 = payload;
    },
    buttonText2Update: (state, { payload }) => {
      state.buttontext2 = payload;
    },
    closeButtonUpdate: (state, { payload }) => {
      state.closebutton = payload;
    },
    alertOpenUpdate: (state, { payload }) => {
      state.AlertOpen = payload;
    },
    buttonInProcessUpdate: (state, { payload }) => {
      state.buttonInProcess = payload;
    },
    categorizationDoneUpdate: (state, { payload }) => {
      state.categorizationDone = payload;
    },
    billSettlement: (state) => state,

    getContraBanks: (state) => state,
    setContraBanks: (state, { payload }) => {
      state.contraBanks = payload;
    },
  },
});

export const {
  updateEntity,
  updateLoader,
  anotherCategorizationUpdate,
  opModalUpdate,
  alertDisplayMessageUpdate,
  alertWarningUpdate,
  buttonText1Update,
  buttonText2Update,
  closeButtonUpdate,
  alertOpenUpdate,
  buttonInProcessUpdate,
  categorizationDoneUpdate,
  billSettlement,

  getContraBanks,
  setContraBanks,
} = CategorizationSlice.actions;

export default CategorizationSlice.reducer;
