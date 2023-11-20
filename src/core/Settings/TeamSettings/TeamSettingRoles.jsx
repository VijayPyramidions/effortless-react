import React, { useEffect, useState, useContext, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  getOrganizationSettings,
  clearOrganizationSettingsAction,
} from '@action/Store/Reducers/Settings/SettingsState';
import { clearDepartmentAction } from '@action/Store/Reducers/Settings/TeamSettingDepartmentState';

import ReceivablesPopOver from '@core/Receivables/Components/ReceivablesPopover';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Dialog } from '@material-ui/core';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';

import AppContext from '@root/AppContext';
import RestApi, { METHOD } from '@services/RestApi';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import CreateUser from '@components/CreateNew/TeamNew/TeamBottomSheet';

import ViewRoles from './ViewRoles';
import Department from './Department';
import AddNewDepartment from './AddNewDepartment';
// import CreateUser from './CreateUser';

import * as css from './teamSettings.scss';
import EditIcon from '../../../assets/editicon.svg';
import DeleteIcon from '../../../assets/deleteicon.svg';
import EditIconDisable from '../../../assets/disableedit.svg';
import DeleteIconDisable from '../../../assets/disabledelete.svg';
import upload_department from '../../../assets/upload_department.svg';

// const data = [
//   { name: 'KirthiVaasan', role: 'Admin Permissions', rolid: 1, disable: true },
//   {
//     name: 'Somasundaram P.',
//     role: 'Manager Permissions',
//     rolid: 2,
//     disable: true,
//   },
//   {
//     name: 'Sateeshwaran K.S.',
//     role: 'Custom Permissions',
//     rolid: 3,
//     disable: false,
//   },
// ];

const TeamSettingRoles = () => {
  const { organization, user, openSnackBar, enableLoading, userPermissions } =
    useContext(AppContext);

  const navigate = useNavigate();
  const { state } = useLocation();

  const dispatch = useDispatch();
  const { organizationSettings, organizationSettingsAction } = useSelector(
    (value) => value.Settings
  );
  const { departmentsAction } = useSelector(
    (value) => value.TeamSettingDepartment
  );

  const [Tab, setTabs] = useState(state?.selectedTab || 'tab1');
  const [TableHeaders, setTableHeaders] = useState({
    headerone: 'User Name',
    headertwo: 'Roles',
  });
  const [tableData, setTableData] = useState([]);
  const [row, setrow] = useState({});
  const [showDrawerRoll, setshowDrawerRoll] = useState(false);
  const [showDrawerUser, setshowDrawerUser] = useState(false);
  const [drawer, setDrawer] = useState({ deletePopup: false, id_s: '' });

  const [userRolesSettings, setUserRolesSettings] = useState({});
  const [userRolesPeople, setUserRolesPeople] = useState({});
  const [havePermission, setHavePermission] = useState({ open: false });
  const [enableDep, setEnableDep] = useState(false);
  const [actionDepartment, setActionDepartment] = useState(false);

  useEffect(() => {
    if (Object.keys(userPermissions?.Settings || {})?.length > 0) {
      if (!userPermissions?.Settings?.Settings) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRolesSettings({ ...userPermissions?.Settings });
      setUserRolesPeople({ ...userPermissions?.People });
    }
  }, [userPermissions]);

  useEffect(() => {
    if (
      Object.keys(userRolesSettings?.['Team Settings'] || {})?.length > 0 &&
      !userRolesSettings?.['Team Settings']?.view_team_settings
    ) {
      setHavePermission({
        open: true,
        back: () => {
          navigate('/settings');
          setHavePermission({ open: false });
        },
      });
    }
  }, [userRolesSettings?.['Team Settings']]);

  const TabChange = (val) => {
    setTabs(val);
    if (val === 'tab2')
      setTableHeaders({
        ...TableHeaders,
        headerone: 'Role Name',
        headertwo: 'Description',
      });
    else
      setTableHeaders({
        ...TableHeaders,
        headerone: 'User Name',
        headertwo: 'Roles',
      });
  };

  const RoleView = (rowval) => {
    if (!userRolesPeople?.Employees?.view_employees) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    setshowDrawerRoll(true);
    setrow(rowval);
  };

  const RoleEdit = (path, props) => {
    if (!userRolesPeople?.Employees?.edit_employees) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    navigate(path, props);
  };

  const FetchData = (searchVal) => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/members?search=${searchVal || ''}`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      }
    )
      .then((res) => {
        enableLoading(false);
        if (!res?.error) {
          setTableData(res.data?.filter((fill) => fill?.active));
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
          setTableData(res.data);
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

  const DeleteRole = (id_s) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/roles/${id_s}`, {
      method: METHOD.DELETE,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (!res?.error) {
          openSnackBar({
            message: 'Role Deleted Successfully',
            type: MESSAGE_TYPE.INFO,
          });
          setDrawer((prev) => ({ ...prev, deletePopup: false, id_s: '' }));
          FetchRoleData();
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

  useEffect(() => {
    if (Tab === 'tab1') {
      FetchData();
    } else if (Tab === 'tab2') {
      FetchRoleData();
    }
  }, [Tab]);
  const CreateNewUser = () => {
    if (!userRolesPeople?.Employees?.create_employees) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    setshowDrawerUser(true);
  };
  const CreateNewRole = () => {
    if (!userRolesSettings['Team Settings'].create_team_settings) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    navigate('/settings-teamSettings-Role', {
      state: { type: 'new', from: 'roles', selectedTab: Tab },
    });
  };

  const EditRole = (val) => {
    if (!userRolesSettings['Team Settings'].edit_team_settings) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    navigate('/settings-teamSettings-Role', {
      state: {
        type: 'edit',
        id_s: val?.id,
        name: val?.name,
        from: 'roles',
        selectedTab: Tab,
      },
    });
  };

  const CloneRole = (val) => {
    if (!userRolesSettings['Team Settings'].create_team_settings) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    navigate('/settings-teamSettings-Role', {
      state: {
        type: 'clone',
        id_s: val?.id,
        name: val?.name,
        from: 'roles',
        selectedTab: Tab,
      },
    });
  };

  const DeleteRoleAccess = (val) => {
    if (!userRolesSettings['Team Settings'].delete_team_settings) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    setDrawer((prev) => ({
      ...prev,
      deletePopup: true,
      id_s: val?.id,
    }));
  };

  useEffect(() => {
    if (Object.keys(organizationSettings || {})?.length > 0) {
      setEnableDep(organizationSettings?.enable_department);
    }
  }, [JSON.stringify(organizationSettings)]);

  useEffect(() => {
    dispatch(getOrganizationSettings());
  }, []);

  useEffect(() => {
    if (organizationSettingsAction === 'organizationUpdated') {
      dispatch(getOrganizationSettings());
      dispatch(clearOrganizationSettingsAction());
    }
  }, [organizationSettingsAction]);

  useEffect(() => {
    if (departmentsAction === 'departmentAdded') {
      setActionDepartment(false);
      dispatch(clearDepartmentAction());
    }
  }, [departmentsAction]);

  return (
    <>
      <Box className={css.rolescontainer}>
        <Stack className={css.tabs}>
          <Button
            sx={{
              background:
                Tab === 'tab1'
                  ? '#ffffff'
                  : 'linear-gradient(0deg, #f08b3233, #f08b3233), #FFFFFF',
            }}
            onClick={() => TabChange('tab1')}
            className={css.tab1}
          >
            User List
          </Button>
          <Button
            onClick={() => TabChange('tab2')}
            sx={{
              background:
                Tab === 'tab2'
                  ? '#ffffff'
                  : 'linear-gradient(0deg, #f08b3233, #f08b3233), #FFFFFF',
            }}
            className={css.tab2}
          >
            Roles
          </Button>
          <Button
            onClick={() => TabChange('tab3')}
            sx={{
              background:
                Tab === 'tab3'
                  ? '#ffffff'
                  : 'linear-gradient(0deg, #f08b3233, #f08b3233), #FFFFFF',
            }}
            className={css.tab2}
          >
            Department
          </Button>
          {Tab === 'tab1' && (
            <Button
              className={css.createuserbtn}
              onClick={() => CreateNewUser()}
            >
              Create New User
            </Button>
          )}
          {Tab === 'tab2' && (
            <Button
              onClick={() => CreateNewRole()}
              className={css.creatrolebtn}
            >
              Create New Role
            </Button>
          )}
          {Tab === 'tab3' && enableDep && (
            <Stack alignItems="center" direction="row" gap="12px" ml="auto">
              <Button
                onClick={() => setActionDepartment(true)}
                className={css.creatrolebtn}
              >
                Create Department
              </Button>
              <Button
                onClick={() =>
                  navigate(`/invoice-upload`, {
                    state: {
                      from: 'teamsettings',
                    },
                  })
                }
                className={css.uploaddepbtn}
                startIcon={<img src={upload_department} alt="upload" />}
                disabled
              >
                Upload
              </Button>
            </Stack>
          )}
        </Stack>
        {Tab === 'tab3' ? (
          <Department enableDep={enableDep} setEnableDep={setEnableDep} />
        ) : (
          <TableContainer component={Paper} className={css.tablecontainer}>
            <Table className={css.table} stickyHeader>
              <TableHead>
                <TableRow className={css.tablerow}>
                  <TableCell className={`${css.bordernone} ${css.tablehead}`}>
                    {TableHeaders.headerone}
                  </TableCell>
                  <TableCell className={`${css.bordernone} ${css.tablehead}`}>
                    {TableHeaders.headertwo}
                  </TableCell>
                  <TableCell
                    className={`${css.bordernone} ${css.tablehead}`}
                    align={Tab === 'tab2' ? 'center' : ''}
                    sx={Tab === 'tab2' && { width: 354 }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={css.tbody}>
                {tableData?.map((val) => (
                  <TableRow className={css.tablerow} key={val.rolid}>
                    <TableCell
                      className={
                        Tab === 'tab1'
                          ? `${css.bordernone} ${css.tablecell}`
                          : `${css.bordernone} ${css.tablecell} ${css.tab_500}`
                      }
                    >
                      <Stack className={css.initalwrapp}>
                        {Tab === 'tab1' && (
                          <span className={css.inital}>
                            {val?.name?.charAt(0).toLocaleUpperCase()}
                          </span>
                        )}
                        {val?.name}
                      </Stack>
                    </TableCell>
                    <TableCell
                      className={
                        Tab === 'tab1'
                          ? `${css.bordernone} ${css.tablecell}`
                          : `${css.bordernone} ${css.tablecell} ${css.tab_500}`
                      }
                    >
                      {Tab === 'tab1' ? val?.role : val?.description}
                    </TableCell>
                    <TableCell
                      className={`${css.bordernone} ${css.tablecell}`}
                      align={Tab === 'tab2' ? 'center' : ''}
                    >
                      {Tab === 'tab1' ? (
                        <Button
                          className={css.roleviewbtn}
                          onClick={() => RoleView(val)}
                        >
                          View
                        </Button>
                      ) : (
                        <ButtonGroup className={css.btngroup}>
                          <Button
                            className={
                              val.default_role ? css.disabledit : css.editbtn
                            }
                            disabled={val.default_role}
                            onClick={() => EditRole(val)}
                          >
                            <IconButton>
                              <img
                                src={
                                  val.default_role ? EditIconDisable : EditIcon
                                }
                                alt="edit icon"
                              />
                            </IconButton>
                            Edit
                          </Button>
                          <Button
                            className={css.clonebtn}
                            onClick={() => CloneRole(val)}
                          >
                            Clone
                          </Button>
                          <Button
                            className={
                              val.default_role
                                ? css.disabledelete
                                : css.deletebtn
                            }
                            disabled={val.default_role}
                            onClick={() => DeleteRoleAccess(val)}
                          >
                            <IconButton>
                              <img
                                src={
                                  val.default_role
                                    ? DeleteIconDisable
                                    : DeleteIcon
                                }
                                alt="delete icon"
                              />
                            </IconButton>
                            Delete
                          </Button>
                        </ButtonGroup>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* View Roles and Edit Role  Modal */}

      <SelectBottomSheet
        open={showDrawerRoll}
        onClose={() => setshowDrawerRoll(false)}
        triggerComponent={<></>}
      >
        <ViewRoles memberData={row} EditPermission={RoleEdit} />
      </SelectBottomSheet>

      {/* Create User Modal */}

      <SelectBottomSheet
        open={showDrawerUser}
        onClose={() => setshowDrawerUser(false)}
        triggerComponent={<></>}
      >
        <CreateUser
          handleBottomSheetClose={() => setshowDrawerUser(false)}
          listCall={FetchData}
          sheetType="new"
        />
      </SelectBottomSheet>
      <ReceivablesPopOver
        open={drawer.deletePopup}
        handleClose={() =>
          setDrawer((prev) => ({ ...prev, deletePopup: false, id_s: '' }))
        }
        position="center"
      >
        <div className={css.deleteRole}>
          <p className={css.deleteRoleHead}>Deleted Role</p>
          <p className={css.deleteRoleText}>
            By deleting this role, you are reverting NUMBER Users Roles back to
            Employee. Would you like to proceed?
          </p>

          {/* </ul> */}
          <div className={css.deleteFooter}>
            <Button
              className={css.secondary}
              sx={{ padding: '10px 50px !important' }}
              onClick={() =>
                setDrawer((prev) => ({ ...prev, deletePopup: false, id_s: '' }))
              }
            >
              No
            </Button>
            <Button
              className={`${css.primary}`}
              sx={{ padding: '10px 50px !important' }}
              onClick={() => {
                DeleteRole(drawer?.id_s);
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </ReceivablesPopOver>

      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
      <Dialog
        open={actionDepartment}
        onClose={() => setActionDepartment(false)}
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
    </>
  );
};

export default memo(TeamSettingRoles);
