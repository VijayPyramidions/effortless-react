import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  organizationSettings: {},
  organizationSettingsAction: '',
};

export const SettingsSlice = createSlice({
  name: 'Settings',
  initialState,
  reducers: {
    getOrganizationSettings: (state) => {
      return state;
    },
    setOrganizationSettings: (state, action) => {
      state.organizationSettings = action?.payload;
    },

    patchOrganizationSettings: (state) => {
      return state;
    },

    setOrganizationSettingsAction: (state, action) => {
      state.organizationSettingsAction = action?.payload;
    },
    clearOrganizationSettingsAction: (state) => {
      state.organizationSettingsAction = '';
    },
  },
});

export const {
  getOrganizationSettings,
  setOrganizationSettings,

  patchOrganizationSettings,

  setOrganizationSettingsAction,
  clearOrganizationSettingsAction,
} = SettingsSlice.actions;

export default SettingsSlice.reducer;
