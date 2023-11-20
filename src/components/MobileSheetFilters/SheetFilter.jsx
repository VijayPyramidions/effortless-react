import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';

import {
  GetCustomerEntityState,
  ClearSateCustomerEntity,
  GetVendorEntityState,
  ClearSateVendorEntity,
} from '@action/Store/Reducers/General/GeneralState';

import {
  MenuItem,
  Stack,
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
} from '@mui/material';
import { makeStyles, styled } from '@material-ui/core/styles';
import SearchIcon from '@mui/icons-material/Search';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
// import CustomCheckbox from '@components/Checkbox/Checkbox';

import CalendarIcon from '@mui/icons-material/CalendarToday';
import useDebounce from '@components/Debounce/Debounce.jsx';

import Calender from '@core/InvoiceView/Calander';
import { CustomSearchLoadingSkeleton } from '../SkeletonLoad/SkeletonLoader';

import * as css from './SheetFilterMain.scss';

const useStyles = makeStyles({
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

export const EntityFilter = ({
  EntityType,
  listSelection,
  handleSelection,
  stateSearchText,
  setMainSearchQuery,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { customerEntity, customerLoad, vendorEntity, vendorLoad } =
    useSelector((value) => value.General);
  const [searchQuery, setSearchQuery] = useState(stateSearchText || false);
  const [EntityList, setEntityList] = useState([]);
  const debounceQuery = useDebounce(searchQuery);

  const EntityListCall = (searchVal) => {
    if (EntityType === 'customer') {
      dispatch(
        GetCustomerEntityState({
          allParties: false,
          pageNum: 1,
          searchText: searchVal || '',
          location: false,
        }),
      );
    }
    if (EntityType === 'vendor') {
      dispatch(
        GetVendorEntityState({
          allParties: false,
          pageNum: 1,
          searchText: searchVal || '',
          location: false,
          // entire,
        }),
      );
    }
  };

  const handleDataSet = (data) => {
    if (listSelection?.map((val) => val?.id)?.includes(data?.id)) {
      handleSelection(listSelection?.filter((val) => val?.id !== data?.id));
    } else {
      handleSelection([...listSelection, data]);
    }
  };

  const LoadSheet = () => {
    if (EntityType === 'customer') {
      return customerLoad;
    }
    return vendorLoad;
  };

  useEffect(() => {
    return () => {
      dispatch(ClearSateCustomerEntity());
      dispatch(ClearSateVendorEntity());
    };
  }, []);

  useEffect(() => {
    if (
      Object.keys(customerEntity || {})?.length > 0 &&
      EntityType === 'customer'
    ) {
      if (customerEntity?.page === 1) {
        setEntityList(customerEntity?.data);
      } else {
        setEntityList((prev) => [...prev, ...customerEntity?.data]);
      }
    }
  }, [customerEntity, EntityType]);

  useEffect(() => {
    if (
      Object.keys(vendorEntity || {})?.length > 0 &&
      EntityType === 'vendor'
    ) {
      if (vendorEntity?.page === 1) {
        setEntityList(vendorEntity?.data);
      } else {
        setEntityList((prev) => [...prev, ...vendorEntity?.data]);
      }
    }
  }, [vendorEntity, EntityType]);

  useEffect(() => {
    // if (debounceQuery !== false) {
    EntityListCall(debounceQuery);
    if (setMainSearchQuery) setMainSearchQuery(debounceQuery);
    // }
  }, [debounceQuery]);

  return (
    <div className={css.entitysheet}>
      <Puller />
      <Stack>
        <Box padding="36px 20px 20px">
          <p className={css.headertext}>Select {EntityType}</p>
        </Box>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 'calc(100% - 40px)',
            padding: '0 20px',
          }}
          focused={false}
          placeholder={`Search ${EntityType}`}
          value={searchQuery || ''}
          onChange={(e) => {
            setSearchQuery(e?.target?.value);
          }}
        />
        <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
          {LoadSheet() === null && EntityList?.length === 0 && (
            <div>
              <CustomSearchLoadingSkeleton />
            </div>
          )}
          {LoadSheet() && EntityList?.length === 0 && (
            <div style={{ margin: '16px 0' }}>
              <p style={{ textAlign: 'center' }}>No Data Found.</p>
            </div>
          )}
          {EntityList?.length > 0 &&
            LoadSheet() &&
            EntityList?.map((data) => (
              <MenuItem key={data?.id} className={classes.menutext}>
                <FormControlLabel
                  value={data?.id}
                  style={{
                    textTransform: 'capitalize',
                    whiteSpace: 'break-spaces',
                    width: '100%',
                  }}
                  control={
                    <Checkbox
                      style={{
                        color: '#F08B32',
                        textTransform: 'capitalize',
                      }}
                      checked={listSelection
                        ?.map((val) => val?.id)
                        ?.includes(data?.id)}
                      onChange={(event) => {
                        event?.persist();
                        handleDataSet(data);
                      }}
                    />
                  }
                  label={data?.short_name?.toLowerCase()}
                />
              </MenuItem>
            ))}
        </div>
      </Stack>
    </div>
  );
};

export const DateFilter = ({ Title, listSelection, handleSelection }) => {
  const [drawer, setDrawer] = useState(false);

  const handleDate = (val, name) => {
    handleSelection({
      ...listSelection,
      [name]: val,
    });
    setDrawer((d) => ({ ...d, [name]: false }));
  };

  return (
    <div className={css.datesheet}>
      <Puller />
      <Stack>
        <Box padding="36px 20px 20px">
          <p className={css.headertext}>{Title}</p>
        </Box>
        <Stack
          direction="column"
          gap="16px"
          sx={{ maxHeight: '50vh', padding: '20px' }}
        >
          <div
            className={css.mobiledate}
            onClick={() => {
              setDrawer({ ...drawer, startDate: true });
            }}
          >
            <p className={css.mobiledatelabel}>Start Date</p>
            <div className={css.mobiledatefield}>
              <input
                type="text"
                value={
                  listSelection?.startDate
                    ? moment(listSelection?.startDate).format('DD-MM-YYYY')
                    : 'dd-mm-yyyy'
                }
                className={css.mobiledateinput}
              />
              <CalendarIcon style={{ width: 20, color: '#949494' }} />
            </div>
          </div>

          <div
            className={css.mobiledate}
            onClick={() => {
              setDrawer({ ...drawer, endDate: true });
            }}
          >
            <p className={css.mobiledatelabel}>End Date</p>
            <div className={css.mobiledatefield}>
              <input
                type="text"
                value={
                  listSelection?.endDate
                    ? moment(listSelection?.endDate).format('DD-MM-YYYY')
                    : 'dd-mm-yyyy'
                }
                className={css.mobiledateinput}
              />
              <CalendarIcon style={{ width: 20, color: '#949494' }} />
            </div>
          </div>
        </Stack>
      </Stack>
      <SelectBottomSheet
        name="startDate"
        addNewSheet
        triggerComponent={<></>}
        open={drawer.startDate}
        onClose={() => setDrawer({ ...drawer, startDate: false })}
      >
        <Calender
          head="Select Start Date"
          button="Select"
          handleDate={(e) => handleDate(e, 'startDate')}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        name="endDate"
        addNewSheet
        triggerComponent={<></>}
        open={drawer.endDate}
        onClose={() => setDrawer({ ...drawer, endDate: false })}
      >
        <Calender
          head="Select End Date"
          button="Select"
          handleDate={(e) => handleDate(e, 'endDate')}
        />
      </SelectBottomSheet>
    </div>
  );
};
