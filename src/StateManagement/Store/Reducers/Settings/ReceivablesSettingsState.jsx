import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  remainderData: {},
  receivablesSettingsAction: {},
  remainderDataLoad: null,
};

export const ReceivablesSettingsSlice = createSlice({
  name: 'ReceivablesSettings',
  initialState,
  reducers: {
    GetReceivablesRemainderState: (state) => {
      return {...state, remainderDataLoad: null};
    },
    SetStateReceivablesRemainder: (state, action) => {
      state.remainderData = action.payload;
      state.remainderDataLoad = 'dataLoad';
    },
    ClearStateReceivablesRemainder: (state) => {
      state.remainderData = {};
    },
    PostCreateReceivablesRemainderState: (state) => {
      return state;
    },
    SetStateCreateReceivablesRemainder: (state, action) => {
      state.receivablesSettingsAction = action.payload;
    },
    ClearStateCreateReceivablesRemainder: (state) => {
      state.receivablesSettingsAction = {};
    },
    DeleteReceivablesRemainderState: (state) => {
      return state;
    },
    GetReceivablesDuplicateRemainderState: (state) => {
      return state;
    },
    PatchUpdateReceivablesRemainderState: (state) => {
      return state;
    },
  },
});

export const {
    GetReceivablesRemainderState,
    SetStateReceivablesRemainder,
    ClearStateReceivablesRemainder,
    PostCreateReceivablesRemainderState,
    SetStateCreateReceivablesRemainder,
    ClearStateCreateReceivablesRemainder,
    DeleteReceivablesRemainderState,
    GetReceivablesDuplicateRemainderState,
    PatchUpdateReceivablesRemainderState,
} = ReceivablesSettingsSlice.actions;

export default ReceivablesSettingsSlice.reducer;
