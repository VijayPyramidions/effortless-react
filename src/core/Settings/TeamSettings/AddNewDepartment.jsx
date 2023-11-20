import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  getManager,
  postDepartment,
  updateDepartment,
} from '@action/Store/Reducers/Settings/TeamSettingDepartmentState';

import {
  Stack,
  Box,
  TextField,
  ListItemText,
  Button,
  Checkbox,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';

import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';

import { validateRequired } from '@services/Validation.jsx';
import { makeStyles, MenuItem, Popover } from '@material-ui/core';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet.jsx';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import { SearchIconModule } from '@components/SvgIcons/SvgIcons.jsx';
import CloseIcon from '@mui/icons-material/Close';

import * as css from './teamSettings.scss';

const useStyles = makeStyles({
  textfiledroot: {
    flexGrow: 1,
    borderRadius: '4px !important',
    background: '#FFF',
    '& .MuiInputBase-input': {
      padding: '12px',
      letterSpacing: 2,
      fontFamily: 'Lexend, sans-serif !important',
      fontSize: '14px',
      fontWeight: 400,
      height: '20px',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '4px',
      '& fieldset': {
        border: '1px solid rgba(0, 0, 0, 0.10)',
        borderRadius: '4px',
      },
      '&:hover fieldset': {
        border: '1px solid rgba(0, 0, 0, 0.10)',
        borderRadius: '4px',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.10) !important',
    },
    '& .Mui-error': {
      paddingLeft: '8px',
    },
  },
  menutext: {
    color: '#283049 !important',
    fontFamily: 'Lexend, sans-serif !important',
    fontSize: '14px !important',
    fontStyle: 'normal !important',
    fontWeight: '300 !important',
    lineHeight: 'normal !important',
    borderBottom: '1px solid rgba(199, 199, 199, 0.50) !important',
    textTransform: 'capitalize !important',
  },
  disabledClass: {
    pointerEvents: 'none !important',
    background: '#F8F8F8 !important',
  },
});

const VALIDATION = {
  departmentName: {
    errMsg: 'Enter Department Name',
    test: validateRequired,
  },
};

const AddNewDepartment = ({ type, dataSet }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const { managerDetails } = useSelector(
    (value) => value.TeamSettingDepartment
  );

  const device = localStorage.getItem('device_detect');
  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [localState, setLocalState] = useState({
    departmentName: '',
    hodValue: {},
    managerValue: [],
  });
  const [drawer, setDrawer] = useState({});
  const [dropDownList, setDropDownList] = useState([]);

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const getEventNameValue = (ps) => {
    const name = ps?.target?.name;
    const value = ps?.target?.value;
    return [name, value];
  };

  const reValidate = (ps) => {
    const [name, value] = getEventNameValue(ps);
    setValidationErr((v) => ({
      ...v,
      [name]: !VALIDATION?.[name]?.test?.(value),
    }));
  };

  const onInputChange = (ps) => {
    const [name, value] = getEventNameValue(ps);
    reValidate(ps);
    setLocalState((s) => ({
      ...s,
      [name]: value,
    }));
  };

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(localState[v]);
      return a;
    }, {});
  };

  const onFormSubmit = () => {
    const sectionValidation = {};
    Object.keys(VALIDATION).forEach((k) => {
      sectionValidation[k] = VALIDATION[k];
    });
    const g = validateAllFields(sectionValidation);
    const valid = Object.values(g).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...g }));
    } else if (Object.keys(localState?.hodValue || {})?.length === 0) {
      dispatch(
        openSnackbar({
          message: 'Select HOD Field.',
          type: 'error',
        })
      );
    } else if (localState?.managerValue?.length === 0) {
      dispatch(
        openSnackbar({
          message: 'Select Manager Field.',
          type: 'error',
        })
      );
    } else {
      // eslint-disable-next-line no-lonely-if
      if (type === 'edit') {
        dispatch(
          updateDepartment({
            id: dataSet?.id,
            payload: {
              name: localState?.departmentName,
              manager_id: localState?.hodValue?.id,
              membership_manager_ids: localState?.managerValue?.map(
                (val) => val?.id
              ),
            },
          })
        );
      } else {
        dispatch(
          postDepartment({
            name: localState?.departmentName,
            manager_id: localState?.hodValue?.id,
            membership_manager_ids: localState?.managerValue?.map(
              (val) => val?.id
            ),
          })
        );
      }
    }
  };

  const handleManagerSelect = (val) => {
    if (localState?.managerValue?.map((ele) => ele?.id)?.includes(val?.id)) {
      const tempManager = localState?.managerValue?.filter(
        (data) => data?.id !== val?.id
      );
      setLocalState({ ...localState, managerValue: tempManager });
    } else {
      setLocalState((prev) => ({
        ...prev,
        managerValue: [...prev?.managerValue, val],
      }));
    }
  };

  const handleManagerUnSelect = (event, val) => {
    event.stopPropagation();
    const tempManager = localState?.managerValue?.filter(
      (data) => data?.id !== val?.id
    );
    setLocalState({ ...localState, managerValue: tempManager });
  };

  useEffect(() => {
    dispatch(getManager());
  }, []);

  useEffect(() => {
    if (managerDetails?.data) {
      setDropDownList(managerDetails?.data);
    }
  }, [managerDetails]);

  useEffect(() => {
    if (type === 'edit') {
      setLocalState({
        departmentName: dataSet?.name,
        hodValue: {
          id: dataSet?.department_manager_id,
          name: dataSet?.department_manager_name,
        },
        managerValue: dataSet?.managers,
      });
    }
  }, [type, dataSet]);

  return (
    <div className={css.addnewdepartment}>
      <Stack>
        <Box padding="20px">
          <p className={css.headertext}>
            {type === 'edit' ? 'Edit' : 'Add New'} Department
          </p>
        </Box>
        <Box
          component={Stack}
          direction="column"
          padding="0px 20px 20px"
          gap="20px"
        >
          <Stack direction="column" width="100%" gap="8px">
            <p className={css.labeltext}>
              Department Name<span style={{ color: '#f00' }}>*</span>
            </p>
            <TextField
              type="text"
              className={classes.textfiledroot}
              name="departmentName"
              onChange={onInputChange}
              onBlur={reValidate}
              placeholder="Enter Department Name"
              error={validationErr.departmentName}
              helperText={
                validationErr.departmentName
                  ? VALIDATION?.departmentName?.errMsg
                  : ''
              }
              value={localState?.departmentName}
            />
          </Stack>
          <Stack direction="column" width="100%" gap="8px">
            <p className={css.labeltext}>
              HOD<span style={{ color: '#f00' }}>*</span>
            </p>
            <Box
              className={
                null
                  ? `${css.opensheetfieldroot} ${classes.disabledClass}`
                  : `${css.opensheetfieldroot}`
              }
              width="calc(100% - 18px)"
              component={Stack}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              onClick={(event) => {
                handleDrawer('hodList', event?.currentTarget);
              }}
            >
              <p
                style={{
                  color: localState?.hodValue?.id ? '#000' : '#A0A4AF',
                  textTransform: 'capitalize',
                }}
              >
                {localState?.hodValue?.name || 'Select HOD'}
              </p>{' '}
              <KeyboardArrowDownIcon sx={{ color: '#0000008a' }} />
            </Box>
          </Stack>

          <Stack width="100%" gap="8px">
            <p className={css.labeltext} style={{ display: 'flex' }}>
              Manager<span style={{ color: '#f00' }}>*</span>
            </p>
            <Box
              className={
                null
                  ? `${css.opensheetfieldroot} ${classes.disabledClass}`
                  : `${css.opensheetfieldroot}`
              }
              width="calc(100% - 18px)"
              component={Stack}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              onClick={(event) => {
                handleDrawer('managerList', event?.currentTarget);
              }}
            >
              {localState?.managerValue?.length === 0 ? (
                <p
                  style={{
                    color: '#A0A4AF',
                  }}
                >
                  Select Manager
                </p>
              ) : (
                <Stack direction="row" gap="8px" sx={{ overflow: 'auto' }}>
                  {localState?.managerValue?.map((val) => (
                    <>
                      <Box
                        className={css.selectedmanager}
                        onClick={(event) => event?.stopPropagation()}
                      >
                        {val?.name}{' '}
                        <IconButton
                          sx={{ padding: '4px' }}
                          onClick={(event) => handleManagerUnSelect(event, val)}
                        >
                          <CloseIcon sx={{ fontSize: '12px' }} />
                        </IconButton>
                      </Box>
                    </>
                  ))}
                </Stack>
              )}
              <KeyboardArrowDownIcon sx={{ color: '#0000008a' }} />
            </Box>
          </Stack>

          <Stack
            direction="row"
            width="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              className={css.primaryButton}
              onClick={() => onFormSubmit()}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Stack>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={Boolean(drawer?.hodList) && device === 'desktop'}
        anchorEl={drawer?.hodList}
        onClose={() => handleDrawer('hodList', null)}
        PaperProps={{
          elevation: 3,
          style: {
            width: '420px',
            marginTop: 4,
            maxHeight: 300,
            overflow: 'auto',
          },
        }}
      >
        <HodShowList
          localState={localState}
          setLocalState={setLocalState}
          hodList={dropDownList}
          handleDrawer={handleDrawer}
        />
      </Popover>

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
            width: '420px',
            marginTop: 4,
            maxHeight: 280,
            overflow: 'auto',
          },
        }}
      >
        <ManagerShowList
          localState={localState}
          managerList={dropDownList}
          handleManagerSelect={handleManagerSelect}
        />
      </Popover>
      <SelectBottomSheet
        open={Boolean(drawer?.hodList) && device === 'mobile'}
        triggerComponent
        onClose={() => handleDrawer('hodList', null)}
        styleDrawerMinHeight="auto"
        styleDrawerMaxHeight="40vh"
      >
        <HodShowList
          localState={localState}
          setLocalState={setLocalState}
          hodList={dropDownList}
          handleDrawer={handleDrawer}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        open={Boolean(drawer?.managerList) && device === 'mobile'}
        triggerComponent
        onClose={() => handleDrawer('managerList', null)}
        styleDrawerMinHeight="auto"
        id="overFlowHidden"
      >
        <ManagerShowList
          localState={localState}
          managerList={dropDownList}
          handleManagerSelect={handleManagerSelect}
        />
      </SelectBottomSheet>
    </div>
  );
};

export default AddNewDepartment;

const HodShowList = ({ localState, setLocalState, hodList, handleDrawer }) => {
  return (
    <ul style={{ padding: 0 }}>
      {hodList?.map((val) => (
        <MenuItem
          key={val?.id}
          value={val?.id}
          onClick={() => {
            setLocalState((prev) => ({ ...prev, hodValue: val }));
            handleDrawer('hodList', null);
          }}
          className={css.menutext}
          style={{
            background: localState?.hodValue?.id === val?.id && '#f08b3250',
            display: 'flex !important',
            justifyContent: 'flex-start !important',
            textTransform: 'capitalize',
          }}
        >
          {val?.name}
        </MenuItem>
      ))}
    </ul>
  );
};

const ManagerShowList = ({ localState, managerList, handleManagerSelect }) => {
  const device = localStorage.getItem('device_detect');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div
      className={
        device === 'mobile' ? css.department_mobile : css.department_desktop
      }
    >
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIconModule />
            </InputAdornment>
          ),
        }}
        sx={{
          width: '100%',
          background: '#FAFAFA',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          '& .MuiInputBase-input': {
            padding: '12px 0',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              border: 'none',
              borderBottom: '1px solid #ECECEC',
            },
            '&:hover fieldset': {
              borderBottom: '1px solid #ECECEC',
            },
          },
        }}
        focused={false}
        autoFocus
        placeholder="Search Manager"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e?.target?.value);
        }}
      />
      <ul style={{ padding: 0, margin: 0 }}>
        {managerList
          ?.filter((ele) =>
            ele?.name
              ?.toLocaleLowerCase()
              ?.includes(searchQuery?.toLocaleLowerCase())
          )
          ?.map((val) => (
            <MenuItem
              key={val?.id}
              value={val?.id}
              onClick={() => {
                handleManagerSelect(val);
              }}
              className={css.menutext}
              style={{
                background:
                  localState?.managerValue
                    ?.map((ele) => ele?.id)
                    ?.includes(val?.id) && '#f08b3250',
                display: 'flex !important',
                justifyContent: 'flex-start !important',
                padding: '0 4px',
                textTransform: 'capitalize',
                '&:hover': {
                  background:
                    localState?.managerValue
                      ?.map((ele) => ele?.id)
                      ?.includes(val?.id) && '#f08b3250',
                },
              }}
            >
              <Checkbox
                checked={localState?.managerValue
                  ?.map((ele) => ele?.id)
                  ?.includes(val?.id)}
                style={{
                  color: '#F08B32',
                }}
              />
              <ListItemText primary={val?.name} />
            </MenuItem>
          ))}
        {managerList?.filter((ele) =>
          ele?.name
            ?.toLocaleLowerCase()
            ?.includes(searchQuery?.toLocaleLowerCase())
        )?.length === 0 && (
          <MenuItem
            className={css.menutext}
            style={{
              display: 'flex !important',
              justifyContent: 'flex-start !important',
            }}
            disabled
          >
            <ListItemText primary="No Manager Found." />
          </MenuItem>
        )}
      </ul>
    </div>
  );
};

export const DepartmentShowList = ({
  mainState,
  handleDrawer,
  DepartmentList,
  onInputChange,
}) => {
  const device = localStorage.getItem('device_detect');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div
      className={
        device === 'mobile' ? css.department_mobile : css.department_desktop
      }
    >
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIconModule />
            </InputAdornment>
          ),
        }}
        sx={{
          width: 'calc(100% - 2px)',
          background: '#FAFAFA',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          borderRadius:
            device === 'mobile' ? '20px 20px 0px 0px' : '4px 4px 0px 0px',
          border: '1px solid #F08B32',
          '& .MuiInputBase-input': {
            padding: '12px 0',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              border: 'none',
              borderBottom: '1px solid #ECECEC',
            },
            '&:hover fieldset': {
              borderBottom: '1px solid #ECECEC',
            },
          },
        }}
        focused={false}
        autoFocus
        placeholder="Search Department"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e?.target?.value);
        }}
      />
      <Stack
        direction="row"
        gap="8px"
        p="8px 12px"
        component={Button}
        sx={{ textTransform: 'capitalize', width: '100%' }}
        justifyContent="start"
        onClick={() => {
          handleDrawer('actionDepartment', true);
          handleDrawer('managerList', null);
        }}
      >
        <AddIcon style={{ color: '#f08b32' }} />{' '}
        <Typography sx={{ color: '#f08b32' }}>Add New Department</Typography>
      </Stack>
      <ul style={{ padding: 0, margin: 0 }}>
        {DepartmentList?.filter((ele) =>
          ele?.name
            ?.toLocaleLowerCase()
            ?.includes(searchQuery?.toLocaleLowerCase())
        )?.map((val) => (
          <MenuItem
            key={val?.id}
            value={val?.id}
            onClick={() => {
              handleDrawer('managerList', null);
              onInputChange(
                { target: { name: 'department', value: val?.id } },
                val
              );
            }}
            className={css.menutext}
            style={{
              background: mainState?.department === val?.id && '#f08b3250',
              display: 'flex !important',
              justifyContent: 'flex-start !important',
              padding: '0 4px',
              textTransform: 'capitalize',
              border: 'none !important',
            }}
          >
            {val?.name}
          </MenuItem>
        ))}
        {DepartmentList?.filter((ele) =>
          ele?.name
            ?.toLocaleLowerCase()
            ?.includes(searchQuery?.toLocaleLowerCase())
        )?.length === 0 && (
          <MenuItem
            className={css.menutext}
            style={{
              display: 'flex !important',
              justifyContent: 'flex-start !important',
            }}
            disabled
          >
            <ListItemText primary="No Manager Found." />
          </MenuItem>
        )}
      </ul>
    </div>
  );
};
