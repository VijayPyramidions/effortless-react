import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  GetInvoiceGeneratedEWayBillsState,
  ClearStateInvoiceGeneratedEWayBills,
} from '@action/Store/Reducers/Invoice/InvoiceEWayBillState';

import {
  Box,
  Stack,
  Avatar,
  Typography,
  CircularProgress,
  Chip,
  MenuItem,
} from '@mui/material';
import { makeStyles, styled } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/HighlightOff';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  DataGridPremium,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
  // GridColDef,
} from '@mui/x-data-grid-premium';

import SelectBottomSheet from '@components/SelectBottomSheet/SelectBottomSheet';
import {
  EntityFilter,
  DateFilter,
} from '../../../components/MobileSheetFilters/SheetFilter';

import { InvoiceDialogView } from '../../../components/InvoiceBilDialog/InvoiceBillDialogView';
import {
  InvoiceLoadingSkeleton,
  MobileInvoiceLoadingSkeleton,
} from '../../../components/SkeletonLoad/SkeletonLoader';

import * as css from './EWayBillStyle.scss';

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
  selectedchips: {
    maxWidth: '190px !important',
    background: '#fdf1e6 !important',
    color: '#F08B32 !important',
    border: `1px solid #F08B32 !important`,
    borderRadius: '25px !important',
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

const EWAYBILL_STATUS = [
  { text: 'Approved', payload: 'approved' },
  { text: 'Pending', payload: 'pending' },
  { text: 'Vehicle Updated', payload: 'vehicle_updated' },
  { text: 'Vehicle Updating', payload: 'vehicle_updating' },
  { text: 'Cancelled', payload: 'cancelled' },
  { text: 'Cancelling', payload: 'cancelling' },
  { text: 'Approval Failed', payload: 'approval_failed' },
];

const EWAYBILL_TYPE = [
  { text: 'Road', payload: 'road' },
  { text: 'Rail', payload: 'rail' },
  { text: 'Ship', payload: 'ship' },
  { text: 'Air', payload: 'air' },
];

const GeneratedEWayBill = () => {
  const classes = useStyles();
  const device = localStorage.getItem('device_detect');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { InvoiceGeneratedEWayBillsState, GeneratedEWayBillsLoad } =
    useSelector((value) => value.InvoiceEWayBill);

  const [invoiceAction, setInvoiceAction] = useState({});
  const [valueOptionsFilter, setValueOptionsFilter] = useState([]);
  const [GeneratedEWayBillData, setGeneratedEWayBillData] = useState([]);
  const [hasMoreItems, sethasMoreItems] = useState(true);
  const [drawer, setDrawer] = useState({});
  const [SelectedCustomerList, setSelectedCustomerList] = useState([]);
  const [SelectedDate, setSelectedDate] = useState({
    startDate: null,
    endDate: null,
  });
  const [SelectedType, setSelectedType] = useState({});
  const [SelectedStatus, setSelectedStatus] = useState({});

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

  const handleClick = (name, action) => {
    setDrawer((prev) => ({ ...prev, [name]: action }));
  };

  const ShowFilter = (check) => {
    if (
      SelectedCustomerList?.length > 0 &&
      (check === 'all' || check === 'customer')
    ) {
      return true;
    }
    if (
      SelectedDate?.startDate &&
      SelectedDate?.endDate &&
      (check === 'all' || check === 'date')
    ) {
      return true;
    }
    if (
      Object?.keys(SelectedType || {})?.length > 0 &&
      (check === 'all' || check === 'type')
    ) {
      return true;
    }
    if (
      Object?.keys(SelectedStatus || {})?.length > 0 &&
      (check === 'all' || check === 'status')
    ) {
      return true;
    }
    return false;
  };

  const handleFilterClose = (name, id) => {
    if (name === 'customer') {
      setSelectedCustomerList(
        SelectedCustomerList?.filter((val) => val?.id !== id)
      );
    } else if (name === 'date') {
      setSelectedDate({
        startDate: null,
        endDate: null,
      });
    } else if (name === 'type') {
      setSelectedType({});
    } else if (name === 'status') {
      setSelectedStatus({});
    }
  };

  const FetchEWayBill = (page_num) => {
    let filter = '';
    if (SelectedCustomerList && SelectedCustomerList?.length === 1) {
      filter += `customer_id=${SelectedCustomerList[0]?.id || ''}`;
    } else if (SelectedCustomerList && SelectedCustomerList.length > 1) {
      SelectedCustomerList.forEach((v) => {
        filter += `customer_ids[]=${v?.id}&`;
      });
    }
    const param = {
      filterCustomer: filter,
      fromDate:
        SelectedDate?.startDate && SelectedDate?.endDate
          ? moment(SelectedDate?.startDate).format('YYYY-MM-DD')
          : '',
      toDate:
        SelectedDate?.startDate && SelectedDate?.endDate
          ? moment(SelectedDate?.endDate).format('YYYY-MM-DD')
          : '',
      typeFilter: SelectedType?.payload,
      statusFilter: SelectedStatus?.payload || '',
    };
    dispatch(
      GetInvoiceGeneratedEWayBillsState({
        numPage: page_num || 1,
        ...param,
      })
    );
  };

  const GeneratedEWayBillColumn = [
    {
      field: 'invoice_number',
      headerName: 'Invoice No',
      renderCell: (params) => {
        return (
          <div
            onClick={() => {
              if (params?.row?.invoice_id) {
                setInvoiceAction({
                  open: true,
                  id: params?.row?.invoice_id,
                  name: params.row?.invoice_number,
                });
              }
            }}
          >
            <p
              style={{
                whiteSpace: 'nowrap',
                color: params.row?.invoice_id ? '#1F4FB9' : '#000',
                cursor: params.row?.invoice_id && 'pointer',
              }}
            >
              {params.row?.invoice_number}
            </p>
          </div>
        );
      },
      sortable: false,
    },
    {
      field: 'customer_name',
      headerName: 'Customer',
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center">
            <Avatar className={css.avatar}>
              {params.row?.customer_name[0]}
            </Avatar>
            <p style={{ whiteSpace: 'break-spaces' }}>
              {params.row?.customer_name}
            </p>
          </Stack>
        );
      },
      sortable: false,
      type: 'singleSelect',
      valueOptions: valueOptionsFilter,
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (params) => {
        return (
          <p style={{ whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
            {params.row?.status?.split('_')?.join(' ')}
          </p>
        );
      },
      sortable: false,
      width: 150,
    },
    {
      field: 'transporter_name',
      headerName: 'Transporter',
      renderCell: (params) => {
        return (
          <p style={{ whiteSpace: 'nowrap' }}>{params.row?.transporter_name}</p>
        );
      },
      sortable: false,
      align: 'right',
      width: 105,
    },
    {
      field: 'number',
      headerName: 'E-Way Bill No',
      renderCell: (params) => {
        return (
          <p style={{ whiteSpace: 'nowrap' }}>{params.row?.number || '-'}</p>
        );
      },
      sortable: false,
      align: 'right',
      width: 110,
    },
    {
      field: 'date',
      headerName: 'E-Way Bill - Date',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) => moment(params.row?.date).format('DD-MM-YYYY'),
      sortable: false,
      align: 'right',
      width: 135,
    },
    {
      field: 'expires_at',
      headerName: 'Expiry Date',
      type: 'date',
      valueGetter: (params) => moment(params?.value).toDate(),
      renderCell: (params) =>
        params.row?.expires_at
          ? moment(params.row?.expires_at).format('DD-MM-YYYY')
          : '-',
      sortable: false,
      align: 'right',
      width: 105,
    },
  ];

  const loadMore = () => {
    if (InvoiceGeneratedEWayBillsState?.pages > 1) {
      FetchEWayBill(InvoiceGeneratedEWayBillsState?.page + 1);
    }
  };

  const handleClickRow = (params) => {
    if (params?.field === 'invoice_number') {
      return;
    }
    const { row } = params;
    navigate('/invoice-e-waybill-pdf', {
      state: {
        EWayBillResponse: row,
        from: 'generated_e_way_bill',
      },
    });
  };

  useEffect(() => {
    if (InvoiceGeneratedEWayBillsState?.data) {
      if (InvoiceGeneratedEWayBillsState?.page === 1) {
        setGeneratedEWayBillData(InvoiceGeneratedEWayBillsState?.data);
      } else {
        setGeneratedEWayBillData((prev) => [
          ...prev,
          ...InvoiceGeneratedEWayBillsState?.data,
        ]);
      }
      if (
        InvoiceGeneratedEWayBillsState?.pages > 1 &&
        InvoiceGeneratedEWayBillsState?.page <
          InvoiceGeneratedEWayBillsState?.pages &&
        device === 'desktop'
      ) {
        dispatch(
          GetInvoiceGeneratedEWayBillsState({
            numPage: InvoiceGeneratedEWayBillsState?.page + 1,
          })
        );
      }
      if (device === 'mobile') {
        sethasMoreItems(
          InvoiceGeneratedEWayBillsState?.page !==
            InvoiceGeneratedEWayBillsState?.pages
        );
      }
    }
  }, [JSON.stringify(InvoiceGeneratedEWayBillsState)]);

  useEffect(() => {
    // dispatch(
    //   GetInvoiceGeneratedEWayBillsState({
    //     numPage: 1,
    //   })
    // );
    FetchEWayBill();
    return () => {
      dispatch(ClearStateInvoiceGeneratedEWayBills());
    };
  }, [SelectedCustomerList, SelectedDate, SelectedStatus, SelectedType]);

  useEffect(() => {
    if (device === 'desktop') {
      const temp = Array.from(
        new Set(GeneratedEWayBillData?.map((invoice) => invoice?.customer_name))
      )?.map((customerName) => ({ value: customerName, label: customerName }));
      setValueOptionsFilter(temp);
    }
  }, [device, GeneratedEWayBillData]);

  return (
    <>
      {device === 'desktop' ? (
        <Box
          className={css.generatedewaybilldesktop}
          sx={{
            '& .left-align--header': {
              '.MuiDataGrid-columnHeaderDraggableContainer': {
                flexDirection: 'row !important',
              },
              '.MuiDataGrid-columnHeaderTitleContainer': {
                flexDirection: 'row !important',
              },
              textAlign: 'left',
            },
          }}
        >
          <Typography component="p" className={css.toptext}>
            E-Way Bills
          </Typography>

          <DataGridPremium
            rows={GeneratedEWayBillData}
            columns={GeneratedEWayBillColumn}
            density="compact"
            getRowHeight={() => 'auto'}
            rowHeight={60}
            disableColumnMenu
            disableChildrenSorting
            disableColumnResize
            disableColumnReorder
            hideFooter
            disableRowSelectionOnClick
            onCellClick={handleClickRow}
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
            loading={GeneratedEWayBillsLoad === null}
            sx={{
              background: '#fff',
              borderRadius: '0px',
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                background: '#F5F5F5',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'break-spaces',
                textAlign: 'center',
                lineHeight: '20px',
                fontFamily: "'Lexend', sans-serif !important",
                fontWeight: '400 !important',
                fontSize: '13px',
              },
              '& .MuiDataGrid-row': {
                cursor: 'pointer !important',
                padding: '4px 0',
              },
              '& .MuiDataGrid-cell': {
                fontFamily: "'Lexend', sans-serif !important",
                fontWeight: '300 !important',
                fontSize: '13px',
              },
              '& .MuiDataGrid-columnSeparator': { display: 'none' },
            }}
          />
        </Box>
      ) : (
        <>
          <Stack
            padding="16px 20px"
            direction="row"
            gap="12px"
            sx={{
              width: 'calc(100% - 40px)',
              overflow: 'auto',
              background: '#fff',
            }}
          >
            <Chip
              label="Customer"
              variant="outlined"
              deleteIcon={<KeyboardArrowDownIcon />}
              onClick={() => handleClick('customersheet', true)}
              onDelete={() => handleClick('customersheet', true)}
            />
            <Chip
              label="Date"
              variant="outlined"
              deleteIcon={<KeyboardArrowDownIcon />}
              onClick={() => handleClick('datesheet', true)}
              onDelete={() => handleClick('datesheet', true)}
            />
            <Chip
              label="Type"
              variant="outlined"
              deleteIcon={<KeyboardArrowDownIcon />}
              onClick={() => handleClick('typesheet', true)}
              onDelete={() => handleClick('typesheet', true)}
            />
            <Chip
              label="Status"
              variant="outlined"
              deleteIcon={<KeyboardArrowDownIcon />}
              onClick={() => handleClick('statussheet', true)}
              onDelete={() => handleClick('statussheet', true)}
            />
          </Stack>

          {ShowFilter('all') && (
            <Stack
              padding="0 16px 16px 20px"
              direction="row"
              gap="12px"
              sx={{
                width: 'calc(100% - 40px)',
                overflow: 'auto',
                background: '#fff',
              }}
            >
              {ShowFilter('customer') &&
                SelectedCustomerList?.map((val) => (
                  <Chip
                    label={val?.short_name}
                    variant="outlined"
                    deleteIcon={<CloseIcon />}
                    onDelete={() => handleFilterClose('customer', val?.id)}
                    className={classes.selectedchips}
                  />
                ))}
              {ShowFilter('date') && (
                <Chip
                  label={`${moment(SelectedDate?.startDate).format(
                    'MMM DD'
                  )} - ${moment(SelectedDate?.endDate).format('MMM DD, YYYY')}`}
                  variant="outlined"
                  deleteIcon={<CloseIcon />}
                  onDelete={() => handleFilterClose('date')}
                  className={classes.selectedchips}
                />
              )}
              {ShowFilter('type') && (
                <Chip
                  label={SelectedType?.text}
                  variant="outlined"
                  deleteIcon={<CloseIcon />}
                  onDelete={() => handleFilterClose('type')}
                  className={classes.selectedchips}
                />
              )}
              {ShowFilter('status') && (
                <Chip
                  label={SelectedStatus?.text}
                  variant="outlined"
                  deleteIcon={<CloseIcon />}
                  onDelete={() => handleFilterClose('status')}
                  className={classes.selectedchips}
                />
              )}
            </Stack>
          )}
          {GeneratedEWayBillsLoad === null && (
            <div
              style={{
                overflowX: 'hidden',
                overflowY: 'auto',
                height: 'calc(100vh - 250px)',
              }}
            >
              <MobileInvoiceLoadingSkeleton />
            </div>
          )}

          {GeneratedEWayBillsLoad !== null &&
            GeneratedEWayBillData?.length === 0 && (
              <p style={{ textAlign: 'center' }}>No Data Found.</p>
            )}

          {GeneratedEWayBillsLoad !== null &&
            GeneratedEWayBillData?.length > 0 && (
              <div
                style={{
                  overflow: 'auto',
                  height: ShowFilter('all')
                    ? 'calc(100vh - 340px)'
                    : 'calc(100vh - 300px)',
                }}
                id="draftContent"
                className={css.tobegeneratedmobile}
              >
                <InfiniteScroll
                  dataLength={GeneratedEWayBillData?.length}
                  next={() => loadMore()}
                  scrollThreshold="20px"
                  hasMore={hasMoreItems}
                  loader={
                    <div style={{ display: 'flex' }}>
                      <CircularProgress
                        style={{ color: '#F08B32', margin: 'auto' }}
                      />
                    </div>
                  }
                  scrollableTarget="draftContent"
                >
                  <div className={css.generatedewaybillmobile}>
                    {GeneratedEWayBillData?.map((val) => (
                      <Box
                        className={css.generatedewaybillbox}
                        onClick={() => handleClickRow({ row: val })}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          width="100%"
                          gap="4%"
                        >
                          <p className={css.customername}>
                            {val?.customer_name}
                          </p>{' '}
                          <Box
                            sx={{
                              padding: '2px 8px',
                              background: '#99BFD3',
                              borderRadius: '2px',
                              width: '15%',
                            }}
                          >
                            <p className={css.traveltype}>
                              {
                                // val?.transportation_details?.find(
                                //   (data) => data?.active
                                // )?.mode
                                val?.transportation_details?.reduce(
                                  (maxObj, currentObj) =>
                                    currentObj?.position > maxObj?.position
                                      ? currentObj
                                      : maxObj,
                                  { position: -Infinity }
                                )?.mode || '-'
                              }
                            </p>
                          </Box>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          width="100%"
                          gap="2%"
                        >
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              if (val?.invoice_id) {
                                setInvoiceAction({
                                  open: true,
                                  id: val?.invoice_id,
                                  name: val?.invoice_number,
                                });
                              }
                            }}
                            style={{ width: '20%' }}
                          >
                            <p
                              style={{
                                color: val?.invoice_id ? '#1F4FB9' : '#000',
                              }}
                              className={css.invoicenumber}
                            >
                              {val?.invoice_number}
                            </p>
                          </div>
                          <p className={css.invoicedate}>
                            Bill Date-
                            {val?.date}
                          </p>
                          <p className={css.invoicedate}>
                            Expiry-
                            {val?.expires_at &&
                              moment(val?.expires_at).format('DD-MM-YYYY')}
                          </p>
                        </Stack>
                      </Box>
                    ))}
                  </div>
                </InfiniteScroll>
              </div>
            )}
        </>
      )}
      {invoiceAction?.open && (
        <InvoiceDialogView
          invoiceAction={invoiceAction}
          setInvoiceAction={setInvoiceAction}
        />
      )}
      <SelectBottomSheet
        open={drawer?.customersheet}
        onClose={() => handleClick('customersheet', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <EntityFilter
          EntityType="customer"
          listSelection={SelectedCustomerList}
          handleSelection={(val) => setSelectedCustomerList(val)}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        open={drawer?.datesheet}
        onClose={() => handleClick('datesheet', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        <DateFilter
          Title="Select Start & End Date"
          listSelection={SelectedDate}
          handleSelection={(val) => setSelectedDate(val)}
        />
      </SelectBottomSheet>
      <SelectBottomSheet
        open={drawer?.typesheet}
        onClose={() => handleClick('typesheet', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        {device === 'mobile' && <Puller />}
        <Box padding="36px 20px 20px">
          <p className={css.headertext}>Select Type</p>
        </Box>
        {EWAYBILL_TYPE.map((data) => (
          <MenuItem
            key={data?.payload}
            value={data?.payload}
            onClick={() => {
              setSelectedType(data);
              handleClick('typesheet', false);
            }}
            className={classes.menutext}
            sx={{
              background:
                SelectedType?.payload === data?.payload && '#f08b3250',
            }}
          >
            {data?.text}
          </MenuItem>
        ))}
      </SelectBottomSheet>
      <SelectBottomSheet
        open={drawer?.statussheet}
        onClose={() => handleClick('statussheet', false)}
        triggerComponent={<div style={{ display: 'none' }} />}
        addNewSheet
      >
        {device === 'mobile' && <Puller />}
        <Box padding="36px 20px 20px">
          <p className={css.headertext}>Select Status</p>
        </Box>
        {EWAYBILL_STATUS.map((data) => (
          <MenuItem
            key={data?.payload}
            value={data?.payload}
            onClick={() => {
              setSelectedStatus(data);
              handleClick('statussheet', false);
            }}
            className={classes.menutext}
            sx={{
              background:
                SelectedStatus?.payload === data?.payload && '#f08b3250',
            }}
          >
            {data?.text}
          </MenuItem>
        ))}
      </SelectBottomSheet>
    </>
  );
};

export default GeneratedEWayBill;
