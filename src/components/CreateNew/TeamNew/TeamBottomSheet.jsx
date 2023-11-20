import React, { useState, useEffect, useContext } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { getOrganizationSettings } from '@action/Store/Reducers/Settings/SettingsState';
import {
  getDepartment,
  getManager,
  clearDepartmentAction,
} from '@action/Store/Reducers/Settings/TeamSettingDepartmentState';

import Input, { MobileNumberFormatCustom } from '@components/Input/Input.jsx';

import { SelectFieldExpense } from '@components/Select/Select';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';

import {
  Stack,
  Box,
  Button,
  IconButton,
  Grid,
  Typography,
} from '@mui/material';

import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

import AppContext from '@root/AppContext.jsx';
import RestApi, { METHOD } from '@services/RestApi.jsx';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer.jsx';
import {
  validateEmail,
  validatePhone,
  validateRequired,
  // validateIfsc,
} from '@services/Validation.jsx';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';
import { makeStyles, Popover, Dialog } from '@material-ui/core';
import * as themes from '@root/theme.scss';
import editIcon from '@assets/editYourBills.png';
import * as css from './TeamBottomSheet.scss';
import AddNewDepartment, {
  DepartmentShowList,
} from '../../../core/Settings/TeamSettings/AddNewDepartment';

const useStyles = makeStyles(() => ({
  chips: {
    margin: '0 5px',
    '& .MuiChip-root': {
      background: 'white',
      border: '1px solid #f0f0f0',
      flexDirection: 'row !important',
    },
    '& .MuiChip-icon': {
      marginRight: '5px',
      marginLeft: '5px',
    },
  },
  searchInput: {
    margin: '0 20px',
    padding: '5px 10px 0 0',
    '& .MuiTextField-root': {
      paddingLeft: '8px',
      marginBottom: '8px',
      border: '1px solid rgb(180 175 174)',
    },
    '& .MuiInput-root': {
      height: '56px !important',
    },
  },
  checkbox: {
    padding: 0,
    paddingTop: 4,
    '& .MuiSvgIcon-root': {
      fontSize: '2.4rem',
      fill: 'transparent',
    },
  },
  selectedchips: {
    minWidth: '80px',
    margin: '0 6px 0 0',
    background: '#fdf1e6',
    color: themes.colorPrimaryButton,
    borderColor: themes.colorPrimaryButton,
  },
  root: {
    background: '#FFF',
    // border: '0.7px solid',
    borderColor: themes.colorInputBorder,
    borderRadius: '8px',
    margin: '0px !important',
    '& .MuiInputLabel-root': {
      margin: '0px',
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiInput-root': {
      marginTop: '24px',
    },
    '& .MuiInput-multiline': {
      paddingTop: '10px',
    },
    '& .MuiSelect-icon': {
      color: `${themes.colorInputLabel} !important`,
    },
    '& .MuiSelect-select': {
      borderColor: themes.colorInputBorder,
    },
    '& .MuiInputBase-adornedEnd .MuiSvgIcon-root': {
      marginTop: '-10px',
    },
  },
}));

const intialState = {
  firstName: '',
  // lastName: '',
  email: '',
  phone: '',
  role: '',
  bank_account_number: '',
  bank_ifsc_code: '',
  bank_name: '',
  bank_branch_name: '',
  account_holder_name: '',
};
const VALIDATION = {
  firstName: {
    errMsg: 'Please Provide Member Name',
    test: (v) => validateRequired(v),
  },
  // lastName: {
  //   errMsg: 'Please provide last name',
  //   test: (v) => validateRequired(v),
  // },

  email: {
    errMsg: 'Please Provide Valid Email Id',
    test: validateEmail,
  },
  phone: {
    errMsg: 'Please Provide Valid Mobile number',
    test: validatePhone,
  },
  role: {
    errMsg: 'Please Select Role',
    test: (v) => validateRequired(v),
  },
  // bank_account_number: {
  //   errMsg: 'Enter valid Account Number',
  //   test: validateRequired,
  // },
  // bank_ifsc_code: {
  //   errMsg: 'Enter valid IFSC Code',
  //   test: validateIfsc,
  // },
  // bank_name: {
  //   errMsg: 'Enter valid Bank Name',
  //   test: validateRequired,
  // },
  // bank_branch_name: {
  //   errMsg: 'Enter valid Bank Branch Name',
  //   test: validateRequired,
  // },
  // account_holder_name: {
  //   errMsg: 'Enter valid Bank holder name',
  //   test: validateRequired,
  // },
  department: {
    errMsg: 'Please Select Department',
    test: () => true,
  },
  manager: {
    errMsg: 'Please Select Manager',
    test: () =>true,
  },
  // hod: {
  //   errMsg: 'Please Select HOD',
  //   test: (v) => validateRequired(v),
  // },
};

const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
  [k]: false,
}));

const TeamBottomSheet = (props) => {
  const {
    sheetType,
    showData,
    deactivate,
    handleBottomSheetClose,
    editClick,
    listCall,
  } = props;
  const classes = useStyles();
  const {
    organization,
    user,
    enableLoading,
    openSnackBar,
    currentUserInfo,
    getCurrentUser,
    validateSession,
    // loading,
    userPermissions,
  } = useContext(AppContext);

  const dispatch = useDispatch();
  const { organizationSettings } = useSelector((value) => value.Settings);
  const { managerDetails, departments } = useSelector(
    (value) => value.TeamSettingDepartment
  );

  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [viewSheet, setViewSheet] = useState({
    view: false,
    edit: false,
    new: false,
  });
  const [mainState, setMainState] = useState(intialState);
  const [userRoles, setUserRoles] = useState({});
  const [havePermission, setHavePermission] = useState({ open: false });
  const [RoleList, setRoleList] = useState([]);
  const [permission, setPermission] = useState(false);

  const handleIfscKeyPress = (event) => {
    const key = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    if (!/^[a-zA-Z0-9\b]+$/.test(key)) {
      event.preventDefault();
    }
  };

  const FetchRoleData = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/roles`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (!res?.error) {
          res?.data?.map((val) =>
            setRoleList((prev) => [...prev, { name: val?.name, id: val?.id }])
          );
        } else {
          openSnackBar({
            message: res?.message || 'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message: res?.message || 'Unknown Error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const device = localStorage.getItem('device_detect');

  const fetchMemberDetails = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/members/${showData?.user_id}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        if (res && !res.error) {
          setMainState(s=>({
            ...s,
            firstName: res?.name,
            phone: res?.mobile_number,
            email: res?.email || res?.contact_email,
            role: res?.role_id,
            // department: res?.department_memberships[0]?.department?.id,
            // manager: res?.department_memberships[0]?.manager_id,
            // hod: res?.department_memberships[0]?.department?.manager_id,
            id: res?.id || undefined,
          }));
          enableLoading(false);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  const CreateMember = () => {
    let payloadParam = {
      name: mainState.firstName,
      email: mainState.email,
      mobile_number: mainState.phone,
      // role: mainState?.role,
      role_id: mainState?.role,
      id: mainState?.id || undefined,
      bank_account_number: mainState?.bank_account_number,
      bank_ifsc_code: mainState?.bank_ifsc_code,
      bank_name: mainState?.bank_name,
      bank_branch_name: mainState?.bank_branch_name,
      account_holder_name: mainState?.account_holder_name,
    };

    if (permission) {
      payloadParam = {
        ...payloadParam,
        department: {
          id: mainState?.department,
          manager_id: mainState?.manager,
        },
      };
    }
    RestApi(
      mainState?.id
        ? `organizations/${organization.orgId}/members/${mainState?.id}`
        : `organizations/${organization.orgId}/members`,
      {
        method: mainState?.id ? METHOD.PATCH : METHOD.POST,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: payloadParam,
      }
    )
      .then(async (res) => {
        if (res && res.error) {
          openSnackBar({
            message:
              (res?.errors && Object.values(res?.errors).join()) ||
              res?.message ||
              'Unknown Error Occured',
            type: MESSAGE_TYPE.ERROR,
          });
        } else if (res && !res.error) {
          const organizationProps = JSON.parse(
            localStorage.getItem('selected_organization')
          );

          if (currentUserInfo?.id === res?.id) {
            if (organizationProps) {
              await validateSession(user?.activeToken, organizationProps);
            }
            await getCurrentUser(organization.orgId);
          }
          handleBottomSheetClose();
          setMainState(intialState);
          // setDrawer((prev) => ({ ...prev, teamDrawer: false }));
          listCall();
          setTimeout(() => {
            openSnackBar({
              message:
                res?.message || mainState?.id
                  ? 'Member Details Edited Successfully'
                  : 'Member Added Successfully',
              type: MESSAGE_TYPE.INFO,
            });
          }, 500);
        }
      })
      .catch((res) => {
        openSnackBar({
          message: res?.message,
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const getBankDetails = (code) => {
    enableLoading(true);
    RestApi(`ifsc?ifsc=${code}`, {
      method: METHOD.GET,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (res && !res.error) {
          const { BANK: bank_name, BRANCH: bank_branch_name } = res;
          setMainState((s) => ({
            ...s,
            bank_name,
            bank_branch_name,
          }));
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  // eslint-disable-next-line consistent-return
  const getHeight = () => {
    if (device === 'mobile') {
      return 'auto !important';
    }
    if (viewSheet?.view) {
      return 'calc(100vh - 80px) !important';
    }
    if (viewSheet?.edit) {
      return 'calc(100vh - 220px) !important';
    }
    if (viewSheet?.new) {
      return 'calc(100vh - 158px) !important';
    }
  };

  const fetchAllBank = () => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/vendors/${
        showData?.entity_id || showData?.id
      }/bank_details`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        if (res && !res.error) {
          const tempBank = res?.data;
          if (tempBank?.length > 0) {
            setMainState((prev) => ({
              ...prev,
              bank_account_number: tempBank?.[0]?.bank_account_number,
              bank_ifsc_code: tempBank?.[0]?.bank_ifsc_code,
              bank_name: tempBank?.[0]?.bank_name,
              bank_branch_name: tempBank?.[0]?.bank_branch_name,
              account_holder_name: tempBank?.[0]?.account_holder_name,
            }));
          } else if (tempBank?.length === 0) {
            setMainState((prev) => ({
              ...prev,
              bank_account_number: '',
              bank_ifsc_code: '',
              bank_name: '',
              bank_branch_name: '',
              account_holder_name: '',
            }));
          }
          enableLoading(false);
        }
      })
      .catch(() => {
        enableLoading(false);
      });
  };

  useEffect(() => {
    FetchRoleData();
    dispatch(getOrganizationSettings());
  }, []);

  useEffect(() => {
    if (Object.keys(userPermissions?.People || {})?.length > 0) {
      setUserRoles({ ...userPermissions?.People });
    }
  }, [userPermissions]);

  useEffect(() => {
    if (Object.keys(organizationSettings || {})?.length > 0) {
      setPermission(organizationSettings?.enable_department);
    }
  }, [JSON.stringify(organizationSettings)]);

  useEffect(() => {
    if (permission) {
      dispatch(getDepartment());
      dispatch(getManager());
    }
  }, [permission]);

  useEffect(() => {
    setViewSheet((prev) => ({ ...prev, [sheetType]: true }));
  }, [sheetType]);

  useEffect(() => {
    if (sheetType === 'edit' || sheetType === 'view') {
      fetchMemberDetails();
      if (showData?.bank_detail) {
        fetchAllBank();
      }
    }
  }, [showData]);

  const validateAllFields = (stateParam) => {
    const stateData = stateParam || mainState;
    if (permission) {
      return Object.keys(VALIDATION).reduce((a, v) => {
        const paramValue = a;
        paramValue[v] = !VALIDATION?.[v]?.test(stateData[v]);
        return paramValue;
      }, {});
    }
    const { department, manager, ...TEMP_VALIDATION } = VALIDATION;
    return Object.keys(TEMP_VALIDATION).reduce((a, v) => {
      const paramValue = a;
      paramValue[v] = !VALIDATION?.[v]?.test(stateData[v]);
      return paramValue;
    }, {});
  };
  const closePopover = () => {
    const v = validateAllFields();
    const valid = Object.values(v).every((val) => !val);
    if (!valid) {
      setValidationErr((s) => ({ ...s, ...v }));
      return;
    }
    CreateMember();
    // setShowDrawer(false);
    // setPopover(true);
  };
  const reValidate = (name, value) => {
    if (
      (name === 'phone' && value?.toString().length > 0) ||
      name !== 'phone'
    ) {
      setValidationErr((v) => ({
        ...v,
        [name]: !VALIDATION?.[name]?.test?.(value),
      }));
    }
  };
  const onInputChange = (e, param) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    reValidate(name, value);
    setMainState((s) => ({
      ...s,
      [name]: name === 'bank_ifsc_code' ? value?.toUpperCase() : value,
    }));
    if (name === 'bank_ifsc_code' && value.length === 11) {
      getBankDetails(value);
    }
    if (name === 'department') {
      setMainState((s) => ({
        ...s,
        hod: param?.department_manager_id,
      }));
    }
  };

  const EditEmployee = () => {
    if (!userRoles?.Employees?.edit_employees) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    setViewSheet({
      new: false,
      view: false,
      edit: true,
    });
    if (device === 'mobile') {
      editClick();
    }
  };

  const DeleteEmployee = () => {
    if (!userRoles?.Employees?.delete_employees) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    deactivate();
  };

  return (
    <>
      <div style={{ padding: '20px 30px 0' }} className={css.memberAddSheet}>
        {(device === 'desktop' || viewSheet?.view || viewSheet?.new) && (
          <div className={css.topHeader}>
            <div className={css.headerContainer}>
              <p className={css.headerLabelForEdit}>
                {viewSheet?.edit && 'Edit'}
                {viewSheet?.view && mainState?.firstName}
                {viewSheet?.new && 'Add a New Employee'}
              </p>
            </div>
            {viewSheet?.view && (
              <IconButton
                onClick={() => {
                  EditEmployee();
                }}
              >
                <img src={editIcon} style={{ width: 25 }} alt="editYourBills" />
              </IconButton>
            )}
          </div>
        )}
        <Stack
          sx={{
            height: getHeight(),
            overflow: 'auto',
          }}
          gap="20px"
        >
          <div className={css.inputContain}>
            <Input
              required
              className={`${css.greyBorder} ${classes.root}`}
              label="Employee Name"
              variant="standard"
              name="firstName"
              onChange={!viewSheet?.view && onInputChange}
              value={mainState.firstName}
              onBlur={reValidate}
              error={validationErr.firstName}
              helperText={
                validationErr.firstName ? VALIDATION?.firstName?.errMsg : ''
              }
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              disabled={viewSheet?.view}
            />
          </div>
          <div className={css.inputContain}>
            <Input
              required
              onChange={!viewSheet?.view && onInputChange}
              value={mainState.phone}
              name="phone"
              onBlur={reValidate}
              error={validationErr.phone}
              helperText={validationErr.phone ? VALIDATION?.phone?.errMsg : ''}
              className={`${css.greyBorder} ${classes.root}`}
              label="Phone No"
              variant="standard"
              // value={state.gst}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputComponent: MobileNumberFormatCustom,
              }}
              inputProps={{
                type: 'tel',
              }}
              fullWidth
              theme="light"
              disabled={viewSheet?.view}
            />
          </div>
          <div className={css.inputContain}>
            <Input
              required
              onChange={!viewSheet?.view && onInputChange}
              value={mainState.email}
              name="email"
              onBlur={reValidate}
              error={validationErr.email}
              helperText={validationErr.email ? VALIDATION?.email?.errMsg : ''}
              className={`${css.greyBorder} ${classes.root}`}
              label="Email Id"
              variant="standard"
              // value={state.gst}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              theme="light"
              disabled={viewSheet?.view}
            />
          </div>

          {!permission && (
            <Box>
              <SelectFieldExpense
                label="Select Role"
                name="role"
                onBlur={reValidate}
                error={validationErr.role}
                helperText={validationErr?.role ? VALIDATION?.role?.errMsg : ''}
                defaultValue={mainState.role || ' '}
                required
                options={RoleList}
                onChange={!viewSheet?.view && onInputChange}
                PaperProps={{
                  style: {
                    flexGrow: 1,
                    marginTop: 8,
                    minWidth: device === 'mobile' ? 300 : 346,
                    borderRadius: 8,
                    maxHeight: 224,
                  },
                }}
                MenuItemProps={{
                  color: '#283049',
                  fontFamily: 'Lexend, sans-serif !important',
                  fontSize: '13px',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  borderBottom: '1px solid rgba(199, 199, 199, 0.50)',
                  textTransform: 'capitalize',
                }}
                style={{ marginBottom: '0', textTransform: 'capitalize' }}
                disabled={viewSheet?.view}
              />
            </Box>
          )}

          {permission && (
            <Box className={css.employeemodulecard}>
              <p className={css.bankDetail}>Permissions</p>
              <PermissionEmployee
                reValidate={reValidate}
                validationErr={validationErr}
                mainState={mainState}
                viewSheet={viewSheet}
                onInputChange={onInputChange}
                RoleList={RoleList}
                DepartmentList={departments}
                ManagerList={managerDetails?.data}
                HodList={managerDetails?.data}
              />
            </Box>
          )}

          <Box className={css.employeemodulecard}>
            <p className={css.bankDetail}>Bank Details</p>
            <Grid container>
              <Grid item xs={12}>
                <Input
                  name="bank_account_number"
                  label="Bank Account No."
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  theme="light"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  onBlur={reValidate}
                  error={validationErr.bank_account_number}
                  className={`${css.greyBorderBank} ${classes.root}`}
                  helperText={
                    validationErr.bank_account_number
                      ? VALIDATION?.bank_account_number?.errMsg
                      : ''
                  }
                  onChange={!viewSheet?.view && onInputChange}
                  value={mainState?.bank_account_number}
                  // required
                  disabled={viewSheet?.view}
                  type="number"
                />
              </Grid>

              <Grid item xs={12} mt={2}>
                <Input
                  name="bank_ifsc_code"
                  label="IFSC Code"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  theme="light"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  onBlur={reValidate}
                  error={validationErr.bank_ifsc_code}
                  className={`${css.greyBorderBank} ${classes.root}`}
                  helperText={
                    validationErr.bank_ifsc_code
                      ? VALIDATION?.bank_ifsc_code?.errMsg
                      : ''
                  }
                  onKeyPress={handleIfscKeyPress}
                  onChange={!viewSheet?.view && onInputChange}
                  value={mainState?.bank_ifsc_code}
                  // required
                  disabled={viewSheet?.view}
                />
              </Grid>

              <Grid item xs={12} mt={2}>
                <Input
                  name="bank_name"
                  label="Bank Name"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  theme="light"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  onBlur={reValidate}
                  error={validationErr.bank_name}
                  helperText={
                    validationErr.bank_name ? VALIDATION?.bank_name?.errMsg : ''
                  }
                  onChange={!viewSheet?.view && onInputChange}
                  className={`${css.greyBorderBank} ${classes.root}`}
                  value={mainState?.bank_name}
                  // required
                  disabled={viewSheet?.view}
                />
              </Grid>

              <Grid item xs={12} mt={2}>
                <Input
                  name="bank_branch_name"
                  label="Branch"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  theme="light"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  onBlur={reValidate}
                  error={validationErr.bank_branch_name}
                  className={`${css.greyBorderBank} ${classes.root}`}
                  helperText={
                    validationErr.bank_branch_name
                      ? VALIDATION?.bank_branch_name?.errMsg
                      : ''
                  }
                  onChange={!viewSheet?.view && onInputChange}
                  value={mainState?.bank_branch_name}
                  // required
                  disabled={viewSheet?.view}
                />
              </Grid>

              <Grid item xs={12} mt={2}>
                <Input
                  name="account_holder_name"
                  label="Account Holder's Name"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  theme="light"
                  rootStyle={{
                    border: '1px solid #A0A4AF',
                  }}
                  onBlur={reValidate}
                  error={validationErr.account_holder_name}
                  className={`${css.greyBorderBank} ${classes.root}`}
                  helperText={
                    validationErr.account_holder_name
                      ? VALIDATION?.account_holder_name?.errMsg
                      : ''
                  }
                  onChange={!viewSheet?.view && onInputChange}
                  value={mainState?.account_holder_name}
                  // required
                  disabled={viewSheet?.view}
                />
              </Grid>
            </Grid>
          </Box>
        </Stack>
        {!viewSheet?.view && (
          <>
            <div className={css.lastButton}>
              <Button
                variant="outLined"
                className={css.outlinedButton}
                onClick={() => {
                  handleBottomSheetClose();
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                className={css.containedButton}
                onClick={() => {
                  closePopover();
                }}
              >
                {viewSheet?.edit ? 'Save Member Profile' : 'Save And Continue'}
              </Button>
            </div>
            {viewSheet?.edit && (
              <Button
                variant="contained"
                className={css.deactivateButton}
                onClick={() => {
                  DeleteEmployee();
                }}
              >
                Deactivate Member
              </Button>
            )}
          </>
        )}
      </div>
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default TeamBottomSheet;

const PermissionEmployee = ({
  reValidate,
  validationErr,
  mainState,
  viewSheet,
  onInputChange,
  DepartmentList,
  RoleList,
  ManagerList,
  HodList,
}) => {
  const device = localStorage.getItem('device_detect');

  const dispatch = useDispatch();
  const { departmentsAction } = useSelector(
    (value) => value.TeamSettingDepartment
  );

  const [drawer, setDrawer] = useState({});

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  useEffect(() => {
    if (departmentsAction === 'departmentAdded') {
      handleDrawer('actionDepartment', false);
      dispatch(clearDepartmentAction());
    }
  }, [departmentsAction]);

  return (
    <Stack gap="16px">
      <>
        <Box
          className={
            viewSheet?.view
              ? `${css.departmentfiled} ${css.disableClass}`
              : css.departmentfiled
          }
          onClick={(event) => handleDrawer('managerList', event.currentTarget)}
        >
          <Stack className={css.label}>
            <Typography
              className={css.labeltext}
              style={{ color: validationErr?.department && '#f00' }}
            >
              Select Deprtment
            </Typography>
            <KeyboardArrowDown
              className={css.iconfield}
              sx={{
                transform: Boolean(drawer?.managerList) && 'rotate(180deg)',
              }}
            />
          </Stack>
          <Box sx={{ overflow: 'auto' }}>
            <Typography className={css.departmentvalue}>
              {DepartmentList?.find(
                (value) => value?.id === mainState?.department
              )?.name || ''}
            </Typography>
          </Box>
        </Box>
        {validationErr?.department && (
          <Typography className={css.helperText}>
            {validationErr?.department ? VALIDATION?.department?.errMsg : ''}
          </Typography>
        )}
      </>

      <SelectFieldExpense
        label="Select Role"
        name="role"
        onBlur={reValidate}
        error={validationErr.role}
        helperText={validationErr?.role ? VALIDATION?.role?.errMsg : ''}
        defaultValue={mainState.role || ' '}
        required
        options={RoleList}
        onChange={!viewSheet?.view && onInputChange}
        PaperProps={{
          style: {
            flexGrow: 1,
            marginTop: 8,
            minWidth: device === 'mobile' ? 300 : 346,
            borderRadius: 8,
            maxHeight: 224,
            textTransform: 'capitalize',
          },
        }}
        MenuItemProps={{
          color: '#283049',
          fontFamily: 'Lexend, sans-serif !important',
          fontSize: '13px',
          fontStyle: 'normal',
          fontWeight: '400',
          borderBottom: '1px solid rgba(199, 199, 199, 0.50)',
          textTransform: 'capitalize',
        }}
        style={{ marginBottom: '0', textTransform: 'capitalize' }}
        disabled={viewSheet?.view}
      />
      <SelectFieldExpense
        label="Select Manager"
        name="manager"
        onBlur={reValidate}
        error={validationErr.manager}
        helperText={validationErr?.manager ? VALIDATION?.manager?.errMsg : ''}
        defaultValue={mainState?.manager || ' '}
        // required
        options={ManagerList}
        onChange={!viewSheet?.view && onInputChange}
        PaperProps={{
          style: {
            flexGrow: 1,
            marginTop: 8,
            minWidth: device === 'mobile' ? 300 : 346,
            borderRadius: 8,
            maxHeight: 224,
          },
        }}
        MenuItemProps={{
          color: '#283049',
          fontFamily: 'Lexend, sans-serif !important',
          fontSize: '13px',
          fontStyle: 'normal',
          fontWeight: '400',
          borderBottom: '1px solid rgba(199, 199, 199, 0.50)',
          textTransform: 'capitalize',
        }}
        style={{ marginBottom: '0', textTransform: 'capitalize' }}
        disabled={viewSheet?.view}
      />
      <SelectFieldExpense
        label="HOD"
        name="hod"
        // onBlur={reValidate}
        // error={validationErr.hod}
        // helperText={validationErr?.hod ? VALIDATION?.hod?.errMsg : ''}
        defaultValue={mainState.hod || ' '}
        // required
        options={HodList}
        onChange={!viewSheet?.view && onInputChange}
        PaperProps={{
          style: {
            flexGrow: 1,
            marginTop: 8,
            minWidth: device === 'mobile' ? 300 : 346,
            borderRadius: 8,
            maxHeight: 224,
          },
        }}
        MenuItemProps={{
          color: '#283049',
          fontFamily: 'Lexend, sans-serif !important',
          fontSize: '13px',
          fontStyle: 'normal',
          fontWeight: '400',
          borderBottom: '1px solid rgba(199, 199, 199, 0.50)',
          textTransform: 'capitalize',
        }}
        style={{ marginBottom: '0', textTransform: 'capitalize' }}
        disabled
      />

      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={Boolean(drawer?.managerList) && device === 'desktop'}
        anchorEl={drawer?.managerList}
        onClose={() => handleDrawer('managerList', null)}
        PaperProps={{
          elevation: 3,
          style: {
            minWidth: device === 'mobile' ? 300 : 346,
            borderRadius: 4,
            maxHeight: 224,
            marginTop: 4,
            overflow: 'auto',
          },
        }}
      >
        <DepartmentShowList
          mainState={mainState}
          handleDrawer={handleDrawer}
          DepartmentList={DepartmentList}
          onInputChange={onInputChange}
        />
      </Popover>
      <Dialog
        open={drawer?.actionDepartment && device === 'desktop'}
        onClose={() => handleDrawer('actionDepartment', false)}
        PaperProps={{
          style: {
            width: 460,
            paddingBottom: 20,
            borderRadius: 8,
          },
        }}
      >
        <AddNewDepartment />
      </Dialog>
      <SelectBottomSheet
        open={Boolean(drawer?.managerList) && device === 'mobile'}
        triggerComponent
        onClose={() => handleDrawer('managerList', null)}
        styleDrawerMinHeight="auto"
        id="overFlowHidden"
      >
        <DepartmentShowList
          mainState={mainState}
          handleDrawer={handleDrawer}
          DepartmentList={DepartmentList}
          onInputChange={onInputChange}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        open={Boolean(drawer?.actionDepartment) && device === 'mobile'}
        triggerComponent
        onClose={() => handleDrawer('actionDepartment', null)}
        styleDrawerMinHeight="auto"
      >
        <AddNewDepartment />
      </SelectBottomSheet>
    </Stack>
  );
};
