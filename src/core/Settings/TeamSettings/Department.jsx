import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { patchOrganizationSettings } from '@action/Store/Reducers/Settings/SettingsState';
import {
  getDepartment,
  clearDepartmentAction,
  deleteDepartment,
} from '@action/Store/Reducers/Settings/TeamSettingDepartmentState';

import {
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  ButtonGroup,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Dialog } from '@material-ui/core';

import ToggleSwitch from '@components/ToggleSwitch/ToggleSwitch';
import AddNewDepartment from './AddNewDepartment';

import EditIcon from '../../../assets/editicon.svg';
import DeleteIcon from '../../../assets/deleteicon.svg';
import EditIconDisable from '../../../assets/disableedit.svg';
import DeleteIconDisable from '../../../assets/disabledelete.svg';

import * as css from './teamSettings.scss';

const Department = ({ enableDep }) => {
  const dispatch = useDispatch();
  const { departments, departmentsAction } = useSelector(
    (value) => value.TeamSettingDepartment
  );

  const [departmentsList, setDepartmentList] = useState([]);
  const [actionDepartment, setActionDepartment] = useState({});
  const [drawer, setDrawer] = useState({});

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const CheckBoxFunction = (val) => {
    dispatch(
      patchOrganizationSettings({ payload: { enable_department: val } })
    );
  };

  useEffect(() => {
    if (enableDep) {
      dispatch(getDepartment());
    }
  }, [enableDep]);

  useEffect(() => {
    if (enableDep && departments) {
      setDepartmentList(departments);
    }
  }, [departments]);

  useEffect(() => {
    if (departmentsAction === 'departmentUpdated') {
      setActionDepartment({});
      handleDrawer('editDepartment', false);
      dispatch(clearDepartmentAction());
    }
  }, [departmentsAction]);

  return (
    <Box className={css.department_main}>
      <Box className={css.topbox} component={Stack} gap="12px">
        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
        >
          <Typography className={css.enabletext}>Enable Department</Typography>

          <ToggleSwitch
            checked={enableDep}
            onChange={(e) => CheckBoxFunction(e?.target?.checked)}
          />
        </Stack>
        <Typography className={css.descriptiontext}>
          Enable Department to activate cost center Mapping in Effortless
        </Typography>
      </Box>

      {enableDep && (
        <TableContainer
          component={Paper}
          className={`${css.tablecontainer} ${css.departmentable}`}
        >
          <Table className={css.table} stickyHeader>
            <TableHead>
              <TableRow className={css.tablerow}>
                <TableCell className={`${css.bordernone} ${css.tablehead}`}>
                  Department Name
                </TableCell>
                <TableCell className={`${css.bordernone} ${css.tablehead}`}>
                  HOD
                </TableCell>
                <TableCell className={`${css.bordernone} ${css.tablehead}`}>
                  Managers
                </TableCell>
                <TableCell
                  className={`${css.bordernone} ${css.tablehead}`}
                  align="center"
                  sx={{ width: 216 }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={css.tbody}>
              {departmentsList?.length === 0 && (
                <TableRow className={css.tablerow}>
                  <TableCell
                    className={`${css.bordernone} ${css.tablecell} ${css.tab_500}`}
                    colSpan={4}
                    align="center"
                  >
                    No Departments.
                  </TableCell>
                </TableRow>
              )}
              {departmentsList?.filter(ele => ele.active)?.map(val => (
                <TableRow className={css.tablerow} key={val?.id}>
                  <TableCell
                    className={`${css.bordernone} ${css.tablecell} ${css.tab_500}`}
                  >
                    <Stack className={css.initalwrapp}>{val?.name}</Stack>
                  </TableCell>

                  <TableCell className={`${css.bordernone} ${css.tablecell}`}>
                    <Box className={css.chipview}>
                      {val?.department_manager_name}
                    </Box>
                  </TableCell>

                  <TableCell className={`${css.bordernone} ${css.tablecell}`}>
                    <Stack direction="row" alignItems="center" gap="8px">
                      {val?.managers?.slice(0, 3)?.map((ele) => (
                        <Box className={css.chipview} key={ele?.id}>
                          {ele?.name}
                        </Box>
                      ))}
                      {val?.managers?.length > 3 && (
                        <Box className={css.pluscont}>
                          +{val?.managers?.length - 3}
                        </Box>
                      )}
                    </Stack>
                  </TableCell>

                  <TableCell
                    className={`${css.bordernone} ${css.tablecell}`}
                    align="center"
                  >
                    <ButtonGroup className={css.btngroup}>
                      <Button
                        className={
                          val?.default_role ? css.disabledit : css.editbtn
                        }
                        disabled={val?.default_role}
                        onClick={() => {
                          handleDrawer('editDepartment', true);
                          setActionDepartment(val);
                        }}
                      >
                        <IconButton>
                          <img
                            src={val?.default_role ? EditIconDisable : EditIcon}
                            alt="edit icon"
                          />
                        </IconButton>
                        Edit
                      </Button>
                      <Button
                        className={
                          val?.default_role ? css.disabledelete : css.deletebtn
                        }
                        disabled={val?.default_role}
                        onClick={() => {
                          handleDrawer('deleteDepartment', true);
                          setActionDepartment(val);
                        }}
                      >
                        <IconButton>
                          <img
                            src={
                              val?.default_role ? DeleteIconDisable : DeleteIcon
                            }
                            alt="delete icon"
                          />
                        </IconButton>
                        Delete
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog
        open={drawer?.editDepartment}
        onClose={() => {
          handleDrawer('editDepartment', false);
          setActionDepartment({});
        }}
        PaperProps={{
          style: {
            width: 460,
            paddingBottom: 20,
            borderRadius: 8,
          },
        }}
      >
        <AddNewDepartment type="edit" dataSet={actionDepartment} />
      </Dialog>
      <Dialog
        open={drawer?.deleteDepartment}
        onClose={() => {
          handleDrawer('deleteDepartment', false);
          setActionDepartment({});
        }}
        PaperProps={{
          style: {
            width: 460,
            paddingBottom: 20,
            borderRadius: 8,
          },
        }}
      >
        <DeleteContent
          handleNo={() => handleDrawer('deleteDepartment', null)}
          handleYes={() => {
            handleDrawer('deleteDepartment', null);
            dispatch(deleteDepartment(actionDepartment?.id));
          }}
        />
      </Dialog>
    </Box>
  );
};

export default Department;

const DeleteContent = ({ handleNo, handleYes }) => {
  return (
    <div className={css.deleteddialog}>
      <Stack alignItems="center" direction="row" justifyContent="space-between">
        <Typography className={css.deletehead}>Confirm</Typography>
        {/* {!desktopView && (
          <IconButton onClick={() => handleNo()}>
            <CloseIcon />
          </IconButton>
        )} */}
      </Stack>

      <Typography className={css.descriptiontext}>
        Are you sure you want to delete this Department?
      </Typography>

      <Stack justifyContent="space-between" alignItems="center" direction="row">
        <Button className={css.secondarybutton} onClick={() => handleNo()}>
          No
        </Button>
        <Button className={css.primaryButton} onClick={() => handleYes()}>
          Yes
        </Button>
      </Stack>
    </div>
  );
};
