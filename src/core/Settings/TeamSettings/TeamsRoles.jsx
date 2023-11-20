import React, { useState, useContext, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Stack,
  Button,
  Typography,
  IconButton,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  TextField,
  FormControl,
  Select,
  OutlinedInput,
} from '@mui/material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Switch,
  Checkbox,
  MenuItem,
} from '@material-ui/core';
import RestApi, { METHOD } from '@services/RestApi';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';
import { validateRequired } from '@services/Validation.jsx';
import { withStyles } from '@material-ui/core/styles';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AppContext from '@root/AppContext';

import { AccordionState, useStyles } from './util';

import * as css from './teamSettings.scss';

const TextFieldRole = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      border: '1px solid #e5e5e5',
      borderRadius: '4px',
      padding: '10px 12px',
      width: '275px',
      '& fieldset': {
        border: 'none',
      },
      '&:hover fieldset': {
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        border: 'none',
      },
    },
    '& .MuiFormHelperText-root': {
      color: 'red',
      marginLeft: '0px !important',
    },
  },
})(TextField);

const VALIDATOR = {
  roleName: (v) => validateRequired(v),
  roleDescription: (v) => validateRequired(v),
};

const TeamsRoles = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { enableLoading, organization, user, openSnackBar } =
    useContext(AppContext);
  const [AccTab, setAccTab] = useState(AccordionState);
  const [Roles, setRoles] = useState([]);
  const [mainState, setMainState] = React.useState({
    roleName: '',
    roleDescription: '',
  });
  const [validationErr, setValidationErr] = React.useState({
    roleName: false,
    roleDescription: false,
  });
  const [checkState, setCheckState] = React.useState([]);

  const [SelectedRole, setSelectedRole] = React.useState(state?.role);
  const [RoleList, setRoleList] = React.useState([]);

  const [memberDefault, setMemberDefault] = React.useState(false);

  const fillDetails = (perm) => {
    const tempPerm = [];

    perm?.map((val) => {
      if (val?.active) {
        val?.groups.forEach((group) => {
          group.permissions.forEach((permission) => {
            if (permission?.active) {
              tempPerm.push({
                permission_id: permission?.name,
                active: permission?.active,
              });
            }
          });
        });
      }
      return val;
    });

    setCheckState(tempPerm);
  };

  const FetchRolePermission = (id_s) => {
    enableLoading(true);
    RestApi(
      id_s
        ? `organizations/${organization.orgId}/roles/${id_s}/permissions`
        : `organizations/${organization.orgId}/roles/permission_list`,
      {
        method: METHOD.GET,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
      },
    )
      .then((res) => {
        if (!res?.error) {
          setRoles(res.permissions);
          if (state?.type === 'edit') {
            setMainState({
              roleName: res?.name,
              roleDescription: res?.description,
            });
            fillDetails(res?.permissions);
          } else if (state?.type === 'clone') {
            fillDetails(res?.permissions);
          } else if (state?.type === 'member') {
            if (
              res?.name === 'Founder' ||
              res?.name === 'Admin' ||
              res?.name === 'Employee'
            ) {
              setMemberDefault(true);
              setCheckState([]);
            } else {
              setMemberDefault(false);
              fillDetails(res?.permissions);
            }
          }
          if (Object?.keys(AccordionState)?.length > 0) {
            Object?.keys(AccordionState)?.map((val) =>
              setAccTab((prev) => ({
                ...prev,
                [val]: res.permissions?.find((data) => data?.name === val)
                  ?.active,
              })),
            );
          }
        } else {
          openSnackBar({
            message: res?.errors || res?.message || 'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
        enableLoading(false);
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
          res?.data?.map((val) =>
            setRoleList((prev) => [
              ...prev,
              { payload: val?.name, id_s: val?.id },
            ]),
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

  const HandleAcordion = (val) => () => {
    if (AccTab[val]) setAccTab({ ...AccTab, [val]: false });
    else setAccTab({ ...AccTab, [val]: true });
  };

  const checkStateFun = (name) => {
    if (checkState.filter((val) => val?.permission_id === name)?.length > 0) {
      const tempCheckState = checkState;
      tempCheckState.find((ele) => ele?.permission_id === name).active = false;
      setCheckState(tempCheckState);
    }
  };

  const HandleAccessEnable = (e) => {
    const newState = Roles.map((row) => {
      if (row.name === e.target.name)
        return { ...row, active: e.target.checked };
      return row;
    });
    if (!e.target.checked) {
      const tempState = Roles?.find(
        (value) => value?.name === e.target.name,
      )?.groups;
      tempState?.map((element) =>
        element?.permissions?.map((val) => checkStateFun(val?.name)),
      );
      newState
        ?.find((value) => value?.name === e?.target?.name)
        ?.groups?.forEach((group) => {
          group.full_access = group?.full_access === null ? null : false;
          group?.permissions?.forEach((permission) => {
            permission.active = permission?.active === null ? null : false;
          });
        });
    }
    setAccTab((prev) => ({ ...prev, [e?.target?.name]: e?.target?.checked }));
    setRoles(newState);
  };

  const HandlePermissionEnable = (first, second, third, e) => {
    const updatedPermissions = JSON.parse(JSON.stringify(Roles));
    if (updatedPermissions[first]?.active) {
      updatedPermissions[first].groups[second].permissions[third].active =
        e?.target?.checked;
      const temp = updatedPermissions[first].groups[second];
      if (
        temp.permissions.every((data) => data?.active || data?.active === null)
      ) {
        updatedPermissions[first].groups[second].full_access = true;
      } else {
        updatedPermissions[first].groups[second].full_access = false;
      }

      if (
        checkState.filter((val) => val?.permission_id === e?.target?.name)
          ?.length > 0
      ) {
        const tempCheckState = JSON.parse(JSON.stringify(checkState));
        tempCheckState.find(
          (ele) => ele?.permission_id === e?.target?.name,
        ).active = e?.target?.checked;
        setCheckState(tempCheckState);
      } else {
        setCheckState((prev) => [
          ...prev,
          { permission_id: e?.target?.name, active: e?.target?.checked },
        ]);
      }

      setRoles(updatedPermissions);
    }
  };

  const HandleFullEnable = (first, second, e) => {
    const isChecked = e?.target?.checked;
    const updatedPermissions = JSON.parse(JSON.stringify(Roles));
    if (updatedPermissions[first]?.active) {
      updatedPermissions[first].groups[second].full_access = isChecked;
      const temp = updatedPermissions[first].groups[second];
      temp.permissions.forEach((element) => {
        element.active = element.active === null ? null : isChecked;

        if (element?.active !== null) {
          if (
            checkState.filter((val) => val?.permission_id === element?.name)
              ?.length > 0
          ) {
            // const newData = checkState.map((item) => ({
            //   ...item,
            //   active: isChecked,
            // }));
            // setCheckState(newData);
            checkState.find(
              (filter) => filter.permission_id === element?.name,
            ).active = isChecked;
          } else {
            setCheckState((prev) => [
              ...prev,
              { permission_id: element?.name, active: isChecked },
            ]);
          }
        }
      });

      updatedPermissions[first].groups[second] = temp;
      setRoles(updatedPermissions);
    }
  };

  React.useEffect(() => {
    console.log(checkState);
  }, [JSON.stringify(checkState)]);

  const reValidate = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setValidationErr((s) => ({ ...s, [name]: !VALIDATOR?.[name]?.(value) }));
  };

  const onInputChange = (e) => {
    e.persist();
    reValidate(e);
    setMainState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  React.useEffect(() => {
    if (state?.type) {
      if (state?.type === 'new') {
        FetchRolePermission();
      } else if (state?.type === 'member') {
        FetchRoleData();
        setRoles(state?.permissions);
        if (
          state?.role === 'Founder' ||
          state?.role === 'Admin' ||
          state?.role === 'Employee'
        ) {
          setMemberDefault(true);
          setCheckState([]);
        } else {
          setMemberDefault(false);
          fillDetails(state?.permissions);
        }

        if (Object?.keys(AccordionState)?.length > 0) {
          Object?.keys(AccordionState)?.map((val) =>
            setAccTab((prev) => ({
              ...prev,
              [val]: state?.permissions?.find((data) => data?.name === val)
                ?.active,
            })),
          );
        }
      } else {
        FetchRolePermission(state?.id_s);
      }
    } else {
      navigate('/settings-teamSettings');
    }
  }, [state?.type]);

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v](mainState[v]);
      return a;
    }, {});
  };

  const submitRole = () => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/roles`, {
      method: METHOD.POST,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        name: mainState?.roleName,
        description: mainState?.roleDescription,
        permissions: checkState,
        original_role_id: state?.type === 'clone' ? state?.id_s : undefined,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (!res?.error) {
          openSnackBar({
            message: res?.message || 'Role Created Successfully',
            type: MESSAGE_TYPE.INFO,
          });
          navigate('/settings-teamSettings', {
            state: { selectedTab: state?.selectedTab },
          });
        } else {
          openSnackBar({
            message:
              res?.message ||
              Object.values(res?.errors)?.join() ||
              'Unknown Error occured',
            type: MESSAGE_TYPE.ERROR,
          });
        }
      })
      .catch((res) => {
        enableLoading(false);
        openSnackBar({
          message:
            Object.values(res?.errors)?.join() || 'Unknown Error occured',
          type: MESSAGE_TYPE.ERROR,
        });
      });
  };

  const submitEditRole = (id_s) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/roles/${id_s}/permissions`, {
      method: METHOD.PATCH,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        name: mainState?.roleName,
        description: mainState?.roleDescription,
        permissions: checkState,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (!res?.error) {
          openSnackBar({
            message: 'Permissions Updated Successfully',
            type: MESSAGE_TYPE.INFO,
          });
          navigate('/settings-teamSettings', {
            state: { selectedTab: state?.selectedTab },
          });
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

  const onSubmitRole = () => {
    const sectionValidation = {};
    Object.keys(VALIDATOR).forEach((k) => {
      sectionValidation[k] = VALIDATOR[k];
    });
    const g = validateAllFields(sectionValidation);
    const valid = Object.values(g).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...g }));
    } else {
      setValidationErr((s) => ({ ...s, ...g }));
      if (state?.type === 'new' || state?.type === 'clone') {
        submitRole();
      } else if (state?.type === 'edit') {
        submitEditRole(state?.id_s);
      }
    }
  };

  const UpdateMemberPerm = (member_id_s, role_ids) => {
    enableLoading(true);
    RestApi(
      `organizations/${organization.orgId}/members/${member_id_s}/permissions/${role_ids}`,
      {
        method: METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${user.activeToken}`,
        },
        payload: {
          permissions: checkState,
        },
      },
    )
      .then((res) => {
        enableLoading(false);
        if (!res?.error) {
          openSnackBar({
            message: 'Permissions Updated Successfully',
            type: MESSAGE_TYPE.INFO,
          });
          navigate('/settings-teamSettings', {
            state: { selectedTab: state?.selectedTab },
          });
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

  const UpdateMemberRole = (member_id_s, role_ids) => {
    enableLoading(true);
    RestApi(`organizations/${organization.orgId}/members/${member_id_s}`, {
      method: METHOD.PATCH,
      headers: {
        Authorization: `Bearer ${user.activeToken}`,
      },
      payload: {
        role_id: role_ids,
      },
    })
      .then((res) => {
        enableLoading(false);
        if (!res?.error) {
          openSnackBar({
            message: res?.message || 'Role Updated Successfully',
            type: MESSAGE_TYPE.INFO,
          });
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

  const onSubmitMember = async () => {
    const roleId = RoleList?.find((val) => val?.payload === SelectedRole)?.id_s;
    if (state?.role === SelectedRole) {
      if (
        SelectedRole !== 'Founder' &&
        SelectedRole !== 'Admin' &&
        SelectedRole !== 'Employee'
      ) {
        UpdateMemberPerm(state?.member_id_s, roleId);
      } else {
        navigate('/settings-teamSettings', {
          state: { selectedTab: state?.selectedTab },
        });
      }
    } else {
      await UpdateMemberRole(state?.member_id_s, roleId);
      if (
        SelectedRole !== 'Founder' &&
        SelectedRole !== 'Admin' &&
        SelectedRole !== 'Employee'
      ) {
        UpdateMemberPerm(state?.member_id_s, roleId);
      } else {
        navigate('/settings-teamSettings', {
          state: { selectedTab: state?.selectedTab },
        });
      }
    }
  };

  const handleRoleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedRole(value);
    const roleId = RoleList?.find((val) => val?.payload === value)?.id_s;
    FetchRolePermission(roleId);
  };

  const DefaultMember = () => {
    if (memberDefault) {
      openSnackBar({
        message: 'This is the default role, so you can`t change.',
        type: MESSAGE_TYPE.WARNING,
      });
    }
  };

  return (
    <Stack className={css.teamrolescontainer}>
      <Stack className={css.rolertitlewrp}>
        <IconButton
          sx={{ marginRight: '4px' }}
          onClick={() =>
            navigate('/settings-teamSettings', {
              state: { selectedTab: state?.selectedTab },
            })
          }
        >
          <ArrowBackIosNewOutlinedIcon className={css.backicon} />
        </IconButton>
        <Typography variant="h5" className={css.rolestitle}>
          {state?.type === 'new' || state?.type === 'clone'
            ? 'Add New Role'
            : `Edit Permissions for ${state?.name}`}
        </Typography>
      </Stack>
      <Stack sx={{ flexDirection: 'row', marginBottom: '20px' }}>
        <Stack className={css.inputwrp}>
          {state?.type === 'member' ? (
            <>
              <FormControl sx={{ m: 1 }} className={css.selectFieldDiv}>
                <label htmlFor="role" className={css.rolelabel}>
                  Role Name
                </label>
                <Select
                  displayEmpty
                  value={SelectedRole}
                  onChange={handleRoleChange}
                  input={<OutlinedInput />}
                  components={TextField}
                  IconComponent={KeyboardArrowDownRoundedIcon}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 224,
                        width: 200,
                      },
                    },
                  }}
                  inputProps={{ 'aria-label': 'Without label' }}
                  className={`${css.select} ${classes.selectFieldRoot}`}
                >
                  {RoleList?.map((element) => (
                    <MenuItem
                      components="div"
                      key={element?.id_s}
                      value={element?.payload}
                    >
                      {element?.payload}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          ) : (
            <>
              <Stack className={css.nameinputwrp}>
                <label
                  htmlFor="role"
                  className={
                    validationErr.roleName
                      ? `${css.rolelabel} ${css.rolemt}`
                      : css.rolelabel
                  }
                >
                  Role Name
                </label>
                <TextFieldRole
                  id="role"
                  name="roleName"
                  placeholder="Enter Role Name"
                  className={css.roleinput}
                  helperText={
                    validationErr.roleName ? 'Please Enter Your Role Name' : ''
                  }
                  error={validationErr.roleName}
                  value={mainState.roleName}
                  onChange={onInputChange}
                  onBlur={reValidate}
                />
              </Stack>
              <Stack className={css.nameinputwrp}>
                <label
                  htmlFor="desc"
                  className={
                    validationErr.roleDescription
                      ? `${css.rolelabel} ${css.rolemt}`
                      : css.rolelabel
                  }
                  style={{ marginRight: 36 }}
                >
                  Description
                </label>
                <TextFieldRole
                  id="desc"
                  name="roleDescription"
                  placeholder="Enter Role Description"
                  className={css.roleinput}
                  helperText={
                    validationErr.roleDescription
                      ? 'Please Enter Your Role Description'
                      : ''
                  }
                  error={validationErr.roleDescription}
                  value={mainState.roleDescription}
                  onChange={onInputChange}
                  onBlur={reValidate}
                />
              </Stack>
            </>
          )}
        </Stack>

        <Stack className={css.savebtnwrp}>
          {state?.type === 'edit' || state?.type === 'member' ? (
            <Button
              className={css.savebtn}
              onClick={() => {
                if (state?.type === 'edit') {
                  onSubmitRole();
                } else if (state?.type === 'member') {
                  onSubmitMember();
                }
              }}
            >
              Save Permissions
            </Button>
          ) : (
            <Button className={css.savebtn} onClick={() => onSubmitRole()}>
              Save New Role
            </Button>
          )}
        </Stack>
      </Stack>

      <Stack>
        {Roles?.map((val, firstIndex) => (
          <Accordion
            expanded={AccTab[val?.name]}
            className={`${css.accordion} ${classes.accdetails}`}
            TransitionProps={{ unmountOnExit: true }}
            key={val?.name}
            onChange={HandleAcordion(val?.name)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              IconButtonProps={{
                onClick: HandleAcordion(val?.name),
              }}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              classes={{
                content: classes.align,
              }}
            >
              <Switch
                classes={{
                  root: classes.root,
                  switchBase: classes.switchBase,
                  thumb: classes.thumb,
                  track: classes.track,
                  checked: classes.checked,
                }}
                checked={val?.active}
                name={val?.name}
                onChange={(event) => {
                  if (memberDefault) {
                    DefaultMember();
                  } else {
                    HandleAccessEnable(event);
                  }
                }}
                inputProps={{ 'aria-label': 'Access checkbox' }}
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
              />
              <Typography className={css.accheader}>{val?.name}</Typography>
            </AccordionSummary>
            <AccordionDetails className={`${css.accdetails}`}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={css.theadcell}>Permissions</TableCell>
                    <TableCell align="center" className={css.theadcell}>
                      Full Access
                    </TableCell>
                    <TableCell align="center" className={css.theadcell}>
                      View
                    </TableCell>
                    <TableCell align="center" className={css.theadcell}>
                      Edit
                    </TableCell>
                    <TableCell align="center" className={css.theadcell}>
                      Create
                    </TableCell>
                    <TableCell align="center" className={css.theadcell}>
                      Approval
                    </TableCell>
                    <TableCell align="center" className={css.theadcell}>
                      Cancel
                    </TableCell>
                    <TableCell align="center" className={css.theadcell}>
                      Delete
                    </TableCell>
                    {/* <TableCell /> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {val?.groups.map((row, secondIndex) => (
                    <TableRow key={row.permission}>
                      <TableCell className={css.tbodycell}>
                        {row?.name}
                      </TableCell>
                      <TableCell align="center" className={css.tbodycell}>
                        <Stack className={classes.chckroot}>
                          <Checkbox
                            checked={row?.full_access}
                            name="access"
                            onChange={(e) => {
                              if (memberDefault) {
                                DefaultMember();
                              } else {
                                HandleFullEnable(firstIndex, secondIndex, e);
                              }
                            }}
                            disabled={!val.active}
                          />
                        </Stack>
                      </TableCell>
                      {row?.permissions?.map((data, thirdIndex) => (
                        <TableCell align="center" className={css.tbodycell}>
                          <Stack
                            className={classes.chckroot}
                            // sx={
                            //   row.delete === 'disable' && {
                            //     cursor: 'not-allowed',
                            //   }
                            // }
                          >
                            <Checkbox
                              checked={data?.active}
                              name={data?.name}
                              onChange={(event) => {
                                if (memberDefault) {
                                  DefaultMember();
                                } else {
                                  HandlePermissionEnable(
                                    firstIndex,
                                    secondIndex,
                                    thirdIndex,
                                    event,
                                  );
                                }
                              }}
                              disabled={data?.active === null || !val.active}
                            />
                          </Stack>
                        </TableCell>
                      ))}
                      {/* <TableCell /> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Stack>
  );
};

export default memo(TeamsRoles);
