import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataLoad: { departments: true },
  departments: [],
  oneDepartment: {},
  managerDetails: [],

  departmentsAction: '',
};

export const DepartmentSlice = createSlice({
  name: 'TeamSettingDepartment',
  initialState,
  reducers: {
    getDepartment: (state) => {
      state.dataLoad.departments = true;
    },
    setDepartment: (state, { payload }) => {
      state.departments = payload;
      state.dataLoad.departments = false;
    },

    getOneDepartment: (state) => state,
    setOneDepartment: (state, { payload }) => {
      state.oneDepartment = payload;
    },

    postDepartment: (state) => state,
    updateDepartment: (state) => state,
    deleteDepartment: (state) => state,

    getManager: (state) => state,
    setManager: (state, { payload }) => {
      state.managerDetails = payload;
    },

    setDepartmentAction: (state, action) => {
      state.departmentsAction = action?.payload;
    },
    clearDepartmentAction: (state) => {
      state.departmentsAction = '';
    },
  },
});

export const {
  getDepartment,
  setDepartment,
  getOneDepartment,
  setOneDepartment,
  postDepartment,
  updateDepartment,
  deleteDepartment,
  getManager,
  setManager,

  setDepartmentAction,
  clearDepartmentAction,
} = DepartmentSlice.actions;

export default DepartmentSlice.reducer;
