import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { GetVendorEntityState } from '@action/Store/Reducers/General/GeneralState';

import {
  Stack,
  Box,
  TextField,
  FormControl,
  Select,
  // MenuItem,
  Button,
  OutlinedInput,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { MenuItem } from '@material-ui/core';

import { openSnackbar } from '@action/Store/Reducers/Errors/Errors';

import { validateRequired, validateEmail } from '@services/Validation.jsx';
import { makeStyles, styled } from '@material-ui/core/styles';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import VendorList from '@components/Vendor/VendorList';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import CustomSearch from '@components/SearchSheet/CustomSearch.jsx';

import * as css from './billBox.scss';

const useStyles = makeStyles({
  textfiledroot: {
    flexGrow: 1,
    borderRadius: '8px !important',
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
      borderRadius: '8px',
      '& fieldset': {
        border: '1px solid #ECECEC',
        borderRadius: '8px',
      },
      '&:hover fieldset': {
        border: '1px solid #ECECEC',
        borderRadius: '8px',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ECECEC !important',
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

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const VALIDATION = {
  email: {
    errMsg: 'Enter Valid Email',
    test: validateEmail,
  },
  providerName: {
    errMsg: 'Enter Provider Name',
    test: validateRequired,
  },
};

const AddEmailBillProvider = ({
  categoryList,
  setProviderState,
  type,
  providerState,
}) => {
  const classes = useStyles();
  const themes = useTheme();
  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));

  const dispatch = useDispatch();
  const { vendorEntity } = useSelector((value) => value.General);

  const initialValidationErr = Object.keys(VALIDATION).map((k) => ({
    [k]: false,
  }));
  const [validationErr, setValidationErr] = useState(initialValidationErr);
  const [localState, setLocalState] = useState({});
  const [drawer, setDrawer] = useState({});

  const [vendorList, setVendorList] = useState([]);
  const [pagination, setPagination] = useState({
    totalPage: 1,
    currentPage: 1,
  });
  const [dntCheckbox, setDntCheckbox] = useState(false);
  const handleTriggerSheet = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

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
    if (name === 'category') {
      const temp = categoryList?.find((val) => val?.name === value);
      setLocalState((s) => ({
        ...s,
        category: temp?.name,
        expense_category_id: temp?.id,
      }));
      return;
    }
    if (name === 'vendor') {
      setLocalState((s) => ({
        ...s,
        vendorName: value?.name,
        vendorId: value?.id,
        providerName: ''
      }));
      return;
    }
    reValidate(ps);
    setLocalState((s) => ({
      ...s,
      [name]: value,
    }));
  };

  const getVendor = (a, searchVal, pageNum) => {
    dispatch(
      GetVendorEntityState({
        allParties: false,
        pageNum: pageNum || 1,
        searchText: searchVal || '',
        location: false,
      })
    );
  };

  const handleDoNotTrackVendor = async (data) => {
    // setHasNoGstin(data);
    // const stateName = 'doNotTrack';
    // const validationName = 'vendor';
    // setValidationErr((v) => ({
    //   ...v,
    //   [validationName]: false,
    // }));
    // setLocalState((s) => ({ ...s, [stateName]: data }));
    setDntCheckbox(data);
    onInputChange(
      {
        target: {
          name: 'vendor',
          value: data
            ? {
                id: null,
                name: 'Do Not Track Vendor',
              }
            : {
                id: null,
                name: '',
              },
        },
      },
      { vendor_id: null }
    );
    if (data) handleTriggerSheet('vendorlist', false);
  };

  const validateAllFields = (validationData) => {
    return Object.keys(validationData).reduce((a, v) => {
      // eslint-disable-next-line no-param-reassign
      a[v] = !validationData?.[v]?.test(localState[v]);
      return a;
    }, {});
  };

  const onFormSubmit = () => {
    let sectionValidation = {};
    if (localState?.vendorName === 'Do Not Track Vendor' && !localState?.vendorId) {
      sectionValidation = VALIDATION;
    } else {
      sectionValidation = {email: VALIDATION?.email};
    }
    const g = validateAllFields(sectionValidation);
    const valid = Object.values(g).every((val) => !val);

    if (!valid) {
      setValidationErr((s) => ({ ...s, ...g }));
    } else if (!localState?.vendorName) {
      dispatch(
        openSnackbar({
          message: 'Select Vendor Field.',
          type: 'error',
        })
      );
    } else if (!localState?.expense_category_id) {
      dispatch(
        openSnackbar({
          message: 'Select Category Field.',
          type: 'error',
        })
      );
    } else {
      setProviderState({
        name: localState?.vendorId ? undefined : localState?.providerName,
        email: localState?.email,
        expense_category_id: localState?.expense_category_id,
        editProvider: type === 'edit',
        emailListId: providerState?.emailListId || undefined,
        vendor_id: localState?.vendorId
      });
    }
  };

  useEffect(() => {
    if (type === 'edit' && Object?.keys(providerState || {})?.length > 0) {
      const temp = categoryList?.find(
        (val) => val?.id === providerState?.expense_category_id
      );
      setLocalState({
        vendorName: providerState?.vendor_id ? providerState?.name : 'Do Not Track Vendor',
        providerName: providerState?.vendor_id ? '' : providerState?.name,
        email: providerState?.email,
        category: temp?.name,
        expense_category_id: temp?.id,
        vendor_id: providerState?.vendor_id
      });
      setDntCheckbox(!providerState?.vendor_id);
    }
  }, [type, categoryList, providerState]);

  useEffect(() => {
    if (vendorEntity?.data) {
      if (vendorEntity?.page === 1) {
        setVendorList(vendorEntity?.data);
      } else {
        setVendorList((prev) => [...prev, ...vendorEntity?.data]);
      }
      setPagination({
        totalPage: vendorEntity?.pages,
        currentPage: vendorEntity?.page,
      });
    }
  }, [JSON.stringify(vendorEntity || {})]);

  useEffect(() => {
    getVendor();
  }, []);

  return (
    <div className={css.addnewprovider}>
      {!desktopView && <Puller />}
      <Stack>
        <Box padding={desktopView ? '20px' : '36px 20px 0px'}>
          <p className={css.headertext}>
            {type === 'edit' ? 'Edit' : 'Add'} a Provider’s EMail ID
          </p>
        </Box>
        <Box
          component={Stack}
          direction="column"
          padding={desktopView ? '0px 20px 20px' : '24px 20px 32px'}
          gap="20px"
        >
          <Stack direction="column" width="100%" gap="8px">
            <p className={css.labeltext}>
              Email Id<span style={{ color: '#f00' }}>*</span>
            </p>
            <TextField
              type="email"
              className={classes.textfiledroot}
              name="email"
              onChange={onInputChange}
              onBlur={reValidate}
              error={validationErr.email}
              helperText={validationErr.email ? VALIDATION?.email?.errMsg : ''}
              value={localState?.email}
            />
          </Stack>
          <Stack direction="column" width="100%" gap="8px">
            <p className={css.labeltext}>
              Vendor Name<span style={{ color: '#f00' }}>*</span>
            </p>
            <SelectBottomSheet
              // name="Vendor"
              // onBlur={reValidate}
              // error
              // helperText
              // label="Select Vendor"
              open={drawer?.vendorlist}
              value={localState?.vendorName}
              onTrigger={() => handleDrawer('vendorlist', true)}
              onClose={() => handleDrawer('vendorlist', false)}
              // required
              // id="recordBillVendor"
              // showAddText={showTextData ? 'Add This Vendor' : 'Add Vendor'}
              // toShow={toShowBtn}
              fromEmailProvider
            >
              <CustomSearch
                showType="Vendor"
                customerList={vendorList}
                callFunction={getVendor}
                handleLocationParties={(val) => {
                  handleDrawer('vendorlist', false);
                  onInputChange(
                    { target: { name: 'vendor', value: val } },
                    { vendor_id: val?.id }
                  );
                }}
                handleAllParties={(val) => {
                  handleDrawer('vendorlist', false);
                  onInputChange(
                    { target: { name: 'vendor', value: val } },
                    { vendor_id: val?.id }
                  );
                }}
                addNewOne={() => {
                  handleTriggerSheet('vendorlist', false);
                  handleTriggerSheet('addvendor', true);
                }}
                dntCheckbox={dntCheckbox}
                onDoNotTrackVendor={(ps) => handleDoNotTrackVendor(ps)}
                hideLocation
                hideToggle
                hideEdit
                pagination={pagination}
                setPagination={setPagination}
                from="expenseReimbursement"
                // details={reimbursementOCRData}
              />
            </SelectBottomSheet>
            <SelectBottomSheet
              name="addvendor"
              open={drawer?.addvendor}
              triggerComponent={<></>}
              onTrigger={() => handleTriggerSheet('addvendor', true)}
              onClose={() => handleTriggerSheet('addvendor', false)}
              id="overFlowHidden"
            >
              <VendorList
                trigger="addManually"
                onClick={(val) => {
                  handleTriggerSheet('addvendor', false);
                  onInputChange(
                    { target: { name: 'vendor', value: val } },
                    { vendor_id: val?.id }
                  );
                }}
                updateVendorList={getVendor}
                continueFlow={() => handleTriggerSheet('addvendor', false)}
                closeAddVendor={() => handleTriggerSheet('addvendor', false)}
                panEnable
                // details={reimbursementOCRData}
              />
            </SelectBottomSheet>
          </Stack>
          {localState?.vendorName === 'Do Not Track Vendor' && <Stack direction="column" width="100%" gap="8px">
            <p className={css.labeltext}>
              Provider Name<span style={{ color: '#f00' }}>*</span>
            </p>
            <TextField
              type="text"
              className={classes.textfiledroot}
              name="providerName"
              onChange={onInputChange}
              onBlur={reValidate}
              error={validationErr.providerName}
              helperText={
                validationErr.providerName ? VALIDATION?.providerName?.errMsg : ''
              }
              value={localState?.providerName}
            />
          </Stack>}

          <Stack width="100%" gap="8px">
            <p
              className={desktopView ? css.labeltext : css.labeltextformobile}
              style={{ display: 'flex' }}
            >
              Category<span style={{ color: '#f00' }}>*</span>
            </p>
            {desktopView && (
              <FormControl sx={{ flexGrow: 1 }}>
                <Select
                  name="category"
                  value={localState?.category}
                  onChange={onInputChange}
                  input={<OutlinedInput className={classes.textfiledroot} />}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 224,
                        flexGrow: 1,
                        marginTop: 8,
                        padding: '0 8px',
                        minWidth: 350,
                      },
                    },
                  }}
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{
                    textTransform: 'capitalize !important',
                  }}
                >
                  {categoryList?.map((val) => (
                    <MenuItem
                      key={val?.id}
                      value={val?.name}
                      className={classes.menutext}
                    >
                      {val?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {!desktopView && (
              <Box
                className={`${css.opensheetfieldroot}`}
                width={desktopView ? '55%' : 'calc(100% - 18px)'}
                component={Stack}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                onClick={() => handleDrawer('categoryList', true)}
              >
                <p
                  style={{
                    color: localState?.category ? '#000' : '#A0A4AF',
                    textTransform: 'capitalize',
                  }}
                >
                  {localState?.category}
                </p>{' '}
                <KeyboardArrowDownIcon sx={{ color: '#0000008a' }} />
              </Box>
            )}
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
      <SelectBottomSheet
        open={drawer.categoryList}
        onClose={() => handleDrawer('categoryList', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <div className={css.addnewprovider}>
          <Puller />
          <Stack>
            <Box padding={desktopView ? '20px' : '36px 20px 0px'}>
              <p className={css.headertext}>Select Category</p>
            </Box>
            <Box sx={{ overflow: 'auto', height: '38vh' }}>
              {categoryList?.map((val) => (
                <MenuItem
                  key={val?.id}
                  value={val?.id}
                  onClick={() => {
                    setLocalState({
                      ...localState,
                      category: val?.name,
                      expense_category_id: val?.id,
                    });
                    handleDrawer('categoryList', false);
                  }}
                  className={classes.menutext}
                  style={{
                    background:
                      localState?.expense_category_id === val?.id &&
                      '#f08b3250',
                  }}
                >
                  {val?.name}
                </MenuItem>
              ))}
            </Box>
          </Stack>
        </div>
      </SelectBottomSheet>
    </div>
  );
};

export default AddEmailBillProvider;
