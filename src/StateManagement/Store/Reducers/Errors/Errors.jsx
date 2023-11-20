import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  message: '',
  type: '',
  loading: { open: false, loadingText: '' },
};

export const ErrorSlice = createSlice({
  name: 'Errors',
  initialState,
  reducers: {
    openSnackbar: (state, { payload }) => {
      state.open = true;
      state.message = payload.message;
      state.type = payload.type;
    },
    closeSnackbar: (state) => {
      state.open = false;
      state.message = '';
      state.type = '';
    },

    enableLoading: (state, { payload }) => {
      if (typeof payload === 'object') {
        state.loading.loadingText = payload.msg;
        state.loading.open = payload.open;
      } else state.loading.open = payload;
    },
  },
});

export const { openSnackbar, closeSnackbar, enableLoading } =
  ErrorSlice.actions;

export default ErrorSlice.reducer;
