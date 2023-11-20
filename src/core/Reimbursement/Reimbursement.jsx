import React, { memo, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import {
  getClaims,
  setDrawer,
  getManagers,
  getOneClaim,
  deleteClaim,
  setAdvanceRes,
  setOnClaim,
  setReimbursementPerformanceAction,
  clearReimbursementPerformanceAction,
  setClaimDetailsForBillPatch,
  setTripSave,
  getTrips,
  setTrips,
  setClaims,
  setTripViewState,
} from '@action/Store/Reducers/Reimbursement/ReimbursementState';

import {
  getReimbursements,
  getOneReimbursement,
  setOneReimbursement,
} from '@action/Store/Reducers/Settings/ReimburssementSettingsState';

import {
  Stack,
  Box,
  Typography,
  Button,
  Tab,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled, makeStyles } from '@material-ui/core/styles';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';
import approval from '@assets/approval.svg';
import rightArrow from '@assets/chevron-right.svg';

import {
  SyncAltRounded as SyncAltRoundedIcon,
  AddRounded as AddRoundedIcon,
  KeyboardArrowRightRounded as KeyboardArrowRightRoundedIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import AppContext from '@root/AppContext';
import { PermissionDialog } from '@components/Permissions/PermissionDialog';

import { IndianCurrencyNoSymbol } from '@components/utils';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';

import ExpenseRequirementForm from './Components/ExpenseRequirementForm';
import MilageRequirementForm from './Components/MileageRequirementForm';
import TripRequirementForm from './Components/TripRequirementForm';
import { StyledMenu } from '../Banking/NewBanking/Statement/util';

import HeaderContainer from './Components/Mobile/HeaderContainer';
import FilterContainer from './Components/Mobile/FilterContainer';
import TripCard from './Components/Mobile/TripCard';
import { RequestTripAdvanceForm } from './Components/TripAdvanceForm';
import {
  TripDetailsMobileSheet,
  ExpenseDetailsMobileSheet,
  DeleteContent,
} from './Components/ReimbursementActionSheets';
import * as css from './reimbursement.scss';
// import TripDetailsView from './Components/TripDetailsView';

// status - (draft submitted paid partially_paid request declined cancelled approved)

const Puller = styled(Box)(() => ({
  width: '50px',
  height: 6,
  backgroundColor: '#C4C4C4',
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
      <GridToolbarQuickFilter sx={{ marginLeft: 'auto' }} />
    </GridToolbarContainer>
  );
}

export const StatusComponents = {
  draft: (
    <>
      <Typography className={css.draft}>draft</Typography>
    </>
  ),
  submitted: (
    <>
      <Typography className={css.submitted}>submitted</Typography>
    </>
  ),
  paid: (
    <>
      <Typography className={css.paid}>paid</Typography>
    </>
  ),
  partially_paid: (
    <>
      <Typography className={css.partiallypaid}>partially paid</Typography>
    </>
  ),
  requested: (
    <>
      <Typography className={css.request}>requested</Typography>
    </>
  ),
  declined: (
    <>
      <Typography className={css.declined}>reject</Typography>
    </>
  ),
  cancelled: (
    <>
      <Typography className={css.cancelled}>cancelled</Typography>
    </>
  ),
  approved: (
    <>
      <Typography className={css.approved}>approved</Typography>
    </>
  ),
};

const reimbursementItems = [
  {
    id: 'expense',
    label: 'Expense Reimbursement',
  },
  {
    id: 'mileage',
    label: 'Mileage Reimbursement',
  },
  {
    id: 'trip',
    label: 'Trip',
  },
];

const style = {
  border: 'none',
  borderWidth: 'unset !important',
  borderStyle: 'none !important',
  borderColor: 'unset !important',

  '& .MuiDataGrid-columnHeadersInner': {
    background: '#F7F7F7',
    flex: 1,
  },

  '& .MuiDataGrid-columnHeader': {
    height: '40px !important',
  },

  '& .MuiDataGrid-cell': {
    minHeight: '56px !important',
    maxHeight: '56px !important',
  },

  '& .MuiDataGrid-row': {
    minHeight: '56px !important',
    maxHeight: '56px !important',
    borderBottom: '1px solid #E5E5E5',
  },

  '& .MuiDataGrid-columnSeparator': { display: 'none' },
};

const useStyles = makeStyles(() => ({
  menuLineIems: {
    display: 'flex !important',
    flexFlow: 'column nowrap',
    alignItems: 'flex-start !important',
    padding: '0px 16px 6px !important',
  },
}));

const Reimbursement = () => {
  const themes = useTheme();
  const classes = useStyles();
  const desktopView = useMediaQuery(themes.breakpoints.up('sm'));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUserInfo, userPermissions } = useContext(AppContext);

  const [value, setValue] = useState('outstanding');
  const [actionType, setActionType] = useState('new');
  const [selectedRow, setSelectedRow] = useState({});
  const [actionAdvance, setActionAdvance] = useState('new');
  const [selectedTip, setSelectedTip] = useState({});
  const [expenseTab, setExpenseTab] = useState('expense');
  const [mobileDrawer, setMobileDrawer] = useState({});
  const [havePermission, setHavePermission] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMobile = Boolean(anchorEl);
  const [optionsAnchor, setOptionAnchor] = useState(null);
  const open = Boolean(optionsAnchor);

  const [TripSheet, setTripSheet] = useState('');
  const [localDrawer, setLocalDrawer] = useState({});

  const [valueOptionsFilter, setValueOptionsFilter] = useState([]);

  const coloumsOutStanding = [
    {
      field: 'number',
      headerName: 'ID',
      width: 60,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Typography sx={{ color: '#3049BF', fontSize: '14px' }}>
          {param?.row?.number}
        </Typography>
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Category',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: 'vendor_name',
      headerName: 'Vendor',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => param?.row?.vendor_name || '-',
      type: 'singleSelect',
      valueOptions: valueOptionsFilter,
      // {
      //   let value;
      //   if (param.row.name === 'Own Vehicle Expenses')
      //     value = param?.row?.client_name || '-';
      //   else value = param?.row?.vendor_name || '-';

      //   return value;
      // },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      groupable: false,
      // sortable: false,
      flex: 1,
      renderCell: (param) => StatusComponents[param.row.status],
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
  ];

  const coloumsTripOutStanding = [
    {
      field: 'number',
      headerName: 'ID',
      width: 60,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Typography sx={{ color: '#3049BF', fontSize: '14px' }}>
          {param?.row?.number}
        </Typography>
      ),
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: 'end_date',
      headerName: 'End Date',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Trip Name',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: 'trip_completed',
      headerName: 'Trip Status',
      width: 200,
      groupable: false,
      // sortable: false,
      flex: 1,
      renderCell: (param) =>
        param.row.trip_completed ? 'Completed' : 'On Going',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      groupable: false,
      // sortable: false,
      flex: 1,
      renderCell: (param) => StatusComponents[param.row.status],
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 80,
      groupable: false,
      sortable: true,
      flex: 1,
      // align: 'right',
      renderCell: (param) => param?.row?.amount || 0,
    },
  ];

  const coloumsOutSettlement = [
    {
      field: 'number',
      headerName: 'ID',
      width: 60,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Typography sx={{ color: '#3049BF', fontSize: '14px' }}>
          {param?.row?.number}
        </Typography>
      ),
    },
    {
      field: 'claimed_on',
      headerName: 'Claim Date',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (params) =>
        moment(params.row?.claimed_on).format('DD MMM YYYY'),
    },
    {
      field: 'name',
      headerName: 'Category',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: 'vendor_name',
      headerName: 'Vendor',
      width: 200,
      groupable: false,
      sortable: true,

      renderCell: (param) =>
        param.row.vendor_name ? param.row.vendor_name : '-',
      flex: 1,
      type: 'singleSelect',
      valueOptions: valueOptionsFilter,
    },
    {
      field: 'payment_date',
      headerName: 'Payment Date',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (params) =>
        moment(params.row?.payment_date).format('DD MMM YYYY'),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      groupable: false,
      // sortable: false,
      flex: 1,
      renderCell: (param) => StatusComponents[param.row.status],
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
  ];

  const coloumsOutAdvance = [
    {
      field: 'number',
      headerName: 'ID',
      width: 60,
      groupable: false,
      sortable: true,
      flex: 1,
      renderCell: (param) => (
        <Typography sx={{ color: '#3049BF', fontSize: '14px' }}>
          {param?.row?.number}
        </Typography>
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description ',
      width: 200,
      groupable: false,
      sortable: false,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      groupable: false,
      // sortable: false,
      renderCell: (param) => StatusComponents[param.row.status],
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 200,
      groupable: false,
      sortable: true,
      flex: 1,
    },
  ];

  const {
    claims,
    claimsCount,
    advanceRes,
    drawer,
    advancePerformActions,
    expensePerformActions,
    mileagePerformActions,
    tripDetails,
  } = useSelector((state) => state.Reimbursement);

  const { reimbursements } = useSelector(
    (state) => state.ReimbursementSettings,
  );

  const handleChange = (event, newValue) => {
    if (newValue === 'advance') setExpenseTab('expense');
    setValue(newValue);
  };

  const handleDrawer = (name, action) => {
    dispatch(setDrawer({ name, value: action }));
    setOptionAnchor(null);
    dispatch(setClaimDetailsForBillPatch(''));

    if (name === 'trip') {
      setTripSheet('main');
      if (action === false) {
        // if (expenseTab === 'expense') dispatch(getClaims({ type: value }));
        if (value !== 'advance' && expenseTab === 'trip')
          dispatch(getTrips({ type: value }));
      }
    }
  };

  const handleMobileDrawer = (name, action) => {
    if (name === 'expense') {
      dispatch(setDrawer({ name, value: action }));
    } else if (name === 'mileage') {
      navigate('/reimbursement-mileage', {
        state: { action: 'new', tab: value, data: {} },
      });
    } else if (name === 'trip') {
      navigate('/reimbursement-trip', {
        state: { action: 'new', tab: value, data: {} },
      });
    }
    setOptionAnchor(null);
  };

  const handleRowClick = (data) => {
    if (data?.row?.name === 'Own Vehicle Expenses') {
      handleDrawer('mileage', true);
      dispatch(setClaimDetailsForBillPatch(data));
    } else handleDrawer('expense', true);
    dispatch(setTripViewState('view_trip'));
    setSelectedRow(data.row);
    setActionType('view');
    if (data?.row?.name !== 'Own Vehicle Expenses')
      dispatch(
        getOneReimbursement({
          id: reimbursements?.find((item) => item.name === data?.row?.name)?.id,
        }),
      );
  };

  const handleTripRowClick = (data) => {
    handleDrawer('trip', true);
    setSelectedTip(data);
    setTripSheet('trip_view');
  };

  const handleRowAdvanceClick = (data) => {
    handleDrawer('requestAdvance', true);
    setActionAdvance('view');
    dispatch(getOneClaim(data?.row?.id));
  };

  const onClickExpense = () => {
    dispatch(setTrips([]));
    setExpenseTab('expense');
  };

  const onClickTrip = () => {
    dispatch(setClaims([]));
    dispatch(setTripViewState(''));
    setExpenseTab('trip');
  };

  const forInitial = () => {
    setSelectedRow({});
    setActionType('new');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (expenseTab === 'expense') dispatch(getClaims({ type: value }));
    if (value !== 'advance' && expenseTab === 'trip')
      dispatch(getTrips({ type: value }));
  }, [dispatch, value, expenseTab]);

  useEffect(() => {
    dispatch(getReimbursements());
    dispatch(getManagers());
  }, [dispatch]);

  useEffect(() => {
    if (
      advanceRes === 'added' ||
      advancePerformActions === 'request_advance_updated_successfully'
    )
      setValue('advance');
  }, [advanceRes]);

  useEffect(() => {
    if (
      expensePerformActions === 'expense_updated_successfully' ||
      mileagePerformActions === 'milage_updated_successfully' ||
      expensePerformActions === 'expense_added_successfully' ||
      mileagePerformActions === 'milage_added_successfully'
    )
      setValue('outstanding');
    return () => dispatch(clearReimbursementPerformanceAction());
  }, [expensePerformActions, mileagePerformActions]);

  useEffect(() => {
    if (desktopView) {
      const temp = Array.from(
        new Set(claims?.data?.map((invoice) => invoice?.vendor_name)),
      )?.map((ele) => ({ value: ele, label: ele }));
      setValueOptionsFilter(temp);
    }
  }, [desktopView, claims?.data]);

  return (
    <>
      {desktopView ? (
        <>
          <StyledMenu
            anchorEl={optionsAnchor}
            open={open}
            onClose={() => setOptionAnchor(null)}
            listwidth={184}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{
              '& .MuiMenuItem-root': {
                color: '#283049 !important',
                borderBottom: '1px solid rgba(0, 0, 0, 0.10) !important',
                display: 'flex',
                flexFlow: 'column nowrap',
                justifyContent: 'flex-start !important',
                '&:last-child': {
                  borderBottom: 'none !important ',
                  marginBottom: '0px !important',
                  alignItems: 'flex-start !important',
                },
              },
            }}
          >
            {reimbursementItems.map((item) => (
              <MenuItem onClick={() => handleDrawer(item.id, true)}>
                {item.label}
              </MenuItem>
            ))}
          </StyledMenu>
          <Box className={css.reimbursementcontainer}>
            <Stack className={css.actioncardwrapper}>
              {userPermissions?.Reimbursement?.['Reimbursement Claims']
                ?.view_reimbursement_claim && (
                <Stack className={css.actioncard}>
                  <Stack className={css.titlewrapper}>
                    <Typography className={css.title}>
                      Unapproved Claims
                    </Typography>
                    <Typography
                      className={css.amount}
                    >{`Rs. ${IndianCurrencyNoSymbol.format(
                      claimsCount.unapproved_claims || 0,
                    )}`}</Typography>
                  </Stack>
                  <Stack className={css.actionbtnwrapper}>
                    <Button
                      className={css.actionbtn}
                      onClick={() => navigate('/reimbursement-approval')}
                    >
                      Approve
                      <KeyboardArrowRightRoundedIcon className={css.btnicon} />
                    </Button>
                  </Stack>
                </Stack>
              )}
              {userPermissions?.Reimbursement?.['Payment Request']
                ?.view_reimbursement_payment_req && (
                <Stack className={css.actioncard}>
                  <Stack className={css.titlewrapper}>
                    <Typography className={css.title}>
                      Pending Payment
                    </Typography>
                    <Typography
                      className={css.amount}
                    >{`Rs. ${IndianCurrencyNoSymbol.format(
                      claimsCount.pending_payment || 0,
                    )}`}</Typography>
                  </Stack>
                  <Stack className={css.actionbtnwrapper}>
                    <Button
                      className={`${css.actionbtn} ${css.paynowaction}`}
                      onClick={() =>
                        navigate('/reimbursement-approval', {
                          state: { status: 'pending_payment' },
                        })
                      }
                    >
                      Pay Now
                      <KeyboardArrowRightRoundedIcon className={css.btnicon} />
                    </Button>
                  </Stack>
                </Stack>
              )}
              <Stack className={css.actioncard}>
                <Stack className={css.titlewrapper}>
                  <Typography className={css.title}>
                    Claims Outstanding
                  </Typography>
                  <Typography
                    className={`${css.amount} ${css.claimout}`}
                  >{`Rs. ${IndianCurrencyNoSymbol.format(
                    claimsCount.total_outstanding_amount || 0,
                  )}`}</Typography>
                </Stack>
                <Stack className={css.actionbtnwrapper}>
                  <Button
                    className={css.addclaim}
                    onClick={(e) => {
                      if (
                        userPermissions?.Reimbursement?.['Reimbursement Claims']
                          ?.create_reimbursement_claim
                      ) {
                        forInitial();
                        setOptionAnchor(e.currentTarget);
                      } else setHavePermission(true);
                    }}
                  >
                    <AddRoundedIcon className={css.btnicon} /> Add Claim
                  </Button>
                </Stack>
              </Stack>

              <Stack className={css.actioncard}>
                <Stack className={css.titlewrapper}>
                  <Typography className={css.title}>
                    Unsettled Advance
                  </Typography>
                  <Typography className={`${css.amount} ${css.advance}`}>
                    {`Rs. ${IndianCurrencyNoSymbol.format(
                      claimsCount.unsettled_advance || 0,
                    )}`}
                  </Typography>
                </Stack>
                <Stack className={css.actionbtnwrapper}>
                  <Button
                    className={css.request}
                    onClick={() => {
                      if (
                        userPermissions?.Reimbursement?.['Reimbursement Claims']
                          ?.create_reimbursement_claim
                      ) {
                        handleDrawer('requestAdvance', true);
                        setActionAdvance('new');
                        dispatch(setAdvanceRes(null));
                        dispatch(setTripSave(null));
                      } else setHavePermission(true);
                    }}
                  >
                    <SyncAltRoundedIcon className={css.btnicon} /> Request
                    Advance
                  </Button>
                </Stack>
              </Stack>
            </Stack>

            <Box className={css.tabcontainer}>
              <Stack className={css.expensetabwrapper}>
                <Typography variant="h4" className={css.tabtitle}>
                  {`${value}  List`}
                </Typography>
                {value !== 'advance' && (
                  <Stack className={css.tabbtnwrapper}>
                    <Button
                      className={
                        expenseTab === 'expense'
                          ? `${css.tabbtn} ${css.active}`
                          : css.tabbtn
                      }
                      onClick={onClickExpense}
                    >
                      Expense
                    </Button>
                    <Button
                      className={
                        expenseTab === 'trip'
                          ? `${css.tabbtn} ${css.active}`
                          : css.tabbtn
                      }
                      onClick={onClickTrip}
                    >
                      Trip Expense
                    </Button>
                  </Stack>
                )}
              </Stack>
              <TabContext value={value}>
                <Box className={css.tablistcontainer}>
                  <TabList
                    onChange={handleChange}
                    TabIndicatorProps={{
                      style: {
                        backgroundColor: '#F08B32',
                        height: '1px',
                      },
                    }}
                    sx={{
                      '& .MuiTabs-flexContainer': {
                        gap: '32px',
                      },
                    }}
                  >
                    <Tab
                      label="Outstanding"
                      value="outstanding"
                      className={css.tab}
                      sx={{
                        '&.Mui-selected': {
                          color: '#F08B32 !important',
                        },
                      }}
                    />
                    <Tab
                      label="Settlement"
                      value="settlement"
                      className={css.tab}
                      sx={{
                        '&.Mui-selected': {
                          color: '#F08B32 !important',
                        },
                      }}
                    />
                    <Tab
                      label="Advance"
                      value="advance"
                      className={css.tab}
                      sx={{
                        '&.Mui-selected': {
                          color: '#F08B32 !important',
                        },
                      }}
                    />
                  </TabList>
                </Box>
                <TabPanel value="outstanding" className={css.tabpanel}>
                  {expenseTab === 'expense' ? (
                    <DataGridPremium
                      sx={style}
                      columns={coloumsOutStanding}
                      rows={claims?.data || []}
                      onRowClick={(param) => handleRowClick(param)}
                      hideFooter
                      disableRowSelectionOnClick
                      density="compact"
                      // getRowHeight={() => 'auto'}
                      // rowHeight={58}
                      getDetailPanelHeight={() => 'auto'}
                      disableChildrenSorting
                      // disableColumnMenu
                      disableColumnReorder
                      disableColumnPinning
                      disableColumnResize
                      disableRowGrouping
                      disableAggregation
                      components={{
                        Toolbar: CustomToolbar,
                        NoRowsOverlay: () => (
                          <Stack
                            height="100%"
                            alignItems="center"
                            justifyContent="center"
                          >
                            No Claims Found
                          </Stack>
                        ),
                      }}
                      componentsProps={{
                        toolbar: {
                          showQuickFilter: true,
                          quickFilterProps: { debounceMs: 500 },
                        },
                      }}
                      slotProps={{
                        panel: { placement: 'auto' },
                      }}
                    />
                  ) : (
                    <DataGridPremium
                      sx={style}
                      columns={coloumsTripOutStanding}
                      rows={tripDetails || []}
                      onRowClick={(param) => handleTripRowClick(param.row)}
                      hideFooter
                      disableRowSelectionOnClick
                      density="compact"
                      // getRowHeight={() => 'auto'}
                      // rowHeight={58}
                      disableChildrenSorting
                      disableColumnMenu
                      disableColumnReorder
                      disableColumnPinning
                      disableColumnResize
                      disableRowGrouping
                      disableAggregation
                      components={{
                        Toolbar: CustomToolbar,
                        NoRowsOverlay: () => (
                          <Stack
                            height="100%"
                            alignItems="center"
                            justifyContent="center"
                          >
                            No Claims Found
                          </Stack>
                        ),
                      }}
                      componentsProps={{
                        toolbar: {
                          showQuickFilter: true,
                          quickFilterProps: { debounceMs: 500 },
                        },
                      }}
                    />
                  )}
                </TabPanel>
                <TabPanel value="settlement" className={css.tabpanel}>
                  {expenseTab === 'expense' ? (
                    <DataGridPremium
                      sx={style}
                      columns={coloumsOutSettlement}
                      rows={claims?.data || []}
                      hideFooter
                      disableRowSelectionOnClick
                      density="compact"
                      // getRowHeight={() => 'auto'}
                      // rowHeight={58}
                      onRowClick={(param) => handleRowClick(param)}
                      disableChildrenSorting
                      disableColumnMenu
                      disableColumnReorder
                      disableColumnPinning
                      disableColumnResize
                      disableRowGrouping
                      disableAggregation
                      components={{
                        Toolbar: CustomToolbar,
                        NoRowsOverlay: () => (
                          <Stack
                            height="100%"
                            alignItems="center"
                            justifyContent="center"
                          >
                            No Claims Found
                          </Stack>
                        ),
                      }}
                      componentsProps={{
                        toolbar: {
                          showQuickFilter: true,
                          quickFilterProps: { debounceMs: 500 },
                        },
                      }}
                    />
                  ) : (
                    <DataGridPremium
                      sx={style}
                      columns={coloumsTripOutStanding}
                      rows={tripDetails || []}
                      hideFooter
                      disableRowSelectionOnClick
                      onRowClick={(param) => handleTripRowClick(param?.row)}
                      density="compact"
                      // getRowHeight={() => 'auto'}
                      // rowHeight={58}
                      disableChildrenSorting
                      disableColumnMenu
                      disableColumnReorder
                      disableColumnPinning
                      disableColumnResize
                      disableRowGrouping
                      disableAggregation
                      components={{
                        Toolbar: CustomToolbar,
                        NoRowsOverlay: () => (
                          <Stack
                            height="100%"
                            alignItems="center"
                            justifyContent="center"
                          >
                            No Claims Found
                          </Stack>
                        ),
                      }}
                      componentsProps={{
                        toolbar: {
                          showQuickFilter: true,
                          quickFilterProps: { debounceMs: 500 },
                        },
                      }}
                    />
                  )}
                </TabPanel>
                <TabPanel value="advance" className={css.tabpanel}>
                  <DataGridPremium
                    sx={style}
                    columns={coloumsOutAdvance}
                    rows={claims?.data || []}
                    hideFooter
                    disableRowSelectionOnClick
                    density="compact"
                    onRowClick={(param) => handleRowAdvanceClick(param)}
                    // getRowHeight={() => 'auto'}
                    // rowHeight={58}
                    disableChildrenSorting
                    disableColumnMenu
                    disableColumnReorder
                    disableColumnPinning
                    disableColumnResize
                    disableRowGrouping
                    disableAggregation
                    components={{
                      Toolbar: CustomToolbar,
                      NoRowsOverlay: () => (
                        <Stack
                          height="100%"
                          alignItems="center"
                          justifyContent="center"
                        >
                          No Claims Found
                        </Stack>
                      ),
                    }}
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                      },
                    }}
                  />
                </TabPanel>
              </TabContext>
            </Box>
          </Box>
        </>
      ) : (
        <div className={css.reimbursementMainMobile}>
          <div className={css.headertext}>Reimbursements</div>
          <div className={css.header}>
            <HeaderContainer
              type="claims"
              disablecount
              title="Claims Outstanding"
              amount={`Rs. ${IndianCurrencyNoSymbol.format(
                claimsCount.total_outstanding_amount || 0,
              )}`}
              btnName="Add Claim"
              btnAction={(e) => {
                if (
                  userPermissions?.Reimbursement?.['Reimbursement Claims']
                    ?.create_reimbursement_claim
                ) {
                  forInitial();
                  setOptionAnchor(e.currentTarget);
                } else setHavePermission(true);
              }}
            />
            <HeaderContainer
              type="unsettled"
              disablecount
              title="Unsettled Advance"
              amount={`Rs. ${IndianCurrencyNoSymbol.format(
                claimsCount.unsettled_advance || 0,
              )}`}
              btnName="Request Advance"
              btnAction={() => {
                if (
                  userPermissions?.Reimbursement?.['Reimbursement Claims']
                    ?.create_reimbursement_claim
                ) {
                  navigate('/reimbursement-trip-advance-request', {
                    state: { action: 'new', tab: 'advance' },
                  });
                } else setHavePermission(true);
              }}
            />
          </div>

          {userPermissions?.Reimbursement?.['Reimbursement Claims']
            ?.view_reimbursement_claim && (
            <div
              className={css.managerViewContainer}
              onClick={() => navigate('/reimbursement-approval')}
            >
              <img className={css.image} src={approval} alt="Icon" />
              <p>
                Unapproved Claims
                <span>{` ( Rs. ${IndianCurrencyNoSymbol.format(
                  claimsCount.unapproved_claims || 0,
                )} )`}</span>
              </p>
              <img className={css.cheveronRight} src={rightArrow} alt="Icon" />
            </div>
          )}

          <div className={css.tabcontainer}>
            <TabContext value={value}>
              <Box className={css.tablistcontainer}>
                <TabList
                  onChange={handleChange}
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: '#F08B32',
                      height: '1px',
                    },
                  }}
                  sx={{
                    '& .MuiTabs-flexContainer': {
                      gap: '24px',
                      textAlign: 'center',
                    },
                  }}
                >
                  <Tab
                    label="Outstanding"
                    value="outstanding"
                    className={css.tab}
                    sx={{
                      '&.Mui-selected': {
                        color: '#F08B32 !important',
                      },
                    }}
                  />
                  <Tab
                    label="Settled"
                    value="settlement"
                    className={css.tab}
                    sx={{
                      '&.Mui-selected': {
                        color: '#F08B32 !important',
                      },
                    }}
                  />
                  <Tab
                    label="Advance"
                    value="advance"
                    className={css.tab}
                    sx={{
                      '&.Mui-selected': {
                        color: '#F08B32 !important',
                      },
                    }}
                  />
                </TabList>
              </Box>
              <TabPanel value="outstanding" className={css.tabpanel}>
                {/* <FilterContainer
                  filterAction={() => console.log('outstanding tab clicked')}
                /> */}
                <div>
                  <Button
                    // aria-controls={open ? 'demo-customized-menu' : undefined}
                    // aria-expanded={open ? 'true' : undefined}
                    // variant="contained"
                    disableElevation
                    onClick={(e) => setAnchorEl(e?.currentTarget)}
                    endIcon={<KeyboardArrowDownIcon />}
                    className={css.dropDownBtn}
                  >
                    {expenseTab === 'expense' ? expenseTab : 'Trip Expense'}
                  </Button>
                  <StyledMenu
                    anchorEl={anchorEl}
                    open={openMobile}
                    onClose={handleClose}
                    sx={{
                      '& .MuiMenuItem-root': {
                        display: 'flex',
                        flexFlow: 'column no-wrap',
                        justifyContent: 'flex-start',
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setExpenseTab('expense');
                        handleClose();
                      }}
                      disableRipple
                      sx={{ minHeight: 'unset' }}
                    >
                      Expense
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setExpenseTab('trip');
                        handleClose();
                      }}
                      disableRipple
                      sx={{ minHeight: 'unset' }}
                    >
                      Trip Expense
                    </MenuItem>
                  </StyledMenu>
                </div>
                {expenseTab === 'expense' ? (
                  <>
                    {claims?.data?.length > 0 && (
                      <Box
                        sx={{
                          overflow: 'auto',
                          height:
                            currentUserInfo?.role === 'Manager' ||
                            currentUserInfo?.role === 'Founder' ||
                            currentUserInfo?.role === 'Admin'
                              ? 'calc(100vh - 470px)'
                              : 'calc(100vh - 430px)',
                        }}
                      >
                        {claims?.data?.map((val) => (
                          <TripCard
                            type="outstanding"
                            description={val?.name}
                            amountData={val?.amount}
                            date={moment(val?.date).format('YYYY-MM-DD')}
                            status={val?.status}
                            handleCardClick={() =>
                              setMobileDrawer({ open: 'expense', value: val })
                            }
                          />
                        ))}
                      </Box>
                    )}
                    {claims?.data?.length === 0 && (
                      <Typography align="center">No Claims Found.</Typography>
                    )}
                  </>
                ) : (
                  <>
                    {tripDetails?.length > 0 && (
                      <Box
                        sx={{
                          overflow: 'auto',
                          height:
                            currentUserInfo?.role === 'Manager' ||
                            currentUserInfo?.role === 'Founder' ||
                            currentUserInfo?.role === 'Admin'
                              ? 'calc(100vh - 470px)'
                              : 'calc(100vh - 430px)',
                        }}
                      >
                        {tripDetails?.map((val) => (
                          <TripCard
                            type="outstanding"
                            description={val?.name || '-'}
                            amountData={val?.amount || 0}
                            name={val?.name || '-'}
                            date={moment(val?.start_date).format('YYYY-MM-DD')}
                            status={val?.status}
                            handleCardClick={() =>
                              navigate('/reimbursement-trip-claim', {
                                state: { selectedTrip: val },
                              })
                            }
                          />
                        ))}
                      </Box>
                    )}
                    {tripDetails?.length === 0 && (
                      <Typography align="center">No Claims Found.</Typography>
                    )}
                  </>
                )}
              </TabPanel>
              <TabPanel value="settlement" className={css.tabpanel}>
                {/* <FilterContainer
                  filterAction={() => console.log('settlement tab clicked')}
                /> */}
                <div>
                  <Button
                    // aria-controls={open ? 'demo-customized-menu' : undefined}
                    // aria-expanded={open ? 'true' : undefined}
                    // variant="contained"
                    disableElevation
                    onClick={(e) => setAnchorEl(e?.currentTarget)}
                    endIcon={<KeyboardArrowDownIcon />}
                    className={css.dropDownBtn}
                  >
                    {expenseTab === 'expense' ? expenseTab : 'Trip Expense'}
                  </Button>
                  <StyledMenu
                    anchorEl={anchorEl}
                    open={openMobile}
                    onClose={handleClose}
                    sx={{
                      '& .MuiMenuItem-root': {
                        display: 'flex',
                        flexFlow: 'column nowrap',
                        justifyContent: 'flex-start',
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setExpenseTab('expense');
                        handleClose();
                      }}
                      disableRipple
                    >
                      Expense
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setExpenseTab('trip');
                        handleClose();
                      }}
                      disableRipple
                    >
                      Trip Expense
                    </MenuItem>
                  </StyledMenu>
                </div>
                {expenseTab === 'expense' ? (
                  <>
                    {claims?.data?.length > 0 && (
                      <Box
                        sx={{
                          overflow: 'auto',
                          height:
                            currentUserInfo?.role === 'Manager' ||
                            currentUserInfo?.role === 'Founder' ||
                            currentUserInfo?.role === 'Admin'
                              ? 'calc(100vh - 470px)'
                              : 'calc(100vh - 430px)',
                        }}
                      >
                        {claims?.data?.map((val) => (
                          <TripCard
                            type="settled"
                            description={val?.name}
                            amountData={val?.amount}
                            date={moment(val?.date).format('YYYY-MM-DD')}
                            status={val?.status}
                            handleCardClick={() => {
                              setMobileDrawer({ open: 'expense', value: val });
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    {claims?.data?.length === 0 && (
                      <Typography align="center">No Claims Found.</Typography>
                    )}
                  </>
                ) : (
                  <>
                    {tripDetails?.length > 0 && (
                      <Box
                        sx={{
                          overflow: 'auto',
                          height:
                            currentUserInfo?.role === 'Manager' ||
                            currentUserInfo?.role === 'Founder' ||
                            currentUserInfo?.role === 'Admin'
                              ? 'calc(100vh - 470px)'
                              : 'calc(100vh - 430px)',
                        }}
                      >
                        {tripDetails?.map((val) => (
                          <TripCard
                            type="outstanding"
                            description={val?.name || '-'}
                            amountData={val?.amount || 0}
                            name={val?.name || '-'}
                            date={moment(val?.start_date).format('YYYY-MM-DD')}
                            status={val?.status}
                            handleCardClick={() =>
                              navigate('/reimbursement-trip-claim', {
                                state: { selectedTrip: val },
                              })
                            }
                          />
                        ))}
                      </Box>
                    )}
                    {tripDetails?.length === 0 && (
                      <Typography align="center">No Claims Found.</Typography>
                    )}
                  </>
                )}
              </TabPanel>
              <TabPanel value="advance" className={css.tabpanel}>
                <FilterContainer
                  title="Advance Request"
                  filterAction={() => console.log('advance tab clicked')}
                />
                {claims?.data?.length > 0 && (
                  <Box
                    sx={{
                      overflow: 'auto',
                      height:
                        currentUserInfo?.role === 'Manager' ||
                        currentUserInfo?.role === 'Founder' ||
                        currentUserInfo?.role === 'Admin'
                          ? 'calc(100vh - 470px)'
                          : 'calc(100vh - 430px)',
                    }}
                  >
                    {claims?.data?.map((val) => (
                      <TripCard
                        type="advance"
                        description={val?.description}
                        amountData={val?.amount}
                        date={moment(val?.date).format('YYYY-MM-DD')}
                        status={val?.status}
                        handleCardClick={() => {
                          dispatch(getOneClaim(val.id));
                          setMobileDrawer({ open: 'trip', value: val });
                          dispatch(
                            setReimbursementPerformanceAction({
                              name: 'advancePerformActions',
                              action: '',
                            }),
                          );
                        }}
                      />
                    ))}
                  </Box>
                )}
                {claims?.data?.length === 0 && (
                  <Typography align="center">No Claims Found.</Typography>
                )}
              </TabPanel>
            </TabContext>
          </div>
          <SelectBottomSheet
            open={open}
            onClose={() => setOptionAnchor(null)}
            triggerComponent={<></>}
          >
            <Puller />
            <Stack
              alignItems="center"
              justifyContent="space-between"
              direction="row"
              padding="20px 16px 0"
            >
              <Typography className={css.bottomSheetHeader}>
                Add Claim
              </Typography>
              <CloseIcon
                className={css.bottomSheetClose}
                onClick={() => setOptionAnchor(null)}
              />
            </Stack>
            <ul
              style={{
                padding: 0,
                display: 'flex !important',
                flexFlow: 'column nowrap',
                alignItems: 'flex-start !important',
              }}
            >
              {reimbursementItems.map((item) => (
                <MenuItem
                  sx={{
                    color: '#283049 !important',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.10) !important',
                    padding: '12px 20px !important',
                    '&:last-child': {
                      borderBottom: 'none !important ',
                      marginBottom: '0px !important',
                    },
                  }}
                  classes={{
                    root: classes.menuLineIems,
                  }}
                  onClick={() => handleMobileDrawer(item.id, true)}
                >
                  {item.label}
                </MenuItem>
              ))}
            </ul>
          </SelectBottomSheet>
        </div>
      )}

      {havePermission && (
        <PermissionDialog onClose={() => setHavePermission(false)} />
      )}

      <SelectBottomSheet
        addNewSheet
        triggerComponent={<></>}
        open={drawer?.expense}
        onClose={() => {
          dispatch(setOneReimbursement({}));
          handleDrawer('expense', false);
        }}
      >
        <ExpenseRequirementForm
          action={actionType}
          data={selectedRow}
          setValue={() => setValue('outstanding')}
          tab={value}
          onClose={() => handleDrawer('expense', false)}
          openMileage={() => handleDrawer('mileage', true)}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        addNewSheet
        triggerComponent={<></>}
        open={drawer?.mileage}
        onClose={() => handleDrawer('mileage', false)}
      >
        <MilageRequirementForm
          action={actionType}
          data={selectedRow}
          tab={value}
          setValue={() => setValue('outstanding')}
          onClose={() => handleDrawer('mileage', false)}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        addNewSheet
        triggerComponent={<></>}
        open={drawer?.trip}
        onClose={() => handleDrawer('trip', false)}
      >
        <TripRequirementForm
          type="new"
          setValue={() => setValue('outstanding')}
          selectedtripDetail={selectedTip}
          sheet={TripSheet}
        />
      </SelectBottomSheet>
      {/* <SelectBottomSheet
        addNewSheet
        triggerComponent={<></>}
        open={drawer?.tripDetail}
        onClose={() => handleDrawer('tripDetail', false)}
      >
        <TripDetailsView
          selectedTip={selectedTip}
          setTripSheet={() => handleDrawer('tripDetail', false)}
          setValue={setValue}
        />
      </SelectBottomSheet> */}

      <SelectBottomSheet
        addNewSheet
        triggerComponent={<></>}
        open={drawer?.requestAdvance}
        onClose={() => handleDrawer('requestAdvance', false)}
      >
        <RequestTripAdvanceForm tab={value} action={actionAdvance} />
      </SelectBottomSheet>

      <SelectBottomSheet
        addNewSheet
        triggerComponent={<></>}
        open={mobileDrawer?.open === 'expense'}
        onClose={() => setMobileDrawer({})}
      >
        <Puller />
        <ExpenseDetailsMobileSheet
          data={mobileDrawer?.value}
          type_form="expense"
          deleteClick={() => setLocalDrawer({ ...drawer, delete: true })}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        addNewSheet
        triggerComponent={<></>}
        open={mobileDrawer?.open === 'trip'}
        onClose={() => {
          setMobileDrawer({});
          dispatch(setOnClaim({}));
        }}
      >
        <Puller />
        <TripDetailsMobileSheet
          deleteClick={() => setLocalDrawer({ ...drawer, delete: true })}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        open={localDrawer?.delete}
        triggerComponent={<></>}
        onClose={() => setLocalDrawer({ ...drawer, delete: false })}
        styleDrawerMinHeight="auto"
      >
        <Puller />
        <DeleteContent
          handleNo={() => setLocalDrawer({ ...drawer, delete: false })}
          handleYes={() => {
            setLocalDrawer({ ...drawer, delete: false });
            dispatch(
              deleteClaim({
                id: mobileDrawer?.value?.id,
                tab: value,
                claim_type: value === 'outstanding' ? 'expense' : 'trip',
              }),
            );
            setMobileDrawer({});
          }}
          type={
            (value === 'outstanding' && 'claim') ||
            (value === 'settlement' && 'claim') ||
            (value === 'advance' && 'advance')
          }
        />
      </SelectBottomSheet>
    </>
  );
};

export default memo(Reimbursement);
