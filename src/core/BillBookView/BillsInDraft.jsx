import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  GetVendorEntityState,
  ClearSateVendorEntity,
} from '@action/Store/Reducers/General/GeneralState';
import {
  GetVendorBillDetailsState,
  ClearStateGetVendorBillDetails,
  DeleteVendorBillState,
  ClearStateBillAction,
  GetBillsListState,
  ClearStateGetBillsList,
} from '@action/Store/Reducers/Bills/BillsState';

import InfiniteScroll from 'react-infinite-scroll-component';

import {
  Box,
  Button,
  Stack,
  Typography,
  Chip,
  Grid,
  Dialog,
  DialogContent,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-premium';

import {
  MobileCardLoadingSkeleton,
  InvoiceLoadingSkeleton,
} from '@components/SkeletonLoad/SkeletonLoader';

import { makeStyles, styled, MenuItem } from '@material-ui/core';
import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import * as Router from 'react-router-dom';
import { PermissionDialog } from '@components/Permissions/PermissionDialog.jsx';

import moment from 'moment';
import { FormattedAmount } from '@components/formattedValue/FormattedValue';
import deleteBin from '@assets/binRed.svg';
import viewYourBills from '@assets/viewYourBills.png';
import editYourBills from '@assets/editYourBills.png';

import AppContext from '@root/AppContext.jsx';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

import * as themes from '@root/theme.scss';
import BillViewDialog from './components/BillViewDialog';
import {
  EntityFilter,
  DateFilter,
} from '../../components/MobileSheetFilters/SheetFilter';
import * as css from './BillsInDraft.scss';

const useStyles = makeStyles(() => ({
  chips: {
    background: '#FFF !important',
    flexDirection: 'row-reverse !important',
    justifyContent: 'space-between ',
    padding: '0 10px !important',
    border: '1.5px solid #E1E1E1 !important',
    borderRadius: '8px !important',
    cursor: 'pointer !important',
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
    background: '#fdf1e6 !important',
    color: `${themes.colorPrimaryButton} !important`,
    borderColor: `${themes.colorPrimaryButton} !important`,
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

const sortOptions = [
  // { id: 1, name: 'Recent payments', click: { order_by: 'date', order: 'asc' } },
  {
    id: 2,
    name: 'Bill amount Low to High',
    click: { order_by: 'amount', order: 'asc' },
  },
  {
    id: 3,
    name: 'Bill amount High to Low',
    click: { order_by: 'amount', order: 'desc' },
  },
  { id: 4, name: 'A-Z', click: { order_by: 'name', order: 'asc' } },
  { id: 5, name: 'Z-A', click: { order_by: 'name', order: 'desc' } },
];

export const paymentStatusListWithBill = [
  { id: 'company_cash', label: 'Paid with Company Cash' },
  { id: 'paid_as_advance', label: 'Paid as Advance' },
  { id: 'to_pay', label: 'To Pay' },
  { id: 'company_card', label: 'Paid with Company Card' },
  { id: 'personal', label: 'Paid by' },
  { id: 'company_account', label: 'Paid with Company Account' },
];

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

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const DraftBills = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const { vendorEntity } = useSelector((value) => value.General);
  const { billsListData, billsDataLoad, billsAction, VendorBillDetails } =
    useSelector((value) => value.Bills);

  const { userPermissions } = useContext(AppContext);

  const themesMui = useTheme();
  const desktopView = useMediaQuery(themesMui.breakpoints.up('sm'));

  const [anchorEl, setAnchorEl] = useState({
    vendor: null,
    date: null,
    sort: null,
  });
  const [sortData, setSortData] = useState({
    fromDate: null,
    toDate: null,
    order_by: '',
    order: '',
  });
  const [checkedVendorList, setCheckedVendorList] = useState([]);
  const [searchVendorList, setSearchVendorList] = useState();
  const [selectVendorList, setSelectVendorList] = useState(undefined);
  const [draftBills, setDraftBills] = useState([]);
  const [dialogDelete, setDialogDelete] = useState(false);

  const [BottomSheet, setBottomSheet] = useState(false);
  const [tableDetails, setTableDetails] = useState({});
  const navigate = Router.useNavigate();
  const { state } = Router.useLocation();
  const device = localStorage.getItem('device_detect');
  const [viewBill, setViewBill] = useState(false);
  const [file, setFile] = useState('');
  const [vendorQuery, setVendorQuery] = useState();

  const [userRoles, setUserRoles] = useState({});
  const [havePermission, setHavePermission] = useState({ open: false });
  const [hasMoreItems, sethasMoreItems] = useState(true);
  const [valueOptionsFilter, setValueOptionsFilter] = useState([]);

  const draftBillsColumn = [
    {
      field: 'document_number',
      headerName: 'Bill Number',
      sortable: false,
      width: 220,
    },
    {
      field: 'id',
      headerName: 'Name',
      valueGetter: (params) => params.row.vendor?.name,
      renderCell: (params) => {
        return (
          <Typography className="MuiDataGrid-cell-vendor">
            {params?.row?.vendor?.name || '-'}
          </Typography>
        );
      },
      sortable: true,
      flex: 1,
      type: 'singleSelect',
      valueOptions: valueOptionsFilter,
    },
    {
      field: 'payment_mode',
      headerName: 'Payment Status',
      renderCell: (params) => {
        return (
          <>
            {params?.row?.payment_mode === 'personal'
              ? `${
                  paymentStatusListWithBill?.find(
                    (v) => v.id === params?.row?.payment_mode,
                  )?.label
                } ${params?.row?.payer_details?.name || ''}` ||
                params?.row?.payment_mode ||
                '-'
              : paymentStatusListWithBill?.find(
                  (v) => v.id === params?.row?.payment_mode,
                )?.label ||
                params?.row?.payment_mode ||
                '-'}
          </>
        );
      },
      sortable: false,
      width: 220,
      type: 'singleSelect',
      valueOptions: paymentStatusListWithBill?.map((val) => ({
        value: val?.id,
        label: val?.label,
      })),
    },
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) =>
        moment(params.row?.created_at).format('DD-MM-YYYY'),
      width: 110,
    },
    {
      field: 'amount',
      headerName: 'Taxable Value',
      type: 'number',
      headerClassName: 'left-align--header',
      valueFormatter: (params) => {
        if (params?.value < 0) {
          return `(${currencyFormatter.format(Math.abs(params?.value))})`;
        }
        return currencyFormatter.format(params?.value || 0);
      },
      align: 'right',
      width: 160,
    },
  ];

  const getVendors = async (searchVal, entire) => {
    dispatch(
      GetVendorEntityState({
        allParties: false,
        pageNum: 1,
        searchText: searchVal || '',
        location: false,
        entire,
      }),
    );
  };

  const queryParam = new URLSearchParams(window.location.search).get('id');

  const getDraftBills = (page_num) => {
    let filter = '';

    if (selectVendorList && selectVendorList.length === 1) {
      filter += `&vendor_id=${selectVendorList}`;
    } else if (selectVendorList && selectVendorList.length > 1) {
      selectVendorList.forEach((v) => {
        filter += `&vendor_ids[]=${v}&`;
      });
    }

    if (sortData?.toDate) {
      const toDataStr = moment(sortData?.toDate, 'YYYY-MM-DD').format(
        'YYYY-MM-DD',
      );
      filter += `&end_date=${toDataStr}`;
    }

    if (sortData?.fromDate) {
      const fromDataStr = moment(sortData?.fromDate, 'YYYY-MM-DD').format(
        'YYYY-MM-DD',
      );
      filter += `&start_date=${fromDataStr}`;
    }

    if (sortData?.order_by && sortData?.order) {
      filter += `&order_by=${sortData?.order_by}&order=${sortData?.order}`;
    }

    dispatch(
      GetBillsListState({
        pageNum: page_num || 1,
        filter: `&status=draft${filter}`,
      }),
    );
  };

  const deleteBill = (id) => {
    setDialogDelete(false);
    dispatch(DeleteVendorBillState({ bill_id: id }));
  };

  const editbill = (id) => {
    if (!userRoles?.['Bill Booking']?.edit_bills) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    dispatch(GetVendorBillDetailsState({ bill_id: id }));
  };

  const onSortChange = (v) => {
    setSortData((s) => ({
      ...s,
      order_by: v?.click?.order_by,
      order: v?.click?.order,
      orderName: v?.name,
    }));
    setAnchorEl((prev) => ({
      ...prev,
      sort: null,
    }));
  };

  const handleValueChange = (v) => {
    const checkedList = selectVendorList?.filter((item) => item !== v);
    setSelectVendorList(checkedList);
    if (selectVendorList?.length === 1) {
      setDraftBills([]);
    }
  };

  const ViewUploadBill = (url) => {
    setViewBill(true);
    setFile(url);
  };

  const viewSingleBill = (id) => {
    dispatch(
      GetVendorBillDetailsState({
        bill_id: id,
        action: 'forViewVendorBill',
      }),
    );
  };

  const loadMore = () => {
    if (billsListData?.pages > 1) {
      getDraftBills(billsListData?.page + 1);
    }
  };

  const DeleteUploadBill = () => {
    if (!userRoles?.['Bill Booking']?.delete_bills) {
      setHavePermission({
        open: true,
        back: () => {
          setHavePermission({ open: false });
        },
      });
      return;
    }
    setDialogDelete(true);
  };

  const handleRowClick = (param) => {
    setBottomSheet(true);
    setTableDetails(param?.row);
  };

  useEffect(() => {
    return () => {
      dispatch(ClearStateGetVendorBillDetails());
      dispatch(ClearStateGetBillsList());
      dispatch(ClearSateVendorEntity());
    };
  }, []);

  useEffect(() => {
    if (vendorEntity?.data) {
      setSearchVendorList(vendorEntity.data);
      if (
        state?.search_text &&
        !desktopView &&
        selectVendorList === undefined
      ) {
        setSelectVendorList(vendorEntity?.data?.map((val) => val?.id));
      }
    }
  }, [JSON.stringify(vendorEntity || {}), state]);

  useEffect(() => {
    if (Object.keys(userPermissions?.Expense || {})?.length > 0) {
      if (!userPermissions?.Expense?.Expense) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/dashboard');
            setHavePermission({ open: false });
          },
        });
      }
      setUserRoles({ ...userPermissions?.Expense });
    }
  }, [userPermissions]);

  useEffect(() => {
    if (Object.keys(userRoles?.['Bill Booking'] || {})?.length > 0) {
      if (!userRoles?.['Bill Booking']?.view_bills) {
        setHavePermission({
          open: true,
          back: () => {
            navigate('/bill');
            setHavePermission({ open: false });
          },
        });
      }
    }
  }, [userRoles?.['Bill Booking']]);

  useEffect(() => {
    if (desktopView) {
      const temp = Array.from(
        new Set(draftBills?.map((ele) => ele?.vendor?.name)),
      )?.map((vendorName) => ({ value: vendorName, label: vendorName }));
      setValueOptionsFilter(temp);
    }
  }, [device, draftBills]);

  useEffect(() => {
    if (selectVendorList?.length > 0) {
      const checkedList = searchVendorList.filter(
        (ele) => selectVendorList.indexOf(ele.id) !== -1,
      );
      setCheckedVendorList(checkedList);
    } else if (selectVendorList?.length === 0) {
      setCheckedVendorList(selectVendorList);
    }
  }, [selectVendorList]);

  useEffect(() => {
    if (device === 'mobile' && state?.search_text) {
      setVendorQuery(state?.search_text || '');
      getVendors(state?.search_text || '', true);
    }
  }, [state?.search_text, device]);

  useEffect(() => {
    if (billsListData?.data) {
      if (billsListData?.page === 1) {
        setDraftBills(billsListData?.data);
      } else {
        setDraftBills((prev) => [...prev, ...billsListData?.data]);
      }
      if (
        billsListData?.pages > 1 &&
        billsListData?.page < billsListData?.pages &&
        desktopView
      ) {
        getDraftBills(billsListData?.page + 1);
      }
      if (!desktopView) {
        sethasMoreItems(billsListData?.page !== billsListData?.pages);
      }
    }
  }, [JSON.stringify(billsListData)]);

  useEffect(() => {
    if (
      (state?.search_text && selectVendorList?.length > 0) ||
      state?.search_text === undefined ||
      device === 'desktop'
    ) {
      getDraftBills();
    }
    return () => {};
  }, [sortData?.order, sortData?.order_by, selectVendorList, dispatch]);

  useEffect(() => {
    if (sortData?.fromDate && sortData?.toDate && device === 'mobile') {
      getDraftBills();
    }
    if (
      sortData?.fromDate === '' &&
      sortData?.toDate === '' &&
      device === 'mobile'
    ) {
      getDraftBills();
    }
  }, [sortData?.toDate, sortData?.fromDate]);

  useEffect(() => {
    if (
      device === 'mobile' &&
      selectVendorList !== undefined &&
      state?.search_text?.length > 0 &&
      selectVendorList?.length === 0
    ) {
      setVendorQuery('');
      getDraftBills();
      navigate('/bill-draft', { replace: true });
    }
  }, [device, selectVendorList]);

  useEffect(() => {
    if (state?.id || queryParam) {
      viewSingleBill(state?.id || queryParam, 'show');
    }
  }, [state?.id]);

  useEffect(() => {
    if (
      device === 'mobile' &&
      selectVendorList !== undefined &&
      state?.search_text?.length > 0 &&
      selectVendorList?.length === 0
    ) {
      navigate('/bill-draft', { replace: true });
    }
  }, [device, selectVendorList]);

  useEffect(() => {
    if (billsAction === 'vendorBillDeleted') {
      setDraftBills([]);
      setBottomSheet(false);
      dispatch(
        GetBillsListState({
          pageNum: 1,
          filter: `&status=draft`,
        }),
      );
      dispatch(ClearStateBillAction());
    }
  }, [billsAction]);

  useEffect(() => {
    if (Object.keys(VendorBillDetails || {})?.length > 0) {
      if (billsAction === 'vendorBillReterived') {
        dispatch(ClearStateBillAction());
        navigate('/bill-upload', {
          state: {
            selected: VendorBillDetails,
          },
        });
      }
      if (billsAction === 'forViewVendorBill') {
        dispatch(ClearStateBillAction());
        if (VendorBillDetails?.file_url) {
          ViewUploadBill(VendorBillDetails?.file_url);
        } else {
          setBottomSheet(true);
          setTableDetails(VendorBillDetails);
        }
      }
    }
  }, [JSON.stringify(VendorBillDetails), billsAction]);

  return (
    <>
      {desktopView ? (
        <Box className={css.draftbillsdesktop}>
          <Typography className={css.tilecont}>Draft Bills</Typography>

          <DataGridPremium
            rows={draftBills}
            columns={draftBillsColumn}
            density="compact"
            // getRowHeight={() => 'auto'}
            rowHeight={60}
            columnHeaderHeight={80}
            disableChildrenSorting
            disableColumnResize
            disableColumnReorder
            hideFooter
            disableRowSelectionOnClick
            disableColumnPinning
            disableRowGrouping
            disableAggregation
            onRowClick={handleRowClick}
            initialState={{
              filter: {
                filterModel: {
                  items: [],
                  quickFilterValues: [state?.search_text],
                },
              },
            }}
            components={{
              Toolbar: CustomToolbar,
              NoRowsOverlay: () => (
                <Stack
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  No Data Found
                </Stack>
              ),
              LoadingOverlay: InvoiceLoadingSkeleton,
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            loading={billsDataLoad === null}
            sx={{
              background: '#fff',
              borderRadius: '16px',
              border: 'none',
              marginTop: '16px',
              // '& .MuiDataGrid-columnHeaders': {
              //   background: '#F5F5F5',
              // },
              '& .MuiDataGrid-virtualScrollerContent': {
                height: 'calc(100vh - 246px) !important',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'break-spaces',
                textAlign: 'center',
                lineHeight: '20px',
                fontFamily: "'Lexend', sans-serif !important",
                fontWeight: '500 !important',
                fontSize: '14px',
              },
              '& .MuiDataGrid-row': {
                cursor: 'pointer !important',
                padding: '4px 0px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.10)',
              },
              '& .MuiDataGrid-cell': {
                fontFamily: "'Lexend', sans-serif !important",
                fontWeight: '400 !important',
                fontSize: '13px',
              },
              '.MuiDataGrid-cell-vendor': {
                fontFamily: "'Lexend', sans-serif !important",
                fontWeight: '500 !important',
                fontSize: '13px',
              },
              '& .left-align--header': {
                '.MuiDataGrid-columnHeaderDraggableContainer': {
                  flexDirection: 'row !important',
                },
                '.MuiDataGrid-columnHeaderTitleContainer': {
                  flexDirection: 'row !important',
                },
                textAlign: 'left',
              },
              '& .MuiDataGrid-columnSeparator': { display: 'none' },
            }}
          />
        </Box>
      ) : (
        <div className={`${css.draftBills} ${css.draftBillsMob}`}>
          <p className={css.draftTitleMob}>Draft Bills</p>

          <div className={`${css.secondRow} ${css.secondRowMob}`}>
            <div className={`${css.firstSet} ${css.firstSetMob}`}>
              <Chip
                label="Date"
                icon={<KeyboardArrowDown />}
                onClick={(event) => {
                  setAnchorEl((prev) => ({
                    ...prev,
                    date: event.currentTarget,
                  }));
                }}
                sx={{
                  '& .MuiChip-label': {
                    paddingLeft: 0,
                  },
                }}
                className={classes.chips}
              />
              <Chip
                label="Vendor"
                icon={<KeyboardArrowDown />}
                onClick={(event) => {
                  setAnchorEl((prev) => ({
                    ...prev,
                    vendor: event.currentTarget,
                  }));
                }}
                sx={{
                  '& .MuiChip-label': {
                    paddingLeft: 0,
                  },
                }}
                className={classes.chips}
              />

              <Chip
                label="Sort by"
                icon={<KeyboardArrowDown />}
                onClick={(event) => {
                  setAnchorEl((prev) => ({
                    ...prev,
                    sort: event.currentTarget,
                  }));
                }}
                sx={{
                  '& .MuiChip-label': {
                    paddingLeft: 0,
                  },
                }}
                className={classes.chips}
              />
            </div>

            {(selectVendorList?.length > 0 ||
              (sortData?.order && sortData?.order_by) ||
              (sortData?.fromDate && sortData?.toDate)) && (
              <div className={css.selectedOptions3Mob}>
                {sortData?.order && sortData?.order_by && (
                  <Chip
                    className={classes.selectedchips}
                    label={sortData?.orderName}
                    variant="outlined"
                    onDelete={() => {
                      setSortData((prev) => ({
                        ...prev,
                        order: '',
                        order_by: '',
                        orderName: '',
                      }));
                      setDraftBills([]);
                    }}
                  />
                )}

                {sortData?.fromDate && sortData?.toDate && (
                  <Chip
                    className={classes.selectedchips}
                    label={`${moment(sortData.fromDate, 'YYYY-MM-DD').format(
                      'MMM DD',
                    )} - ${moment(sortData.toDate, 'YYYY-MM-DD').format(
                      'MMM DD, YYYY',
                    )}`}
                    variant="outlined"
                    onDelete={() => {
                      setSortData((prev) => ({
                        ...prev,
                        fromDate: '',
                        toDate: '',
                      }));
                      setDraftBills([]);
                    }}
                  />
                )}
                {checkedVendorList?.length >= 1 &&
                  checkedVendorList?.map((a) => {
                    return (
                      <Chip
                        className={classes.selectedchips}
                        label={a?.name || '-'}
                        key={a?.id}
                        variant="outlined"
                        onDelete={() => {
                          handleValueChange(a?.id, false);
                        }}
                      />
                    );
                  })}
              </div>
            )}
          </div>

          <InfiniteScroll
            dataLength={draftBills?.length}
            next={() => loadMore()}
            hasMore={hasMoreItems}
            scrollableTarget="tableContainerDraftBills"
          >
            <div
              className={css.draftMobCard}
              style={{
                maxHeight:
                  selectVendorList?.length > 0 ||
                  (sortData?.fromDate && sortData?.toDate) ||
                  (sortData?.order_by && sortData?.order)
                    ? 'calc(100vh - 300px)'
                    : 'calc(100vh - 250px)',
              }}
              id="tableContainerDraftBills"
            >
              {draftBills?.map((item) => (
                <div className={css.cardDetail} key={item?.id}>
                  <div
                    className={css.firstSet}
                    onClick={() => {
                      setBottomSheet(true);
                      setTableDetails(item);
                    }}
                  >
                    <p className={css.vendorName}>
                      {item?.vendor
                        ? item?.vendor?.name?.toLowerCase()
                        : (item?.new_vendor &&
                            item?.new_vendor?.name?.toLowerCase()) ||
                          '-'}
                    </p>
                    <div className={css.innerFirst}>
                      <p className={css.key}>Bill Number</p>
                      <p className={css.value}>{item?.document_number}</p>
                    </div>
                    <div className={css.innerFirst}>
                      <p className={css.key}>Taxable Value</p>
                      <p className={css.value}>
                        {FormattedAmount(item?.amount)}
                      </p>
                    </div>
                  </div>
                  <div className={css.secondSet}>
                    <div
                      onClick={() => {
                        setTableDetails(item);
                        DeleteUploadBill();
                      }}
                    >
                      <img src={deleteBin} alt="delete" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!billsDataLoad && <MobileCardLoadingSkeleton NumCard={6} />}
            {billsListData?.data?.length === 0 &&
              billsDataLoad === 'dataLoad' && (
                <Typography align="center" my="16px">
                  No Bill Found.
                </Typography>
              )}
          </InfiniteScroll>
        </div>
      )}

      <SelectBottomSheet
        open={anchorEl?.vendor}
        onClose={() => setAnchorEl((prev) => ({ ...prev, vendor: null }))}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <EntityFilter
          EntityType="vendor"
          listSelection={checkedVendorList || []}
          handleSelection={(val) =>
            setSelectVendorList(val?.map((ele) => ele?.id))
          }
          stateSearchText={state?.search_text && vendorQuery}
          setMainSearchQuery={state?.search_text && setVendorQuery}
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        open={anchorEl?.date}
        onClose={() => setAnchorEl((prev) => ({ ...prev, date: null }))}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <DateFilter
          Title="Select Start & End Date"
          listSelection={{
            startDate: sortData?.fromDate,
            endDate: sortData?.toDate,
          }}
          handleSelection={(val) =>
            setSortData((prev) => ({
              ...prev,
              fromDate: val?.startDate,
              toDate: val?.endDate,
            }))
          }
        />
      </SelectBottomSheet>

      <SelectBottomSheet
        open={Boolean(anchorEl.sort)}
        addNewSheet
        onClose={() => {
          setAnchorEl((prev) => ({ ...prev, sort: null }));
        }}
        triggerComponent={<div style={{ display: 'none' }} />}
      >
        {device === 'mobile' && <Puller />}
        <Box padding="36px 20px 20px">
          <Typography className={css.headertext}>Sort</Typography>
        </Box>
        {sortOptions.map((data) => (
          <MenuItem
            key={data?.id}
            value={data?.id}
            onClick={() => {
              onSortChange(data);
            }}
            className={classes.menutext}
            style={{
              background: sortData?.orderName === data?.name && '#f08b3250',
            }}
          >
            {data?.name}
          </MenuItem>
        ))}
      </SelectBottomSheet>

      <SelectBottomSheet
        name="draftBills"
        addNewSheet
        triggerComponent={<></>}
        open={BottomSheet}
        onTrigger={() => setBottomSheet(true)}
        onClose={() => {
          setBottomSheet(false);
        }}
      >
        {device === 'mobile' && <Puller />}
        <div className={css.draftOpenSheet}>
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '10px 0',
              }}
            >
              {/* <p className={css.documentTitle}>{e?.document_number}</p> */}
              <div
                className={css.fields}
                style={{
                  padding: device === 'mobile' ? '6px 0' : '12px 0',
                }}
              >
                <p className={css.leftFields}>Bill Number</p>
                <p className={css.rightFields}>
                  {tableDetails?.document_number}
                </p>
              </div>
              {tableDetails?.file_url && device === 'desktop' && (
                <div
                  onClick={() => {
                    ViewUploadBill(tableDetails?.file_url);
                  }}
                >
                  <p className={css.viewInvoice}>View Bill</p>
                </div>
              )}

              {device === 'mobile' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  {tableDetails?.file_url && (
                    <Grid
                      onClick={() => {
                        ViewUploadBill(tableDetails?.file_url);
                      }}
                    >
                      <img
                        src={viewYourBills}
                        className={css.editButton}
                        alt="viewYourbills"
                      />{' '}
                    </Grid>
                  )}
                  <Grid
                    onClick={() => {
                      editbill(tableDetails?.id);
                    }}
                  >
                    <img
                      src={editYourBills}
                      className={css.editButton}
                      alt="editYourBills"
                    />{' '}
                  </Grid>
                </div>
              )}
            </div>
            <div>
              {[
                {
                  name: 'Vendor',
                  value: tableDetails?.vendor
                    ? tableDetails?.vendor?.name?.toLowerCase()
                    : (tableDetails?.new_vendor &&
                        tableDetails?.new_vendor?.name?.toLowerCase()) ||
                      '-',
                },
                {
                  name: 'Taxable Value',
                  value: FormattedAmount(tableDetails?.amount),
                },
                {
                  name: 'Expense Category',
                  value: tableDetails?.expense_account
                    ? tableDetails?.expense_account?.name
                    : '-',
                },
                {
                  name: 'Payment Mode',
                  value:
                    tableDetails?.payment_mode === 'personal'
                      ? `${
                          paymentStatusListWithBill?.find(
                            (v) => v.id === tableDetails?.payment_mode,
                          )?.label
                        } ${tableDetails?.payer_details?.name || ''}` ||
                        tableDetails?.payment_mode ||
                        '-'
                      : paymentStatusListWithBill?.find(
                          (v) => v.id === tableDetails?.payment_mode,
                        )?.label ||
                        tableDetails?.payment_mode ||
                        '-',
                },
                { name: 'Location', value: '-' },
                {
                  name: 'TDS',
                  value: FormattedAmount(tableDetails?.tds_amount),
                },
                {
                  name: 'Description',
                  value: tableDetails?.description || '-',
                },
              ]?.map((val) => (
                <div
                  className={css.fields}
                  style={{
                    padding: device === 'mobile' ? '6px 0' : '12px 0',
                  }}
                >
                  <p className={css.leftFields}>{val.name}</p>
                  <p className={css.rightFields}>{val.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={css.finalButtonDiv}>
            {device === 'desktop' && (
              <div className={css.firstRow}>
                <div className={css.delete} onClick={() => DeleteUploadBill()}>
                  <p>Delete</p>
                </div>
                <div
                  className={css.continue}
                  onClick={() => {
                    editbill(tableDetails?.id);
                  }}
                >
                  <p>Edit bill</p>
                </div>
              </div>
            )}
            {/* <div className={css.lastRow}>
              <p>Record This Expense</p>
            </div> */}
          </div>
        </div>
      </SelectBottomSheet>

      <SelectBottomSheet
        open={dialogDelete && device === 'mobile'}
        addNewSheet
        onClose={() => {
          setDialogDelete(false);
        }}
        triggerComponent={<span style={{ display: 'none' }} />}
      >
        {device === 'mobile' && <Puller />}
        <Grid className={css.deleteMainDiv}>
          <Grid>
            <Typography className={css.deletetitle}>Heads Up !</Typography>

            <Divider className={css.deleteDivider} variant="fullWidth" />
          </Grid>
          <Grid className={css.deleteDescription}>
            {' '}
            Are you sure that you want to delete this Bill?
          </Grid>
          <Stack direction="row" className={css.buttonWidth}>
            <Button
              className={css.CancelButton}
              onClick={() => {
                setDialogDelete(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className={css.submitButton}
              onClick={() => {
                deleteBill(tableDetails?.id);
              }}
            >
              Confirm
            </Button>
          </Stack>
        </Grid>
      </SelectBottomSheet>

      <Dialog
        PaperProps={{
          elevation: 3,
          style: {
            width: '86%',
            // position: 'absolute',

            overflow: 'visible',
            borderRadius: 16,
            cursor: 'pointer',
          },
        }}
        open={dialogDelete && device === 'desktop'}
        onClose={() => setDialogDelete(false)}
      >
        <DialogContent>
          <Grid
          // className={css.deleteMainDiv}
          >
            <Grid>
              <Typography className={css.deletetitle}>Heads Up !</Typography>

              <Divider className={css.deleteDivider} variant="fullWidth" />
            </Grid>
            <Grid className={css.deleteDescriptionDesktop}>
              {' '}
              Are your sure that you want to delete this bill?
            </Grid>
            <Grid className={css.deleteDescriptionDesktop2}>
              {' '}
              Please note that all data associated with this bill will be
              permanently deleted
            </Grid>
            <Stack direction="row" className={css.buttonWidth}>
              <Button
                className={css.CancelButton}
                onClick={() => {
                  setDialogDelete(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className={css.submitButton}
                onClick={() => {
                  deleteBill(tableDetails?.id);
                }}
              >
                Confirm
              </Button>
            </Stack>
          </Grid>
        </DialogContent>
      </Dialog>

      {viewBill && (
        <BillViewDialog file_url={file} onClose={() => setViewBill(false)} />
      )}
      {havePermission.open && (
        <PermissionDialog onClose={() => havePermission.back()} />
      )}
    </>
  );
};

export default DraftBills;
