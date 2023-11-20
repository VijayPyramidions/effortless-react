import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  EstimateName: ''
};

export const AdditionalInvoiceSettingsSlice = createSlice({
  name: 'AdditionalInvoiceSettings',
  initialState,
  reducers: {
    GetEstimateNameState: (state) => {
      return { ...state,EstimateName: ''};
    },
    PatchEstimateNameState: (state) => {
      return state;
    },
    SetEstimateNameState: (state,action) => {
      state.EstimateName = action.payload;
    }
  },
});

export const {
  GetEstimateNameState,
  PatchEstimateNameState,
  SetEstimateNameState,
} = AdditionalInvoiceSettingsSlice.actions;

export default AdditionalInvoiceSettingsSlice.reducer;