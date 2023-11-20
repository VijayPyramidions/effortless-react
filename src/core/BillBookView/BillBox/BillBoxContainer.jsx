import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import JSBridge from '@nativeBridge/jsbridge';

import { useDispatch, useSelector } from 'react-redux';
import {
  GetVendorBillsCountState,
  GetBillBoxBillsState,
  ClearStateGetBillBoxBills,
  ClearStateGetVendorBillsCount,
} from '@action/Store/Reducers/Bills/BillBoxState';
import { ClearStateGetEmailBillsList } from '@action/Store/Reducers/Bills/EmailBillsState';
import { GetMemberListState } from '@action/Store/Reducers/General/GeneralState';
import {
  enableLoading,
  openSnackbar,
} from '@action/Store/Reducers/Errors/Errors';

import axiosInst, { BASE_URL } from '@action/ApiConfig/AxiosInst';
import { DirectUpload } from '@rails/activestorage';

import {
  Box,
  Button,
  Stack,
  Typography,
  Tab,
  Tabs,
  TextField,
  IconButton,
  // MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import { TabContext, TabPanel } from '@mui/lab';
import InputAdornment from '@mui/material/InputAdornment';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import { SearchIconModule } from '@components/SvgIcons/SvgIcons.jsx';

import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@mui/icons-material/Search';

import { CustomSearchLoadingSkeleton } from '@components/SkeletonLoad/SkeletonLoader';
import useDebounce from '@components/Debounce/Debounce.jsx';
import AppContext from '@root/AppContext.jsx';
import BillBoxScan from './BillScan/BillBoxScan';

import accounted_bill_box from '../../../assets/BillsLogo/accounted_bill_box.svg';
import assigned_bills from '../../../assets/BillsLogo/assigned_bills.svg';
import draft_bill_box from '../../../assets/BillsLogo/draft_bill_box.svg';
import upload_bills from '../../../assets/BillsLogo/upload_bills.svg';

import ScannedBills from './ScannedBills';
import EmailBills from './EmailBills';

import * as css from './billBox.scss';

const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#f08b32',
    color: '#f08b32',
    boxShadow: `0 0 0 2px #f08b32`,
    '&::after': {
      position: 'absolute',
      top: -1,
      left: -1,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const useStyles = makeStyles({
  tabs: {
    borderBottom: '1px solid #E5E5E5',
    paddingLeft: '16px',
    '& .MuiTab-root': {
      textTransform: 'capitalize',
      fontFamily: 'Lexend, sans-serif !important',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '20px',
      color: '#00000080',
      padding: '12px 16px',
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#F08B32',
      height: 2,
    },
    '& .MuiTab-root.Mui-selected': {
      color: '#F08B32',
      fontWeight: 500,
      fontSize: '14px',
    },
  },
});

const BillBox = () => {
  const { currentUserInfo, organization } = useContext(AppContext);

  const themes = useTheme();
  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));

  const dispatch = useDispatch();
  const { VendorBillsCounts } = useSelector((value) => value.BillBox);
  const { memberEntity, memberEntityLoad } = useSelector(
    (value) => value.General
  );

  const classes = useStyles();

  const navigate = useNavigate();
  const { state } = useLocation();

  const [ShowButton, setShowButton] = useState(
    state?.showButton || 'Scanned Bills'
  );
  const [BillShow, setBillShow] = useState('grid');
  const [drawer, setDrawer] = useState({});
  const [EntityList, setEntityList] = useState([]);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const [localFilter, setLocalfilter] = useState(null);
  const [billScan, setBillScan] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({ files: [], done: [] });

  const debounceEmployeeQuery = useDebounce(employeeSearchQuery);
  const debounceQuery = useDebounce(searchQuery);

  const handleDrawer = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const handleChange = (e, newValue) => {
    e.stopPropagation();

    setShowButton(newValue);
  };

  const EntityListCall = (searchVal) => {
    dispatch(
      GetMemberListState({
        pageNum: 1,
        searchText: searchVal || '',
      })
    );
  };

  const getOcrData = (id) => {
    dispatch(enableLoading(true));
    axiosInst
      .post(`organizations/${organization.orgId}/vendor_bills?ocr=true`, {
        file: id,
        scanned: true,
      })
      .then((res) => {
        if (res && !res?.data?.error) {
          setSelectedFiles((prev) => ({
            ...prev,
            done: [...prev?.done, id],
          }));
          dispatch(enableLoading(false));
        } else {
          dispatch(enableLoading(false));
          const errorValues = Object.values(res?.data?.errors);
          dispatch(
            openSnackbar({
              message: errorValues.join(', '),
              type: 'error',
            })
          );
        }
      })
      .catch((e) => {
        console.log('getOcrDataError', e);
        dispatch(
          openSnackbar({
            message: 'Unknown error occured',
            type: 'error',
          })
        );
        dispatch(enableLoading(false));
      });
  };

  const uploadFile = (file) => {
    const url = `${BASE_URL}/direct_uploads`;
    const upload = new DirectUpload(file, url);
    dispatch(enableLoading(true));
    upload.create(async (error, blob) => {
      dispatch(enableLoading(false));
      if (error) {
        dispatch(
          openSnackbar({
            message: 'Unknown error occured',
            type: 'error',
          })
        );
      } else {
        const id = blob?.signed_id;
        await getOcrData(id);
      }
    });
  };

  const onFileUpload = async (e) => {
    const tempFiles = e?.target?.files;
    setSelectedFiles({ files: e?.target?.files, done: [] });

    for (let i = 0; i < tempFiles?.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await uploadFile(tempFiles[i]);
    }
  };

  useEffect(() => {
    if (memberEntity?.data) {
      const tempArr = memberEntity?.data?.filter(
        (val) => val?.user_id === currentUserInfo?.id
      );
      let tempData = [];
      if (tempArr?.length > 0) {
        const tempArrTwo = memberEntity?.data?.filter(
          (val) => val?.user_id !== currentUserInfo?.id
        );
        tempData = [...tempArr, ...tempArrTwo];
      } else {
        tempData = [...memberEntity?.data];
      }
      if (memberEntity?.page === 1) {
        setEntityList(tempData);
      } else {
        setEntityList((prev) => [...prev, ...tempData]);
      }
    }
  }, [JSON.stringify(memberEntity)]);

  useEffect(() => {
    if (debounceEmployeeQuery !== false) {
      EntityListCall(debounceEmployeeQuery);
    }
  }, [debounceEmployeeQuery]);

  useEffect(() => {
    dispatch(GetVendorBillsCountState());
    EntityListCall();
    return () => {
      dispatch(ClearStateGetVendorBillsCount());
    };
  }, []);

  useEffect(() => {
    if (ShowButton === 'Email Bills') {
      dispatch(ClearStateGetBillBoxBills());
    }
    if (ShowButton === 'Scanned Bills') {
      dispatch(ClearStateGetEmailBillsList());
    }
    setBillShow('grid');
    setSearchQuery(null);
  }, [ShowButton]);

  useEffect(() => {
    if (
      Object.values(selectedFiles?.files || {})?.length > 0 &&
      Object.values(selectedFiles?.files || {})?.length ===
        selectedFiles?.done?.length
    ) {
      dispatch(
        GetBillBoxBillsState({
          scanned: true,
          load: true,
        })
      );
      setSelectedFiles({ files: [], done: [] });
      const fileInput = document.getElementById('file');
      fileInput.value = null;
    }
  }, [JSON.stringify(selectedFiles)]);

  return (
    <Box
      className={
        desktopView ? css.billbox_container : css.billbox_container_mobile
      }
    >
      {state?.from !== 'recordExpense' && (
        <Stack
          direction="row"
          gap={desktopView ? '20px' : '16px'}
          height="auto"
          alignItems="center"
          mb={desktopView ? '24px' : 0}
          padding={desktopView ? '4px' : '20px'}
          width={desktopView ? 'calc(100% - 8px)' : 'calc(100% - 40px)'}
          // overflow={!desktopView && 'auto'}
          sx={{ overflowX: 'auto', overflowY: 'hidden' }}
        >
          {[
            {
              id: 1,
              name: desktopView ? 'Accounted Bills' : 'Accounted',
              item:
                VendorBillsCounts?.vendor_bill_section?.accounted_count || 0,
              icon: accounted_bill_box,
              color: '#B1E9D0',
              click: '/bill-accounted',
            },
            {
              id: 2,
              name: desktopView ? 'Assigned Bills' : 'Assign Bills',
              item: VendorBillsCounts?.vendor_bill_section?.in_queue_count || 0,
              icon: assigned_bills,
              color: '#FEF8EE',
              click: '/bill-queue',
            },
            {
              id: 3,
              name: 'Draft Bills',
              item: VendorBillsCounts?.vendor_bill_section?.draft_count || 0,
              icon: draft_bill_box,
              color: '#EFEFEF',
              click: '/bill-draft',
            },
          ]?.map((data) => (
            <Box
              className={css.billbox_card}
              key={data?.id}
              onClick={() => navigate(data?.click)}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={desktopView ? '8px' : '4px'}
                pb={desktopView ? '10px' : '8px'}
              >
                <Box sx={{ background: data?.color }} className={css.img_box}>
                  <img src={data?.icon} alt={data?.name} />
                </Box>
                <Typography className={css.cardheader}>{data?.name}</Typography>
              </Stack>
              <Typography className={css.numberofitems}>
                {data?.item} Items
              </Typography>
            </Box>
          ))}
          {desktopView && (
            <Button
              className={css.recordbutton}
              onClick={() => navigate('/bill-upload')}
            >
              <AddIcon style={{ fontSize: '16px' }} /> Record An Expense
            </Button>
          )}
        </Stack>
      )}

      <Box className={css.billbox_main} mb={desktopView ? '20px' : 0}>
        <Stack
          direction={desktopView ? 'row' : 'column'}
          justifyContent="space-between"
          p={desktopView ? '24px 24px 0' : '0 20px 20px'}
          alignItems={desktopView && 'center'}
          gap={desktopView ? 0 : '22px'}
        >
          {desktopView ? (
            <Typography className={css.headtext}>Unaccounted Bills</Typography>
          ) : (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography className={css.headertext}>
                Unaccounted Bills
              </Typography>
              {ShowButton === 'Scanned Bills' && (
                <Typography
                  component={Button}
                  className={css.addbillbtn}
                  onClick={() => {
                    setBillScan(true);
                    JSBridge.ocrByScan('BillboxOcr');
                  }}
                >
                  <AddIcon style={{ fontSize: '16px', marginRight: '4px' }} />{' '}
                  Add Bill
                </Typography>
              )}
            </Stack>
          )}
          <>
            <Stack
              direction={desktopView ? 'row' : 'row-reverse'}
              gap="16px"
              alignItems="center"
            >
              {desktopView && ShowButton === 'Scanned Bills' && (
                <>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="inputfile"
                    accept="image/png, image/jpeg, application/pdf"
                    onChange={onFileUpload}
                    hidden
                    multiple
                  />
                  <label htmlFor="file">
                    <div className={css.secondarybutton} htmlFor="file">
                      <img src={upload_bills} alt="upload" />
                      <Typography>Upload Bills</Typography>
                    </div>
                  </label>
                </>
              )}
              {ShowButton === 'Scanned Bills' && (
                <Box
                  component={Stack}
                  direction="row"
                  alignItems="center"
                  className={css.viewchangebox}
                >
                  <Box
                    className={
                      BillShow === 'grid' ? css.show_view : css.hide_view
                    }
                    onClick={() => setBillShow('grid')}
                  >
                    <GridViewIcon />
                  </Box>
                  <Box
                    className={
                      BillShow === 'list' ? css.show_view : css.hide_view
                    }
                    onClick={() => setBillShow('list')}
                  >
                    <ListIcon />
                  </Box>
                </Box>
              )}

              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIconModule />
                    </InputAdornment>
                  ),
                }}
                focused={false}
                sx={{
                  width: desktopView ? '240px' : '214px',
                  marginRight: 'auto',
                  '& .MuiInputBase-input': {
                    padding: '10px 0',
                    fontSize: 12,
                  },
                  '& .MuiOutlinedInput-root': {
                    paddingLeft: '8px',
                  },
                }}
                placeholder={`Search ${ShowButton}`}
                value={searchQuery || ''}
                onChange={(e) => {
                  setSearchQuery(e?.target?.value);
                }}
              />

              {desktopView && ShowButton === 'Scanned Bills' && (
                <IconButton
                  overlap="circular"
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  variant="dot"
                  className={css.filterbox}
                  component={
                    Object.keys(localFilter || {})?.length > 0
                      ? StyledBadge
                      : Stack
                  }
                  onClick={() => handleDrawer('bill_filter', true)}
                >
                  <FilterListIcon />
                </IconButton>
              )}
            </Stack>
          </>
        </Stack>
        <TabContext value={ShowButton}>
          <Box
            style={{
              height:
                desktopView &&
                (ShowButton === 'Scanned Bills'
                  ? 'calc(100% - 80px)'
                  : 'calc(100% - 60px)'),
            }}
          >
            <Tabs
              value={ShowButton}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons={false}
              className={`${classes.tabs}`}
            >
              {['Scanned Bills', 'Email Bills']?.map((val) => (
                <Tab label={val} value={val} />
              ))}
              {!desktopView && ShowButton === 'Scanned Bills' && (
                <IconButton
                  overlap="circular"
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  variant="dot"
                  className={css.filterbox}
                  component={
                    Object.keys(localFilter || {})?.length > 0
                      ? StyledBadge
                      : Stack
                  }
                  onClick={() => handleDrawer('bill_filter', true)}
                >
                  <FilterListIcon />
                </IconButton>
              )}
            </Tabs>
            {['Scanned Bills', 'Email Bills']?.map((val) => (
              <TabPanel
                value={val}
                id={val}
                sx={{
                  height:
                    state?.from === 'recordExpense'
                      ? (desktopView && 'calc(100vh - 240px)') ||
                        'calc(100vh - 250px)'
                      : (desktopView &&
                          (ShowButton === 'Scanned Bills'
                            ? 'calc(100vh - 360px)'
                            : 'calc(100vh - 340px)')) ||
                        'calc(100vh - 370px)',
                  overflow: 'auto',
                  padding: 0,
                  borderRadius: desktopView && '0 0 16px 16px',
                }}
              >
                {val === 'Scanned Bills' && (
                  <ScannedBills
                    show={BillShow}
                    employeeFilter={localFilter}
                    debounceSearchQuery={debounceQuery}
                    height={
                      state?.from === 'recordExpense'
                        ? 'calc(100vh - 240px)'
                        : 'calc(100vh - 360px)'
                    }
                  />
                )}
                {val === 'Email Bills' && (
                  <EmailBills debounceSearchQuery={debounceQuery} />
                )}
              </TabPanel>
            ))}
          </Box>
        </TabContext>
      </Box>
      <SelectBottomSheet
        open={drawer?.bill_filter}
        onClose={() => handleDrawer('bill_filter', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
        styleDrawerMinHeight="auto"
      >
        <div>
          {!desktopView && <Puller />}
          <Stack className={css.employeeFilter}>
            <Box padding="36px 20px 8px">
              <p className={css.headertext}>Select Employee</p>
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
                padding: '8px 20px',
                '& .MuiInputBase-input': {
                  padding: '8px 0 !important',
                },
              }}
              focused={false}
              placeholder="Search Employee"
              value={employeeSearchQuery || ''}
              onChange={(e) => {
                setEmployeeSearchQuery(e?.target?.value);
              }}
            />

            <div
              style={{
                maxHeight: desktopView ? '80vh' : '54vh',
                overflow: 'auto',
                padding: '0 16px',
              }}
            >
              {memberEntityLoad === null && EntityList?.length === 0 && (
                <div>
                  <CustomSearchLoadingSkeleton />
                </div>
              )}
              {memberEntityLoad && EntityList?.length === 0 && (
                <div style={{ margin: '16px 0' }}>
                  <p style={{ textAlign: 'center' }}>No Data Found.</p>
                </div>
              )}
              {EntityList?.length > 0 &&
                memberEntityLoad &&
                EntityList?.map((val) => (
                  <MenuItem
                    key={val?.user_id}
                    value={val?.user_id}
                    onClick={() => {
                      if (localFilter?.user_id === val?.user_id) {
                        setLocalfilter({});
                      } else {
                        setLocalfilter(val);
                      }
                      handleDrawer('bill_filter', false);
                    }}
                    className={css.menutext}
                    style={{
                      background:
                        localFilter?.user_id === val?.user_id && '#f08b3250',
                    }}
                  >
                    {currentUserInfo?.id === val?.user_id
                      ? 'Your Bills'
                      : val?.name}
                  </MenuItem>
                ))}
            </div>
          </Stack>
        </div>
      </SelectBottomSheet>
      {billScan && <BillBoxScan setBillScan={setBillScan} />}
    </Box>
  );
};

export default BillBox;
