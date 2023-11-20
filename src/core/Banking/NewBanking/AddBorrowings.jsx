import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  // ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
// import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { DirectUpload } from '@rails/activestorage';

import { BASE_URL } from '@action/ApiConfig/AxiosInst';
import { MESSAGE_TYPE } from '@components/SnackBarContainer/SnackBarContainer';

import {
  closeBorrowing,
  getLenders,
  addBorrowing,
} from '@action/Store/Reducers/Banking/BankingState';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import { InputText } from '@components/Input/Input';
import { SelectField, SelectAutoComplete } from '@components/Select/Select';
import PopperComp from '@components/Popper/PopperComp';
import SearchIcon from '@assets/search.svg';

import * as css from './bankingnew.scss';

const TextfieldStyle = (props) => {
  return (
    <InputText
      {...props}
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      required
      theme="light"
      className={css.textfieldStyle}
    />
  );
};

const initialState = {
  lenderId: '',
  fileId: '',
  lender: '',
  category: '',
  purpose: '',
};

const initialErrorStae = Object.keys(initialState).reduce((acc, key) => {
  if (key === 'fileId') acc[key] = true;
  else acc[key] = false;
  return acc;
}, {});

const AddBorrowings = () => {
  const dispatch = useDispatch();

  const { Lenders } = useSelector((state) => state.Banking);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [search, setSearch] = useState('');
  const [lenderState, setLenderState] = useState(initialState);

  const [errorState, setErrorState] = useState(initialErrorStae);

  const LenderOnchange = (val) => () => {
    setLenderState((prev) => ({
      ...prev,
      lender: val.short_name,
      lenderId: val.id,
    }));
    setErrorState((prev) => ({ ...prev, lender: false }));

    setAnchorEl(null);
  };

  const hanldeChange = (e) => {
    const { name, value } = e.target;

    setLenderState((prev) => ({ ...prev, [name]: value }));

    if (value === '') setErrorState((prev) => ({ ...prev, [name]: true }));
    else setErrorState((prev) => ({ ...prev, [name]: false }));
  };

  const fileUpload = (e) => {
    dispatch(enableLoading(true));
    const file = e?.target?.files[0];
    const url = `${BASE_URL}/direct_uploads`;
    const upload = new DirectUpload(file, url);
    upload.create((error, blob) => {
      if (error) {
        dispatch(
          openSnackbar({ message: error?.message, type: MESSAGE_TYPE.ERROR })
        );
      } else {
        dispatch(enableLoading(false));
        setLenderState((prev) => ({ ...prev, fileId: blob?.signed_id }));
      }
    });
  };

  const onSubmit = () => {
    Object.keys(lenderState).forEach((item) => {
      if (lenderState[item] === '')
        setErrorState((prev) => ({ ...prev, [item]: true }));
      else setErrorState((prev) => ({ ...prev, [item]: false }));
    });

    const valid = Object.values(lenderState).every((val) => !!val);

    if (lenderState.fileId === '') {
      dispatch(
        openSnackbar({
          message: 'Please select file',
          type: MESSAGE_TYPE.ERROR,
        })
      );
      return;
    }

    if (valid) {
      dispatch(enableLoading(true));

      dispatch(addBorrowing(lenderState));
    }
  };

  useEffect(() => {
    dispatch(getLenders(search));
  }, [dispatch, search]);

  return (
    <Box className={css.formContainer}>
      <PopperComp
        openProps={open}
        anchorElProps={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        className={css.popOver}
        subClass={css.popOverBox}
      >
        <Stack>
          <Stack className={css.searchInputwrp}>
            <IconButton className={css.searchicon}>
              <img src={SearchIcon} alt="Seach Icons" width={16} height={16} />
            </IconButton>
            <input
              placeholder="Search a Lender"
              className={css.searchInput}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </Stack>
          <List className={css.menulist}>
            {Lenders?.data?.slice(0, 6)?.map((val) => (
              <ListItem className={css.listitems} onClick={LenderOnchange(val)}>
                <ListItemText
                  primary={val.short_name}
                  className={css.ListItemText}
                />
              </ListItem>
            ))}
            {Lenders?.data?.length === 0 && (
              <ListItem className={`${css.listitems} ${css.addlist}`}>
                <ListItemText
                  primary="No lender found..."
                  className={css.ListItemText}
                />
              </ListItem>
            )}
            {/* <ListItem className={`${css.listitems} ${css.addlist}`}>
              <ListItemIcon className={css.listicons}>
                <AddRoundedIcon sx={{ height: '20px', width: '20px' }} />
              </ListItemIcon>
              <ListItemText
                primary="Add New Lender"
                className={`${css.ListItemText} ${css.addlisttext}`}
              />
            </ListItem> */}
          </List>
        </Stack>
      </PopperComp>
      <Typography variant="h4" className={css.fromContainer_header}>
        Add Borrowing
      </Typography>
      <Stack>
        <SelectField
          label="Select Category"
          name="category"
          value={lenderState.category}
          required
          options={[
            {
              payload: 'term loan',
              text: 'Term Loan',
            },
            {
              payload: 'emi',
              text: 'EMI',
            },
            // {
            //   payload: 'overdraft',
            //   text: 'Over Draft',
            // },
          ]}
          error={errorState.category}
          helperText={errorState.category ? 'Select any category' : ''}
          // onBlur={reValidate}
          onChange={hanldeChange}
        />

        <SelectAutoComplete
          label="Select Lender"
          name="lender"
          required
          value={lenderState.lender}
          onClick={(event) => {
            setAnchorEl(event.currentTarget);
          }}
          error={errorState.lender}
          helperText={errorState.lender ? 'Select one Lender' : ''}
        />
        {/* <TextfieldStyle
          label="Lender Name"
          name="lenderName"
          className={css.textFieldSize}
        />
        <TextfieldStyle
          label="Address"
          name="Address"
          className={css.textFieldSize}
        />
        <Box sx={{ display: 'flex', gap: '24px' }}>
          <TextfieldStyle
            label="Pin Code"
            name="pincode"
            type="number"
            className={css.textFieldSize}
          />
          <TextfieldStyle
            label="City/Town"
            name="city"
            className={css.textFieldSize}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: '24px' }}>
          <TextfieldStyle
            label="State"
            name="state"
            className={css.textFieldSize}
          />
          <SelectField
            label="Country"
            name="country"
            required
            options={[
              {
                payload: 'male',
                text: 'Male',
              },
              {
                payload: 'female',
                text: 'Female',
              },
            ]}
          />
        </Box>
        <TextfieldStyle
          label="Contact Name"
          name="contactName"
          className={css.textFieldSize}
        />

        <InputText
          label="Contact Phone Number"
          name="contactPhoneNumber"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          theme="light"
          className={css.textfieldStyle}
        />
        <InputText
          label="Contact Email Id"
          name="contactEmail"
          variant="standard"
          InputLabelProps={{
            shrink: true,
          }}
          theme="light"
          className={css.textfieldStyle}
        /> */}
        <TextfieldStyle
          label="Purpose"
          name="purpose"
          value={lenderState.purpose}
          className={css.textFieldSize}
          onChange={hanldeChange}
          error={errorState.purpose}
          helperText={errorState.purpose ? 'Please enter the purpose' : ''}
        />

        <Typography className={css.fileuploadlabel}>
          Upload EMI Schedule
        </Typography>
        <input
          label="Purpose"
          name="purpose"
          type="file"
          size="104px"
          className={css.fileinput}
          onChange={fileUpload}
        />
        <Stack className={css.fromContainer_btnwrp}>
          <Button
            className={css.fromContainer_cancelbtn}
            onClick={() => dispatch(closeBorrowing())}
          >
            Cancel
          </Button>
          <Button className={css.fromContainer_successbtn} onClick={onSubmit}>
            Send to SuperAccountant
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddBorrowings;
